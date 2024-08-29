//查看日志: "docker logs -f -n 10 navidrome-nginx 2>&1  | grep js:"

//全局配置
const NavidromeHost = 'http://172.17.0.1:4533'; //Navidrome地址
const NavidromeUserName = 'username'; //Navidrome用户名
const NavidromePassword = 'password'; //Navidrome密码
const NavidromePath = '/music'; //Navidrome音乐目录 默认 /music
const AlistPath = '/Media/MUSIC'; //Alist音乐目录
const AlistHost = 'http://47.109.*.*:5244/d'; //Alist公网访问地址
const AlistToken = 'alist-1bfcf3aa-b1b0-4487-a2fa-bfd35f6587f98HCr1H9enUKHqjM7ZcKdtcRniD19Hk*******************'; //Alist Token
function Navidrome(r) {
    return NavidromeHost;
}

async function fetchNavidromeLogin() {
    try {
        const uri = `${NavidromeHost}/auth/login`;
        const body = `{"username": "${NavidromeUserName}", "password": "${NavidromePassword}"}`;
        const res = await ngx.fetch(uri, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
                'Content-Length': body.length,
            },
            body: body,
            max_response_body_size: 65535,
        });
        if (res.ok) {
            const result = await res.json();
            if (result === null || result === undefined) {
                return `error: Navidrome API response is null`;
            }

            return result.token;
        }
        else {
            return (`error: Navidrome API ${res.status} ${res.statusText}`);
        }
    }
    catch (error) {
        return (`error: Navidrome API fetch failed,  ${error}`);
    }
}

async function fetchNavidromeSong(id, token) {
    try {
        const uri = `${NavidromeHost}/api/song?id=${id}`;
        const res = await ngx.fetch(uri, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
                'Content-Length': 0,
                'x-nd-authorization': `Bearer ${token}`,
            },
            max_response_body_size: 65535,
        });
        if (res.ok) {
            const result = await res.json();
            if (result === null || result === undefined) {
                return `error: Navidrome API response is null`;
            }

            return result[0].path.replace(NavidromePath, AlistPath);
        }
        else {
            return (`error: Navidrome API ${res.status} ${res.statusText}`);
        }
    }
    catch (error) {
        return (`error: Navidrome API fetch failed,  ${error}`);
    }
}

async function Stream(r) {
    const token = await fetchNavidromeLogin();
    if (token.startsWith('error')) {
        r.error(token);
        r.return(500, token);
        return;
    }
    
    const path = await fetchNavidromeSong(r.args.id, token);
    if (path.startsWith('error')) {
        r.error(path);
        r.return(500, path);
        return;
    }
    
    const url = `${AlistHost}${path}${sign(AlistToken, path)}`;
   
    r.return(302, url);
    return;
}

const crypto = require('crypto');
function sign(secretKey, data) {
    if (secretKey === "") {
        return "";
    }
    const h = crypto.createHmac('sha256', secretKey);
    const expireTimeStamp = "0";
    h.update(data + ":" + expireTimeStamp);
    const signature = h.digest('base64').toString().replace(/\+/g, '-').replace(/\//g, '_');
    return `?sign=${signature}:0`;
}

export default { Navidrome, Stream };
