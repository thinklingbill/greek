// Vocabulary Stats model
// Bill Roberts, 5/9/2020
// Handles resetting, upserts, and retreival of user flashcard statistics

"use strict";

// Returns the stats for the current user
const get = function (req, res, next) {
   var userId = req.app.locals.userId;

   if (isNaN(userId)) {
      return (next({ message: "UserId is not set" }));
   }

   // compute the correct and missed totals for this user
   req.app.locals.connection.query("select sum( correctCount ) as correctCount, sum( missedCount) as missedCount from vocabularyStat where userId = ?", userId, (error, result, fields) => {
      if (error) {
         return (next(error));
      }
      res.send(result);
   });
}

// increments the correct count for a userId and vocabulary word
// Expects req.app.locals.userId is set
// Expects req.body.vocabularyId is set
const markCorrect = function (req, res, next) {
   var userId = req.app.locals.userId;
   if (isNaN(userId)) {
      return (next({ message: "UserId is not set" }));
   }

   var vocabularyId = req.body.vocabularyId;
   if (isNaN(vocabularyId)) {
      return (next({ message: "vocabularyId is not set" }));
   }

   req.app.locals.connection.query("update vocabularyStat set correctCount = correctCount+1 where userId = ? and vocabularyId = ?", [userId, vocabularyId], (error, result, fields) => {
      if (error) {
         return (next(error));
      }
      const msg = "Successfully incremented the user's correct count"; // anticipating success

      // if no rows were changed, the key doesn't exist. Do an insert
      if (result.affectedRows > 0) {
         res.send({ message: msg });
      }
      else {         
         req.app.locals.connection.query("insert vocabularyStat(userId, vocabularyId, correctCount, missedCount) values( ?, ?, ?, ? )", [userId, vocabularyId, 1, 0], (error, result, fields) => {
            if (error) {
               return (next(error));
            }
            res.send({ message: msg });
         });
      }
   });
}

// increments the missed count for a userId and vocabulary word
// Expects req.app.locals.userId is set
// Expects req.body.vocabularyId is set
const markMissed = function (req, res, next) {
   var userId = req.app.locals.userId;
   if (isNaN(userId)) {
      return (next({ message: "UserId is not set" }));
   }

   var vocabularyId = req.body.vocabularyId;
   if (isNaN(vocabularyId)) {
      return (next({ message: "vocabularyId is not set" }));
   }

   req.app.locals.connection.query("update vocabularyStat set missedCount = missedCount+1 where userId = ? and vocabularyId = ?", [userId, vocabularyId], (error, result, fields) => {
      if (error) {
         return (next(error));
      }
      const msg = "Successfully incremented the user's missed count"; // anticipating success

      // if no rows were changed, the key doesn't exist. Do an insert
      if (result.affectedRows > 0) {
         res.send({ message: msg });
      }
      else {         
         req.app.locals.connection.query("insert vocabularyStat(userId, vocabularyId, correctCount, missedCount) values( ?, ?, ?, ? )", [userId, vocabularyId, 0, 1], (error, result, fields) => {
            if (error) {
               return (next(error));
            }
            res.send({ message: msg });
         });
      }
   });
}

// resets the stats for the given user
// Expects req.app.locals.userId is set
const reset = function (req, res, next) {
   var userId = req.app.locals.userId;
   if (isNaN(userId)) {
      return (next({ message: "UserId is not set" }));
   }

   // set the counts to 0 for any record that had a count > 0
   req.app.locals.connection.query("update vocabularyStat set correctCount = 0, missedCount = 0 where userId = ? and ( correctCount + missedCount > 0 )", [userId], (error, result, fields) => {
      if (error) {
         return (next(error));
      }
      res.send({ message: "Successfully reset the user's stats" });
   });
}

exports.get = get;
exports.markCorrect = markCorrect;
exports.markMissed = markMissed;
exports.reset = reset;