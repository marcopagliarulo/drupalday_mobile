openBlogPost = function(e){
	if(typeof e.source.nid != 'undefined'){
		var nid = e.source.nid;
		openController('blogPost',nid);
	}
};
var blog = Alloy.Collections.instance('blog');
blog.fetch({query : "select * from blog order by date DESC"});
var blogPost = blog.toJSON();
for(var i = 0; i < blogPost.length; i++){
	var view = Ti.UI.createView({nid : blogPost[i].nid, layout : 'vertical', height : Ti.UI.SIZE});
	view.addEventListener('click',function(e){
		openBlogPost(e);
	});
	$.addClass(view,"blogView");
	var blogPostImage = (blogPost[i].image != null) ? blogPost[i].image : '/images/blog.png';
	var image = Ti.UI.createImageView({touchEnabled: false, bubbeParent: true, image : blogPostImage, width : "100%"});
	var label = Ti.UI.createLabel({touchEnabled: false, bubbeParent: true, text : blogPost[i].title});
	$.addClass(label,"listTitle");
	if(Alloy.Globals.isAndroidTablet){
		$.addClass(label,"listTitleTablet");
	}
	var rowSeparator = Ti.UI.createView();
	$.addClass(rowSeparator,"rowSeparatorBlog");
	view.add(label);
	view.add(image);
	view.add(rowSeparator);
	$.scrollViewblog.add(view);
}