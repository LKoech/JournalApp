'use client';
import React, { useContext, useState, useEffect } from 'react';
import { Select, Typography } from 'antd';
import { EntriesContext } from '../../context/EntriesContext';
import { Pie } from 'react-chartjs-2';
import 'chart.js/auto';
import styles from '../page.module.css';

const { Option } = Select;

const MoodTrackerPage = () => {
  const { entries } = useContext(EntriesContext);
  const [timePeriod, setTimePeriod] = useState('week');
  const [filteredEntries, setFilteredEntries] = useState([]);

  useEffect(() => {
    const now = new Date();
    let filtered;

    switch (timePeriod) {
      case 'week':
        filtered = entries.filter(entry => {
          const entryDate = new Date(entry.date);
          const oneWeekAgo = new Date(now.setDate(now.getDate() - 7));
          return entryDate >= oneWeekAgo;
        });
        break;
      case 'month':
        filtered = entries.filter(entry => {
          const entryDate = new Date(entry.date);
          const oneMonthAgo = new Date(now.setMonth(now.getMonth() - 1));
          return entryDate >= oneMonthAgo;
        });
        break;
      case 'year':
        filtered = entries.filter(entry => {
          const entryDate = new Date(entry.date);
          const oneYearAgo = new Date(now.setFullYear(now.getFullYear() - 1));
          return entryDate >= oneYearAgo;
        });
        break;
      default:
        filtered = entries;
    }

    setFilteredEntries(filtered);
  }, [timePeriod, entries]);

  const moodCount = filteredEntries.reduce((acc, entry) => {
    acc[entry.mood] = (acc[entry.mood] || 0) + 1;
    return acc;
  }, {});

  const data = {
    labels: Object.keys(moodCount),
    datasets: [
      {
        data: Object.values(moodCount),
        backgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF',
          '#FF9F40'
        ],
      },
    ],
  };

  return (
    <div className={styles.moodTrackerContainer}>
      <Typography.Title>Mood Tracker</Typography.Title>
      <Select value={timePeriod} onChange={setTimePeriod} style={{ width: 200, marginBottom: 20 }}>
        <Option value="week">This Week</Option>
        <Option value="month">This Month</Option>
        <Option value="year">This Year</Option>
      </Select>
      <div className={styles.pieChartContainer}>
        <Pie data={data} />
      </div>
    </div>
  );
};

export default MoodTrackerPage;
