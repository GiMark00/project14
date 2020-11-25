const PostUsers = require('express').Router();
const {
  getAllUsers, getSingleUser,
} = require('../controllers/users');

PostUsers.get('/users', getAllUsers);
PostUsers.get('/users/:id', getSingleUser);

module.exports = PostUsers;
