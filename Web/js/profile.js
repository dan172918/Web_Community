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

  	/*---已修改資料送出後，先存回資料庫，再從資料庫把值撈回來顯示---*/
  	/*$("#sure").click(function()
  	{
  		var School=$("#school").html();
		$("#s").html(School);
  	});*/
});

function profile(){
	var profile_data = {
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
