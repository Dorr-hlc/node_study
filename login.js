const basics = require("./basic.js");
const send_email = require("./email.js");
const app = basics.app;
const db = basics.db;
const jwt = basics.jwt;
const secretKey = basics.secretKey;

// 登录接口
 app.post("/api/login", (req, res) => {
  const userinfo = req.body;
  const sqlstr = `select * from users where (username,password)=(?,?)`;
  const tokenStr = jwt.sign({ username: userinfo.username }, secretKey, {
    expiresIn: "7d",
  });
  db.query(sqlstr, [userinfo.username, userinfo.password], (err, results) => {
    if (err) return res.send({ status: 500, message: "登录失败", data: err });

    results.length == "0"
      ? res.send({
          status: 400,
          message: "用户不存在",
        })
      : res.send({
          status: 200,
          message: "登录成功",
          token: tokenStr,
        });
  });
});

// 注册接口
app.post("/api/register", (req, res) => {
  const userinfo_reg = req.body;
  const sqlstr_reg = "insert into users (username,password) value (? , ?)";
  userinfo_reg.password.length < 6
    ? res.send({
        status: 200,
        msg: "The password length shall not be less than 6 digits",
      })
    : db.query(
        sqlstr_reg,
        [userinfo_reg.username, userinfo_reg.password],
        (err, results) => {
          if (err)
            return res.send({ status: 500, message: "注册失败", data: err });
          res.send({
            status: 200,
            msg: "注册成功",
          });
        }
      );
});

// 获取登录信息的接口,需要token
app.get("/userinfo", (req, res) => {
  res.send({
    status: 200,
    message: "获取用户信息成功",
    data: req.user,
  });
});

// 关闭按钮
app.post("/close", (req, res) => {
  const sqlclose = "update users set status=1 where id=?";
  const id = req.body.id;
  db.query(sqlclose, id, (err, results) => {
    if (err)
      return res.send({
        status: 200,
        message: err.message,
      });
    res.send({
      status: 200,
      message: "success",
    });
  });
});

// 增加投票
app.post("/add", (req, res) => {
  const sqlclose =
    "UPDATE users set votesnum= IFNULL(votesnum,0)+1 WHERE id = (?);";
  const id = req.body.id;
  db.query(sqlclose, id, (err, results) => {
    if (err)
      return res.send({
        status: 200,
        message: err.message,
      });
    res.send({
      status: 200,
      message: "add success",
    });
  });
});
// 验证码
var rel_code = null;
// 发送验证码接口
app.get("/email", async (req, res) => {
    var email = req.query.email;
    rel_code = Math.random().toString().slice(-6); // 随机生成六位数
    var time = new Date().getTime();
    let sql = `SELECT * from login where email = '${email}' `;
    let data = await mysql(sql);
    if (data.length) {
      // 存在
      res.send({
        code: 500,
        msg: "邮箱已注册",
      });
    } else {
      var mail = {
        // 发件人
        from: `"侯某人"<*****@qq.com>`,//必须有<*****@qq.com>否则会报错Mail command failed: 502 Invalid paramenters
        // 主题
        subject: "验证码", //邮箱主题
        // 收件人
        to: email, //前台传过来的邮箱
        // 邮件内容，HTML格式
        text: "验证码为：" + rel_code, //发送验证码
      };
      // Initcode = code;
      send_email(mail);
      res.send({
        code: 200,
        icon: "success",
        msg: "发送成功",
      });
    }
  });


