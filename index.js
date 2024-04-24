const express = require('express')
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser')
const connectDB = require('./database')
const mongoose = require('mongoose')

require('dotenv').config()

connectDB()
const User = require('./src/model/User')

app.use(cors())
app.use(express.static('public'))

app.use(bodyParser.urlencoded({ extended: 'false' }))
app.use(bodyParser.json())

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
})

app.post('/api/users', (req, res) => {
  const username = req.body.username
  const user = new User({
    username: username
  })

  user.save()
  res.json(user)
})

const findUserById = (userId) => {
  const user = User.findById(userId)
  return user
};

app.post('/api/users/:_id/exercises', (req, res) => {
  const userId = req.params._id
  const postData = req.body
  const exerciseData = {
    description: postData.description,
    duration: postData.duration,
    date: postData.date || new Date().toISOString().split('T')[0]
  }

  User.findByIdAndUpdate(
    userId,
    {
      $push: {
        log: {
          $each: [exerciseData], 
          $position: 0
        }
      }
    },
    { new: true, safe: true, upsert: false },
  )
  .then(updatedUser => {
    const response = {
      username: updatedUser.username,
      description: updatedUser.log[0].description,
      duration: updatedUser.log[0].duration,
      date: updatedUser.log[0].date.toDateString(), 
      _id: updatedUser._id
    };

    return res.json(response)
  })
  .catch(err => {
    console.error(err)        // Handle possible errors
  });
})

app.get('/api/users/:_id/logs', (req, res) => {
  const userId = req.params._id
  const limit  = req.query.limit ?? 10

  const from = req.query.from ? new Date(req.query.from) : new Date()
  from.setHours(0, 0, 0, 0)
  const to = req.query.to ? new Date(req.query.to) : new Date()
  to.setHours(23, 59, 59, 999)

  let parsedLimit = parseInt(limit, 10)

  if (isNaN(parsedLimit) || parsedLimit < 1) {
      return res.status(400).send('Invalid limit value')
  }

  User.aggregate([
    { $match: { _id: new mongoose.Types.ObjectId(userId) } },
    { $unwind:  '$log' },
    { $match: { 'log.date': { $gte: from, $lte: to } } },
    {
      $group: {
        _id: '$_id',
        count: { $sum: 1 },
        logs: { $push: '$log' }
      }
    },
    { $limit : parsedLimit }
  ])
  .then(result => {
    return res.json(result)
  })
  .catch(err => {
    console.error(err)
    res.status(500).json({ message: 'Failed to fetch logs' })
  });
})

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
