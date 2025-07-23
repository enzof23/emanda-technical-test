import React, { useCallback, useState } from "react";
import { Task } from "../types";
import { fetchSubtasks } from "../api";
import { useTasks } from "../context/TaskContext";
import { SquareChevronUp, SquareChevronDown } from "lucide-react";

export const TaskItem: React.FC<{ task: Task }> = ({ task }) => {
  const [showSubtasks, setShowSubtasks] = useState<boolean>(false);

  const [subtasks, setSubtasks] = useState<Task[]>([]);

  const [subtasksFetched, setSubtasksFetched] = useState<boolean>(false);
  const [fetchSubtaskLoading, setFetchSubtaskLoading] = useState<boolean>(false);
  const [fetchSubtaskError, setFetchSubtaskError] = useState<string | null>(null);

  const loadSubtasks = useCallback(async () => {
    if (subtasksFetched) return;

    setFetchSubtaskLoading(true);
    setFetchSubtaskError(null);

    try {
      const fetchedSubtasks = await fetchSubtasks(task.id);
      setSubtasks(fetchedSubtasks);
      setSubtasksFetched(true);
    } catch (error) {
      setFetchSubtaskError("Failed to load subtasks. Please try again.");
      console.log("Error fetching subtasks:", error);
    } finally {
      setFetchSubtaskLoading(false);
    }
  }, [task.id, subtasksFetched]);

  const handleDisplaySubtask = async () => {
    const shouldShow = !showSubtasks;
    setShowSubtasks(shouldShow);

    if (!subtasksFetched && shouldShow) {
      await loadSubtasks();
    }
  };

  return (
    <div
      style={{
        border: "1px solid #ccc",
        borderRadius: "8px",
        paddingInline: "1rem",
        backgroundColor: task.parent ? "#f9f9f9" : "#fff",
        marginLeft: task.parent ? "2rem" : "0",
      }}
    >
      <button
        onClick={handleDisplaySubtask}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
          background: "none",
          border: "none",
          padding: "1rem 0",
          cursor: "pointer",
        }}
      >
        <p style={{ fontWeight: "bold", fontSize: "18px", margin: 0 }}>
          {task.title.charAt(0).toUpperCase() + task.title.slice(1)}
        </p>

        {showSubtasks ? <SquareChevronUp /> : <SquareChevronDown />}
      </button>

      {showSubtasks && (
        <div
          style={{
            paddingBlock: "0.5rem 1rem",
            display: "flex",
            flexDirection: "column",
            gap: "0.5rem",
          }}
        >
          {fetchSubtaskError && (
            <div
              style={{
                display: "flex",
                gap: "0.5rem",
                alignItems: "center",
                justifyContent: "space-between",
                color: "#d32f2f",
                fontSize: "0.875rem",
                marginBottom: "0.5rem",
                padding: "0.5rem 1rem",
                backgroundColor: "#ffebee",
                borderRadius: "4px",
              }}
            >
              {fetchSubtaskError}
              <button
                onClick={loadSubtasks}
                style={{
                  background: "none",
                  border: "1px solid #d32f2f",
                  borderRadius: "4px",
                  padding: "0.5rem 1rem",
                  cursor: "pointer",
                  color: "#d32f2f",
                  fontWeight: "bold",
                }}
              >
                Retry
              </button>
            </div>
          )}

          {fetchSubtaskLoading && !fetchSubtaskError ? (
            <div style={{ color: "#666" }}>Loading subtasks...</div>
          ) : subtasks && subtasks.length > 0 ? (
            <>
              <ul style={{ margin: 0, paddingLeft: "1.5rem" }}>
                {subtasks
                  .sort((a, b) => a.id - b.id)
                  .map((subtask) => (
                    <li key={subtask.id} style={{ marginBottom: "0.25rem" }}>
                      <strong>{subtask.title}</strong>
                    </li>
                  ))}
              </ul>

              <SubtaskForm setSubtasks={setSubtasks} task={task} />
            </>
          ) : (
            <>
              <p
                style={{
                  color: "#666",
                  fontStyle: "italic",
                  margin: "0.5rem 0",
                }}
              >
                No subtasks found.
              </p>

              <SubtaskForm setSubtasks={setSubtasks} task={task} />
            </>
          )}
        </div>
      )}
    </div>
  );
};

const SubtaskForm: React.FC<{
  task: Task;
  setSubtasks: React.Dispatch<React.SetStateAction<Task[]>>;
}> = ({ task, setSubtasks }) => {
  const { addTask } = useTasks();
  const [addingSubtask, setAddingSubtask] = useState<boolean>(false);

  const [title, setTitle] = useState<string>("");
  const [addSubtaskLoading, setAddSubtaskLoading] = useState<boolean>(false);
  const [addSubtaskError, setAddSubtaskError] = useState<string | null>(null);

  const addSubtask = useCallback((newSubtask: Task) => {
    setSubtasks((prev) => [...prev, newSubtask]);
  }, []);

  const handleAddSubtask = async () => {
    if (!title) {
      setAddSubtaskError("Please enter a task title.");
      return;
    }

    setAddSubtaskLoading(true);
    setAddSubtaskError(null);

    try {
      const newSubtask = await addTask(title, task.id);
      setTitle("");
      setAddingSubtask(false);

      addSubtask(newSubtask);
    } catch (error) {
      setAddSubtaskError("Failed to add subtask. Please try again.");
      console.log("Error adding subtask:", error);
    } finally {
      setAddSubtaskLoading(false);
    }
  };

  const handleCancelAddSubtask = () => {
    setAddingSubtask(false);
    setTitle("");
    setAddSubtaskError(null);
  };

  return (
    <>
      {!addingSubtask ? (
        <button
          style={{
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            padding: "0.5rem 1rem",
            alignSelf: "flex-end",
          }}
          onClick={() => setAddingSubtask(true)}
        >
          Add Subtask
        </button>
      ) : (
        <>
          {addSubtaskError && (
            <div
              style={{
                display: "flex",
                gap: "0.5rem",
                alignItems: "center",
                justifyContent: "space-between",
                color: "#d32f2f",
                fontSize: "0.875rem",
                marginBottom: "0.5rem",
                padding: "0.75rem",
                backgroundColor: "#ffebee",
                borderRadius: "4px",
              }}
            >
              {addSubtaskError}
            </div>
          )}

          <div
            style={{
              display: "flex",
              gap: "0.25rem",
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="New Task"
              disabled={addSubtaskLoading}
              style={{
                flex: "1",
                minWidth: "200px",
                padding: "0.5rem",
                border: "1px solid #ccc",
                borderRadius: "4px",
                outline: "none",
              }}
              autoFocus
            />

            <button
              onClick={handleAddSubtask}
              disabled={addSubtaskLoading || !title.trim()}
              style={{
                backgroundColor: addSubtaskLoading ? "#ccc" : "#007bff",
                color: "white",
                border: "none",
                padding: "0.5rem 1rem",
                borderRadius: "4px",
                cursor: addSubtaskLoading ? "not-allowed" : "pointer",
              }}
            >
              {addSubtaskLoading ? "Adding..." : "Add Subtask"}
            </button>

            <button
              onClick={handleCancelAddSubtask}
              disabled={addSubtaskLoading}
              style={{
                backgroundColor: addSubtaskLoading ? "#ccc" : "#6c757d",
                color: "white",
                border: "none",
                padding: "0.5rem 1rem",
                borderRadius: "4px",
                cursor: addSubtaskLoading ? "not-allowed" : "pointer",
              }}
            >
              Cancel
            </button>
          </div>
        </>
      )}
    </>
  );
};
