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
	var view = Ti.UI.createView({nid : blogPost[i].nid, layout : 'absolute', height : Ti.UI.SIZE});
	view.addEventListener('click',function(e){
		openBlogPost(e);
	});
	var blogPostImage = (blogPost[i].image != null) ? blogPost[i].image : '/images/blog.png';
	var image = Ti.UI.createImageView({image : blogPostImage, touchEnabled : false, width : "100%", top: 0});
	var label = Ti.UI.createLabel({touchEnabled : false, text : blogPost[i].title, top: "15dp"});
	$.addClass(label,"listTitle");
	view.add(image);
	view.add(label);
	$.scrollViewblog.add(view);
}