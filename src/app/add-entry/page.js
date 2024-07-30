'use client'; // Ensure this is at the top
import { useState, useContext } from 'react';
import { Form, Input, Button } from 'antd';
import { useRouter } from 'next/navigation'; // Correct hook import
import { EntriesContext } from '../../context/EntriesContext';
import styles from '../page.module.css';

const AddEntryPage = () => {
  const [content, setContent] = useState('');
  const router = useRouter();
  const { addEntry } = useContext(EntriesContext);

  const handleAddEntry = async () => {
    const newEntry = {
      id: Date.now(),
      content,
      date: new Date().toISOString(),
    };
    await addEntry(newEntry);
    router.push('/entries');
  };

  return (
    <Form onFinish={handleAddEntry} className={styles.form}>
      <Form.Item label="Content">
        <Input.TextArea value={content} onChange={(e) => setContent(e.target.value)} />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">Add Entry</Button>
      </Form.Item>
    </Form>
  );
};

export default AddEntryPage;
