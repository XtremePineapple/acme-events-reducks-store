const faker = require('faker');
faker.locale = 'en_US';
const Sequelize = require('sequelize');
const conn = new Sequelize(process.env.DATABASE_URL || 'postgres://localhost/acme_event_store_db');
const Event = conn.define('event', {
  name: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: { notEmpty: true }
  }, 
  date: {
    type: Sequelize.DATE,
    allowNull: false
  }
});


Event.createRandom = function(){ return Event.create({ name: `${faker.lorem.sentences(1)} - ${faker.address.state()}`, date: faker.date.future() }); }

const events = [];

const syncAndSeed = async () =>{
  conn.sync({ force: true })
  .then(()=> {
    while(events.length < 10){
      events.push(Event.createRandom());
    }
    return Promise.all(events);
  });
}

const createOne = async () => {
  events.push(Event.createRandom());
  return Promise.all(events);
}

module.exports = {
    createOne,
    syncAndSeed, 
    models: {
      Event
    }
}