
// domainr bit
function domainrCheck(domain) {
	var timeoutSecs = 5;

	$.ajax({
			url: '/domainr?domain=' + domain,
			timeout: timeoutSecs * 1000
		})
		.success(function(data){
      if (!data.status || data.status.length <= 0) {
        return console.log('Fail: Couldnt find anything from Domainr');
      }
      console.log(data.status[0]);
      getDomainrData(data.status[0]);
		})
		.fail(function(res){
			console.log('Fail: ' + res.status);

			// highlight that shit
			$('main').find('.current').addClass('dead-item');

			$('.loading').hide();
			$('.errors').show();

			// error messages
			$('.errors').html('Ahh shit, it\'s broken.');
			setTimeout(function(){
				$('.errors').html('Ahh shit, it\'s broken. <a href="https://domainr.com/">Domainr</a> is failing to return anything on this domain.');
			}, 2000);
			setTimeout(function(){
				$('.errors').html('Ahh shit, it\'s broken. <a href="https://domainr.com/">Domainr</a> is failing to return anything on this domain. Sorry!');
			}, 5000);

	});
}

function getDomainrData(data) {
  var states = {
    'unregistrable': 'unavailable',
    'dpml': 'unavailable',
    'transferable': 'available',
    'inactive': 'available',
    'active': 'taken',
    'undelegated': 'maybe',
    'pending': 'maybe'
  };

	var state = states[data.summary] || 'unknown';
  console.log('state', state, data);

	var domain = data.domain;

	var link = ['',''];
	if(state === 'available' || state === 'maybe' || state === 'unknown'){
		link[0] = '<a title="Register this domain!" href="https://domainr.com/'+ domain +'">';
		link[1] = '</a>';
	}

	var domainPretty = link[0] + domain.replace('.', '<span class="'+ state +'">.</span>') + link[1];

	var suffix = '.' + data.zone;
	var suffixUrl = '#';

	var stateHtml = 'This domain is ' + link[0] + '<span class="'+ state +'">' + state + '</span>' + link[1] + '.';
	var suffixHtml = 'Read more about the <a href="'+ suffixUrl +'"><span>"' + suffix + '"</span></a>  suffix.';

	$('more-detail').addClass(state);
	$('.loading').hide();

	// replace the domain with a 'pretty' version
	$('.more-detail').find('h1').html(domainPretty);

	// add in the html for availability and the suffix info
	$('.availability').html(stateHtml).show();
	$('.suffix').html(suffixHtml).show();

	// highlight that shit
	$('main').find('.current').addClass(state + '-item');
}
