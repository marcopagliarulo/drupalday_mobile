openSpeaker = function(e){
	if(typeof e.source.uid != 'undefined'){
		var uid = e.source.uid;
		openController('speakerDetail',uid);
	}
};


var speaker = Alloy.Collections.instance('speaker');
speaker.fetch({query : "select * from speaker order by name ASC"});
var speakerData = speaker.toJSON();

var tableView = Ti.UI.createScrollView({layout: "vertical", scrollType: "vertical"});
for(var i = 0; i < speakerData.length; i++){
	var speaker =  speakerData[i];

	var tableViewRow = Ti.UI.createView({uid : speaker.uid,height : Ti.UI.SIZE});
	tableViewRow.addEventListener('click',function(e){
		openSpeaker(e);
	});
    var rowView = Ti.UI.createView({touchEnabled: false, bubbeParent: true, layout : "horizontal", width: Ti.UI.FILL, height: Ti.UI.SIZE});
	$.addClass(rowView,"rowView");
	var speakerImage = (speaker.avatar != null) ? speaker.avatar : '/images/speaker.png';
	var image= Ti.UI.createImageView({touchEnabled: false, bubbeParent: true, image : speakerImage});
	$.addClass(image,"listImage");
	var title = Ti.UI.createLabel({touchEnabled: false, bubbeParent: true, text : speaker.name + "\n" + speaker.surname});
	$.addClass(title,"listTitle");
	if(Alloy.Globals.isAndroidTablet){
		$.addClass(title,"listTitleTablet");
	}
	
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
