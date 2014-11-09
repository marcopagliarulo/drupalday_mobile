transformFunction = function(model) {
	var transform = model.toJSON();
	transform.body = Alloy.CFG.pageCss + transform.body;
	return transform;
};
var args = arguments[0] || {};
var info = Alloy.Collections.instance('info');
info.fetch();
infoPost = info.get(args);
infoPost = transformFunction(infoPost);
var infoPostImage = (infoPost.image != null) ? infoPost.image : false;
if(infoPostImage){
	var image = Ti.UI.createImageView({
		image : infoPostImage,
		width : Ti.UI.FILL,
		top : 0
	});
	$.infoPost.add(image);
}
else{
	var labelTitle = Ti.UI.createLabel({
		text : infoPost.title
	});
	$.addClass(labelTitle,"listTitle");
	if(Alloy.Globals.isAndroidTablet){
		$.addClass(labelTitle,"listTitleTablet");
	}
	$.infoPost.add(labelTitle);
}

var webView = Ti.UI.createWebView({
	html : infoPost.body,
	enableZoomControls : false,
	width : Ti.UI.SIZE
});
webView.addEventListener('beforeload', function(e) {
	if (e.url.match(/^file:\/\//)) {
	} else {
		Ti.Platform.openURL(e.url);
		webView.stopLoading();
	}
});
webView.addEventListener('load', function(e) {
	if (e.url.match(/^file:\/\//)) {
	} else {
		if (webView.canGoBack()) {
			webView.goBack();
		}
	}
});
$.infoPost.add(webView);
