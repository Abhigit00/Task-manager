import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { setTasks, editTask, deleteTask } from "../redux/taskSlice";
import api from "../services/api";
import styles from "./Kanban.module.css";

const Kanban = () => {
  const dispatch = useDispatch();
  const tasks = useSelector((state) => state.tasks.tasks);

  const [editingTask, setEditingTask] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await api.get("/tasks");
        dispatch(setTasks(response.data));
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

    fetchTasks();
  }, [dispatch]);

  const getColumns = () => ({
    todo: tasks.filter((task) => task.status === "todo"),
    "in-progress": tasks.filter((task) => task.status === "in-progress"),
    completed: tasks.filter((task) => task.status === "completed"),
  });

  const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
  };

  const handleDrag = async (result) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;
  
    const draggedTask = tasks.find((task) => task._id === draggableId);
    if (!draggedTask) return;
  
    if (destination.droppableId !== source.droppableId) {
      try {
        const updatedTask = {
          ...draggedTask,
          status: destination.droppableId,
        };
  
        const response = await api.put(`/tasks/${draggedTask._id}`, updatedTask);
  
        const updatedTasks = tasks.map((task) =>
          task._id === draggedTask._id ? response.data : task
        );
  
        dispatch(setTasks(updatedTasks));
      } catch (error) {
        console.error("Error updating task status:", error);
      }
    } else {
      const colTasks = tasks.filter((task) => task.status === source.droppableId);
      const reorderedColTasks = reorder(colTasks, source.index, destination.index);
  
      let reorderedIndex = 0;
      const newTasks = tasks.map((task) => {
        if (task.status === source.droppableId) {
          return reorderedColTasks[reorderedIndex++];
        }
        return task;
      });
  
      dispatch(setTasks(newTasks));
    }
  };
  

  const handleEdit = (task) => {
    setEditingTask(task);
    setEditTitle(task.title);
    setEditDescription(task.description);
  };

  const handleUpdate = async () => {
    try {
      const response = await api.put(`/tasks/${editingTask._id}`, {
        title: editTitle,
        description: editDescription,
      });
      dispatch(editTask(response.data));
      setEditingTask(null);
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/tasks/${id}`);
      dispatch(deleteTask(id));
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const columns = getColumns(); 

  return (
    <div>
      {editingTask && (
        <div className={styles.modal}>
          <h3>Edit Task</h3>
          <input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            placeholder="Edit title"
          />
          <br />
          <textarea
            value={editDescription}
            onChange={(e) => setEditDescription(e.target.value)}
            placeholder="Edit description"
          />
          <br />
          <button onClick={handleUpdate}>Save</button>
          <button onClick={() => setEditingTask(null)}>Cancel</button>
        </div>
      )}

      <DragDropContext onDragEnd={handleDrag}>
        <div className={styles.boardContainer}>
          {Object.keys(columns).map((columnId) => (
            <Droppable droppableId={columnId} key={columnId}>
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={`${styles.column}  
                    ${columnId === "todo" ? styles.todoColumn : ""}
                    ${columnId === "in-progress" ? styles.inProgressColumn : ""}
                    ${columnId === "completed" ? styles.completedColumn : ""}
                    ${snapshot.isDraggingOver ? styles.columnDraggingOver : ""}`}
                >
                  <h2 className={styles.columnTitle}>{columnId.toUpperCase()}</h2>

                  <div className={styles.taskList}>
                    {columns[columnId].map((task, index) => (
                      <Draggable key={task._id} draggableId={task._id} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`${styles.taskCard} ${
                              snapshot.isDragging ? styles.taskCardDragging : ""
                            }`}
                          >
                            <h4>{task.title}</h4>
                            <p>{task.description}</p>
                            <button onClick={() => handleEdit(task)}>Edit</button>
                            <button onClick={() => handleDelete(task._id)}>Delete</button>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
};

export default Kanban;
