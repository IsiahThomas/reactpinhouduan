
var express = require('express');
var router = express.Router();
var {UserModel} = require('../db/models'); //用exports.xxx=value;就得用解构赋值的方式写。
var md5 = require('blueimp-md5');
var filter = {password:0};
/* GET home page. */
/*router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});*/

router.post('/register',function (req,res,next) {
  const {username,password,type} = req.body;
  /*if(username ==='admin'){
    res.send({code:1,msg:'用户已注册'})
  }else{
    res.send({code:0,data:{_id:'ab',username,password}})
  }*/
  UserModel.findOne({username},(err,user)=>{
    if(user){
      res.send({code:1,msg:'用户已注册'});
    }else{
      new UserModel({username,password:md5(password),type}).save(function(err,user){
        res.cookie('userid',user._id,{maxAge:1000*60*60*24*7})
        res.send({code:0,user:{_id:user._id,username,type}})
      })
    }
  })
})

/*router.post('/login',function (req,res) {
  const{username,password} = req.body;
  UserModel.findOne({username,password:md5(password)},filter,function (err,user) {
    if(user){
      res.cookie('userid',user._id,{maxAge:1000*60*60*24*7});
      res.send({code:0,user:{_id:user._id,data:user}});
    }else{
      res.send({code:1,msg:'用户名或密码错误'});
    }
  })
})*/
router.post('/login', function (req, res) {
  // 1. 获取请求参数数据(username, password)
  const {username, password} = req.body
  // 2. 处理数据: 根据username和password去数据库查询得到user
  UserModel.findOne({username, password: md5(password)}, filter, function (err, user) {
    // 3. 返回响应数据
    // 3.1. 如果user没有值, 返回一个错误的提示: 用户名或密码错误
    if(!user) {
      res.send({code: 1, msg: '用户名或密码错误'})
    } else {
      // 生成一个cookie(userid: user._id), 并交给浏览器保存
      res.cookie('userid', user._id, {maxAge: 1000*60*60*24*7})
      // 3.2. 如果user有值, 返回user
      res.send({code: 0, data: user}) // user中没有pwd
    }
  })
})


module.exports = router;
