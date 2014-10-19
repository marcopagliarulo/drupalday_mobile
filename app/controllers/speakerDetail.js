var args = arguments[0] || {};
var speaker = Alloy.Collections.instance('speaker');
speaker.fetch();
speakerData = speaker.get(args);

var title = Ti.UI.createLabel({touchEnabled : false, text : speakerData.get('name') + " " + speakerData.get('surname')});
$.addClass(title,"listTitle");
var image= Ti.UI.createImageView({touchEnabled : false, image : speakerData.get('avatar')});
$.addClass(image,"listImage");

var headerView = Ti.UI.createView({layout: "absolute"});
$.addClass(headerView,"headerView");
headerView.add(image);
headerView.add(title);
$.speakerDetail.add(headerView);

var body = Ti.UI.createLabel({touchEnabled : false, text : speakerData.get('bio')});
$.addClass(body,"body");
var scrollView = Ti.UI.createScrollView({layout: 'vertical', scrollType : 'vertical', top: "5%"});
scrollView.add(body);
$.speakerDetail.add(scrollView);
