openTalk = function(e){
	if(typeof e.source.nid != 'undefined'){
		var nid = e.source.nid;
		openController('talkDetail',nid);
	}
};
transformFunction = function(transform){
	var speaker = Alloy.Collections.instance('speaker');
	speaker.fetch();
	var uids = transform.uid.split("|");
	transform.speaker = new Array();
	for(var i = 0; i < uids.length; i++){
		speakerData = speaker.get(uids[i]);
		if(typeof speakerData != 'undefined'){
			transform.speaker[transform.speaker.length] = {
				name : speakerData.get("name"),
				surname : speakerData.get("surname"),
				twitter : speakerData.get("twitter")
			};
		}
	}
	return transform;
};
function createRow(talkHoursList){
	var tableView = Ti.UI.createScrollView({layout: "vertical", scrollType : "vertical"});
	var hoursIndexes = new Array();
	for(var i = 0; i < talkHoursList.length; i++){
		if(parseInt(talkHoursList[i].end) < now){
			continue;
		}
		var start = new Date(parseInt(talkHoursList[i].start) * 1000);
		start = start.getHours() + ":" + ("0" + start.getMinutes()).slice(-2);
		var end = new Date(parseInt(talkHoursList[i].end) * 1000);
		end = end.getHours() + ":" + ("0" + end.getMinutes()).slice(-2);
		talkHoursList[i].time = start + " - " + end;
		var headerViewElement = Ti.UI.createView({layout: "vertical",height: Ti.UI.SIZE});
		$.addClass(headerViewElement,"headerSession");
		var timeContainer = Ti.UI.createView({touchEnabled: false, bubbeParent: true, layout: "absolute",height: Ti.UI.SIZE, width: Ti.UI.FILL});
		var time = Ti.UI.createLabel({touchEnabled: false, bubbeParent: true, text : talkHoursList[i] .time});
		$.addClass(time,"scheduleDate");
		var headerSeparatorTop = Ti.UI.createView();
		$.addClass(headerSeparatorTop,"headerSeparatorTop");
		var headerSeparatorBottom = Ti.UI.createView();
		$.addClass(headerSeparatorBottom,"headerSeparatorBottom");
		headerViewElement.add(headerSeparatorTop);
		timeContainer.add(time);
		if(parseInt(talkHoursList[i].start) < now){
			var liveNow = Ti.UI.createView({width : "20dp", height: "20dp", borderRadius : "10dp", backgroundColor : "#00ff00", right: "5%", top: "3dp"});
			timeContainer.add(liveNow);
		}
		headerViewElement.add(timeContainer);
		headerViewElement.add(headerSeparatorBottom);
		hoursIndexes[talkHoursList[i].start + "-" + talkHoursList[i].end] = i;
		var tableViewSection = Ti.UI.createView({layout: "vertical", height : Ti.UI.SIZE, start : talkHoursList[i].start, end : talkHoursList[i].end});
		tableViewSection.add(headerViewElement);
		var talk = Alloy.Collections.instance('talk');
		talk.fetch({query : "select * from talk where start = " + talkHoursList[i].start + " and end = " + talkHoursList[i].end + " order by track ASC"});
		var talkData = talk.toJSON();
		for(var j = 0; j < talkData.length; j++){
			if(parseInt(talkData[j].end) < now){
				continue;
			}
			var talk =  transformFunction(talkData[j]);
			var tableViewRow = Ti.UI.createView({nid : talk.nid, height: Ti.UI.SIZE});
			tableViewRow.addEventListener('click',function(e){
				openTalk(e);
			});
			var rowView = Ti.UI.createView({touchEnabled: false, bubbeParent: true, layout : "horizontal", width: Ti.UI.FILL, height: Ti.UI.SIZE});
			$.addClass(rowView,"rowView");
			var title = Ti.UI.createLabel({touchEnabled: false, bubbeParent: true, text : talk.title});
			$.addClass(title,"listTitle");
			var speaker = Ti.UI.createLabel({touchEnabled: false, bubbeParent: true, text : talk.name + " " + talk.surname});
			$.addClass(speaker,"listSpeaker");
		
			var track = Ti.UI.createLabel({touchEnabled: false, bubbeParent: true, text : talk.track});
			$.addClass(track,"listTrack");
			var rowViewLeft = Ti.UI.createView({touchEnabled: false, bubbeParent: true, layout : "vertical", width: "80%", height: Ti.UI.SIZE});
			var rowViewRight = Ti.UI.createView({touchEnabled: false, bubbeParent: true, layout : "vertical", width: "20%", height: Ti.UI.SIZE});
		
			rowViewLeft.add(title);
			var speakerTwitter = "";
			for(var k = 0; k < talk.speaker.length; k++){
				var speaker = Ti.UI.createLabel({touchEnabled: false, bubbeParent: true, ext : talk.speaker[k].name + " " + talk.speaker[k].surname});
				if(talk.speaker[k].twitter != null && talk.speaker[k].twitter != ""){
					speakerTwitter = "@" + talk.speaker[k].twitter + " ";
				}
				$.addClass(speaker,"listSpeaker");
				rowViewLeft.add(speaker);
			}
			var twitter = Ti.UI.createImageView({
				image : '/images/twitter.png',
				top : "5dp",
				bubbleParent : false,
				speaker : speakerTwitter
			});
			twitter.addEventListener("click",function(e){
				var data = e.source.speaker + Alloy.CFG.hastag;
				twitterShare(data);
			});
			rowViewRight.add(twitter);
			rowViewRight.add(track);
			rowView.add(rowViewLeft);
			rowView.add(rowViewRight);
			tableViewRow.add(rowView);
			tableViewSection.add(tableViewRow);
			if(j != (talkData.length-1)){
				var rowSeparator = Ti.UI.createView();
				$.addClass(rowSeparator,"rowSeparator");
				tableViewSection.add(rowSeparator);
			}
		}
		tableView.add(tableViewSection);
	}
	return tableView;
}
var updateView = function(){
	var tableView = $.schedule_live.children[0];
	var now = new Date().getTime()/1000;
	if(tableView.children.length > 0){
		for(var i = 0; i < tableView.children.length; i++){
			if(tableView.children[i].end < now){
				tableView.remove(tableView.children[i]);
				i--;
			}
			else if(tableView.children[i].start < now){
				var liveNow = Ti.UI.createView({width : "20dp", height: "20dp", borderRadius : "10dp", backgroundColor : "#00ff00", right: "5%", top: "3dp"});
				tableView.children[i].children[0].children[1].add(liveNow);
			}
		}
	}
	else{
		$.schedule_live.visible = false;
		var day1 = new Date("2014-11-14 23:59:59").getTime()/1000;
		var day2 = new Date("2014-11-15 23:59:59").getTime()/1000;
		if(now < day1){
			$.conference.visible = true;
		}
		else if(now < day2){
			$.conference.visible = false;
			$.formazione.visible = true;
		}
		else if(now > day2){
			$.conference.visible = false;
			$.formazione.visible = false;
			$.grazie.visible = true;
		}
	}
};
var now = new Date().getTime()/1000;
var talk = Alloy.Collections.instance('talk');
talk.fetch({query : "select start, end from talk group by start,end order by start, end ASC"});
var talkHoursList = talk.toJSON();
$.schedule_live.add(createRow(talkHoursList));
updateView();
setInterval(function(){
	updateView();
}, 60000);
