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
const server = require('http').Server(app);
const io = require("socket.io")(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
      allowedHeaders: ["my-custom-header"],
      credentials: true
    }
});
/*更改url可傳遞的大小*/
app.use(express.json({limit: '5000mb'}));
app.use(express.urlencoded({limit: '5000mb',extended: true}));
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
    var art_text_sql = 'select article.article_id,article.article_text,article.article_picture,user_info.user_name,likes.user_id,article.likes\
                        from user_info,((select user_id_self as id\
                            from friend\
                            where user_id_other=\"'+u_id+'\" or user_id_self=\"'+u_id+'\")\
                            union\
                            (select user_id_other as id\
                            from friend\
                            where user_id_self=\"'+u_id+'\" or user_id_other=\"'+u_id+'\")) as newTable0\
                            ,article left join likes on likes.article_id = article.article_id and likes.user_id = \"'+u_id+'\"\
                        where article.user_id = newTable0.id and newTable0.id = user_info.user_id and article.post_level = "0"\
                        order by article.article_time desc limit 10';
    con.query(art_text_sql,function(err,result){
        if(err) throw err;
        res.send(result);
        console.log(result);
    });
 });

/*好友顯示多10篇貼文*/
 app.post('/api/add_article',function(req,res){
    var u_id = req.body.user_id.toString();
    var cook_art = Number(req.body.cookie_art) + 1;
    console.log(cook_art);
    var art_text_sql = 'select article.article_id,article.article_text,article.article_picture,user_info.user_name,likes.user_id,article.likes\
                        from user_info,((select user_id_self as id\
                            from friend\
                            where user_id_other=\"'+u_id+'\" or user_id_self=\"'+u_id+'\")\
                            union\
                            (select user_id_other as id\
                            from friend\
                            where user_id_self=\"'+u_id+'\" or user_id_other=\"'+u_id+'\")) as newTable0\
                            ,article left join likes on likes.article_id = article.article_id and likes.user_id = \"'+u_id+'\"\
                        where article.user_id = newTable0.id and newTable0.id = user_info.user_id and article.post_level = "0"\
                        order by article.article_time desc limit '+cook_art+',10';
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

app.post('/api/like',function(req,res){
    var art_id = Number(req.body.article_id);
    var u_id = req.body.user_id.toString();
    var like = Number(req.body.like);
    if(like == 0)   //取消愛心
    {
        var select_like_id = 'select likes.like_id from Connect_db.likes where user_id = \"' + u_id + '\" and article_id = \"' + art_id + '\"';
        var update_art_like_minus = 'update Connect_db.article set article.likes=article.likes-1 where article_id = \"' + art_id + '\"';
        con.query(select_like_id,function(err,result){
            if(err) throw err;
            console.log(result);
            var delete_like = 'delete from Connect_db.likes where likes.like_id = \"' + result[0].like_id + '\"';
            con.query(delete_like,function(err,result){
                if(err) throw err;
                //res.send("success");
            });
        });
        con.query(update_art_like_minus,function(err,result){
            if(err) throw err;
            //res.send("success");
        });
    }
    else if(like == 1)  //按下愛心
    {
        var insert_like = 'insert into Connect_db.likes(user_id,article_id) value(\"' + u_id + '\",\"' + art_id + '\")';
        var update_art_like_pius = 'update Connect_db.article set article.likes=article.likes+1 where article_id = \"' + art_id + '\"';
        con.query(insert_like,function(err,result){
            if(err) throw err;
        });
        con.query(update_art_like_pius,function(err,result){
            if(err) throw err;
        });
    }
});

/*store profile*/
app.post('/api/profile',function(req,res){
    console.log(req.body);

    var u_id = req.body.user_id.toString();
    var u_school = req.body.user_school.toString();
    var u_age = req.body.user_age.toString();
    var u_hobit = req.body.user_hobit.toString();
    var u_nation = req.body.user_nation.toString();
    var u_change = req.body.user_change.toString();
    var u_try = req.body.user_try.toString();
    var u_picture = req.body.user_picture.toString();

    var update_pic = 'update Connect_db.user_info set user_picture = \"'+ u_picture +'\" where user_id = \"'+u_id+'\"';
    var insert_profile_info =  'update Connect_db.user_info set user_school = \"'+ u_school +'\",user_age = \"'+ u_age +'\",user_hobby = \"'+u_hobit+'\",user_like_country = \"'+u_nation+'\" ,user_change = \"'+u_change+'\",user_try = \"'+u_try+'\" where user_id = \"'+u_id+'\"';
    if(u_picture)
    {
        con.query(update_pic, function(err, result) {
            if (err) throw err;
        });
    }
    con.query(insert_profile_info, function(err, result) {
        if (err) throw err;
    });
});

app.post('/api/show_profile',function(req,res){
    var u_id = req.body.user_id.toString();
    var select_profile = 'select user_picture,user_school,user_age,user_hobby,user_like_country,user_change,user_try\
                            from Connect_db.user_info\
                            where user_info.user_id = \"'+ u_id +'\"';
    con.query(select_profile,function(err,result){
        if(err) throw err;
        res.send(result);
        console.log(result);
    });
 });

/*匿名顯示貼文*/
 app.post('/api/anmsarticle',function(req,res){
    var show_anmsart_text = 'select article.article_id,article.article_text,article.article_picture,likes.like_id,article.likes\
                       from article left join likes on likes.article_id = article.article_id\
                       where article.post_level = "3"\
                       order by article.article_time desc limit 10';

    con.query(show_anmsart_text,function(err,result){
        if(err) throw err;
        res.send(result);
        console.log(result);
    });
 });

 /*匿名留言貼文*/
 app.post('/api/take_anmscommand',function(req,res){
    var show_anmscommand_text= 'select command.article_id,command.user_command\
                            from command';
    con.query(show_anmscommand_text,function(err,result){
        if(err) throw err;
        res.send(result);
    });
 });

/*匿名顯示多10篇貼文*/
 app.post('/api/add_anmsarticle',function(req,res){
    var cook_art = Number(req.body.cookie_art) + 1;
    console.log(cook_art);
    var art_text_sql = 'select article.article_id,article.article_text,article.article_picture,likes.like_id,article.likes\
                        from article left join likes on likes.article_id = article.article_id\
                        where article.post_level = "3"\
                        order by article.article_time desc limit '+cook_art+',10';
    con.query(art_text_sql,function(err,result){
        if(err) throw err;
        res.send(result);
    });
 });


 app.post('/api/glpindex',function(req,res){
    console.log(req.body);
    var gid = Number(req.body.group_id);
    var art_text = req.body.article_text.toString();
    var u_id = req.body.user_id.toString();
    var post_lvl = req.body.post_level.toString();
    var post_pic = req.body.article_pic.toString();
    if(u_id==""){
        res.send("error");
    }
    else{
        var insert_art_text = 'insert into Connect_db.article(article_text,user_id,article_picture,post_level,article_time,article.club_id) value( \"' + art_text + '\",\"'+u_id+'\",\"'+post_pic+'\",\"'+post_lvl+'\",now(),\"'+gid+'\")';
        con.query(insert_art_text, function(err, result) {
            if (err) throw err;
            res.send("success");
        });
    }
 });

  /*show社團貼文*/
  app.post('/api/glparticle',function(req,res){
    var gid = Number(req.body.group_id);
    var art_text_sql = 'select article.article_text,article.article_id,article.article_picture,user_info.user_name,likes.like_id,article.likes,article.club_id\
                        from user_info,article left join likes on likes.article_id = article.article_id\
                        where article.club_id = \"'+ gid +'\" and article.post_level = "2" and user_info.user_id = article.user_id\
                        order by article.article_time desc limit 10';
    con.query(art_text_sql,function(err,result){
        if(err) throw err;
        res.send(result);
        console.log(result);
    });
 });

/*show社團貼文+10*/
 app.post('/api/add_glparticle',function(req,res){
    var gid = Number(req.body.group_id);
    var cook_art = Number(req.body.cookie_art) + 1;
    //console.log(cook_art);
    var art_text_sql = 'select article.article_text,article.article_id,article.article_picture,user_info.user_name,likes.like_id,article.likes,article.club_id\
                        from user_info,article left join likes on likes.article_id = article.article_id\
                        where article.club_id = \"'+ gid +'\" and article.post_level = "2"\
                        order by article.article_time desc limit '+cook_art+',10';
    con.query(art_text_sql,function(err,result){
        if(err) throw err;
        res.send(result);
    });
 });

 /*app.post('/api/take_glpcommand',function(req,res){

    var command_text_sql = 'select command.article_id,command.user_command,user_info.user_name\
                            from command,user_info\
                            where command.user_id = user_info.user_id;';
    con.query(command_text_sql,function(err,result){
        if(err) throw err;
        res.send(result);
    });
 });*/

 /*store社團貼文*/
 app.post('/api/glpindex',function(req,res){
    console.log(req.body);
    var art_text = req.body.article_text.toString();
    var u_id = req.body.user_id.toString();
    var post_lvl = req.body.post_level.toString();
    var post_pic = req.body.article_pic.toString();
    var group_id = Number(req.body.group_id);
    if(u_id==""){
        res.send("error");
    }
    else{
        var insert_art_text = 'insert into Connect_db.article(article_text,user_id,article_picture,post_level,article_time,article.group_id) value( \"' + art_text + '\",\"'+u_id+'\",\"'+post_pic+'\",\"'+post_lvl+'\",now(),\"'+group_id+'\")';
        con.query(insert_art_text, function(err, result) {
            if (err) throw err;
            res.send("success");
        });
    }
 });
 
 app.post('/api/SearchGroup',function(req,res){
     console.log(req.body);
    var g_name = req.body.group_name.toString();
    var art_text_sql = 'select club.club_name,club.club_id,user_club.user_id\
                        from club join user_club on club.club_id = user_club.club_id\
                        where club.club_name = \"'+g_name+'\"';
    con.query(art_text_sql,function(err,result){
        if(err) throw err;
        res.send(result);
        console.log(result);
    });
 });

 app.post('/api/PlusGroup',function(req,res){
    var gid = req.body.group_id.toString();
    var uid = req.body.user_id.toString();
    var pg = 'insert into Connect_db.user_club(user_id,club_id)\
                        value(\"' + uid + '\",\"' + gid + '\")';
    con.query(pg,function(err,result){
        if(err) throw err;
        res.send("Success");
    });
 });


app.post('/api/show_group_member',function(req,res){
    console.log(req.body);
   var gid = req.body.group_id.toString();
   var groupsearch = 'select club.club_name,user_info.user_name\
                     from (user_club left join club on user_club.club_id = club.club_id)join user_info on user_info.user_id = user_club.user_id\
                     where club.club_id = \"' + gid + '\"';
   con.query(groupsearch,function(err,result){
       if(err) throw err;
       res.send(result);
       console.log(result);
   });
});

/*show user clubs*/
 app.post('/api/groups',function(req,res){
    console.log(req.body);
    var u_id = req.body.user_id.toString();
    var user_groups = 'select club_name,user_club.club_id\
                        from club join user_club on club.club_id = user_club.club_id\
                        where user_club.user_id = \"' + u_id + '\"';
    con.query(user_groups,function(err,result){
        if(err) throw err;
        res.send(result);
        console.log(result);
    });
 });

 app.post('/api/chickgroups',function(req,res){
    console.log(req.body);
    var select_group_name = 'select club_name from club';
    con.query(select_group_name,function(err,result){
        if(err) throw err;
        res.send(result);
        console.log(result);
    });
 });

 /*create club*/
 app.post('/api/creategroup',function(req,res){
    console.log(req.body);
    var u_id = req.body.user_id.toString();
    var g_name = req.body.group_name.toString();
    var insert_group = 'insert into Connect_db.club(club_name)\
                       value(\"' + g_name + '\")';
    var insert_user_club = 'insert into Connect_db.user_club(club_id,user_id)\
                            value((select club_id\
                                   from club\
                                   where club_name = \"' + g_name + '\"),\"' + u_id + '\")';
    con.query(insert_group,function(err,result){
        if(err) throw err;
        con.query(insert_user_club,function(err,result){
            if(err) throw err;
            res.send("success");
        });
    });
 });

/*好友名單*/
app.post('/api/loadFriendlist', function(req, res) {
    var uid = req.body.u_id.toString();
    var getFriend = "select chat_id,user_id,user_name \
                    from user_info,((select chat_id,user_id_self as id\
                                    from friend\
                                    where user_id_other=\""+uid+"\" and relation = 0)\
                                    union\
                                    (select chat_id,user_id_other as id\
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
                                            where user_id_other=\"'+uid+'\" and relation != 4)\
                                            union\
                                            (select user_id_other as id,relation\
                                            from friend\
                                            where user_id_self=\"'+uid+'\" and relation != 4)) as newTab \
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
    var checkRep = 'select chat_id\
                    from friend\
                    where ((user_id_self = \"'+uid+'\" and user_id_other = \"'+fid+'\") or \
                        (user_id_self = \"'+fid+'\" and user_id_other = \"'+uid+'\") )and relation = 4';
    con.query(checkRep,function(err,result){
        if (err) throw err;
        if(result.length==0){
            var insertFriend = 'insert into friend (user_id_self,user_id_other,relation) value(\"'+uid+'\",\"'+fid+'\",1)';
            con.query(insertFriend,function(err,result){
                if (err) throw err;
                res.send("success");
            });
        }
        else{
            var insertCardFriend = 'update friend\
                                    set relation = 1,user_id_self = \"'+uid+'\",user_id_other = \"'+fid+'\"\
                                    where chat_id in \
                                    (select chat_id\
                                    from (select chat_id\
                                            from friend\
                                            where (user_id_self = \"'+uid+'\" and user_id_other = \"'+fid+'\") or \
                                                    (user_id_self = \"'+fid+'\" and user_id_other = \"'+uid+'\") and \
                                                    relation = 4) as A)';
            con.query(insertCardFriend,function(err,result){
                if (err) throw err;
                res.send("success");
            });
        }
    });

});
/*顯示交友邀請*/
app.post('/api/showinvite', function(req, res){
    var uid = req.body.u_id.toString();
    var getinvite = "select user_id,user_name \
                    from user_info,(select user_id_self as id\
                                    from friend\
                                    where user_id_other=\""+uid+"\" and relation = 1)\
                                    as newTable\
                    where user_id=id";
    con.query(getinvite,function(err,result){
        if (err) throw err;
        res.send(result);
    });
});
/*同意加入好友*/
app.post('/api/acceptFriend', function(req, res){
    console.log(req.body);
    var uid = req.body.u_id.toString();
    var fid = req.body.f_id.toString();
    var addfriend = "update friend\
                    set relation = 0\
                    where chat_id in \
                    (select *\
                    from (select chat_id\
                        from friend\
                        where user_id_self = \""+fid+"\" and user_id_other = \""+uid+"\" and relation = 1) as A)";   
    con.query(addfriend,function(err,result){
        if (err) throw err;
        var getFriend = "select chat_id\
                            from friend\
                            where user_id_self = \""+fid+"\" and user_id_other = \""+uid+"\" and relation = 0";
        con.query(getFriend,function(err,result){
            if (err) throw err;
            res.send(result);
        });
    });

});
/*拒絕加入好友*/
app.post('/api/rejectFriend', function(req, res){
    var uid = req.body.u_id.toString();
    var fid = req.body.f_id.toString();
    var checkRep = "select meetTime\
                    from friend\
                    where user_id_self = \""+fid+"\" and user_id_other = \""+uid+"\" and relation = 1";
    con.query(checkRep,function(err,result){
        if(result[0].meetTime == null){
            var deleteFriend = "delete from friend\
                        where chat_id in \
                        (select *\
                        from (select chat_id\
                            from friend\
                            where user_id_self = \""+fid+"\" and user_id_other = \""+uid+"\" and relation = 1) as A)";
            con.query(deleteFriend,function(err,result){
                if (err) throw err;
                res.send("success");
            });
        }
        else{
            var addfriend = "update friend\
                            set relation = 4\
                            where chat_id in \
                            (select *\
                            from (select chat_id\
                                from friend\
                                where user_id_self = \""+fid+"\" and user_id_other = \""+uid+"\" and relation = 1) as A)";
            con.query(addfriend,function(err,result){
                if (err) throw err;
                res.send("success");
            });
        }
    });
    
});

/*訊息載入*/
app.post('/api/loadMsg', function(req, res){
    var cid = req.body.chat_id.toString();
    var laodChatMsg = "select chat_name,chat_text,chat_time\
                        from chat\
                        where chat_id = "+cid+" order by chat_time desc";
    con.query(laodChatMsg,function(err,result){
        if (err) throw err;
        console.log(result);
        res.send(result);
    });
});

/*載入每日卡友*/
app.post('/api/showCardFriend', function(req, res){
    var uid = req.body.user_id.toString();
    //顯示今天抽出的卡友
    var showtodayCard = 'select chat_id,user_id,user_name,user_picture,newTable.relation\
                            from user_info,(select chat_id,user_id_self as id,relation\
                                            from friend\
                                            where user_id_other=\"'+uid+'\" and TO_DAYS(meetTime) = TO_DAYS(NOW())\
                                            union\
                                            select chat_id,user_id_other as id,relation\
                                            from friend\
                                            where user_id_self=\"'+uid+'\" and TO_DAYS(meetTime) = TO_DAYS(NOW())) as newTable\
                            where user_id=id';
    //判斷今天是否抽取
    var isRandSelFriend = 'select user_id_self as id\
                            from friend\
                            where user_id_other=\"'+uid+'\" and TO_DAYS(meetTime) = TO_DAYS(NOW())\
                            union\
                            select user_id_other as id\
                            from friend\
                            where user_id_self=\"'+uid+'\" and TO_DAYS(meetTime) = TO_DAYS(NOW())';
    con.query(isRandSelFriend,function(err,result){
        if(err) throw err;
        if(result.length == 0){ //如果未抽過，隨機選擇一名不在自己好友名單內的
            var RandSelFriend = 'select user_id\
                                    from user_info as A left join (select user_id_self as id\
                                                                from friend\
                                                                where user_id_other=\"'+uid+'\" and relation = 0\
                                                                union\
                                                                select user_id_other as id\
                                                                from friend\
                                                                where user_id_self=\"'+uid+'\" and relation = 0) as B on A.user_id = B.id\
                                    where B.id is null and A.user_id != \"'+uid+'\"\
                                    ORDER BY RAND()\
                                    LIMIT 1';
            con.query(RandSelFriend,function(err,result){
                if(err) throw err;
                if(result.length == 0)  //如果剩餘用戶都是你的好友，銘謝惠顧，下次請早
                    res.send("tryAgain");
                else{   //先暫存friend table中
                    var TemporaryCardFriend = 'insert into friend(user_id_self,user_id_other,meetTime,relation)\
                                                value(\"'+uid+'\",\"'+result[0].user_id+'\",now(),4)';
                    con.query(TemporaryCardFriend, function(err,result){
                        if(err) throw err;
                        console.log(uid+"selectFinish");
                        con.query(showtodayCard,function(err,result){
                            if(err) throw err;
                            res.send(result);
                        });
                    });
                }
            });
        }
        else{   //如果抽過，直接卡友傳至前端 
            con.query(showtodayCard,function(err,result){
                if(err) throw err;
                res.send(result);
            });
        }
    });
});

//邀請卡友
app.post('/api/inviteCardFriend', function(req, res){
    var uid = req.body.u_id.toString();
    var fid = req.body.f_id.toString();
    var insertCardFriend = 'update friend\
                            set relation = 1,user_id_self = \"'+uid+'\",user_id_other = \"'+fid+'\"\
                            where chat_id in \
                            (select chat_id\
                            from (select chat_id\
                                    from friend\
                                    where (user_id_self = \"'+uid+'\" and user_id_other = \"'+fid+'\") or \
                                            (user_id_self = \"'+fid+'\" and user_id_other = \"'+uid+'\") and \
                                            relation = 4) as A)';
    con.query(insertCardFriend,function(err,result){
        if (err) throw err;
        console.log(uid+" <-- Invite CardFriend --> "+fid);
    });
});

io.on('connection', (socket) => {
    socket.on("testConnect", (msg1) => {
        console.log("UID : "+msg1.user_id+" NAME : "+msg1.user_name+" Connect Success");
    });
    socket.on("send", (msg2) => {
        console.log(msg2);
        var chat_send_Msg = "insert into chat(chat_id,chat_user,chat_name,chat_time,chat_text) value(\""+msg2.chat_id+"\",\""+msg2.user_id+"\",\""+msg2.user_name+"\",now(),\""+msg2.Msg+"\");";
        con.query(chat_send_Msg,function(err,result){
            if(err)throw err;
            io.emit("msg", msg2);
        })
    });
    socket.on("inviteFriend",(userId) => {
        io.emit("disableButton", userId);
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

server.listen(process.env.PORT || 3000, function() {
    console.log("Start port 3000");
  });

 