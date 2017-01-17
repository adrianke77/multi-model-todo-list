// add express dependency
const express = require( 'express' );

//import schema
const TodoModel = require( "../models/todoModel" );

// add routing to express
const router = express.Router();

//show create form
router.get( "/make", ( req, res ) => {
  res.render( "createform", { error: null } );
} )

//index
router.get( "/", ( req, res ) => {
  TodoModel.find( {}, ( err, itemsList ) => {
    if ( err ) return console.log( err );
    completionStatus = [];
    itemsList.forEach( ( val, ind ) => {
      val.completed === true ?
        completionStatus[ ind ] = "Done!" :
        completionStatus[ ind ] = "Not done"
    } )
    res.render( "listall", {
      data: itemsList,
      completionStatus: completionStatus
    } );
  } );
} );

//show
router.get( "/show/:id", ( req, res ) => {
  TodoModel.findById( req.params.id, ( err, item ) => {
    if ( err ) return console.log( err );
    let completionStatus = "";
    item.completed === true ?
      completionStatus = "Done!" :
      completionStatus = "Not done"
    res.render( "item", {
      data: item,
      completionStatus: completionStatus
    } );
  } );
} );

//create
router.post( "/", ( req, res ) => {
  TodoModel.create( {
    name: req.body.name,
    description: req.body.description || "",
    completed: req.body.completed === "on" ? true : false
  }, ( err, newTodo ) => {
    if ( err ) {
      res.render( "createform", {
        error: err
      } );
      return;
    }
    res.redirect( "/todos" );
  } );
} );

//show update form
router.get( "/edit/:id", ( req, res ) => {
  TodoModel.findById( req.params.id, ( err, item ) => {
    let checked = ""
    if ( item.completed === true ) checked = "checked"
    res.render( "updateform", {
      item: item,
      checked: checked,
      error: null
    } )
  } )
} );

//update
router.put( "/edit/:id", ( req, res ) => {
  TodoModel.findByIdAndUpdate( req.params.id, {
    name: req.body.name,
    description: req.body.description,
    completed: req.body.completed === "on" ? true : false
  }, { new: true, upsert: true, runValidators: true }, ( err ) => {
    if ( err ) {
      let updateError = err;
      TodoModel.findById( req.params.id, ( err, item ) => {
        let checked = ""
        if ( item.completed === true ) checked = "checked"
        res.render( "updateform", {
          item: item,
          checked: checked,
          error: updateError
        } )

      } )
      return;
    }
    res.redirect( "/todos" );
  } );
} );

// destroy
router.get( "/delete/:id", ( req, res ) => {
  TodoModel.findByIdAndRemove( req.params.id, ( err ) => {
    if ( err ) return console.log( err );
    res.redirect( "/todos" );
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