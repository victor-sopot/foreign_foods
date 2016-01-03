"use strict";
//Init hoodie
var hoodie = new Hoodie();

$(document).ready(function(){

	// Check if there's a user logged in
	checkuser();

	$("#loginForm").submit(function(event) {
		event.preventDefault();
		var username  = $('#username').val();
	  	var password  = $('#password').val();
	  	hoodie.account.signIn(username, password)
	    	.done(function (user) {
	    		window.location = "/";
	    	})
	    	.fail(showErrorMessage);
	});

	$("#registerForm").submit(function(event) {
		event.preventDefault();
		var new_username = $("#new_username").val();
		var new_password = $("#new_password").val();
		hoodie.account.signUp(new_username, new_password)
			.done(function (user) {
	    		window.location = "/";
			})
			.fail(showErrorMessage);
	});

	$("#logout").on('click', function(){
		hoodie.account.signOut()
  		.done(function (user) {
  			window.location = "/";
  		})
  		.fail(showErrorMessage);
	});

	function checkuser() {
		if(hoodie.account.username){

			//Hide the form after login/register
			$("#loginPage").hide();
			$("#signupPage").hide();

			//Show confirmation on login or signup
			$("#userConf").show();
			$("#userConf h2").text("Welcome, " + hoodie.account.username + "! Redirecting...");

			//Update navbar text
			$("#currentUser").text("Signed In As " + hoodie.account.username);

			//Hide Register+Login buttons, show logout button if logged in
			$("#register").hide();
			$("#login").hide();
			$("#logout").show();

			$("#saveRestaurant").show();			

		} else {
			
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

			$("#saveRestaurant").hide();
		}
	}

	function showErrorMessage(error) {
		console.log(error);
		alert(error);
	}


	// Load up the restaurant categories from the foursquare API
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
		});

	});

	// Take the location in the input box and the category then query foursquare API with them
	$("#search").on('click', function() {
		
		//Scroll down to map
		$('html, body').animate({
        	scrollTop: $("#resultsPane").offset().top
    	}, 1200);

		var loc = $("#locInput").val();
		var category = $("#cuisineInput option:selected").val();

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
			}
		})
		// Plot them on Google Map
		.done(function(response){
			$("#loader1").toggle();
			var venues = response.response.venues;
			var responseGeocode = response.response.geocode.feature.geometry.center;
			var geocode = new google.maps.LatLng(responseGeocode.lat, responseGeocode.lng);
			map.panTo(geocode);
			$.each(venues, function(key, venues ) {
				var venueID = venues.id;
				var name = venues.name;
				var lat = venues.location.lat;
				var lng = venues.location.lng;
				var latlng = new google.maps.LatLng(lat,lng);
				var marker = new google.maps.Marker({
					position: latlng,
					title: name
				});
				marker.setMap(map);

				marker.addListener('click', function() {
					bindInfoContainer(venueID, name, latlng);
				})
			});
		});
	});

	function bindInfoContainer(venueID, name, latlng) {
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

	$("#saveRestaurant").on('click', function () {
		var name = $("#selectedRest").attr('data-name');
		var latlng = $("#selectedRest").attr('data-latlng');
		var address = $("#selectedRest").attr('data-address');
		var street = $("#selectedRest").attr('data-street');
		var city = $("#selectedRest").attr('data-city');
		var postcode = $("#selectedRest").attr('data-postcode');
		var venueTel = $("#selectedRest").attr('data-tel');
		var url = $("#selectedRest").attr('data-url');

		hoodie.store.add('venue', { 
			name : name, 
			coords : latlng, 
			address: address, 
			street: street, 
			city: city,
			postcode: postcode,
			tel: venueTel,
			url: url
		})
		.done(function(){
			alert('hello');
		})
	})

	// Init Google map
	var map;
	map = new google.maps.Map(document.getElementById("map"), {
		center: {lat: 51.465839, lng: -2.587283},
		zoom: 12
	});
});



