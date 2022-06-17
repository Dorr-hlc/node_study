/*
 * @Copyright: Copyright© 2022 AOMEI
 * @Abstract:
 * @Date: 2022-06-17 15:14:09
 * @Author:
 * @LastEditors: houliucun
 * @LastEditTime: 2022-06-17 15:54:18
 * @RevisionHistory:
 */
const express = require("express");
const app = express();
// 链接数据库
const mysql = require("mysql");
const db = mysql.createPool({
  host: "127.0.0.1",
  user: "root",
  password: "admin123",
  database: "my_db_01",
});
// 安装导入jsonwebtoken和express-jwt包
const jwt = require("jsonwebtoken");
const expressJWT = require("express-jwt");

// 允许资源跨域共享
const cors = require("cors");
app.use(cors());

// 解析post表单数据的中间件
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
// 定义密钥
const secretKey = "dorr 6861243 (*^_^*)";
// 注册将 JWT 字符串解析还原成 JSON 对象的中间件
// 只要配置成功了 express-jwt 这个中间件，就可以把解析出来的用户信息，挂载到 req.user 属性上
app.use(expressJWT({ secret: secretKey }).unless({ path: [/^\/api\//] }));

// 全局错误中间件
app.use((err, req, res, next) => {
  if (err.name === "UnauthorizedError") {
    return res.send({
      status: 401,
      message: "登录失效，请重新登录",
    });
  }
  res.send({
    status: 500,
    message: "未知的错误",
  });
});
app.listen(80, () => {
  console.log("server is running at http://127.0.0.1");
});
module.exports = {
  db,
  app,
  jwt,
  secretKey,
};
