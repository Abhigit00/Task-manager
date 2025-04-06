import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    tasks:[],
}

const taskSlice = createSlice({
    name:'tasks',
    initialState,
    reducers:{
        addTask: (state, action) => {
            const task = action.payload;
            state.tasks.push({
              ...task,
              id: task._id,
            });
          },
          
    
          setTasks: (state, action) => {
            state.tasks = action.payload.map(task => ({
              ...task,
              id: task._id,
            }));
          },
          
          editTask: (state, action) => {
            const { _id, title, description } = action.payload;
            const task = state.tasks.find(task => task._id === _id);
            if (task) {
              task.title = title;
              task.description = description;
            }
          },
          

        
        deleteTask:(state,action)=>{
            const id = action.payload;
            state.tasks = state.tasks.filter(task=>task.id!==id);
        }
    },


});

export const{addTask,setTasks,editTask,deleteTask} = taskSlice.actions;
export default taskSlice.reducer;

