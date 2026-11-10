import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

const API = "https://your-backend-name.onrender.com/tasks";
function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Fetch all tasks
  const fetchTasks = async () => {
    try {
      const response = await axios.get(API);
      setTasks(response.data);
      setError("");
    } catch (err) {
      setError("Could not fetch tasks. Check the backend.");
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // Add a task
  const createTask = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      setError("Please enter a task title.");
      return;
    }

    try {
      await axios.post(API, { title });
      setTitle("");
      setError("");
      setSuccess("Task added successfully!");
      fetchTasks();
    } catch (err) {
      setError("Could not add task.");
    }
  };

  // Update task status
  const updateTaskStatus = async (id, status) => {
    try {
      await axios.patch(`${API}/${id}`, { status });
      setSuccess("Task status updated!");
      setError("");
      fetchTasks();
    } catch (err) {
      setError("Could not update task.");
    }
  };

  // Delete a task
  const deleteTask = async (id) => {
    try {
      await axios.delete(`${API}/${id}`);
      setSuccess("Task deleted successfully!");
      setError("");
      fetchTasks();
    } catch (err) {
      setError("Could not delete task.");
    }
  };

  return (
    <div className="container py-5">
      <h1 className="text-center mb-4">
        Project Task Management
      </h1>

      <p className="text-center text-muted">
        Organize and track your project tasks
      </p>

      {error && (
        <div className="alert alert-danger">{error}</div>
      )}

      {success && (
        <div className="alert alert-success">{success}</div>
      )}

      <form className="input-group mb-4" onSubmit={createTask}>
        <input
          className="form-control"
          type="text"
          placeholder="Enter task title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <button className="btn btn-primary" type="submit">
          Add Task
        </button>
      </form>

      <div className="row">
        {["Pending", "Ongoing", "Completed"].map((status) => {
          const filteredTasks = tasks.filter(
            (task) => task.status === status
          );

          return (
            <div className="col-md-4 mb-4" key={status}>
              <div className="card h-100">
                <div className={`card-header ${status.toLowerCase()}`}>
                  <h5 className="mb-0">{status} Tasks</h5>
                  <span>{filteredTasks.length} tasks</span>
                </div>

                <div className="card-body">
                  {filteredTasks.length === 0 && (
                    <p className="text-muted">
                      No tasks in this category.
                    </p>
                  )}

                  {filteredTasks.map((task) => (
                    <div className="task-item mb-3" key={task._id}>
                      <h6>{task.title}</h6>
                      <p className="text-muted">
                        Status: {task.status}
                      </p>

                      {task.status !== "Pending" && (
                        <button
                          className="btn btn-sm btn-outline-secondary me-2 mb-2"
                          onClick={() =>
                            updateTaskStatus(task._id, "Pending")
                          }
                        >
                          Pending
                        </button>
                      )}

                      {task.status !== "Ongoing" && (
                        <button
                          className="btn btn-sm btn-info me-2 mb-2"
                          onClick={() =>
                            updateTaskStatus(task._id, "Ongoing")
                          }
                        >
                          Ongoing
                        </button>
                      )}

                      {task.status !== "Completed" && (
                        <button
                          className="btn btn-sm btn-success me-2 mb-2"
                          onClick={() =>
                            updateTaskStatus(task._id, "Completed")
                          }
                        >
                          Complete
                        </button>
                      )}

                      <button
                        className="btn btn-sm btn-danger mb-2"
                        onClick={() => deleteTask(task._id)}
                      >
                        Delete
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default App;