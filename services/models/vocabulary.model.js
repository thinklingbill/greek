// Vocabulary model
// Bill Roberts, 5/9/2020
// Handles resetting/loading and retrieval of vocabulary words and metadata

"use strict";

var fs = require("fs");

const VOCAB_DATA_SOURCE = './billmounce_dictionary/dictionary.json';

// load the entire vocabulary into an array
const loadVocabulary = function () {
   // read the entire vocabulary in from a json file
   var contents = fs.readFileSync(VOCAB_DATA_SOURCE);
   var jsonContent = JSON.parse(contents);

   // just return the fields we care about
   var data = [];
   var i = 0;

   for (var key in jsonContent) {

      data[i++] = {
         "vocabularyId": i
         , "lemma": jsonContent[key].lemma
         , "transliteration": jsonContent[key].transliteration
         , "definition": jsonContent[key].definition
         , "frequencyCount": jsonContent[key].frequencyCount
      };
   }

   return data;
}

// send the entire vocabulary table to the caller
const get = function (req, res, next) {
   req.app.locals.connection.query("select vocabularyId, lemma, transliteration, frequencyCount, definition from vocabulary", (error, result, fields) => {
      if (error) {
         return (next(error));
      }
      res.send(result);
   });
}

// send a single word to the caller. 
// Expectations
// req.query.minFrequency limits the word returned to words that appear >= minFrequency in the vocabulary
const getFlashcard = function(req, res, next) {
   // Will need to change this so it pulls a specific record, not by ID but by position
   // Allow to pass in min frequency and max correct
   var minFrequency = parseInt( req.query.minFrequency );
   if ( isNaN( minFrequency )) {
      return( next( {message: "Minimum Frequency must be a valid number" }));
   }

   req.app.locals.connection.query("select count(*) as cnt from vocabulary where frequencyCount >= ?", [ minFrequency ], (error, result, fields) => {
      if (error) {
         return (next(error));
      }
      else {
         var selectedPos = ( Math.floor( parseInt( result[0].cnt ) * Math.random()));

         req.app.locals.connection.query("select vocabularyId, lemma, transliteration, frequencyCount, definition from vocabulary where frequencyCount >= ? limit ?, 1",[ minFrequency, selectedPos ], (error, result, field) => {
            if (error) {
               return( next( error ));
            }
            res.send( result );
         });
      }
   });
}

// truncate and reload the vocabulary table in the database from the json file
const reset = function(req, res, next) {
   // load the vocabulary data into the database from the JSON file
   try {
      var data = loadVocabulary();
   }
   catch (error) {
      return(next(error));
   }

   // truncate the vocabulary table
   req.app.locals.connection.query("delete from vocabulary where 1=1", (error, result, fields) => {
      if (error) {
         return (next( error ));
      }

      // insert each word and metadata into the vocabulary table
      for (var i = 0; i < data.length; i++) {
         var rec = [ data[i].lemma, data[i].transliteration, data[i].frequencyCount, data[i].definition ];

         req.app.locals.connection.query("insert into vocabulary( lemma, transliteration, frequencyCount, definition ) values( ?, ?, ?, ? )", rec, (error, result, fields) => {
            if (error) {
               return (next(error));
            }
         });
      }

      // send success message
      res.send( {message: "Successfully reset the vocabulary"});
   });
}

// public methods
exports.get = get;
exports.getFlashcard = getFlashcard;
exports.reset = reset;