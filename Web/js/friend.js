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
                                        <h4><a href="#">' + msg[i].user_name + '</a></h4>\
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
            alertMsg(postError);
        }
    });

});

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
                                                    <h4><a href="#">' + msg[i].user_name + '</a></h4>\
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
                                                        <h4><a href="#">' + msg[i].user_name + '</a></h4>\
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
                                                        <h4><a href="#">' + msg[i].user_name + '</a></h4>\
                                                        <br><br>\
                                                    </div>\
                                                    <div class="col-md-2 col-sm-2 col-5">\
                                                        <input class="chat rr1" type="button" onclick="inviteFriend(this)">\
                                                        <input class="chat rr2 canc" type="button" >\
                                                    </div>\
                                                </div>';
                        $('#showSearch').append(SearchUsertexthtml);
                    }
                    
                }
            },
            error: function(xhr, ajaxOptions, thrownError) {
                alertMsg(postError);
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
            if(msg = "success")
                alertMsg(inviteSuccess);
                $(invite).closest(".row").remove();
                if($('#showSearch').html()==null || $('#showSearch').html().length==0)
                    $(".go_search").css("display","none");
        },
        error: function(xhr, ajaxOptions, thrownError) {
            alertMsg(postError);
        }
    });
}