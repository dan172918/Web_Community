function login(){
    if ($('#user_Email').val() == "" || $('#user_password').val() == ""){
		//if user input null then return null error
		alertMsg(NotNull);
	} else if ($('#user_Email').val().search(/^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z]+$/)) {
		//if user input error email then return error
		alertMsg(eorEmail);
	} else {
		var data={
			user_Email: $('#user_Email').val(),
			user_password: $('#user_password').val()
		};
		$.ajax({
	        url : "http://"+ host + port +"/api/login",
	        type : 'POST',
	        data : JSON.stringify(data),
	        contentType : "application/json;charset=utf-8",
	        success: function(msg) {
				if (msg == "notEmailVerified"){
					//if account not exist
					alertWithCloseBtn(notEmailVerified);
				} else if (msg == "user-not-found") {
					// if account is already
					alertMsg(userNotExist);
				} else if (msg == "pwdError") {
					// if account invalid
					alertMsg(pwdError);
				} else {
					setCookie("token", msg[0], 30);
					location.href = msg[1];
				}
	        },
	        error: function(xhr, ajaxOptions, thrownError) {
				alertMsg(loginError);
	        }
    	});
	}
}
