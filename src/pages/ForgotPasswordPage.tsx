import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Form, Input, Button, Card, Typography, Steps, message } from 'antd'
import { MailOutlined, LockOutlined, SafetyOutlined } from '@ant-design/icons'
import { authApi } from '@/api/auth'

const { Title, Text } = Typography

export default function ForgotPasswordPage() {
  const [currentStep, setCurrentStep] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [form] = Form.useForm()

  const handleSendCode = async (values: { email: string }) => {
    setIsLoading(true)
    try {
      await authApi.forgotPassword(values.email)
      message.success('重置链接已发送到您的邮箱')
      setCurrentStep(1)
    } catch (error) {
      message.error((error as Error).message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleReset = async (values: {
    token: string
    new_password: string
    confirm_password: string
  }) => {
    if (values.new_password !== values.confirm_password) {
      message.error('两次输入的密码不一致')
      return
    }
    setIsLoading(true)
    try {
      await authApi.resetPassword({
        token: values.token,
        new_password: values.new_password,
      })
      message.success('密码重置成功')
      setCurrentStep(2)
    } catch (error) {
      message.error((error as Error).message)
    } finally {
      setIsLoading(false)
    }
  }

  const stepItems = [
    { title: '验证邮箱' },
    { title: '重置密码' },
    { title: '完成' },
  ]

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-blue-100 p-4">
      <Card className="w-full max-w-md shadow-2xl rounded-2xl">
        <div className="text-center mb-8">
          <Title level={2} className="!mb-2">
            <span className="text-indigo-600">找回密码</span>
          </Title>
          <Text className="text-gray-500">重置您的 Mindevo 账户密码</Text>
        </div>

        <Steps current={currentStep} items={stepItems} className="mb-8" />

        {currentStep === 0 && (
          <Form form={form} layout="vertical" onFinish={handleSendCode}>
            <Form.Item
              name="email"
              rules={[
                { required: true, message: '请输入邮箱' },
                { type: 'email', message: '请输入有效的邮箱地址' },
              ]}
            >
              <Input
                prefix={<MailOutlined />}
                placeholder="注册邮箱"
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
                发送重置链接
              </Button>
            </Form.Item>
          </Form>
        )}

        {currentStep === 1 && (
          <Form form={form} layout="vertical" onFinish={handleReset}>
            <Form.Item
              name="token"
              rules={[{ required: true, message: '请输入重置令牌' }]}
            >
              <Input
                prefix={<SafetyOutlined />}
                placeholder="重置令牌"
                size="large"
              />
            </Form.Item>
            <Form.Item
              name="new_password"
              rules={[{ required: true, message: '请输入新密码' }]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="新密码"
                size="large"
              />
            </Form.Item>
            <Form.Item
              name="confirm_password"
              rules={[{ required: true, message: '请确认新密码' }]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="确认新密码"
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
                重置密码
              </Button>
            </Form.Item>
          </Form>
        )}

        {currentStep === 2 && (
          <div className="text-center py-8">
            <Title level={4} className="!text-green-600">
              密码重置成功！
            </Title>
            <Text className="block mt-4">您现在可以使用新密码登录了</Text>
            <Link to="/login">
              <Button type="primary" size="large" className="mt-6">
                去登录
              </Button>
            </Link>
          </div>
        )}

        <div className="text-center mt-4">
          <Link to="/login" className="text-indigo-600 hover:text-indigo-800">
            返回登录
          </Link>
        </div>
      </Card>
    </div>
  )
}
