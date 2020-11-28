const Card = require('../models/card');

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch((err) => res.status(500).send({ message: err.message }));
};

module.exports.createCard = (req, res) => {
  const { name, link, owner } = req.body;

  Card.create({ name, link, owner })
    .then((cards) => res.send({ data: cards }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Переданы некорректные данные' });
      } else {
        res.status(500).send({ message: 'Ошибка сервера' });
      }
    });
};

module.exports.deleteCard = (req, res) => {
  const currentUserId = req.user._id;
  Card.findById(req.params.id)
    .orFail()
    .then((card) => {
      const owner = card.owner._id.toString();
      if (currentUserId !== owner) {
        res.status(403).send({ message: 'Нельзя удалить чужую карточку' });
      } else {
        Card.deleteOne(card)
          .then(() => res.send({ data: card }))
          .catch((err) => {
            if (err.name === 'CastError') {
              res.status(400).send({ message: 'Некорректный ID' });
            } else {
              res.status(500).send({ message: 'На сервере произошла ошибка' });
            }
          });
      }
    })
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        res.status(404).send({ message: 'Карточки нет в базе.' });
      } else { res.status(500).send({ message: 'На сервере произошла ошибка.' }); }
    });
};
