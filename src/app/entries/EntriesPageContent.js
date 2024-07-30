'use client';

import { useContext, useEffect } from 'react';
import { List, Typography, FloatButton } from 'antd';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { EntriesContext } from '../../context/EntriesContext';
import styles from '../page.module.css';

const EntriesPageContent = () => {
  const { entries, fetchEntries } = useContext(EntriesContext);
  const router = useRouter();

  useEffect(() => {
    fetchEntries();
  }, [fetchEntries]);

  const handleAddEntryClick = () => {
    router.push('/add-entry');
  };

  return (
    <div>
      <Typography.Title>Journal Entries</Typography.Title>
      <List
        itemLayout="horizontal"
        dataSource={entries}
        renderItem={(item) => (
          <List.Item>
            <List.Item.Meta
              title={<Link href={`/entries/${item.id}`}>{item.date}</Link>}
              description={item.content.split('\n')[0]} // Show first line of entry
            />
          </List.Item>
        )}
      />
      <FloatButton
        type="primary"
        shape="circle"
        icon="+"
        onClick={handleAddEntryClick}
        style={{ position: 'fixed', bottom: '50px', right: '50px' }}
      />
    </div>
  );
};

export default EntriesPageContent;
