// var knexConfig = require('../knexfile')
// var knex = require('knex')(knexConfig[process.env.NODE_ENV || "development"])
var knex = require('./knexOrigin')

module.exports = {

  getDishByDishId: (dishId, cb) => {
    knex.select().where("id", dishId).table("dishes")
      .then( (data) => cb(null, data) )
      .catch( (err) => cb(err) )
  },

  getDishesByEventId: (eventId, cb) => {
    knex('dishes').select('dishes.*', 'users.name as userName')
      .leftJoin('users', 'dishes.userId', '=', 'users.id')
      .where('dishes.eventId', eventId)
      .then( (data) => cb(null, data) )
      .catch( (err) => cb(err) )
  },

  createDish: (dishObj, cb) => {
    knex('dishes').insert(dishObj)
      .then( (data) => cb(null, data))
      .catch( (err) => cb(err) )
  },

  createManyDishes: (manyDishObjs, cb) => {
    knex('dishes').insert(manyDishObjs)
      .then( (data) => cb(null, data))
      .catch( (err) => cb(err) )
  },

  updateDish: (dishId, eventId, dishObj, cb) => {
    knex('dishes').where({'id': dishId, 'eventId': eventId})
    .update(dishObj)
      .then( (data) => cb(null, data))
      .catch( (err) => cb(err) )
  }

}
