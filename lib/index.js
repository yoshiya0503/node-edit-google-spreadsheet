"use strict";

//module for using the google api to get anayltics data in an object
require("colors");
var request = require("request");
var _ = require("lodash");
var util = require("./util");
var async = require("async");

var Spreadsheet = require("./spreadsheet");
var Documents = require("./documents");

//public api
exports.create = function(opts, callback) {

  //validate options
  if(!opts)
    throw "Missing options";
  if(typeof opts.callback === 'function')
    callback = opts.callback;
  if(!callback)
    throw "Missing callback";
  if(!(opts.username && opts.password) && !opts.oauth)
    return callback("Missing authentication information");
  if(!opts.spreadsheetId  && !opts.spreadsheetName)
    return callback("Missing 'spreadsheetId' or 'spreadsheetName'");
  if(!opts.worksheetId  && !opts.worksheetName)
    return callback("Missing 'worksheetId' or 'worksheetName'");
  // if(opts.createNew && opts.worksheetName !== 'Sheet 1')
  //   return callback("Worksheet must be named Sheet 1 when creating new Spreadsheet");

  //default to http's' when undefined
  opts.useHTTPS = opts.useHTTPS === false ? '' : 's';
  
  var steps = [];

  if(opts.spreadsheetCreate) {
    var documents = new Documents(opts);
    steps.push(documents.auth);
    steps.push(documents.createSheet);
  }

  var spreadsheet = new Spreadsheet(opts);
  steps.push(spreadsheet.auth);
  steps.push(spreadsheet.init);

  async.series(steps, callback);


  // if(err && err.match(/spread(.*?)not found$/) && opts.createNew) {

};

