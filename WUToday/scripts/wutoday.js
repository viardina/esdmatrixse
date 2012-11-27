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

// Start main module
function InitWUToday() {
    ShowApplications();
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
}

function GetActivityIconOpacity(value){
    if(value!=null && value!="")
        return .5;
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
        group: {field: "Application"}
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
            mapOpacity: .5,
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

// Show categories in settings
function ShowSettings() {
    var dataSource = GetSettings(); 
    $("#listViewSettings").kendoMobileListView({
        dataSource: dataSource,
        template: $("#itemTemplateSetting").text(),
        headerTemplate: "<label>#:value#</label>"
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

/*function OnLoadWaiting(e) {
    e.view.element.find("[id=listViewCategories]").css("visibility", "hidden");
}
*/

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
    ShowActivities(IDCategory, '', '', '', '', '', '');
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
    SearchActivities(-1,search, '', '', '', '', '');
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
    var latitudeOrigin="39.31"; // da sostituire con il navigator.position
    var longitudeOrigin="16.24";
    ShowGeocodesMap(latitudeOrigin, longitudeOrigin, latitudeDestination, longitudeDestination,addressDestination);
    var viewModel=kendo.observable({
            latitude: latitudeDestination,
            longitude: longitudeDestination,
            StartStreetView: function(){               
                app.navigate("#streetViewMap?latitude="+latitudeDestination+"&longitude="+longitudeDestination);
            }
        });
    kendo.bind($("#geocodesMap"),viewModel);
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
        var title=($(this).find("a").attr('title'));
        var latitude=($(this).find("a").attr('latitude'));
        var longitude=($(this).find("a").attr('longitude'));        
        var location=new Location(title,latitude,longitude);
        locations.push(location);
    });
    app.navigate("#googleMap?locations="+locations);
}

var Location=function(title,latitude,longitude){
    this.title=title;
    this.latitude=latitude;
    this.longitude=longitude;    
}


function OnLoadGoogleMap(e){
    //var view=e.view;
    //var locations=view.params.locations;
    var latitude="39.31";
    var longitude="16.24";
    ShowGoogleMap(locations,latitude,longitude);
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
          var title=location.title;
          var marker = new google.maps.Marker({
              position: new google.maps.LatLng(latitude,longitude),
              map: map,
              title: title
          });
          google.maps.event.addListener(marker, 'click', function (marker) {
              var infowindow = new google.maps.InfoWindow(); 
              infowindow.setContent(title);
              infowindow.open(map, marker);          
          });
      });
      var myMarker = new google.maps.Marker({
          position: new google.maps.LatLng(latitude,longitude),
          map: map,
          title: 'La tua posizione',
          icon: 'images/iphonegps.png'
      });
      google.maps.event.addListener(myMarker, 'click', function () {
          var infowindow = new google.maps.InfoWindow();     
          infowindow.setContent('La tua posizione');
          infowindow.open(map, myMarker);
      });
}

function OnLoadSettings(){
    ShowSettings();
}



