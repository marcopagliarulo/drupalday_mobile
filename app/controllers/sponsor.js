transformFunction = function(transform){
  transform.typeLabel = Alloy.CFG.sponsorType[transform.type];
  return transform;
};
var TableViewSections = new Array();
var sponsor = Alloy.Collections.instance('sponsor');
sponsor.fetch({query : "select type from sponsor group by type order by type ASC"});
var sponsorTypes = sponsor.toJSON();
for(var i = 0; i < sponsorTypes.length; i++){
	var sponsorType = transformFunction(sponsorTypes[i]);
	var headerViewElement = Ti.UI.createView();
	$.addClass(headerViewElement,"headerViewElement");
	var headerLabel = Ti.UI.createLabel({touchEnabled : false, text : sponsorType.typeLabel});
	$.addClass(headerLabel,"sponsorType");
	headerViewElement.add(headerLabel);
	TableViewSections[sponsorType.type] = Ti.UI.createView({layout : "vertical", height: Ti.UI.SIZE});
	TableViewSections[sponsorType.type].add(headerViewElement);
}

sponsor.fetch({query : "select * from sponsor order by type ASC"});
var sponsorData = sponsor.toJSON();
for(var i = 0; i < sponsorData.length; i++){
	var sponsorItem = sponsorData[i];
	var TableViewRow = Ti.UI.createView({layout : "vertical", nid: sponsorItem.nid, url: sponsorItem.website, height: Ti.UI.SIZE});
	TableViewRow.addEventListener('click', function(e){
		openUrl(e);
	});
	var ImageView = Ti.UI.createImageView({image: sponsorItem.image, touchEnabled: false, width: Ti.UI.FILL, top: "5dp"});
	$.addClass(ImageView,Alloy.CFG.sponsorType[sponsorItem.type].toLowerCase().replace(" ",""));
	
	TableViewRow.add(ImageView);
	TableViewSections[sponsorItem.type].add(TableViewRow);
}
for(var i = 0; i < sponsorTypes.length; i++){
	var sponsorType = transformFunction(sponsorTypes[i]);
	$.sponsor.add(TableViewSections[sponsorType.type]);
}
