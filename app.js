const bodyParser = require('body-parser');
const express = require('express');
const mongoose = require('mongoose');
const PostUsers = require('./routes/users');
const PostCards = require('./routes/cards');
const auth = require('./middlewares/auth');
const { createUser, login } = require('./controllers/users');

const { PORT = 3000 } = process.env;

const app = express();

mongoose.connect('mongodb://localhost:27017/mydb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.post('/signup', createUser);
app.post('/signin', login);

app.use(auth);

app.use('/', PostUsers);
app.use('/', PostCards);

app.use((req, res) => {
  res.status(404).json(
    { message: 'Запрашиваемый ресурс не найден' },
  );
});

app.listen(PORT);
