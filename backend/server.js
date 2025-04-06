require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const taskRoutes = require('./routes/taskRoutes')
const authRoutes = require('./routes/authRoutes')

const app = express();
const PORT = process.env.PORT;

app.use(cors());
app.use(express.json());

app.use('/api/tasks', taskRoutes);
app.use('/api/auth',authRoutes);


mongoose.connect(process.env.MONGO_URL)
.then(()=>{
    console.log('Connected to Database');
    app.listen(PORT,()=>console.log(`Server running on port ${PORT}`));
    })
    .catch(()=>console.log('Database connection error',err)
    );


