var args = arguments[0] || {};
var speaker = Alloy.createCollection('speaker');
speaker.fetch();
speakerData = speaker.get(args);

var title = Ti.UI.createLabel({touchEnabled : false, text : speakerData.get('name') + " " + speakerData.get('surname')});
var style = $.createStyle({
    classes: "listTitle",
});
title.applyProperties(style);
var image= Ti.UI.createImageView({touchEnabled : false, image : speakerData.get('avatar')});
var style = $.createStyle({
    classes: "listImage",
});
image.applyProperties(style);

var headerView = Ti.UI.createView({layout: "absolute"});
var style = $.createStyle({
    classes: "headerView",
});
headerView.applyProperties(style);
headerView.add(image);
headerView.add(title);
$.speakerDetail.add(headerView);

var body = Ti.UI.createLabel({touchEnabled : false, text : speakerData.get('bio')});
var style = $.createStyle({
    classes: "body",
});
body.applyProperties(style);
var scrollView = Ti.UI.createScrollView({layout: 'vertical', scrollType : 'vertical', top: "5%"});
scrollView.add(body);
$.speakerDetail.add(scrollView);
