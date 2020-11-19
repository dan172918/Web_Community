$(document).ready(function(){
    $(".canc").click(function(){
		$(".go_search").hide(500);
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
                                        <input class="list-group-item chat rr3" data-toggle="modal" data-target="#myModal" data-whatever="好友'+i+'號" type="button" >\
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
                $('#freindlist').prepend(SearchUsertexthtml);
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