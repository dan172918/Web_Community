$(document).ready(function()
{
	$('#user_age').attr("max",year + '-' + month + '-' + date);
});
function register() {
	if ($('#user_name').val() == "" || $('#user_Email').val() == "" || $('#user_password').val() == "" || $('#ConfirmPassword').val() == "" | $('user_age').val() == "" || $('user_gender').val() == ""){
		//if user input null then return null error
		alertMsg(NotNull);
	} else if ($('#user_Email').val().search(/^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z]+$/)) {
		//if user input error email then return error
		alertMsg(eorEmail);
	} else if ($('#user_password').val().length < 8 || $('#ConfirmPassword').value < 8) {
		//if password length smaller 8 then length error
		alertMsg(eorPwd);
	} else if ($('#user_password').val() != $('#ConfirmPassword').val()) {
		//if password and confirm not same then password error
		alertMsg(eorConfirmPwd);
	} else {
		var data={
	    	user_name: $('#user_name').val(),
			user_Email: $('#user_Email').val(),
			user_password: $('#user_password').val(),
			user_age: $('#user_age').val(),
			user_gender: $('#user_gender').val()
		};
		$.ajax({
	        url : "http://"+ host + port +"/api/signup",
	        type : 'POST',
	        data : JSON.stringify(data),
	        contentType : "application/json;charset=utf-8",
	        success: function(msg) {
				if (msg == "already") {
					// if account is already
					alertMsg(accountAlready);
				} else if (msg == "invalid") {
					// if account invalid
					alertMsg(emailInvalid);
				} else {
					// if success register then go to login page
					alertMsgThenGoToSomewhere(successRegister, "./login.html");
				}
	        },
	        error: function(xhr, ajaxOptions, thrownError) {
				alertMsg(registerError);
	        }
    	});
	}
    
    
}
