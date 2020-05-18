// Contraction stat routes
// Bill Roberts, 5/17/2020
// Handles routes for the contraction stat services

"use strict";
const express = require('express')
var Router = express.Router();
var ContractionStat = require( '../models/contractionStat.model');

// rretrieve the user's stats
Router.get("/", ContractionStat.get );

// mark the stats for a contraction for the user as correct
Router.put("/mark-correct", ContractionStat.markCorrect );

// mark the stats for a contraction for the user as missed
Router.put("/mark-missed", ContractionStat.markMissed );

// reset the user's stats
Router.delete("/reset", ContractionStat.reset );

module.exports = Router;