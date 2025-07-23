import React from "react";
import { useTasks } from "../context/TaskContext";
import { TaskItem } from "./TaskItem";

export const TaskList: React.FC = () => {
  const { tasks } = useTasks();
  const topLevelTasks = tasks.filter((task) => !task.parent);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
      {topLevelTasks.length === 0 ? (
        <p>No top-level tasks found.</p>
      ) : (
        topLevelTasks.map((task) => <TaskItem key={task.id} task={task} />)
      )}
    </div>
  );
};
