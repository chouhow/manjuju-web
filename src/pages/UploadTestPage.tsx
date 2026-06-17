import { useState } from 'react'
import {
  Card,
  Button,
  Upload,
  Descriptions,
  Tag,
  message,
  Spin,
  Empty,
} from 'antd'
import { Upload as UploadIcon, File as FileIcon, Image as ImageIcon, Copy, X } from 'lucide-react'
import { fileApi } from '@/api/file'
import AppHeader from '@/components/common/AppHeader'
import AppSidebar from '@/components/common/AppSidebar'
import type { UploadedFile } from '@/types/file'

const MAX_FILE_SIZE = 10 * 1024 * 1024

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`
}

export default function UploadTestPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string>('')
  const [uploading, setUploading] = useState(false)
  const [result, setResult] = useState<UploadedFile | null>(null)
  const [resetKey, setResetKey] = useState(0)

  const isImage = (file?: File | null) => {
    if (!file) return false
    return file.type.startsWith('image/')
  }

  const handleBeforeUpload = (file: File) => {
    if (file.size > MAX_FILE_SIZE) {
      message.error('文件大小不能超过 10MB')
      return false
    }

    setSelectedFile(file)
    setResult(null)

    if (isImage(file)) {
      setPreviewUrl(URL.createObjectURL(file))
    } else {
      setPreviewUrl('')
    }

    return false
  }

  const handleUpload = async () => {
    if (!selectedFile) {
      message.warning('请先选择文件')
      return
    }

    setUploading(true)
    try {
      const data = await fileApi.upload(selectedFile)
      setResult(data)
      message.success('上传成功')
    } catch (error) {
      message.error((error as Error).message || '上传失败')
    } finally {
      setUploading(false)
    }
  }

  const handleClear = () => {
    setSelectedFile(null)
    setPreviewUrl('')
    setResult(null)
    setResetKey((prev) => prev + 1)
  }

  const handleCopyUrl = () => {
    if (!result?.file_url) return
    navigator.clipboard.writeText(result.file_url).then(
      () => message.success('文件 URL 已复制'),
      () => message.error('复制失败')
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <AppHeader />
      <div className="flex flex-1">
        <AppSidebar />
        <main className="flex-1 p-6 overflow-auto">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">通用文件上传测试</h1>

            <Card className="!rounded-xl mb-6">
              <Upload.Dragger
                key={resetKey}
                accept="*/*"
                multiple={false}
                showUploadList={false}
                beforeUpload={handleBeforeUpload}
                className="!rounded-xl"
              >
                <div className="py-8">
                  <p className="text-indigo-600 mb-4">
                    <UploadIcon size={48} className="mx-auto" />
                  </p>
                  <p className="text-gray-700 font-medium mb-2">
                    点击或拖拽文件到此处上传
                  </p>
                  <p className="text-gray-400 text-sm">
                    支持任意类型文件，单个文件不超过 10MB
                  </p>
                </div>
              </Upload.Dragger>

              {selectedFile && (
                <div className="mt-6 p-4 bg-gray-50 rounded-xl flex items-start gap-4">
                  <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center shrink-0 border border-gray-200 overflow-hidden">
                    {previewUrl ? (
                      <img
                        src={previewUrl}
                        alt={selectedFile.name}
                        className="w-full h-full object-cover"
                      />
                    ) : isImage(selectedFile) ? (
                      <ImageIcon size={28} className="text-gray-400" />
                    ) : (
                      <FileIcon size={28} className="text-gray-400" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-gray-800 truncate">
                      {selectedFile.name}
                    </div>
                    <div className="text-sm text-gray-500 mt-1">
                      类型：{selectedFile.type || '未知'} · 大小：
                      {formatFileSize(selectedFile.size)}
                    </div>
                  </div>
                  <Button
                    type="text"
                    icon={<X size={16} />}
                    onClick={handleClear}
                    className="!text-gray-400 hover:!text-gray-600"
                  />
                </div>
              )}

              <div className="mt-6 flex items-center gap-3">
                <Button
                  type="primary"
                  icon={<UploadIcon size={16} />}
                  loading={uploading}
                  disabled={!selectedFile}
                  onClick={handleUpload}
                  size="large"
                >
                  开始上传
                </Button>
                <Button
                  disabled={!selectedFile || uploading}
                  onClick={handleClear}
                  size="large"
                >
                  清空
                </Button>
              </div>
            </Card>

            {uploading && (
              <div className="flex items-center justify-center py-8">
                <Spin tip="上传中..." size="large" />
              </div>
            )}

            {result && !uploading && (
              <Card
                className="!rounded-xl"
                title="上传结果"
                extra={
                  <Button
                    type="link"
                    icon={<Copy size={14} />}
                    onClick={handleCopyUrl}
                  >
                    复制文件 URL
                  </Button>
                }
              >
                <Descriptions column={1} bordered className="!rounded-xl overflow-hidden">
                  <Descriptions.Item label="文件 UID">{result.uid}</Descriptions.Item>
                  <Descriptions.Item label="文件名">{result.file_name}</Descriptions.Item>
                  <Descriptions.Item label="文件类型">
                    <Tag>{result.file_type}</Tag>
                  </Descriptions.Item>
                  <Descriptions.Item label="MIME 类型">
                    <Tag color="blue">{result.mime_type}</Tag>
                  </Descriptions.Item>
                  <Descriptions.Item label="文件大小">
                    {formatFileSize(result.file_size)}
                  </Descriptions.Item>
                  <Descriptions.Item label="上传时间">{result.created_at}</Descriptions.Item>
                  <Descriptions.Item label="文件 URL" className="break-all">
                    <a
                      href={result.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-600 hover:text-indigo-800 break-all"
                    >
                      {result.file_url}
                    </a>
                  </Descriptions.Item>
                  <Descriptions.Item label="Storage Key" className="break-all">
                    {result.storage_key}
                  </Descriptions.Item>
                </Descriptions>
              </Card>
            )}

            {!selectedFile && !result && (
              <Empty description="请选择要上传的文件" className="mt-12" />
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
