// const { getCiphers } = require("crypto");

/*window.onload = function() { 
    setTimeout(function(){
        $(".load").fadeIn(1500);
        $(".load").fadeOut(1500);
    },500)
    
    setTimeout(function(){
      $(".waitloading").css("opacity","1");
    },4000)
};*/

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

$(".groupaddbox").click(() => {
	// if($(".groupbox").val() !== "")
		swal("創建成功!", "快邀請朋友加入你的社團吧", "success");
});

var select_glp;
function selectgid(){
	select_glp = $('#grpSelect').val();
	$(".lib").html("");
	$('#show_mem').empty();
	var data = {
		user_id :getCookie("token"),
		group_id :select_glp
	}
	/* show article */
	$.ajax({
		url: "http://"+ host + port +"/api/glparticle",
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

				if(msg[cnt].like_id)
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
				else if(!msg[cnt].like_id)
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
			}

		}
	});

	$.ajax({
		url: "http://"+ host + port +"/api/show_group_member",
		type: 'POST',
		data: JSON.stringify(data),
		contentType: "application/json;charset=utf-8",
		success: function(glpmem){
			console.log(glpmem);
			var cnt1;
			var texthtml1 = '<div class="card group-result">\
								<div class="card-header bg-info" id="headingOne">\
									<div class="row justify-content-end">\
										<h4 class="mb-0 col-6">\
											<button class="btn btn-info btn-title" id="group_name" type="button" data-toggle="collapse" data-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">\
												<div class="tmpclass">'+ glpmem[0].club_name +'\
												</div>\
											</button>\
										</h4>\
									</div>\
								</div>\
								<div id="collapseOne" class="collapse show" aria-labelledby="headingOne" data-parent="#accordionExample">\
									<div class="card-body card-pd">\
										<ul class="list-group list-group-flush">';
			for(cnt1=0;cnt1<glpmem.length;cnt1++){
				var tmp = '<li class="list-group-item"><i class="fas fa-user"></i>'+ glpmem[cnt1].user_name +'</li>';
				var texthtml1;
				texthtml1 += tmp;
			}
			var texthtml2 = '</ul>\
						</div>\
					</div>\
				</div>';
			var finaltexthtml = texthtml1 + texthtml2;
			$("#show_mem").append(finaltexthtml);
			$(".showgroup").show();
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
	});
}

$(document).ready(function()
{
	var uid={
		user_id :getCookie("token")
	}
	/*有哪些社團*/
	$.ajax({
		url: "http://"+ host + port +"/api/groups",
		type: 'POST',
		data: JSON.stringify(uid),
		contentType: "application/json;charset=utf-8",
		success: function(glps){
			var i;
			console.log(glps);
			for(i=0;i<glps.length;i++)
			{
				var group_form = '<option value=\"'+ glps[i].club_id +'\">'+ glps[i].club_name +'</option>';
				$('#grpSelect').append(group_form);
				console.log(glps[i].club_id,glps[i].club_name);
			}
			//console.log(glps[0].club_id,glps[0].club_name);
		}
	});
	$(".plusgroup").click(function(){$(".showgroup").hide(500);});
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
		user_id :getCookie("token"),
		group_id :select_glp
	}

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
		var totalheight = $("body").height() - $(window).height();
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
	var data = {
		group_id :select_glp,
		cookie_art: getCookie("ArtCnt"),
		user_id :getCookie("token")
	}

	$.ajax({
		url: "http://"+ host + port +"/api/add_glparticle",
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
			}

		}
	});
	
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
var ipt = document.getElementById("#glppic"); 
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

function glparticle(){
	if($('#Article').val() == '' && $('#glppic').val() == ''){
		alertMsg(NullPost);
	}
	else{
		var post_data = {
            group_id : select_glp,
			user_id : getCookie("token"),
			post_level : '2',
			article_text : $('#Article').val(),
			article_pic : img_string
		};
		console.log(post_data);
		$.ajax({
			url: "http://"+ host + port +"/api/glpindex",
			type: 'POST',
			data: JSON.stringify(post_data),
			contentType: "application/json;charset=utf-8",
			success: function(msg){
				if(msg == "success")
				{
					$('#Article').html("");
					$('#plusbutton').hide(500);
				}
			},
			error: function(xhr, ajaxOptions, thrownError){
				alertMsg(ErrorMsg);
			}
		});
	}
};

function SearchUser(){
	$(".showgroup").show();
}

function Searchgroup(_this){
	$('#show_mem').empty();
	$(".showgroup").show();
    if($(_this).prev('#scrh').val()!=""){
        var data={
			group_name :$(_this).prev('#scrh').val(),
			user_id :getCookie("token")
		}
		console.log(data.group_name);
		$.ajax({
            url : "http://"+ host + port +"/api/SearchGroup",
            type : 'POST',
            data : JSON.stringify(data),
            contentType : "application/json;charset=utf-8",
            success: function(msg){
				console.log(msg);
				if(msg)
				var i,tmp=0;
				for(i=0;i<msg.length;i++)
				{
					if(msg[i].user_id == getCookie("token"))
					{
						var gname = '<div class="card group-result">\
										<div class="card-header bg-info" id="headingOne">\
											<div class="row justify-content-end">\
												<h4 class="mb-0 col-6">\
													<button class="btn btn-info btn-title" id="group_name" type="button" data-toggle="collapse" data-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">\
														<div class="tmpclass" id='+ msg[0].club_id +'>'+ msg[0].club_name +'\
														</div>\
													</button>\
												</h4>\
												<div class="col-3">\
													<button type="button" id="plus" class="btn btn-info plusgroup" onclick="addgroup(this);"><i class="fas fa-plus add-pr"></i></button>\
												</div>\
											</div>\
										</div>\
									</div>';
						tmp=1;
						$('#plus').css("visibility","hidden");
						break;
					}
				}
				if(tmp==0)
				{
					var gname = '<div class="card group-result">\
									<div class="card-header bg-info" id="headingOne">\
										<div class="row justify-content-end">\
											<h4 class="mb-0 col-6">\
												<button class="btn btn-info btn-title" id="group_name" type="button" data-toggle="collapse" data-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">\
													<div class="tmpclass" id='+ msg[0].club_id +'>'+ msg[0].club_name +'\
													</div>\
												</button>\
											</h4>\
											<div class="col-3">\
												<button type="button" id="plus" class="btn btn-info plusgroup" onclick="addgroup(this);"><i class="fas fa-plus add-pr"></i></button>\
											</div>\
										</div>\
									</div>\
								</div>'
				}
				$('#show_mem').append(gname);
			}
		});
	}
}

function addgroup(_this){
	var data={
		group_id :$('#group_name').children('.tmpclass').attr('id'),
		user_id :getCookie("token")
	}
	$.ajax({
		url : "http://"+ host + port +"/api/PlusGroup",
		type : 'POST',
		data : JSON.stringify(data),
		contentType : "application/json;charset=utf-8",
		success: function(msg){
		}
	});
}

function Creategroup(){
	var data={
		group_name :$('#creategroup').val(),
		user_id :getCookie("token")
	}
	console.log(data.group_name);
	$.ajax({
		url : "http://"+ host + port +"/api/chickgroups",
		type : 'POST',
		contentType : "application/json;charset=utf-8",
		success: function(chick){
			var i,tmp=0;
			for(i=0;i<chick.length;i++)
			{
				if(chick[i].group_name == data.group_name)
				{
					alert("這個名稱有人用過囉");
					tmp=1;
					break;
				}
			}
		}
	});
	if(tmp == 0)
	{
		$.ajax({
			url : "http://"+ host + port +"/api/creategroup",
			type : 'POST',
			data : JSON.stringify(data),
			contentType : "application/json;charset=utf-8",
			success: function(msg){
			}
		});
	}
}