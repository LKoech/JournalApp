'use client';
import React, { useState, useContext } from 'react';
import { Form, Button, DatePicker, Select } from 'antd';
import { useRouter } from 'next/navigation';
import { EntriesContext } from '../../context/EntriesContext';
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css'; // Ensure this import is correct
import styles from '../page.module.css';

const { Option } = Select;
const QuillNoSSRWrapper = dynamic(() => import('react-quill'), {
  ssr: false,
  loading: () => <p>Loading...</p>
});

// Import Quill and custom icons
import Quill from 'quill';
import 'react-quill/dist/quill.snow.css';

// Define custom icons for audio, location, and video
const CustomIcons = Quill.import('ui/icons');
CustomIcons['audio'] = '<svg viewBox="0 0 24 24"><path d="M12 3a3 3 0 00-3 3v6a3 3 0 006 0V6a3 3 0 00-3-3zm0 10a1 1 0 01-1-1V6a1 1 0 012 0v6a1 1 0 01-1 1zm5-1a5 5 0 01-10 0H6a7 7 0 0014 0h-2zm-5 6a7.98 7.98 0 01-5-1.75V21a1 1 0 001 1h8a1 1 0 001-1v-3.75A7.98 7.98 0 0112 18z"/></svg>';
CustomIcons['location'] = '<svg viewbox="0 0 18 18"><path d="M9 0a7 7 0 017 7c0 1.5-.5 2.8-1.3 3.9L9 17.8 3.3 10.9A7.015 7.015 0 012 7a7 7 0 017-7zm0 2a5 5 0 100 10A5 5 0 009 2z"></path></svg>';

// Custom handler for image upload
function imageHandler() {
  const input = document.createElement('input');
  input.setAttribute('type', 'file');
  input.setAttribute('accept', 'image/*');
  input.click();

  input.onchange = () => {
    const file = input.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      const range = this.quill.getSelection();
      this.quill.insertEmbed(range.index, 'image', e.target.result);
    };

    reader.readAsDataURL(file);
  };
}

// Custom handler for audio upload
function audioHandler() {
  const input = document.createElement('input');
  input.setAttribute('type', 'file');
  input.setAttribute('accept', 'audio/*');
  input.click();

  input.onchange = () => {
    const file = input.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      const range = this.quill.getSelection();
      this.quill.insertEmbed(range.index, 'audio', e.target.result);
    };

    reader.readAsDataURL(file);
  };
}

// Custom handler for video upload
function videoHandler() {
  const input = document.createElement('input');
  input.setAttribute('type', 'file');
  input.setAttribute('accept', 'video/*');
  input.click();

  input.onchange = () => {
    const file = input.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      const range = this.quill.getSelection();
      this.quill.insertEmbed(range.index, 'video', e.target.result);
    };

    reader.readAsDataURL(file);
  };
}

// Custom handler for location input
function locationHandler() {
  navigator.geolocation.getCurrentPosition((position) => {
    const { latitude, longitude } = position.coords;
    const range = this.quill.getSelection();
    this.quill.insertText(range.index, `Location: ${latitude}, ${longitude}`);
  });
}

const modules = {
  toolbar: {
    container: [
      [{ 'header': '1'}, {'header': '2'}, { 'font': [] }],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      ['link', 'image', 'audio', 'video', 'location'],
      [{ 'align': [] }, { 'color': [] }, { 'background': [] }],
      ['clean']
    ],
    handlers: {
      image: imageHandler,
      audio: audioHandler,
      video: videoHandler,
      location: locationHandler
    }
  }
};

const AddEntryPage = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [date, setDate] = useState(null);
  const [mood, setMood] = useState('');
  const router = useRouter();
  const { addEntry } = useContext(EntriesContext);

  const handleAddEntry = async () => {
    const newEntry = {
      id: Date.now(),
      title,
      content,
      date: date ? date.toISOString() : new Date().toISOString(),
      mood,
    };
    await addEntry(newEntry);
    router.push('/entries');
  };

  return (
    <div className={styles.formContainer}>
      <Form onFinish={handleAddEntry} className={styles.form}>
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
        <Form.Item label="Content">
          <QuillNoSSRWrapper
            value={content}
            placeholder='Start writing...'
            onChange={setContent}
            theme="snow"
            modules={modules}
            className={styles.quillEditor}
          />
        </Form.Item>
        <Form.Item>
          <div className={styles.buttonContainer}>
            <Button type="primary" htmlType="submit" className={styles.addButton}>
              Add Entry
            </Button>
          </div>
        </Form.Item>
      </Form>
    </div>
  );
};

export default AddEntryPage;
