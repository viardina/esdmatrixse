/*!
 * jWCF JavaScript Library v1.0
 * Date 2012 October
 * Copyright 2012 ESD & MatrixSE
 */
      
		var WCFService; //specificare l'url del WCF service o Web service
		jQuery.support.cors=true;  //attivazione query cross-domain
        
        function WCFExecute(method,params,callback) 
        {
        	var WCFMethod=method;
        	var WCFCallback=callback;
            var WCFType="GET";
            var WCFUrl=WCFService+"/"+method+params;
            var WCFData='';//params;
            var WCFContentType = "application/json";
            var WCFDataType = "json"; 
            var WCFProcessData = true; 
            WCFServiceRequest(WCFType,WCFUrl,WCFData,WCFContentType,WCFDataType,WCFProcessData,WCFMethod,WCFCallback);
        }
        
        function WCFServiceRequest(WCFType,WCFUrl,WCFData,WCFContentType,WCFDataType,WCFProcessData,WCFMethod,WCFCallback) 
        {
            $.ajax({
                type: WCFType, //GET or POST or PUT or DELETE verb
                url: WCFUrl, // Location of the service
                data: WCFData, //Data sent to server
                contentType: WCFContentType, // content type sent to server
                dataType: WCFDataType, //Expected data format from server
                processdata: WCFProcessData, //True or False
				success: function(result) {ServiceSucceeded(result,WCFMethod,WCFCallback)}, //When Service succeded
                error: ServiceFailed// When Service call fails
            });
        }

        function ServiceFailed(result) 
        {
            alert("Service call failed: " + result.status + " " + result.statusText);
        }

        function ServiceSucceeded(result,WCFMethod,WCFCallback) 
        {  
            if (result!=null) 
            {
                var resultObject=result[0];
                WCFCallback(resultObject);
            }       
        }



