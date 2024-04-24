const mongoose = require('mongoose')
const { Schema, model } = mongoose


const exerciseSchema = new Schema({
    description: { type: String, required: true },
    duration: { type: Number, required: true },
    date: { type: Date, default: Date.now }
})

const userSchema = new Schema({
    username: { 
        type: String, 
        required: true, 
        unique: true 
    },
    log: [exerciseSchema]
})

const User = model('User', userSchema)
module.exports = User