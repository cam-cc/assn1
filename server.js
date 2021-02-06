/*********************************************************************************
*  WEB422 – Assignment 1
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  
*  No part of this assignment has been copied manually or electronically from any other source
*  (including web sites) or distributed to other students.
* 
*  Name: Cameron Coenjarts Student ID: 162263172 Date: 1/22/2021
*  Heroku Link: https://camccapi.herokuapp.com/
*
********************************************************************************/ 

//Assignment 1

const express = require("express");
const cors = require("cors");
const bodyParser = require('body-parser');
const app = express();

const HTTP_PORT = process.env.PORT || 8080;

const RestaurantDB = require("./modules/restaurantDB.js");
const db = new RestaurantDB("mongodb+srv://dbUser:Password123@cluster0.a9igm.mongodb.net/sample_restaurants?retryWrites=true&w=majority");

db.initialize().then(()=>{
    app.listen(HTTP_PORT, ()=>{
        console.log(`server listening on: ${HTTP_PORT}`);
    });
}).catch((err)=>{
    console.log(err);
});

app.use(bodyParser.json());

app.use(cors());

app.post("/api/restaurants",async(req,res) => {
    var data = req.body;
    try {
        const message = await db.addNewRestaurant(data);
        return res.status(201).send(JSON.stringify({ message }));
    } catch (error) {
        return res.status(400).send({message: error});
    }
})

app.get("/api/restaurants",async (req, res) => {
    var page = req.query.page;
    var perPage = req.query.perPage;
    var borough = req.query.borough;
    try {
        const message = await db.getAllRestaurants(page, perPage, borough);
        return res.status(202).send(JSON.stringify({ message : message}));
    } catch (error) {
        return res.status(400).send({message: error});
    }
})
app.get("/api/restaurants/:id",async (req, res) => {
    var id = req.params.id;
    try {
        const message = await db.getRestaurantById(id);
        return res.status(202).send(JSON.stringify({ message }));
    } catch (error) {
        return res.status(400).send({message: error});
    }
})
app.put("/api/restaurants/:id", async (req, res) => {
    var id = req.params.id;
    const data = req.body;
    if(!data)
        return res.send(409).send({message: 'Data needed to update restaurants'});
    try {
        const message = await db.updateRestaurantById(data,id);
        return res.status(202).send({message});
    } catch (error) {
        return res.status(400).send({message: 'oops, something went wrong'});
    }
})
app.delete("/api/restaurants/:id",async (req, res) => {
    var id = req.params.id;
    try {
        const message = await db.deleteRestaurantById(id);
        return res.status(202).send({message});
    } catch (error) {
        return res.status(400).send({message: error});
    }
})
