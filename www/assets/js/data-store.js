// FOR USE WHEN ADDING A SYNC BUTTON

$.ajax({
		url: 'https://api.foursquare.com/v2/venues/categories',
		data: {
			client_id: 'J0SLPBITH4EPQDFZC0M3ZXMSR31NAEYGM02OLQB2PVAQKFEI',
			client_secret: 'WVBFKBRXWZPUBXGPVR0AFBU440DHIQDJA5MKBEEBPZJGBQW0',
			v: 20151230,
			m: 'foursquare'
		}
	})
	// Place them in the select box
	.done(function(response){
		var cuisines = response.response.categories[3].categories;
		$.each(cuisines, function(key, cuisines ) {
			$("#cuisineInput").append($("<option value='" + cuisines.id + "'>" + cuisines.shortName + "</option>"));
			hoodie.store.add("category", {
				id : cuisines.id,
				name : cuisines.shortName
			});
		});
	});