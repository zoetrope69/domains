// get the tlds

var http = require('http'),	
  	fs = require('fs');

http.get("http://data.iana.org/TLD/tlds-alpha-by-domain.txt", function(res) {
	console.log("Got response: " + res.statusCode + "\n");
	
	var data = new Buffer("");

	res.on('data', function(chunk){
		data = Buffer.concat([data, chunk]);
	});

	res.on('end', function (){
		var domains = data.toString('utf8').split("\n");

		var tempDomains = [];
		for(var d =  0; d < domains.length; d++){
			var domain = domains[d];

			// no characters but alpha
			if(domain.match(/^[A-z]+$/g)){
				tempDomains.push(domain.toLowerCase());
			}
		}

		domains = tempDomains;

		console.log(domains);
		
		fs.writeFile(__dirname+'/tlds.json', JSON.stringify(domains, null, 2), function(e){
			if(e){
				console.log("Error: ", e);
			}else{
				console.log("All golden. File saved.");
			}
		});
	});

}).on('error', function(e) {
  console.log("Got error: " + e.message);
});