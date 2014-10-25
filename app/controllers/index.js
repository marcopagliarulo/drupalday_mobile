Alloy.Globals.currentControllerName = 'index';
Alloy.Globals.container = $.container;
var defaultFont = {
	fontSize : "20sp",
	fontFamily : Alloy.Globals.museo_slab_700
};
// Create our node items
var menuItems = [
    { id: 1, controller : "schedule" , title: "Sessioni", image: "/images/clock.png" , font: defaultFont , callback : function(e){openMenuItem(e);}},
    { id: 2, controller : "favorites" , title: "Favoriti", image: "/images/star.png" , font: defaultFont , callback : function(e){openMenuItem(e);} },
    { id: 3, controller : "speaker" , title: "Speaker", image: "/images/voice.png" , font: defaultFont , callback : function(e){openMenuItem(e);} },
    { id: 4, controller : "sponsor" , title: "Sponsor", image: "/images/diamond.png" , font: defaultFont , callback : function(e){openMenuItem(e);} },
    { id: 5, controller : "blog" , title: "Blog", image: "/images/pen.png" , font: defaultFont , callback : function(e){openMenuItem(e);} },
    { id: 6, controller : "location" , title: "Location", image: "/images/pin.png" , font: defaultFont , callback : function(e){openMenuItem(e);} },
    { id: 7, controller : "info" , title: "Info", image: "/images/info.png" , font: defaultFont , callback : function(e){openMenuItem(e);} },
];
function openMenuItem(event){
	if(typeof event.source.id != 'undefined'){
		for(var i = 0; i < menuItems.length; i++) {
			if(menuItems[i].id == event.source.id && menuItems[i].controller != Alloy.Globals.currentControllerName){
				openController(menuItems[i].controller);
				$.headerTitle.text = menuItems[i].title.toUpperCase();
				return;
			}
		}
	}
}
function openIndex(event){
	if(difference){
		openController('countdown');
	}
	else{
		openController('live');
	}
	$.headerTitle.text = "DRUPALDAY 2014";
	$.SliderMenuContainer.hideMenu();
}
// Initialize the slide menu
$.SliderMenuContainer.init({
    items: menuItems,
    itemColor: Alloy.CFG.colors.third,
    itemBackground : Alloy.CFG.colors.first,
    background : Alloy.CFG.colors.first,
    itemSelectedBackground : Alloy.CFG.colors.second,
    elementShowHide : $.header
});
var startdate = new Date(Alloy.CFG.startdate);
var now = new Date();
var difference = startdate - now;
if(difference > 0){
	openController('countdown');
}
else{
	openController('live');
}
$.index.open();
Alloy.Globals.current = $;
if(Alloy.Globals.osName == 'android'){
	$.index.addEventListener('androidback', function(e) {
		if(typeof Alloy.Globals.prevController[Alloy.Globals.prevController.length-2] != 'undefined'){
		    e.cancelBubble = true;
		    var last = Alloy.Globals.prevController.pop();
		    var controller = Alloy.Globals.prevController.pop();
		    Alloy.Globals.prevController[Alloy.Globals.prevController.length] = controller;
			for(var i = 0; i < menuItems.length; i++){
				if(menuItems[i].controller == controller.controllerName){
					$.headerTitle.text = menuItems[i].title.toUpperCase();
				}
			}
			if(controller.controllerName == 'countdown' || controller.controllerName == 'live'){
				$.headerTitle.text = 'DRUPALDAY 2014';
			}
		    openController(controller.controllerName,controller.args,true);
		}
		else{
			$.index.close();
		}
	});
}
if(Alloy.Globals.updateCount <= 0){
	$.index.remove($.loading);
}

Ti.App.addEventListener('updateDataEnd', function(e){
	if(typeof Alloy.Globals.filesDownload[e.type] != 'undefined' && Alloy.Globals.filesDownload[e.type].length > 0){
		var files = Alloy.Globals.filesDownload[e.type].shift();
		var currentFile = files.shift();
		currentFile.callback(currentFile.value, currentFile.data, currentFile.field, e.type, files);
	}
	Alloy.Globals.updateCount--;
	if(Alloy.Globals.updateCount <= 0){
		$.index.remove($.loading);
	}
});
