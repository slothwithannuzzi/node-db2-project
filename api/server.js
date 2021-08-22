const express = require("express")

const server = express()

const CarsRouter = require('./cars/cars-router')

server.use(express.json());

server.use('/api/cars', CarsRouter)

server.get('/', (req,res) => {
    res.status(200).json("this is a server")
})

module.exports = server
