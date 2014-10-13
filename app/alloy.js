// The contents of this file will be executed before any of
// your view controllers are ever executed, including the index.
// You have access to all functionality on the `Alloy` namespace.
//
// This is a great place to do any initialization for your app
// or create any global variables/functions that you'd like to
// make available throughout your app. You can easily make things
// accessible globally by attaching them to the `Alloy.Globals`
// object. For example:
//
// Alloy.Globals.someGlobalFunction = function(){};
Alloy.Globals.Map = require('ti.map');
Alloy.Globals.osName = Ti.Platform.osname;
switch(Alloy.Globals.osName){
	case 'android':
		Alloy.Globals.museo_slab_500 = 'museo_slab_500';
		Alloy.Globals.museo_slab_700 = 'museo_slab_700';
		Alloy.Globals.museosans_300 = 'museosans_300';
		Alloy.Globals.museosans_300italic = 'museosans_300italic';
		Alloy.Globals.museosans_700 = 'museosans_700';
		break;
	default:
		Alloy.Globals.museo_slab_500 = 'Museo Slab 500';
		Alloy.Globals.museo_slab_700 = 'Museo Slab 700';
		Alloy.Globals.museosans_300 = 'Museo Sans 300';
		Alloy.Globals.museosans_300italic = 'Museo Sans 300 Italic';
		Alloy.Globals.museosans_700 = 'Museo Sans 700';
		break;
}
Alloy.Globals.deviceHeight = Ti.Platform.displayCaps.platformHeight;
Alloy.Globals.deviceWidth = Ti.Platform.displayCaps.platformWidth;
var blogImageWidth = 930;
var blogImageHeight = 290;
Alloy.Globals.blogImage = {
	width : Alloy.Globals.deviceWidth,
	height : (Alloy.Globals.deviceWidth*blogImageHeight)/blogImageWidth
};

openController = function(controller,args){
	args = args || {};
	var container = Alloy.Globals.container;
	if(container.children.length){
		container.remove(container.children[0]);
	}
	if(typeof Alloy.Globals.previousController != 'undefined'){
		Alloy.Globals.previousController.destroy();
	}
	Alloy.Globals.previousController = Alloy.createController(controller,args);
	var controllerView = Alloy.Globals.previousController.getView();
	container.add(controllerView);
};
