import { useEffect, useState } from 'react'
import { Modal, Button, Radio, message, Empty, Spin } from 'antd'
import { Share2, Copy, Link2, Trash2, ExternalLink } from 'lucide-react'
import { shareApi } from '@/api/share'
import type { ShareOut } from '@/types/share'

interface ShareModalProps {
  dramaId: string
  open: boolean
  onClose: () => void
}

export default function ShareModal({ dramaId, open, onClose }: ShareModalProps) {
  const [shares, setShares] = useState<ShareOut[]>([])
  const [loading, setLoading] = useState(false)
  const [creating, setCreating] = useState(false)
  const [expiresInDays, setExpiresInDays] = useState<number | null>(7)

  useEffect(() => {
    if (open) {
      loadShares()
    }
  }, [open])

  const loadShares = async () => {
    setLoading(true)
    try {
      const data = await shareApi.list(dramaId)
      setShares(data)
    } catch {
      message.error('加载分享列表失败')
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = async () => {
    setCreating(true)
    try {
      const share = await shareApi.create(dramaId, expiresInDays)
      message.success('分享链接已生成')
      setShares((prev) => [share, ...prev])
    } catch {
      message.error('创建分享链接失败')
    } finally {
      setCreating(false)
    }
  }

  const handleCopy = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url)
      message.success('链接已复制到剪贴板')
    } catch {
      message.error('复制失败')
    }
  }

  const handleRevoke = async (shareId: string) => {
    try {
      await shareApi.revoke(shareId)
      message.success('分享链接已撤销')
      setShares((prev) => prev.filter((s) => s.share_id !== shareId))
    } catch {
      message.error('撤销失败')
    }
  }

  const openPreview = (url: string) => {
    window.open(url, '_blank')
  }

  return (
    <Modal
      title={
        <span className="flex items-center gap-2">
          <Share2 size={18} className="text-indigo-600" />
          分享漫剧
        </span>
      }
      open={open}
      onCancel={onClose}
      footer={null}
      width={520}
      destroyOnHidden
    >
      <div className="space-y-5">
        {/* 创建新分享 */}
        <div className="bg-gray-50 rounded-xl p-4 space-y-3">
          <div className="text-sm font-medium text-gray-700">创建新分享链接</div>
          <Radio.Group
            value={expiresInDays}
            onChange={(e) => setExpiresInDays(e.target.value)}
            className="flex flex-wrap gap-2"
          >
            <Radio.Button value={null}>永久有效</Radio.Button>
            <Radio.Button value={1}>1天</Radio.Button>
            <Radio.Button value={7}>7天</Radio.Button>
            <Radio.Button value={30}>30天</Radio.Button>
          </Radio.Group>
          <Button
            type="primary"
            icon={<Link2 size={16} />}
            loading={creating}
            onClick={handleCreate}
            block
          >
            生成分享链接
          </Button>
        </div>

        {/* 已有分享列表 */}
        <div>
          <div className="text-sm font-medium text-gray-700 mb-3">已有分享链接</div>
          {loading ? (
            <div className="flex justify-center py-8">
              <Spin />
            </div>
          ) : shares.length === 0 ? (
            <Empty description="暂无分享链接" image={Empty.PRESENTED_IMAGE_SIMPLE} />
          ) : (
            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
              {shares.map((share) => (
                <div
                  key={share.share_id}
                  className="border border-gray-200 rounded-lg p-3 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-400">
                      {share.created_at?.replace('T', ' ').slice(0, 16)}
                    </span>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${
                        share.is_active
                          ? 'bg-green-50 text-green-600'
                          : 'bg-gray-100 text-gray-500'
                      }`}
                    >
                      {share.is_active ? '有效' : '已撤销'}
                    </span>
                  </div>

                  {share.share_url && (
                    <div className="flex items-center gap-2 bg-gray-50 rounded-md px-2 py-1.5">
                      <span className="text-xs text-gray-600 truncate flex-1">
                        {share.share_url}
                      </span>
                      <Button
                        type="text"
                        size="small"
                        icon={<Copy size={14} />}
                        onClick={() => handleCopy(share.share_url!)}
                      />
                      <Button
                        type="text"
                        size="small"
                        icon={<ExternalLink size={14} />}
                        onClick={() => openPreview(share.share_url!)}
                      />
                    </div>
                  )}

                  <div className="flex items-center justify-between text-xs text-gray-400">
                    <span>访问 {share.access_count} 次</span>
                    {share.is_active && (
                      <Button
                        type="text"
                        size="small"
                        danger
                        icon={<Trash2 size={14} />}
                        onClick={() => handleRevoke(share.share_id)}
                      >
                        撤销
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Modal>
  )
}
