const express = require('express');
const usersRouter = require('./users/users-router')
const server = express();
const {logger} = require('./middleware/middleware')
// remember express by default cannot parse JSON in request bodies
server.use(express.json())

server.use('/api/users', usersRouter)
// global middlewares and the user's router need to be connected here
server.use(logger)
server.get('/', (req, res) => {
  res.send(`<h2>Let's write some middleware!</h2>`);
});

server.use('*', (req, res) => {
  res.status(404).json({ message: `${req.method} ${req.baseUrl} not found!` })
})

module.exports = server;

