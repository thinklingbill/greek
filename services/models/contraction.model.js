// Contraction model
// Bill Roberts, 5/17/2020
// Handles retrieval of contractions and contraction flashcards

"use strict";

const Default = {
   numChoices: 4
}

// send the entire Contraction table to the caller
const get = function (req, res, next) {
   req.app.locals.connection.query(
      "select contractionId \
             ,sequence1 \
             ,sequence2 \
             ,firstElement \
             ,secondElement \
             ,genuineSpurious \
             ,resultingElement \
         from contraction \
        order by \
              sequence1 \
             ,sequence2"
      , (error, result, fields) => {
         if (error) {
            return (next(error));
         }
         res.send(result);
      });
}

// send a single contraction to the caller, along with a number of multiple choice requests (defaults to 4) and
// an indicator of which choice is the correct one
// Expectations
// req.query.numChoices describes how many choices to retrieve. If blank or not a number, use default
const getFlashcard = function (req, res, next) {
   var numChoices = parseInt(req.query.numChoices);
   if (isNaN(numChoices)) {
      numChoices = Default.numChoices;
   }

   // get all contractions into a contraction array. It's a small enough data set to do this
   req.app.locals.connection.query(
      "select contractionId \
             ,firstElement \
             ,secondElement \
             ,genuineSpurious \
             ,resultingElement \
         from contraction"
      , (error, result, field) => {
         if (error) {
            return (next(error));
         }
         // get number of contractions and the one selected for this flashcard
         const contractionCount = result.length;
         const selectedPos = (Math.floor(parseInt(contractionCount) * Math.random()));
         const selectedPositionInChoices = (Math.floor(parseInt(numChoices) * Math.random()));
         // select random choices along with this one
         var payload = { contraction: result[selectedPos], multipleChoice: [] };

         // the purpose of this section is to add multiple choices to the payload. 
         // the correct answer has to be one of them, randomly ordered. The incorrect
         // answers have to be unique and also randomly ordered. 
         for (var i = 0; i < numChoices; i++) {
            if (i == selectedPositionInChoices) { // use the correct result here
               payload.multipleChoice[i] = { contractionId: result[selectedPos].contractionId, resultingElement: result[selectedPos].resultingElement };
            }
            else {
               var looping = true;
               while (looping) {
                  const nonSelectedPos = (Math.floor(parseInt(contractionCount) * Math.random()));
                  if (nonSelectedPos != selectedPos) { // not already the one we've chosen, and not already in the array
                     var alreadyThere = false;
                     for (var j = 0; j < payload.multipleChoice.length; j++) {
                        if (result[nonSelectedPos].contractionId == payload.multipleChoice[j].contractionId) {
                           alreadyThere = true;
                           break;
                        }
                     }
                     if (!alreadyThere) {
                        payload.multipleChoice[i] = { contractionId: result[nonSelectedPos].contractionId, resultingElement: result[nonSelectedPos].resultingElement };
                        looping = false;
                     }
                  }
               }
            }
         }
         res.send(payload);
      });
}
// public methods
exports.get = get;
exports.getFlashcard = getFlashcard;
// exports.reset = reset;