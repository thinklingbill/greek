// Contraction routes
// Bill Roberts, 5/17/2020
// Handles routes for the contraction services

"use strict";
const express = require('express')
var Router = express.Router();
var Contraction = require( '../models/contraction.model');

// retrieve the entire contraction
Router.get("/", Contraction.get );

// retrive a flashcard
Router.get( "/flashcard", Contraction.getFlashcard);

module.exports = Router;