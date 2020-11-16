/*
    npm init
    npm install mysql
    npm install express
    npm install cors-anywhere
    npm install firebase
*/
var mysql = require('mysql');
var crypto = require('crypto');
var express = require('express');
var firebase = require('firebase');
var bodyParser = require('body-parser');
var app = express();
/*更改url可傳遞的大小*/
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({parameterLimit: 500000,limit: '50mb',extended: true}));
app.use(express.json());

app.use(bodyParser.json());


/* backend info Start */
var host = "34.105.17.84";
/* backend info End */


/*SQL info Start*/
var con = mysql.createConnection({
        host: "34.105.17.84",
        user: "root",
        password : "406261688",
        database : "Connect_db"
    }
);
/*end*/

/*firebase info*/
firebase.initializeApp({
    apiKey: "AIzaSyB9aOtu6zMpJvd4zCM2gnieXs_GCcrI-1M",
    authDomain: "connect-75496.firebaseapp.com",
    databaseURL: "https://connect-75496.firebaseio.com",
    projectId: "connect-75496",
    messagingSenderId: "656533391360",
    appId: "1:656533391360:web:80a8231428fa84e339b0e5",
});

/*test connect*/
app.get('/api/testConnect',function(req,res){
	res.send("success");
});

/*register api*/
app.post('/api/signup', function(req, res){
    console.log(req.body); 

    var name = req.body.user_name.toString();
    var email = req.body.user_Email.toString();
    var password = req.body.user_password.toString();
    var age = req.body.user_age.toString();
    var gender = req.body.user_gender.toString();

    firebase.auth().createUserWithEmailAndPassword(email, password).then(function() {
        // send Database
        var uid = firebase.auth().currentUser.uid;
        password = aesEncrypt(password, uid);
        var sql = 'insert into Connect_db.user_info(user_id , user_name , user_Email , user_password , user_age , user_gender) value( \"' + uid + '\",\"' + name + '\",\"' + email + '\",\"' + password + '\",' + age + ',\"' +gender + '\")';
        con.query(sql, function(err, result) {
            if (err) throw err;
        });
        // send Email
        firebase.auth().currentUser.sendEmailVerification();
        res.send("success");
    }).catch(function(error) {
        // create error
        var errorCode = error.code;
        if (errorCode === "auth/email-already-in-use") {
            res.send("already");
        } else if (errorCode === "auth/invalid-email") {
            res.send("invalid");
        }
    });
});

/*忘記密碼*/
app.post('/api/forgotPwd', function(req, res) {
    console.log(req.body); 
    var email = req.body.user_Email.toString();
    firebase.auth().sendPasswordResetEmail(email).then(function() {
        res.send("success");
    }).catch(function(error) {
        var errorCode = error.code;
        if (errorCode === "auth/user-not-found") {
            res.send("user-not-found");
        }
    });
});


// 引導至重設密碼頁面
app.get('/api/resetPwd/:email', function(req, res) {
    var account = req.params.email.toString();
    var getUserSql = 'SELECT user_id FROM Connect_db.user_info WHERE user_Email=\"' + account + '\"';
    con.query(getUserSql, function(err, result) {
        if (err) throw err;
        var uid = result[0].user_id.toString();
        res.redirect('http://' + host + '/Web_Community/Web/createNew.html?' + uid);
    });
});

// 重設密碼
app.post('/api/changePwd', function(req, res) {
    var uid = req.body.Uid.toString();
    var getUserSql = 'SELECT user_Email, user_password FROM Connect_db.user_info WHERE user_id=\"' + uid + '\"';
    con.query(getUserSql, function(err_1, result_1) {
        if (err_1) throw err_1;
        if (result_1.length == 0) res.send("user-not-found");
        else {
            firebase.auth().signInWithEmailAndPassword(result_1[0].user_Email.toString(), aesDecrypt(result_1[0].user_password.toString(), uid)).then(function() {
                firebase.auth().currentUser.updatePassword(req.body.user_password.toString()).then(function() {
					var editUserSql = 'UPDATE Connect_db.user_info SET user_password =\"' + aesEncrypt(req.body.user_password.toString(), uid) + '\"WHERE user_id=\"' + uid + '\"';
                    //req.body["user_password"] = aesEncrypt(req.body.user_password.toString(), uid);
                    con.query(editUserSql, function(err_2, result_2) {
                        if (err_2) throw err_2;
                        res.send("success");
                    });
                }).catch(function(error) {
                    throw error;
                });
            });
        }
    });
});

// 登入
app.post('/api/login', function(req, res) {
    console.log(req.body);
    var account = req.body.user_Email.toString();
    var password = req.body.user_password.toString();
    firebase.auth().signInWithEmailAndPassword(account, password).then(function() {
        if (firebase.auth().currentUser.emailVerified === false) {
            res.send("notEmailVerified");
        } 
        else {
            var timeSql = 'update Connect_db.user_info set LastLogin = NOW() where user_email=\"' + account + '\"';
            con.query(timeSql, function(err, result) {
                if (err) throw err;
            });
        }
    }).then(function() {
        var getUser = 'SELECT user_id, user_name FROM Connect_db.user_info where user_email=\"' + account + '\"';
        con.query(getUser, function(err, result) {
            if (err) throw err;
            res.send([result[0].user_id.toString(), 'http://' + host + '/Web_Community/Web/index.html']);
        });
    }).catch(function(error) {
        var errorCode = error.code;
        if (errorCode === 'auth/wrong-password') {
            res.send("pwdError");
        } else if (errorCode === "auth/user-not-found") {
            res.send("user-not-found");
        }
    });
});

app.post('/api/username',function(req,res){
    var user_id = req.body.user_id.toString();
    var select_user_name = 'select user_name from Connect_db.user_info where user_id = \"'+user_id+'\"';
    con.query(select_user_name,function(err,result){
        if(err) throw err;
        res.send(result);
    });
});



/*存發文text跟time*/
app.post('/api/index',function(req,res){
    console.log(req.body);
    var art_text = req.body.article_text.toString();
    var u_id = req.body.user_id.toString();
    var post_lvl = req.body.post_level.toString();
    var post_pic = req.body.article_pic.toString();
    if(u_id==""){
        res.send("error");
    }
    else{
        var insert_art_text = 'insert into Connect_db.article(article_text,user_id,article_picture,post_level,article_time) value( \"' + art_text + '\",\"'+u_id+'\",\"'+post_pic+'\",\"'+post_lvl+'\",now())';
        con.query(insert_art_text, function(err, result) {
            if (err) throw err;
            res.send("success");
        });
    }

 });

 app.post('/api/article',function(req,res){
    var u_id = req.body.user_id.toString();
    var art_text_sql = 'select article.article_text,article.article_id,article.article_picture,user_info.user_name \
                        from user_info,article,(select user_id\
                                                from user_info,((select user_id_self as id\
                                                                from friend\
                                                                where user_id_other=\"'+u_id+'\")\
                                                                union\
                                                                (select user_id_other as id\
                                                                from friend\
                                                                where user_id_self=\"'+u_id+'\")\
                                                                union\
                                                                (select user_info.user_id\
                                                                from user_info\
                                                                where user_id = \"'+u_id+'\")) as newTable0\
                                                where user_id=id) as newTable1\
                        where user_info.user_id = newTable1.user_id and article.user_id = newTable1.user_id and user_info.user_id = article.user_id\
                        order by article.article_time desc limit 10';
    con.query(art_text_sql,function(err,result){
        if(err) throw err;
        res.send(result);
    });
 });

app.post('/api/command',function(req,res){
    console.log(req.body);
    var art_id = Number(req.body.article_id);
    var command_text = req.body.command_text.toString();
    var u_id = req.body.user_id.toString();
    var insert_command_text = 'insert into Connect_db.command(user_command,article_id,user_id,command_time) value( \"' + command_text + '\",\"' + art_id + '\",\"' + u_id + '\",now())';
    con.query(insert_command_text,function(err,result){
        if(err) throw err;
        res.send("success");
    });
});

app.post('/api/take_command',function(req,res){

    var command_text_sql = 'select command.article_id,command.user_command,user_info.user_name\
                            from command,user_info\
                            where command.user_id = user_info.user_id;';
    con.query(command_text_sql,function(err,result){
        if(err) throw err;
        res.send(result);
    });
 });

 /*初始化 設定格式大小*/


 
 /*將圖片存入mysql*/
 
 /*app.post('/api/art_pic',upload.array('image'),async(req,res,next) => {
     console.log('file => ',req.file);
     var insert_art_pic = 'insert into Connect_db.article(article_picture) value (\"'+ req.file.buffer +'\")';
     
     con.query(insert_art_pic,function(err,result){
         if(err) throw err;
     });
     res.send({
         success: true,
         message: '上傳成功'
     });
 });

app.get('api/index',async(req,res) => {
    const[art_pic] = await con.query('select img from Connect_db.article where article_id = "${req.Connect_db.article.article_id}"');
    //轉換格式
    art_pic.img = Buffer.from(art_pic.img).toString('base64');
    res.send({
        success: true,
        art_pic,
    });
})*/

app.post('/api/profile',function(req,res){
    console.log(req.body);

    var u_id = req.body.user_id.toString();
    var u_school = req.body.user_school.toString();
    var u_age = req.body.user_age.toString();
    var u_hobit = req.body.user_hobit.toString();
    var u_nation = req.body.user_nation.toString();
    var u_change = req.body.user_change.toString();
    var u_try = req.body.user_try.toString();

    console.log(u_id,u_schoolj,u_age,u_hobit,u_nation,u_change,u_try);

    var insert_profile_info =  'update Connect_db.user_info set user_school = \"'+ u_school +'\",user_age = \"'+ u_age +'\",user_hobby = \"'+u_hobit+'\",user_like_country = \"'+u_nation+'\" ,user_change = \"'+u_change+'\",user_try = \"'+u_try+'\" where user_id = \"'+u_id+'\"';
    con.query(insert_profile_info, function(err, result) {
        if (err) throw err;
    });
});

/*將圖片update存入profile_mysql*/
/*
app.post('/api/profile',upload.single('user_picture'),async(req,res) => {
    console.log('file => ',req.file);
    var update_user_pic = ('update Connect_db.user_info set user_picture = ? where user_id = "${req.Connect_db.user_info.user_id}"',req.file.buffer);
    
    con.query(update_user_pic,function(err,result){
        if(err) throw err;
    });
    res.send({
        success: true,
        message: '上傳成功'
    });
});
*/
/*好友名單*/
app.post('/api/loadFriendlist', function(req, res) {
    var uid = req.body.u_id.toString();
    var getFriend = "select user_id,user_name \
                    from user_info,((select user_id_self as id\
                                    from friend\
                                    where user_id_other=\""+uid+"\" and relation = 0)\
                                    union\
                                    (select user_id_other as id\
                                    from friend\
                                    where user_id_self=\""+uid+"\" and relation = 0)) as newTable\
                    where user_id=id";
    con.query(getFriend,function(err,result){
        if (err) throw err;
        res.send(result);
    });
});
/*搜尋好友*/
app.post('/api/SearchFriend', function(req, res) {
    var uid = req.body.u_id.toString();
    var name = req.body.user_name.toString();
    var SearchUser = 'select user_info.user_id,user_info.user_name,relation\
                    from user_info left join ((select user_id_self as id,relation\
                                            from friend\
                                            where user_id_other=\"'+uid+'\")\
                                            union\
                                            (select user_id_other as id,relation\
                                            from friend\
                                            where user_id_self=\"'+uid+'\")) as newTab \
                                            on user_info.user_id = newTab.id\
                    where user_name = \"'+name+'\"';
    con.query(SearchUser,function(err,result){
        if (err) throw err;
        res.send(result);
    });
});
/*邀請好友*/
app.post('/api/inviteFriend', function(req, res) {
    var uid = req.body.u_id.toString();
    var fid = req.body.f_id.toString();
    var insertFriend = 'insert into friend (user_id_self,user_id_other,relation) value(\"'+uid+'\",\"'+fid+'\",1)';
    con.query(insertFriend,function(err,result){
        if (err) throw err;
        res.send("success");
    });
});
/* Password Process Start */
// 加密
function aesEncrypt(data, key) {
    const cipher = crypto.createCipher('aes192', key);
    var crypted = cipher.update(data, 'utf8', 'hex');
    crypted += cipher.final('hex');
    return crypted.toString();
}
// 解密
function aesDecrypt(encrypted, key) {
    const decipher = crypto.createDecipher('aes192', key);
    var decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted.toString();
}
/* Password Process End */

app.listen(process.env.PORT || 3000, function() {
    console.log("Start port 3000");
  });

