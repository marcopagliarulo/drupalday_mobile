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
		
		headerViewElement.add(time);
		var tableViewSection = Ti.UI.createTableViewSection({height : Ti.UI.SIZE, headerView : headerViewElement});
		rowViewLeft.add(title);
		rowViewLeft.add(speaker);
		rowView.add(rowViewLeft);
		tableViewRow.add(rowView);
		tableViewSection.add(tableViewRow);
		tableView.appendSection(tableViewSection);
	}
	return tableView;
}
var favorite = Alloy.createCollection('favorites');
favorite.fetch();
var favoriteData = favorite.toJSON();
if(favoriteData.length){
	var nids = new Array();
	for(var i = 0; i < favoriteData.length; i++){
		nids[i] = favoriteData[i].nid;
	}
	var talk = Alloy.createCollection('talk');
	talk.fetch({query : "select * from talk where nid IN (" + nids.join(",") + ") order by start ASC"});
	var talkData = talk.toJSON();
	$.favorites.add(createRow(talkData));
}
else{
	var label = Ti.UI.createLabel({text : "Non hai salvato nessuna sessione tra i tuoi favoriti, per creare la tua lista clicca sulle stelle nella lista delle sessioni"});
	var style = $.createStyle({
	    classes: "emptyFavotires",
	});
	label.applyProperties(style);
	$.favorites.add(label);
	$.favorites.layout = 'absolute';
}
