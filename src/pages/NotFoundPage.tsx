import { Link } from 'react-router-dom'
import { Button, Typography } from 'antd'
import { HomeOutlined } from '@ant-design/icons'

const { Title, Text } = Typography

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <Title level={1} className="!text-8xl !text-indigo-600 !mb-4">
        404
      </Title>
      <Title level={3} className="!mb-4">
        页面未找到
      </Title>
      <Text className="text-gray-500 mb-8">
        您访问的页面不存在或已被移除
      </Text>
      <Link to="/">
        <Button type="primary" size="large" icon={<HomeOutlined />}>
          返回首页
        </Button>
      </Link>
    </div>
  )
}
