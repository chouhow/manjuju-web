import { Modal, Form, Input, Button, message } from 'antd'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { dramaApi } from '@/api/drama'
import { useDramaStore } from '@/stores/dramaStore'

interface Props {
  open: boolean
  onClose: () => void
}

export default function DramaCreateModal({ open, onClose }: Props) {
  const navigate = useNavigate()
  const { addDrama } = useDramaStore()
  const [form] = Form.useForm()
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (values: { title: string; description?: string }) => {
    setIsLoading(true)
    try {
      const drama = await dramaApi.create({
        title: values.title,
        description: values.description,
      })
      addDrama(drama)
      message.success('漫剧创建成功')
      form.resetFields()
      onClose()
      navigate(`/dramas/${drama.drama_id}`)
    } catch (error) {
      message.error((error as Error).message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Modal
      title="新建漫剧"
      open={open}
      onCancel={onClose}
      footer={null}
      destroyOnClose
    >
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item
          name="title"
          label="漫剧名称"
          rules={[{ required: true, message: '请输入漫剧名称' }]}
        >
          <Input placeholder="例如：彼得潘传奇" />
        </Form.Item>

        <Form.Item name="description" label="简介">
          <Input.TextArea
            rows={3}
            placeholder="简单描述一下您的漫剧..."
          />
        </Form.Item>

        <div className="flex justify-end gap-2">
          <Button onClick={onClose}>取消</Button>
          <Button type="primary" htmlType="submit" loading={isLoading}>
            创建
          </Button>
        </div>
      </Form>
    </Modal>
  )
}
