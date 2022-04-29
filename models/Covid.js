const mongoose = require( 'mongoose' );
const Schema = mongoose.Schema;

var covidSchema = Schema( {
  submission_date: Date,
  tot_case: Number,
  new_case: Number,
  tot_death: Number,
  new_death: Number
} );

module.exports = mongoose.model( 'Covid', covidSchema );


