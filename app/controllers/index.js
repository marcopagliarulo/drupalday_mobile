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
];
function openMenuItem(event){
	if(typeof event.source.id != 'undefined'){
		for(var i = 0; i < menuItems.length; i++) {
			if(menuItems[i].id == event.source.id){
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
    itemColor: '#ffffff',
    itemBackground : '#ffffff',
    background : '#139ad4',
    itemSelectedBackground : '#ea415e',
    elementShowHide : $.header
});
var startdate = new Date(Alloy.CFG.startdate);
var now = new Date();
var difference = startdate - now;
if(difference){
	openController('countdown');
}
else{
	openController('live');
}
$.index.open();
Alloy.Globals.current = $;