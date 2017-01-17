const mongoose = require( 'mongoose' );

// make todo schema
const todoSchema = new mongoose.Schema( {
  name: {
    type: String,
    required: true,
    unique: true,
    minlength: 5
  },
  description: String,
  completed: Boolean
} )

const TodoMongModel = mongoose.model( "Todo", todoSchema );

module.exports = TodoMongModel;