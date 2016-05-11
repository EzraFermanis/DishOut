var express = require('express')
var router = express.Router()
var Event = require('../db/events')
var Host = require("../db/hosts")
var Dish = require("../db/dishes")
var Guest = require("../db/guests")
var User = require("../db/users")

/***************************************
**********   GETS   *******************
***************************************/

// Go to the 'Create an Event' page
router.get('/new', (req, res) => {
  console.log('### GET /event/new')
  res.render('event_new')
})

// Go to the 'Add dish to an Event' page
router.get('/:id/dish/new', (req, res) => {
  var userId = req.session.passport.user
  var eventId = req.params.eventId
  console.log('### GET /event/:id/dish/new', 'UserId', userId, 'EventId', eventId)

  Dish.getDishesByEventId(eventId,
    (err, dishes) => {
    if (err) return console.log('Failed getDishesByEventId', err)

    console.log('Success getDishesByEventId', dishes)
    res.render('event_dish_new', {
      'eventId': eventId,
      'dishes': dishes
}) }) })

// Go to the 'Invite a Guest to an Event' page
router.get('/:id/guest/new', (req, res) => {
  var userId = req.session.passport.user
  var eventId = req.params.eventId
  console.log('### GET /event/:id/guest/new', 'EventId', eventId)

  Guest.getGuestsByEventId(eventId,
    (err, guests) => {
    if (err) return console.log('Failed getGuestsByEventId', err)

    console.log('Success getGuestsByEventId', guests)
    res.render('event_guest_new', {
      eventId: eventId,
      guests: guests
}) }) })

// Show Event page
router.get('/:id/show', (req, res) => {
  var eventId = req.params.id
  var pageViewer = req.session.passport.user
  console.log('### GET /event/:id/show', 'UserId Viewing this page:', pageViewer, 'EventId:', eventId)

  Event.getEventById(eventId,
    (err, event) => {
    if (err) return console.log('Failed getEventById', err)

    console.log('Success getEventById', event)
    Dish.getDishesByEventId(eventId,
      (err, dishes) => {
      if (err) return console.log('Failed getDishesByEventId', err)

      console.log('Success getDishesByEventId', dishes)
      Guest.getGuestsByEventId(eventId,
        (err, guests) => {
        if (err) return console.log('Failed getGuestsByEventId', err)

        console.log('Success getGuestsByEventId', guests)
        res.render('event_show', {
          "pageViewer": pageViewer,
          "event": event,
          "dishes": dishes,
          "guests": guests
}) }) }) }) })


/***************************************
**********   POSTS   *******************
***************************************/

// Creating event
router.post('/create', (req, res) => {
  var eventId = req.params.id
  var userId = req.session.passport.user
  console.log('### POST /event/create', 'EventId', eventId, 'UserId', userId)

  Event.createEvent({
      "name": req.body.name,
      "date": req.body.date,
      "time": req.body.time,
      "description": req.body.description,
      "location": req.body.location,
      "bitcoinAddress":req.body.bitcoinAddress
    },
    (err, eventId) => {
      if (err) return console.log('Error creating event', err)

      console.log('Event successfully created', eventId, userId)
      Host.createHost({
        'eventId': eventId,
        'userId': userId
        },
        (err, hostId) => {
          if (err) return console.log('Error adding to Hosts table', err)

          console.log('Event successfully added to Hosts', hostId)
          res.redirect('/event/' + eventId + '/dish/new')
}) }) })


router.post('/:id/dish/create', (req, res) => {
  var eventId = req.params.id
  var userId = req.session.passport.user
  console.log('### POST /event/:id/dish/create', 'EventId', eventId)

  Dish.createDish({
      eventId: req.body.eventId,
      course: req.body.course,
      name: req.body.dishname
    },
    (err, data) => {
      if (err) return console.log('Error createDish', err)

      console.log('Success', data)
      res.redirect('/event/' + eventId + '/dish/new')
}) })


router.post('/:id/guest/create', (req, res) => {
  var eventId = req.params.id
  var userId = req.session.passport.user
  console.log('### POST /event/:id/guest/create', 'EventId', eventId)

  var query = {}
  if (req.body.email) {
    query.email = req.body.email
  } else {
    query.name = req.body.name
  }

  User.getUserByEmailOrName(query,
    (err, user) => {
      if (err) return console.log('Failed getUserByEmail', err)

      console.log("Successful getUserByEmail", user)
      Guest.createGuest({
          'eventId': req.body.eventId,
          'userId': user.id
        },
        (err, guestId) => {
          if (err) return console.log('Failed createGuest', err)

          console.log("Successful createGuest", guestId)
          res.redirect('/event/' + eventId + '/guest/new')
}) }) })

/***************************************
**********   UPDATE   *******************
***************************************/


router.post('/:id/edit', (req, res) => {
  var eventId = req.params.id
  console.log('### POST /event/:id/edit', 'EventId', eventId)

  res.redirect('/event/' + eventId)
})

module.exports = router
