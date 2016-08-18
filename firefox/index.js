/*------
台語兒(Taiwanese Wizard) for Firefox by BaconBao (http://baconbao.blogspot.com)
------*/

exports.main = function(options) {

    var file = require("sdk/self").data;
    var contextmenu = require("sdk/context-menu");
    contextmenu.Item({
      label: "台語兒",
      image: file.url("favicon.ico"),
      context: contextmenu.SelectionContext(),
      contentScript: 'self.on("click", function () {' +
                     '  var sText = window.getSelection().toString();' +
                     '  if(sText && sText.length>0) {' +
                     '    self.postMessage(sText);' +
                     '  }' +
                     '});' +
                     'self.on("context", function () {' +
                     '  var sText = window.getSelection().toString();' +
                     '  if (sText.length > 20)' +
                     '    sText = sText.substr(0, 15) + "...";' +
                     '  return "台語兒：「" + sText + "」";' +
                     '});',
      onMessage: function (selectionText) {
        var tabs = require("sdk/tabs");
        tabs.open({
          url: file.url("page.html"),
          onReady: function(tab) {
            var worker = tab.attach({
                contentScriptFile: [file.url("page.js"),file.url("lib/javascript/jquery.min.js")]
            });
            worker.port.emit('tmpText', selectionText);
          }
        });
      }
    });

};
