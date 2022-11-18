const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');
const cookieParser = require('cookie-parser');
const {requireAuth, checkUser} = require('./middleware/authMiddleware');
const path  = require('path');
const hbs = require('hbs');
const dotenv = require('dotenv');
dotenv.config();
require("./db/conn.js");
const app = express();
const port = 5000;

// middleware
app.use(express.static(__dirname + '/public'));
app.use(express.json()); //takes json data and passes it as javascript object to the request handler 
app.use(cookieParser());
app.set("view engine","hbs");
app.set("views",path.join(__dirname,"/templates/views")); //Uses template engine as handlebars

const partialsPath = path.join(__dirname,"/templates/partials")
hbs.registerPartials(partialsPath);
app.use(authRoutes);


//routes
// app.get('/set-cookies',(req,res)=>{
//     res.cookie('newUser',false);
//     res.cookie('isEmployee',true,{maxAge : 1000*60*60*24, httpOnly: true});
//     res.send("You got the cookies !!");

// });

// app.get('/read-cookies',(req,res)=>{
//     const cookies = req.cookies;
//     console.log(cookies);
//     res.json(cookies);
// })

app.get('*',checkUser);
app.get('/',(req,res)=>{
    res.render('index.hbs');
})
app.get('/projects',requireAuth,(req,res)=>{
    res.render('projects.hbs');
})

app.listen(port,()=>{
    console.log(`Listening at ${port}`);
});

