// Vocabulary routes
// Bill Roberts, 5/9/2020
// Handles routes for the vocabulary services

"use strict";
const express = require('express')
var Router = express.Router();
var Vocabulary = require( '../models/vocabulary.model');

// retrieve the entire vocabulary
Router.get("/", Vocabulary.get );

// retrive a flashcard
Router.get( "/flashcard", Vocabulary.getFlashcard);

// reset the vocabulary list
Router.post( "/reset", Vocabulary.reset);

module.exports = Router;