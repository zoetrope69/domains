
/**
 * Module dependencies.
 */

// use .env file
require('dotenv').load();

var express = require('express');
var routes = require('./routes');
var http = require('http');
var path = require('path');
var unirest = require('unirest');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);

app.get('/domainr', function(req, res){

  var domain = req.query.domain;

  if (!domain || domain.length < 0) {
    res.send({
      query: domain,
      error_message: 'Bad domain: No domain sent'
    });
  }

  unirest.get('https://domainr.p.mashape.com/v1/info?mashape-key=' + process.env.MASHAPE_KEY + '&q=' + domain)
    .header("X-Mashape-Key", process.env.MASHAPE_KEY)
    .header("Accept", "application/json")
    .end(function (result) {

      console.log(result);

      if (!result.body) {
        res.send({
          query: domain,
          error_message: 'Something went wrong.'
        });
      }

      res.send(result.body);

    });

});

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
