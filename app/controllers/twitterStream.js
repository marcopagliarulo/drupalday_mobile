var args = arguments[0] || {};
Ti.include('/lib/birdhouse.js');
var BH = new BirdHouse({
    consumer_key: Alloy.CFG.twitterck,
    consumer_secret: Alloy.CFG.twittercs,
    callback_url: "http://www.drupalday.it/twitter_response.html",
    show_login_toolbar: false,
});
get_tweets = function(params){
	BH.authorize(function(e) {
		if (e === true) {
			BH.get_tweets(params,function(tweets){
				if(tweets && typeof tweets.statuses != 'undefined'){
					var tableView = Ti.UI.createScrollView({layout: "vertical", scrollType: "vertical"});
					for(var i = 0; i < tweets.statuses.length; i++){
					    var rowView = Ti.UI.createView({touchEnabled: false, bubbeParent: true, layout : "horizontal", width: Ti.UI.FILL, height: Ti.UI.SIZE});
						$.addClass(rowView,"rowView");
						var imagePath = tweets.statuses[i].user.profile_image_url.replace('_normal.jpg','_400x400.jpg').replace('_normal.jpeg','_400x400.jpeg').replace('_normal.png','_400x400.png');
						var image= Ti.UI.createImageView({touchEnabled: false, bubbeParent: true, image : imagePath});
						$.addClass(image,"listImage");
						var title = Ti.UI.createLabel({touchEnabled: false, bubbeParent: true, text : tweets.statuses[i].text});
						$.addClass(title,"listTitle");
						if(Alloy.Globals.isAndroidTablet){
							$.addClass(title,"listTitleTablet");
						}
						rowView.add(image);
						rowView.add(title);
						var rowSeparator = Ti.UI.createView();
						$.addClass(rowSeparator,"rowSeparator");
						$.twitterStreamViewWrapper.add(rowView);
						$.twitterStreamViewWrapper.add(rowSeparator);
					}
					Alloy.Globals.twitter_next_results = tweets.search_metadata.next_results;
					Alloy.Globals.twitter_refresh_url = tweets.search_metadata.refresh_url;
					inUpdate = false;
				}
			});
		}
	});
};

get_tweets('q=#drupalday');
var inUpdate = false;
$.twitterStreamView.addEventListener('scroll', function (e) {
    var tolerance = 50;
    if(!inUpdate && typeof Alloy.Globals.twitter_next_results != 'undefined' && ($.twitterStreamViewWrapper.getRect().height - e.y) <= ($.twitterStreamView.getRect().height + tolerance)){
		var params = Alloy.Globals.twitter_next_results.slice(1);
		inUpdate = true;
		get_tweets(params);
    }
});