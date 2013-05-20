(function(){ main(); })() // On load

function main(){
	var url = './txt/dandydomains.txt';
	$.ajax({ url: url, dataType: 'text', async: false })
	.done(function(data){
		var dandyDomains = data.split('\n');
		$('header h3').fadeOut('fast').text('Here they are!').fadeIn('slow');
		
		console.log('Amount of domains: ' + dandyDomains.length);
		for(var i = 0; i < 200; i++){
			domainrCheck(dandyDomains[i]);
		}
	});
}

// domainr bit
function domainrCheck(domain){
	var url = 'http://www.domai.nr/api/json/info?callback=getDomainrData&q=' + domain;
	$.ajax({ url: url, dataType: 'script', async: false });
}

function getDomainrData(json){
	console.log(json);
	//console.log("Domain: "+ json.domain +" | Available? "+ json.availability); 
	var link = ['',''];
	if(json.availability == 'available' || json.availability == 'maybe'){ link[0] = '<a href='+ json.register_url +'>', link[1] = '</a>'; }
	var domain = json.domain;
	var word = domain.replace('.','');
	var suffix = '.' + json.tld.domain;
	var suffixURL = json.tld.wikipedia_url;

	var line = '<li class='+ json.availability +'>';
	line += link[0] + domain + link[1];
	line += ' | ' + word;
	line += ' | <a href="'+ suffixURL +'">' + suffix + '</a>';
	line += ' === | ' + link[0] + ' Register! ' + link[0];
	line += '</li>';

	$(line).hide().appendTo('main ul').fadeIn('slow');
}

// filters
$('header a').click(function(){
	$('li.'+this.id).toggle();
});