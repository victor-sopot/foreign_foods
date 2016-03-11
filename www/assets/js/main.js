"use strict";
//Init hoodie
var hoodie = new Hoodie();

$(document).ready(function(){

	// Check if there's a user logged in

	if (hoodie.account.username)
	{
		logged_in(hoodie.account.username);
	} else {
		not_logged_in();
	}
	
	// Retrieve local venues
	findVenues();

	if (categories === undefined || categories.length == 0) {
		var categories = [];
    	loadCategories();
    } else {
    	populateCategories();
    }

	var markers = [];
	var count = 0;

	$('#venueTabs a').click(function (e) {
		e.preventDefault()
		$(this).tab('show')
	});

	$("#loginForm").submit(function(event) {
		event.preventDefault();
		var username  = $('#username').val();
	  	var password  = $('#password').val();
	  	hoodie.account.signIn(username, password)
	    	.done(function (user) {
	    		window.location = "index.html";
	    	})
	    	.fail(showErrorMessage);
	});

	$("#registerForm").submit(function(event) {
		event.preventDefault();
		var new_username = $("#new_username").val();
		var new_password = $("#new_password").val();
		hoodie.account.signUp(new_username, new_password)
			.done(function (user) {
	    		window.location = "index.html";
			})
			.fail(showErrorMessage);
	});

	$("#logout").on('click', function(){
		hoodie.account.signOut({ignoreLocalChanges: true})
  		.done(function (user) {
  			window.location = "index.html";
  		})
  		.fail(showErrorMessage);
	});

	// Take the location in the input box and the category then query foursquare API with them
	$("#search").on('click', function() {
		var loc = $("#locInput").val();
		var category = $("#cuisineInput option:selected").val();

		// Error checking 
		if (category == "Select Cuisine") {
			$('#errorResponse').show();
			$('#errorText').html('<strong>Whoops! Your query was invalid. Please make sure you select a cuisine type. </strong>');
		}
		else {
			// Spinner
			$("#loader1").toggle();

			$.ajax({
				url: 'https://api.foursquare.com/v2/venues/search',
				data: {
					near: loc,
					limit: 50,
					intent: 'browse',
					categoryId: category,
					client_id: 'J0SLPBITH4EPQDFZC0M3ZXMSR31NAEYGM02OLQB2PVAQKFEI',
					client_secret: 'WVBFKBRXWZPUBXGPVR0AFBU440DHIQDJA5MKBEEBPZJGBQW0',
					v: 20151230,
					m: 'foursquare'
				},
				statusCode: {
					400: function() {
						$("#loader1").toggle();
						$('#errorResponse').show();
					},
					401: function() {
						$("#loader1").toggle();
						$('#errorResponse').show();
					},
					403: function() {
						$("#loader1").toggle();
						$('#errorResponse').show();
					},
					404: function() {
						$("#loader1").toggle();
						$('#errorResponse').show();
					},
					405: function() {
						$("#loader1").toggle();
						$('#errorResponse').show();
					},
					409: function() {
						$("#loader1").toggle();
						$('#errorResponse').show();
					},
					500: function() {
						$("#loader1").toggle();
						$('#errorResponse').show();
					}
				}
			})

			// Plot them on Google Map
			.done(function(response){
				
				// Hide the loader spinner
				$("#loader1").toggle();
				// Hide the error window
				$("#errorResponse").hide();

				// Once the reqeust has returned, clear the existing markers
				clearMarkers();

				//Scroll down to map
				$('html, body').animate({
		        	scrollTop: $("#resultsPane").offset().top
		    	}, 1200);

				// Grab Fourequare response data assuming it's a good request.
				var venues = response.response.venues;
				var responseGeocode = response.response.geocode.feature.geometry.center;
				var geocode = new google.maps.LatLng(responseGeocode.lat, responseGeocode.lng);
				map.panTo(geocode);
				$.each(venues, function(key, venues) {
					var venueID = venues.id;
					var name = venues.name;
					var lat = venues.location.lat;
					var lng = venues.location.lng;
					var latlng = new google.maps.LatLng(lat,lng);
					var marker = new google.maps.Marker({
						position: latlng,
						title: name
					});
					marker.addListener('click', function() {
						venueDetails(venueID, name, latlng);
					})
					markers.push(marker);
					setMarkers(map);
				});
			})
			.fail(function(response){
				if (response.responseJSON.meta.errorType == 'failed_geocode') {
					$("#errorText").html('<strong>Uhoh! Couldn\'t find that location.</strong><p>"' + response.responseJSON.meta.errorType + ': ' + response.responseJSON.meta.errorDetail + '"</p>')
				} else if (response.responseJSON.meta.errorType == 'param_error') {
					$('#errorText').html('<strong>Whoops! Your query was invalid. Please make sure you select a cuisine type. </strong><p>"' + response.responseJSON.meta.errorType + ': ' + response.responseJSON.meta.errorDetail + '"</p>');
				}
			})
		}
	});

	$("#tryagain").on('click', function() {
		$("#locInput").focus();
	})

	$("#saveRestaurant").on('click', function () {
		var name = $("#selectedRest").attr('data-name');
		var latlng = $("#selectedRest").attr('data-latlng');
		var address = $("#selectedRest").attr('data-address');
		var street = $("#selectedRest").attr('data-street');
		var city = $("#selectedRest").attr('data-city');
		var postcode = $("#selectedRest").attr('data-postcode');
		var venueTel = $("#selectedRest").attr('data-tel');
		var url = $("#selectedRest").attr('data-url');
		var iconPrefix = $("#selectedRest").attr('data-i-prefix');
		var iconSuffix = $("#selectedRest").attr('data-i-suffix');

		hoodie.store.add('venue', { 
			name : name, 
			coords : latlng, 
			address: address, 
			street: street, 
			city: city,
			postcode: postcode,
			tel: venueTel,
			url: url,
			iconp : iconPrefix,
			icons : iconSuffix
		})
		.done(function(){
			count++;
			$("#response").html(count + " Restaurants Added! View on <a href='my-restaurants.html'>your restaurants page</a>.");
		})
	})

	// View on Map
	$("#locateBtn").on('click', function(){
			//todo
	})

	function findVenues() {
		hoodie.store.findAll('venue')
		.done(function(allVenues) {
			// LOOP THE VENUES //
			if (allVenues.length == 0) {
				console.log(allVenues.length + ' venues found.');
				$("#restaurantSide button").attr("disabled", "disabled");
				$("#noVenues").show();
		    } else {
		    	retreiveVenues(allVenues);
		    }
		});
	}

	function retreiveVenues(object)
	{
		var id;
		$("#restaurantSide button").removeAttr("disabled");
		$.each(object, function(key, object) {
				$("#restaurants ul").append($("<li data-created='"+ object.createdAt + "' data-id='"+ object.id +"' data-name='"+ object.name +"' data-address='"+ object.address +"' data-street='"+ object.street +"' data-city='"+ object.city +"' data-postcode='"+ object.postcode +"' data-tel='"+ object.tel +"' data-url='"+ object.url +"' class='list-group-item inner'><img src='" + object.iconp + "bg_44" + object.icons + "'> " + object.name + "</li>"));
			})
			$("#restaurants li").on('click', function(event){
				event.preventDefault();
				$("#info #meta").text('Added At: 4:54pm 21st January 2016 by Muhammad Ali');

				$("#rest_title").text($(this).attr('data-name'));
				$("#info #address").html("<span class='glyphicon glyphicon-bookmark'></span> " + $(this).attr('data-address'));
				$("#info #street").text($(this).attr('data-street'));
				$("#info #city").text($(this).attr('data-city'));
				$("#info #postcode").text($(this).attr('data-postcode'));
				$("#info #tel").html("<span class='glyphicon glyphicon-earphone'></span> " + $(this).attr('data-tel'));
				$("#info #url").html("<a href='" + $(this).attr('data-url') + "' _target='blank'>" + $(this).attr('data-url') + "</a>");

				$(this).attr('data-selected', 'true');
				id = $(this).attr('data-id');
			})

			$("#deleteVenue").on('click', function(event){
				event.preventDefault();
			    if (confirm("Are you sure?") == true) {
		        	hoodie.store.remove('venue', id)
		        	.done(function(removedVenue) {
		        		alert(removedVenue.name + ' has been removed from your account.')
		        		window.location = "my-restaurants.html";
		        	})
		        	.fail(function(error) {
		        		alert(error)
		        	});
    			}
			})
	}

	function logged_in(username) {
		//Hide the form after login/register
		$("#loginPage").hide();
		$("#signupPage").hide();

		//Show confirmation on login or signup
		$("#userConf").show();
		$("#userConf h2").text("Welcome, " + username + "! Redirecting...");

		//Update navbar text
		$("#currentUser").text("Signed In As " +  username);

		//Hide Register+Login buttons, show logout button if logged in
		$("#register").hide();
		$("#login").hide();
		$("#logout").show();

		//Hide not-logged-in message on my-restaurants.html
		$("#mainboard").hide();
	}

	function not_logged_in() {
		//Show the form by default (not logged in)
		$("#loginPage").show();
		$("#signupPage").show();

		//Hide confirmation messages
		$("#userConf").hide();
		$("#userConf h2").text("");

		//Navbar text
		$("#currentUser").text("Not Signed In");

		//Show Register+Login buttons if not signed in, hide logout button
		$("#register").show();
		$("#login").show();
		$("#logout").hide();

		//Display not-logged-in message on my-restaurants.html
		$("#mainboard").show();
	}

	function showErrorMessage(error) {
		console.log(error);
		$("#errorResponse").show();
		$("#errorResponse #errorText").html('<strong>Error logging in: </strong>' + error.message);
		//alert(error);
	}
	
    function loadCategories() {
		// Load up the restaurant categories from the foursquare API. This should be run ONCE 
		// on first running of the web app. 
		$.ajax({
			url: 'https://api.foursquare.com/v2/venues/categories',
			data: {
				client_id: 'J0SLPBITH4EPQDFZC0M3ZXMSR31NAEYGM02OLQB2PVAQKFEI',
				client_secret: 'WVBFKBRXWZPUBXGPVR0AFBU440DHIQDJA5MKBEEBPZJGBQW0',
				v: 20151230,
				m: 'foursquare'
			}
		})
		// Store them in an array, for use in the select box.
		.done(function(response){ 
			var cuisines = response.response.categories[3].categories;
			var i = 0;
			$.each(cuisines, function(key, cuisines ) {
				var catID = cuisines.id;
				var catShortName = cuisines.shortName;
				var catFullName = cuisines.name;
				var catIcon = cuisines.icon;

				categories[i++] = {id : catID, fullname : catFullName, name : catShortName, icon : catIcon};			
			});
			populateCategories();
		});
	}

	function populateCategories() {
		// console.log(categories);
		$.each(categories, function(key, categories){
			$("#cuisineInput").append($("<option value='" + categories.id + "'>" + categories.name + "</option>"));
		});
	}

	function setMarkers(map) {
		for (var i = 0; i<markers.length; i++) {
			markers[i].setMap(map);
		}
	}

	function clearMarkers() {
		setMarkers(null);
		markers = [];
	}

		

	function venueDetails(venueID, name, latlng) {
		$("#loader2").toggle();
		$.ajax({
			url: 'https://api.foursquare.com/v2/venues/' + venueID,
			data: {
				client_id: 'J0SLPBITH4EPQDFZC0M3ZXMSR31NAEYGM02OLQB2PVAQKFEI',
				client_secret: 'WVBFKBRXWZPUBXGPVR0AFBU440DHIQDJA5MKBEEBPZJGBQW0',
				v: 20151230,
				m: 'foursquare'
			}
		})
		.done(function(response) {
			$("#loader2").toggle();
			var venue = response.response.venue;

			var venueTel = getProperty(venue.contact, 'formattedPhone');
			var address = getProperty(venue.location, 'address');
			var street = getProperty(venue.location, 'crossStreet');
			var city = getProperty(venue.location, 'city');			
			var postcode = getProperty(venue.location, 'postalCode');
			var url = getProperty(venue, 'url');
			var iconPrefix = getProperty(venue.categories[0].icon, 'prefix');
			var iconSuffix = getProperty(venue.categories[0].icon, 'suffix');

			$("#address").html("");

			$("#selectedRest").show();
			$("#selectedRest").attr('data-venue-id', venueID);
			$("#selectedRest").attr('data-name', name);
			$("#selectedRest").attr('data-latlng', latlng);
			$("#selectedRest").attr('data-address', address);
			$("#selectedRest").attr('data-street', street);
			$("#selectedRest").attr('data-city', city);
			$("#selectedRest").attr('data-postcode', postcode);
			$("#selectedRest").attr('data-tel', venueTel);
			$("#selectedRest").attr('data-url', url);
			$("#selectedRest").attr('data-i-prefix', iconPrefix);
			$("#selectedRest").attr('data-i-suffix', iconSuffix);

			$("#selectedHead").text(name);
			$("<dt>Title: </dt><dd>" + address + "</dd>").appendTo("#address");
			$("<dt>Street: </dt><dd>" + street + "</dd>").appendTo("#address");
			$("<dt>City: </dt><dd>" + city + "</dd>").appendTo("#address");
			$("<dt>Postcode: </dt><dd>" + postcode + "</dd>").appendTo("#address");
			$("<dt>Telephone: </dt><dd>" + venueTel + "</dd>").appendTo("#address");
			$("<dt>URL: </dt><dd>" + url + "</dd>").appendTo("#address");

			$('html, body').animate({
    	    	scrollTop: $("#selectedRest").offset().top
   	 		}, 1200);
		});
	}

	function getProperty(object, property){
		if (typeof object[property] === "undefined")
		{
			return "";
		} else {
			return object[property];
		}
	}
});



