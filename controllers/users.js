const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

module.exports.getAllUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch((err) => res.status(500).send({ message: err.message }));
};

module.exports.getSingleUser = (req, res) => {
  User.findById(req.params.id)
    .orFail(new Error('NotFound'))
    .then((users) => res.send({ data: users }))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: 'Переданы некорректные данные.' });
      } else if (err.message === 'NotFound') {
        res.status(404).send({ message: 'Пользователя нет в базе.' });
      } else {
        res.status(500).send({ message: 'Произошла ошибка.' });
      }
    });
};

// eslint-disable-next-line consistent-return
module.exports.createUser = (req, res) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  const pattern = new RegExp(/^[A-Za-z0-9]{8,}$/);
  if (!pattern.test(password)) {
    return res.status(400).send({ message: 'Пароль должен состоять из заглавных и строчных букв, цифр, не содержать пробелов и быть как минимум 8 символов в длину.' });
  }

  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    }))
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Переданы некорректные данные' });
      } else {
        res.status(500).send({ message: 'Ошибка сервера' });
      }
    });
};
// $2a$10$8.K0fKmiNyynUANpgSj8H.4LF7QZSq5DFE9jzn2CBEOWqXq4Jud36

module.exports.login = (req, res) => {
  const { email, password } = req.body;
  User.findOne({ email }).select('password')
    // eslint-disable-next-line consistent-return
    .then((user) => {
      if (!user) {
        return res.status(401).send({ message: 'Неправильно введена почта' });
      }
      return bcrypt.compare(password, user.password);
    })
    .then((matched) => {
      if (!matched) {
        res.status(401).send({ message: 'Неправильно введён пароль' });
      }
      const token = jwt.sign({
        _id: User._id,
      }, 'secret-key', { expiresIn: 3600 * 24 * 7 });
      return res.status(201).send({ message: `Токен: ${token}` });
    })
    .catch((err) => {
      res.status(401).send({ message: `Что-то пошло не так: ${err}` });
    });
};
