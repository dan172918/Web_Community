/*gcp 外部ip and port*/
var host = "34.105.17.84";
var port = ":3000";

/* 跨域*/
$.ajaxPrefilter(function(options) {     
	if (options.crossDomain && jQuery.support.cors) {         
	   	var http = (window.location.protocol === 'http:' ? 'http:' : 'https:');         		           
		options.url = http + '//'+host+':8080/'+options.url;
	} 
});

/*bootbox*/
function alertMsg(msg) {
    bootbox.alert({
        closeButton: false,
        message: msg,
        buttons: {
            ok: {
                label: '<i class="fas fa-fw fa-times"></i>' + closeBtn,
                className: 'btn btn-primary'
            }
        }
    }).css({
        "margin-top": "20%",
    });
}

function alertMsgThenGoToSomewhere(msg, link) {
    bootbox.alert({
        closeButton: false,
        message: msg,
        buttons: {
            ok: {
                label: '<i class="fas fa-fw fa-times"></i>' + closeBtn,
                className: 'btn btn-primary'
            }
        },
        callback: function() {
            location.href = link;
        }
    }).css({
        "margin-top": "20%",
    });
}

/* cookie start */
function setCookie(keyword, value, minutes) {
    var d = new Date();
    d.setTime(d.getTime() + (minutes * 60 * 1000));
    var expires = "expires=" + d.toUTCString();
    document.cookie = keyword + "=" + value + ";" + expires + ";path=/";
}

function getCookie(keyword) {
    var key = keyword + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        var c = ca[i].trim();
        if (c.indexOf(key) == 0) return c.substring(key.length, c.length);
    }
    return null;
}

function checkCookie(url) {
    var data = getCookie("token");
    if (data === null) {
        document.location.href = url;
    } else {
        setCookie("token", data, 10);
    }
}

function logout() {
    setCookie("token", "null", 0);
    location.reload();
}
/* cookie end */

/*alert message*/
var closeBtn = "關閉";
var NotNull = "欄位不能空白";
var eorEmail = "信箱格式錯誤";
var eorPwd = "密碼長度至少8個字元";
var eorConfirmPwd = "密碼與再次輸入密碼不一樣";
var accountAlready = "信箱已註冊過";
var emailInvalid = "請輸入有效的信箱";
var successRegister = "已成功註冊，請到信箱確認驗證信";
var registerError = "註冊失敗，請聯絡管理員";
var userNotExist = "信箱錯誤或帳號不存在";
var sentemail = "重設密碼信件已寄出，請前往信箱收信";
var postError = "傳送資料失敗，請聯繫系統管理員";
var changePwdSuccess = "密碼重設成功!";
var pwdError = "密碼不正確，請重新輸入或進行忘記密碼";
var loginError = "登入失敗，請聯繫系統管理員";
var notEmailVerified = "您尚未前往 Email 收驗證信";
var inviteSuccess = "邀請成功，請等待對方回覆"; 
var inviteError = "邀請失敗，請再次嘗試或連繫開發者";
var addFriendError = "加入好友失敗";
var finishAddFriend = "成功加為好友";
var rejectError = "拒絕失敗，請再次嘗試或連繫開發者";

var SuccessPost = '發文成功囉';
var FailedPost = '發文失敗或登入逾時';
var NullPost = '甚麼都沒有要發甚麼文??';
var ErrorMsg = "發生錯誤，請聯繫管理員";

var ProfileSucess = '修改成功囉';
var ProfileFailed = '修改失敗\n請再試一次';

var asd = "成功傳送";
/*限制日期*/
var today = new Date();
var year = today.getFullYear();
var month = (today.getMonth()+1) < 10 ? "0"+(today.getMonth()+1) : (today.getMonth()+1);
var date = today.getDate() < 10 ? "0"+today.getDate() :today.getDate();
	