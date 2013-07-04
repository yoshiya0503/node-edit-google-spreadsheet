var Spreadsheet = require('../');
var creds = require('./cred-loader');

Spreadsheet.create({
  debug: true,

  username: creds.username,
  password: creds.password,
  
  spreadsheetCreate: true,
  workheetCreate: true,

  spreadsheetName: 'sheet-'+new Date().getTime(),
  worksheetName: 'Sheet1'

  // spreadsheetId: 'ttFmrFPIipJimDQYSFyhwTg',
  // worksheetId: "od6",

}, run);

function run(err, spreadsheet) {
}