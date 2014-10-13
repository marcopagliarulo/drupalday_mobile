openSpeaker = function(e){
	if(typeof e.source.uid != 'undefined'){
		var uid = e.source.uid;
		openController('speakerDetail',uid);
	}
};


var speaker = Alloy.createCollection('speaker');
speaker.fetch({query : "select * from speaker order by surname ASC"});
var speakerData = speaker.toJSON();


var tableView = Ti.UI.createTableView();
for(var i = 0; i < speakerData.length; i++){
	var speaker =  speakerData[i];

	var tableViewRow = Ti.UI.createTableViewRow({uid : speaker.uid});
	tableViewRow.addEventListener('click',function(e){
		openSpeaker(e);
	});
    var rowView = Ti.UI.createView({touchEnabled : false, layout : "absolute", width: Ti.UI.FILL, height: Ti.UI.SIZE});
	var style = $.createStyle({
	    classes: "rowView",
	});
	rowView.applyProperties(style);
	var image= Ti.UI.createImageView({touchEnabled : false, image : speaker.avatar});
	var style = $.createStyle({
	    classes: "listImage",
	});
	image.applyProperties(style);
	var title = Ti.UI.createLabel({touchEnabled : false, text : speaker.name + "\n" + speaker.surname});
	var style = $.createStyle({
	    classes: "listTitle",
	});
	title.applyProperties(style);
	
	var tableViewSection = Ti.UI.createTableViewSection({height : Ti.UI.SIZE});
	rowView.add(image);
	rowView.add(title);
	tableViewRow.add(rowView);
	tableViewSection.add(tableViewRow);
	tableView.appendSection(tableViewSection);
}

$.speakerView.add(tableView);
