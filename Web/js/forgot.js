function forgotPwd(){
    if ($('#user_Email').val() == ""){
        //if user input null then return null error
        alertMsg(NotNull);
    } else if ($('#user_Email').val().search(/^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z]+$/)) {
		//if user input error email then return error
		alertMsg(eorEmail);
	} else {
        var data={
			user_Email: $('#user_Email').val()
        };
        $.ajax({
	        url : "http://"+ host + port +"/api/forgotPwd",
	        type : 'POST',
	        data : JSON.stringify(data),
            contentType : "application/json;charset=utf-8",
            success: function(msg) {
                if (msg == "user-not-found") {
                    // if account is not exist
                    alertMsg(userNotExist);
                } else if (msg == "success") {
                    // success send email
                    alertMsgThenGoToSomewhere(sentemail, "./login.html");
                }
            },
            error: function(xhr, ajaxOptions, thrownError) {
                // if send error
                alertMsg(postError);
            }
    	});
    }
        
    
}