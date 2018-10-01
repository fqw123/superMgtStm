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
// 检查用户是否成功
router.post('/checklogin',(req,res)=>{
   let {userName,password}=req.body;
   let mysqlstr=`select * from  users where userName='${userName}' and password='${password}' `;
   connection.query(mysqlstr,(err,data)=>{
    if(err){
      throw err;
    }else{
      // console.log(data);
      if(data.length){
        res.cookie('userId',data[0].id);
        res.cookie('username',data[0].username);
        res.cookie('password',data[0].password);
        res.cookie('groups',data[0].groups);
        res.send({"errcode":1,"msg":"登录成功"});
             
      }else{
        res.send({"errcode":0,"msg":"登录失败"})
      }
    }
   })
  
});

//检测用户是否已经登陆
router.get("/checkislogin",(req,res)=>{
  let username = req.cookies.username;
  console.log(username);
  if(username){
      res.send(console.log(""));
  }else{
    // console.log("进入else：  " + username);
    // 前端页面已经有<script>不用再包了<script>s
       res.send(`alert('请先登录');location.href='http://localhost:2102/login.html'`);
      
  }
})
// 退出登陆
router.get("/outlogin",(req,res)=>{
  res.clearCookie('username');
  res.clearCookie('groups');
  res.clearCookie('password');
  res.clearCookie('userId');
  res.send(`<script>alert('大侠，在来玩呀');location.href='http://localhost:2102/login.html'</script>`);
  
})


// 修改密码
// 检查旧密码是否正确
router.get("/checkoldpsd",(req,res)=>{
 let {oldpassword}=req.query;
 let id=req.cookies.userId;
 const sqlstr=`select * from users where  id=${id}`;
  connection.query(sqlstr,(err,data)=>{
    if(err){
      throw err;
    }else{
      if(data[0].password===oldpassword){
        res.send({"errcode":1,"msg":"旧密码输入正确"});
      }else{
        res.send({"errcode":0,"msg":"旧密码输入错误"});
      }
    }
  })

})
//保存新密码
router.get('/saveNewPsd',(req,res)=>{
   let {newpassword}=req.query;
   const  id=req.cookies.userId;
   const sqlstrs=`update users set password='${newpassword}' where id=${id} `;
   connection.query(sqlstrs,(err,data)=>{
     if(err){
       throw err;

     }else{
       if(data){
         res.send({"errcode":1,msg:"修改成功"})
       }else{
         res.send({"errcode":0,msg:"修改失败"})
       }
     }
   })
})
//接收显示所有用户信息的请求
router.get('/userlist',(req,res)=>{

//  接收分页发来的数据
let { pageSize,currentPage}=req.query;
  // 构造sql数据
let  strsql='select * from users';
  // 执行去数据库查询函数
  connection.query(strsql,(err,data)=>{
        if(err){
          throw err;
        }else{
          let totalcount=data.length;
          // 跳过n条数据
          let n=(currentPage-1)*pageSize;
          // order前要有空格，否则拼接语句不正确
          strsql+=` order by ctime desc limit ${n},${pageSize}`;
          connection.query(strsql,(err,data)=>{
            if(err){
               throw err;
            }else{
              // res.send("11111");
              res.send({"totalcount":totalcount,"pageData":data});
             
            }
          })
           
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
});

// 批量删除
router.post('/batchesDel',(req,res)=>{
       let idArr=req.body['idArr[]']
      //  遍历id数组并删除
       const desqlstr=`delete from users where id in (${idArr})`;
    connection.query(desqlstr,(err,data)=>{
      console.log(data);
      if(err){
        throw err;
      }else{
        console.log(data.affectedRows);
          if(data.affectedRows>0){
           res.send({"errcode":1,"msg":"删除成功"})
          }else{
            res.send({"errcode":0,"msg":"删除失败"})
          }
      }
    })
      

  
})



module.exports = router;
