var express = require('express');
var app = express();
var http = require('http');
var google = require('googleapis');
var OAuth2 = google.auth.OAuth2;
var plus = google.plus('v1');
const ClientId = "216819596994-7qcp9mrogd45dsf5q1poes47uq1untif.apps.googleusercontent.com";
const ClientSecret = "PGA_fnHsBDPxfGyEAOQayyaN";
const RedirectionUrl = "http://localhost:3000/oauthCallback";
//starting the express app


//this is the base route
function getOAuthClient () {
    return new OAuth2(ClientId ,  ClientSecret, RedirectionUrl);
}
 
function getAuthUrl () {
    var oauth2Client = getOAuthClient();
    // generate a url that asks permissions for Google+ and Google Calendar scopes
    var scopes = [
      'https://www.googleapis.com/auth/plus.me'
    ];
 
    var url = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: scopes // If you only need one scope you can pass it as string
    });
 
    return url;
}
app.use("/expression", require('./routes/expression'));
app.use("/oauthCallback", function (req, res) {
    var oauth2Client = getOAuthClient();
    var session = req.session;
    var code = req.query.code;
    oauth2Client.getToken(code, function(err, tokens) {
      // Now tokens contains an access_token and an optional refresh_token. Save them.
      if(!err) {
        oauth2Client.setCredentials(tokens);
        //session["tokens"]=tokens;
        res.send(`
            Login successful!! <a href="/details">
            Go to details page</a>;
        `);
      }
      else{
        res.send(`
            Login failed!
        `);
      }
    });
});
 
app.use("/details", function (req, res) {
    var oauth2Client = getOAuthClient();
    oauth2Client.setCredentials(req.session["tokens"]);
 
    var p = new Promise(function (resolve, reject) {
        plus.people.get({ userId: 'me', auth: oauth2Client }, function(err, response) {
            resolve(response || err);
        });
    }).then(function (data) {
      console.log(data.displayName);
        res.send(`
            <img src=${data.image.url}>
            Hello ${data.displayName}
        `);
    })
});
 
app.use("/", function (req, res) {
    var url = getAuthUrl();
    res.send(`
       Authentication using google 
        <a href=${url}>Login</a>
    `)
});


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
