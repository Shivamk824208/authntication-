const express = require('express');
const connectDB = require('./db');
const dotenv = require('dotenv');
const userRoutes = require('./routes/userRoutes.js');
const cors = require('cors');

dotenv.config();

const PORT = process.env.PORT || 5000;
const app = express();

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));


// connect to database
connectDB();

app.get('/', (req, res) => {
    res.send('my server is running');
});
app.use('/user', userRoutes);


app.listen(PORT, () => {
    console.log(`server is running on http://localhost:${PORT}`);
});
