/**
 * 脚本地址:  https://raw.githubusercontent.com/yml2213/javascript/master/gjjjhyjlb/gjjjhyjlb.js
 * 转载请留信息,谢谢
 *
 * 顾家家居会员俱乐部  小程序
 *
cron: 20 7,12  * * *
 *
 * 6-12		完成 签到 任务 (圈x v2p兼容测试中)
 *
 * 感谢所有测试人员
 * ========= 青龙--配置文件 =========
 * 变量格式: export gjjjhyjlb_data='X-Customer & Authorization @X-Customer & Authorization '   ,多账号用 换行 或 @ 分割
 * 抓包 club-server/front/member/home  包, 找到 Authorization ,X - Customer 即可
 * ========= 重写 (测试中,有问题群里 @ 我吧) =========
 * url:   club-server/front/member/home
 * 类型:   script-request-header
 * 路径:   https://raw.githubusercontent.com/yml2213/javascript/master/gjjjhyjlb/gjjjhyjlb.js
 * 域名:   mc.kukahome.com
 * ====================================
 * tg频道: https://t.me/yml2213_tg
 * tg群组: https://t.me/yml_tg
 *
 */

const $ = new Env("顾家家居会员俱乐部");
const notify = $.isNode() ? require("./sendNotify") : "";
const Notify = 1 		//0为关闭通知,1为打开通知,默认为1
const debug = 0			//0为关闭调试,1为打开调试,默认为0
//---------------------------------------------------------------------------------------------------------
let ckStr = ($.isNode() ? process.env.gjjjhyjlb_data : $.getdata('gjjjhyjlb_data')) || '';
let msg, ck, ck_status;
let host = 'mc.kukahome.com';
let hostname = 'https://' + host;
//---------------------------------------------------------------------------------------------------------
let VersionCheck = "0.1.4"
let Change = '增加圈x v2p兼容,自行测试吧!'
let thank = `\n感谢 心雨 的投稿\n`
//---------------------------------------------------------------------------------------------------------

async function tips(ckArr) {
    let Version_latest = await Version_Check('gjjjhyjlb');
    let Version = `\n📌 本地脚本: V 0.1.4  远程仓库脚本: V ${Version_latest}`
    DoubleLog(`${Version}\n📌 🆙 更新内容: ${Change}`);
    DoubleLog(`${thank}`);
    await wyy();
    DoubleLog(`\n========== 共找到 ${ckArr.length} 个账号 ==========`);
    debugLog(`【debug】 这是你的账号数组:\n ${ckArr}`);
}


!(async () => {
    if (typeof $request !== "undefined") {  // 严格不相等
        await GetRewrite();
    } else {
        let ckArr = await Variable_Check(ckStr, "gjjjhyjlb_data");
        await tips(ckArr);
        for (let index = 0; index < ckArr.length; index++) {
            let num = index + 1;
            DoubleLog(`\n-------- 开始【第 ${num} 个账号】--------`);
            ck = ckArr[index].split("&");
            debugLog(`【debug】 这是你第 ${num} 账号信息:\n ${ck}`);
            await start();
        }
        await SendMsg(msg);
    }

})()
    .catch((e) => $.logErr(e))
    .finally(() => $.done());


async function start() {

    console.log("\n开始 用户信息");
    await user_info(1);

    if (!ck_status) {
        console.log("\n开始 签到信息");
        await sign_info();

    }

}



// 重写 测试中
// https://mc.kukahome.com/club-server/front/member/home
async function GetRewrite() {
    if ($request.url.indexOf("club-server/front/member/home") > -1) {
        let ck_az = $request.headers.Authorization;
        let ck_id = $request.headers['X-Customer'];
        ck = `${ck_id}&${ck_az}`;
        if (ckStr) {
            if (ckStr.indexOf(ck_id) == -1) {  // 找不到返回 -1
                ckStr = ckStr + "@" + ck;
                $.setdata(ckStr, "gjjjhyjlb_data");
                ckList = ckStr.split("@");
                $.msg($.name + ` 获取第${ckList.length}个 ck 成功: ${ck}`);
            }
        } else {
            $.setdata(ck, "gjjjhyjlb_data");
            $.msg($.name + ` 获取第1个 ck 成功: ${ck}`);
        }
    }
}







/**
 * 用户信息    httpPost
 * https://mc.kukahome.com/club-server/front/member/personalCenter
 * https://mc.kukahome.com/club-server/front/member/memberInformation
 *
 */
async function user_info(task) {
    let Option = {
        url: `${hostname}/club-server/front/member/personalCenter`,
        headers: {
            'Host': host,
            'X-Customer': ck[0],
            'brandCode': 'K001',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ "authorization": ck[1] })
    };
    let result = await httpPost(Option, `用户信息`);

    if (result.source) {
        if (task == 1) {
            DoubleLog(`欢迎: ${result.name} ,目前有积分 ${result.point}`);
            customerId = result.customerId;
        } else if (task == 2) {
            DoubleLog(`积分查询:签到后有积分 ${result.point}`);
        }
    } else {
        DoubleLog(`用户信息: 失败 ❌ 了呢,原因未知!`);
        console.log(result);
        return ck_status = false;
    }
}


/**
 * 签到信息    httpPost
 * https://mc.kukahome.com/club-server/front/member/calendar
 */
async function sign_info() {
    let Option = {
        url: `${hostname}/club-server/front/member/calendar`,
        headers: {
            'Host': host,
            'X-Customer': ck[0],
            'brandCode': 'K001',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ "membershipId": ck[0], "authorization": ck[1] })
    };
    let result = await httpPost(Option, `签到信息`);

    // console.log(result);
    if (result.membershipId) {

        if (result.isTodaySigned == false) {
            DoubleLog(`签到信息: 今天还未签到 ,去签到喽!`);
            await wait(2);
            await signIn();
        } else if (result.isTodaySigned == true) {
            DoubleLog(`签到信息: 今天已经签到了 ,明天再来吧!`);
        }
    } else {
        DoubleLog(`签到信息: 失败 ❌ 了呢,原因未知!`);
        console.log(result);
    }
}






/**
 * 签到    httpRequest
 * https://mc.kukahome.com/club-server/front/member/signIn
 */
async function signIn() {
    let Option = {
        method: 'POST',
        url: `${hostname}/club-server/front/member/signIn`,
        headers: {
            'Host': host,
            'X-Customer': ck[0],
            'brandCode': 'K001',
            'content-type': 'application/json',
        },
        body: JSON.stringify({ "identityType": "mobile", "membershipId": ck[0], "customerId": customerId, "authorization": ck[1] })
    };
    let result = await httpRequest(Option, `签到`);

    if (result.status == 200) {
        DoubleLog(`签到: 成功 🎉`);
        await wait(3);
        await user_info(2);
    } else if (result.status == 400) {
        DoubleLog(`签到信息: ${result.message}`);
    } else {
        DoubleLog(`签到: 失败 ❌ 了呢,原因未知!`);
        console.log(result);
    }
}


/**
 * 签到    httpPost
 * https://mc.kukahome.com/club-server/front/member/signIn
 */
async function signIn1() {
    let Option = {
        url: `${hostname}/club-server/front/member/signIn`,
        headers: {
            'Host': host,
            'X-Customer': ck[0],
            'brandCode': 'K001',
            'content-type': 'application/json',
        },
        body: JSON.stringify({ "identityType": "mobile", "membershipId": ck[0], "customerId": customerId, "authorization": ck[1] })
    };
    let result = await httpPost(Option, `签到`);

    if (result.code == 200) {
        DoubleLog(`签到: 成功 🎉`);
        await wait(3);
        await user_info(2);
    } else if (result.code == 400) {
        DoubleLog(`签到信息: ${result.message}`);
    } else {
        DoubleLog(`签到: 失败 ❌ 了呢,原因未知!`);
        console.log(result);
    }
}



















// #region ********************************************************  固定代码  ********************************************************
/**
 * 变量检查
 */
async function Variable_Check(ck, Variables) {
    return new Promise((resolve) => {
            let ckArr = []
            if (ck) {
                if (ck.indexOf("@") !== -1) {

                    ck.split("@").forEach((item) => {
                        ckArr.push(item);
                    });
                } else if (ck.indexOf("\n") !== -1) {

                    ck.split("\n").forEach((item) => {
                        ckArr.push(item);
                    });
                } else {
                    ckArr.push(ck);
                }
                resolve(ckArr)
            } else {
                console.log(` ${$.neme}:未填写变量 ${Variables} ,请仔细阅读脚本说明!`)
            }
        }
    )
}


/**
 * 获取远程版本
 * http://yml-gitea.ml:2233/yml/JavaScript-yml/raw/branch/master/${name}.js
 * https://raw.gh.fakev.cn/yml2213/javascript/master/${name}/${name}.js
 */
function Version_Check(name) {
    return new Promise((resolve) => {
        let url = {
            url: `https://raw.gh.fakev.cn/yml2213/javascript/master/${name}/${name}.js`,
        }
        $.get(url, async (err, resp, data) => {
            try {
                let VersionCheck = resp.body.match(/VersionCheck = "([\d\.]+)"/)[1]
            } catch (e) {
                $.logErr(e, resp);
            } finally {
                resolve(VersionCheck)
            }
        }, timeout = 3)
    })
}

/**
 * 发送消息
 */
async function SendMsg(message) {
    if (!message) return;
    if (Notify > 0) {
        if ($.isNode()) {
            var notify = require("./sendNotify");
            await notify.sendNotify($.name, message);
        } else {
            // $.msg(message);
            $.msg($.name, '', message)
        }
    } else {
        console.log(message);
    }
}

/**
 * 双平台log输出
 */
function DoubleLog(data) {
    if ($.isNode()) {
        if (data) {
            console.log(`    ${data}`);
            msg += `\n    ${data}`;
        }
    } else {
        console.log(`    ${data}`);
        msg += `\n    ${data}`;
    }

}

/**
 * 随机 数字 + 大写字母 生成
 */
function randomszdx(e) {
    e = e || 32;
    var t = "QWERTYUIOPASDFGHJKLZXCVBNM1234567890",
        a = t.length,
        n = "";

    for (i = 0; i < e; i++) n += t.charAt(Math.floor(Math.random() * a));
    return n;
}


/**
 * 随机 数字 + 小写字母 生成
 */
function randomszxx(e) {
    e = e || 32;
    var t = "qwertyuioplkjhgfdsazxcvbnm1234567890",
        a = t.length,
        n = "";

    for (i = 0; i < e; i++) n += t.charAt(Math.floor(Math.random() * a));
    return n;
}




/**
 * 随机整数生成
 */
function randomInt(min, max) {
    return Math.round(Math.random() * (max - min) + min);
}


/**
 * 时间戳 13位
 */
function ts13() {
    return Math.round(new Date().getTime()).toString();
}

/**
 * 时间戳 10位
 */
function ts10() {
    return Math.round(new Date().getTime() / 1000).toString();
}

/**
 * 获取当前小时数
 */
function local_hours() {
    let myDate = new Date();
    let h = myDate.getHours();
    return h;
}

/**
 * 获取当前分钟数
 */
function local_minutes() {
    let myDate = new Date();
    let m = myDate.getMinutes();
    return m;
}


/**
 * 获取当前年份 2022
 */
function local_year() {
    let myDate = new Date();
    y = myDate.getFullYear();
    return y;
}

/**
 * 获取当前月份(数字)  5月
 */
function local_month() {
    let myDate = new Date();
    let m = myDate.getMonth();
    return m;
}


/**
 * 获取当前月份(数字)  05月 补零
 */
function local_month_two() {
    let myDate = new Date();
    let m = myDate.getMonth();
    if (m.toString().length == 1) {
        m = `0${m}`
    }
    return m;
}

/**
 * 获取当前天数(数字)  5日
 */
function local_day() {
    let myDate = new Date();
    let d = myDate.getDate();
    return d;
}


/**
 * 获取当前天数  05日 补零
 */
function local_day_two() {
    let myDate = new Date();
    let d = myDate.getDate();
    if (d.toString().length == 1) {
        d = `0${d}`
    }
    return d;
}



/**
 * 等待 X 秒
 */
function wait(n) {
    return new Promise(function (resolve) {
        setTimeout(resolve, n * 1000);
    });
}


/**
 * 每日网抑云
 */
function wyy() {
    return new Promise((resolve) => {
        let url = {
            url: `http://ovooa.com/API/wyrp/api.php`,
        }
        $.get(url, async (err, resp, data) => {
            try {
                data = JSON.parse(data);
                // console.log(data);
                console.log(`网抑云时间: ${data.data.Content}  by--${data.data.Music}`)
                msg = `[网抑云时间]: ${data.data.Content}  by--${data.data.Music}`
                // DoubleLog(`[网抑云时间]: ${data.data.Content}  by--${data.data.Music}`);
            } catch (e) {
                $.logErr(e, resp);
            } finally {
                resolve()
            }
        }, timeout = 3)
    })
}

/**
 * get请求
 */
async function httpGet(getUrlObject, tip, timeout = 3) {
    return new Promise((resolve) => {
        let url = getUrlObject;
        if (!tip) {
            let tmp = arguments.callee.toString();
            let re = /function\s*(\w*)/i;
            let matches = re.exec(tmp);
            tip = matches[1];
        }
        if (debug) {
            console.log(`\n 【debug】=============== 这是 ${tip} 请求 url ===============`);
            console.log(url);
        }

        $.get(
            url,
            async (err, resp, data) => {
                try {
                    if (debug) {
                        console.log(`\n\n 【debug】===============这是 ${tip} 返回data==============`);
                        console.log(data);
                        console.log(`\n 【debug】=============这是 ${tip} json解析后数据============`);
                        console.log(JSON.parse(data));
                    }
                    let result = JSON.parse(data);
                    if (result == undefined) {
                        return;
                    } else {
                        resolve(result);
                    }

                } catch (e) {
                    console.log(err, resp);
                    console.log(`\n ${tip} 失败了!请稍后尝试!!`);
                    msg = `\n ${tip} 失败了!请稍后尝试!!`
                } finally {
                    resolve();
                }
            },
            timeout
        );
    });
}

/**
 * post请求
 */
async function httpPost(postUrlObject, tip, timeout = 3) {
    return new Promise((resolve) => {
        let url = postUrlObject;
        if (!tip) {
            let tmp = arguments.callee.toString();
            let re = /function\s*(\w*)/i;
            let matches = re.exec(tmp);
            tip = matches[1];
        }
        if (debug) {
            console.log(`\n 【debug】=============== 这是 ${tip} 请求 url ===============`);
            console.log(url);
        }

        $.post(
            url,
            async (err, resp, data) => {
                try {
                    if (debug) {
                        console.log(`\n\n 【debug】===============这是 ${tip} 返回data==============`);
                        console.log(data);
                        console.log(`\n 【debug】=============这是 ${tip} json解析后数据============`);
                        console.log(JSON.parse(data));
                    }
                    let result = JSON.parse(data);
                    if (result == undefined) {
                        return;
                    } else {
                        resolve(result);
                    }

                } catch (e) {
                    console.log(err, resp);
                    console.log(`\n ${tip} 失败了!请稍后尝试!!`);
                    msg = `\n ${tip} 失败了!请稍后尝试!!`
                } finally {
                    resolve();
                }
            },
            timeout
        );
    });
}

/**
 * 网络请求 (get, post等)
 */
async function httpRequest(postOptionsObject, tip, timeout = 3) {
    return new Promise((resolve) => {

        let Options = postOptionsObject;
        let request = require('request');
        if (!tip) {
            let tmp = arguments.callee.toString();
            let re = /function\s*(\w*)/i;
            let matches = re.exec(tmp);
            tip = matches[1];
        }
        if (debug) {
            console.log(`\n 【debug】=============== 这是 ${tip} 请求 信息 ===============`);
            console.log(Options);
        }

        request(Options, async (err, resp, data) => {
            try {
                if (debug) {
                    console.log(`\n\n 【debug】===============这是 ${tip} 返回数据==============`);
                    console.log(data);
                    console.log(`\n 【debug】=============这是 ${tip} json解析后数据============`);
                    console.log(JSON.parse(data));
                }
                let result = JSON.parse(data);
                if (!result) return;
                resolve(result);
            } catch (e) {
                console.log(err, resp);
                console.log(`\n ${tip} 失败了!请稍后尝试!!`);
                msg = `\n ${tip} 失败了!请稍后尝试!!`
            } finally {
                resolve();
            }
        }), timeout

    });
}


/**
 * debug调试
 */
function debugLog(...args) {
    if (debug) {
        console.log(...args);
    }
}



// /**
//  *  单名字 Env
//  */
// function Env() {
//     return new class {
//         isNode() {
//             return "undefined" != typeof module && !!module.exports
//         }
//     }()
// }


// md5
function MD5Encrypt(a) { function b(a, b) { return a << b | a >>> 32 - b } function c(a, b) { var c, d, e, f, g; return e = 2147483648 & a, f = 2147483648 & b, c = 1073741824 & a, d = 1073741824 & b, g = (1073741823 & a) + (1073741823 & b), c & d ? 2147483648 ^ g ^ e ^ f : c | d ? 1073741824 & g ? 3221225472 ^ g ^ e ^ f : 1073741824 ^ g ^ e ^ f : g ^ e ^ f } function d(a, b, c) { return a & b | ~a & c } function e(a, b, c) { return a & c | b & ~c } function f(a, b, c) { return a ^ b ^ c } function g(a, b, c) { return b ^ (a | ~c) } function h(a, e, f, g, h, i, j) { return a = c(a, c(c(d(e, f, g), h), j)), c(b(a, i), e) } function i(a, d, f, g, h, i, j) { return a = c(a, c(c(e(d, f, g), h), j)), c(b(a, i), d) } function j(a, d, e, g, h, i, j) { return a = c(a, c(c(f(d, e, g), h), j)), c(b(a, i), d) } function k(a, d, e, f, h, i, j) { return a = c(a, c(c(g(d, e, f), h), j)), c(b(a, i), d) } function l(a) { for (var b, c = a.length, d = c + 8, e = (d - d % 64) / 64, f = 16 * (e + 1), g = new Array(f - 1), h = 0, i = 0; c > i;)b = (i - i % 4) / 4, h = i % 4 * 8, g[b] = g[b] | a.charCodeAt(i) << h, i++; return b = (i - i % 4) / 4, h = i % 4 * 8, g[b] = g[b] | 128 << h, g[f - 2] = c << 3, g[f - 1] = c >>> 29, g } function m(a) { var b, c, d = "", e = ""; for (c = 0; 3 >= c; c++)b = a >>> 8 * c & 255, e = "0" + b.toString(16), d += e.substr(e.length - 2, 2); return d } function n(a) { a = a.replace(/\r\n/g, "\n"); for (var b = "", c = 0; c < a.length; c++) { var d = a.charCodeAt(c); 128 > d ? b += String.fromCharCode(d) : d > 127 && 2048 > d ? (b += String.fromCharCode(d >> 6 | 192), b += String.fromCharCode(63 & d | 128)) : (b += String.fromCharCode(d >> 12 | 224), b += String.fromCharCode(d >> 6 & 63 | 128), b += String.fromCharCode(63 & d | 128)) } return b } var o, p, q, r, s, t, u, v, w, x = [], y = 7, z = 12, A = 17, B = 22, C = 5, D = 9, E = 14, F = 20, G = 4, H = 11, I = 16, J = 23, K = 6, L = 10, M = 15, N = 21; for (a = n(a), x = l(a), t = 1732584193, u = 4023233417, v = 2562383102, w = 271733878, o = 0; o < x.length; o += 16)p = t, q = u, r = v, s = w, t = h(t, u, v, w, x[o + 0], y, 3614090360), w = h(w, t, u, v, x[o + 1], z, 3905402710), v = h(v, w, t, u, x[o + 2], A, 606105819), u = h(u, v, w, t, x[o + 3], B, 3250441966), t = h(t, u, v, w, x[o + 4], y, 4118548399), w = h(w, t, u, v, x[o + 5], z, 1200080426), v = h(v, w, t, u, x[o + 6], A, 2821735955), u = h(u, v, w, t, x[o + 7], B, 4249261313), t = h(t, u, v, w, x[o + 8], y, 1770035416), w = h(w, t, u, v, x[o + 9], z, 2336552879), v = h(v, w, t, u, x[o + 10], A, 4294925233), u = h(u, v, w, t, x[o + 11], B, 2304563134), t = h(t, u, v, w, x[o + 12], y, 1804603682), w = h(w, t, u, v, x[o + 13], z, 4254626195), v = h(v, w, t, u, x[o + 14], A, 2792965006), u = h(u, v, w, t, x[o + 15], B, 1236535329), t = i(t, u, v, w, x[o + 1], C, 4129170786), w = i(w, t, u, v, x[o + 6], D, 3225465664), v = i(v, w, t, u, x[o + 11], E, 643717713), u = i(u, v, w, t, x[o + 0], F, 3921069994), t = i(t, u, v, w, x[o + 5], C, 3593408605), w = i(w, t, u, v, x[o + 10], D, 38016083), v = i(v, w, t, u, x[o + 15], E, 3634488961), u = i(u, v, w, t, x[o + 4], F, 3889429448), t = i(t, u, v, w, x[o + 9], C, 568446438), w = i(w, t, u, v, x[o + 14], D, 3275163606), v = i(v, w, t, u, x[o + 3], E, 4107603335), u = i(u, v, w, t, x[o + 8], F, 1163531501), t = i(t, u, v, w, x[o + 13], C, 2850285829), w = i(w, t, u, v, x[o + 2], D, 4243563512), v = i(v, w, t, u, x[o + 7], E, 1735328473), u = i(u, v, w, t, x[o + 12], F, 2368359562), t = j(t, u, v, w, x[o + 5], G, 4294588738), w = j(w, t, u, v, x[o + 8], H, 2272392833), v = j(v, w, t, u, x[o + 11], I, 1839030562), u = j(u, v, w, t, x[o + 14], J, 4259657740), t = j(t, u, v, w, x[o + 1], G, 2763975236), w = j(w, t, u, v, x[o + 4], H, 1272893353), v = j(v, w, t, u, x[o + 7], I, 4139469664), u = j(u, v, w, t, x[o + 10], J, 3200236656), t = j(t, u, v, w, x[o + 13], G, 681279174), w = j(w, t, u, v, x[o + 0], H, 3936430074), v = j(v, w, t, u, x[o + 3], I, 3572445317), u = j(u, v, w, t, x[o + 6], J, 76029189), t = j(t, u, v, w, x[o + 9], G, 3654602809), w = j(w, t, u, v, x[o + 12], H, 3873151461), v = j(v, w, t, u, x[o + 15], I, 530742520), u = j(u, v, w, t, x[o + 2], J, 3299628645), t = k(t, u, v, w, x[o + 0], K, 4096336452), w = k(w, t, u, v, x[o + 7], L, 1126891415), v = k(v, w, t, u, x[o + 14], M, 2878612391), u = k(u, v, w, t, x[o + 5], N, 4237533241), t = k(t, u, v, w, x[o + 12], K, 1700485571), w = k(w, t, u, v, x[o + 3], L, 2399980690), v = k(v, w, t, u, x[o + 10], M, 4293915773), u = k(u, v, w, t, x[o + 1], N, 2240044497), t = k(t, u, v, w, x[o + 8], K, 1873313359), w = k(w, t, u, v, x[o + 15], L, 4264355552), v = k(v, w, t, u, x[o + 6], M, 2734768916), u = k(u, v, w, t, x[o + 13], N, 1309151649), t = k(t, u, v, w, x[o + 4], K, 4149444226), w = k(w, t, u, v, x[o + 11], L, 3174756917), v = k(v, w, t, u, x[o + 2], M, 718787259), u = k(u, v, w, t, x[o + 9], N, 3951481745), t = c(t, p), u = c(u, q), v = c(v, r), w = c(w, s); var O = m(t) + m(u) + m(v) + m(w); return O.toLowerCase() }



// 完整 Env
function Env(t, e) { "undefined" != typeof process && JSON.stringify(process.env).indexOf("GITHUB") > -1 && process.exit(0); class s { constructor(t) { this.env = t } send(t, e = "GET") { t = "string" == typeof t ? { url: t } : t; let s = this.get; return "POST" === e && (s = this.post), new Promise((e, i) => { s.call(this, t, (t, s, r) => { t ? i(t) : e(s) }) }) } get(t) { return this.send.call(this.env, t) } post(t) { return this.send.call(this.env, t, "POST") } } return new class { constructor(t, e) { this.name = t, this.http = new s(this), this.data = null, this.dataFile = "box.dat", this.logs = [], this.isMute = !1, this.isNeedRewrite = !1, this.logSeparator = "\n", this.startTime = (new Date).getTime(), Object.assign(this, e), this.log("", `🔔${this.name}, 开始!`) } isNode() { return "undefined" != typeof module && !!module.exports } isQuanX() { return "undefined" != typeof $task } isSurge() { return "undefined" != typeof $httpClient && "undefined" == typeof $loon } isLoon() { return "undefined" != typeof $loon } toObj(t, e = null) { try { return JSON.parse(t) } catch { return e } } toStr(t, e = null) { try { return JSON.stringify(t) } catch { return e } } getjson(t, e) { let s = e; const i = this.getdata(t); if (i) try { s = JSON.parse(this.getdata(t)) } catch { } return s } setjson(t, e) { try { return this.setdata(JSON.stringify(t), e) } catch { return !1 } } getScript(t) { return new Promise(e => { this.get({ url: t }, (t, s, i) => e(i)) }) } runScript(t, e) { return new Promise(s => { let i = this.getdata("@chavy_boxjs_userCfgs.httpapi"); i = i ? i.replace(/\n/g, "").trim() : i; let r = this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout"); r = r ? 1 * r : 20, r = e && e.timeout ? e.timeout : r; const [o, h] = i.split("@"), n = { url: `http://${h}/v1/scripting/evaluate`, body: { script_text: t, mock_type: "cron", timeout: r }, headers: { "X-Key": o, Accept: "*/*" } }; this.post(n, (t, e, i) => s(i)) }).catch(t => this.logErr(t)) } loaddata() { if (!this.isNode()) return {}; { this.fs = this.fs ? this.fs : require("fs"), this.path = this.path ? this.path : require("path"); const t = this.path.resolve(this.dataFile), e = this.path.resolve(process.cwd(), this.dataFile), s = this.fs.existsSync(t), i = !s && this.fs.existsSync(e); if (!s && !i) return {}; { const i = s ? t : e; try { return JSON.parse(this.fs.readFileSync(i)) } catch (t) { return {} } } } } writedata() { if (this.isNode()) { this.fs = this.fs ? this.fs : require("fs"), this.path = this.path ? this.path : require("path"); const t = this.path.resolve(this.dataFile), e = this.path.resolve(process.cwd(), this.dataFile), s = this.fs.existsSync(t), i = !s && this.fs.existsSync(e), r = JSON.stringify(this.data); s ? this.fs.writeFileSync(t, r) : i ? this.fs.writeFileSync(e, r) : this.fs.writeFileSync(t, r) } } lodash_get(t, e, s) { const i = e.replace(/\[(\d+)\]/g, ".$1").split("."); let r = t; for (const t of i) if (r = Object(r)[t], void 0 === r) return s; return r } lodash_set(t, e, s) { return Object(t) !== t ? t : (Array.isArray(e) || (e = e.toString().match(/[^.[\]]+/g) || []), e.slice(0, -1).reduce((t, s, i) => Object(t[s]) === t[s] ? t[s] : t[s] = Math.abs(e[i + 1]) >> 0 == +e[i + 1] ? [] : {}, t)[e[e.length - 1]] = s, t) } getdata(t) { let e = this.getval(t); if (/^@/.test(t)) { const [, s, i] = /^@(.*?)\.(.*?)$/.exec(t), r = s ? this.getval(s) : ""; if (r) try { const t = JSON.parse(r); e = t ? this.lodash_get(t, i, "") : e } catch (t) { e = "" } } return e } setdata(t, e) { let s = !1; if (/^@/.test(e)) { const [, i, r] = /^@(.*?)\.(.*?)$/.exec(e), o = this.getval(i), h = i ? "null" === o ? null : o || "{}" : "{}"; try { const e = JSON.parse(h); this.lodash_set(e, r, t), s = this.setval(JSON.stringify(e), i) } catch (e) { const o = {}; this.lodash_set(o, r, t), s = this.setval(JSON.stringify(o), i) } } else s = this.setval(t, e); return s } getval(t) { return this.isSurge() || this.isLoon() ? $persistentStore.read(t) : this.isQuanX() ? $prefs.valueForKey(t) : this.isNode() ? (this.data = this.loaddata(), this.data[t]) : this.data && this.data[t] || null } setval(t, e) { return this.isSurge() || this.isLoon() ? $persistentStore.write(t, e) : this.isQuanX() ? $prefs.setValueForKey(t, e) : this.isNode() ? (this.data = this.loaddata(), this.data[e] = t, this.writedata(), !0) : this.data && this.data[e] || null } initGotEnv(t) { this.got = this.got ? this.got : require("got"), this.cktough = this.cktough ? this.cktough : require("tough-cookie"), this.ckjar = this.ckjar ? this.ckjar : new this.cktough.CookieJar, t && (t.headers = t.headers ? t.headers : {}, void 0 === t.headers.Cookie && void 0 === t.cookieJar && (t.cookieJar = this.ckjar)) } get(t, e = (() => { })) { t.headers && (delete t.headers["Content-Type"], delete t.headers["Content-Length"]), this.isSurge() || this.isLoon() ? (this.isSurge() && this.isNeedRewrite && (t.headers = t.headers || {}, Object.assign(t.headers, { "X-Surge-Skip-Scripting": !1 })), $httpClient.get(t, (t, s, i) => { !t && s && (s.body = i, s.statusCode = s.status), e(t, s, i) })) : this.isQuanX() ? (this.isNeedRewrite && (t.opts = t.opts || {}, Object.assign(t.opts, { hints: !1 })), $task.fetch(t).then(t => { const { statusCode: s, statusCode: i, headers: r, body: o } = t; e(null, { status: s, statusCode: i, headers: r, body: o }, o) }, t => e(t))) : this.isNode() && (this.initGotEnv(t), this.got(t).on("redirect", (t, e) => { try { if (t.headers["set-cookie"]) { const s = t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString(); s && this.ckjar.setCookieSync(s, null), e.cookieJar = this.ckjar } } catch (t) { this.logErr(t) } }).then(t => { const { statusCode: s, statusCode: i, headers: r, body: o } = t; e(null, { status: s, statusCode: i, headers: r, body: o }, o) }, t => { const { message: s, response: i } = t; e(s, i, i && i.body) })) } post(t, e = (() => { })) { if (t.body && t.headers && !t.headers["Content-Type"] && (t.headers["Content-Type"] = "application/x-www-form-urlencoded"), t.headers && delete t.headers["Content-Length"], this.isSurge() || this.isLoon()) this.isSurge() && this.isNeedRewrite && (t.headers = t.headers || {}, Object.assign(t.headers, { "X-Surge-Skip-Scripting": !1 })), $httpClient.post(t, (t, s, i) => { !t && s && (s.body = i, s.statusCode = s.status), e(t, s, i) }); else if (this.isQuanX()) t.method = "POST", this.isNeedRewrite && (t.opts = t.opts || {}, Object.assign(t.opts, { hints: !1 })), $task.fetch(t).then(t => { const { statusCode: s, statusCode: i, headers: r, body: o } = t; e(null, { status: s, statusCode: i, headers: r, body: o }, o) }, t => e(t)); else if (this.isNode()) { this.initGotEnv(t); const { url: s, ...i } = t; this.got.post(s, i).then(t => { const { statusCode: s, statusCode: i, headers: r, body: o } = t; e(null, { status: s, statusCode: i, headers: r, body: o }, o) }, t => { const { message: s, response: i } = t; e(s, i, i && i.body) }) } } time(t, e = null) { const s = e ? new Date(e) : new Date; let i = { "M+": s.getMonth() + 1, "d+": s.getDate(), "H+": s.getHours(), "m+": s.getMinutes(), "s+": s.getSeconds(), "q+": Math.floor((s.getMonth() + 3) / 3), S: s.getMilliseconds() }; /(y+)/.test(t) && (t = t.replace(RegExp.$1, (s.getFullYear() + "").substr(4 - RegExp.$1.length))); for (let e in i) new RegExp("(" + e + ")").test(t) && (t = t.replace(RegExp.$1, 1 == RegExp.$1.length ? i[e] : ("00" + i[e]).substr(("" + i[e]).length))); return t } msg(e = t, s = "", i = "", r) { const o = t => { if (!t) return t; if ("string" == typeof t) return this.isLoon() ? t : this.isQuanX() ? { "open-url": t } : this.isSurge() ? { url: t } : void 0; if ("object" == typeof t) { if (this.isLoon()) { let e = t.openUrl || t.url || t["open-url"], s = t.mediaUrl || t["media-url"]; return { openUrl: e, mediaUrl: s } } if (this.isQuanX()) { let e = t["open-url"] || t.url || t.openUrl, s = t["media-url"] || t.mediaUrl; return { "open-url": e, "media-url": s } } if (this.isSurge()) { let e = t.url || t.openUrl || t["open-url"]; return { url: e } } } }; if (this.isMute || (this.isSurge() || this.isLoon() ? $notification.post(e, s, i, o(r)) : this.isQuanX() && $notify(e, s, i, o(r))), !this.isMuteLog) { let t = ["", "==============📣系统通知📣=============="]; t.push(e), s && t.push(s), i && t.push(i), console.log(t.join("\n")), this.logs = this.logs.concat(t) } } log(...t) { t.length > 0 && (this.logs = [...this.logs, ...t]), console.log(t.join(this.logSeparator)) } logErr(t, e) { const s = !this.isSurge() && !this.isQuanX() && !this.isLoon(); s ? this.log("", `❗️${this.name}, 错误!`, t.stack) : this.log("", `❗️${this.name}, 错误!`, t) } wait(t) { return new Promise(e => setTimeout(e, t)) } done(t = {}) { const e = (new Date).getTime(), s = (e - this.startTime) / 1e3; this.log("", `🔔${this.name}, 结束! 🕛 ${s} 秒`), this.log(), (this.isSurge() || this.isQuanX() || this.isLoon()) && $done(t) } }(t, e) }

//#endregion

