'use client'; // Ensure this is at the top
import { useState, useContext } from 'react';
import { Form, Input, Button, DatePicker, Select } from 'antd';
import { useRouter } from 'next/navigation'; // Correct hook import
import { EntriesContext } from '../../context/EntriesContext';
import styles from '../page.module.css';
import dayjs from 'dayjs'; // For date formatting if needed

const { Option } = Select;

const AddEntryPage = () => {
  const [content, setContent] = useState('');
  const [date, setDate] = useState(null); // State for the date picker
  const [mood, setMood] = useState(''); // State for the mood dropdown
  const router = useRouter();
  const { addEntry } = useContext(EntriesContext);

  const handleAddEntry = async () => {
    const newEntry = {
      id: Date.now(),
      content,
      date: date ? date.toISOString() : new Date().toISOString(), // Use selected date or current date
      mood,
    };
    await addEntry(newEntry);
    router.push('/entries');
  };

  return (
    <Form onFinish={handleAddEntry} className={styles.form}>
      <Form.Item label="Content">
        <Input.TextArea value={content} onChange={(e) => setContent(e.target.value)} />
      </Form.Item>
      <Form.Item label="Date">
        <DatePicker 
          value={date} 
          onChange={(value) => setDate(value)} 
          style={{ width: '100%' }} 
        />
      </Form.Item>
      <Form.Item label="Mood">
        <Select value={mood} onChange={(value) => setMood(value)} style={{ width: '100%' }}>
          <Option value="happy">Happy</Option>
          <Option value="sad">Sad</Option>
          <Option value="angry">Angry</Option>
          <Option value="excited">Excited</Option>
          <Option value="anxious">Anxious</Option>
        </Select>
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">Add Entry</Button>
      </Form.Item>
    </Form>
  );
};

export default AddEntryPage;
