/*------
台語兒(Taiwanese Wizard) by BaconBao (http://baconbao.blogspot.com)
------*/

$(document).ready(function(){

	/*--- Page Start ---*/
	var audioElement = $('#ttsplayer')[0];
	$("#logo").css('-moz-transform', 'rotateY(0deg) rotateX(0deg)');
	$("#logo").css('-webkit-transform', 'rotateY(0deg) rotateX(0deg)');
	var faceInit = setInterval(faceInitFunc, 5000);
	
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
		$("#logo").css('-moz-transform', 'rotateY('+degY+'deg) rotateX('+degX+'deg)');
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

});

function faceInitFunc(){		
	setTimeout(function(){$('#face').text('> _ <');},10);
	setTimeout(function(){$('#face').text('^ _ ^');},800);
}