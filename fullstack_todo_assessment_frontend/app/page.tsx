"use client";

import React, { FormEvent, useEffect, useState } from 'react';
import './App.css';

interface Task {
    id: number;
    title: string;
    description: string;
}


export default function Home() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');

    const fetchTasks = async () => {
        try {
            const response = await fetch('/api/tasks');
            const data: Task[] = await response.json();
            setTasks(data);
        } catch (error) {
            console.error('Failed to fetch tasks:', error);
        }
    };

    useEffect(() => {
        const loadTasksOnMount = async () => {
            try {
                const response = await fetch('/api/tasks');
                const data: Task[] = await response.json();
                setTasks(data);
            } catch (error) {
                console.error('Failed to fetch tasks:', error);
            }
        };

        void loadTasksOnMount();

    }, []);


    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!title) return;

        try {
            await fetch('/api/tasks', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title, description }),
            });

            setTitle('');
            setDescription('');

            void fetchTasks();
        } catch (error) {
            console.error('Failed to create task:', error);
        }
    };


    const handleDone = async (id: number) => {
        try {
            await fetch(`/api/tasks/${id}/complete`, {
                method: 'PATCH',
            });

            void fetchTasks();
        } catch (error) {
            console.error('Failed to complete task:', error);
        }
    };

    return (
        <div className="app-container">
            <div className="add-task-form">
                <h2>Add a Task</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="title">Title</label>
                        <input
                            suppressHydrationWarning={true}
                            id="title"
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="description">Description</label>
                        <textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>
                    <button type="submit" className="add-button">
                        Add
                    </button>
                </form>
            </div>

            <div className="task-list">
                {tasks.map((task) => (
                    <div key={task.id} className="task-card">
                        <div className="task-content">
                            <h3>{task.title}</h3>
                            <p>{task.description}</p>
                        </div>
                        <button
                            className="done-button"
                            onClick={() => handleDone(task.id)}
                        >
                            Done
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}