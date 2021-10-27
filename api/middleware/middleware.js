const User = require('../users/users-model')

function logger(req, res, next) {
  const date = new Date();
  console.log(`
    REQUEST METHOD: ${req.method}
    REQUEST URL: ${req.originalUrl}
    TIMESTAMP: ${date.toLocaleString()}
  `);
  next()
}

async function validateUserId(req, res, next) {
  // DO YOUR MAGIC
  try{
    const possible = await User.getById(req.params.id)
    if(possible) {
      req.user = possible
      next()
    } else {
      next({ status: 404, message: "user not found" })
    }
  }catch (err) {
    next(err)
  }
}

function validateUser(req, res, next) {
  // DO YOUR MAGIC
  const {name} = req.body
  if(!name){
    res.status(400).json({ message: "missing required name field"})
  }else{
    req.name = name.trim()
    next()
  }
}

function validatePost(req, res, next) {
  // DO YOUR MAGIC
  const {text} = req.body
  if(text && text.trim().length > 0){
      req.text = text.trim()
      next()
  }else{
    next({ status: 400, message: "missing required text field"})
  }
}

// do not forget to expose these functions to other modules
module.exports = {
  logger,
  validateUser,
  validateUserId,
  validatePost
}