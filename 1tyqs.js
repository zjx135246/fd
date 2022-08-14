/**
 作者：临渊
 日期：7-27
 小程序：统一快乐星球
 入口：活动->天气情书
 抓包：https://api.xiaoyisz.com/asamu/ga/user/public/api/login  这个登录包里 body 部分的 全部
 变量：tqBody='body@xxxx '  多个账号用 @ 或者 换行 分割
 定时一天一次
 cron: 10 12 12 * * *

 [task_local]
 #统一天气情书
 10 12 * * * https://raw.githubusercontent.com/LinYuanovo/scripts/main/tyqs.js, tag=统一天气情书, enabled=true
 [rewrite_local]
 https://api.xiaoyisz.com/asamu/ga/user/public/api/login url script-request-body https://raw.githubusercontent.com/LinYuanovo/scripts/main/tyqs.js
 [MITM]
 hostname = api.xiaoyisz.com
 */

const $ = new Env("统一天气情书");
const notify = $.isNode() ? require("./sendNotify") : "";
const { log } = console;
const Notify = 1; //0为关闭通知，1为打开通知,默认为1
const debug = 0; //0为关闭调试，1为打开调试,默认为0
const uaNum = 1; //随机UA，从0-20随便选一个填上去
const help = 1; //0为关闭互助，1为打开互助,默认为1
//////////////////////
let scriptVersion = "1.0.0";
let scriptVersionLatest = '';
let tyau = "";
let tqBody = ($.isNode() ? process.env.tqBody : $.getdata("tqBody")) || "";
let UA = ($.isNode() ? process.env.UA : $.getdata("UA")) || "";
let UAArr = [];
let tqBodyArr = [];
let newAuArr = [];
let auback = 0;
let data = "";
let msg = "";
let taskTypeArr = [];
let integralNum = 0;
let name = "";
let id = "";
let idArr = [];
const User_Agents = [
    "Mozilla/5.0 (Linux; Android 10; ONEPLUS A5010 Build/QKQ1.191014.012; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/77.0.3865.120 MQQBrowser/6.2 TBS/045230 Mobile Safari/537.36",
    "Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148",
    "Mozilla/5.0 (Linux; Android 9; Mi Note 3 Build/PKQ1.181007.001; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/66.0.3359.126 MQQBrowser/6.2 TBS/045131 Mobile Safari/537.36",
    "Mozilla/5.0 (Linux; Android 10; GM1910 Build/QKQ1.190716.003; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/77.0.3865.120 MQQBrowser/6.2 TBS/045230 Mobile Safari/537.36",
    "Mozilla/5.0 (Linux; Android 9; 16T Build/PKQ1.190616.001; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/66.0.3359.126 MQQBrowser/6.2 TBS/044942 Mobile Safari/537.36",
    "Mozilla/5.0 (iPhone; CPU iPhone OS 13_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148",
    "Mozilla/5.0 (iPhone; CPU iPhone OS 13_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148",
    "Mozilla/5.0 (iPhone; CPU iPhone OS 14_2 like Mac OS X) AppleWebKit/532.0 (KHTML, like Gecko) CriOS/43.0.823.0 Mobile/65M532 Safari/532.0",
    "Mozilla/5.0 (iPod; U; CPU iPhone OS 3_1 like Mac OS X; rw-RW) AppleWebKit/531.9.3 (KHTML, like Gecko) Version/4.0.5 Mobile/8B118 Safari/6531.9.3",
    "Mozilla/5.0 (Linux; Android 9; MI 6 Build/PKQ1.190118.001; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/66.0.3359.126 MQQBrowser/6.2 TBS/044942 Mobile Safari/537.36",
    "Mozilla/5.0 (Linux; Android 11; Redmi K30 5G Build/RKQ1.200826.002; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/77.0.3865.120 MQQBrowser/6.2 TBS/045511 Mobile Safari/537.36",
    "Mozilla/5.0 (Linux; Android 10; ONEPLUS A6000 Build/QKQ1.190716.003; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/77.0.3865.120 MQQBrowser/6.2 TBS/045224 Mobile Safari/537.36",
    "Mozilla/5.0 (Linux; Android 9; MHA-AL00 Build/HUAWEIMHA-AL00; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/66.0.3359.126 MQQBrowser/6.2 TBS/044942 Mobile Safari/537.36",
    "Mozilla/5.0 (Linux; Android 8.0.0; HTC U-3w Build/OPR6.170623.013; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/66.0.3359.126 MQQBrowser/6.2 TBS/044942 Mobile Safari/537.36",
    "Mozilla/5.0 (Linux; Android 10; LYA-AL00 Build/HUAWEILYA-AL00L; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/77.0.3865.120 MQQBrowser/6.2 TBS/045230 Mobile Safari/537.36",
    "Mozilla/5.0 (Linux; Android 8.1.0; MI 8 Build/OPM1.171019.026; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/66.0.3359.126 MQQBrowser/6.2 TBS/045131 Mobile Safari/537.36",
    "Mozilla/5.0 (Linux; Android 10; Redmi K20 Pro Premium Edition Build/QKQ1.190825.002; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/77.0.3865.120 MQQBrowser/6.2 TBS/045227 Mobile Safari/537.36",
    "Mozilla/5.0 (Linux; Android 8.1.0; 16 X Build/OPM1.171019.026; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/66.0.3359.126 MQQBrowser/6.2 TBS/044942 Mobile Safari/537.36",
    "Mozilla/5.0 (Linux; Android 10; M2006J10C Build/QP1A.190711.020; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/77.0.3865.120 MQQBrowser/6.2 TBS/045230 Mobile Safari/537.36",
    "Mozilla/5.0 (iPhone; CPU iPhone OS 13_7 like Mac OS X) AppleWebKit/532.0 (KHTML, like Gecko) FxiOS/18.2n0520.0 Mobile/50C216 Safari/532.0",
    "Mozilla/5.0 (iPhone; CPU iPhone OS 13_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148",
    "Mozilla/5.0 (iPhone; CPU iPhone OS 13_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148",
];
let ua = User_Agents[uaNum];

!(async () => {
    if (typeof $request !== "undefined") {
        await GetRewrite();
    } else {
        if (!(await Envs())) return;
        else {
            log(
                `\n\n=============================================    \n脚本执行 - 北京时间(UTC+8)：${new Date(
                    new Date().getTime() +
                    new Date().getTimezoneOffset() * 60 * 1000 +
                    8 * 60 * 60 * 1000
                ).toLocaleString()} \n=============================================\n`
            );

            await poem();
            await getVersion();
            log(`\n============ 当前版本：${scriptVersion}  最新版本：${scriptVersionLatest} ============`)
            log(
                `\n=================== 共找到 ${tqBodyArr.length} 个账号 ===================`
            );

            if (debug) {
                log(`【debug】 这是你的全部账号数组:\n ${tqBodyArr}`);
            }

            for (let index = 0; index < tqBodyArr.length; index++) {
                ua = User_Agents[uaNum + index];

                if (UA) {
                    if (index >= UAArr.length) {
                        let i = UAArr.length + randomInt(0, 2);
                        ua = User_Agents[uaNum + i];
                    } else ua = UAArr[index];
                }

                tqBody = tqBodyArr[index];
                let num = index + 1;

                log(`\n========= 开始【第 ${num} 个账号】=========\n`);

                if (debug) {
                    log(`【debug】 这是你的第 ${num} 个账号数组:\n ${tqBody}`);
                }

                log("【开始获取AU】");
                await refreshAu();
                await $.wait(2 * 1000);
                newAuArr[index] = tyau;

                log("【开始查询任务】");
                await getTask();
                await $.wait(2 * 1000);

                if (auback != 1) {
                    for (let i in taskTypeArr) {
                        if (i != 0) {
                            let temp =+ i;
                            temp ++;
                            log(`【开始执行第${temp}个任务】`);
                            await report(i);
                            await $.wait(2 * 1000);
                            await getDrawPrize(i);
                            await $.wait(2 * 1000);
                        }
                    }

                    log("【开始查询信息】");
                    await getUserInfo();
                    await $.wait(2 * 1000);
                    idArr[index] = id;
                }
            }
            if (help && tqBodyArr.length >= 2) {
                log(`\n【开始互助】`);
                for (let num1 = 0; num1 < tqBodyArr.length; num1++) {
                    log(`【第${num1+1}个账号去助力结果】`)
                    for(let num2 =0;num2<tqBodyArr.length;num2++){
                        if(num1 != num2){
                            log(`[助力第${num2+1}个账号结果]`)
                            await doHelp(num1,num2);
                            await $.wait(2 * 1000);
                            await getHelpDrawPrize(num2);
                            await $.wait(2 * 1000);
                        }
                    }
                    log("")
                    msg += `\n`
                }
            }
            for (let i in newAuArr) {
                let temp =+ i;
                temp ++;
                log(`【第${temp}个账号抽奖结果】`)
                msg += `\n【第${temp}个账号抽奖结果】`
                await getIntegral(i);
                await $.wait(2 * 1000);
                for (let j=0; j<integralNum ;j++) {
                    await drawPrize(i);
                    await $.wait(2 * 1000);
                }
                integralNum = 0;
            }
            await SendMsg(msg);
        }
    }
})()
    .catch((e) => log(e))
    .finally(() => $.done());

/**
 * 获取AU
 */
function refreshAu(timeout = 2 * 1000) {
    let url = {
        url: `https://api.xiaoyisz.com/asamu/ga/user/public/api/login`,
        headers: {
            Host: "api.xiaoyisz.com",
            "user-agent": `${ua}`,
            "Content-Type": "application/json",
        },
        body: `${tqBody}`,
    };
    return new Promise((resolve) => {
        if (debug) {
            log(`\n【debug】=============== 这是 获取AU 请求 url ===============`);
            log(JSON.stringify(url));
        }

        $.post(
            url,
            async (error, response, data) => {
                try {
                    if (debug) {
                        log(
                            `\n\n【debug】===============这是 获取AU 返回data==============`
                        );
                        log(data);
                    }

                    let result = JSON.parse(data);
                    if (result.code == 0) {
                        log(`获取AU成功`);
                        tyau = result.data;
                    } else if (result.code == 500) {
                        log(
                            `获取AU失败，请检查你的变量是否正确，如正确更换到环境变量或者配置文件重试`
                        );
                        auback = 1;
                    } else {
                        log(`获取AU失败，原因是：${result.message}`);
                    }
                } catch (e) {
                    log(e);
                } finally {
                    resolve();
                }
            },
            timeout
        );
    });
}

/**
 * 上报任务
 */
function report(num) {
    let url = {
        url: `https://api.xiaoyisz.com/asamu/ga/user/task/report?taskType=${taskTypeArr[num]}&attachId=${timestampMs()}`,
        headers: {
            Host: "api.xiaoyisz.com",
            authorization: `${tyau}`,
            "user-agent": `${ua}`,
            "content-type": "application/json",
        },
    };
    return new Promise((resolve) => {
        if (debug) {
            log(`\n【debug】=============== 这是 上报任务 请求 url ===============`);
            log(JSON.stringify(url));
        }

        $.get(url, async (error, response, data) => {
            try {
                if (debug) {
                    log(
                        `\n\n【debug】===============这是 上报任务 返回data==============`
                    );
                    log(data);
                }

                let result = JSON.parse(data);
                if (result.code == 0) {
                    if (result.data.status == 2) {
                        log(`上报任务成功`);
                    }
                } else {
                    log(`上报任务失败，原因是：${result.message}`);
                }
            } catch (e) {
                log(e);
            } finally {
                resolve();
            }
        });
    });
}

/**
 * 领取奖励
 */
function getDrawPrize(num) {
    let url = {
        url: `https://api.xiaoyisz.com/asamu/ga/user/task/achievement/prize?taskType=${taskTypeArr[num]}`,
        headers: {
            Host: "api.xiaoyisz.com",
            authorization: `${tyau}`,
            "user-agent": `${ua}`,
            "content-type": "application/json",
        },
    };
    return new Promise((resolve) => {
        if (debug) {
            log(`\n【debug】=============== 这是 领取奖励 请求 url ===============`);
            log(JSON.stringify(url));
        }

        $.get(url, async (error, response, data) => {
            try {
                if (debug) {
                    log(
                        `\n\n【debug】===============这是 领取奖励 返回data==============`
                    );
                    log(data);
                }

                let result = JSON.parse(data);
                if (result.code == 1000) {
                    log(`任务不是待领取状态`);
                } else if (result.code == 0) {
                    log(`领取奖励成功，获得：${result.data.num}个瓶盖`);
                } else {
                    log(`任务领取奖励失败，原因是：${result.message}`);
                }
            } catch (e) {
                log(e);
            } finally {
                resolve();
            }
        });
    });
}

/**
 * 获取任务
 */
function getTask(timeout = 2 * 1000) {
    let url = {
        url: `https://api.xiaoyisz.com/asamu/ga/user/task/daily`,
        headers: {
            Host: "api.xiaoyisz.com",
            authorization: `${tyau}`,
            "user-agent": `${ua}`,
            "content-type": "application/json",
        },
    };
    return new Promise((resolve) => {
        if (debug) {
            log(`\n【debug】=============== 这是 获取任务 请求 url ===============`);
            log(JSON.stringify(url));
        }

        $.get(
            url,
            async (error, response, data) => {
                try {
                    if (debug) {
                        log(
                            `\n\n【debug】===============这是 获取任务 返回data==============`
                        );
                        log(data);
                    }

                    let result = JSON.parse(data);
                    let back = eval(result);
                    if (result.code == 901 || result.code == 902 || result.code == 903) {
                        auback = 1;
                        log(`AU错误，可能是获取失败，请更换到环境变量或配置文件重试`);
                        msg += `\nAU错误，可能是获取失败，请更换到环境变量或配置文件重试`;
                    }
                    if (auback != 1 && result.code == 0) {
                        log(`获取任务列表成功`);
                        for (let i in result.data) {
                            taskTypeArr[i] = result.data[i].taskType;
                        }
                    }
                } catch (e) {
                    log(e);
                } finally {
                    resolve();
                }
            },
            timeout
        );
    });
}

/**
 * 获取信息
 */
function getUserInfo(timeout = 2 * 1000) {
    let url = {
        url: `https://api.xiaoyisz.com/asamu/ga/user/info`,
        headers: {
            Host: "api.xiaoyisz.com",
            authorization: `${tyau}`,
            "user-agent": `${ua}`,
            "Content-Type": "application/json",
        },
    };
    return new Promise((resolve) => {
        if (debug) {
            log(`\n【debug】=============== 这是 获取信息 请求 url ===============`);
            log(JSON.stringify(url));
        }

        $.get(
            url,
            async (error, response, data) => {
                try {
                    if (debug) {
                        log(
                            `\n\n【debug】===============这是 获取信息 返回data==============`
                        );
                        log(data);
                    }

                    let result = JSON.parse(data);
                    if (result.code == 0) {
                        name = result.data.nickName;
                        id = result.data.id;
                        log(`获取信息成功`);
                    } else log(`获取信息失败，原因是：${result.message}`);
                } catch (e) {
                    log(e);
                } finally {
                    resolve();
                }
            },
            timeout
        );
    });
}

/**
 * 互助 （num1助力num2）
 */
function doHelp(num1, num2) {
    let url = {
        url: `https://api.xiaoyisz.com/asamu/ga/user/task/report?taskType=1&attachId=${idArr[num2]}`,
        headers: {
            Host: "api.xiaoyisz.com",
            authorization: `${newAuArr[num1]}`,
            "user-agent": `${ua}`,
            "content-type": "application/json",
        },
    };
    return new Promise((resolve) => {
        if (debug) {
            log(`\n【debug】=============== 这是 互助 请求 url ===============`);
            log(JSON.stringify(url));
        }

        $.get(url, async (error, response, data) => {
            try {
                if (debug) {
                    log(`\n\n【debug】===============这是 互助 返回data==============`);
                    log(data);
                }

                let result = JSON.parse(data);
                if (result.code == 0) {
                    if (result.data.status == 2) {
                        log(`去助力[${result.data.nickName}]成功`);
                    } else if (result.data.status == 3) {
                        log(`该账号被助力次数已达上限`);
                    }
                } else {
                    msg += `\n助力失败，原因是：${result.message}`
                    log(`助力失败，原因是：${result.message}`);
                }
            } catch (e) {
                log(e);
            } finally {
                resolve();
            }
        });
    });
}

/**
 * 领取互助奖励
 */
function getHelpDrawPrize(num) {
    let url = {
        url: `https://api.xiaoyisz.com/asamu/ga/user/task/achievement/prize?taskType=1`,
        headers: {
            Host: "api.xiaoyisz.com",
            authorization: `${newAuArr[num]}`,
            "user-agent": `${ua}`,
            "content-type": "application/json",
        },
    };
    return new Promise((resolve) => {
        if (debug) {
            log(`\n【debug】=============== 这是 领取互助奖励 请求 url ===============`);
            log(JSON.stringify(url));
        }

        $.get(url, async (error, response, data) => {
            try {
                if (debug) {
                    log(
                        `\n\n【debug】===============这是 领取互助奖励 返回data==============`
                    );
                    log(data);
                }

                let result = JSON.parse(data);
                if (result.code == 1000) {
                    log(`暂无可领取奖励`);
                } else if (result.code == 0) {
                    log(`领取奖励成功，获得：${result.data.num}个瓶盖`);
                } else {
                    log(`任务领取奖励失败，原因是：${result.message}`);
                }
            } catch (e) {
                log(e);
            } finally {
                resolve();
            }
        });
    });
}

/**
 * 获取瓶盖数量
 */
function getIntegral(num) {
    let url = {
        url: `https://api.xiaoyisz.com/asamu/ga/user/box/boxActivity`,
        headers: {
            Host: "api.xiaoyisz.com",
            authorization: `${newAuArr[num]}`,
            "user-agent": `${ua}`,
            "content-type": "application/json",
        },
    };
    return new Promise((resolve) => {
        if (debug) {
            log(`\n【debug】=============== 这是 获取瓶盖数量 请求 url ===============`);
            log(JSON.stringify(url));
        }

        $.get(url, async (error, response, data) => {
            try {
                if (debug) {
                    log(
                        `\n\n【debug】===============这是 获取瓶盖数量 返回data==============`
                    );
                    log(data);
                }

                let result = JSON.parse(data);
                if (result.code == 0) {
                    if (result.data.integralNow != 0) {
                        integralNum = result.data.integralNow;
                        log(`瓶盖数量不为零，准备执行抽奖`)
                    } else {
                        log(`瓶盖数量为零，不执行抽奖`)
                        msg += `\n瓶盖数量为零，不执行抽奖`
                    }
                } else {
                    log(`获取瓶盖数量失败，原因是：${result.message}`);
                }
            } catch (e) {
                log(e);
            } finally {
                resolve();
            }
        });
    });
}

/**
 * 抽奖
 */
function drawPrize(num) {
    let url = {
        url: `https://api.xiaoyisz.com/asamu/ga/user/box/drawPrize`,
        headers: {
            Host: "api.xiaoyisz.com",
            authorization: `${newAuArr[num]}`,
            "user-agent": `${ua}`,
            "content-type": "application/json",
        },
    };
    return new Promise((resolve) => {
        if (debug) {
            log(`\n【debug】=============== 这是 抽奖 请求 url ===============`);
            log(JSON.stringify(url));
        }

        $.get(url, async (error, response, data) => {
            try {
                if (debug) {
                    log(
                        `\n\n【debug】===============这是 抽奖 返回data==============`
                    );
                    log(data);
                }

                let result = JSON.parse(data);
                if (result.code == 0) {
                    if (result.data.type == -1) {
                        log(`抽奖成功，但啥也没中`)
                        msg += `\n抽奖成功，但啥也没中`
                    } else if (result.data.type == 0) {
                        log(`抽奖成功，应该是中了一等奖：实物大奖`)
                        msg += `\n抽奖成功，应该是中了一等奖：实物大奖`
                    } else if (result.data.type == 1) {
                        log(`抽奖成功，应该是中了二等奖：阿萨姆`)
                        msg += `\n抽奖成功，应该是中了二等奖：阿萨姆`
                    } else if (result.data.type == 2) {
                        log(`抽奖成功，应该是中了三等奖：优惠券`)
                        msg += `\n抽奖成功，应该是中了三等奖：优惠券`
                    } else {
                        log(`抽奖成功，不知道中了啥`)
                        msg += `\n抽奖成功，不知道中了啥`
                    }
                } else {
                    log(`抽奖失败，原因是：${result.message}`);
                }
            } catch (e) {
                log(e);
            } finally {
                resolve();
            }
        });
    });
}
// ============================================重写============================================ \\
async function GetRewrite() {
    if ($request.url.indexOf("public/api/login") > -1) {
        const ck = $request.body;
        if (tqBody) {
            if (tqBody.indexOf(ck) == -1) {
                tqBody = tqBody + "@" + ck;
                $.setdata(tqBody, "tqBody");
                let List = tqBody.split("@");
                $.msg(
                    $.name +
                    ` 获取第${tqBody.length}个 ck 成功: ${ck} ,不用请自行关闭重写!`
                );
            }
        } else {
            $.setdata(ck, "tqBody");
            $.msg($.name + ` 获取第1个 ck 成功: ${ck} ,不用请自行关闭重写!`);
        }
    }
}

// ============================================变量检查============================================ \\
async function Envs() {
    if (UA) {
        if (UA.indexOf("@") != -1) {
            UA.split("@").forEach((item) => {
                UAArr.push(item);
            });
        } else if (UA.indexOf("\n") != -1) {
            UA.split("\n").forEach((item) => {
                UAArr.push(item);
            });
        } else {
            UAArr.push(UA);
        }
    }
    if (tqBody) {
        if (tqBody.indexOf("@") != -1) {
            tqBody.split("@").forEach((item) => {
                tqBodyArr.push(item);
            });
        } else if (tqBody.indexOf("\n") != -1) {
            tqBody.split("\n").forEach((item) => {
                tqBodyArr.push(item);
            });
        } else {
            tqBodyArr.push(tqBody);
        }
    } else {
        log(`\n 【${$.name}】：未填写变量 tqBody`);
        return;
    }

    return true;
}

// ============================================发送消息============================================ \\
async function SendMsg(message) {
    if (!message) return;

    if (Notify > 0) {
        if ($.isNode()) {
            var notify = require("./sendNotify");
            await notify.sendNotify($.name, message);
        } else {
            $.msg(message);
        }
    } else {
        log(message);
    }
}

/**
 * 随机数生成
 */
function randomString(e) {
    e = e || 32;
    var t = "QWERTYUIOPASDFGHJKLZXCVBNM1234567890",
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
 * 获取毫秒时间戳
 */
function timestampMs() {
    return new Date().getTime();
}

/**
 * 获取秒时间戳
 */
function timestampS() {
    return Date.parse(new Date()) / 1000;
}

/**
 * 获取随机诗词
 */
function poem(timeout = 3 * 1000) {
    return new Promise((resolve) => {
        let url = {
            url: `https://v1.jinrishici.com/all.json`,
        };
        $.get(
            url,
            async (err, resp, data) => {
                try {
                    data = JSON.parse(data);
                    log(`${data.content}  \n————《${data.origin}》${data.author}`);
                } catch (e) {
                    log(e, resp);
                } finally {
                    resolve();
                }
            },
            timeout
        );
    });
}

/**
 * 修改配置文件
 */
function modify() {
    fs.readFile("/ql/data/config/config.sh", "utf8", function (err, dataStr) {
        if (err) {
            return log("读取文件失败！" + err);
        } else {
            var result = dataStr.replace(
                /tyau="[\w-\s/+@]{0,1000}"/g,
                `tyau="${newAuArr[0]}@${newAuArr[1]}@${newAuArr[2]}"`
            );
            fs.writeFile("/ql/data/config/config.sh", result, "utf8", function (err) {
                if (err) {
                    return log(err);
                }
            });
        }
    });
}

/**
 * 休眠
 */
function sleep(timeout) {
    return new Promise((resolve) => setTimeout(resolve, timeout));
}

/**
 * 获取远程版本
 */
function getVersion(timeout = 3 * 1000) {
    return new Promise((resolve) => {
        let url = {
            url: `https://raw.gh.fakev.cn/LinYuanovo/scripts/main/tyqs.js`,
        }
        $.get(url, async (err, resp, data) => {
            try {
                scriptVersionLatest = data.match(/scriptVersion = "([\d\.]+)"/)[1]
            } catch (e) {
                $.logErr(e, resp);
            } finally {
                resolve()
            }
        }, timeout)
    })
}
function Env(t, e) {
    "undefined" != typeof process &&
    JSON.stringify(process.env).indexOf("GITHUB") > -1 &&
    process.exit(0);
    class s {
        constructor(t) {
            this.env = t;
        }
        send(t, e = "GET") {
            t = "string" == typeof t ? { url: t } : t;
            let s = this.get;
            return (
                "POST" === e && (s = this.post),
                    new Promise((e, i) => {
                        s.call(this, t, (t, s, r) => {
                            t ? i(t) : e(s);
                        });
                    })
            );
        }
        get(t) {
            return this.send.call(this.env, t);
        }
        post(t) {
            return this.send.call(this.env, t, "POST");
        }
    }
    return new (class {
        constructor(t, e) {
            (this.name = t),
                (this.http = new s(this)),
                (this.data = null),
                (this.dataFile = "box.dat"),
                (this.logs = []),
                (this.isMute = !1),
                (this.isNeedRewrite = !1),
                (this.logSeparator = "\n"),
                (this.startTime = new Date().getTime()),
                Object.assign(this, e),
                this.log("", `🔔${this.name}, 开始!`);
        }
        isNode() {
            return "undefined" != typeof module && !!module.exports;
        }
        isQuanX() {
            return "undefined" != typeof $task;
        }
        isSurge() {
            return "undefined" != typeof $httpClient && "undefined" == typeof $loon;
        }
        isLoon() {
            return "undefined" != typeof $loon;
        }
        toObj(t, e = null) {
            try {
                return JSON.parse(t);
            } catch {
                return e;
            }
        }
        toStr(t, e = null) {
            try {
                return JSON.stringify(t);
            } catch {
                return e;
            }
        }
        getjson(t, e) {
            let s = e;
            const i = this.getdata(t);
            if (i)
                try {
                    s = JSON.parse(this.getdata(t));
                } catch {}
            return s;
        }
        setjson(t, e) {
            try {
                return this.setdata(JSON.stringify(t), e);
            } catch {
                return !1;
            }
        }
        getScript(t) {
            return new Promise((e) => {
                this.get({ url: t }, (t, s, i) => e(i));
            });
        }
        runScript(t, e) {
            return new Promise((s) => {
                let i = this.getdata("@chavy_boxjs_userCfgs.httpapi");
                i = i ? i.replace(/\n/g, "").trim() : i;
                let r = this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout");
                (r = r ? 1 * r : 20), (r = e && e.timeout ? e.timeout : r);
                const [o, h] = i.split("@"),
                    n = {
                        url: `http://${h}/v1/scripting/evaluate`,
                        body: { script_text: t, mock_type: "cron", timeout: r },
                        headers: { "X-Key": o, Accept: "*/*" },
                    };
                this.post(n, (t, e, i) => s(i));
            }).catch((t) => this.logErr(t));
        }
        loaddata() {
            if (!this.isNode()) return {};
            {
                (this.fs = this.fs ? this.fs : require("fs")),
                    (this.path = this.path ? this.path : require("path"));
                const t = this.path.resolve(this.dataFile),
                    e = this.path.resolve(process.cwd(), this.dataFile),
                    s = this.fs.existsSync(t),
                    i = !s && this.fs.existsSync(e);
                if (!s && !i) return {};
                {
                    const i = s ? t : e;
                    try {
                        return JSON.parse(this.fs.readFileSync(i));
                    } catch (t) {
                        return {};
                    }
                }
            }
        }
        writedata() {
            if (this.isNode()) {
                (this.fs = this.fs ? this.fs : require("fs")),
                    (this.path = this.path ? this.path : require("path"));
                const t = this.path.resolve(this.dataFile),
                    e = this.path.resolve(process.cwd(), this.dataFile),
                    s = this.fs.existsSync(t),
                    i = !s && this.fs.existsSync(e),
                    r = JSON.stringify(this.data);
                s
                    ? this.fs.writeFileSync(t, r)
                    : i
                        ? this.fs.writeFileSync(e, r)
                        : this.fs.writeFileSync(t, r);
            }
        }
        lodash_get(t, e, s) {
            const i = e.replace(/\[(\d+)\]/g, ".$1").split(".");
            let r = t;
            for (const t of i) if (((r = Object(r)[t]), void 0 === r)) return s;
            return r;
        }
        lodash_set(t, e, s) {
            return Object(t) !== t
                ? t
                : (Array.isArray(e) || (e = e.toString().match(/[^.[\]]+/g) || []),
                    (e
                        .slice(0, -1)
                        .reduce(
                            (t, s, i) =>
                                Object(t[s]) === t[s]
                                    ? t[s]
                                    : (t[s] = Math.abs(e[i + 1]) >> 0 == +e[i + 1] ? [] : {}),
                            t
                        )[e[e.length - 1]] = s),
                    t);
        }
        getdata(t) {
            let e = this.getval(t);
            if (/^@/.test(t)) {
                const [, s, i] = /^@(.*?)\.(.*?)$/.exec(t),
                    r = s ? this.getval(s) : "";
                if (r)
                    try {
                        const t = JSON.parse(r);
                        e = t ? this.lodash_get(t, i, "") : e;
                    } catch (t) {
                        e = "";
                    }
            }
            return e;
        }
        setdata(t, e) {
            let s = !1;
            if (/^@/.test(e)) {
                const [, i, r] = /^@(.*?)\.(.*?)$/.exec(e),
                    o = this.getval(i),
                    h = i ? ("null" === o ? null : o || "{}") : "{}";
                try {
                    const e = JSON.parse(h);
                    this.lodash_set(e, r, t), (s = this.setval(JSON.stringify(e), i));
                } catch (e) {
                    const o = {};
                    this.lodash_set(o, r, t), (s = this.setval(JSON.stringify(o), i));
                }
            } else s = this.setval(t, e);
            return s;
        }
        getval(t) {
            return this.isSurge() || this.isLoon()
                ? $persistentStore.read(t)
                : this.isQuanX()
                    ? $prefs.valueForKey(t)
                    : this.isNode()
                        ? ((this.data = this.loaddata()), this.data[t])
                        : (this.data && this.data[t]) || null;
        }
        setval(t, e) {
            return this.isSurge() || this.isLoon()
                ? $persistentStore.write(t, e)
                : this.isQuanX()
                    ? $prefs.setValueForKey(t, e)
                    : this.isNode()
                        ? ((this.data = this.loaddata()),
                            (this.data[e] = t),
                            this.writedata(),
                            !0)
                        : (this.data && this.data[e]) || null;
        }
        initGotEnv(t) {
            (this.got = this.got ? this.got : require("got")),
                (this.cktough = this.cktough ? this.cktough : require("tough-cookie")),
                (this.ckjar = this.ckjar ? this.ckjar : new this.cktough.CookieJar()),
            t &&
            ((t.headers = t.headers ? t.headers : {}),
            void 0 === t.headers.Cookie &&
            void 0 === t.cookieJar &&
            (t.cookieJar = this.ckjar));
        }
        get(t, e = () => {}) {
            t.headers &&
            (delete t.headers["Content-Type"], delete t.headers["Content-Length"]),
                this.isSurge() || this.isLoon()
                    ? (this.isSurge() &&
                    this.isNeedRewrite &&
                    ((t.headers = t.headers || {}),
                        Object.assign(t.headers, { "X-Surge-Skip-Scripting": !1 })),
                        $httpClient.get(t, (t, s, i) => {
                            !t && s && ((s.body = i), (s.statusCode = s.status)), e(t, s, i);
                        }))
                    : this.isQuanX()
                        ? (this.isNeedRewrite &&
                        ((t.opts = t.opts || {}), Object.assign(t.opts, { hints: !1 })),
                            $task.fetch(t).then(
                                (t) => {
                                    const { statusCode: s, statusCode: i, headers: r, body: o } = t;
                                    e(null, { status: s, statusCode: i, headers: r, body: o }, o);
                                },
                                (t) => e(t)
                            ))
                        : this.isNode() &&
                        (this.initGotEnv(t),
                            this.got(t)
                                .on("redirect", (t, e) => {
                                    try {
                                        if (t.headers["set-cookie"]) {
                                            const s = t.headers["set-cookie"]
                                                .map(this.cktough.Cookie.parse)
                                                .toString();
                                            s && this.ckjar.setCookieSync(s, null),
                                                (e.cookieJar = this.ckjar);
                                        }
                                    } catch (t) {
                                        this.logErr(t);
                                    }
                                })
                                .then(
                                    (t) => {
                                        const {
                                            statusCode: s,
                                            statusCode: i,
                                            headers: r,
                                            body: o,
                                        } = t;
                                        e(null, { status: s, statusCode: i, headers: r, body: o }, o);
                                    },
                                    (t) => {
                                        const { message: s, response: i } = t;
                                        e(s, i, i && i.body);
                                    }
                                ));
        }
        post(t, e = () => {}) {
            if (
                (t.body &&
                t.headers &&
                !t.headers["Content-Type"] &&
                (t.headers["Content-Type"] = "application/x-www-form-urlencoded"),
                t.headers && delete t.headers["Content-Length"],
                this.isSurge() || this.isLoon())
            )
                this.isSurge() &&
                this.isNeedRewrite &&
                ((t.headers = t.headers || {}),
                    Object.assign(t.headers, { "X-Surge-Skip-Scripting": !1 })),
                    $httpClient.post(t, (t, s, i) => {
                        !t && s && ((s.body = i), (s.statusCode = s.status)), e(t, s, i);
                    });
            else if (this.isQuanX())
                (t.method = "POST"),
                this.isNeedRewrite &&
                ((t.opts = t.opts || {}), Object.assign(t.opts, { hints: !1 })),
                    $task.fetch(t).then(
                        (t) => {
                            const { statusCode: s, statusCode: i, headers: r, body: o } = t;
                            e(null, { status: s, statusCode: i, headers: r, body: o }, o);
                        },
                        (t) => e(t)
                    );
            else if (this.isNode()) {
                this.initGotEnv(t);
                const { url: s, ...i } = t;
                this.got.post(s, i).then(
                    (t) => {
                        const { statusCode: s, statusCode: i, headers: r, body: o } = t;
                        e(null, { status: s, statusCode: i, headers: r, body: o }, o);
                    },
                    (t) => {
                        const { message: s, response: i } = t;
                        e(s, i, i && i.body);
                    }
                );
            }
        }
        time(t, e = null) {
            const s = e ? new Date(e) : new Date();
            let i = {
                "M+": s.getMonth() + 1,
                "d+": s.getDate(),
                "H+": s.getHours(),
                "m+": s.getMinutes(),
                "s+": s.getSeconds(),
                "q+": Math.floor((s.getMonth() + 3) / 3),
                S: s.getMilliseconds(),
            };
            /(y+)/.test(t) &&
            (t = t.replace(
                RegExp.$1,
                (s.getFullYear() + "").substr(4 - RegExp.$1.length)
            ));
            for (let e in i)
                new RegExp("(" + e + ")").test(t) &&
                (t = t.replace(
                    RegExp.$1,
                    1 == RegExp.$1.length
                        ? i[e]
                        : ("00" + i[e]).substr(("" + i[e]).length)
                ));
            return t;
        }
        msg(e = t, s = "", i = "", r) {
            const o = (t) => {
                if (!t) return t;
                if ("string" == typeof t)
                    return this.isLoon()
                        ? t
                        : this.isQuanX()
                            ? { "open-url": t }
                            : this.isSurge()
                                ? { url: t }
                                : void 0;
                if ("object" == typeof t) {
                    if (this.isLoon()) {
                        let e = t.openUrl || t.url || t["open-url"],
                            s = t.mediaUrl || t["media-url"];
                        return { openUrl: e, mediaUrl: s };
                    }
                    if (this.isQuanX()) {
                        let e = t["open-url"] || t.url || t.openUrl,
                            s = t["media-url"] || t.mediaUrl;
                        return { "open-url": e, "media-url": s };
                    }
                    if (this.isSurge()) {
                        let e = t.url || t.openUrl || t["open-url"];
                        return { url: e };
                    }
                }
            };
            if (
                (this.isMute ||
                (this.isSurge() || this.isLoon()
                    ? $notification.post(e, s, i, o(r))
                    : this.isQuanX() && $notify(e, s, i, o(r))),
                    !this.isMuteLog)
            ) {
                let t = ["", "==============📣系统通知📣=============="];
                t.push(e),
                s && t.push(s),
                i && t.push(i),
                    console.log(t.join("\n")),
                    (this.logs = this.logs.concat(t));
            }
        }
        log(...t) {
            t.length > 0 && (this.logs = [...this.logs, ...t]),
                console.log(t.join(this.logSeparator));
        }
        logErr(t, e) {
            const s = !this.isSurge() && !this.isQuanX() && !this.isLoon();
            s
                ? this.log("", `❗️${this.name}, 错误!`, t.stack)
                : this.log("", `❗️${this.name}, 错误!`, t);
        }
        wait(t) {
            return new Promise((e) => setTimeout(e, t));
        }
        done(t = {}) {
            const e = new Date().getTime(),
                s = (e - this.startTime) / 1e3;
            this.log("", `🔔${this.name}, 结束! 🕛 ${s} 秒`),
                this.log(),
            (this.isSurge() || this.isQuanX() || this.isLoon()) && $done(t);
        }
    })(t, e);
}
