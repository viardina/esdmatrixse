// JavaScript Document

// Wait for PhoneGap to load
document.addEventListener("deviceready", onDeviceReady, false);

// PhoneGap is ready
function onDeviceReady() {
    InitWUToday();
}

// Settings for WCF server data access in JSON mode
var WCFUrl = "http://95.110.169.199/wcfmobile/service.svc";
var WCFTakeElements=10;

// Start main module
function InitWUToday() {
    ShowApplications();
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
        scrollTreshold: 30
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
    $("#listViewApplications").kendoMobileListView({
        dataSource: dataSource,
        template: $("#itemTemplateApplication").text(),
        pullToRefresh: true,
        endlessScroll: true,
        scrollTreshold: 30
    });
}

// Show events or offers in listview
function ShowOffers(IDActivity,search) {
    var dataSource = GetOffers(IDActivity,search);
    $("#listViewApplications").kendoMobileListView({
        dataSource: dataSource,
        template: $("#itemTemplateApplication").text(),
        pullToRefresh: true,
        endlessScroll: true,
        scrollTreshold: 30
    });
}

function OnLoadCategories(e) {
    var IDApplication=e.view.params.IDApplication;
    ShowCategories(IDApplication,'');
}



