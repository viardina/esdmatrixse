// JavaScript Document

// Wait for PhoneGap to load
document.addEventListener("deviceready", onDeviceReady, false);

// PhoneGap is ready
function onDeviceReady() {
    InitWUToday();
}

// Settings for WCF server data access in JSON mode
var WCFUrl = "http://95.110.169.199/wcfmobile/service.svc";
WCFService=WCFUrl;
var WCFTakeElements=10;
var timeoutNotification=120; // in sec
var timeoutBanners=5; // in sec

// Start main module
function InitWUToday() {
    ShowApplications();
    ShowBanners();
    InitPushNotifications();
}

function InitPushNotifications(){
    setInterval(CheckPushNotification, timeoutNotification*1000);
}

function CheckPushNotification(){
    WCFExecute('GetNotifications','', function(data) {  
        var ID=data.ID;
        var title=data.Title;
        var message=data.Message;
        var IDCategory=data.IDCategory;
        var IDOffer=data.IDOffer;
        var notified=GetNotified(ID);
        if(!notified){
            var preference=GetPreference(IDCategory);
            var globalNotification=(IDCategory==0);
            if(preference || globalNotification){
                if(IDOffer>0)
                    ShowNotify(title, message, function(){ShowNotifyOfferInfo(IDOffer)});
                else
                    ShowNotify(title, message,null);
                SetNotified(ID,true);                
            }
        }
    }); 
}

function ShowNotifyOfferInfo(IDOffer){
    app.navigate("\#offerInfo?IDOffer="+IDOffer);
}

function ShowNotify(title,message,callback) {
    var textButton="Chiudi";
    if(callback!=null)
        textButton="Visualizza l'offerta";
    navigator.notification.alert(message,callback,title,textButton);
}

function SetNotified(IDNotification,value){
    window.localStorage.setItem('notify'+IDNotification,value);
}

function GetNotified(IDNotification){
    var localValue=window.localStorage.getItem('notify'+IDNotification);
    if(localValue==null)
        value=false;
    else
        value=(localValue=="true");
    return value;    
}

// Banners controller
var banners;
var indexBanner=0;
function ShowBanners(){
    banners=new Array();
    WCFExecute('GetBanners','', function(data) {  
        $.each(data, function(index,value){
           banners.push(value.Icon); 
        }); 
        setInterval(ChangeBanner, timeoutBanners*1000);
    });   
}

function ChangeBanner(){
    indexBanner+=1;
    if(indexBanner>banners.length-1)
        indexBanner=0;
    var banner=banners[indexBanner];
    var image = $("#bannerController");
    image.fadeOut("fast", function () {
        image.attr("src", "http://www.whatsuptoday.it/resources/images/"+banner+'?timestamp='+Math.random());
        image.fadeIn("fast");
    });
}

function SetTitle(title){
    /*var element=document.getElementById('titleView');
    element.innerText=title;
    alert(element.innerText);*/
}

function GoToHome(){
    app.navigate("#applications");
    ShowApplications();
}

function ToggleNavBarButtons(e) {
    var view=e.view;
    if (view.id == "#applications"){     
        view.element.find("[id=backButton]").css("display", "none");
        view.element.find("[id=homeButton]").css("display", "none");
        view.element.find("[id=settingsButton]").css("display", "");
    }else{
        view.element.find("[id=backButton]").css("display", "");
        view.element.find("[id=homeButton]").css("display", "");
        view.element.find("[id=settingsButton]").css("display", "none");
    }
    if(view.id=="#activities"){
        view.element.find("[id=mapButton]").css("display", "");   
    }
    else{
        view.element.find("[id=mapButton]").css("display", "none");     
    }
    if(view.id=="#about"){
        view.element.find("[id=headerLogo]").css("display", "none");   
    }
    else{
        view.element.find("[id=headerLogo]").css("display", "");     
    }
}

function GetActivityIconOpacity(value){
    if(value!=null && value!="")
        return .7;
    else
        return .1;
}

function GetActivityDisplayOffersDetail(count){
    if(count>0)
        return '';
    else
        return 'none';
}

// Get first level application
function GetApplications() {
    var dataSource = new kendo.data.DataSource({
        pageSize: WCFTakeElements,
        serverPaging: true,
        transport: {
            read: {
                url: WCFUrl + "/getapplications",
                dataType: "json"
            },
            parameterMap: function (options) {
                return {
                    skip: (options.page - 1) * options.pageSize,
                    take: options.pageSize,
                };
            }
        },
        schema: {
            data: "",
            total: "pageSize"
        }
    });
    return dataSource;
}

// Get second level categories
function GetCategories(IDApplication,search) {
    var dataSource = new kendo.data.DataSource({
        pageSize: WCFTakeElements,
        serverPaging: true,
        transport: {
            read: {
                url: WCFUrl + "/getcategories",
                dataType: "json"
            },
            parameterMap: function (options) {
                return {
                    IDApplication: IDApplication,
                    search: search,
                    skip: (options.page - 1) * options.pageSize,
                    take: options.pageSize,
                };
            }
        },
        schema: {
            data: "",
            total: "pageSize"
        }
    });
    return dataSource;
}

// Get settings
function GetSettings() {
    var dataSource = new kendo.data.DataSource({
        transport: {
            read: {
                url: WCFUrl + "/getsettings",
                dataType: "json"
            },
            parameterMap: function (options) {
                return {
                };
            }
        },
        schema: {
            data: ""  
        },
        group: {field: "Application"},
        sort: {field: "Title", dir: "asc"}
    });
    return dataSource;
}

// Get third level activities
function GetActivities(IDCategory,search,latitude,longitude,region,country,city) {
    var dataSource = new kendo.data.DataSource({
        pageSize: WCFTakeElements,
        serverPaging: true,
        transport: {
            read: {
                url: WCFUrl + "/getactivities",
                dataType: "json"
            },
            parameterMap: function (options) {
                return {
                    IDCategory: IDCategory,
                    search: search,
                    latitude: latitude,
                    longitude: longitude,
                    region: region,
                    country: country,
                    city: city,
                    skip: (options.page - 1) * options.pageSize,
                    take: options.pageSize,
                };
            }
        },
        schema: {
            data: "",
            total: "pageSize"
        }
    });
    return dataSource;
}

// Fill activity info 
function FillActivityInfo(IDActivity) {
    WCFExecute('GetActivityInfo','?IDActivity='+IDActivity, function(data) {  
        var viewModel=kendo.observable({
            title: data.Title,
            address: data.Address,
            email: GetActivityTextInfo(data.Email),
            phone: GetActivityTextInfo(data.Phone),
            web: GetActivityTextInfo(data.Web),
            info: data.Info,
            icon: 'http://www.whatsuptoday.it/resources/images/'+data.Icon,
            emailOpacity: GetActivityIconOpacity(data.Email),
            phoneOpacity: GetActivityIconOpacity(data.Phone),
            webOpacity: GetActivityIconOpacity(data.Web),
            mapOpacity: .7,
            StartEmail: function(){
               window.open('mailto:'+data.Email);
            },
            StartPhone: function(){
               window.open('tel:'+data.Phone);
            },
            StartWeb: function(){
               window.open('http://'+data.Web);
            },
            StartMap: function(){
               var address=data.Title+" "+data.Address; 
               app.navigate("#geocodesMap?latitude="+data.Latitude+"&longitude="+data.Longitude+"&address="+address);
            }
        });
        kendo.bind($("#activityInfo"),viewModel);
    });
}

function GetActivityTextInfo(value){
    if(value==null || value=='')
        return "Non disponibile";
    else
        return value;
}

// Fill offer info
function FillOfferInfo(IDOffer) {
    WCFExecute('GetOfferInfo','?IDOffer='+IDOffer, function(data) {  
        var viewModel=kendo.observable({
            activityTitle: data.ActivityTitle,
            title: data.Title,
            period: data.Period,
            description: data.Description,
            icon: 'http://www.whatsuptoday.it/resources/images/'+data.Icon
        });
        kendo.bind($("#offerInfo"),viewModel);
    });
}


// Get fourth level Offers or Events
function GetOffers(IDActivity,search) {
    var dataSource = new kendo.data.DataSource({
        pageSize: WCFTakeElements,
        serverPaging: true,
        transport: {
            read: {
                url: WCFUrl + "/getoffers",
                dataType: "json"
            },
            parameterMap: function (options) {
                return {
                    IDActivity: IDActivity,
                    search: search,
                    skip: (options.page - 1) * options.pageSize,
                    take: options.pageSize,
                };
            }
        },
        schema: {
            data: "",
            total: "pageSize"
        }
    });
    return dataSource;
}

// Get fourth level today events
function GetOffersToday(IDActivity,search,days) {
    var dataSource = new kendo.data.DataSource({
        pageSize: WCFTakeElements,
        serverPaging: true,
        transport: {
            read: {
                url: WCFUrl + "/getofferstoday",
                dataType: "json"
            },
            parameterMap: function (options) {
                return {
                    IDActivity: IDActivity,
                    search: search,
                    days: days,
                    skip: (options.page - 1) * options.pageSize,
                    take: options.pageSize,
                };
            }
        },
        schema: {
            data: "",
            total: "pageSize"
        }
    });
    return dataSource;
}

// Show applications in listview
function ShowApplications() {
    var dataSource = GetApplications();
    $("#listViewApplications").kendoMobileListView({
        dataSource: dataSource,
        template: $("#itemTemplateApplication").text(),
        pullToRefresh: true,
        endlessScroll: true,
        scrollTreshold: 30,
    });
}

// Show categories in listview
function ShowCategories(IDApplication, search) {
    var dataSource = GetCategories(IDApplication, search); 
    $("#listViewCategories").kendoMobileListView({
        dataSource: dataSource,
        template: $("#itemTemplateCategory").text(),
        pullToRefresh: true,
        endlessScroll: true,
        scrollTreshold: 30
    });
}

// Show activities in listview
function ShowActivities(IDCategory,search,latitude,longitude,region,country,city) {
    var dataSource = GetActivities(IDCategory,search,latitude,longitude,region,country,city);
    $("#listViewActivities").kendoMobileListView({
        dataSource: dataSource,
        template: $("#itemTemplateActivity").text(),
        pullToRefresh: true,
        endlessScroll: true,
        scrollTreshold: 30
    });
}

// Search activities 
function SearchActivities(IDCategory,search,latitude,longitude,region,country,city) {
    var dataSource = GetActivities(IDCategory,search,latitude,longitude,region,country,city);
    $("#listViewResultsActivities").kendoMobileListView({
        dataSource: dataSource,
        template: $("#itemTemplateResultActivity").text(),
        endlessScroll: true,
        scrollTreshold: 30
    });
}

// Show events or offers in listview
function ShowOffers(IDActivity,search) {
    var dataSource = GetOffers(IDActivity,search);
    $("#listViewOffers").kendoMobileListView({
        dataSource: dataSource,
        template: $("#itemTemplateOffer").text(),
        pullToRefresh: true,
        endlessScroll: true,
        scrollTreshold: 30
    });
}

// Search events or offers 
function SearchOffers(IDActivity,search) {
    var dataSource = GetOffers(IDActivity,search);
    $("#listViewResultsOffers").kendoMobileListView({
        dataSource: dataSource,
        template: $("#itemTemplateResultOffer").text(),
        endlessScroll: true,
        scrollTreshold: 30
    });
}

// Search today events
function SearchOffersToday(IDActivity,search,today) {
    var dataSource = GetOffersToday(IDActivity,search,today);
    $("#listViewResultsOffers").kendoMobileListView({
        dataSource: dataSource,
        template: $("#itemTemplateResultOffer").text(),
        endlessScroll: true,
        scrollTreshold: 30
    });
}


function OnLoadCategories(e) {
    var view=e.view;
    var title=view.params.title;
    SetTitle(title);
    var IDApplication=view.params.IDApplication;
    ShowCategories(IDApplication,''); 
}

function OnLoadActivities(e) {
    var view=e.view;
    var title=view.params.title;
    SetTitle(title);
    var IDCategory=view.params.IDCategory;
    var latitude='';
    var longitude='';
    var search='';
    var region='';
    var country='';
    var city='';
    navigator.geolocation.getCurrentPosition(function (position) {
        var latitude = position.coords.latitude;  
        var longitude = position.coords.longitude; 
        ShowActivities(IDCategory, search, latitude, longitude, region, country, city);
    }, function (){
        ShowActivities(IDCategory, search, latitude, longitude, region, country, city);
    }); 
}

function OnLoadOffers(e) {
    var view=e.view;
    var title=view.params.title;
    SetTitle(title);
    var IDActivity=view.params.IDActivity;
    ShowOffers(IDActivity, '');
}

function OnLoadActivityInfo(e) {
    var view=e.view;
    var title=view.params.title;
    SetTitle(title);
    var IDActivity=view.params.IDActivity;  
    FillActivityInfo(IDActivity);   
}

function OnLoadOfferInfo(e) {
    var view=e.view;
    var title=view.params.title;
    SetTitle(title);
    var IDOffer=view.params.IDOffer;  
    FillOfferInfo(IDOffer);   
}

function CloseSearch(){   
    $("#searchController").kendoMobileModalView("close");
}

function SearchGlobal(){
    var search=document.getElementById('searchKey').value;
    app.navigate("#resultsOffers");
    var latitude='';
    var longitude='';
    var region='';
    var country='';
    var city='';
    navigator.geolocation.getCurrentPosition(function (position) {
        var latitude = position.coords.latitude;  
        var longitude = position.coords.longitude; 
        SearchActivities(-1,search, latitude, longitude, region, country, city);
    }, function (){
        SearchActivities(-1,search, latitude, longitude, region, country, city);
    }); 
    SearchOffers(-1,search)
    CloseSearch();
}

function SearchToday(){
    var search=document.getElementById('searchKey').value;
    app.navigate("#resultsOffers");
    SearchOffersToday(-1,search,0)
    CloseSearch();
}

function SearchWeekly(){
    var search=document.getElementById('searchKey').value;
    app.navigate("#resultsOffers");
    SearchOffersToday(-1,search,7)
    CloseSearch();
}


function OnResultsOffersSelected() {
    var buttonGroup = $("#resultsOffersGroup").data("kendoMobileButtonGroup");
    buttonGroup.select(0);
    app.navigate("#resultsActivities");
}

function OnResultsActivitiesSelected() {
    var buttonGroup = $("#resultsActivitiesGroup").data("kendoMobileButtonGroup");
    buttonGroup.select(1);
    app.navigate("#resultsOffers");
}

function OnLoadGeocodesMap(e) {
    var view=e.view;
    var title=view.params.title;
    SetTitle(title);
    var addressDestination=view.params.address;
    var latitudeDestination=view.params.latitude;  
    var longitudeDestination=view.params.longitude;
    navigator.geolocation.getCurrentPosition(function (position) {
        var latitudeOrigin = position.coords.latitude;  
        var longitudeOrigin = position.coords.longitude; 
        ShowGeocodesMap(latitudeOrigin, longitudeOrigin, latitudeDestination, longitudeDestination,addressDestination);
        var viewModel=kendo.observable({
                latitude: latitudeDestination,
                longitude: longitudeDestination,
                StartStreetView: function(){               
                    app.navigate("#streetViewMap?latitude="+latitudeDestination+"&longitude="+longitudeDestination);
                }
            });
        kendo.bind($("#geocodesMap"),viewModel);    
    }, function (){
        alert("Navigatore GPS non disponibile. Abilitare l'app mobile all'uso del dispositivo GPS.");
    }); 
}

function ShowGeocodesMap(latitudeOrigin, longitudeOrigin, latitudeDestination, longitudeDestination, addressDestination){
    var directionsService = new google.maps.DirectionsService();
    var directionsDisplay = new google.maps.DirectionsRenderer();
    var localPosition = new google.maps.LatLng(latitudeOrigin, longitudeOrigin);
    var mapOptions = {
        zoom: 12,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        center: localPosition
    }
    var map = new google.maps.Map(document.getElementById('map_canvas'), mapOptions);
    directionsDisplay.setMap(map);

    var start = new google.maps.LatLng(latitudeOrigin, longitudeOrigin);
    var end = new google.maps.LatLng(latitudeDestination, longitudeDestination);
    var request = {
        origin: start,
        destination: end,
        travelMode: google.maps.DirectionsTravelMode.DRIVING
    };
    directionsService.route(request, function (response, status) {
        if (status == google.maps.DirectionsStatus.OK) {
            directionsDisplay.setDirections(response);
            var marker = new google.maps.Marker({
                position: new google.maps.LatLng(latitudeDestination, longitudeDestination),
                map: map,
                title: addressDestination
            });
        }
    });
}

function OnLoadStreetViewMap(e) {
    var view=e.view;
    var title=view.params.title;
    SetTitle(title);
    var latitude=view.params.latitude;  
    var longitude=view.params.longitude;
    ShowStreetViewMap(latitude, longitude);
}

function ShowStreetViewMap(latitude,longitude) {
    var target = new google.maps.LatLng(latitude, longitude);
    var panoramaOptions = {
        position: target,
        pov: {
            heading: 0,
            pitch: 0,
            zoom: 1
        }
    };
    var panoramaView = new google.maps.StreetViewPanorama(document.getElementById('pano'), panoramaOptions);
    panoramaView.setVisible(true);
}

var locations;
function ShowMapActivities(){
    locations=new Array();
    $("#listViewActivities").children().each(function(index){
        var IDActivity=$(this).find("a").attr('id');
        var title=$(this).find("a").attr('title');
        var address=$(this).find("a").attr('address');
        var latitude=$(this).find("a").attr('latitude');
        var longitude=$(this).find("a").attr('longitude');    
        var content=title+" "+address;
        var location=new Location(IDActivity,content,latitude,longitude);
        locations.push(location);
    });
    app.navigate("#googleMap?locations="+locations);
}

var Location=function(IDActivity,content,latitude,longitude){
    this.IDActivity=IDActivity;
    this.content=content;
    this.latitude=latitude;
    this.longitude=longitude;    
}


function OnLoadGoogleMap(e){
    navigator.geolocation.getCurrentPosition(function (position) {
        var latitude = position.coords.latitude;  
        var longitude = position.coords.longitude; 
        ShowGoogleMap(locations,latitude,longitude);
    }, function (){
        alert("Navigatore GPS non disponibile. Abilitare l'app mobile all'uso del dispositivo GPS.");
    });    
}

function ShowGoogleMap(locations,latitude,longitude){
    var map = new google.maps.Map(document.getElementById('map'), {
      zoom: 12,
      center: new google.maps.LatLng(latitude, longitude),
      mapTypeId: google.maps.MapTypeId.ROADMAP
    });        
    $.each(locations, function(index,location) {
      var latitude=location.latitude;
      var longitude=location.longitude;
      var IDActivity=location.IDActivity;
      var marker = new google.maps.Marker({
          position: new google.maps.LatLng(latitude,longitude),
          map: map,
          icon: 'images/locationsmarker.png',
          animation: google.maps.Animation.DROP
      });
      google.maps.event.addListener(marker, 'click', function (e) {
        ShowGoogleMapActivityInfo(IDActivity);
      });
    });
    var myMarker = new google.maps.Marker({
      position: new google.maps.LatLng(latitude,longitude),
      map: map,
      icon: 'images/locationmarker.png',
      animation: google.maps.Animation.BOUNCE
    });
    

    setTimeout(function(){StopMarkerAnimation(myMarker)},3*1000);
}

function StopMarkerAnimation(marker){
    marker.setAnimation(null);
}

function ShowGoogleMapActivityInfo(IDActivity) {  
    app.navigate("#activityInfo?IDActivity="+IDActivity);   
}

function OnLoadSettings(){
    var dataSource = GetSettings(); 
    $("#listViewSettings").kendoMobileListView({
        dataSource: dataSource,
        template: $("#itemTemplateSetting").text(),
        headerTemplate: "<label>#:value#</label>"
    });
}

function GetPreference(IDCategory){
    var localValue=window.localStorage.getItem('category'+IDCategory);
    if(localValue==null)
        value=true;
    else
        value=(localValue=="true");
    return value;
}

function SetPreference(IDCategory){
    var checkId="check"+IDCategory;
    var check=document.getElementById(checkId);
    var value=check.checked;
    window.localStorage.setItem('category'+IDCategory,value); 
    var lblCheckId="lblCheck"+IDCategory;
    var lblCheck=document.getElementById(lblCheckId);
    lblCheck.style.opacity=GetPreferenceOpacity(value);
}

function GetPreferenceOpacity(value){
    var opacity=value?1:0.25;
    return opacity
}


function SearchAR(){
    app.navigate("#googleAR3D");
}

var panorama;
function OnLoadGoogleAR3D(e){
    var latitude;
    var longitude;
    navigator.geolocation.watchPosition(function (position) {
        latitude = position.coords.latitude;
        longitude = position.coords.longitude;
        SetPositionMap3D(latitude, longitude);
    }, function () {
        alert("Navigatore GPS non disponibile. Abilitare l'app mobile all'uso del dispositivo GPS.");
    }, { frequency: 5000 });

    navigator.geolocation.getCurrentPosition(function (position) {
        latitude = position.coords.latitude;  
        longitude = position.coords.longitude; 
        ShowPositionMap3D(latitude, longitude);
    }, function () { 
        alert("Navigatore GPS non disponibile. Abilitare l'app mobile all'uso del dispositivo GPS.");
    });

    navigator.compass.watchHeading(function (heading) {
        var compass = heading.magneticHeading;
        SetHeadingMap3D(compass);
    }, function () { 
        alert("Navigatore GPS non disponibile. Abilitare l'app mobile all'uso del dispositivo GPS.");
    }, { frequency: 5000 });


}

function SetHeadingMap3D(heading) {
    panorama.setHeading(heading);
}

function SetPositionMap3D(latitude, longitude,compass) {
    var target = new google.maps.LatLng(latitude, longitude);
    panorama.setPosition(target);
}

function ShowPositionMap3D(latitude, longitude) {
    var target = new google.maps.LatLng(latitude, longitude);
    var panoramaOptions = {
        position: target,
        pov: {
            heading: 0,
            pitch: 0,
            zoom: 1
        }
    };
    panorama = new google.maps.StreetViewPanorama(document.getElementById("panoAR"), panoramaOptions);
    panorama.setVisible(true);

    /*google.maps.event.addListener(panorama, 'pov_changed', function () {
         heading = panorama.getPov().heading;
    });*/
}





