// add express dependency
const express = require( 'express' );

//import schema
const TodoModel = require( "../models/todoModel" );

// add routing to express
const router = express.Router();

//index
router.get( "/", ( req, res ) => {
  TodoModel.find( {}, ( err, itemsList ) => {
    if ( err ) return console.log( err );
    res.send( itemsList );
  } );
} );

//show
router.get( "/:id", ( req, res ) => {
  TodoModel.findById( req.params.id, ( err, item ) => {
    if ( err ) return console.log( err );
    res.send( item );
  } );
} );

//create
router.post( "/", ( req, res ) => {
  if ( !req.body.name ) res.send("Name field value missing")
  if ( req.body.name.length < 5 ) res.send("Name field value too short")
  TodoModel.create( {
    name: req.body.name,
    description: req.body.description || "Gotta get this done!",
    completed: req.body.completed || false
  }, ( err, newTodo ) => {
    if ( err )
      return console.log( err );
    res.send( newTodo );
  } );
} );

//update
router.put( "/:id", ( req, res ) => {
  TodoModel.find( { _id: req.params.id }, function ( err, responseFromFind )  {
    if ( err ) return console.log( err );
    let oldItem = responseFromFind[ 0 ];
    // completed field: use new value if given, else use old value
    let completedValue;
    if ( typeof req.body.completed !== "undefined" )
      if ( req.body.completed === "true" ||
        req.body.completed === "false" )
        completedValue = req.body.completed;
      else
        completedValue = oldItem.completed;
    TodoModel.findByIdAndUpdate( req.params.id, {
      name: req.body.name || oldItem.name,
      description: req.body.description || oldItem.description,
      completed: completedValue
    }, { new: true }, ( err, updatedItem ) => {
      if ( err ) return console.log( err );
      res.send( updatedItem );
    } );
  } );
} );

// destroy
router.delete( "/:id", ( req, res ) => {
  TodoModel.findByIdAndRemove( req.params.id, ( err ) => {
    if ( err ) return console.log( err );
    res.json( { message: "deleted" } );
  } );
} );

// destroy all
router.delete( "/", ( req, res ) => {
  TodoModel.remove( {}, ( err ) => {
    if ( err ) return console.log( err );
    res.json( { message: "all deleted" } );
  } );
} );

//export routing in file
module.exports = router;