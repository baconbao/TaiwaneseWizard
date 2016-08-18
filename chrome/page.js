String.prototype.replaceAt = function(index, character) {
    return this.substr(0, index) + character + this.substr(index+character.length);
}

function set2default(){
	localStorage["setting-speaker"] = 'TW_LIT_AKoan';
	localStorage["setting-volume"] = 100;
	localStorage["setting-speed"] = -2;
	localStorage["setting-pitchlevel"] = 5;
	localStorage["setting-pitchscale"] = 13;
}

function faceInitFunc(){		
	setTimeout(function(){$('#face').text('> _ <');},10);
	setTimeout(function(){$('#face').text('^ _ ^');},800);
}

function textReplce_forSpeak(text){
	var pa = [',', ':', ';', '?', '!', '。', '，', '：', '；', '？', '！', '、', '　'];
	var output = '';
	text = text.trim(text);
	text = text.replace(/\ \s+/g, ' ');
	for(var i=0; i<text.length; i++){
		if( text[i]==' ' && ifChinese(text, i-1) && ifChinese(text, i+1) ) output = output + '　';
		if( ifChinese(text, i) ) output = output + text[i];
		if( jQuery.inArray(text[i], pa)>=0 ) output = output + text[i];
		if( text[i].match(/\d+/g) ) output = output + text[i];
	}
	output = output.replace(/\s+/g, '');
	return output;
}

function textReplce_forEdit(text){
	var pa = [',', ':', ';', '?', '!', '。', '，', '：', '；', '？', '！', '、', '　'];
	var output = '';
	text = text.trim(text);
	text = text.replace(/\ \s+/g, ' ');
	for(var i=0; i<text.length; i++){
		if( text[i]==' ' && ifChinese(text, i-1) && ifChinese(text, i+1) ){
			text = text.replaceAt(i, '　');
		}
		output = output + text[i];			
	}
	output = output.replace(/\<span class\=\"speak\_n\"\>\s+\<\/span\>/g, '');
	return output;
}

function textReplce_forHTML(text){
	var pa = [',', ':', ';', '?', '!', '。', '，', '：', '；', '？', '！', '、', '　'];
	var output = '';
	text = text.trim(text);
	text = text.replace(/\ \s+/g, ' ');
	for(var i=0; i<text.length; i++){
		var ifSpeak = false;
		if( text[i]==' ' && ifChinese(text, i-1) && ifChinese(text, i+1) ){
			text = text.replaceAt(i, '　');
		}
		if( ifChinese(text, i) ) ifSpeak = true;
		if( jQuery.inArray(text[i], pa)>=0 ) ifSpeak = true;
		if( text[i].match(/\d+/g) ) ifSpeak = true;
		if(ifSpeak){
			output = output + '<span class="speak_y">' + text[i] + '</span>';
		}else{
			output = output + '<span class="speak_n">' + text[i] + '</span>';
		}
	}
	output = output.replace(/\<span class\=\"speak\_n\"\>\s+\<\/span\>/g, '');
	return output;
}

function textReplce_onlyChinese(text){
	var output = '';
	for(var i=0; i<text.length; i++){
		if( ifChinese(text, i) ) output = output + text[i];
	}
	return output;
}

function ifChinese(text, point){
	if( text.charCodeAt(point)>=0x4E00 && text.charCodeAt(point)<=0x9FA5 ) {
		return true;
	}else{
		return false;
	}
}

function HowManyChinese(text){
	var v = 0;
	for(var i=0; i<text.length; i++){
    	text.charCodeAt(i);
		if( text.charCodeAt(i)>=0x4E00 && text.charCodeAt(i)<=0x9FA5 ) v++;
	}
	return v;
}

function getSelText(){
	var text = '';
	if (window.getSelection) {
		text = window.getSelection();
	} else if(document.getSelection) {
		text = document.getSelection();
	} else if(document.selection) {
		text = document.selection.createRange().text;
	}
	return text;
}

function padLeft(str, len) {
    str = '' + str;
    return str.length >= len ? str : new Array(len - str.length + 1).join("0") + str;
}


function stratTTS_first(text){
	if(localStorage["setting-volume"]==null){
		set2default();
	}
	$('#face').html('<i class="icon loading" style="margin-left:15px;"></i>');
	var speaker = localStorage["setting-speaker"];
	var volume = localStorage["setting-volume"];
	var speed = localStorage["setting-speed"];
	var pitchLevel = localStorage["setting-pitchlevel"];
	var pitchSign = 0;
	var pitchScale = localStorage["setting-pitchscale"];
	var format = "wav";
	var cache = new Date().getTime();
	var key = "<YOUR_ITRI_TTS_KEY>"; // !important: Change this for your ITRI TTS key, get key here: http://tts.itri.org.tw
	$.ajax({
		url: "http://tts.itri.org.tw/"+"php/webtts.php?t=4&w="+text+"&m="+speaker+"&v="+volume+"&s="+speed+"&pl="+pitchLevel+"&psi="+pitchSign+"&psc="+pitchScale+"&f="+format+"&idx="+cache+"&k="+key+"&cache="+new Date().getTime(),
		type: 'GET',
		dataType: 'html',
		success: function(data){
			var tmpTextNum1 = data.indexOf('resultConvertID');
			var tmpTextNum2 = data.indexOf("=", tmpTextNum1);
			var tmpTextNum3 = data.indexOf(";", tmpTextNum2);
			var convertId = data.substring(tmpTextNum2+2, tmpTextNum3-1);
			var times = 0;
			var startTTS_second;
			startTTS_second = setInterval(function(){
				$.ajax({
					url: "http://tts.itri.org.tw/php/webtts.php?t=3&i="+convertId+"&idx="+cache+"&k="+key+"&cache="+new Date().getTime(),
					type: 'GET',
					dataType: 'html',
					success: function(data){
						var tmpDataNum1 = data.indexOf('resultUrl');
						var tmpDataNum2 = data.indexOf("=", tmpDataNum1);
						var tmpDataNum3 = data.indexOf(";", tmpDataNum2);
						var resultUrl = data.substring(tmpDataNum2+2, tmpDataNum3-1);
						times++;
                        if(times == 60){
                        	clearInterval(startTTS_second);
                        	$('#face').text('x _ x');
                        	alert('抱歉，可能服務正在維護中，或是此語句台語兒不會說...');
			                $.ajax({
								url: "http://tts.itri.org.tw/php/whenerrorsendmail.php?cache=" +new Date().getTime(),
								type: 'GET',
								dataType: 'html',
								success: function(data){}
							});         
                        }
						if(resultUrl!="") { 
							clearInterval(startTTS_second);
							var audioElement = $('#ttsplayer')[0];
							audioElement.setAttribute('src', resultUrl);
							audioElement.play();
						};
					}
				});
			}, 1000);
		},
		error: function(){
			$('#face').text('x _ x');
			$('#nofi').hide();
			alert('錯誤：無法連接，可能是您的網路不通或是本服務維護中。');
		}
	});
}

function stratDic(text){
	var output = new Array();
	output['dicName'] = text;
	output['dicID'] = '';
	output['dicRoma'] = '';
	$.ajax({
		url: 'http://twblg.dict.edu.tw/holodict_new/result.jsp?radiobutton=0&limit=20&querytarget=2&sample='+text+'&submit.x=0&submit.y=0',
		type: 'get',
		dataType: 'html',
		async: false,
		success: function(data) {
			if( $(data).find('.all_space1').length ) {
				var row = $(data).find('.all_space1');
				output['dicRoma'] = $(row.find('td').get(2)).text();
				if( $(row.find('td').get(1)).find('a').length ) {
					var regExp = /n_no=(.*?)&/;
					var matches = regExp.exec($(row.find('td').get(1)).find('a').attr('href'));
					output['dicID'] = matches[0].replace('n_no=','');
					output['dicID'] = output['dicID'].replace('&','');
					output['dicID'] = padLeft(output['dicID'], 5);
					output['dicID'] = 'http://twblg.dict.edu.tw/holodict_new/audio/'+output['dicID']+'.mp3';
				}
			}else{
				output['dicName'] = 'oh_error';
			}
		},
		error: function() {
			output['dicName'] = 'oh_error';
		}
	});
	return [
		output['dicName'],
		output['dicRoma'],
		output['dicID']
	];
}

$(document).ready(function(){

	/*--- Page Start ---*/
	if(sessionStorage["mainText"]==null){
		sessionStorage["mainText"] = localStorage["tmpText"];
		localStorage.removeItem("tmpText");
	}
	localStorage.removeItem("tmpText");
	var text = sessionStorage["mainText"];
	var text_forHTML = textReplce_forHTML(text);
	var text_forEdit = textReplce_forEdit(text);
	var text_forSpeak = textReplce_forSpeak(text);

	/*-- Init UI --*/
	$('#icon_list').hide();
	$('#version').text(localStorage["version"]);
	$('#text2say').html( text_forHTML );
	$('#text2edit>textarea').val( text_forEdit );

	/*--- Title Change ---*/
	if(text.length > 10){
		$('title').text('台語兒：「'+text.substr(0, 10)+'...」');
	}else{
		$('title').text('台語兒：「'+text+'」');
	}

	/*--- Check all text are Chinese --*/
	if( HowManyChinese(text)<=0 ){
		alert('錯誤：您似乎沒有選取到中文字串，請重新檢查。');
		return false;
	}
	
	/*--- Play voice --*/
	stratTTS_first( text_forSpeak );
	
	/*--- Logo Follow Mouse ---*/
	var logoPos = $("#logo>img").position();
	var logoWidthHalf = $("#logo>img").width() / 2;
	var logoHeightHalf = $("#logo>img").height() / 2;
	var soucePoint = {x:(logoPos.left+logoWidthHalf), y:(logoPos.top+logoHeightHalf)};
	$(document).mousemove(function(e){
		var mouzPoint = {x:e.pageX, y:e.pageY};
		var distX = mouzPoint.x - soucePoint.x;
		var distY = mouzPoint.y - soucePoint.y;
		var degX = parseInt(distY/1000*45, 10);
		var degY = parseInt(-1*distX/2000*45, 10);
		$("#logo").css('-webkit-transform', 'rotateY('+degY+'deg) rotateX('+degX+'deg)');
	});

	/*--- Logo Click to Say ---*/
	$('#logo').click(function(){
		clearInterval(faceInit);
		var audioElement = $('#ttsplayer')[0];
		audioElement.play();
	});

	/*--- Audio API ---*/
	$('#ttsplayer').on('playing', function() {
		$('#face').text('^ 0 ^');
	});
	$('#ttsplayer').on('ended', function() {
		$('#face').text('^ _ ^');
		faceInit = setInterval(faceInitFunc, 5000);
	});
	$('#dicplayer').on('playing', function() {
		$('#playDic').text('播放中...');
	});
	$('#dicplayer').on('ended', function() {
		$('#playDic').text('聆聽讀音');
	});

	/*--- Select text to known ---*/
	$("#text2say").mouseup(function(){
		var tx = getSelText().toString();
		if(tx!==''){
			var dicResult = stratDic(tx);
			if(dicResult['0']!=='oh_error'){
				$('#select2known').removeClass('opac');
				$("#select2known").text('【'+dicResult['0']+'】'+dicResult['1']);
				if(dicResult['2']!=='') {
					$('#dicplayer').get(0).setAttribute('src', dicResult['2']);
					$("#select2known").append(' <span id="playDic">聆聽讀音</span>');
				}
				$('#playDic').click(function(){
					$('#dicplayer').get(0).play();
				});
			}else{
				$('#select2known').addClass('opac');
				$("#select2known").text('【無結果】辭典中找不到符合的結果。');
			}		
		}
	});

	/*--- User click to fix text ---*/
	$('#click2fix').click(function(){
		var userText = textReplce_forEdit($('#text2edit>textarea').val());
		var origText = textReplce_forEdit(sessionStorage["mainText"]);
		if( userText==origText ){
			$('#text2say').show();
			$('#select2known').show();
			$('#text2edit').hide();
			return false;	
		}
		if( userText=='' || HowManyChinese(userText)<=0 ){
			alert('錯誤：您的修正似乎未包含任何中文字。');
		}else{
			sessionStorage["mainText"] = textReplce_forEdit($('#text2edit>textarea').val());
			window.location.reload();
		}
	});

	/*--- Handle the hover event with non-support text ---*/ 
	$('.speak_n').hover(function(){
		$('.speak_n').css('background-color', '#eee');
	}, function() {
		$('.speak_n').css('background-color', '');
	});

	/*--- Tell user to click logo to replay ---*/ 
	$('#logo').hover(function(){
		$('#nofi').css('visibility', 'visible');
	}, function() {
		$('#nofi').css('visibility', 'hidden');
	});

	/*--- Click to show eidt box ---*/
	$('.speak_n').click(function(){
		$('#text2say').hide();
		$('#select2known').hide();
		$('#text2edit').show();
	});

	/*--- Share box ---*/
	$('#icon_hover>span').hover(function(){
		$('#icon_hover').fadeOut(function(){
			$('#icon_list').fadeIn();
		});
	});
	$('.share_cancel').click(function(){
		$('#icon_hover').show();
		$('#icon_list').hide();
	});

});

