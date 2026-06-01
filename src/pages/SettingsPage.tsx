import { useState } from 'react'
import { Form, Input, Button, Card, Tabs, message, Avatar } from 'antd'
import { User, Lock, Mail } from 'lucide-react'
import { useAuthStore } from '@/stores/authStore'
import { authApi } from '@/api/auth'
import AppHeader from '@/components/common/AppHeader'

export default function SettingsPage() {
  const { user, fetchProfile } = useAuthStore()
  const [passwordForm] = Form.useForm()
  const [profileForm] = Form.useForm()
  const [isLoading, setIsLoading] = useState(false)

  const handleChangePassword = async (values: {
    old_password: string
    new_password: string
    confirm_password: string
  }) => {
    if (values.new_password !== values.confirm_password) {
      message.error('两次输入的密码不一致')
      return
    }
    setIsLoading(true)
    try {
      await authApi.changePassword({
        old_password: values.old_password,
        new_password: values.new_password,
      })
      message.success('密码修改成功')
      passwordForm.resetFields()
    } catch (error) {
      message.error((error as Error).message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpdateProfile = async (_values: { username: string; email: string }) => {
    setIsLoading(true)
    try {
      await fetchProfile()
      message.success('资料已更新')
    } catch (error) {
      message.error((error as Error).message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <AppHeader />
      <div className="flex-1 p-6 overflow-auto">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">个人设置</h1>

          <Tabs
            items={[
              {
                key: 'profile',
                label: (
                  <span className="flex items-center gap-1.5">
                    <User size={14} />
                    个人资料
                  </span>
                ),
                children: (
                  <Card className="!rounded-xl">
                    <div className="flex items-center gap-4 mb-6">
                      <Avatar
                        size={80}
                        className="bg-indigo-600 text-2xl"
                      >
                        {user?.username?.[0]?.toUpperCase() || 'U'}
                      </Avatar>
                      <div>
                        <h3 className="font-semibold text-lg">{user?.username}</h3>
                        <p className="text-gray-500 text-sm">{user?.email}</p>
                      </div>
                    </div>

                    <Form
                      form={profileForm}
                      layout="vertical"
                      initialValues={{
                        username: user?.username,
                        email: user?.email,
                      }}
                      onFinish={handleUpdateProfile}
                    >
                      <Form.Item name="username" label="用户名">
                        <Input prefix={<User size={14} />} />
                      </Form.Item>
                      <Form.Item name="email" label="邮箱">
                        <Input prefix={<Mail size={14} />} disabled />
                      </Form.Item>
                      <Form.Item>
                        <Button
                          type="primary"
                          htmlType="submit"
                          loading={isLoading}
                        >
                          保存修改
                        </Button>
                      </Form.Item>
                    </Form>
                  </Card>
                ),
              },
              {
                key: 'password',
                label: (
                  <span className="flex items-center gap-1.5">
                    <Lock size={14} />
                    修改密码
                  </span>
                ),
                children: (
                  <Card className="!rounded-xl">
                    <Form
                      form={passwordForm}
                      layout="vertical"
                      onFinish={handleChangePassword}
                    >
                      <Form.Item
                        name="old_password"
                        label="当前密码"
                        rules={[{ required: true, message: '请输入当前密码' }]}
                      >
                        <Input.Password prefix={<Lock size={14} />} />
                      </Form.Item>
                      <Form.Item
                        name="new_password"
                        label="新密码"
                        rules={[{ required: true, message: '请输入新密码' }]}
                      >
                        <Input.Password prefix={<Lock size={14} />} />
                      </Form.Item>
                      <Form.Item
                        name="confirm_password"
                        label="确认新密码"
                        rules={[{ required: true, message: '请确认新密码' }]}
                      >
                        <Input.Password prefix={<Lock size={14} />} />
                      </Form.Item>
                      <Form.Item>
                        <Button
                          type="primary"
                          htmlType="submit"
                          loading={isLoading}
                        >
                          修改密码
                        </Button>
                      </Form.Item>
                    </Form>
                  </Card>
                ),
              },
            ]}
          />
        </div>
      </div>
    </div>
  )
}
