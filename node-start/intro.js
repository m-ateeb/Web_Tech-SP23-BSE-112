const express = require('express');
const app = express();

app.get('/', (req, res) => {
    res.send('Hi hello ');
});

app.listen(3000, ()=>{
    console.log('server is running is running on ht-tp://localhost:3000 ')
})