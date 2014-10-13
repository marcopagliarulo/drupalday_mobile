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
	return transform;
};
function createRow(talkHoursList,talkData){
	var tableViewSections = new Array();
	var hoursIndexes = new Array();
	for(var i = 0; i < talkHoursList.length; i++){
		var start = new Date(parseInt(talkHoursList[i].start) * 1000);
		start = start.getHours() + ":" + start.getMinutes();
		var end = new Date(parseInt(talkHoursList[i].end) * 1000);
		end = end.getHours() + ":" + end.getMinutes();
		talkHoursList[i].time = start + " - " + end + "\n";
		var headerViewElement = Ti.UI.createView();
		var style = $.createStyle({
		    classes: "headerSession",
		});
		headerViewElement.applyProperties(style);
		var time = Ti.UI.createLabel({touchEnabled : false, text : talkHoursList[i] .time});
		var style = $.createStyle({
		    classes: "scheduleDate",
		});
		time.applyProperties(style);
		headerViewElement.add(time);
		hoursIndexes[talkHoursList[i].start + "-" + talkHoursList[i].end] = i;
		tableViewSections[i] = Ti.UI.createTableViewSection({height : Ti.UI.SIZE, headerView : headerViewElement});
	}
	var tableView = Ti.UI.createTableView();
	for(var i = 0; i < talkData.length; i++){
		var talk =  transformFunction(talkData[i]);
		var favorites = Alloy.createCollection('favorites');
		favorites.fetch();
		var favoritesData = favorites.get(talk.nid);
		var inFavorite = (typeof favoritesData == 'undefined') ? 0 : favoritesData.get('nid');
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
		
		rowViewLeft.add(title);
		rowViewLeft.add(speaker);
		rowView.add(rowViewLeft);
		rowView.add(favorite);
		tableViewRow.add(rowView);
		hoursIndex = hoursIndexes[talk.start + "-" + talk.end];
		tableViewSections[hoursIndex].add(tableViewRow);
	}
	tableView.appendSection(tableViewSections);
	
	return tableView;
}

var talkHours = Alloy.createCollection('talk');
talkHours.fetch({query : "select start, end from talk group by start,end order by start, end ASC"});
var talkHoursList = talkHours.toJSON();
var talk	 = Alloy.createCollection('talk');
talk.fetch({query : "select * from talk order by start ASC"});
var talkList = talk.toJSON();
$.schedule.add(createRow(talkHoursList,talkList));
