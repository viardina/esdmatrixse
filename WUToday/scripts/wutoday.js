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

function ToggleHomeBackButton(e) {
    var view=e.view;
    if (view.id == "#applications"){     
        view.element.find("[id=backButton]").css("visibility", "hidden").attr("data-target", "_top");
        view.element.find("[id=home]").css("visibility", "hidden").attr("data-target", "_top");
    }else{
        view.element.find("[id=backButton]").css("visibility", "visible").removeAttr("data-target");
        view.element.find("[id=home]").css("visibility", "visible").removeAttr("data-target");
    }
}

function GetActivityIconOpacity(value){
    if(value!=null && value!="")
        return .5;
    else
        return .1;
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
            mapOpacity: .5
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

function StartSearch(){
    var search=document.getElementById('searchKey').value;
    app.navigate("#resultsOffers");
    SearchActivities(-1,search, '', '', '', '', '');
    SearchOffers(-1,search)
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




