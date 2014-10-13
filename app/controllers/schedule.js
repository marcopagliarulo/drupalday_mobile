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
	var speaker = Alloy.createCollection('speaker');
	speaker.fetch();
	speakerData = speaker.get(transform.uid);
	transform.name = speakerData.get("name");
	transform.surname = speakerData.get("surname");
	var start = new Date(parseInt(transform.start) * 1000);
	transform.start = start.getHours() + ":" + start.getMinutes();
	var end = new Date(parseInt(transform.end) * 1000);
	transform.end = end.getHours() + ":" + end.getMinutes();
	transform.time = transform.start + " - " + transform.end + "\n";
	return transform;
};

function createRow(talkData){
	var tableView = Ti.UI.createTableView();
	for(var i = 0; i < talkData.length; i++){
		var talk =  transformFunction(talkData[i]);
		var favorites = Alloy.createCollection('favorites');
		favorites.fetch();
		var favoritesData = favorites.get(talk.nid);
		var inFavorite = (typeof favoritesData == 'undefined') ? 0 : favoritesData.get('nid');
		var headerViewElement = Ti.UI.createView();
		var style = $.createStyle({
		    classes: "headerSession",
		});
		headerViewElement.applyProperties(style);
		var time = Ti.UI.createLabel({touchEnabled : false, text : talk.time});
		var style = $.createStyle({
		    classes: "scheduleDate",
		});
		time.applyProperties(style);
		var tableViewRow = Ti.UI.createTableViewRow({nid : talk.nid});
		tableViewRow.addEventListener('click',function(e){
			openTalk(e);
		});
	    var rowView = Ti.UI.createView({touchEnabled : false, layout : "absolute", width: Ti.UI.FILL, height: Ti.UI.SIZE});
		var style = $.createStyle({
		    classes: "rowView",
		});
		rowView.applyProperties(style);
		var title = Ti.UI.createLabel({touchEnabled : false, text : talk.title});
		var style = $.createStyle({
		    classes: "listTitle",
		});
		title.applyProperties(style);
		var speaker = Ti.UI.createLabel({touchEnabled : false, text : talk.name + " " + talk.surname});
		var style = $.createStyle({
		    classes: "listSpeaker",
		});
		speaker.applyProperties(style);
	    var rowViewLeft = Ti.UI.createView({touchEnabled : false, layout : "vertical", width: Ti.UI.FILL, height: Ti.UI.SIZE});
		var imagePath = (inFavorite) ? '/images/favOn.png' : '/images/favOff.png';
		var favorite = Ti.UI.createImageView({image : imagePath, nid : talk.nid, bubbleParent : false});
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
		
		headerViewElement.add(time);
		var tableViewSection = Ti.UI.createTableViewSection({headerView : headerViewElement});
		rowViewLeft.add(title);
		rowViewLeft.add(speaker);
		rowView.add(rowViewLeft);
		rowView.add(favorite);
		tableViewRow.add(rowView);
		tableViewSection.add(tableViewRow);
		tableView.appendSection(tableViewSection);
	}
	return tableView;
}

var talk = Alloy.createCollection('talk');
talk.fetch({query : "select * from talk where track IN ('all','code') order by start ASC"});
var talkCodeData = talk.toJSON();
$.codeView.add(createRow(talkCodeData));
talk.fetch({query : "select * from talk where track IN ('all','biz') order by start ASC"});
var talkBizData = talk.toJSON();
$.bizView.add(createRow(talkBizData));
