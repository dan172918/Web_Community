$(document).ready(function()
{
	/*發文切換*/
	$(".post").click(function(){$("#postArticle").fadeToggle(500); });
	$("#cancel").click(function(){$("#postArticle").hide(500); });
	/*留言展開收合(之後會根據article_id來分別做收合)*/
	$(".open").click(function(){$(".command_box").slideToggle(500);});
	/*modal對話框切換*/
	$('#myModal').on('show.bs.modal', function (event) {
		var button = $(event.relatedTarget); // 按下訊息按鈕觸發以下事件
		var name = button.data('whatever'); // data-whatever的內容
		var modal = $(this);  //指向事件物件本身
		modal.find('.modal-title').text(name);  //更改modal-title
	});
	/*好友搜尋展示*/
	$(".goSearch").click(function(){
		if($("#scrh").val() !== '')
			$(".go_search").css("display","block");
	});
	$(".canc").click(function(){
		$(".go_search").hide(500);
	});	  
	
	var data = {
		user_id :getCookie("token")
	}
	/* show article */
	$.ajax({
		url: "http://"+ host + port +"/api/article",
		type: 'POST',
		data: JSON.stringify(data),
		contentType: "application/json;charset=utf-8",
		async: false,
		success: function(msg){
			var cnt;
			for(cnt=0;cnt<msg.length;cnt++){
				if(msg[cnt].article_text!=="" && msg[cnt].article_picture!== "")
				{
					var texthtml = '<section style="%%" class="article_id" id=\"'+msg[cnt].article_id+'\">\
										<div>\
											<h3 class="user_id">'+msg[cnt].user_name+'</h3>\
											<p class="article_test">'+ msg[cnt].article_text +'<br/><br/><img style="width:700px;height:450px;" src= "data:image/png;base64,'+ msg[cnt].article_picture +'"/></p>\
										</div>\
										<div class="command"><!--文章底下-->\
											<img class="like" src="img/heart2.svg" alt="" width="30px" height="30px">\
											<label class="like_counter">0</label>\
											<hr/>\
											<div class="form-group row col-12 col-md-12">\
												<label for="" class="col-3 col-md-2 col-form-label command_id">我</label>\
												<input type="text" class="col-5 col-md-6 form-control cmd" id="cmd" name="user_text" placeholder="留言..." onkeyup="StoreCmd(this,event)">\
											<!--upload pic、video-->\
												<input id="picInput" type="file" class="form-control upload" accept="image/*">\
												<label for="picInput" class="col-2 col-md-1 ">\
													<img src="img/pic.svg" alt="" width="35px" height="35px">\
												</label>\
												<input id="videoInput" type="file" class="form-control upload" accept="audio/*,video/*">\
												<label for="videoInput" class="col-2 col-md-1">\
													<img src="img/video.svg" alt="" width="35px" height="35px">\
												</label>\
											</div>\
											<div class="container">\
												<button type="button" class="btn btn-secondary  open">展開/收合</button>\
												<div class="row col-12 pdpd">\
													<div class="col-12 command_box">\
														<!--這邊放留言-->\
													</div>\
												</div>\
											</div>\
										</div>\
									</section><br>';
				}
				else if(msg[cnt].article_text!=="" && msg[cnt].article_picture == "")
				{
					var texthtml = '<section style="%%" class="article_id" id=\"'+msg[cnt].article_id+'\">\
										<div>\
											<h3 class="user_id">'+msg[cnt].user_name+'</h3>\
											<p class="article_test">'+ msg[cnt].article_text +'</p>\
										</div>\
										<div class="command"><!--文章底下-->\
											<img class="like" src="img/heart2.svg" alt="" width="30px" height="30px">\
											<label class="like_counter">0</label>\
											<hr/>\
											<div class="form-group row col-12 col-md-12">\
												<label for="" class="col-3 col-md-2 col-form-label command_id">我</label>\
												<input type="text" class="col-5 col-md-6 form-control cmd" id="cmd" name="user_text" placeholder="留言..." onkeyup="StoreCmd(this,event)">\
											<!--upload pic、video-->\
												<input id="picInput" type="file" class="form-control upload" accept="image/*">\
												<label for="picInput" class="col-2 col-md-1 ">\
													<img src="img/pic.svg" alt="" width="35px" height="35px">\
												</label>\
												<input id="videoInput" type="file" class="form-control upload" accept="audio/*,video/*">\
												<label for="videoInput" class="col-2 col-md-1">\
													<img src="img/video.svg" alt="" width="35px" height="35px">\
												</label>\
											</div>\
											<div class="container">\
												<button type="button" class="btn btn-secondary  open">展開/收合</button>\
												<div class="row col-12 pdpd">\
													<div class="col-12 command_box">\
														<!--這邊放留言-->\
													</div>\
												</div>\
											</div>\
										</div>\
									</section><br>';
				}
				else if(msg[cnt].article_text == "" && msg[cnt].article_picture !== "")
				{
					var texthtml = '<section style="%%" class="article_id" id=\"'+msg[cnt].article_id+'\">\
										<div>\
											<h3 class="user_id">'+msg[cnt].user_name+'</h3>\
											<p class="article_test"><br/><br/><img style="width:700px;height:450px;" src=data:image/png;base64'+ msg[cnt].article_picture +'/></p>\
										</div>\
										<div class="command"><!--文章底下-->\
											<img class="like" src="img/heart2.svg" alt="" width="30px" height="30px">\
											<label class="like_counter">0</label>\
											<hr/>\
											<div class="form-group row col-12 col-md-12">\
												<label for="" class="col-3 col-md-2 col-form-label command_id">我</label>\
												<input type="text" class="col-5 col-md-6 form-control cmd" id="cmd" name="user_text" placeholder="留言..." onkeyup="StoreCmd(this,event)">\
											<!--upload pic、video-->\
												<input id="picInput" type="file" class="form-control upload" accept="image/*">\
												<label for="picInput" class="col-2 col-md-1 ">\
													<img src="img/pic.svg" alt="" width="35px" height="35px">\
												</label>\
												<input id="videoInput" type="file" class="form-control upload" accept="audio/*,video/*">\
												<label for="videoInput" class="col-2 col-md-1">\
													<img src="img/video.svg" alt="" width="35px" height="35px">\
												</label>\
											</div>\
											<div class="container">\
												<button type="button" class="btn btn-secondary  open">展開/收合</button>\
												<div class="row col-12 pdpd">\
													<div class="col-12 command_box">\
														<!--這邊放留言-->\
													</div>\
												</div>\
											</div>\
										</div>\
									</section><br>';
				}
				if(msg[cnt].article_id % 2 == 0){
					var newHtml = texthtml.replace('%%', 'background:#FFF7FB');
					$(".lib").append(newHtml);
					//判斷愛心
				}else{
					var secondHtml = texthtml.replace('%%', 'background:#ECFFFF');
					$(".lib").append(secondHtml);
					//判斷愛心
				}
			}
		}
	});
	
	$.ajax({
		url: "http://"+ host + port +"/api/take_command",
		type: 'POST',
		data: JSON.stringify(data),
		contentType: "application/json;charset=utf-8",
		success: function(comd){
			var cnt1;
			for(cnt1=0;cnt1<comd.length;cnt1++){
				var texthtml1 = '<p class="command_user">'+comd[cnt1].user_name+'\
									<span class="command_line">'+comd[cnt1].user_command+'\
									</span>\
								</p>';
				$("#"+comd[cnt1].article_id.toString()).find(".command_box").prepend(texthtml1);
			}
		}
	});

	$.ajax({
		url: "http://"+ host + port +"/api/username",
		type: 'POST',
		data: JSON.stringify(data),
		contentType: "application/json;charset=utf-8",
		success: function(name){
			$('#user_name').text(name[0].user_name);
		}
	})
}); 

function StoreCmd(thiscmd,event){
	if(event.keyCode == 13 || event.which == 13){
		var command_val = $(thiscmd).val();
		if(command_val !== ''){
			var command_data = {
				article_id: $(thiscmd).parents("section").attr("id"),
				user_id: getCookie("token"),
				command_text: command_val
			};
			var texthtml1 = '<p class="command_user">'+$("#user_name").text()+'\
								<span class="command_line">'+command_val+'\
								</span>\
							</p>';
			$("#"+$(thiscmd).parents("section").attr("id").toString()).find(".command_box").prepend(texthtml1);
			$("#"+$(thiscmd).parents("section").attr("id").toString()).find("#cmd").val("");
			$.ajax({
				url: "http://"+ host + port +"/api/command",
				type: 'POST',
				data: JSON.stringify(command_data),
				contentType: "application/json;charset=utf-8",
				success: function(msg){
				},
				error: function(xhr, ajaxOptions, thrownError){
					alertMsg(ErrorMsg);
				}
			});

		}
	}
};

/*---------------------------like功能---------------------------------*/
/*var likes = 'trigger';
var counter = $(".like_counter").html().trim();	

$(document).ready(function(){   
	$(".like").click(function(){
		if(likes == 'trigger'){
			$(".like").addClass("red");
			counter++;
			$(".like_counter").html(counter);
			likes = 'unTrigger';
		}else if(likes == 'unTrigger'){
			$(".like").removeClass("red");
			counter--;
			$(".like_counter").html(counter);
			likes = 'trigger';
		}	 
	});
});*/
/*---------------------------------留言顯示------------------------------*/
/*$(document).ready(function(){  //之後要跟著文章id和留言id去做控制(不同文章的留言互不影響)，並且要把留言存入資料庫(打撈、刪除)
	document.addEventListener('keypress', function(event){
		if(event.keyCode === 13 || event.which === 13){ //which能兼容舊版瀏覽器
			var inputText = $(".cmd").val();
			var inputName = $(".command_id").html();
			if(inputText !== ""){
				var html = '<p class="command_user">%user%<span class="command_line">%command%</span><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></p><hr/>';
				var newHtml = html.replace('%command%', inputText);
				newHtml = newHtml.replace('%user%', inputName);
				$(".command_box").append(newHtml);

				var all_Inputs = $("input[type=text]");
				all_Inputs.val("");	
			}
		}
	});
});*/
/*---------------------------------貼文顯示 & like功能------------------------------*/
/*
var artid = 0;
$(document).ready(function(){  
	$("#user_Post").click(function(){
			var likes = 'trigger';
			var counter = $(".like_counter").html().trim();	
   
			$(".like").click(function(){
				if(likes == 'trigger'){
					$(".like").addClass("red");
					counter++;
					$(".like_counter").html(counter);
					likes = 'unTrigger';
				}else if(likes == 'unTrigger'){
					$(".like").removeClass("red");
					counter--;
					$(".like_counter").html(counter);
					likes = 'trigger';
				}	 
			});
		}
	});


});
*/
var img_string="";
var imgCont = document.getElementById("showImg"); 
var ipt = document.getElementById("#picInput"); 
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
		//var img = new Image,
		var img = '<img src="'+this.result+'"width=250px; height=250px;/>';
		imgCont.innerHTML = img;
		img_string = this.result.replace("data:image/jpeg;base64,","");
	}
}


/*store article and reload index.html*/
function article(){
	if($('#Article').val() == '' && $('#picInput').val() == '' && $('#videoInput').val() == ''){
		alertMsg(NullPost);
	}
	else if($('#Article').val() !== ''){
		var post_data = {
			user_id : getCookie("token"),
			post_level : '0',
			article_text : $('#Article').val(),
			article_pic : img_string
		};
		console.log(post_data.article_pic);
		$.ajax({
			url: "http://"+ host + port +"/api/index",
			type: 'POST',
			data: JSON.stringify(post_data),
			contentType: "application/json;charset=utf-8",
			success: function(msg){
				if(msg=="success")
					location.reload();
				else
					alertMsgThenGoToSomewhere(FailedPost, "./index.html")
			},
			error: function(xhr, ajaxOptions, thrownError){
				alertMsg(ErrorMsg);
			}
		});
	}
};

