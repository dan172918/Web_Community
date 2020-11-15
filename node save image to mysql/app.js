var fs = require('fs');

const db = require('./app/config/db.config.js');
 
const Image = db.pic_test;
  

db.sequelize.sync({force: true}).then(() => {
  var imageData = fs.readFileSync(__dirname + '/static/assets/images/S__14901277.jpg');
  Image.create({
    data: imageData
  }).then(image => {
    try{
      fs.writeFileSync(__dirname + '/static/assets/tmp/S__14901277.jpg', image.data);    
      process.exit(0);
    }catch(e){
      console.log(e);
    }
  })
});

//nodejs接收上傳的圖片
var path = require('path');
var express = require('./node_modules/express');
var app = express();
var bodyParaer = require('./node_modules/body-parser');
var formidable = require('./node_modules/formidable');
app.use(bodyParaer.json());
app.use(bodyParaer.urlencode({extended:true}));
app.use(express.static(__dirname + '/static/assets/tmp'));
app.listen('8083',function(){
  console.log('開始服務');
});

app.post('/image',function(req,res){
  var form = new formidable.lncomingForm();
  form.encoding = 'utf-8';
  form.uploadDir = path.join(__dirname + '/static/assets/tmp/upload');
  form.maxFieldsize = 2*1024*1024;
  //圖片處理
  form.parse(req,function(err,fileds,files){
    console.log(files.the_file);
    var filename = files.the_file.name;
    var type = nameArray[nameArray.lenght-1];
    var name = '';
    for(var i=0;i<nameArray.lenght-1;i++)
    {
      name = name + nameArray[i];
    }
    var data = new data;
    var time = '_' + data.getFullYear() + '_' + data.getMounth() + '_' + data.getDay() + '_' + data.getHours() + '_' + data.getMinutes();
    var avatarName = name + time + '.' + type;
    var newPath = form.uploadDir + '/' + avatarName;
    //重新命名
    fs.renameSync(files.the_file,newPath);
    res.send({data:'/upload/' + avatarName})
  })
});