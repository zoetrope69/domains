
/*
 * GET home page.
 */

var tlds = require('./../data/tlds');
var domains = require('./../data/domains');

exports.index = function(req, res){
  res.render('index', { title: 'dandydomains', tlds: tlds, domains: domains });
};