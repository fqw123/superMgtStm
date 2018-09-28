var express = require('express');
var router = express.Router();
// 引入数据库

var connection=require("./conn");

connection.connect();
console.log("数据库连接成功");

router.post('/userAdd', function(req, res) {
  let {username,password,groups}=req.body;
  console.log(username);
  // 构建数据库

  const sqlstr=`insert into users(username,password,groups) values (?,?,?) `;
  const sqlparam=[username,password,groups];
  // 执行插入sql的语句

  connection.query(sqlstr,sqlparam,(err,data)=>{
    if(err){
      throw err;
    }else{
      if(data.affectedRows>0){
        res.send({"errcode":1,"msg":"添加成功"})
      }else{
        res.send({"errcode":0,"msg":"添加失败"})
      }

    }
  })
  // res.send('响应成功,巴拉拉');
});
//接收显示所有用户信息的请求
router.get('/userlist',(req,res)=>{
  // res.send('路由通了');
  // 构造sql数据
  const strsql='select * from users';
  // 执行去数据库查询函数
  connection.query(strsql,(err,data)=>{
        if(err){
          throw err;
        }else{
         res.send(data);
        }
  })
});
//修改操作
router.get('/altermsg',(req,res)=>{
 let {id}=req.query;
//  构造sql语句，从数据库找出这条数据
const sqlstr=`select * from users where id=${id}`;
console.log(sqlstr);
connection.query(sqlstr,(err,data)=>{
        if(err){
          throw err;
        }else{
          res.send(data);
        }
 })
});

router.post('/saveedit',(req,res)=>{
  let {username,password,groups,id}=req.body;
  
   const sqlsttr=`update users set username='${username}', password='${password}', groups='${groups}' where id=${id}`;
   console.log(sqlsttr);
   connection.query(sqlsttr,(err,data)=>{
     if(err){
       throw err;
     }else{
       console.log(data);

       if(data.affectedRows  > 0){
         res.send({"errcode":1,"msg":"修改成功"})
       }else{
        res.send({"errcode":0,"msg":"修改失败"})
       }
     }
   })
  })

//删除操作
router.get('/deletaUser',(req,res)=>{
  let {id}=req.query;
  const  dstrsql=`delete from users where id = ${id}`;
  connection.query(dstrsql,(err,data)=>{
    if(err){
      throw err;
    }else{
     if(data.affectedRows >0){
         res.send({"errcode":1,"msg":"删除成功"})  
     }else{
      res.send({"errcode":0,"msg":"删除失败"}) 
     }
    }
  })
 
  
})

module.exports = router;
