function resetPwd() {
	if ($('#user_password').val() == ""){
		//if user input null then return null error
		alertMsg(NotNull);
	} else if ($('#user_password').val().length < 8 ) {
		//if password length smaller 8 then length error
		alertMsg(eorPwd);
	} else {
		var data={
            Uid: location.search.slice(1),
			user_password: $('#user_password').val()
		};
		$.ajax({
	        url : "http://"+ host + port +"/api/changePwd",
	        type : 'POST',
	        data : JSON.stringify(data),
	        contentType : "application/json;charset=utf-8",
            success: function(msg) {
                if (msg == "user-not-found") {
                    // if account is not exist
                    alertMsg(userNotExist);
                } else if (msg == "success") {
                    // success send email
                    alertMsgThenGoToSomewhere(changePwdSuccess, "./login.html");
                }
            },
            error: function(xhr, ajaxOptions, thrownError) {
                // if send error
                alertMsg(postError);
            }
    	});
	}
    
    
}