openTalk = function(e){
	if(typeof e.source.nid != 'undefined'){
		var nid = e.source.nid;
		openController('talkDetail',nid);
	}
};
transformFunction = function(transform){
	var speaker = Alloy.Collections.instance('speaker');
	speaker.fetch();
	speakerData = speaker.get(transform.uid);

	if(typeof speakerData != 'undefined'){
		transform.name = speakerData.get("name");
		transform.surname = speakerData.get("surname");
	}
	else{
		transform.name = "";
		transform.surname = "";
	}
	var start = new Date(parseInt(transform.start) * 1000);
	transform.start = start.getHours() + ":" + ("0" + start.getMinutes()).slice(-2);
	var end = new Date(parseInt(transform.end) * 1000);
	transform.end = end.getHours() + ":" + ("0" + end.getMinutes()).slice(-2);
	transform.time = transform.start + " - " + transform.end;
	return transform;
};
function createRow(talkData){
	var tableView = Ti.UI.createScrollView({layout: "vertical", scrollType : "vertical"});
	for(var i = 0; i < talkData.length; i++){
		var talk =  transformFunction(talkData[i]);
		var favorites = Alloy.Collections.instance('favorites');
		favorites.fetch();
		var favoritesData = favorites.get(talk.nid);
		var inFavorite = (typeof favoritesData == 'undefined') ? 0 : favoritesData.get('nid');
		var tableViewRow = Ti.UI.createView({nid : talk.nid, height: Ti.UI.SIZE});
		var headerViewElement = Ti.UI.createView({layout: "vertical",height: Ti.UI.SIZE});
		$.addClass(headerViewElement,"headerSession");
		var headerSeparatorTop = Ti.UI.createView();
		$.addClass(headerSeparatorTop,"headerSeparatorTop");
		var headerSeparatorBottom = Ti.UI.createView();
		$.addClass(headerSeparatorBottom,"headerSeparatorBottom");
		var time = Ti.UI.createLabel({touchEnabled: false, bubbeParent: true, text : talk.time});
		$.addClass(time,"scheduleDate");
		if(Alloy.Globals.isAndroidTablet){
			$.addClass(time,"scheduleDateTablet");
		}
		headerViewElement.add(headerSeparatorTop);
		headerViewElement.add(time);
		headerViewElement.add(headerSeparatorBottom);
		tableViewRow.addEventListener('click',function(e){
			openTalk(e);
		});
	    var rowView = Ti.UI.createView({touchEnabled: false, bubbeParent: true, layout : "horizontal", width: Ti.UI.FILL, height: Ti.UI.SIZE});
		$.addClass(rowView,"rowView");
		var title = Ti.UI.createLabel({touchEnabled: false, bubbeParent: true, text : talk.title});
		$.addClass(title,"listTitle listTitleSession");
		if(Alloy.Globals.isAndroidTablet){
			$.addClass(title,"
			listTitleTablet listTitleSessionTablet");
		}
		var speaker = Ti.UI.createLabel({touchEnabled: false, bubbeParent: true, text : talk.name + " " + talk.surname});
		$.addClass(speaker,"listSpeaker");
		if(Alloy.Globals.isAndroidTablet){
			$.addClass(speaker,"listSpeakerTablet");
		}
		
		var track = Ti.UI.createLabel({touchEnabled: false, bubbeParent: true, text : talk.track});
		$.addClass(track,"listTrack");
		if(Alloy.Globals.isAndroidTablet){
			$.addClass(track,"listTrackTablet");
		}
	    var rowViewLeft = Ti.UI.createView({touchEnabled: false, bubbeParent: true, layout : "vertical", width: "80%", height: Ti.UI.SIZE});
	    var rowViewRight = Ti.UI.createView({touchEnabled: false, bubbeParent: true, layout : "vertical", width: "20%", height: Ti.UI.SIZE});
		
		var favorite = Ti.UI.createImageView({image : '/images/favOn.png', nid : talk.nid, bubbleParent : false, width:"50%"});
		$.addClass(favorite,"favorite");
		favorite.addEventListener('click',function(e){
			var favorites = Alloy.Collections.instance('favorites');
			favorites.fetch();
			var favoritesData = favorites.get(e.source.nid);
			favoritesData.destroy();
			e.source.parent.parent.parent.parent.parent.remove(e.source.parent.parent.parent.parent);
			if(e.source.parent.parent.parent.parent.parent.children.length == 0){
				$.nofavorites.visible = true;
			}
		});
		tableViewSection = Ti.UI.createView({layout: "vertical", height : Ti.UI.SIZE});
		tableViewSection.add(headerViewElement);
		rowViewLeft.add(title);
		rowViewLeft.add(speaker);
		rowViewRight.add(favorite);
		rowViewRight.add(track);
		rowView.add(rowViewLeft);
		rowView.add(rowViewRight);
		tableViewRow.add(rowView);
		tableViewSection.add(tableViewRow);
		tableView.add(tableViewSection);
	}
	return tableView;
}
var favorite = Alloy.Collections.instance('favorites');
favorite.fetch();
var favoriteData = favorite.toJSON();
if(favoriteData.length){
	var nids = new Array();
	$.nofavorites.visible = false;
	for(var i = 0; i < favoriteData.length; i++){
		nids[i] = favoriteData[i].nid;
	}
	var talk = Alloy.Collections.instance('talk');
	talk.fetch({query : "select * from talk where nid IN (" + nids.join(",") + ") order by start ASC"});
	var talkData = talk.toJSON();
	$.favorites.add(createRow(talkData));
}
