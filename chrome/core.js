function openPage(text, tab) {
	if(text&&text.length>0) {
		var pageTab={ url:chrome.extension.getURL('page.html')};
	}
	if(tab) pageTab.index = tab.index+1;
	if(text=='0') text='０';
	localStorage["tmpText"] = text;
	chrome.tabs.create(pageTab);
}

chrome.contextMenus.create({ 
	"title": "台語兒：「%s」",  
	"contexts": ["selection"], 
	"onclick": function(info,tab) {
		openPage(info.selectionText, tab);
	}
});


