
var GoogleClientLogin = require('googleclientlogin').GoogleClientLogin;
var GoogleOAuthJWT = require('google-oauth-jwt');


//client auth helper
function clientLogin(service, username, password, done) {
  var googleAuth = new GoogleClientLogin({
    email: username,
    password: password,
    service: service,
    accountType: GoogleClientLogin.accountTypes.google
  });
  //error - show and exit
  googleAuth.on(GoogleClientLogin.events.error, function(e) {
    done("Google Client Login Error: " + e.message);
  });
  //success - next step
  googleAuth.on(GoogleClientLogin.events.login, function() {
    done(null, {type : 'GoogleLogin', token :  googleAuth.getAuthId()});
  });
  googleAuth.login();
}

//oauth helper
function oauthLogin(service, oauth, useHTTPS, done) {

  if(!oauth.scopes)
    oauth.scopes = ['http'+useHTTPS+'://'+service+'.google.com/feeds'];

  GoogleOAuthJWT.authenticate(oauth, function (err, token) {
    if(err)
      done("Google OAuth Error: " + err);
    else
      done(null, {type : 'Bearer', token :  token});
  });
}

//base class
function GoogleObject(service, opts) {
  this.token = null;
  this.service = service;
  this.protocol = 'http' + opts.useHTTPS;
}

GoogleObject.prototype.getHeaders = function() {
  if(!this.token)
    throw "Missing authentication token. auth() first.";
  return {
    'Authorization': (this.token.type == 'GoogleLogin' ? 'GoogleLogin auth=' : 'Bearer ') + this.token.token,
    'Content-Type': 'application/atom+xml',
    'GData-Version': '3.0',
    'If-Match': '*'
  };
};

GoogleObject.prototype.auth = function(callback) {

  this.log('Logging into Google "%s" API'.grey, this.service);

  var _this = this;
  var gotToken = function(err, token) {
    if(err) return callback(err);
    _this.token = token;
    callback(null);
  };

  if(opts.username && opts.password)
    clientLogin(this.service, this.opts.username, this.opts.password, gotToken);
  else if(opts.oauth)
    oauthLogin(this.service, this.opts.oauth, this.opts.useHTTPS, gotToken);
};

GoogleObject.prototype.log = function() {
  if(this.debug) console.log.apply(console, arguments);
};

module.exports = GoogleObject;
