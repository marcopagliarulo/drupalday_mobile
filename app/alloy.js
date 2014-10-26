// The contents of this file will be executed before any of
// your view controllers are ever executed, including the index.
// You have access to all functionality on the `Alloy` namespace.
//
// This is a great place to do any initialization for your app
// or create any global variables/functions that you'd like to
// make available throughout your app. You can easily make things
// accessible globally by attaching them to the `Alloy.Globals`
// object. For example:
//
// Alloy.Globals.someGlobalFunction = function(){};

Alloy.Globals.prevController = new Array();
Alloy.Globals.Map = require('ti.map');
Alloy.Globals.osName = Ti.Platform.osname;
Alloy.Globals.filesDownload = {};
Alloy.Globals.updateCount = 0;
switch(Alloy.Globals.osName){
	case 'android':
		Alloy.Globals.museo_slab_500 = 'museo_slab_500';
		Alloy.Globals.museo_slab_700 = 'museo_slab_700';
		Alloy.Globals.museosans_300 = 'museosans_300';
		Alloy.Globals.museosans_300italic = 'museosans_300italic';
		Alloy.Globals.museosans_700 = 'museosans_700';
		break;
	default:
		Alloy.Globals.museo_slab_500 = 'Museo Slab 500';
		Alloy.Globals.museo_slab_700 = 'Museo Slab 700';
		Alloy.Globals.museosans_300 = 'Museo Sans 300';
		Alloy.Globals.museosans_300italic = 'Museo Sans 300 Italic';
		Alloy.Globals.museosans_700 = 'Museo Sans 700';
		break;
}
Alloy.Globals.deviceHeight = Ti.Platform.displayCaps.platformHeight;
Alloy.Globals.deviceWidth = Ti.Platform.displayCaps.platformWidth;
var blogImageWidth = 930;
var blogImageHeight = 290;
Alloy.Globals.blogImage = {
	width : Alloy.Globals.deviceWidth,
	height : (Alloy.Globals.deviceWidth*blogImageHeight)/blogImageWidth
};
openUrl = function(e){
	if( typeof e.source.url != 'undefined'){
		Titanium.Platform.openURL(e.source.url);
	}
};

openController = function(controller,args,back){
	Alloy.Globals.currentControllerName = controller;
	args = args || {};
	back = back || false;
	var container = Alloy.Globals.container;
	if(container.children.length){
		var previousView = container.children[0];
		container.remove(previousView);
		previousView = null;
	}
	if(typeof Alloy.Globals.previousController != 'undefined'){
		Alloy.Globals.previousController.destroy();
	}
	Alloy.Globals.previousController = Alloy.createController(controller,args);
	var controllerView = Alloy.Globals.previousController.getView();
	container.add(controllerView);
    if(!back){
		Alloy.Globals.prevController[Alloy.Globals.prevController.length] = {"controllerName" : controller, "args" : args};
    }
};

updateData = function(type){
	Alloy.Globals.updateCount++;
	var url = "http://drupalday.it/services/" + type + ".json";
	var client = Ti.Network.createHTTPClient({
		onload : function(e) {
			var data = JSON.parse(this.responseText);
			var ids = new Array();
			if(typeof data.nodes != 'undefined'){
				var collection = Alloy.createCollection(type);
				collection.fetch();
				for(var i = 0; i < data.nodes.length; i++){
					if(typeof data.nodes[i].node != 'undefined'){
						var object = {};
						var node = data.nodes[i].node;
						var mapping = mappingField(type);
						var file = false;
						var files = new Array();
						if(typeof mapping != 'undefined'){
							for(var key in node){
								if(typeof mapping[key] != 'undefined'){
									if(typeof mapping[key]['type'] != 'undefined' && mapping[key]['type'] == 'file' && typeof mapping[key]['callback'] != 'undefined' && node[key] != ""){
										file = true;
										files[files.length] = {
											'value' : node[key],
											'callback' : mapping[key]['callback'],
											'field' : mapping[key]['field'],
											'data' : object
										};
									}
									else if(node[key] != ""){
										object[mapping[key]['field']] = (typeof mapping[key]['callback'] != 'undefined') ? mapping[key]['callback'](node[key]) : node[key];
									}
								}
							}
						}
						var model = Alloy.createModel(type);
						var id = model.idAttribute;
						var currentCollection = collection.get(object[id]);
						if(typeof object['changed'] == 'undefined' || (typeof currentCollection != 'undefined' && object['changed'] > currentCollection.get('changed')) || typeof currentCollection == 'undefined'){
							Ti.API.info(JSON.stringify(object));
							ids[ids.length] = object[id];
							if(file){
								if(typeof Alloy.Globals.filesDownload[type] == 'undefined'){
									Alloy.Globals.filesDownload[type] = new Array();
								}
								Alloy.Globals.filesDownload[type][Alloy.Globals.filesDownload[type].length] = files;
							}
							else{
								var row = Alloy.createModel(type,object);
								row.save();
							}
						}
					}
				}
			}
			if(ids.length){
				collection.fetch({query : "select * from " + type + " where " + id + " NOT IN (" + ids.join(",") + ")"});
				var collectionData = collection.toJSON();
				while(collection.length){
					collection.at(0).destroy();
				}
			}
			collection = null;
			event = {};
			event.type = type;
			Ti.App.fireEvent('updateDataEnd',event);
		},
		onerror : function(e) {
			Ti.App.fireEvent('updateDataEnd',event);
			return Array();
		},
		timeout : 5000
	});
	client.open("GET", url);
	client.send();	
};
function getImageBlob(url, data, field, type, files){
	Alloy.Globals.updateCount++;
	var xhr = Titanium.Network.createHTTPClient({
		onload : function(e){
 			if (xhr.status == 200 ) {
	 			var data = this._properties['data'];
				var field = this._properties['field'];
				var files = this._properties['files'];
				var type = this._properties['type'];
				data[field] = this.responseData;
				if(files.length == 0){
					var row = Alloy.createModel(type,data);
					row.save();
				}
				else{
					var currentFile = files.shift();
					currentFile.callback(currentFile.value, data, currentFile.field, type, files);
				}
			}
			event = {};
			event.type = type;
			Ti.App.fireEvent('updateDataEnd',event);
		},
		onerror : function(e) {
 			var data = this._properties['data'];
			var field = this._properties['field'];
			var files = this._properties['files'];
			var type = this._properties['type'];
			data[field] = null;
			if(files.length == 0){
				var row = Alloy.createModel(type,data);
				row.save();
			}
			else{
				var currentFile = files.shift();
				currentFile.callback(currentFile.value, data, currentFile.field, type, files);
			}
			event = {};
			event.type = type;
			Ti.App.fireEvent('updateDataEnd',event);
		},
	});
	
	xhr.applyProperties({
		'data' : data,
		'field' : field,
		'type' : type,
		'files' : files
	});
	xhr.open('GET',url);  
	xhr.send();
}
function getSponsorType(sponsorType){
	var sponsorTypes = {
		'sponsor_diamond' : 1,
		'sponsor_gold' : 2,
		'sponsor_silver' : 3,
		'media_partner' : 4
	};
	if(typeof sponsorTypes[sponsorType] != 'undefined'){
		return sponsorTypes[sponsorType];
	}
	return 1;
}
function getChangedTimestamp(value){
	var splitDate = value.split(" - ");
	var date = splitDate[0].split("/");
	var time = splitDate[1].split(":");
	var date = new Date(date[2], date[1], date[0], time[0], time[1]);
	return date.getTime()/1000;
}
function getEndStartTimestamp(value){
	var date = new Date('2014-11-14 ' + value + ':00');
	return date.getTime()/1000;
}
function getLevelType(value){
	var levelTypes = {
		'Base' : 1,
		'Semplice' : 2,
		'Avanzato' : 3,
	};
	if(typeof levelTypes[value] != 'undefined'){
		return levelTypes[value];
	}
	return 1;
}

function mappingField(type){
	var mapping = {
	    'sponsor' : {
			'Nid' : {
				'field' : 'nid',
			},
			'title' : {
				'field' : 'title',
			},
			'field_sponsor_logo' : {
				'field' : 'image',
				'callback' : getImageBlob,
				'type' : 'file'
			},
			'field_sponsor_link' : {
				'field' : 'website'
			},
			'Queue machine name' : {
				'field' : 'type',
				'callback' : getSponsorType
			},
			'Updated date' : {
				'field' : 'changed',
				'callback' : getChangedTimestamp
			}
		},
		'blog' : {
			'Nid' : {
				'field' : 'nid',
			},
			'title' : {
				'field' : 'title',
			},
			'field_article_img' : {
				'field' : 'image',
				'callback' : getImageBlob,
				'type' : 'file'
			},
			'Corpo' : {
				'field' : 'body'
			},
			'Updated date' : {
				'field' : 'changed',
				'callback' : getChangedTimestamp
			},
			'Post date' : {
				'field' : 'date',
				'callback' : getChangedTimestamp
			},
			'Percorso' : {
				'field' : 'url',
			}
		},
		'talk' : {
			'Nid' : {
				'field' : 'nid'
			},
			'Titolo' : {
				'field' : 'title',
			},
			'Abstract' : {
				'field' : 'body',
			},
			'Livello' : {
				'field' : 'level',
				'callback' : getLevelType
			},
			'Categoria' : {
				'field' : 'category'
			},
			'Updated date' : {
				'field' : 'changed',
				'callback' : getChangedTimestamp
			},
			'nid_speaker' : {
				'field' : 'uid'
			},
			'start' : {
				'field' : 'start',
				'callback' : getEndStartTimestamp
			},
			'end' : {
				'field' : 'end',
				'callback' : getEndStartTimestamp
			},
			'Sala' : {
				'field' : 'track'
			},
			'Percorso' : {
				'field' : 'url',
			}
		},
		'speaker' : {
			'Nid' : {
				'field' : 'uid'
			},
			'Nome':{
				'field' : 'name'
			},
			'Cognome':{
				'field' : 'surname'
			},
			'Bio' : {
				'field' : 'bio'
			},

			'Avatar' : {
				'field' : 'avatar',
				'callback' : getImageBlob,
				'type' : 'file'
			},
			'Updated date' : {
				'field' : 'changed',
				'callback' : getChangedTimestamp
			},
			'Percorso' : {
				'field' : 'url',
			},
			'twitter' : {
				'field' : 'twitter',
			}
		},
		'info' : {
			'Nid' : {
				'field' : 'nid',
			},
			'title' : {
				'field' : 'title',
			},
			'Logo' : {
				'field' : 'image',
				'callback' : getImageBlob,
				'type' : 'file'
			},
			'Corpo' : {
				'field' : 'body'
			},
			'Updated date' : {
				'field' : 'changed',
				'callback' : getChangedTimestamp
			},
			'Percorso' : {
				'field' : 'url',
			}
		},
	};																																																																																																																																						
	if(typeof mapping[type] != 'undefined'){
		return mapping[type];
	}
	return new Array();
}





///////////////fake
updateLocalData = function(type){
	Alloy.Globals.updateCount++;
	var fileName = type + "_json.txt";
	jsondata = Ti.Filesystem.getFile(fileName).read().toString();
	var data = JSON.parse(jsondata);
	var ids = new Array();
	if(typeof data.nodes != 'undefined'){
		var collection = Alloy.createCollection(type);
		collection.fetch();
		for(var i = 0; i < data.nodes.length; i++){
			if(typeof data.nodes[i].node != 'undefined'){
				var object = {};
				var node = data.nodes[i].node;
				var mapping = mappingField(type);
				var file = false;
				var files = new Array();
				var model = Alloy.createModel(type);
				var id = model.idAttribute;
				if(typeof mapping != 'undefined'){
					for(var key in node){
						if(typeof mapping[key] != 'undefined'){
							if(typeof mapping[key]['type'] != 'undefined' && mapping[key]['type'] == 'file' && typeof mapping[key]['callback'] != 'undefined' && node[key] != ""){
								file = true;
								files[files.length] = {
									'value' : node[key],
									'callback' : mapping[key]['callback'],
									'field' : mapping[key]['field'],
									'data' : object
								};
								object[mapping[key]['field']] = null;
							}
							else if(node[key] != ""){
								object[mapping[key]['field']] = (typeof mapping[key]['callback'] != 'undefined') ? mapping[key]['callback'](node[key]) : node[key];
							}
						}
					}
				}
				var currentCollection = collection.get(object[id]);
				if(typeof object['changed'] == 'undefined' || (typeof currentCollection != 'undefined' && object['changed'] > currentCollection.get('changed')) || typeof currentCollection == 'undefined'){
					ids[ids.length] = object[id];
					if(file){
						if(typeof Alloy.Globals.filesDownload[type] == 'undefined'){
							Alloy.Globals.filesDownload[type] = new Array();
						}
						Alloy.Globals.filesDownload[type][Alloy.Globals.filesDownload[type].length] = files;
					}
					else{
						var row = Alloy.createModel(type,object);
						row.save();
					}
				}
			}
		}
	}
	if(ids.length){
		collection.fetch({query : "select * from " + type + " where " + id + " NOT IN (" + ids.join(",") + ")"});
		var collectionData = collection.toJSON();
		while(collection.length){
			collection.at(0).destroy();
		}
	}
	event = {};
	event.type = type;
	Ti.App.fireEvent('updateDataEnd',event);
};
if(Titanium.Network.networkType != Titanium.Network.NETWORK_NONE){
	updateData('sponsor');
	updateData('blog');
	updateData('speaker');
	updateData('talk');
	updateData('info');
}


function fbShare(data){
	var fb = require('facebook');
	fb.appid = Alloy.CFG.fbappid;
	fb.permissions = ['publish_stream']; // Permissions your app needs
	fb.forceDialogAuth = true;
	fb.addEventListener('login', function(e) {
	    if (e.success) {
			fb.dialog("feed", data,function(e) {
			    if(e.success && e.result) {
			        alert("Il tuo post è stato pubblicato");
			    } else {
			        if(e.error) {
			            alert(e.error);
			        } else {
			        }
			    }
			});
	    } else if (e.error) {
            alert('Si è verificato un errore, riprova più tardi');
	    }
	});
	if (!fb.loggedIn) {
	    fb.authorize();
	}
	else{
		fb.dialog("feed", data,function(e) {
		    if(e.success && e.result) {
		        alert("Il tuo post è stato pubblicato");
		    } else {
		        if(e.error) {
		            alert(e.error);
		        } else {
		        }
		    }
		});
	}
}

function twitterShare(data){
	Ti.include('/lib/birdhouse.js');
	var BH = new BirdHouse({
	    consumer_key: Alloy.CFG.twitterck,
	    consumer_secret: Alloy.CFG.twittercs,
	    callback_url: "http://www.drupalday.it",
	    show_login_toolbar: false,
	});
	BH.authorize(function(e) {
		if (e === true) {
			BH.tweet(data);
		}
	});
}
