# 修改conf.d/navidrome.js全局配置

```
const NavidromeHost = 'http://172.17.0.1:4533'; //Navidrome地址
const NavidromeUserName = 'username'; //Navidrome用户名
const NavidromePassword = 'password'; //Navidrome密码
const NavidromePath = '/music'; //Navidrome音乐目录 默认 /music
const AlistPath = '/Media/MUSIC'; //Alist音乐目录
const AlistHost = 'http://47.109.*.*:5244/d'; //Alist公网访问地址
const AlistToken = 'alist-*******************'; //Alist Token

```
# Docker部署
```
docker run -d --restart=unless-stopped -v <path>/nginx.conf:/etc/nginx/nginx.conf -v <path>/conf.d:/etc/nginx/conf.d -p <port>:80 --name navidrome-nginx nginx:alpine

path: navidrome-nginx路径
port: 外网访问端口
```
# 注意事项
```
1. 请修改conf.d/navidrome.js全局配置
2. 目前不支持v6访问，请使用v4地址，如需v6请自行修改nginx和navidrome.js配置
3. 需要保持alist的目录和navidrome的目录一致
```