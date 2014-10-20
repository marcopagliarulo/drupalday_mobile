$.code.addEventListener('click',function(e){
	switchTab(e);
});
$.biz.addEventListener('click',function(e){
	switchTab(e);
});

var switchTab = function(e){
	var style = $.createStyle({
	    classes: "tabActive",
	});
	e.source.applyProperties(style);
	var styleBase = $.createStyle({
	    classes: "tab",
	});
	switch(e.source.id){
		case "code":
			$.codeView.visible = true;
			$.bizView.visible = false;
			$.biz.applyProperties(styleBase);
			break;
		case "biz":
			$.bizView.visible = true;
			$.codeView.visible = false;
			$.code.applyProperties(styleBase);
			break;
	}
};
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
	transform.start = start.getHours() + ":" + start.getMinutes();
	var end = new Date(parseInt(transform.end) * 1000);
	transform.end = end.getHours() + ":" + end.getMinutes();
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
		var headerViewElement = Ti.UI.createView({layout: "vertical",height: Ti.UI.SIZE});
		$.addClass(headerViewElement,"headerSession");
		var time = Ti.UI.createLabel({touchEnabled : false, text : talk.time});
		$.addClass(time,"scheduleDate");
		var headerSeparatorTop = Ti.UI.createView();
		$.addClass(headerSeparatorTop,"headerSeparatorTop");
		var headerSeparatorBottom = Ti.UI.createView();
		$.addClass(headerSeparatorBottom,"headerSeparatorBottom");
		headerViewElement.add(headerSeparatorTop);
		headerViewElement.add(time);
		headerViewElement.add(headerSeparatorBottom);
		var tableViewRow = Ti.UI.createView({nid : talk.nid, height: Ti.UI.SIZE});
		tableViewRow.addEventListener('click',function(e){
			openTalk(e);
		});
	    var rowView = Ti.UI.createView({touchEnabled : false, layout : "horizontal", width: Ti.UI.FILL, height: Ti.UI.SIZE});
		$.addClass(rowView,"rowView");
		var title = Ti.UI.createLabel({touchEnabled : false, text : talk.title});
		$.addClass(title,"listTitle");
		var speaker = Ti.UI.createLabel({touchEnabled : false, text : talk.name + " " + talk.surname});
		$.addClass(speaker,"listSpeaker");
		
//		var track = Ti.UI.createLabel({touchEnabled : false, text : talk.track});
//		$.addClass(track,"listTrack");
	    var rowViewLeft = Ti.UI.createView({touchEnabled : false, layout : "vertical", width: "80%", height: Ti.UI.SIZE});
	    var rowViewRight = Ti.UI.createView({touchEnabled : false, layout : "vertical", width: "20%", height: Ti.UI.SIZE});
		
		var imagePath = (inFavorite) ? '/images/favOn.png' : '/images/favOff.png';
		var favorite = Ti.UI.createImageView({image : imagePath, nid : talk.nid, bubbleParent : false});
		$.addClass(favorite,"favorite");
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
		
		var tableViewSection = Ti.UI.createView({layout: "vertical", height : Ti.UI.SIZE});
		rowViewLeft.add(title);
		rowViewLeft.add(speaker);
		rowViewRight.add(favorite);
//		rowViewRight.add(track);
		rowView.add(rowViewLeft);
		rowView.add(rowViewRight);
		tableViewRow.add(rowView);
		tableViewSection.add(headerViewElement);
		tableViewSection.add(tableViewRow);
		tableView.add(tableViewSection);
	}
	return tableView;
}

var talk = Alloy.Collections.instance('talk');
talk.fetch({query : "select * from talk where track IN ('all','Sala 1') order by start ASC"});
var talkCodeData = talk.toJSON();
$.codeView.add(createRow(talkCodeData));
talk.fetch({query : "select * from talk where track IN ('all','Sala 2') order by start ASC"});
var talkBizData = talk.toJSON();
$.bizView.add(createRow(talkBizData));
