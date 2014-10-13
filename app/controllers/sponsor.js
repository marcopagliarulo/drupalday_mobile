openUrl = function(e){
	if( typeof e.source.url != 'undefined'){
		Titanium.Platform.openURL(e.source.url);
	}
};

transformFunction = function(transform){
  transform.typeLabel = Alloy.CFG.sponsorType[transform.type];
  return transform;
};
var TableViewSections = new Array();
var sponsor = Alloy.createCollection('sponsor');
sponsor.fetch({query : "select type from sponsor group by type order by type ASC"});
var sponsorTypes = sponsor.toJSON();
for(var i = 0; i < sponsorTypes.length; i++){
	var sponsorType = transformFunction(sponsorTypes[i]);
	var headerViewElement = Ti.UI.createView();
	var style = $.createStyle({
	    classes: "headerViewElement",
	});
	headerViewElement.applyProperties(style);
	var headerLabel = Ti.UI.createLabel({touchEnabled : false, text : sponsorType.typeLabel});
	var style = $.createStyle({
	    classes: "sponsorType",
	});
	headerLabel.applyProperties(style);
	headerViewElement.add(headerLabel);
	TableViewSections[sponsorType.type] = Ti.UI.createView({layout : "vertical", height: Ti.UI.SIZE});
	TableViewSections[sponsorType.type].add(headerViewElement);
}

var sponsor = Alloy.createCollection('sponsor');
sponsor.fetch({query : "select * from sponsor order by type ASC"});
var sponsorData = sponsor.toJSON();
for(var i = 0; i < sponsorData.length; i++){
	var sponsorItem = sponsorData[i];
	var TableViewRow = Ti.UI.createView({layout : "vertical", nid: sponsorItem.nid, url: sponsorItem.website, height: Ti.UI.SIZE});
	TableViewRow.addEventListener('click', function(e){
		openUrl(e);
	});
	var ImageView = Ti.UI.createImageView({image: sponsorItem.image, touchEnabled: false, width: Ti.UI.FILL, top: "5dp"});
	var style = $.createStyle({
	    classes: Alloy.CFG.sponsorType[sponsorItem.type].toLowerCase().replace(" ",""),
	});
	ImageView.applyProperties(style);
	
	TableViewRow.add(ImageView);
	TableViewSections[sponsorItem.type].add(TableViewRow);
}
for(var i = 0; i < sponsorTypes.length; i++){
	var sponsorType = transformFunction(sponsorTypes[i]);
	$.sponsor.add(TableViewSections[sponsorType.type]);
}
