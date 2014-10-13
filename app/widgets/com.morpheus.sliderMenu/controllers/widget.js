/**
 * The slide menu widget
 * 
 * @class Widgets.com.mcongrove.slideMenu
 */
var menuOpen = false;

var items = [];
var itemBackground;
var itemSelectedBackground;
var itemColor;
var position;
var background;
var sectionColor;
var sectionBackground;
var elementShowHide;

/**
 * Initializes the slide menu
 * @param {Object} _params
 * @param {Array} _params.nodes The nodes (menu items) to show in the side menu as defined by the JSON configuration file
 * @param {Object} _params.color The colors for the menu
 * @param {String} _params.color.headingBackground The background color for menu headers
 * @param {String} _params.color.headingText The text color for menu headers
 */
$.init = function(params) {
	itemColor = typeof params.itemColor !== "undefined" ? params.itemColor : "#ffffff";
	itemBackground = typeof params.itemBackground !== "undefined" ? params.itemBackground : "#000000";
	itemSelectedBackground = typeof params.itemSelectedBackground !== "undefined" ? params.itemSelectedBackground : "#666666";
	sectionColor = typeof params.sectionColor !== "undefined" ? params.sectionColor : "#666666";
	sectionBackground = typeof params.sectionBackground !== "undefined" ? params.sectionBackground : "#000000";
	position = typeof params.position !== "undefined" ? params.position : "left";
	items = typeof params.items !== "undefined" ? params.items : [];
	background = typeof params.background !== "undefined" ? params.background : "#333333";
	elementShowHide = typeof params.elementShowHide !== "undefined" ? params.elementShowHide : null;
	if(elementShowHide != null){
		elementShowHide.addEventListener('click', function(){
			if (menuOpen){
				$.hideMenu();
			}else{
				$.showMenu();
			}
		});
	}
	$.sliderMenu.width = "80%";
	$.sliderMenu.left = "-80%";
	$.sliderMenu.backgroundColor = background;
	buildMenu(items);
	Ti.Gesture.addEventListener('orientationchange',function(e) {
		if (!menuOpen){
			$.sliderMenu.left = "-80%";
		}
	});
};

/**
 * Handles a click event on the nodes container
 * @param {Object} _event The event
 */
function handleClick(_event) {
	if(typeof _event.index !== "undefined") {
		$.setIndex(_event.index);
	}
};

function buildMenu(items, parent) {
	for(var i = 0; i < items.length; i++) {
		if(typeof items[i].font == 'undefined'){
			items[i].font = {
				fontSize: "16dp",
				fontFamily: "HelveticaNeue-Light"
			};
		}
		if(typeof items[i].section === 'boolean' && items[i].section){
			var section = Ti.UI.createView({
				top: "0",
				height: "30dp",
				width: Ti.UI.FILL,
				backgroundColor: sectionBackground
			});

			var sectionText = Ti.UI.createLabel({
				text: items[i].title,
				left: "3.06%",
				font: items[i].font,
				touchEnabled: false,
				verticalAlignment: Titanium.UI.TEXT_VERTICAL_ALIGNMENT_CENTER,
				color : sectionColor,
				isHeader: true
			});

			section.add(sectionText);

			var tiSection = Ti.UI.createTableViewSection({
				headerView: section
			});
			if(typeof parent === 'undefined') {
				$.sliderMenu.appendRow(tiSection);
			}
			else {
				//creo una nuova tabella
			}
			if(typeof items[i].children === 'object') {
				buildMenu(items[i].children, tiSection);
			}
		}
		else{
			var item = Ti.UI.createTableViewRow({
				id: items[i].id,
				height: "47dp",
				backgroundcolor: itemBackground,
				backgroundSelectedColor: itemSelectedBackground,
				selectedBackgroundColor: itemSelectedBackground,
			});
	
			var label = Ti.UI.createLabel({
				text: items[i].title,
				left: "14%",
				height: "100%",
				font: items[i].font,
				color: itemColor,
				touchEnabled: false
			});
	
			if(typeof items[i].image != 'undefined') {
				var icon = Ti.UI.createImageView({
					image: items[i].image,
					width: "8.33%",
					left: "3%",
					touchEnabled: false,
					preventDefaultImage: true
				});
	
				item.add(icon);
			}
			item.addEventListener('click',function(e){$.hide();});
			if(typeof items[i].callback == 'function') {
				item.addEventListener('click',items[i].callback);
			}
			item.add(label);
			if(typeof parent === 'undefined') {
				$.sliderMenu.appendRow(item);
			}
			else if(parent.getApiName() == 'Ti.UI.TableViewSection'){
				parent.add(item);
			}
			else if(parent.getApiName() == 'Ti.UI.TableView'){
				parent.appendRow(item);
			}
		}
	}
}


/**
 * Clears all items from the side menu
 */
exports.showMenu = function() {
	moveTo= 0;
	menuOpen=true;
	$.animateMenu(moveTo);
};
/**
 * Clears all items from the side menu
 */
exports.hideMenu= function() {
	moveTo= "-80%";
	menuOpen=false;
	$.animateMenu(moveTo);
};

/**
 * Sets the indexed item as active
 * @param {Object} _index The index of the item to show as active
 */
$.setIndex = function(_index) {
	$.Nodes.selectRow(_index);
};

$.animateMenu = function(moveTo){
	$.sliderMenu.animate({
		left:moveTo,
		curve : Ti.UI.ANIMATION_CURVE_EASE_OUT,
		duration:300
	});
};
