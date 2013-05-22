(function(){ main(); })() // On load

function main(){
	var url = './txt/dandydomains.txt';
	$.ajax({ url: url, dataType: 'text', async: false })
	.done(function(data){
		var dandyDomains = data.split('\n');
		$('header h3').fadeOut('fast').text('Here they are!').fadeIn('slow');
		
		console.log('Amount of domains: ' + dandyDomains.length);
		for(var i = 100; i < 123; i++){
			domainrCheck(dandyDomains[i]);
		}
	});

	$('header input').prop('checked', true); // check all the header status boxes
}

// domainr bit
function domainrCheck(domain){
	var url = 'http://www.domai.nr/api/json/info?callback=getDomainrData&q=' + domain;
	$.ajax({ url: url, dataType: 'script', async: false });
}

function getDomainrData(json){
	console.log(json);
	//console.log("Domain: "+ json.domain +" | Available? "+ json.availability);
	var avail = json.availability;
	var link = ['<span class="status '+ avail +'">','</span>'];
	if(avail == 'available' || avail == 'maybe'){
		link[0] = '<a href='+ json.register_url +' class="status '+ avail +'">';
		link[1] = '</a>';
	}
	var domain = json.domain;
	var suffix = '.' + json.tld.domain;
	var word = domain.replace('.','');
	var suffixUrl = json.tld.wikipedia_url;

	$.ajax({ type: 'POST', url: './php/test.php', data: { word: word }, async: false })
	.done(function(definition){
		var line = ['<li class="'+ avail +'item">',
					'<div class="top">',
					'<h1>' + domain.replace('.', '<span class="fullstop '+ avail +'">.</span>') + '</h1>',
					'<a class="suffix" href="'+ suffixUrl +'"> Find out more about the domain </a>',
					link[0] + avail + link[1],
					'</div>',
					'<p class="def">'+ definition +'</p>',
					'</li>'].join('\n');

		$(line).hide().appendTo('main ul').fadeIn('slow');
	});

	
}

// filters
$('header input').click(function(){
	$('.'+this.id).toggle();
});