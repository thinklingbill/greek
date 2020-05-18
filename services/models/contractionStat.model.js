// ContractionStat model
// Bill Roberts, 5/17/2020
// Handles retrieval, marking correct or missed, and resetting of contraction flashcard statistics for a given user

"use strict";

// returns the user's stats
const get = function (req, res, next) {
   var userId = req.app.locals.userId;

   if (isNaN(userId)) {
      return (next({ message: "UserId is not set" }));
   }

   // compute the correct and missed totals for this user
   req.app.locals.connection.query(
      "select ifnull( sum( correctCount ), 0 ) as correctCount \
             ,ifnull( sum( missedCount), 0 ) as missedCount \
         from contractionStat where userId = ?"
      , [userId], (error, result, fields) => {
         if (error) {
            return (next(error));
         }
         res.send(result);
      });
}

// increments the correct count for a userId and contraction
// Expects req.app.locals.userId is set
// Expects req.body.contractionId is set
const markCorrect = function (req, res, next) {
   var userId = req.app.locals.userId;
   if (isNaN(userId)) {
      return (next({ message: "UserId is not set" }));
   }

   var contractionId = req.body.contractionId;
   if (isNaN(contractionId)) {
      return (next({ message: "contractionId is not set" }));
   }

   req.app.locals.connection.query(
      "update contractionStat \
          set correctCount = correctCount+1 \
        where userId = ? \
          and contractionId = ?"
      , [userId, contractionId], (error, result, fields) => {
         if (error) {
            return (next(error));
         }
         const msg = "Successfully incremented the user's correct count"; // anticipating success

         // if no rows were changed, the key doesn't exist. Do an insert
         if (result.affectedRows > 0) {
            res.send({ message: msg });
         }
         else {
            req.app.locals.connection.query(
               "insert contractionStat(userId, contractionId, correctCount, missedCount) \
             values( ?, ?, ?, ? )"
               , [userId, contractionId, 1, 0], (error, result, fields) => {
                  if (error) {
                     return (next(error));
                  }
                  res.send({ message: msg });
               });
         }
      });
}

// increments the missed count for a userId and contraction
// Expects req.app.locals.userId is set
// Expects req.body.contractionId is set
const markMissed = function (req, res, next) {
   var userId = req.app.locals.userId;
   if (isNaN(userId)) {
      return (next({ message: "UserId is not set" }));
   }

   var contractionId = req.body.contractionId;
   if (isNaN(contractionId)) {
      return (next({ message: "contractionId is not set" }));
   }

   req.app.locals.connection.query(
      "update contractionStat \
          set missedCount = missedCount+1 \
        where userId = ? \
          and contractionId = ?"
      , [userId, contractionId], (error, result, fields) => {
         if (error) {
            return (next(error));
         }
         const msg = "Successfully incremented the user's missed count"; // anticipating success

         // if no rows were changed, the key doesn't exist. Do an insert
         if (result.affectedRows > 0) {
            res.send({ message: msg });
         }
         else {
            req.app.locals.connection.query(
               "insert contractionStat(userId, contractionId, correctCount, missedCount) \
             values( ?, ?, ?, ? )"
               , [userId, contractionId, 0, 1], (error, result, fields) => {
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
   req.app.locals.connection.query(
      "update contractionStat \
          set correctCount = 0 \
             ,missedCount = 0 \
        where userId = ? \
          and ( correctCount + missedCount > 0 )"
      , [userId], (error, result, fields) => {
         if (error) {
            return (next(error));
         }
         res.send({ message: "Successfully reset the user's stats" });
      });
}

// public methods
exports.get = get;
exports.markCorrect = markCorrect;
exports.markMissed = markMissed;
exports.reset = reset;