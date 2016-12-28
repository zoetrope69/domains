// get the tlds

var http = require('http');
var fs = require('fs');
var path = require('path');

http.get('http://data.iana.org/TLD/tlds-alpha-by-domain.txt', function (res) {
  console.log('Got response:', res.statusCode);

  var data = new Buffer('');

  res.on('data', function (chunk) {
    data = Buffer.concat([data, chunk]);
  });

  res.on('end', function () {
    var tlds = data.toString('utf8').split('\n');

    tlds = tlds.filter(tld => tld.match(/^[A-z]+$/g)).map(tld => tld.toLowerCase());

    fs.writeFile(path.join(__dirname, '/tlds.json'), JSON.stringify(tlds, null, 2), function (error) {
      if (error) {
        return console.log('Error:', error);
      }

      console.log(tlds.length, 'TLDs saved to /tlds.json');
    });
  });
}).on('error', function (error) {
  console.log('Error:', error.message);
});
