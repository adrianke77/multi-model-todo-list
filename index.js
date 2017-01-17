// add mongoose dependency and connect to mongodb server
const mongoose = require( 'mongoose' );
mongoose.connect( 'mongodb://localhost/blahblahboom' );
mongoose.Promise = global.Promise;

// add express dependency
const express = require( "express" );
const app = express();

// add debugger dependencies
const debug = require( "debug" );
const logger = require( "morgan" );

// add ejs dependency
const ejsLayouts = require( 'express-ejs-layouts' );

// add method-override dependency
const methodOverride = require( 'method-override' );

// add bodyParser dependency 
const bodyParser = require( "body-parser" );

// api route
const todosApiController = require( './controllers/todos_api_controller' );

// web viewing route
const todosWWWController = require( './controllers/todos_www_controller' );

// add view engine and layouts
app.set( "view engine", "ejs" );
app.use( ejsLayouts );

// add logger
app.use( logger( "dev" ) );

// add access to public folder, including CSS
app.use( '/public', express.static( __dirname + '/public' ) );

//add method-override, for example put in html tag: action="/resource?_method=DELETE"
app.use( methodOverride( '_method' ) )

// convert x-www-form-urlencoded data in req to req.body
app.use( bodyParser.urlencoded( { extended: false } ) );

// convert json in req to req.body
app.use( bodyParser.json() );

// route to controllers
app.use( "/todosapi", todosApiController ); //api
app.use( "/todos", todosWWWController ); //web interface

// default display for get host without other route
app.get( "/", ( req, res ) => {
  res.redirect( "/todos" )
} );

// spin up server to port
app.listen( process.env.port || 3000 );

module.exports = app;