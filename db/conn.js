const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/webProject')
.then(()=>{
    console.log("Connected succesfully to the database");
}).catch((err)=>
{
    console.log(" Connected failed to the database");

});

