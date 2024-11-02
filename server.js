const express = require('express');
const app = express();


app.get("/" , (req, res) =>{
    res.send("api Running...");
});


const PORT = process.env.PORT || 5000;

app.listen(PORT, ()=>{
    console.log(`Server Started On port ${PORT}`);
})