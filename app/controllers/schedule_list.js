openTalk = function(e){
	if(typeof e.source.nid != 'undefined'){
		var nid = e.source.nid;
		openController('talkDetail',nid);
	}
};
transformFunction = function(transform){
	var speaker = Alloy.Collections.instance('speaker');
	speaker.fetch();
	var uids = (typeof transform.uid == "string") ? transform.uid.split("|") : new Array();
	transform.speaker = new Array();
	for(var i = 0; i < uids.length; i++){
		speakerData = speaker.get(uids[i]);
		if(typeof speakerData != 'undefined'){
			transform.speaker[transform.speaker.length] = {
				name : speakerData.get("name"),
				surname : speakerData.get("surname")
			};
		}
	}
	return transform;
};
function createRow(talkHoursList){
	var tableView = Ti.UI.createScrollView({layout: "vertical", scrollType : "vertical"});
	var hoursIndexes = new Array();
	for(var i = 0; i < talkHoursList.length; i++){
		var start = new Date(parseInt(talkHoursList[i].start) * 1000);
		start = start.getHours() + ":" + ("0" + start.getMinutes()).slice(-2);
		var end = new Date(parseInt(talkHoursList[i].end) * 1000);
		end = end.getHours() + ":" + ("0" + end.getMinutes()).slice(-2);
		talkHoursList[i].time = start + " - " + end;
		var headerViewElement = Ti.UI.createView({layout: "vertical",height: Ti.UI.SIZE});
		$.addClass(headerViewElement,"headerSession");
		var time = Ti.UI.createLabel({touchEnabled: false, bubbeParent: true, text : talkHoursList[i] .time});
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
		talk.fetch({query : "select * from talk where start = " + talkHoursList[i].start + " and end = " + talkHoursList[i].end + " order by track ASC"});
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
		    var rowView = Ti.UI.createView({touchEnabled: false, bubbeParent: true, layout : "horizontal", width: Ti.UI.FILL, height: Ti.UI.SIZE});
			$.addClass(rowView,"rowView");
			var title = Ti.UI.createLabel({touchEnabled: false, bubbeParent: true, text : talk.title});
			$.addClass(title,"listTitle");
			$.addClass(title,"listTitleSession");
			
			var track = Ti.UI.createLabel({touchEnabled: false, bubbeParent: true, text : talk.track});
			$.addClass(track,"listTrack");
		    var rowViewLeft = Ti.UI.createView({touchEnabled: false, bubbeParent: true, layout : "vertical", width: "80%", height: Ti.UI.SIZE});
		    var rowViewRight = Ti.UI.createView({touchEnabled: false, bubbeParent: true, layout : "vertical", width: "20%", height: Ti.UI.SIZE});
			
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
			for(var k = 0; k < talk.speaker.length; k++){
				var speaker = Ti.UI.createLabel({touchEnabled: false, bubbeParent: true, text : talk.speaker[k].name + " " + talk.speaker[k].surname});
				$.addClass(speaker,"listSpeaker");
				rowViewLeft.add(speaker);
			}
			rowViewRight.add(favorite);
			rowViewRight.add(track);
			rowView.add(rowViewLeft);
			rowView.add(rowViewRight);
			tableViewRow.add(rowView);
			tableViewSection.add(tableViewRow);
			if(j != (talkData.length-1)){
				var rowSeparator = Ti.UI.createView();
				$.addClass(rowSeparator,"rowSeparator");
				tableViewSection.add(rowSeparator);
			}
		}
		tableView.add(tableViewSection);
	}
	return tableView;
}
var talk = Alloy.Collections.instance('talk');
talk.fetch({query : "select start, end from talk group by start,end order by start, end ASC"});
var talkHoursList = talk.toJSON();
$.schedule_list.add(createRow(talkHoursList));
