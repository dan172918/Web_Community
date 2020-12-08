$(document).ready(function(){
    var data = {
		user_id :getCookie("token")
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
    $.ajax({
		url: "http://"+ host + port +"/api/showCardFriend",
		type: 'POST',
		data: JSON.stringify(data),
		contentType: "application/json;charset=utf-8",
		success: function(msg){
			if(msg == "tryAgain"){
				$('.pcard').empty();
				$('.pcard').append('<h2 class="uName">目前沒有合適您的新卡友</h2>\
									<h2 class="uName">系統將會盡快為您處理</h2>\
									<h2 class="uName">請耐心等待!</h2>')
			}
			else{
				$('.user_name').text(msg[0].user_name);
				$('.user_pic').attr('src',msg[0].user_picture);
				$('.invite').attr('data-whatever',getCookie("token")+" "+msg[0].user_id);
				$('.lft').attr('data-whatever',msg[0].chat_id+" "+msg[0].user_id+" "+msg[0].user_name);
			}
		}
    });
});

$('.invite').on('show.bs.modal', function (event) {
    var button = $(event.relatedTarget)
    var recipient = button.data('whatever')
    recipient = recipient.split(' ');
    var modal = $(this);
    var data={
		u_id :getCookie("token"),
		f_id :recipient[1]
    };
    $.ajax({
        url : "http://"+ host + port +"/api/inviteCardFriend",
        type : 'POST',
        data : JSON.stringify(data),
        contentType : "application/json;charset=utf-8",
        error: function(xhr, ajaxOptions, thrownError) {
            console.log(xhr.responseText);
        }
    });
})

function scrool(){
    setTimeout(function(){
        $(".box").scrollTop($(".box")[0].scrollHeight); 
    },700);
};

$('#pickModal').on('hide.bs.modal',function(){
    $('.box').empty();
});

$('#pickModal').on('show.bs.modal', function (event) {
    var button = $(event.relatedTarget)
    var recipient = button.data('whatever')
    recipient = recipient.split(' ');
    var modal = $(this);
    modal.find('.modal-content').attr("id",recipient[0]);
    modal.find('.modal-title').attr("id",recipient[1]);
    modal.find('.modal-title').text(recipient[2]); 
    var data={
        chat_id : recipient[0]
    };
    $.ajax({
        url : "http://"+ host + port +"/api/loadMsg",
        type : 'POST',
        data : JSON.stringify(data),
        contentType : "application/json;charset=utf-8",
        success: function(msg) {
            var i;
            for(i=0;i<msg.length;i++){
                var textMsg = '<div class="msg"><span class="name">'+msg[i].chat_name+' : </span>'+msg[i].chat_text+'</div>';
                $(".box").prepend(textMsg);
            }
        },
        error: function(xhr, ajaxOptions, thrownError) {
            console.log(xhr.responseText);
        }
    });
})

var socket = io('http://34.105.17.84:3000');
socket.on("connect", function () {
    var formData = {};
    formData["user_id"] = getCookie("token");
    formData["user_name"] = $("#user_name").text();
    socket.emit("testConnect",formData);
});

socket.on("msg", function (d) {
    if(d.chat_id == $('#pickModal').find('.modal-content').attr("id"))
    {
        var msgBox = document.createElement("div")
            msgBox.className = "msg";
        var nameBox = document.createElement("span");
            nameBox.className = "name";
        var name = document.createTextNode(d.user_name+" : ");
        var msg = document.createTextNode(d.Msg);

        nameBox.appendChild(name);
        msgBox.appendChild(nameBox);
        msgBox.appendChild(msg);
        $(".box").append(msgBox);
    }
});

$('#sendMsg').click(function (event) {
    sameCode(event);   
});
$("#inputMsg").keyup(function(event){
    if(event.keyCode == 13 || event.which == 13){
        var command_val = $("#inputMsg").val();
        if(command_val !== ''){
            sameCode(event);  
        }
    }
});
function sameCode(event){
    var ok = true;
    event.preventDefault();
    var formData = {};
    if($('#inputMsg').val().replace(/\r\n|\n/g,"") =="")
    {
        $("#errorMsg").css("display","block");
        $("#inputMsg").val("");
    }
    else{
        $("#errorMsg").css("display","none");
        formData["chat_id"] = $('#pickModal').find('.modal-content').attr("id");
        formData["user_id"] = getCookie("token");
        formData["user_name"] = $("#user_name").text();
        formData["Msg"] = $('#inputMsg').val().replace(/\r\n|\n/g,"");
        $(".box").scrollTop($(".box")[0].scrollHeight);
        $("#inputMsg").val("");
        socket.emit("send", formData);
    }
}