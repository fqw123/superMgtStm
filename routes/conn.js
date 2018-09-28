// 创建数据库连接的代码
// 1 引入mysql数据库
const mysql=require('mysql');
// 创建连接
const connection=mysql.createConnection({
    host:"localhost", //主机名
    user:'root',  //用户名
    password:'root',  //密码
    database:'admin',  //数据库名
});

// 把 connection暴露出去
module.exports=connection;
