const express = require('express');
require('dotenv').config();
const app = express();
const cors = require('cors');
const airoutes = require('./routes/airoutes');


app.use(express.json());
app.use(cors());
app.use('/api', airoutes);



app.listen(3001, () => {
    console.log('Server is running on port 3001');
});
