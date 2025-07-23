import React, { createContext, useContext, useEffect, useState } from "react";
import { Task } from "../types";
import { fetchTasks, createTask } from "../api";

interface TaskContextType {
  tasks: Task[];
  addTask: (title: string, parentId?: number) => Promise<Task>;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    fetchTasks().then(setTasks);
  }, []);

  const addTask = async (title: string, parentId?: number) => {
    const newTask = await createTask(title, parentId);
    setTasks((prev) => [...prev, newTask]);
    return newTask;
  };

  return <TaskContext.Provider value={{ tasks, addTask }}>{children}</TaskContext.Provider>;
};

export const useTasks = (): TaskContextType => {
  const context = useContext(TaskContext);
  if (!context) throw new Error("useTasks must be used within TaskProvider");
  return context;
};
