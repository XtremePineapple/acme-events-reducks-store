
const path = require('path');
const express = require('express');
const app = express();
const db = require('./db');
const { Event } = db.models;
const port = process.env.PORT || 3000;


    

app.get('/', (req, res, next)=> res.sendFile(path.join(__dirname, 'index.html')));

app.get('/api/events', (req, res, next)=> {
  Event.findAll()
    .then(events => res.send(events))
    .catch(next);
});

app.post('/api/events', (req, res, next)=> {
  Event.createRandom()
    .then(_event => res.status(201).send(_event))
    .catch(next);
});

app.delete('/api/events/:id', (req, res, next)=> {
  Event.findByPk(req.params.id)
    .then(_event => _event.destroy())
    .then(()=> res.sendStatus(204))
    .catch(next);
});


db.syncAndSeed()
    .then(() => {
        app.listen(port, () => console.log(`listening on port ${port}`))
    })