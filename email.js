/*
 * @Copyright: Copyright© 2022 AOMEI
 * @Abstract: 
 * @Date: 2022-06-17 16:03:13
 * @Author: 
 * @LastEditors: houliucun
 * @LastEditTime: 2022-06-17 16:03:17
 * @RevisionHistory: 
 */
// 邮箱验证
const nodemailer = require("nodemailer");
// 创建smtp服务器 —— 邮箱验证
const config = {
  host: "smtp.qq.com",//邮箱服务的主机
  port: 465,//对应的端口号
  secureConnection: true,
  service: "qq",
  auth: {
    user: "1726660621@qq.com",//发件人邮箱账号
    pass: "addvrhqpgudwdjga",//邮箱的授权码
  },
};
// 创建一个SMTP客户端对象
const transporter = nodemailer.createTransport(config);
// 发送邮件
module.exports = function (mail) {
  transporter.sendMail(mail, (err, info) => {
    if (err) return console.log(err);
  });
};

