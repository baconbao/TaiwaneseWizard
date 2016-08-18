localStorage["version"] = chrome.runtime.getManifest().version;

String.prototype.replaceAt = function(index, character) {
    return this.substr(0, index) + character + this.substr(index+character.length);
}

function numberChange(text) {
	for(var i=0; i<text.length; i++){
		if(text[i]=='０') text = text.replaceAt(i, '0');
		if(text[i]=='１') text = text.replaceAt(i, '1');
		if(text[i]=='２') text = text.replaceAt(i, '2');
		if(text[i]=='３') text = text.replaceAt(i, '3');
		if(text[i]=='４') text = text.replaceAt(i, '4');
		if(text[i]=='５') text = text.replaceAt(i, '5');
		if(text[i]=='６') text = text.replaceAt(i, '6');
		if(text[i]=='７') text = text.replaceAt(i, '7');
		if(text[i]=='８') text = text.replaceAt(i, '8');
		if(text[i]=='９') text = text.replaceAt(i, '9');
	}
	return text;
}
function openPage(text, tab) {
	if(text&&text.length>0) {
		var pageTab={ url:chrome.extension.getURL('page.html')};
	}
	if(tab) pageTab.index = tab.index+1;
	text = numberChange(text);
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