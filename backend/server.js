const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth.routes.js');

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
