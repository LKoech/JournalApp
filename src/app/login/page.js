'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Form, Input, Button, Space, Typography, Alert } from 'antd';
import { EyeTwoTone, EyeInvisibleOutlined } from '@ant-design/icons';
import Image from 'next/image';
import styles from '../page.module.css';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [alert, setAlert] = useState(null);
  const router = useRouter();

  const handleLogin = async () => {
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();
      if (response.ok) {
        setAlert(<Alert message="Success" description="Login successful! Redirecting..." type="success" showIcon />);
        setTimeout(() => {
          router.push('/entries'); // Redirect to the entries page
        }, 2000);
      } else {
        setAlert(<Alert message="Error" description={data.message} type="error" showIcon />);
      }
    } catch (error) {
      setAlert(<Alert message="Error" description="An unexpected error occurred. Please try again." type="error" showIcon />);
    }
  };  

  return (
    <div className={styles.container}>
      <div className={styles.formContainer}>
        <h1 className={styles.title}>Login</h1>
        {alert}
        <Form onFinish={handleLogin}>
          <Space direction="vertical" style={{ width: '100%' }}>
            <Form.Item label={<Typography.Text style={{ color: 'white' }}>Username</Typography.Text>} required>
              <Input value={username} onChange={(e) => setUsername(e.target.value)} placeholder='username' />
            </Form.Item>
            <Form.Item label={<Typography.Text style={{ color: 'white' }}>Password</Typography.Text>} required>
              <Input.Password
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Input password"
                iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
              />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                Login
              </Button>
            </Form.Item>
          </Space>
        </Form>
      </div>
      <div className={styles.imageContainer}>
        <Image
          className={styles.logo}
          src="/journalpng.svg"
          alt="Journal Logo"
          width={600}
          height={270}
          priority
        />
      </div>
    </div>
  );
};

export default LoginPage;
