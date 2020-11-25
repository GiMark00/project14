const PostCards = require('express').Router();
const { getCards, createCard, deleteCard } = require('../controllers/cards');

PostCards.get('/cards', getCards);
PostCards.post('/cards', createCard);
PostCards.delete('/cards/:id', deleteCard);

module.exports = PostCards;
