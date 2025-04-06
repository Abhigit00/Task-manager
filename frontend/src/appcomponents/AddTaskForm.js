import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { addTask } from "../redux/taskSlice";
import api from "../services/api"; 
import styles from "./AddTask.module.css";

const AddTaskForm = () => {
  const dispatch = useDispatch();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      const res = await api.post("/tasks", { title, description });
      const newTask = res.data;
      dispatch(addTask(newTask));
      setTitle("");
      setDescription("");
    } catch (err) {
      console.error("Error adding task:", err);
    }
  };

  return (
    <div className={styles.addTaskFormContainer}>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Task Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <textarea
          placeholder="Task Description..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <button type="submit">Add Task</button>
      </form>
    </div>
  );
};

export default AddTaskForm;
