$(document).ready(function(){
    $(".canc").click(function(){
		$(".go_search").hide(500);
    });
    var data1 = {
		user_id :getCookie("token")
	}
    $.ajax({
		url: "http://"+ host + port +"/api/username",
		type: 'POST',
		data: JSON.stringify(data1),
		contentType: "application/json;charset=utf-8",
		success: function(name){
			$('#user_name').text(name[0].user_name);
		}
	});
    var data={
        u_id :getCookie("token")
    };
    $.ajax({
        url : "http://"+ host + port +"/api/loadFriendlist",
        type : 'POST',
        data : JSON.stringify(data),
        contentType : "application/json;charset=utf-8",
        success: function(msg) {
            var i;
            for(i=0;i<msg.length;i++){
                var texthtml = '<div class="row" id=\"'+msg[i].user_id+'\">\
                                    <div class="col-sm-2 col-md-2 col-3">\
                                        <img src="img/user.svg" class="img-circle" width="60px">\
                                    </div>\
                                    <div class="col-sm-8 col-md-8 col-4">\
                                        <h4><a href="#" id = "FriendName">' + msg[i].user_name + '</a></h4>\
                                        <br><br>\
                                    </div>\
                                    <div class="col-sm-2 col-md-2 col-5">\
                                        <input class="list-group-item chat rr3" data-toggle="modal" data-target="#myModal" data-whatever=\"'+msg[i].chat_id+" "+msg[i].user_id+" "+msg[i].user_name+'\" type="button">\
                                        <input class="chat rr4" type="button" >\
                                    </div>\
                                </div>'
                $('#freindlist').prepend(texthtml);
            }
        },
        error: function(xhr, ajaxOptions, thrownError) {
            console.log(xhr.responseText);
        }
    });
    showinviteFunc();

});

/*顯示交友邀請*/
function showinviteFunc(){
    var data={
        u_id :getCookie("token")
    };
    $.ajax({
        url : "http://"+ host + port +"/api/showinvite",
        type : 'POST',
        data : JSON.stringify(data),
        contentType : "application/json;charset=utf-8",
        success: function(msg) {    
            var i;
            for(i=0;i<msg.length;i++){
                var texthtml = '<div class="row" id=\"'+msg[i].user_id+'\">\
                                    <div class="col-md-2 col-sm-2 col-3">\
                                        <img src="img/user.svg" class="img-circle" width="60px">\
                                    </div>\
                                    <div class="col-md-8 col-sm-8 col-4">\
                                        <h4><a href="#" id = "FriendName">' + msg[i].user_name + '</a></h4>\
                                        <br><br>\
                                    </div>\
                                    <div class="col-md-2 col-sm-2 col-5">\
                                        <input class="chat rr1" type="button" onclick="acceptFriend(this)">\
                                        <input class="chat rr2" type="button" onclick="rejectFriend(this)">\
                                    </div>\
                                </div> ';
                $('#showInvite').prepend(texthtml);
            }
            if(msg.length > 0)
                $("#friendinvite").css("display","block");
        }
    });
}
/*接受邀請*/
function acceptFriend(thisFriend){
    var data={
        u_id :getCookie("token"),
        f_id :$(thisFriend).closest(".row").attr("id")
    };
    $.ajax({
        url : "http://"+ host + port +"/api/acceptFriend",
        type : 'POST',
        data : JSON.stringify(data),
        contentType : "application/json;charset=utf-8",
        success: function(msg) {
            if(msg = "success"){
                alertMsg(finishAddFriend);
                var SearchUsertexthtml = '<div class="row" id=\"'+$(thisFriend).closest(".row").attr("id")+'\">\
                                            <div class="col-md-2 col-sm-2 col-3">\
                                                <img src="img/user.svg" class="img-circle" width="60px">\
                                            </div>\
                                            <div class="col-md-8 col-sm-8 col-4">\
                                                <h4><a href="#" id = "FriendName">' + $(thisFriend).closest(".row").find(FriendName).text() + '</a></h4>\
                                                <br><br>\
                                            </div>\
                                        </div>';
                $('#showSearch').prepend(SearchUsertexthtml);
                $(thisFriend).closest(".row").remove();
                if($('#showInvite').html()==null || $('#showInvite').html().length==0)
                    $("#friendinvite").css("display","none");
                
            }
            else{
                alertMsg(addFriendError);
            }   
        },
        error: function(xhr, ajaxOptions, thrownError) {
            console.log(xhr.responseText);
        }
    });
}
/*拒絕邀請*/
function rejectFriend(thisFriend){
    var data={
        u_id :getCookie("token"),
        f_id :$(thisFriend).closest(".row").attr("id")
    };
    $.ajax({
        url : "http://"+ host + port +"/api/rejectFriend",
        type : 'POST',
        data : JSON.stringify(data),
        contentType : "application/json;charset=utf-8",
        success: function(msg) {
            if(msg = "success"){
                $(thisFriend).closest(".row").remove();
                if($('#showInvite').html()==null || $('#showInvite').html().length==0)
                    $("#friendinvite").css("display","none");
            }
            else{
                alertMsg(rejectError);
            }   
        },
        error: function(xhr, ajaxOptions, thrownError) {
            console.log(xhr.responseText);
        }
    });
}
/*搜尋好友*/
function SearchUser(){
    $('#showSearch').empty();
    if($('#scrh').val()!=""){
        var data={
            u_id :getCookie("token"),
            user_name :$('#scrh').val()
        }
        $.ajax({
            url : "http://"+ host + port +"/api/SearchFriend",
            type : 'POST',
            data : JSON.stringify(data),
            contentType : "application/json;charset=utf-8",
            success: function(msg) {
                var i;
                for(i=0;i<msg.length;i++){
                    if(msg[i].relation == 0 || msg[i].user_id == getCookie("token")){
                        var SearchUsertexthtml = '<div class="row" id=\"'+msg[i].user_id+'\">\
                                                <div class="col-md-2 col-sm-2 col-3">\
                                                    <img src="img/user.svg" class="img-circle" width="60px">\
                                                </div>\
                                                <div class="col-md-8 col-sm-8 col-4">\
                                                    <h4><a href="#" id = "FriendName">' + msg[i].user_name + '</a></h4>\
                                                    <br><br>\
                                                </div>\
                                            </div>';
                        $('#showSearch').prepend(SearchUsertexthtml);
                    }
                    else if(msg[i].relation == 1){
                        var SearchUsertexthtml = '<div class="row" id=\"'+msg[i].user_id+'\">\
                                                    <div class="col-md-2 col-sm-2 col-3">\
                                                        <img src="img/user.svg" class="img-circle" width="60px">\
                                                    </div>\
                                                    <div class="col-md-8 col-sm-8 col-4">\
                                                        <h4><a href="#" id = "FriendName">' + msg[i].user_name + '</a></h4>\
                                                        <br><br>\
                                                    </div>\
                                                    <div class="col-md-2 col-sm-2 col-5">\
                                                        <h3>等待接收邀請</h3>\
                                                    </div>\
                                                </div>';
                        $('#showSearch').prepend(SearchUsertexthtml);
                    }
                    else{
                        var SearchUsertexthtml = '<div class="row" id=\"'+msg[i].user_id+'\">\
                                                    <div class="col-md-2 col-sm-2 col-3">\
                                                        <img src="img/user.svg" class="img-circle" width="60px">\
                                                    </div>\
                                                    <div class="col-md-8 col-sm-8 col-4">\
                                                        <h4><a href="#" id = "FriendName">' + msg[i].user_name + '</a></h4>\
                                                        <br><br>\
                                                    </div>\
                                                    <div class="col-md-2 col-sm-2 col-5">\
                                                        <input class="chat rr1" type="button" onclick="inviteFriend(this)">\
                                                    </div>\
                                                </div>';
                        $('#showSearch').append(SearchUsertexthtml);
                    }
                    
                }
            },
            error: function(xhr, ajaxOptions, thrownError) {
                console.log(xhr.responseText);
            }
        });
        $(".go_search").css("display","block");
    }
}
/* 好友邀請 */
function inviteFriend(invite){
    var data={
        u_id :getCookie("token"),
        f_id :$(invite).closest(".row").attr("id")
    }
    $.ajax({
        url : "http://"+ host + port +"/api/inviteFriend",
        type : 'POST',
        data : JSON.stringify(data),
        contentType : "application/json;charset=utf-8",
        success: function(msg) {
            if(msg = "success"){
                alertMsg(inviteSuccess);
                $(invite).closest(".row").remove();
                if($('#showSearch').html()==null || $('#showSearch').html().length==0)
                    $(".go_search").css("display","none");
            }
            else{
                alertMsg(inviteError);
            }
        },
        error: function(xhr, ajaxOptions, thrownError) {
            console.log(xhr.responseText);
        }
    });
}

function scrool(){
    setTimeout(function(){
        $(".box").scrollTop($(".box")[0].scrollHeight); 
    },500);
};

$('#myModal').on('show.bs.modal', function (event) {
    $('.box').empty();
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
                var msgBox = document.createElement("div")
                    msgBox.className = "msg";
                var nameBox = document.createElement("span");
                    nameBox.className = "name";
                var name = document.createTextNode(msg[i].chat_name+" : ");
                var msg = document.createTextNode(msg[i].chat_text+" "+msg[i].chat_time);

                nameBox.appendChild(name);
                msgBox.appendChild(nameBox);
                msgBox.appendChild(msg);
                $(".box").prepend(msgBox);
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
    if(d.chat_id == $('#myModal').find('.modal-content').attr("id"))
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
        formData["chat_id"] = $('#myModal').find('.modal-content').attr("id");
        formData["user_id"] = getCookie("token");
        formData["user_name"] = $("#user_name").text();
        formData["Msg"] = $('#inputMsg').val().replace(/\r\n|\n/g,"");
        $(".box").scrollTop($(".box")[0].scrollHeight);
        $("#inputMsg").val("");
        socket.emit("send", formData);
    }
}
