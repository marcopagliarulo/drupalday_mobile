openBlogPost = function(e){
	if(typeof e.source.nid != 'undefined'){
		var nid = e.source.nid;
		openController('blogPost',nid);
	}
};
var blog = Alloy.createCollection('blog');
blog.fetch({query : "select * from blog order by date DESC"});
var blogPost = blog.toJSON();
for(var i = 0; i < blogPost.length; i++){
	var view = Ti.UI.createView({nid : blogPost[i].nid, layout : 'absolute', height : Ti.UI.SIZE, top: 0});
	view.addEventListener('click',function(e){
		openBlogPost(e);
	});
	var image = Ti.UI.createImageView({image : blogPost[i].image, touchEnabled : false, width : Ti.UI.FILL});
	var viewLabel = Ti.UI.createView({layout : 'vertical', height : Ti.UI.SIZE, width : Ti.UI.FILL, top : "15%", touchEnabled : false});
	var label = Ti.UI.createLabel({touchEnabled : false, text : blogPost[i].title});
	var style = $.createStyle({
	    classes: "listTitle",
	});
	label.applyProperties(style);
	viewLabel.add(label);
	view.add(image);
	view.add(viewLabel);
	$.scrollViewblog.add(view);
}