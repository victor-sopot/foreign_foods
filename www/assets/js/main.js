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
			$("#loginPage").hide();
			$("#signupPage").hide();
			$("#userConf").show();
			$("#userConf h2").text("Welcome, " + hoodie.account.username + "! Redirecting...");
			$("#currentUser").text("Signed In As " + hoodie.account.username);
			$("#login").hide();
			$("#logout").show();
		} else {
			$("#loginPage").show();
			$("#signupPage").show();
			$("#userConf").hide();
			$("#userConf h2").text("");
			$("#currentUser").text("Not Signed In");
			$("#login").show();
			$("#logout").hide();
		}
	}

	function showErrorMessage(error) {
		console.log(error);
		alert(error);
	}

});



