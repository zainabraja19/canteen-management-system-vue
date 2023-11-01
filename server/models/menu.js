const mongoose = require('mongoose')

const menuSchema = mongoose.Schema({
    itemName: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
        min: 0,
        max: 1000
    },
    isAvailable: {
        type: Boolean,
        default: true
    },
    image: {
        type: Buffer,
    },
    // onlyForToday: {
    //     type: Boolean,
    //     // required: true
    // }
})

const Menu = mongoose.model('Menu', menuSchema)

module.exports = Menu