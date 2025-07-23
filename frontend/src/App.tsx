import React, { useState } from "react";
import { TaskProvider, useTasks } from "./context/TaskContext";
import { TaskList } from "./components/TaskList";

const Main = () => {
  const [title, setTitle] = useState("");
  const { addTask } = useTasks();

  function handleAddTask() {
    if (title) {
      addTask(title);
      setTitle("");
    }
  }

  return (
    <div
      style={{
        marginInline: "auto",
        maxWidth: "600px",
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        gap: "20px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h1 style={{ textAlign: "center" }}>Task Manager</h1>

      <div
        style={{
          display: "flex",
          gap: "10px",
          flexDirection: "column",
          alignItems: "center",
          border: "1px solid #ccc",
          padding: "20px",
          borderRadius: "8px",
        }}
      >
        <input
          style={{
            width: "100%",
            padding: "10px",
            borderRadius: "4px",
            outline: "none",
            border: "1px solid #ccc",
            boxSizing: "border-box",
            fontSize: "16px",
            transition: "border-color 0.3s",
          }}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="New Task"
        />

        <button
          style={{
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            padding: "10px 20px",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "16px",
          }}
          disabled={!title.trim()}
          onClick={handleAddTask}
        >
          Add Task
        </button>
      </div>

      <TaskList />
    </div>
  );
};

const App = () => (
  <TaskProvider>
    <Main />
  </TaskProvider>
);

export default App;
