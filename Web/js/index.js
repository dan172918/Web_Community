window.onload = function() { 
	var height = document.body.clientHeight;
	height = height*0.3;
	$(".load").css('padding-top',height);
    setTimeout(function(){
        $(".load").fadeIn(1500);
        $(".load").fadeOut(1500);
    },500)
    
    setTimeout(function(){
      $(".waitloading").css("opacity","1");
    },4000)
};

$(function(){
	$('#BackTop').click(function(){ 
		$('html,body').animate({scrollTop:0}, 333);
	});
	$(window).scroll(function() {
		if ( $(this).scrollTop() > 10 ){
			$('#BackTop').fadeIn(10);
		} else {
			$('#BackTop').stop().fadeOut(222);
		}
	}).scroll();
});

var cookcnt=0
$(document).ready(function()
{
	/*發文切換*/
	$(".post").click(function(){$("#postArticle").fadeToggle(500); });
	$("#cancel").click(function(){$("#postArticle").hide(500); });
	/*modal對話框切換*/
	/*$('#myModal').on('show.bs.modal', function (event) {
		var button = $(event.relatedTarget); // 按下訊息按鈕觸發以下事件
		var name = button.data('whatever'); // data-whatever的內容
		var modal = $(this);  //指向事件物件本身
		modal.find('.modal-title').text(name);  //更改modal-title
	});*/
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
	var articleArray="";
	/* show article */
	$.ajax({
		url: "http://"+ host + port +"/api/article",
		type: 'POST',
		data: JSON.stringify(data),
		contentType: "application/json;charset=utf-8",
		async: false,
		success: function(msg){
			setArt("ArtCnt",0);
			cookcnt=0;
			var cnt;
			for(cnt=0;cnt<msg.length;cnt++){
				console.log(msg[cnt].likes);
				if(msg[cnt].article_text && msg[cnt].article_picture)
				{
					var texthtml1 = '<section style="%%" class="article_id" id=\"'+msg[cnt].article_id+'\">\
										<div>\
											<h3 class="user_id">'+msg[cnt].user_name+'</h3>\
											<p class="article_test">'+ msg[cnt].article_text +'<br/><br/><img class="resImg" src= "'+ msg[cnt].article_picture +'"/></p>\
										</div>';
				}
				else if(msg[cnt].article_text && !msg[cnt].article_picture)
				{
					var texthtml1 = '<section style="%%" class="article_id" id=\"'+msg[cnt].article_id+'\">\
										<div>\
											<h3 class="user_id">'+msg[cnt].user_name+'</h3>\
											<p class="article_test">'+ msg[cnt].article_text +'</p>\
										</div>';
				}
				else if(!msg[cnt].article_text && msg[cnt].article_picture)
				{
					var texthtml1 = '<section style="%%" class="article_id" id=\"'+msg[cnt].article_id+'\">\
										<div>\
											<h3 class="user_id">'+msg[cnt].user_name+'</h3>\
											<p class="article_test"><br/><br/><img class="resImg" src="'+ msg[cnt].article_picture +'"/></p>\
										</div>';
				}

				if(msg[cnt].user_id == getCookie("token"))
				{
					var texthtml2 = '<div class="command"><!--文章底下-->\
											<img class="like" style="background:red" src="img/heart2.svg" alt="" width="30px" height="30px" onclick = "storelike(this)">\
											<label class="like_counter">'+msg[cnt].likes+'</label>\
											<hr/>\
											<div class="form-group row col-12 col-md-12">\
												<label for="" class="col-3 col-md-2 col-form-label command_id">'+msg[cnt].user_name+'</label>\
												<input type="text" class="col-5 col-md-6 form-control cmd" id="cmd" name="user_text" placeholder="留言..." onkeyup="StoreCmd(this,event)">\
											</div>\
											<div class="container">\
												<button type="button" class="btn btn-secondary  open" onclick = "collapse()">展開/收合</button>\
												<div class="row col-12 pdpd">\
													<div class="col-12 command_box">\
														<!--這邊放留言-->\
													</div>\
												</div>\
											</div>\
										</div>\
									</section><br>';
				}
				else if(!msg[cnt].user_id != getCookie("token"))
				{
					var texthtml2 = '<div class="command"><!--文章底下-->\
											<img class="like" src="img/heart2.svg" alt="" width="30px" height="30px" onclick = "storelike(this)">\
											<label class="like_counter">'+msg[cnt].likes+'</label>\
											<hr/>\
											<div class="form-group row col-12 col-md-12">\
												<label for="" class="col-3 col-md-2 col-form-label command_id">'+msg[cnt].user_name+'</label>\
												<input type="text" class="col-5 col-md-6 form-control cmd" id="cmd" name="user_text" placeholder="留言..." onkeyup="StoreCmd(this,event)">\
											</div>\
											<div class="container">\
												<button type="button" class="btn btn-secondary  open" onclick = "collapse(this)">展開/收合</button>\
												<div class="row col-12 pdpd">\
													<div class="col-12 command_box">\
														<!--這邊放留言-->\
													</div>\
												</div>\
											</div>\
										</div>\
									</section><br>';
				}
				var finialhtml = texthtml1+texthtml2;
				if(cnt % 2 == 0){
					var newHtml = finialhtml.replace('%%', 'background:#FFF7FB');
					$(".lib").append(newHtml);
					setArt("ArtCnt",cookcnt++);
				}else{
					var secondHtml = finialhtml.replace('%%', 'background:#ECFFFF');
					$(".lib").append(secondHtml);
					setArt("ArtCnt",cookcnt++);
				}
				if(msg.length-1 == cnt)
					articleArray+=msg[cnt].article_id;
				else
					articleArray+=msg[cnt].article_id+',';
			}

		}
	});
	var data = {
		article_id: articleArray
	}
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
	});
	
	$(window).scroll(function(){
		var totalheight = $("body").height() - $(window).height()-50;
		if($(window).scrollTop()>=totalheight)
		{
			add_article();
		}
	});
}); 

$(function(){
	$('#BackTop').click(function(){ 
		$('html,body').animate({scrollTop:0}, 333);
	});
	$(window).scroll(function() {
		if ( $(this).scrollTop() > 10 ){
			$('#BackTop').fadeIn(10);
		} else {
			$('#BackTop').stop().fadeOut(222);
		}
	}).scroll();
});

function collapse(cthis){
	console.log(cthis);
	$("#"+$(cthis).parents("section").attr("id").toString()).find(".command_box").slideToggle(500);
}

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
var like_art;

function storelike(thislike){
	//var counter = $(".like_counter").html();
	var counter = $("#"+$(thislike).parents("section").attr("id").toString()).find(".like_counter").html();
	console.log(counter);
	if(thislike.style.background=='red'){
		$("#"+$(thislike).parents("section").attr("id").toString()).find(".like").removeAttr("style");
		like_art = 0;
		counter--;
		$("#"+$(thislike).parents("section").attr("id").toString()).find(".like_counter").html(counter);
	}
	else{
		thislike.style.background='red';
		like_art = 1;
		counter++;
		$("#"+$(thislike).parents("section").attr("id").toString()).find(".like_counter").html(counter);
	}
	var like_data = {
		article_id: $(thislike).parents("section").attr("id"),
		like: like_art,
		user_id: getCookie("token")
	};
	$.ajax({
		url: "http://"+ host + port +"/api/like",
		type: 'POST',
		data: JSON.stringify(like_data),
		contentType: "application/json;charset=utf-8",
		success: function(){
		},
		error: function(xhr, ajaxOptions, thrownError){
			alertMsg(ErrorMsg);
		}
	});
}


function add_article(){
	var articleArray="";
	var data = {
		cookie_art: getCookie("ArtCnt"),
		user_id :getCookie("token")
	}

	$.ajax({
		url: "http://"+ host + port +"/api/add_article",
		type: 'POST',
		data: JSON.stringify(data),
		contentType: "application/json;charset=utf-8",
		async: false,
		success: function(add){
			//console.log(add);
			var cnt;
			for(cnt=0;cnt<add.length;cnt++){
				if(add[cnt].article_text && add[cnt].article_picture)
				{
					var texthtml1 = '<section style="%%" class="article_id" id=\"'+add[cnt].article_id+'\">\
										<div>\
											<h3 class="user_id">'+add[cnt].user_name+'</h3>\
											<p class="article_test">'+ add[cnt].article_text +'<br/><br/><img class="resImg" src= "'+ add[cnt].article_picture +'"/></p>\
										</div>';
				}
				else if(add[cnt].article_text && !add[cnt].article_picture)
				{
					var texthtml1 = '<section style="%%" class="article_id" id=\"'+add[cnt].article_id+'\">\
										<div>\
											<h3 class="user_id">'+add[cnt].user_name+'</h3>\
											<p class="article_test">'+ add[cnt].article_text +'</p>\
										</div>';
				}
				else if(!add[cnt].article_text && add[cnt].article_picture)
				{
					var texthtml1 = '<section style="%%" class="article_id" id=\"'+add[cnt].article_id+'\">\
										<div>\
											<h3 class="user_id">'+add[cnt].user_name+'</h3>\
											<p class="article_test"><br/><br/><img class="resImg" src="'+ add[cnt].article_picture +'"/></p>\
										</div>';
				}

				if(add[cnt].like_id)
				{
					var texthtml2 = '<div class="command"><!--文章底下-->\
											<img class="like" style="background:red" src="img/heart2.svg" alt="" width="30px" height="30px" onclick = "storelike(this)">\
											<label class="like_counter">'+add[cnt].likes+'</label>\
											<hr/>\
											<div class="form-group row col-12 col-md-12">\
												<label for="" class="col-3 col-md-2 col-form-label command_id">'+add[cnt].user_name+'</label>\
												<input type="text" class="col-5 col-md-6 form-control cmd" id="cmd" name="user_text" placeholder="留言..." onkeyup="StoreCmd(this,event)">\
											</div>\
											<div class="container">\
												<button type="button" class="btn btn-secondary  open" onclick = "collapse()">展開/收合</button>\
												<div class="row col-12 pdpd">\
													<div class="col-12 command_box">\
														<!--這邊放留言-->\
													</div>\
												</div>\
											</div>\
										</div>\
									</section><br>';
				}
				else if(!add[cnt].like_id)
				{
					var texthtml2 = '<div class="command"><!--文章底下-->\
											<img class="like" src="img/heart2.svg" alt="" width="30px" height="30px" onclick = "storelike(this)">\
											<label class="like_counter">'+add[cnt].likes+'</label>\
											<hr/>\
											<div class="form-group row col-12 col-md-12">\
												<label for="" class="col-3 col-md-2 col-form-label command_id">'+add[cnt].user_name+'</label>\
												<input type="text" class="col-5 col-md-6 form-control cmd" id="cmd" name="user_text" placeholder="留言..." onkeyup="StoreCmd(this,event)">\
											</div>\
											<div class="container">\
												<button type="button" class="btn btn-secondary  open" onclick = "collapse()">展開/收合</button>\
												<div class="row col-12 pdpd">\
													<div class="col-12 command_box">\
														<!--這邊放留言-->\
													</div>\
												</div>\
											</div>\
										</div>\
									</section><br>';
				}
				var finialhtml = texthtml1+texthtml2;
				if(cnt % 2 == 0){
					var newHtml = finialhtml.replace('%%', 'background:#FFF7FB');
					$(".lib").append(newHtml);
					setArt("ArtCnt",cookcnt++);
				}else{
					var secondHtml = finialhtml.replace('%%', 'background:#ECFFFF');
					$(".lib").append(secondHtml);
					setArt("ArtCnt",cookcnt++);
				}
				if(add.length-1 ==cnt)
					articleArray+=add[cnt].article_id;
				else
					articleArray+=add[cnt].article_id+',';
			}

		}
	});
	console.log(articleArray);
	var data = {
		article_id: articleArray
	}
	$.ajax({
		url: "http://"+ host + port +"/api/take_command",
		type: 'POST',
		data: JSON.stringify(data),
		contentType: "application/json;charset=utf-8",
		success: function(add_comd){
			var cnt1;
			for(cnt1=0;cnt1<add_comd.length;cnt1++){
				var texthtml1 = '<p class="command_user">'+add_comd[cnt1].user_name+'\
									<span class="command_line">'+add_comd[cnt1].user_command+'\
									</span>\
								</p>';
				$("#"+add_comd[cnt1].article_id.toString()).find(".command_box").prepend(texthtml1);
			}
		}
	});
}


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
		img_string = this.result
	}
}




/*store article and reload index.html*/
function article(){
	if($('#Article').val() == '' && $('#picInput').val() == ''){
		alertMsg(NullPost);
	}
	else{
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
