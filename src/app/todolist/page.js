'use client';
import React, { useState, useEffect, useMemo } from 'react';
import { Layout, Input, Button, List, Checkbox, Tag, DatePicker, Select, Modal, Form } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined } from '@ant-design/icons';
import dynamic from 'next/dynamic';
import styles from './TodoList.module.css';

const { Content } = Layout;
const { Option } = Select;
const QuillNoSSRWrapper = dynamic(() => import('react-quill'), {
  ssr: false,
  loading: () => <p>Loading...</p>,
});

// Dynamically import the Confetti component
const Confetti = dynamic(() => import('react-confetti'), {
  ssr: false,
  loading: () => <p>Loading...</p>,
});

// Define Quill modules and formats
const modules = {
  toolbar: [
    [{ 'header': '1'}, { 'header': '2'}, { 'font': [] }],
    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
    ['bold', 'italic', 'underline'],
    ['link'],
    [{ 'align': [] }],
    ['clean']
  ],
};

const formats = [
  'header', 'font', 'size',
  'bold', 'italic', 'underline',
  'list', 'bullet', 'indent',
  'link', 'align', 'clean'
];

const TodoList = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [editingTask, setEditingTask] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    // Fetch tasks from API
    fetch('/api/tasks')
      .then(response => response.json())
      .then(data => setTasks(data))
      .catch(error => console.error('Error fetching tasks:', error));
  }, []);

  useEffect(() => {
    // Save tasks to API
    fetch('/api/tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(tasks),
    }).catch(error => console.error('Error saving tasks:', error));
  }, [tasks]);

  const addTask = () => {
    if (newTask.trim() !== '') {
      const newTaskObj = {
        id: Date.now(),
        text: newTask,
        completed: false,
        dueDate: null,
        priority: 'medium',
        category: '',
      };
      setTasks([...tasks, newTaskObj]);
      setNewTask('');
    }
  };

  const deleteTask = (taskId) => {
    setTasks(tasks.filter((task) => task.id !== taskId));
  };

  const toggleComplete = (taskId) => {
    const updatedTasks = tasks.map((task) =>
      task.id === taskId ? { ...task, completed: !task.completed } : task
    );
    setTasks(updatedTasks);

    // Show confetti when a task is completed
    if (updatedTasks.find((task) => task.id === taskId).completed) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000); // Hide confetti after 3 seconds
    }
  };

  const editTask = (task) => {
    setEditingTask(task);
    setIsModalVisible(true);
  };

  const handleEditSubmit = (values) => {
    setTasks(
      tasks.map((task) =>
        task.id === editingTask.id ? { ...task, ...values } : task
      )
    );
    setIsModalVisible(false);
    setEditingTask(null);
  };

  const filteredTasks = useMemo(() => {
    return tasks
      .filter((task) => {
        if (filter === 'completed') return task.completed;
        if (filter === 'active') return !task.completed;
        return true;
      })
      .filter((task) =>
        task.text.toLowerCase().includes(searchTerm.toLowerCase())
      );
  }, [tasks, filter, searchTerm]);

  return (
    <Layout className={styles.layout}>
      <Layout>
        <Content className={styles.content}>
          <div className={styles.todoContainer}>
            <h1 className={styles.title}>Journal Todo List</h1>
            <div className={styles.addTaskContainer}>
              <Input
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                onPressEnter={addTask}
                placeholder="Add a new task"
              />
              <Button type="primary" onClick={addTask} icon={<PlusOutlined />}>
                Add Task
              </Button>
            </div>
            <div className={styles.filterContainer}>
              <Select
                defaultValue="all"
                style={{ width: 120 }}
                onChange={(value) => setFilter(value)}
              >
                <Option value="all">All</Option>
                <Option value="active">Active</Option>
                <Option value="completed">Completed</Option>
              </Select>
              <Input
                placeholder="Search tasks"
                prefix={<SearchOutlined />}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <List
              className={styles.taskList}
              itemLayout="horizontal"
              dataSource={filteredTasks}
              renderItem={(task) => (
                <List.Item
                  actions={[
                    <Button icon={<EditOutlined />} onClick={() => editTask(task)} />,
                    <Button icon={<DeleteOutlined />} onClick={() => deleteTask(task.id)} />,
                  ]}
                >
                  <Checkbox checked={task.completed} onChange={() => toggleComplete(task.id)}>
                    <span style={{ textDecoration: task.completed ? 'line-through' : 'none' }}>
                      {task.text}
                    </span>
                  </Checkbox>
                  {task.dueDate && <Tag color="blue">{task.dueDate.format('YYYY-MM-DD')}</Tag>}
                  <Tag color={task.priority === 'high' ? 'red' : task.priority === 'medium' ? 'orange' : 'green'}>
                    {task.priority}
                  </Tag>
                  {task.category && <Tag>{task.category}</Tag>}
                </List.Item>
              )}
            />
            <Modal
              title="Edit Task"
              visible={isModalVisible}
              onCancel={() => setIsModalVisible(false)}
              footer={null}
            >
              <Form
                initialValues={{
                  text: editingTask?.text || '',
                  dueDate: editingTask?.dueDate ? moment(editingTask.dueDate) : null,
                  priority: editingTask?.priority || 'medium',
                  category: editingTask?.category || '',
                }}
                onFinish={handleEditSubmit}
              >
                <Form.Item name="text" label="Task" rules={[{ required: true }]}>
                  <QuillNoSSRWrapper modules={modules} formats={formats} theme="snow" />
                </Form.Item>
                <Form.Item name="dueDate" label="Due Date">
                  <DatePicker />
                </Form.Item>
                <Form.Item name="priority" label="Priority">
                  <Select>
                    <Option value="high">High</Option>
                    <Option value="medium">Medium</Option>
                    <Option value="low">Low</Option>
                  </Select>
                </Form.Item>
                <Form.Item name="category" label="Category">
                  <Input />
                </Form.Item>
                <Form.Item>
                  <Button type="primary" htmlType="submit">
                    Save
                  </Button>
                </Form.Item>
              </Form>
            </Modal>
          </div>
          {showConfetti && <Confetti />}
        </Content>
      </Layout>
    </Layout>
  );
};

export default TodoList;