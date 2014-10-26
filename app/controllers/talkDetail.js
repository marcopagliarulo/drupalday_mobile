var args = arguments[0] || {};
var talk = Alloy.Collections.instance('talk');
talk.fetch();
talkItem = talk.get(args);
var speaker = Alloy.Collections.instance('speaker');
speaker.fetch();
var uids = talkItem.get('uid').split("|");
var speakers = new Array();
for(var i = 0; i < uids.length; i++){
	speakerData = speaker.get(uids[i]);
	if(typeof speakerData != 'undefined'){
		speakers[speakers.length] = {
			name : speakerData.get("name"),
			surname : speakerData.get("surname")
		};
	}
}

var name = (typeof speakerData != "undefined") ? speakerData.get('name') : "";
var surname = (typeof speakerData != "undefined") ? speakerData.get('surname') : "";

var title = Ti.UI.createLabel({touchEnabled : false, text : talkItem.get('title')});
$.addClass(title,"listTitle");
var rowViewLeft = Ti.UI.createView({touchEnabled : false, layout : "vertical", width: "80%", height: Ti.UI.SIZE});
var rowViewRight = Ti.UI.createView({touchEnabled : false, layout : "vertical", width: "20%", height: Ti.UI.SIZE});
var favorites = Alloy.Collections.instance('favorites');
favorites.fetch();
var favoritesData = favorites.get(talkItem.get('nid'));
var inFavorite = (typeof favoritesData == 'undefined') ? 0 : favoritesData.get('nid');
var imagePath = (inFavorite) ? '/images/favOn.png' : '/images/favOff.png';
var favorite = Ti.UI.createImageView({
	image : imagePath, 
	nid : talkItem.get('nid'), 
	bubbleParent : false,
	top: "5dp"
});
favorite.addEventListener('click',function(e){
	var favorites = Alloy.Collections.instance('favorites');
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
var fb = Ti.UI.createImageView({
	image : '/images/facebook.png',
	top : "5dp",
	bubbleParent : false
});
fb.addEventListener("click",function(e){
	var data = {
		link : talkItem.get('url'),
		name : talkItem.get('title')
	};
	fbShare(data);
});
var twitter = Ti.UI.createImageView({
	image : '/images/twitter.png',
	top : "5dp",
	bubbleParent : false
});
twitter.addEventListener("click",function(e){
	var data = talkItem.get('url') + Alloy.CFG.hastag;
	twitterShare(data);
});
rowViewRight.add(favorite);
rowViewRight.add(fb);
rowViewRight.add(twitter);
var headerView = Ti.UI.createView({layout: "horizontal", width: Ti.UI.FILL});
$.addClass(headerView,"headerView");
rowViewLeft.add(title);
for(var k = 0; k < speakers.length; k++){
	var speaker = Ti.UI.createLabel({touchEnabled : false, text : speakers[k].name + " " + speakers[k].surname});
	$.addClass(speaker,"listSpeaker");
	rowViewLeft.add(speaker);
}
headerView.add(rowViewLeft);
headerView.add(rowViewRight);
$.talkDetail.add(headerView);

var subHeaderView = Ti.UI.createView({layout: "horizontal"});
$.addClass(subHeaderView,"subHeaderView");
var category = Ti.UI.createLabel({touchEnabled : false, text : talkItem.get('category')});
$.addClass(category,"category");
subHeaderView.add(category);
var viewLevel = Ti.UI.createView({layout: "vertical"});
$.addClass(viewLevel,"viewLevel");
var viewLevelImages = Ti.UI.createView({layout: "horizontal"});
var storedLevel = talkItem.get('level');
for(var i = 1; i < 4; i++){
	var imagePath = (storedLevel >= 1) ? '/images/levelOn.png' : '/images/level.png';
	var level = Ti.UI.createImageView({image : imagePath});
	viewLevelImages.add(level);
}
levelLabel = Ti.UI.createLabel({text: "livello"});
$.addClass(levelLabel,"levelLabel");
viewLevel.add(viewLevelImages);
viewLevel.add(levelLabel);
subHeaderView.add(viewLevel);

$.talkDetail.add(subHeaderView);

var body = Ti.UI.createLabel({touchEnabled : false, text : talkItem.get('body')});
$.addClass(body,"body");
var scrollView = Ti.UI.createScrollView({layout: 'vertical', scrollType : 'vertical', top: "5%"});
scrollView.add(body);
$.talkDetail.add(scrollView);
