'use client';

import { useState, useEffect, useContext } from 'react';
import { Form, Input, Button } from 'antd';
import { useRouter, useParams } from 'next/navigation';
import { EntriesContext } from '../../../context/EntriesContext';
import styles from '.../page.module.css';

const EditEntryPage = () => {
  const { id } = useParams();
  const [content, setContent] = useState('');
  const router = useRouter();
  const { entries, fetchEntries, saveEntries } = useContext(EntriesContext);

  useEffect(() => {
    fetchEntries();
    const entry = entries.find(entry => entry.id === parseInt(id));
    if (entry) {
      setContent(entry.content);
    }
  }, [id, entries, fetchEntries]);

  const handleEditEntry = async () => {
    const updatedEntries = entries.map(entry =>
      entry.id === parseInt(id) ? { ...entry, content } : entry
    );
    await saveEntries(updatedEntries);
    router.push('/entries');
  };

  return (
    <Form onFinish={handleEditEntry} className={styles.form}>
      <Form.Item label="Content">
        <Input.TextArea value={content} onChange={(e) => setContent(e.target.value)} />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">Save Changes</Button>
      </Form.Item>
    </Form>
  );
};

export default EditEntryPage;
