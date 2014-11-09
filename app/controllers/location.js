var MapModule = require('ti.map');
var GPSerror = false;
var rc = MapModule.isGooglePlayServicesAvailable();
switch (rc) {
    case MapModule.SUCCESS:
        break;
    case MapModule.SERVICE_MISSING:
        GPSerror = 'Google Play services è mancante.';
        break;
    case MapModule.SERVICE_VERSION_UPDATE_REQUIRED:
        GPSerror = 'Google Play services non è aggiornato.';
        break;
    case MapModule.SERVICE_DISABLED:
        GPSerror = 'Google Play services è disbilitato.';
        break;
    case MapModule.SERVICE_INVALID:
        GPSerror = 'Google Play services non riesce ad eseguire l\'autenticazione.';
        break;
    default:
        GPSerror = 'Si è verificato un errore, riprova più tardi';
        break;
}

if(GPSerror === false){
	var drupalday = MapModule.createAnnotation({
	    latitude: 45.523703,
	    longitude: 9.219591,
	    title: "DISCo - Dipartimento di Informatica Sistemistica e Comunicazione",
	    subtitle: "Viale Sarca, 336 - Edificio U14",
	    image : '/images/pindrupal.png',
	});
	var mapview = MapModule.createView({
	    mapType: MapModule.NORMAL_TYPE,
	    animate: true,
	    region: {
	        latitude:45.523703,
	        longitude:9.219591,
	        latitudeDelta:0.01,
	        longitudeDelta:0.01
	    },
	    annotations : [drupalday],
	});
	$.addClass(mapview,"mapview");
	var button = Ti.UI.createButton({title : "Ottieni indicazioni"});
	$.addClass(button,"button");
	button.addEventListener('click',function(){
		var navIntent = Ti.Android.createIntent({
			action : Ti.Android.ACTION_VIEW,
			data: 'google.navigation:q=DISCo - Dipartimento di Informatica Sistemistica e Comunicazione,Viale Sarca, 336 - Edificio U14'
		});
		Ti.Android.currentActivity.startActivity(navIntent);
	});
	$.mapContainer.add(mapview);
	$.mapContainer.add(button);
}
else{
	var error = Ti.UI.createLabel({text : GPSerror});
	$.addClass(error,"error");
	if(Alloy.Globals.isAndroidTablet){
		$.addClass(error,"errorTablet");
	}
	$.mapContainer.add(error);
}
