// src/components/NavBar.js
'use client'; 
import { Menu } from 'antd';
import Link from 'next/link';
import { useRouter } from 'next/navigation'; // Correct import for routing
import { useState } from 'react';

// Mark this component as a Client Component
export default function NavBar() {
  const router = useRouter(); // Correct usage of useRouter
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogout = () => {
    setIsAuthenticated(false);
    router.push('/login');
  };

  return (
    <Menu mode="horizontal">
      <Menu.Item key="home">
        <Link href="/">Home</Link>
      </Menu.Item>
      {isAuthenticated ? (
        <>
          <Menu.Item key="entries">
            <Link href="/entries">Entries</Link>
          </Menu.Item>
          <Menu.Item key="logout" onClick={handleLogout}>
            Logout
          </Menu.Item>
        </>
      ) : (
        <Menu.Item key="login">
          <Link href="/login">Login</Link>
        </Menu.Item>
      )}
    </Menu>
  );
}
