var args = arguments[0] || {};
var talk = Alloy.createCollection('talk');
talk.fetch();
talkItem = talk.get(args);
var speaker = Alloy.createCollection('speaker');
speaker.fetch();
speakerData = speaker.get(talkItem.get('uid'));


var title = Ti.UI.createLabel({touchEnabled : false, text : talkItem.get('title')});
var style = $.createStyle({
    classes: "listTitle",
});
title.applyProperties(style);
var speaker = Ti.UI.createLabel({touchEnabled : false, text : speakerData.get('name') + " " + speakerData.get('surname')});
var style = $.createStyle({
    classes: "listSpeaker",
});
speaker.applyProperties(style);
var rowViewLeft = Ti.UI.createView({touchEnabled : false, layout : "vertical", width: Ti.UI.FILL, height: Ti.UI.SIZE});
var favorites = Alloy.createCollection('favorites');
favorites.fetch();
var favoritesData = favorites.get(talkItem.get('nid'));
var inFavorite = (typeof favoritesData == 'undefined') ? 0 : favoritesData.get('nid');
var imagePath = (inFavorite) ? '/images/favOn.png' : '/images/favOff.png';
var favorite = Ti.UI.createImageView({image : imagePath, nid : talkItem.get('nid'), bubbleParent : false});
var style = $.createStyle({
    classes: "favorite",
});

favorite.applyProperties(style);
favorite.addEventListener('click',function(e){
	var favorites = Alloy.createCollection('favorites');
	favorites.fetch();
	var favoritesData = favorites.get(e.source.nid);
	var inFavorite = (typeof favoritesData == 'undefined') ? 0 : favoritesData.get('nid');
	if(inFavorite){
		e.source.image = '/images/favOff.png';
		favoritesData.destroy();
	}
	else{
		e.source.image = '/images/favOn.png';
		var newFavorite = Alloy.createModel('favorites',{
		    nid: e.source.nid
		});
		newFavorite.save();
	}
});
var headerView = Ti.UI.createView({layout: "absolute"});
var style = $.createStyle({
    classes: "headerView",
});
headerView.applyProperties(style);
rowViewLeft.add(title);
rowViewLeft.add(speaker);
headerView.add(rowViewLeft);
headerView.add(favorite);
$.talkDetail.add(headerView);

var subHeaderView = Ti.UI.createView({layout: "absolute"});
var style = $.createStyle({
    classes: "subHeaderView",
});
subHeaderView.applyProperties(style);
var category = Ti.UI.createLabel({touchEnabled : false, text : talkItem.get('category')});
var style = $.createStyle({
    classes: "category",
});
category.applyProperties(style);
subHeaderView.add(category);
var viewLevel = Ti.UI.createView({layout: "horizontal"});
var style = $.createStyle({
    classes: "viewLevel",
});
viewLevel.applyProperties(style);
var storedLevel = talkItem.get('level');
for(var i = 1; i < 4; i++){
	var imagePath = (storedLevel >= 1) ? '/images/levelOn.png' : '/images/level.png';
	var level = Ti.UI.createImageView({image : imagePath});
	viewLevel.add(level);
}
subHeaderView.add(viewLevel);

$.talkDetail.add(subHeaderView);

var body = Ti.UI.createLabel({touchEnabled : false, text : talkItem.get('body')});
var style = $.createStyle({
    classes: "body",
});
body.applyProperties(style);
var scrollView = Ti.UI.createScrollView({layout: 'vertical', scrollType : 'vertical', top: "5%"});
scrollView.add(body);
$.talkDetail.add(scrollView);
