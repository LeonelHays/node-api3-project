const express = require('express');
const Users = require('./users-model')
const Posts = require('../posts/posts-model')
// You will need `users-model.js` and `posts-model.js` both
// The middleware functions also need to be required
const { validatePost, validateUserId, validateUser } = require('../middleware/middleware')
const router = express.Router();

router.get('/', (req, res, next) => {
  // RETURN AN ARRAY WITH ALL THE USERS
  Users.get()
    .then(users => {
      res.json(users)
    })
    .catch(next)
});

router.get('/:id', validateUserId,(req, res) => {
  // RETURN THE USER OBJECT
  // this needs a middleware to verify user id
  res.json(req.user)
});

router.post('/', validateUser,(req, res, next) => {
  // RETURN THE NEWLY CREATED USER OBJECT
  // this needs a middleware to check that the request body is valid
  Users.insert({ name: req.name })
    .then(newUser => {
      res.status(201).json(newUser)
    })
    .catch(next)
});

router.put('/:id', validateUserId, validateUser,(req, res, next) => {
  // RETURN THE FRESHLY UPDATED USER OBJECT
  // this needs a middleware to verify user id
  // and another middleware to check that the request body is valid
  Users.update(req.params.id, {name: req.name})
    .then(() => {
      return Users.getById(req.params.id)
    })
    .then(user => {
      res.json(user)
    })
    .catch(next)
});

router.delete('/:id', validateUserId, async (req, res, next) => {
  // RETURN THE FRESHLY DELETED USER OBJECT
  // this needs a middleware to verify user id
  try{
    await Users.remove(req.params.id)
    res.json(req.user)
  }catch(err){
    next(err)
  }
});

router.get('/:id/posts', validateUserId, async (req, res, next) => {
  // RETURN THE ARRAY OF USER POSTS
  // this needs a middleware to verify user id
  try{
   const post = await Users.getUserPosts(req.params.id)
    res.json(post)
  }catch(err){
    next(err)
  }
});

router.post('/:id/posts', validateUserId, validatePost, async (req, res, next) => {
  // RETURN THE NEWLY CREATED USER POST
  // this needs a middleware to verify user id
  // and another middleware to check that the request body is valid
  try{
    const newPost = await Posts.insert({
      user_id: req.params.id,
      text: req.text,
    })
    res.status(201).json(newPost)
  }catch(err){
    next(err)
  }
});

router.use((err, req, res, next) => { // eslint-disable-line
  res.status(err.status || 500).json({
    customMessage: 'somthing tragic inside the router happend',
    message: err.message,
    stack: err.stack,
  })
})

// do not forget to export the router
module.exports = router;