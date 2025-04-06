import {BrowserRouter , Routes, Route} from 'react-router-dom';
import './App.css';
import Kanban from './appcomponents/Kanban';
import Register from './appcomponents/Register';
import Login from './appcomponents/Login';
import {ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AddTaskForm from './appcomponents/AddTaskForm';


function App() {
  return (
    <BrowserRouter>
    <ToastContainer/>
      <Routes>
        <Route path='/' element={<Register/>}/>
        <Route path='/login' element={<Login/>}/>



        <Route path='/home' element={
          <div>
             <h1 style={{ textAlign: "center", margin: "20px 0", color: "#2c3e50" }}>
        Task Manager
      </h1>
          <AddTaskForm/>
          <Kanban/>
        </div>
          }
        />
        

      </Routes>

    

    </BrowserRouter>
  );
}

export default App;
