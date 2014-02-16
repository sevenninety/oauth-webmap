define([
	"dojo/ready",
	"dojo/parser",
	"dojo/dom",
	"dojo/on",
	"dojo/dom-style", 
	"dojo/dom-attr",
	"dojo/_base/array",
	"esri/arcgis/Portal", 
	"esri/arcgis/utils", 
	"app/OAuthHelper",
	"dijit/registry",
	"dijit/form/Button",
	"dijit/layout/ContentPane",
    "dijit/layout/BorderContainer"], 
	function(ready, parser, dom, on, domStyle, domAttr, array, Portal, arcgisUtils, OAuthHelper, registry) { 
		var handle;
		
		ready(function() {
			// Call the parser to create the dijit layout
			parser.parse();
			
			OAuthHelper.init({
				appId : "",
				portal : "http://techresearch.maps.arcgis.com",
				expiration : (14 * 24 * 60), // 2 weeks, in minutes
				popup : false
			});

			if (OAuthHelper.isSignedIn()) {
				displayWebMap();
			} else {
				setButtonState("signIn");
			}

			function signIn() {
				OAuthHelper.signIn().then(displayWebMap);
			}
			
			function signOut() {
				OAuthHelper.signOut();
				setButtonState("signIn");
			}
			
			function displayWebMap() {
				arcgisUtils.arcgisUrl = "//techresearch.maps.arcgis.com/sharing/content/items/";

				arcgisUtils.createMap("f801c138592b4ea1b68953f26b5e3ec6", "mapCanvas").then(function(response) {
					setButtonState("signOut");
				}, function(error) {
					setButtonState("signIn");
					console.log("Error occurred while creating map: ", error);
				});
			}
			
			function setButtonState(mode) {
				var button = registry.byId("signInButton");
				
				if (handle) {
					handle.remove();
				}
				
				if (mode == "signIn") {
					handle = on(button, "click", signIn);
					button.set("label", "Sign In");
				} else {		
					handle = on(button, "click", signOut);
					button.set("label", "Sign Out");
				}
			}
		}
	);
});