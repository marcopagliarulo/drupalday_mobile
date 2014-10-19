transformFunction = function(model) {
	var mounths = Array('Gen', 'Feb', 'Mar', 'Apr', 'Mag', 'Giu', 'Lug', 'Ago', 'Set', 'Ott', 'Nov', 'Dic');
	var transform = model.toJSON();
	var date = new Date(transform.date * 1000);
	transform.date = "\t" + date.getDate() + ' ' + mounths[date.getMonth()] + ' ' + date.getFullYear() + "\t";
	transform.title = "\t" + transform.title + "\t";
	transform.body = Alloy.CFG.pageCss + transform.body;
	return transform;
};
var args = arguments[0] || {};
var blog = Alloy.Collections.instance('blog');
blog.fetch();
blogPost = blog.get(args);
blogPost = transformFunction(blogPost);

var image = Ti.UI.createImageView({
	image : blogPost.image,
	width : Ti.UI.FILL,
	top : 0
});
var viewLabel = Ti.UI.createView({
	layout : 'vertical',
	width : Ti.UI.FILL,
	top : "5%",
	height : Ti.UI.SIZE,
	left : 0
});
var labelTitle = Ti.UI.createLabel({
	text : blogPost.title
});
$.addClass(labelTitle,"listTitle");
var labelDate = Ti.UI.createLabel({
	text : blogPost.date
});
$.addClass(labelDate,"listDate");
viewLabel.add(labelTitle);
viewLabel.add(labelDate);
$.headerBlog.add(image);
$.headerBlog.add(viewLabel);
var webView = Ti.UI.createWebView({
	html : blogPost.body,
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
$.blogPost.add(webView);
