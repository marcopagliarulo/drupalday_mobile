var args = arguments[0] || {};
var speaker = Alloy.Collections.instance('speaker');
speaker.fetch();
speakerData = speaker.get(args);

var title = Ti.UI.createLabel({touchEnabled : false, bubbleParent: true, text : speakerData.get('name') + " " + speakerData.get('surname')});
$.addClass(title,"listTitle");
if(Alloy.Globals.isAndroidTablet){
	$.addClass(title,"listTitleTablet");
}
var speakerImage = (speakerData.get('avatar') != null) ? speakerData.get('avatar') : '/images/speaker.png';
var image= Ti.UI.createImageView({touchEnabled : false, bubbleParent: true, image : speakerImage});
$.addClass(image,"listImage");

var headerView = Ti.UI.createView({layout: "absolute"});
$.addClass(headerView,"headerView");
headerView.add(image);
headerView.add(title);
$.speakerDetail.add(headerView);

var body = Ti.UI.createLabel({bubbleParent: true, text : speakerData.get('bio')});
$.addClass(body,"body");
if(Alloy.Globals.isAndroidTablet){
	$.addClass(body,"bodyTablet");
}
var scrollView = Ti.UI.createScrollView({layout: 'vertical', scrollType : 'vertical', top: "5%"});
scrollView.add(body);
$.speakerDetail.add(scrollView);
