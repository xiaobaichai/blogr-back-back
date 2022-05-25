const express=require('express');
const md5 = require('md5');
const S_KEY='lasjkdfsoad8'
const router =express.Router()
const formidable=require('formidable')
const path=require('path')
const jwt =require('jsonwebtoken')

//设置默认头像地址
const default_avatar_path='http://localhost:3000/avatar/default.jpeg'
//设置头像上传文件夹
// const avatar_path='http://localhost:3000/avatar/'

//设置头像上传文件夹
const carousel_path='http://localhost:3001/carousel/'

//设置jwt密钥
const secret = 'slkfjsldfjsidfj8s'


// 连接数据库
const connection =require('../db/db.js');
const { log } = require('console');

connection.query('SELECT 1 + 1 AS solution', function (error, results, fields) {
    if (error) throw error;
    console.log('The solution is: ', results[0].solution);
  });

  //定时（3h）ping数据库，保持数据库连接状态（默认8小时不访问数据库则自动断开）
  var pingInterval =null
  clearInterval(pingInterval);
  pingInterval = setInterval(function(){
      connection.ping(function(err){
        if(err) log(err)
        console.log('pinged');
      })
  }, 3600000*3);

//   router.post('/api/test',(req,res,next)=>{
//     connection.query('select * from admin',(err,results,fields)=>{
//         if(err) return next(err)
//         const token = jwt.sign({
//           data:results
//         },
//         'secret',
//         {
//           expiresIn:3600
//         })
//         res.json({
//             code:0,
//             data:token,
//             message:'OK'
//         })
//     })
// })

  // 接口==================================================================
  //登录
  router.post('/api/login',(req,res,next)=>{
    connection.query('select nickname,avatar_src,role from admin where nickname=? and password=?',[req.body.username,req.body.password],(err,results,fields)=>{
        if(err) return next(err)
        // console.log(req.body);
        // console.log(results);
        //用户或密码错误
        if(results.length===0){
          res.json({
            code:1,
            message:'请输入正确的用户名和密码'
          })
          return
        }
        //验证通过返回jwt
        const token = jwt.sign({
          data:results[0]
        },
        secret,
        {
          expiresIn:60*60*24
        })
        res.json({
            code:0,
            data:token,
            message:'OK'
        })
    })
})

//设置======================================================================
//上传轮播图
router.post('/api/uploadCarousel',(req,res,next)=>{
  const form =formidable({
    uploadDir:path.join(__dirname,'../uploads/carousel'),
    keepExtensions:true,
    allowEmptyFiles:false
})
form.parse(req,(err,form_fields,files)=>{
    if(err){
        next(err)
        return
    }
    if(!files.file){
        res.json({
            code:1,
            message:'上传的图片不能为空'
        })
        return
    }
    connection.query('update carousel set src=?,description=?,link=? where id=?',[carousel_path+files.file.newFilename,form_fields.description,form_fields.link,Number(form_fields.index)+1],(err,results,fields)=>{
        if(err){
          res.json({
            code:2,
            message:'服务器错误'
          })
          return
        }
        res.json({
            code:0,
            message:'上传成功'
        })
    })
})
})

//下载轮播图
router.get('/api/downloadCarousel',(req,res,next)=>{
  connection.query('select * from carousel',(err,results,fields)=>{
    if(err){
      return err
    }
    res.json({
      code:0,
      data:results,
      message:'ok'
    })
  })
})

//用户==========================================================================
//获取用户信息
router.get('/api/getUserData',(req,res,next)=>{
  connection.query('select nickname as name,id from user',(err,results,fields)=>{
    if(err) {
      res.json({
        code:1,
        message:'服务端错误'
      })
      return
    }
    res.json({
      code:0,
      data:results,
      message:'ok'
    })
  })
})

//留言========================================================================
router.get('/api/getMessage',(req,res,next)=>{
  connection.query('select user_id as userId,nickname as name,content,reply from message',(err,results,fields)=>{
    if(err){
      res.json({
        code:1,
        message:'服务端错误'
      })
      return
    }
    res.json({
      code:0,
      data:results,
      message:'ok'
    })
  })
})

//home======================================================================
router.get('/api/getArticleCount',(req,res,next)=>{
  connection.query('select count(*) as articleCount from article',(err,results,fields)=>{
    if(err){
      res.json({
        code:1,
        message:'服务端错误'
      })
      return
    }
    res.json({
      code:0,
      data:results,
      message:'ok'
    })
  })
})

router.get('/api/getMessageCount',(req,res,next)=>{
  connection.query('select count(*) as messageCount from message',(err,results,fields)=>{
    if(err){
      res.json({
        code:1,
        message:'服务端错误'
      })
      return
    }
    res.json({
      code:0,
      data:results,
      message:'ok'
    })
  })
})
//'update carousel set src=? , description=? , link=? where id=?',[carousel_path+files.file.newFilename,form_fields.description,form_fields.link,Number(form_fields.index)]
  //为登录用户设置session


  //主页=====================================================================
  //获取主页信息

  //文章=====================================================================
  //分页获取文章及文章总数

  //删除指定文章

  //修改指定文章

  //查询文章

  //写文章

//留言=======================================================================
  //获取留言信息

  //留言信息删除

//用户管理====================================================================
//删除用户

//获取指定用户留言

//设置========================================================================
//上传轮播图图片

//修改站点信息（如个人简介）






















// 接口目录===================================================

// router.get('/',(req,res)=>{
//     res.send('hi')
// })

// router.get('/session',(req,res)=>{
//     res.setHeader('Content-Type', 'text/html')
//     res.write('<p>views: ' + req.session.views + '</p>')
//     res.write('<p>expires in: ' + (req.session.cookie.maxAge / 1000) + 's</p>')
//     res.end()
// })

// router.get('/sessionTest2',(req,res)=>{
//     req.session.user_nickname='randy'
//     res.send('ok')
// })

// router.get('/cookie',(req,res)=>{
//     res.cookie('testid','1234')
//     res.send('get cookie')
// })

//Nav导航条
//根据cookie请求用户信息
// router.get('/api/get_user_acount',(req,res,next)=>{
//     if(req.session.user_id) {
//         return res.json({
//             code:0,
//             data:{
//                 user_id:req.session.user_id,
//                 nick_name:req.session.nickname,
//                 avatar_src:req.session.avatar_src
//             },
//         })
//     }
//     return res.json({
//         code:1,
//         message:'非法'
//     })
// })
//关于session的坑：前提（每个用户，无论是否注册过，都会为其生成一个session元组存储在
//session表中）
//req.session指携带cookie的用户对应的一个session元组
//req.session.id表示session元组中的session_id项
//req.session.XXXXX表示session元组中data项中cookie内的自定义值
//如在用户登录成功时设置：req.session.user_id='randy'
//则在后续做用户权限验证时可以使用if(req.session.user_id)来判断
//该用户是否为注册过的用户。
//注意不要用(req.session.id)来判断用户是否注册过，因为每个进入过
//站点的用户都可以访问到其req.session.id。

// router.post('/api/testupload',(req,res,next)=>{
//     const form =formidable({
//         uploadDir:path.join(__dirname,'../uploads/test'),
//         keepExtensions:true
//     })
//     form.parse(req,(err,fields,files)=>{
//         if(err){
//             next(err)
//             return
//         }
//         res.json({fields,files})
//     })
// })


//首页==================================================================
//获取首页轮播图
// router.get('/api/carousel',(req,res,next)=>{
//     connection.query('select * from carousel',(err,results,fields)=>{
//         if(err) return next(err)
//         res.json({
//             code:0,
//             data:results,
//             message:'OK'
//         })
//     })
// })
// //获取文章总数做分页加载
// router.get('/api/article_count',(req,res,next)=>{
//     connection.query('select count(*) as count from article',(err,results,fields)=>{
//         if(err) return next(err)
//         res.json({
//             code:0,
//             data:results,   
//             message:'OK'
//         })
//     })
// })

// //按照分页获取最新文章（预览内容）
// router.get('/api/new_articles',(req,res,next)=>{
//     connection.query('select id,title,left(content,49) as pre_content,tag,read_count from article limit '+(req.query.page-1)*8+','+req.query.count,(err,results,fields)=>{
//         if(err) return next(err)
//         res.json({
//             code:0,
//             data:results,
//             message:'OK'
//         })
//     })
// })

// //按照分页获取热门文章（预览内容）
// router.get('/api/hot_articles',(req,res,next)=>{
//     connection.query('select id,title,left(content,49) as pre_content,tag,read_count from article order by read_count desc limit '+req.query.count,(err,results,fields)=>{
//         if(err) return next(err)
//         res.json({
//             code:0,
//             data:results,
//             message:'OK'
//         })
//     })
// })

// //分类页==================================================================
// //根据分类获取文章总数做分页
// router.get('/api/category_articles_count',(req,res,next)=>{
//     if(req.query.tag==='all'){
//         connection.query('select count(*) as count from article',(err,results,fields)=>{
//             if(err) return next(err)
//             res.json({
//                 code:0,
//                 data:results,
//                 message:'OK'
//             })
//         })
//     }
//     else{
//         connection.query('select count(*) as count from article where tag=?',[req.query.tag],(err,results,fields)=>{
//             if(err) return next(err)
//             res.json({
//                 code:0,
//                 data:results,
//                 message:'OK'
//             })
//         })
//     }
// })

// //根据分类获取文章（预览内容）
// router.get('/api/category_articles',(req,res,next)=>{
//     if(req.query.tag==='all'){
//         connection.query('select id,title,left(content,49) as pre_content,tag,read_count from article limit '+req.query.count,(err,results,fields)=>{
//             if(err) return next(err)
//             res.json({
//                 code:0,
//                 data:results,
//                 message:'OK'
//             })
//         })
//     }
//     else{
//         connection.query('select id,title,left(content,49) as pre_content,tag,read_count from article where tag=?'+' '+'limit '+req.query.count,[req.query.tag],(err,results,fields)=>{
//             if(err) return next(err)
//             res.json({
//                 code:0,
//                 data:results,
//                 message:'OK'
//             })
//         })
//     }
// })

// //根据分类获取分页文章（预览内容）
// router.get('/api/category_articles_by_page',(req,res,next)=>{
//     console.log(req.query.tag,req.query.page,req.query.count);
//     if(req.query.tag==='all'){
//         connection.query('select id,title,left(content,49) as pre_content,tag,read_count from article limit '+(req.query.page-1)*8+','+req.query.count,(err,results,fields)=>{
//             if(err) return next(err)
//             res.json({
//                 code:0,
//                 data:results,
//                 message:'OK'
//             })
//         })
//     }
//     else{
//         connection.query('select id,title,left(content,49) as pre_content,tag,read_count from article where tag='+req.query.tag+' '+'limit '+(req.query.page-1)*req.query.count+','+req.query.count,(err,results,fields)=>{
//             if(err) return next(err)
//             res.json({
//                 code:0,
//                 data:results,
//                 message:'OK'
//             })
//         })
//     }
// })

// //留言页==================================================================
// //获取留言总数做分页加载
// router.get('/api/message_count',(req,res,next)=>{
//     connection.query('select count(*) as count from message',(err,results,fields)=>{
//         if(err) return next(err)
//         res.json({
//             code:0,
//             data:results,
//             message:'OK'
//         })
//     })
// })

// //按照分页获取最新留言
// router.get('/api/new_messages',(req,res,next)=>{
//     connection.query('select content from message order by id limit '+(req.query.page-1)*8+','+req.query.count,(err,results,fields)=>{
//         if(err) return next(err)
//         res.json({
//             code:0,
//             data:results,
//             message:'OK'
//         })
//     })
// })

// //按照分页获取热门留言
// router.get('/api/hot_message',(req,res,next)=>{
//     connection.query('select content from message order by id limit 8',(err,results,fields)=>{
//         if(err) return next(err)
//         res.json({
//             code:0,
//             data:results,
//             message:'OK'
//         })
//     })
// })

// //回复某个留言
// router.post('/api/request_message',(req,res,next)=>{
//     connection.query('insert into message_comment(user_id,content) values(?,?)',[my_id,my_value],(err,results,fields)=>{
//         if(err) return next(err)
//         res.json({
//             code:0,
//             message:'OK'
//         })
//     })
// })


// //获取子留言
// // var message_id_arr=[1,2,3]
// // function get_message_comment(){
// //     return new Promise((resolve,reject)=>{
// //         var res_arr=[]
// //     for(var i=1;i<=message_id_arr.length;i++){
// //         connection.query('select *  from message_comment where message_id=?',[i],(err,results,fields)=>{
// //             if(err) return next(err)
// //             res_arr.push(results)
// //             console.log(i);
// //             if(res_arr.length===message_id_arr.length){
// //                 resolve(res_arr)
// //             }
// //         })
// //     }
// //     })
// // }
// // router.get('/api/message_comment',(req,res,next)=>{
// //     get_message_comment().then((contents)=>{
// //         res.json({
// //             code:0,
// //             data:contents,
// //             message:'OK'
// //         })
// //     })  
// // })
// router.get('/api/message_comment',(req,res,next)=>{
//     var message_id_arr=[1,2,3]
//     var res_arr=[]
//     for(var i=1;i<=message_id_arr.length;i++){
//         connection.query('select * from message_comment where message_id=?',[i],(err,results,fields)=>{
//             if(err) return next(err)
//             res_arr.push(results)
//             if(res_arr.length===message_id_arr.length){
//                 res.json({
//                         code:0,
//                         data:res_arr,
//                         message:'OK'
//                 })
//             }
//         })
//     }
// })

// //写留言
// router.post('/api/leave_message',(req,res,next)=>{
//     connection.query('insert into message(user_id,content) value(?,?)',[req.body.user_id,req.body.content],(err,results,fields)=>{
//         if(err) return next(err)
//         res.json({
//             code:0,
//             message:'添加留言成功'
//         })
//     })
// })

// //写留言评论
// router.post('/api/leave_message_comment',(req,res,next)=>{
//     connection.query('insert into message_comment(message_id,content) value(?,?)',[req.body.message_id,req.body.content],(err,results,fields)=>{
//         if(err) return next(err)
//         res.json({
//             code:0,
//             data:results,
//             message:'OK'
//         })
//     })
// })

// //资源页==================================================================
// //获取所有分类的资源
// router.get('/api/category_source',(req,res,next)=>{
//         connection.query('select * from source where tag=?',[req.query.category],(err,results,fields)=>{
//             if(err) return next(err)
//                 res.json({
//                     code:0,
//                     data:results,
//                     message:'OK'
//                 })
//         })
// })

// //注册登录页==============================================================
// //注册
// router.post('/api/regist',(req,res,next)=>{
//     connection.query('select * from user where user.nickname=?',[req.body.nickname],(err,results,fields)=>{
//         if(err) return next(err)
//         if(results.length===0){
//             connection.query('insert into user(nickname,password,avatar_src) value(?,?,?)',[req.body.nickname,md5(req.body.password+S_KEY),default_avatar_path],(err,results,fields)=>{
//                 if(err) return next(err)
//                 res.json({
//                     code:0,
//                     message:'注册成功'
//                 })
//             })
//         }
//         else{
//             return res.json({
//                 code:1,
//                 message:'该昵称已注册'
//             })
//         }
//     })
// })

// //登录
// router.post('/api/login',(req,res,next)=>{
//     connection.query('select * from user where user.nickname=?',[req.body.nickname],(err,results,fields)=>{
//         if(err) return next(err)
//         if(results.length===0){
//             res.json({
//                 code:1,
//                 message:'该昵称未注册'
//             })
//         } 
//         else{
//             connection.query('select * from user where user.nickname=? and user.password=?',[req.body.nickname,md5(req.body.password+S_KEY)],(err,results,fields)=>{
//                 if(err) return next(err)
//                 if(results.length===0){
//                     res.json({
//                         code:2,
//                         message:'密码错误'
//                     })
//                 }
//                 else{
//                     connection.query('select * from user where user.nickname=?',[req.body.nickname],(err,results,fields)=>{
//                         if(err) return next(err)
//                         req.session.user_id=results[0].id
//                         req.session.nickname=results[0].nickname
//                         req.session.avatar_src=results[0].avatar_src
//                         req.session.profile='这个人太懒了，啥都不想写'
//                         res.json({
//                             code:0,
//                             message:'登陆成功'
//                         })
//                     })
//                 }
//             })
//         }
//     })
// })

// //验证码（防机器频繁注册）

// //用户个人中心页===========================================================
// //登陆成功时请求此接口获取个人信息(前端请求此接口)   或者   在cookie有效期类进入站点时获取个人信息（前端请求此接口）
// router.get('/api/get_user_acount',(req,res,next)=>{
//     if(req.session.user_id){
//         res.json({
//             code:0,
//             data:{
//                 user_id:req.session.user_id,
//                 user_info:{
//                     nickname:req.session.nickname,
//                     avatar_src:req.session.avatar_src,
//                     profile:req.session.profile
//                 }
//             },
//             message:'获取个人信息成功'
//         })
//     }
//     else{
//         res.json({
//             code:1,
//             message:'未登录状态'
//         })
//     }
// })

// //登出，结束当前session会话
// router.get('/api/logout',(req,res,next)=>{
//     req.session.destroy()
//     res.json({
//         code:0,
//         message:'注销成功'
//     })
// })

// router.post('/api/testupload',(req,res,next)=>{
//     const form =formidable({
//         uploadDir:path.join(__dirname,'../uploads/test'),
//         keepExtensions:true
//     })
//     form.parse(req,(err,fields,files)=>{
//         if(err){
//             next(err)
//             return
//         }
//         res.json({fields,files})
//     })
// })

// //上传/修改头像
// router.post('/api/upload_avatar',(req,res,next)=>{
//     const form =formidable({
//         uploadDir:path.join(__dirname,'../uploads/avatar'),
//         keepExtensions:true,
//         allowEmptyFiles:false
//     })
//     form.parse(req,(err,form_fields,files)=>{
//         if(err){
//             next(err)
//             return
//         }
//         if(!files.file){
//             res.json({
//                 code:1,
//                 message:'上传的图片不能为空'
//             })
//         }
//         connection.query('update user set avatar_src=? where id=?',[avatar_path+files.file.newFilename,form_fields.userId],(err,results,fields)=>{
//             if(err){
//                 return next(err)
//             }
//             req.session.avatar_src=avatar_path+files.file.newFilename
//             res.json({
//                 code:0,
//                 message:'上传头像成功'
//             })
//         })
//     })
// })

// //修改个人简介
// 2
// //文章详情页===============================================================
// router.get('/api/article_detail',(req,res,next)=>{
//     connection.query('select * from article where id=?',[req.query.id],(err,results,fields)=>{
//         if(err) return next(err)
//         res.json({
//             code:0,
//             data:results,
//             message:'获取文章成功'
//         })
//     })
// })

// //用户查看文章次数+1

// //用户点赞

// //用户收藏

// //获取文章查看次数总数

// //获取点赞数

// //获取收藏数

// //搜索结果页===============================================================
// //根据关键词请求文章（预览内容）
// router.post('/api/search_article',(req,res,next)=>{
//     connection.query('select * from article where article.content like "%"'+'?'+'"%"',[req.body.keywords],(err,results,fields)=>{
//         if(err) return next(err)
//         console.log(req.body.keywords);
//         console.log(results);
//         res.json({
//             code:0,
//             data:results,
//             message:'搜索成功'
//         })
//     })
// })




module.exports=router