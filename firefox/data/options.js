/*------
台語兒(Taiwanese Wizard) for Firefox by BaconBao (http://baconbao.blogspot.com)
------*/

function set2default(){
	localStorage["setting-speaker"] = 'TW_LIT_AKoan';
	localStorage["setting-volume"] = 100;
	localStorage["setting-speed"] = -2;
	localStorage["setting-pitchlevel"] = 5;
	localStorage["setting-pitchscale"] = 13;
}

function set2now() {
	$('#infobox').text('');
	if(localStorage["setting-speaker"]=='TW_LIT_AKoan'){
		$('input:radio[id=v0a]').prop('checked', true);
	}else{
		$('input:radio[id=v0b]').prop('checked', true);
	}
	$('#v1').val(localStorage["setting-volume"]);
	$('#v2').val(localStorage["setting-speed"]);
	$('#v3').val(localStorage["setting-pitchlevel"]);
	$('#v4').val(localStorage["setting-pitchscale"]);
	$('#s1').text(localStorage["setting-volume"]);
	$('#s2').text(localStorage["setting-speed"]);
	$('#s3').text(localStorage["setting-pitchlevel"]);
	$('#s4').text(localStorage["setting-pitchscale"]);
}

$(document).ready(function(){
	$('#btn-again').hide();
	if(localStorage["setting-volume"]==null){
		set2default();
	}
	set2now();
	$(".range-input").change(function(){
		$('#btn-again').show();
		$('#infobox').text('');
		var val = $(this).val();
		$($(this).attr('tarSpan')).text(val);
	});
	$('input:radio').change(function(){
		$('#btn-again').show();
		$('#infobox').text('');
	});
	$('#btn-again').click(function(){
		set2now();
	});
	$('#btn-save').click(function(){
		localStorage["setting-speaker"] = $('input[name="voiceStyle"]:checked').val();
		localStorage["setting-volume"] = $('#v1').val();
		localStorage["setting-speed"] = $('#v2').val();
		localStorage["setting-pitchlevel"] = $('#v3').val();
		localStorage["setting-pitchscale"] = $('#v4').val();
		set2now();
		$('#infobox').text('完成！');
	});
	$('#btn-reboot').click(function(){
		if( confirm("確定要恢復預設值嗎？") ){
			set2default();
			set2now();
		}else{}
	});
});

