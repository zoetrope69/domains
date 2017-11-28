
/**
 * Module dependencies.
 */

// use .env file

require('dotenv').load();

if (!process.env.MASHAPE_KEY) {
  console.log('Need to add the Mashape API key (MASHAPE_KEY) to `.env`. See README.');
  process.exit(1);
}

if (!process.env.MW_DICTIONARY_KEY) {
  console.log('Need to add the dictionary api key (MW_DICTIONARY_KEY) to `.env`. See README.');
  process.exit(1);
}

const express = require('express');
const http = require('http');
const path = require('path');
const unirest = require('unirest');
const Dictionary = require('mw-dictionary');
const dictionary = new Dictionary({
  key: process.env.MW_DICTIONARY_KEY
});

const domains = require('./data/domains');
const tldsInfo = require('./data/tldInfo');

const app = express();

/**
 * Randomize array element order in-place.
 * Using Durstenfeld shuffle algorithm.
 */
function shuffle (array) {
  for (var i = array.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  return array;
}

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if (app.get('env') === 'development') {
  app.use(express.errorHandler());
}

app.use('/', express.static('build'));

app.get('/domains', function (req, res, next) {
  res.json(shuffle(domains));
});

app.get('/dictionary', function (req, res) {
  var word = req.query.word;

  if (!word || word.length < 0) {
    res.send({
      query: word,
      error_message: 'Bad word: No word sent'
    });
  }

  dictionary.define(word, function (error, results) {
    if (error) {
      return res.send({
        query: word,
        error_message: 'Something went wrong.'
      });
    }

    const definitions = results.map(result => {
      return {
        type: result.partOfSpeech[0],
        description: result.definition.replace(/:/g, '').trim()
      };
    }).filter(result => result.description !== '');

    res.json(definitions);
  });
});

app.get('/domainr', function (req, res) {
  var domain = req.query.domain;

  if (!domain || domain.length < 0) {
    res.send({
      query: domain,
      error_message: 'Bad domain: No domain sent'
    });
  }

  unirest.get('https://domainr.p.mashape.com/v2/status?mashape-key=' + process.env.MASHAPE_KEY + '&domain=' + domain)
    .header('X-Mashape-Key', process.env.MASHAPE_KEY)
    .header('Accept', 'application/json')
    .end(function (result) {
      if (!result.body || !result.body.status || result.body.status.length <= 0) {
        return res.send({
          query: domain,
          error_message: 'Something went wrong.'
        });
      }

      const domainInfo = result.body.status[0];

      const moreInfo = tldsInfo.find(tld => tld.name === `.${domainInfo.zone}`);

      if (moreInfo) {
        domainInfo.info = moreInfo;
      }

      res.send(domainInfo);
    });
});

http.createServer(app).listen(app.get('port'), function () {
  console.log('Express server listening on port http://localhost:' + app.get('port'));
});
