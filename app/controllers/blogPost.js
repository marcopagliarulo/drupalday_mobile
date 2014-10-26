transformFunction = function(model) {
	var mounths = Array('Gen', 'Feb', 'Mar', 'Apr', 'Mag', 'Giu', 'Lug', 'Ago', 'Set', 'Ott', 'Nov', 'Dic');
	var transform = model.toJSON();
	var date = new Date(transform.date * 1000);
	transform.date = "\t" + date.getDate() + ' ' + mounths[date.getMonth()] + ' ' + date.getFullYear() + "\t";
	transform.body = Alloy.CFG.pageCss + transform.body;
	return transform;
};
var args = arguments[0] || {};
var blog = Alloy.Collections.instance('blog');
blog.fetch();
blogPost = blog.get(args);
blogPost = transformFunction(blogPost);
var blogPostImage = (blogPost.image != null) ? blogPost.image : '/images/blog.png';

var image = Ti.UI.createImageView({
	image : blogPostImage,
	width : Ti.UI.FILL,
	top : 0
});
var viewLabel = Ti.UI.createView({
	layout : 'horizontal',
	width : Ti.UI.FILL,
	height : Ti.UI.SIZE,
});
$.addClass(viewLabel,"viewLabel");

var labelTitle = Ti.UI.createLabel({
	text : blogPost.title
});
$.addClass(labelTitle,"listTitle");
var labelDate = Ti.UI.createLabel({
	text : blogPost.date
});
$.addClass(labelDate,"listDate");
$.headerBlog.add(image);
$.headerBlog.add(labelDate);
viewLabel.add(labelTitle);
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
var social = Ti.UI.createView({
	height : Ti.UI.SIZE,
	layout : 'vertical'
});
$.addClass(social,"social");
var fb = Ti.UI.createImageView({
	image : '/images/facebook.png',
	top : "5dp",
	bubbleParent : false
});
fb.addEventListener("click",function(e){
	var data = {
		link : blogPost.url,
		name : blogPost.title
	};
	fbShare(data);
});
social.add(fb);
var twitter = Ti.UI.createImageView({
	image : '/images/twitter.png',
	top : "5dp",
	bubbleParent : false
});
twitter.addEventListener("click",function(e){
	var data = blogPost.url + Alloy.CFG.hastag;
	twitterShare(data);
});
social.add(twitter);
viewLabel.add(social);
$.blogPost.add(viewLabel);
$.blogPost.add(webView);
