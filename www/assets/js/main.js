"use strict";
//Init hoodie
var hoodie = new Hoodie();

$(document).ready(function(){

	checkuser();

	$("#loginForm").submit(function(event) {
		event.preventDefault();
		var username  = $('#username').val();
	  	var password  = $('#password').val();
	  	hoodie.account.signIn(username, password)
	    	.done(function (user) {
	    		// checkuser();
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
				// checkuser();
	    		window.location = "/";
			})
			.fail(showErrorMessage);
	});

	$("#logout").on('click', function(){
		hoodie.account.signOut()
  		.done(function (user) {
  			checkuser();
  		})
  		.fail(showErrorMessage);
	})

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
		}
	}

	function showErrorMessage(error) {
		console.log(error);
		alert(error);
	}

});



