// Vocabulary model
// Bill Roberts, 5/9/2020
// Handles routes for the vocabulary statistics services

"use strict";
const express = require('express')
var Router = express.Router();
var VocabularyStat = require( '../models/vocabularyStat.model');

// retrieve stats for the current user
Router.get("/", VocabularyStat.get );

Router.put("/mark-correct", VocabularyStat.markCorrect );

Router.put("/mark-missed", VocabularyStat.markMissed );

Router.delete("/reset", VocabularyStat.reset );

module.exports = Router;