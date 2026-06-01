import { useNavigate, Link } from 'react-router-dom'
import { Form, Input, Button, Card, Typography, message } from 'antd'
import { UserOutlined, LockOutlined, MailOutlined, MobileOutlined } from '@ant-design/icons'
import { useAuthStore } from '@/stores/authStore'

const { Title, Text } = Typography

export default function RegisterPage() {
  const navigate = useNavigate()
  const { register, isLoading } = useAuthStore()
  const [form] = Form.useForm()

  const handleSubmit = async (values: {
    username: string
    phone: string
    email?: string
    password: string
    confirm_password: string
  }) => {
    if (values.password !== values.confirm_password) {
      message.error('两次输入的密码不一致')
      return
    }
    try {
      await register({
        username: values.username,
        phone: values.phone,
        email: values.email,
        password: values.password,
        confirm_password: values.confirm_password,
      })
      message.success('注册成功，请登录')
      navigate('/login')
    } catch (error) {
      message.error((error as Error).message)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-blue-100 p-4">
      <Card className="w-full max-w-md shadow-2xl rounded-2xl">
        <div className="text-center mb-8">
          <Title level={2} className="!mb-2">
            <span className="text-indigo-600">注册账号</span>
          </Title>
          <Text className="text-gray-500">创建您的 Mindevo 账户</Text>
        </div>

        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            name="username"
            rules={[{ required: true, message: '请输入用户名' }]}
          >
            <Input prefix={<UserOutlined />} placeholder="用户名" size="large" />
          </Form.Item>

          <Form.Item
            name="phone"
            rules={[
              { required: true, message: '请输入手机号' },
              {
                pattern: /^1[3-9]\d{9}$/,
                message: '手机号格式不正确',
              },
            ]}
          >
            <Input
              prefix={<MobileOutlined />}
              placeholder="手机号（必填）"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="email"
            rules={[
              { type: 'email', message: '请输入有效的邮箱地址' },
            ]}
          >
            <Input
              prefix={<MailOutlined />}
              placeholder="邮箱（可选）"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[
              { required: true, message: '请输入密码' },
              { min: 6, message: '密码至少6位' },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="密码"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="confirm_password"
            rules={[
              { required: true, message: '请确认密码' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve()
                  }
                  return Promise.reject(new Error('两次输入的密码不一致'))
                },
              }),
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="确认密码"
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
              注册
            </Button>
          </Form.Item>
        </Form>

        <div className="text-center mt-4">
          <Text>已有账号？</Text>{' '}
          <Link to="/login" className="text-indigo-600 hover:text-indigo-800">
            立即登录
          </Link>
        </div>
      </Card>
    </div>
  )
}
