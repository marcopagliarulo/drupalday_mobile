openSpeaker = function(e){
	if(typeof e.source.uid != 'undefined'){
		var uid = e.source.uid;
		openController('speakerDetail',uid);
	}
};


var speaker = Alloy.createCollection('speaker');
speaker.fetch({query : "select * from speaker order by surname ASC"});
var speakerData = speaker.toJSON();


var tableView = Ti.UI.createView({layout: "vertical"});
for(var i = 0; i < speakerData.length; i++){
	var speaker =  speakerData[i];

	var tableViewRow = Ti.UI.createView({uid : speaker.uid,height : Ti.UI.SIZE});
	tableViewRow.addEventListener('click',function(e){
		openSpeaker(e);
	});
    var rowView = Ti.UI.createView({touchEnabled : false, layout : "horizontal", width: Ti.UI.FILL, height: Ti.UI.SIZE});
	$.addClass(rowView,"rowView");
	var image= Ti.UI.createImageView({touchEnabled : false, image : speaker.avatar});
	$.addClass(image,"listImage");
	var title = Ti.UI.createLabel({touchEnabled : false, text : speaker.name + "\n" + speaker.surname});
	$.addClass(title,"listTitle");
	
	var tableViewSection = Ti.UI.createView({height : Ti.UI.SIZE, layout: "vertical"});
	rowView.add(image);
	rowView.add(title);
	tableViewRow.add(rowView);
	tableViewSection.add(tableViewRow);
	var rowSeparator = Ti.UI.createView();
	$.addClass(rowSeparator,"rowSeparator");
	tableViewSection.add(rowSeparator);
	tableView.add(tableViewSection);
}

$.speakerView.add(tableView);
