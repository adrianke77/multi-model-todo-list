// add mongoose dependency and connect to mongodb server

const expect = require( 'chai' ).expect;
const request = require( 'supertest' );
const app = require( '../index' );
const TodoMongModel = require( "../models/todoModel" );

// put id from testprep.js here
let id;

function dataSetup( done ) {
  TodoMongModel.remove( {}, () => {
    TodoMongModel.create( {
      name: "mocha test name",
      description: "mocha test description",
      completed: true
    }, () => {
      TodoMongModel.create( {
        name: "mocha test name 2",
        description: "mocha test description 2",
        completed: false
      }, () => {
        TodoMongModel.find( { name: "mocha test name" },
          ( err, item ) => {
            id = item[ 0 ]._id;
            done();
          } );
      } );
    } );
  } );
}

function dataClear( done ) {
  TodoMongModel.remove( {}, done );
}

//get /todosapi
describe( "GET /", function() {
  before( dataSetup );
  after( dataClear );

  it( 'should return a 200 response', function( done ) {
    request( app ).get( '/' ).expect( 200, done );
  } );

  it( "should return an array", function( done ) {
    request( app ).get( '/todosapi' )
      .set( "Accept", "application/json" )
      .end( function( error, response ) {
        expect( response.body ).to.be.an( 'array' );
        done();
      } );
  } );

  it( "should return all the records in the database", function(
    done ) {
    request( app ).get( '/todosapi' )
      .set( "Accept", "applications/json" )
      .end( function( error, response ) {
        expect( response.body[ 0 ].name )
          .to.equal( "mocha test name" );
        expect( response.body[ 0 ].description )
          .to.equal( "mocha test description" );
        expect( response.body[ 0 ].completed ).to.equal( true );
        expect( response.body[ 1 ].name )
          .to.equal( "mocha test name 2" );
        expect( response.body[ 1 ].description )
          .to.equal( "mocha test description 2" );
        expect( response.body[ 1 ].completed ).to.equal( false );
        done();
      } );
  } );
} );

//get /todosapi/:id
describe( "GET /todosapi/:id", function() {
  before( dataSetup );
  after( dataClear );

  it( "should return a 200 response", function( done ) {
    request( app ).get( "/todosapi/" + id ).expect( 200, done );
  } );

  it( "should return the name, description and completed",
    function( done ) {
      request( app ).get( "/todosapi/" + id )
        .set( "Accept", "application/json" )
        .end( function( error, response ) {
          expect( response.body.name ).to.equal(
            "mocha test name" );
          expect( response.body.description ).to.equal(
            "mocha test description" );
          expect( response.body.completed ).to.equal(
            true );
          done();
        } );
    } );
} );

//post
describe( 'POST /todosapi', function( done ) {
  before( dataSetup );
  after( dataClear );

  it( "should return a 200 response", function() {
    request( app ).post( '/todosapi' )
      .set( "Accept", "application/json" )
      .send( { name: "bleah" } )
      .expect( 200, done );
  } );

  it( "should return a 422 response if the field name is wrong", function() {
    request( app ).post( '/todosapi' )
      .set( "Accept", "application/json" )
      .send( { nam: "bleah" } ) // intentionally wrong field
      .expect( 422, done );
  } );

  it( "should return an error message if the name field is wrong",
    function( done ) {
      request( app ).post( '/todosapi' )
        .set( "Accept", "application/json" )
        .send( { name: "ble" } ) // intentionally too short value
        .end( function( error, response ) {
          expect( response.body.name ).to.equal(
            "Name field value too short" );
        } );
      done();
    } );

  it( 'should add a new todo to the database',
    function( done ) {
      request( app ).post( '/todosapi' )
        .set( "Accept", "application/json" )
        .send( {
          name: "Todo made by POST /todosapi test",
          description: "Description by POST /todosapi test",
          completed: "true"
        } )
        .end( function( error, response ) {
          expect( response.body.name ).to.equal(
            "Todo made by POST /todosapi test" );
          expect( response.body.description ).to.equal(
            "Description by POST /todosapi test" );
          expect( response.body.completed ).to.equal( true );
        } );
      done();
    } );
} );

//put /todosapi/:io
describe( "GET /todosapi/:id", function() {
  before( dataSetup );
  after( dataClear );

  it( "should return a 200 response", function( done ) {
    request( app ).put( "/todosapi/" + id ).expect( 200, done );
  } );

  it( "should update a todo document", function( done ) {
    request( app ).put( "/todosapi/" + id )
      .set( "Accept", "application/json" )
      .send( {
        description: "Description modified by PUT /todosapi/:id test",
        completed: "false"
      } )
      .end( function( error, response ) {
        expect( response.body.name ).to.equal(
          "mocha test name" );
        expect( response.body.description ).to.equal(
          "Description modified by PUT /todosapi/:id test" );
        expect( response.body.completed ).to.equal(
          false );
        done();
      } );
  } );
} );

describe( "DELETE /todosapi/:id", function() {
  before( dataSetup );

  it( "should remove a todo document", function( done ) {
    request( app ).delete( "/todosapi/" + id )
      .end( function( error, response ) {
        expect( response.body.message ).to.equal(
          "deleted" );
      } );
    request( app ).get( '/todosapi' )
      .set( "Accept", "applications/json" )
      .end( function( error, response ) {
        // first item deleted, so now data in first slot should match second 
        //item data created in before() 
        expect( response.body[ 0 ].name )
          .to.equal( "mocha test name 2" );
        expect( response.body[ 0 ].description )
          .to.equal( "mocha test description 2" );
        expect( response.body[ 0 ].completed ).to.equal( false );
        done();
      } );
  } );

} );