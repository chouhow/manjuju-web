import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Form, Input, Button, Card, Typography, Tabs, message } from 'antd'
import { MailOutlined, LockOutlined, MobileOutlined } from '@ant-design/icons'
import { useAuthStore } from '@/stores/authStore'

const { Title, Text } = Typography

export default function LoginPage() {
  const navigate = useNavigate()
  const { login, isLoading } = useAuthStore()
  const [activeTab, setActiveTab] = useState('password')
  const [form] = Form.useForm()

  const handleSubmit = async (values: Record<string, string>) => {
    try {
      const loginData =
        activeTab === 'password'
          ? { email: values.email, password: values.password }
          : { phone: values.phone, verification_code: values.verification_code }

      await login(loginData)
      message.success('登录成功')
      navigate('/')
    } catch (error) {
      message.error((error as Error).message)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-blue-100 p-4">
      <Card className="w-full max-w-md shadow-2xl rounded-2xl">
        <div className="text-center mb-8">
          <Title level={2} className="!mb-2">
            <span className="text-indigo-600">AI漫剧</span>
          </Title>
          <Text className="text-gray-500">AI 漫剧创作平台</Text>
        </div>

        <Tabs activeKey={activeTab} onChange={setActiveTab} centered>
          <Tabs.TabPane tab="密码登录" key="password">
            <Form form={form} layout="vertical" onFinish={handleSubmit}>
              <Form.Item
                name="email"
                rules={[{ required: true, message: '请输入邮箱' }]}
              >
                <Input
                  prefix={<MailOutlined />}
                  placeholder="邮箱"
                  size="large"
                />
              </Form.Item>
              <Form.Item
                name="password"
                rules={[{ required: true, message: '请输入密码' }]}
              >
                <Input.Password
                  prefix={<LockOutlined />}
                  placeholder="密码"
                  size="large"
                />
              </Form.Item>
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  size="large"
                  block
                  loading={isLoading}
                >
                  登录
                </Button>
              </Form.Item>
            </Form>
          </Tabs.TabPane>

          <Tabs.TabPane tab="验证码登录" key="code">
            <Form form={form} layout="vertical" onFinish={handleSubmit}>
              <Form.Item
                name="phone"
                rules={[{ required: true, message: '请输入手机号' }]}
              >
                <Input
                  prefix={<MobileOutlined />}
                  placeholder="手机号"
                  size="large"
                />
              </Form.Item>
              <Form.Item
                name="verification_code"
                rules={[{ required: true, message: '请输入验证码' }]}
              >
                <Input
                  prefix={<MailOutlined />}
                  placeholder="验证码"
                  size="large"
                  suffix={
                    <Button type="link" size="small">
                      获取验证码
                    </Button>
                  }
                />
              </Form.Item>
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  size="large"
                  block
                  loading={isLoading}
                >
                  登录
                </Button>
              </Form.Item>
            </Form>
          </Tabs.TabPane>
        </Tabs>

        <div className="flex justify-between mt-4">
          <Link to="/forgot-password" className="text-indigo-600 hover:text-indigo-800">
            忘记密码？
          </Link>
          <Link to="/register" className="text-indigo-600 hover:text-indigo-800">
            注册账号
          </Link>
        </div>
      </Card>
    </div>
  )
}
