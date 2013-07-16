(function(){ main(); })() // On load

function main(){
	// generates a list of domain items
	domainItemGen();

	// filters the results and initates checkboxes
	availabilityFilter();

	// filters by alphabetical
	alphaFilter();
}

function domainItemGen(order){
	var url = './txt/dandydomains.txt';
	$.ajax({ url: url, dataType: 'text', async: false })
	.done(function(data){

		var domains = data.split('\n');
		var startPos = 0;
		var itemAmount = 25;

		// no order, random
		if(!order){ order = '?'; }

		if(order == '?'){

			// gen some random numbers
			var randPos = [];
			for(var i = 0; i < itemAmount; i++){
				rand = Math.floor(Math.random() * domains.length);
				// if we already have this rand no increase count for another go
				if(randPos.indexOf(rand) != -1){ itemAmount++; }
				else{ randPos.push(rand); }
			}

			// generate these
			for(var i = 0; i < itemAmount; i++){
				domainrCheck(domains[randPos[i]]);
			}

		}
		else{ // otherwise it should be alpha

			// if there is a order set
			if(order){ startPos = domainSearch(domains, order); }
			
			// console.log('Amount of domains: ' + dandyDomains.length);
			for(var i = startPos; i < startPos+itemAmount; i++){
				domainrCheck(domains[i]);
			}

		}
	});
}

function domainSearch(data, char){
	for(var i = 0; i < data.length; i++){
		if(data[i].charAt(0) == char){
			return i;
		}
	}
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
	if(avail == 'available' || avail == 'maybe' || avail == 'unknown'){
		link[0] = '<a href='+ json.register_url +'>';
		link[1] = '</a>';
	}
	var availPretty = capitaliseString(avail);
	var domain = json.domain;
	var domainPretty = domain.replace('.', '<span class="fullstop '+ avail +'">.</span>');
	var suffix = '.' + json.tld.domain;
	var word = domain.replace('.','');
	var suffixUrl = json.tld.wikipedia_url;

	var domainItem = $(['<li class="'+ avail +'-item">',
						'<div class="top">',
						'<h1>' + domainPretty + '</h1>',
						link[0] + '<span class="status '+ avail +'">' + availPretty + '</span>' + link[1],
						'<a class="status define">Definiton</a>',
						'<a class="status suffix" href="'+ suffixUrl +'">\''+ suffix +'\' ?</a>',
						'</div>',
						'<p class="def hidden-def"></p>',
						'</li>'].join('\n'));

	domainItem.appendTo('main ul');

	if(avail == 'unavailable' || avail == 'taken'){ domainItem.addClass('hidden-item'); }
	defineWords(domainItem);
}

// define the words
function defineWords(item){	
	$(item).find('.status.define').on('click', function(){
		// if there is content just toggle show or hide
		if($(this).parents('li').find('.def').html()){
			$(this).parents('li').find('.def').toggleClass('hidden-def');
		}
		// otherwise gen that text son
		else{
			$(this).fadeOut('slow');

			var word = $(this).parent().find('h1').text().replace('.','');
			var def = '';
			$.ajax({ type: 'POST', url: './php/define.php', data: { word: word }, async: false })
			.done(function(definition){
				def = definition;
			});

			// treat definition
			def = capitaliseString(def.trim());

			$(this).fadeIn('slow').html('Hide/Show Definiton');

			$(this).parents('li').find('.def').html(def);
			$(this).parents('li').find('.def').removeClass('hidden-def');
		}
	});
}

// filters the results
function availabilityFilter(){
	$('header input:not(#unavailable-item, #taken-item)').prop('checked', true); // check all the header status boxes

	$('header input').click(function(){
		$('.'+this.id).toggleClass('hidden-item');
	});
}

function alphaFilter(){
	$('.alpha-side ul li').click(function(){
		$('main ul').html(''); // empty the list
		var letter = $(this).html().toLowerCase();
		domainItemGen(letter);
	});
}

function capitaliseString(string){
	return string.charAt(0).toUpperCase()+string.slice(1);
}