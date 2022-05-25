const express =require('express')
const app=express()
const path = require("path")
// 引入body-parser处理不带文件的post请求
const bodyParser=require('body-parser')

//引入express-session为用户设置session
// const session =require('express-session')
//引入express-mysql-session将为用户设置的session存储在mysql中
// const Store =require('express-mysql-session')(session)
// let options={
//     host:'localhost',
//     user:'root',
//     password:'123456',
//     port:'3306',
//     database:'blogr',
//     schema: {
// 		tableName: 'sessions_admin',
// 		columnNames: {
// 			session_id: 'session_id',
// 			expires: 'expires',
// 			data: 'data'
// 		}
//     } 
// }
// let sessionStore =new Store(options)
// app.use(session({                   //为用户设置session
//     name:'sidbg',
//     secret:'sdfjlskdf.&',
//     resave:false,
//     saveUninitialized:false,    //saveUninitialized:true是指无论有没有session cookie，每个请求都设置一个session cookie
//     store:sessionStore,           //session持久化
//     cookie:{maxAge:1000*3600*24*3}        //表示cookie过期时间
// }))

//配置body-parser中间件
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//开放静态资源
//如localhost:3000/avatar/default.jpeg   而不是如localhost:3000/uploads/avatar/default.jpeg 
app.use(express.static(path.join(__dirname, "../public/")));
app.use(express.static(path.join(__dirname, "../uploads/")));
app.use(express.static(path.join(__dirname, "../dist/"), { maxAge: 86400000 }));

//设置允许跨域访问该服务. 
app.all("*", function (req, res, next) {
    //允许特定源访问
    res.header("Access-Control-Allow-Origin", "http://localhost:9528");
    //允许跨域请求携带凭证如cookie.SSL认证（同源策略默认不允许携带凭证）
    res.header("Access-Control-Allow-Credentials", "true");
    //允许的跨域请求头部字段
    res.header("Access-Control-Allow-Headers", "*");
    //允许的跨域请求类型
    res.header("Access-Control-Allow-Methods", "*");
    // res.header("Content-Type", "application/json;charset=utf-8");
    next();
  });

//配置模板引擎art-template
app.engine("html", require("express-art-template"));
//设置模板目录
app.set("views", path.join(__dirname, "../views"));

// 引入路由
const router =require("../routes/index.js")
// 挂载路由
app.use(router)


app.listen(3001,()=>{
    console.log(`Server running at...`)
})