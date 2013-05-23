(function(){ main(); })() // On load

function main(){
	var url = './txt/dandydomains.txt';
	$.ajax({ url: url, dataType: 'text', async: false })
	.done(function(data){
		var dandyDomains = data.split('\n');
		$('header h3').fadeOut('fast').text('Here they are!').fadeIn('slow');
		
		// console.log('Amount of domains: ' + dandyDomains.length);
		for(var i = 0; i < 10; i++){
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
	// console.log(json); // RAW DATA
	// console.log("Domain: "+ json.domain +" | Available? "+ json.availability); // Bit more specific
	var avail = json.availability;
	var link = ['',''];
	var buy = '';
	if(avail == 'available' || avail == 'maybe' || avail == 'unknown'){
		link[0] = '<a href='+ json.register_url +'>';
		link[1] = '</a>';
		buy = '<span class="status buy">Buy!</span>';
	}
	var domain = json.domain;
	var suffix = '.' + json.tld.domain;
	var word = domain.replace('.','');
	var suffixUrl = json.tld.wikipedia_url;

	var line = ['<li class="'+ avail +'item">',
					'<div class="top">',
					'<h1>' + domain.replace('.', '<span class="fullstop '+ avail +'">.</span>') + '</h1>',
					link[0] + buy + link[1],
					link[0] + '<span class="status '+ avail +'">' + avail + '</span>' + link[1],
					'<a class="status define">Define</a>',
					'<a class="status suffix" href="'+ suffixUrl +'">Find out more about this domain</a>',
					'</div>',
					'<p class="def"></p>',
					'</li>'].join('\n');

	$(line).hide().appendTo('main ul').slideDown('slow');
	defineWords();
}

// define the words
function defineWords(){	
	$('.status.define').on('click', function(){
		var word = $(this).parent().find('h1').text().replace('.','');
		var def = '';
		$.ajax({ type: 'POST', url: './php/test.php', data: { word: word }, async: false })
		.done(function(definition){
			console.log(definition);
			def = definition;
		});
		$(this).parent().parent().find('.def').html(def)
		$(this).parent().parent().find('.def').slideDown('slow');
	});
}

// filters
$('header input').click(function(){
	$('.'+this.id).slideToggle('slow');
	defineWords();
});