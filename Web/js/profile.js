$(document).ready(function()
{
  	$("#editBtn").click(function()
  	{
		$("#Data").toggle();  //隱藏原個人資料
		$(".dataList").toggle();  //隱藏原個人資料
  		$(".forms").toggle(); //顯示編輯模式
	});
	
	$("#not").click(function()
  	{
		$("#Data").show();  //隱藏原個人資料
		$(".dataList").show();  //隱藏原個人資料
  		$(".forms").hide(); //顯示編輯模式
  	});
	
	var data = {
		user_id : getCookie("token")
	}
	$.ajax({
		url:"http://"+ host + port +"/api/show_profile",
		type: 'POST',
		data: JSON.stringify(data),
		contentType : "application/json;charset=utf-8",
		success: function(pof){
			console.log(pof);
			var texthtml = '<ul class="list-group">\
								<li class="list-group-item">'+ pof.user_school[0] +'</li>\
								<li class="list-group-item">'+ pof.user_age +'</li>\
								<li class="list-group-item">'+ pof.user_hobby +'</li>\
								<li class="list-group-item">'+ pof.user_like_country +'</li>\
								<li class="list-group-item">'+ pof.user_change +'</li>\
								<li class="list-group-item">'+ pof.user_try +'</li>\
							</ul>';
			$("#user_pic").attr("src",pof.user_picture);
			$("#Data").append(texthtml);
			/*if(pof.user_picture)
			{
				$("#user_pic").attr("src",pof.user_picture);
			}
			if(pof.user_school || pof.user_age || pof.user_hobby || pof.user_like_country || pof.user_change || pof.user_try)
			{
				$("#Data").append(texthtml);
			}*/
		}
	})
});

var img_string="";
var ipt = document.getElementById("#user_picture"); 
function fileUpLoad(_this){
	var file = _this.files[0];
	if(!/image\/\w+/.test(file.type)){ //html中已經用accept='image/*'限制上傳的是圖片了，此處判斷可省略
		alert("檔案必須為圖片！"); 
		return false; 
	} 
	if(!FileReader){
		alert("你的瀏覽器不支援H5的FileReader");
		ipt.setAttribute("disabled","disabled");//瀏覽器不支援禁用input type='file'檔案上傳標籤
		return;
	}
	var fileReader = new FileReader();
	fileReader.readAsDataURL(file);//將檔案讀取為Data URL 讀取結果放在result中
	fileReader.onload = function(e){
		img_string = this.result;
	}
}

function profile(){
	var profile_data = {
		user_picture : img_string,
		user_id : getCookie("token"),
		user_school : $('#user_school').val(),
		user_age : $('#user_age').val(),
		user_hobit : $('#user_hobit').val(),
		user_nation : $('#user_nation').val(),
		user_change : $('#user_change').val(),
		user_try : $('#user_try').val()
	}
	$.ajax({
		url:"http://"+ host + port +"/api/profile",
		type: 'POST',
		data: JSON.stringify(profile_data),
		contentType : "application/json;charset=utf-8",
		success: function(){
			alerMsgThenGoToSomewhere(ProfileSucess,"./profile.html");
		}
	})
}
