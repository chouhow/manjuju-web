import { useState, useRef } from 'react'
import { Button, Upload, Tooltip, message } from 'antd'
import { Send, Paperclip, Image as ImageIcon, Square, Loader2, Library, Palette, X } from 'lucide-react'
import { useChatStore } from '@/stores/chatStore'
import { conversationApi } from '@/api/conversation'
import type { AssetReference } from '@/types/message'
import type { SelectedStyle } from '@/types/style'
import StylePickerModal from './StylePickerModal'
import AssetReferencePicker from './AssetReferencePicker'

interface Props {
  onSend: (text: string, references?: AssetReference[]) => void
  onStop: () => void
  isLoading: boolean
  isStreaming: boolean
  selectedStyle?: SelectedStyle | null
  onStyleChange?: (style: SelectedStyle | null) => void
}

function createTagNode(ref: AssetReference): HTMLSpanElement {
  const span = document.createElement('span')
  span.className =
    'asset-tag inline-flex items-center gap-1 bg-indigo-100 text-indigo-700 text-xs px-2 py-0.5 rounded-full mx-0.5 align-middle cursor-default select-none'
  span.contentEditable = 'false'
  span.dataset.type = ref.type
  span.dataset.uid = ref.uid
  span.dataset.source = ref.source
  span.dataset.name = ref.name
  span.dataset.url = ref.url || ''
  span.dataset.summary = ref.summary || ''

  const typeLabel = ref.type === 'character' ? '角色' : ref.type === 'scene' ? '场景' : ref.type
  const sourceIcon = ref.source === 'asset_library' ? '📚' : '📁'
  span.innerHTML = `<span>${sourceIcon}</span><span>${typeLabel}:${ref.name}</span>`
  return span
}

function extractContent(editor: HTMLDivElement): { text: string; references: AssetReference[] } {
  let text = ''
  const references: AssetReference[] = []

  const walk = (node: Node) => {
    node.childNodes.forEach((child) => {
      if (child.nodeType === Node.TEXT_NODE) {
        text += child.textContent
      } else if (child.nodeType === Node.ELEMENT_NODE) {
        const el = child as HTMLElement
        if (el.tagName === 'BR') {
          text += '\n'
        } else if (el.classList.contains('asset-tag')) {
          references.push({
            type: el.dataset.type!,
            source: el.dataset.source as 'asset_library' | 'project',
            uid: el.dataset.uid!,
            name: el.dataset.name!,
            url: el.dataset.url || undefined,
            summary: el.dataset.summary || undefined,
          })
          text += `【${el.dataset.type}:${el.dataset.name}】`
        } else {
          walk(child)
        }
      }
    })
  }

  walk(editor)
  return { text: text.trim(), references }
}

export default function ChatInput({ onSend, onStop, isLoading, isStreaming, selectedStyle, onStyleChange }: Props) {
  const [pickerOpen, setPickerOpen] = useState(false)
  const [stylePickerOpen, setStylePickerOpen] = useState(false)
  const [isEmpty, setIsEmpty] = useState(true)
  const [pendingFile, setPendingFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const editorRef = useRef<HTMLDivElement>(null)
  const { currentConversationId } = useChatStore()

  const checkEmpty = () => {
    const editor = editorRef.current
    if (!editor) return
    const hasText = !!editor.textContent?.trim()
    const hasTags = editor.querySelectorAll('.asset-tag').length > 0
    setIsEmpty(!hasText && !hasTags)
  }

  const insertTag = (ref: AssetReference) => {
    const editor = editorRef.current
    if (!editor) return

    const selection = window.getSelection()
    if (!selection || selection.rangeCount === 0) {
      // 无焦点，追加到末尾
      editor.appendChild(createTagNode(ref))
      editor.appendChild(document.createTextNode('\u00A0'))
      checkEmpty()
      return
    }

    const range = selection.getRangeAt(0)
    if (!editor.contains(range.commonAncestorContainer)) {
      // 选区不在编辑器内，追加到末尾
      editor.appendChild(createTagNode(ref))
      editor.appendChild(document.createTextNode('\u00A0'))
      checkEmpty()
      return
    }

    range.deleteContents()
    const tag = createTagNode(ref)
    range.insertNode(tag)

    // 光标移到 tag 后面，并插入一个不换行空格
    range.setStartAfter(tag)
    range.setEndAfter(tag)
    const space = document.createTextNode('\u00A0')
    range.insertNode(space)
    range.setStartAfter(space)
    range.setEndAfter(space)

    selection.removeAllRanges()
    selection.addRange(range)
    checkEmpty()
  }

  const handleAddReferences = (newRefs: AssetReference[]) => {
    const editor = editorRef.current
    if (!editor) return

    // 去重：已存在的 uid 不重复插入
    const existingUids = new Set(
      Array.from(editor.querySelectorAll('.asset-tag')).map(
        (el) => `${(el as HTMLElement).dataset.type}:${(el as HTMLElement).dataset.uid}`
      )
    )

    for (const ref of newRefs) {
      const key = `${ref.type}:${ref.uid}`
      if (!existingUids.has(key)) {
        insertTag(ref)
        existingUids.add(key)
      }
    }
  }

  const handleSend = async () => {
    const editor = editorRef.current
    if (!editor || (isEmpty && !pendingFile) || isLoading) return

    const { text, references } = extractContent(editor)

    // 有剧本附件时：先上传，成功后发送消息（优先使用用户输入，无输入时使用默认消息）
    if (pendingFile) {
      if (!currentConversationId) return
      setIsUploading(true)
      try {
        await conversationApi.uploadFile(currentConversationId, pendingFile)
        const messageText = text.trim() ? text : '根据剧本生成视频'
        onSend(messageText, references.length > 0 ? references : undefined)
        editor.innerHTML = ''
        setPendingFile(null)
        setIsEmpty(true)
      } catch {
        message.error('剧本上传失败，请重试')
      } finally {
        setIsUploading(false)
      }
      return
    }

    if (!text && references.length === 0) return

    onSend(text, references.length > 0 ? references : undefined)

    // 清空编辑器
    editor.innerHTML = ''
    setIsEmpty(true)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      if (isStreaming) {
        onStop()
      } else {
        handleSend()
      }
    }
  }

  const handlePaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
    e.preventDefault()
    const plain = e.clipboardData.getData('text/plain')
    document.execCommand('insertText', false, plain)
  }

  const handleFileUpload = (file: File) => {
    if (!currentConversationId) return false
    if (file.size > 10 * 1024 * 1024) {
      message.error('文件大小不能超过 10MB')
      return false
    }
    setPendingFile(file)
    return false
  }

  const handleImageUpload = async (file: File) => {
    if (!currentConversationId) return false
    try {
      await conversationApi.uploadImage(currentConversationId, file)
      return false
    } catch {
      return false
    }
  }

  return (
    <div className="border-t border-gray-200 bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-3">
          {selectedStyle && (
            <div className="mb-2 flex items-center gap-2">
              <div className="inline-flex items-center gap-1.5 bg-indigo-50 border border-indigo-200 rounded-lg px-2 py-1">
                {selectedStyle.image_url && (
                  <img
                    src={selectedStyle.image_url}
                    alt={selectedStyle.style_name}
                    className="w-5 h-5 rounded object-cover"
                  />
                )}
                <span className="text-xs text-indigo-700 font-medium">
                  {selectedStyle.style_name}
                </span>
                <button
                  type="button"
                  onClick={() => onStyleChange?.(null)}
                  className="ml-0.5 text-indigo-400 hover:text-indigo-600"
                >
                  <X size={12} />
                </button>
              </div>
            </div>
          )}

          {pendingFile && (
            <div className="mb-2 flex items-center gap-2">
              <div className="inline-flex items-center gap-1.5 bg-gray-100 border border-gray-200 rounded-lg px-2 py-1">
                <span className="text-xs text-gray-700 font-medium">
                  {pendingFile.name}
                </span>
                <button
                  type="button"
                  onClick={() => setPendingFile(null)}
                  className="ml-0.5 text-gray-400 hover:text-gray-600"
                >
                  <X size={12} />
                </button>
              </div>
            </div>
          )}

          <div
            ref={editorRef}
            contentEditable
            suppressContentEditableWarning
            onInput={checkEmpty}
            onKeyDown={handleKeyDown}
            onPaste={handlePaste}
            className="w-full outline-none text-gray-700 bg-transparent min-h-[24px] max-h-[200px] overflow-y-auto whitespace-pre-wrap empty:before:content-[attr(data-placeholder)] empty:before:text-gray-400"
            data-placeholder="输入消息... (Shift+Enter换行, Enter发送)"
            style={{ wordBreak: 'break-word' }}
          />

          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center gap-1">
              <Tooltip title="引用资产">
                <Button
                  type="text"
                  size="small"
                  icon={<Library size={18} className="text-gray-500" />}
                  className="!text-gray-500 hover:!text-indigo-600"
                  onClick={() => setPickerOpen(true)}
                />
              </Tooltip>

              <Tooltip title="选择风格">
                <Button
                  type="text"
                  size="small"
                  icon={<Palette size={18} className={selectedStyle ? 'text-indigo-600' : 'text-gray-500'} />}
                  className={selectedStyle ? '!text-indigo-600' : '!text-gray-500 hover:!text-indigo-600'}
                  onClick={() => setStylePickerOpen(true)}
                />
              </Tooltip>

              <Upload
                beforeUpload={handleFileUpload}
                showUploadList={false}
                accept=".txt,.md,.pdf,.docx"
              >
                <Tooltip title="上传文件">
                  <Button
                    type="text"
                    size="small"
                    icon={<Paperclip size={18} className="text-gray-500" />}
                    className="!text-gray-500 hover:!text-indigo-600"
                  />
                </Tooltip>
              </Upload>

              <Upload
                beforeUpload={handleImageUpload}
                showUploadList={false}
                accept="image/*"
              >
                <Tooltip title="上传图片">
                  <Button
                    type="text"
                    size="small"
                    icon={<ImageIcon size={18} className="text-gray-500" />}
                    className="!text-gray-500 hover:!text-indigo-600"
                  />
                </Tooltip>
              </Upload>
            </div>

            {isStreaming ? (
              <Button
                danger
                size="small"
                icon={<Square size={14} />}
                onClick={onStop}
              >
                停止
              </Button>
            ) : (
              <Button
                type="primary"
                size="small"
                icon={isUploading || isLoading ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
                onClick={handleSend}
                disabled={(!pendingFile && isEmpty) || isLoading || isUploading}
                className="!rounded-lg"
              >
                {isUploading ? '上传中' : '发送'}
              </Button>
            )}
          </div>
        </div>
      </div>

      <AssetReferencePicker
        open={pickerOpen}
        onClose={() => setPickerOpen(false)}
        onSelect={handleAddReferences}
      />

      <StylePickerModal
        open={stylePickerOpen}
        onClose={() => setStylePickerOpen(false)}
        onSelect={(style) => onStyleChange?.(style)}
      />
    </div>
  )
}
