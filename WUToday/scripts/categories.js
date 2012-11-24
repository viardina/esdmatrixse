	function LoadCategories(idApplication,skip,take,search,idBodyContainer,OnLoadedData)
	{
		WCFExecute('GetCategorie',['IDApplicazione:'+idApplication,'skip:'+skip,'take:'+take,'search:'+search],
				function(resultObject) {OnLoadedData(idApplication,resultObject,skip,search,idBodyContainer)});
	}
	
	function GetCategories(resultObject)
	{
		var categories=new Array();
		for (i=0;i<resultObject.length; i++) 
        {
        	var data=resultObject[i].split(WCFSeparator);
        	var category=new Category(data[0],data[1],data[2]);
        	categories[i]=category;
        }  
		return categories;
	}
	
	var Category=function(id,icon,title) 
	{
		this.id=id; 
		this.icon=icon;
		this.title=title; 
	}
	
	