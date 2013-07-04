
var inherits = require("util").inherits;
var request = require("request");
var _ = require("lodash");
var auth = require("./auth");
var GoogleObject = require("./base");

//documents class (Document List API)
function Documents(opts) {
  GoogleObject.call(this, "docs", opts);

  //add to spreadsheet
  _.extend(spreadsheet, _.pick( opts,
    'spreadsheetName',
    'worksheetName',
    'debug'
  ));

}

inherits(Documents, GoogleObject);

Documents.prototype.createNew = function(callback) {

  request({
    method: 'POST',
    url: 'https://docs.google.com/feeds/default/private/full?alt=json',
    headers: this.getHeaders(),
    body: 
      '<?xml version="1.0" encoding="UTF-8"?>' +
      '<entry xmlns="http://www.w3.org/2005/Atom" xmlns:docs="http://schemas.google.com/docs/2007">' +
        '<category scheme="http://schemas.google.com/docs/2007#spreadsheet" term="http://schemas.google.com/docs/2007#spreadsheet"/>' +
        '<title>' + this.spreadsheetName + '</title>' +
      '</entry>'
  }, function(err, response, body){

    console.log(body);
    if(err) return callback(err);
    if(!JSON.parse(body).entry) return callback("There was en error creating a new spreadsheet: "+body);
    spreadsheet.log('New Spreadsheet successfully created'.grey);
    spreadsheet.init(token, function(err) {
      callback(err,spreadsheet);
    });
  });
};
