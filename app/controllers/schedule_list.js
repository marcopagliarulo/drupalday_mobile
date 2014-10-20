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
	return transform;
};
function createRow(talkHoursList){
	var tableView = Ti.UI.createScrollView({layout: "vertical", scrollType : "vertical"});
	var hoursIndexes = new Array();
	for(var i = 0; i < talkHoursList.length; i++){
		var start = new Date(parseInt(talkHoursList[i].start) * 1000);
		start = start.getHours() + ":" + start.getMinutes();
		var end = new Date(parseInt(talkHoursList[i].end) * 1000);
		end = end.getHours() + ":" + end.getMinutes();
		talkHoursList[i].time = start + " - " + end;
		var headerViewElement = Ti.UI.createView({layout: "vertical",height: Ti.UI.SIZE});
		$.addClass(headerViewElement,"headerSession");
		var time = Ti.UI.createLabel({touchEnabled : false, text : talkHoursList[i] .time});
		$.addClass(time,"scheduleDate");
		var headerSeparatorTop = Ti.UI.createView();
		$.addClass(headerSeparatorTop,"headerSeparatorTop");
		var headerSeparatorBottom = Ti.UI.createView();
		$.addClass(headerSeparatorBottom,"headerSeparatorBottom");
		headerViewElement.add(headerSeparatorTop);
		headerViewElement.add(time);
		headerViewElement.add(headerSeparatorBottom);
		hoursIndexes[talkHoursList[i].start + "-" + talkHoursList[i].end] = i;
		var tableViewSection = Ti.UI.createView({layout: "vertical", height : Ti.UI.SIZE});
		tableViewSection.add(headerViewElement);
		var talk = Alloy.Collections.instance('talk');
		talk.fetch({query : "select * from talk where start = " + talkHoursList[i].start + " and end = " + talkHoursList[i].end});
		var talkData = talk.toJSON();
		for(var j = 0; j < talkData.length; j++){
			var talk =  transformFunction(talkData[j]);
			var favorites = Alloy.Collections.instance('favorites');
			favorites.fetch();
			var favoritesData = favorites.get(talk.nid);
			var inFavorite = (typeof favoritesData == 'undefined') ? 0 : favoritesData.get('nid');
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
			
			var track = Ti.UI.createLabel({touchEnabled : false, text : talk.track});
			$.addClass(track,"listTrack");
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
			
			rowViewLeft.add(title);
			rowViewLeft.add(speaker);
			rowViewRight.add(favorite);
			rowViewRight.add(track);
			rowView.add(rowViewLeft);
			rowView.add(rowViewRight);
			tableViewRow.add(rowView);
			if(j != 0 && j != (talkData.length-1)){
				var rowSeparator = Ti.UI.createView();
				$.addClass(rowSeparator,"rowSeparator");
				tableViewRow.add(rowSeparator);
			}
			tableViewSection.add(tableViewRow);
		}
		tableView.add(tableViewSection);
	}
	return tableView;
}
var talk = Alloy.Collections.instance('talk');
talk.fetch({query : "select start, end from talk group by start,end order by start, end ASC"});
var talkHoursList = talk.toJSON();
$.schedule_list.add(createRow(talkHoursList));
