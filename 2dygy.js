/**
 作者：临渊
 日期：6-21
 抖音小程序：抖抖果园
 功能：签到领水滴、肥料，收取水瓶，每日五次水滴，选择及领取挑战，开宝箱，浇水，三餐礼包，戳鸭子。（浏览任务抓不到包，暂时做不了）
 抓包：进去小程序浇水后抓一个Cookie
 变量格式：export ddgyCk='xxx@xxx '  多个账号用@或者换行分割
 定时：一天五次

 

 可以自己抓User-Agent填到 UA 变量里面，或者懒得抓直接改脚本里面的uaNum也行

 [task_local]
 #抖抖果园
 15 8,10,12,18,20 * * * https://raw.githubusercontent.com/LinYuanovo/scripts/main/dygy.js, tag=抖音果园, enabled=true
 [rewrite_local]
 https://minigame.zijieapi.com/ttgame/game_orchard_ecom/polling_info url script-request-header https://raw.githubusercontent.com/LinYuanovo/scripts/main/dygy.js
 [MITM]
 hostname = minigame.zijieapi.com
cron：35 8,10,12,18,20 * * *
 */

const $ = new Env('抖抖果园');
const notify = $.isNode() ? require('./sendNotify') : '';
const {log} = console;
const Notify = 1; //0为关闭通知，1为打开通知,默认为1
const debug = 0; //0为关闭调试，1为打开调试,默认为0
const uaNum = 1; //随机UA，从0-20随便选一个填上去
//////////////////////
let scriptVersion = "1.1.1";
let scriptVersionLatest = '';
let ddgyCk = ($.isNode() ? process.env.ddgyCk : $.getdata("ddgyCk")) || "";
let UA = ($.isNode() ? process.env.UA : $.getdata("UA")) || "";
let ck;
let UAArr = [];
let ddgyCkArr = [];
let msg = '';
let loginBack = 0;
let boxTimes = 0;
let boxState = 0;
let challengeTimes = 0;
let challengeState = 0;
let waterBack = 0;
let nutrientSignDay = 0;
let liteFertilizerType = 0;
let normalFertilizerType = 0;
let progress = 0.00;
let hour = parseInt(new Date().getHours());
let touchDuckBack = 0;
let giftBack = 0;
let challengeBack = 0;
let boxBack = 0;
let nutrientBack = 0;
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
    "Mozilla/5.0 (iPhone; CPU iPhone OS 13_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148"
]
let ua = User_Agents[uaNum];

!(async () => {
    if (typeof $request !== "undefined") {
        await GetRewrite();
    } else {
        if (!(await Envs()))
            return;
        else {

            log(`\n\n=============================================    \n脚本执行 - 北京时间(UTC+8)：${new Date(
                new Date().getTime() + new Date().getTimezoneOffset() * 60 * 1000 +
                8 * 60 * 60 * 1000).toLocaleString()} \n=============================================\n`);

            await poem();
            await getVersion();
            log(`\n============ 当前版本：${scriptVersion}  最新版本：${scriptVersionLatest} ============`)
            log(`\n=================== 共找到 ${ddgyCkArr.length} 个账号 ===================`)

            if (debug) {
                log(`【debug】 这是你的全部账号数组:\n ${ddgyCkArr}`);
            }


            for (let index = 0; index < ddgyCkArr.length; index++) {

                ua = User_Agents[uaNum+index];

                if (UA) {
                    if (index >= UAArr.length){
                        let i = UAArr.length+randomInt(0,2)
                        ua = User_Agents[uaNum+i];
                    } else ua = UAArr[index];
                }

                let num = index + 1
                log(`\n========= 开始【第 ${num} 个账号】=========\n`)

                ddgyCk = ddgyCkArr[index];

                if (debug) {
                    log(`\n 【debug】 这是你第 ${num} 账号信息:\n ${ddgyCk}\n`);
                }

                msg += `\n第${num}个账号运行结果：`

                log('开始获取信息');
                await getInfo();
                await $.wait(2 * 1000);

                if (loginBack) {
                    if (giftBack) {
                        log('开始领取新人礼物');
                        await getGift();
                        await $.wait(2 * 1000);
                    }

                    log('开始签到');
                    await doSignin();
                    await $.wait(2 * 1000);

                    log('开始收取水瓶奖励');
                    await getBottle();
                    await $.wait(2 * 1000);

                    log('开始领取每日水滴');
                    await getTask1();
                    await $.wait(2 * 1000);

                    log('开始戳鸭子');
                    do {
                        await touchDuck();
                        await $.wait(2 * 1000);
                    } while (touchDuckBack);

                    if (hour >=7 && hour <9) {
                        log('开始领取早餐礼包');
                        await getTask2();
                        await $.wait(2 * 1000);
                    } else if (hour >=12 && hour<14) {
                        log('开始领取午餐礼包');
                        await getTask2();
                        await $.wait(2 * 1000);
                    } else if (hour >=18 && hour <21) {
                        log('开始领取晚餐礼包');
                        await getTask2();
                        await $.wait(2 * 1000);
                    }

                    log('开始选择挑战');
                    await chooseChallenge();
                    await $.wait(2 * 1000);

                    if (nutrientBack) {
                        log('开始肥料签到');
                        await nutrientSignin();
                        await $.wait(2 * 1000);

                        log('开始获取肥料列表');
                        await getNutrientList();
                        await $.wait(2 * 1000);

                        if (liteFertilizerType == 1) {
                            log('开始使用小袋化肥');
                            await useLiteNutrient();
                            await $.wait(2 * 1000);
                        }
                    }

                    log('开始浇水');
                    while (waterBack == 0) {
                        await giveWater();
                        await $.wait(2 * 1000);
                        if (boxBack == 1 && boxTimes == 0 && boxState !=7) {
                            log('开始开宝箱');
                            await openBox();
                            await $.wait(2 * 1000);
                        }
                    }

                    waterBack = 0; //置0
                    if (challengeTimes == 0 && challengeState !=5) {
                        log('开始领取挑战');
                        await getChallengeReward();
                        await $.wait(2 * 1000);
                    }

                    log('开始获取信息');
                    await getHomeInfo();
                    await $.wait(2 * 1000);
                }
                loginBack = 0; //置0

            }
            await SendMsg(msg);
        }
    }

})()
    .catch((e) => log(e))
    .finally(() => $.done())


/**
 * 签到
 */
function doSignin(timeout = 3 * 1000) {
    return new Promise((resolve) => {
        let url = {
            url: `http://minigame.zijieapi.com/ttgame/game_orchard_ecom/sign_in/reward`,
            headers: {"referer":"https://tmaservice.developer.toutiao.com/?appid=tte684903979bdf21a02&version=1.0.18","User-Agent":`${ua}`,"content-type":"application/json","Accept-Encoding":"br, gzip","Host":"minigame.zijieapi.com","Connection":"Keep-Alive","Cookie":`${ddgyCk}`},
        }

        if (debug) {
            log(`\n【debug】=============== 这是 签到 请求 url ===============`);
            log(JSON.stringify(url));
        }

        $.get(url, async (error, response, data) => {
            try {
                if (debug) {
                    log(`\n\n【debug】===============这是 签到 返回data==============`);
                    log(data)
                }

                let result = JSON.parse(data);
                if (result.status_code == 0) {

                    log(`签到成功，获得：${result.data.reward_item.num}${result.data.reward_item.name}`)

                } else if (result.status_code == 1001) {

                    log(`签到失败，原因是:已签到`)

                } else {

                    log(`签到失败，原因是:${result.message}`)

                }

            } catch (e) {
                log(e)
            } finally {
                resolve();
            }
        }, timeout)
    })
}

/**
 * 收取水瓶奖励
 */
function getBottle(timeout = 3 * 1000) {
    return new Promise((resolve) => {
        let url = {
            url: `http://minigame.zijieapi.com/ttgame/game_orchard_ecom/water_bottle/reward`,
            headers: {"referer":"https://tmaservice.developer.toutiao.com/?appid=tte684903979bdf21a02&version=1.0.18","User-Agent":`${ua}`,"content-type":"application/json","Accept-Encoding":"br, gzip","Host":"minigame.zijieapi.com","Connection":"Keep-Alive","Cookie":`${ddgyCk}`},
        }

        if (debug) {
            log(`\n【debug】=============== 这是 收取水瓶奖励 请求 url ===============`);
            log(JSON.stringify(url));
        }

        $.get(url, async (error, response, data) => {
            try {
                if (debug) {
                    log(`\n\n【debug】===============这是 收取水瓶奖励 返回data==============`);
                    log(data)
                }

                let result = JSON.parse(data);
                if (result.status_code == 0) {

                    log(`收取水瓶奖励成功，获得：${result.data.reward_item.num}水滴`)

                } else if (result.status_code == 1001) {

                    log(`收取水瓶奖励失败，原因是:已收取过`)

                } else {

                    log(`收取水瓶奖励失败，原因是:${result.message}`)

                }

            } catch (e) {
                log(e)
            } finally {
                resolve();
            }
        }, timeout)
    })
}

/**
 * 选择挑战
 */
function chooseChallenge(timeout = 3 * 1000) {
    return new Promise((resolve) => {
        let url = {
            url: `http://minigame.zijieapi.com/ttgame/game_orchard_ecom/challenge/choose?task_id=2`,
            headers: {"referer":"https://tmaservice.developer.toutiao.com/?appid=tte684903979bdf21a02&version=1.0.18","User-Agent":`${ua}`,"content-type":"application/json","Accept-Encoding":"br, gzip","Host":"minigame.zijieapi.com","Connection":"Keep-Alive","Cookie":`${ddgyCk}`},
        }

        if (debug) {
            log(`\n【debug】=============== 这是 选择挑战 请求 url ===============`);
            log(JSON.stringify(url));
        }

        $.get(url, async (error, response, data) => {
            try {
                if (debug) {
                    log(`\n\n【debug】===============这是 选择挑战 返回data==============`);
                    log(data)
                }

                let result = JSON.parse(data);
                if (result.status_code == 0) {

                    log(`选择挑战成功，需要浇水${result.data.red_point.times}次`)

                } else if (result.status_code == 1001) {

                    log(`选择挑战失败，原因是:已选择过`)

                } else {

                    log(`选择挑战失败，原因是:${result.message}`)

                }

            } catch (e) {
                log(e)
            } finally {
                resolve();
            }
        }, timeout)
    })
}

/**
 * 领取挑战奖励 （达到次数后再执行）
 */
function getChallengeReward(timeout = 3 * 1000) {
    return new Promise((resolve) => {
        let url = {
            url: `http://minigame.zijieapi.com/ttgame/game_orchard_ecom/challenge/reward`,
            headers: {"referer":"https://tmaservice.developer.toutiao.com/?appid=tte684903979bdf21a02&version=1.0.18","User-Agent":`${ua}`,"content-type":"application/json","Accept-Encoding":"br, gzip","Host":"minigame.zijieapi.com","Connection":"Keep-Alive","Cookie":`${ddgyCk}`},
        }

        if (debug) {
            log(`\n【debug】=============== 这是 领取挑战奖励 请求 url ===============`);
            log(JSON.stringify(url));
        }

        $.get(url, async (error, response, data) => {
            try {
                if (debug) {
                    log(`\n\n【debug】===============这是 领取挑战奖励 返回data==============`);
                    log(data)
                }

                let result = JSON.parse(data);
                if (result.status_code == 0) {

                    challengeTimes = 1;
                    log(`领取挑战奖励成功，获得：${result.data.reward_item.num}水滴`)

                } else if (result.status_code == 1001) {

                    log(`领取挑战奖励失败，原因是:已收取过`)

                } else {

                    log(`领取挑战奖励失败，原因是:${result.message}`)

                }

            } catch (e) {
                log(e)
            } finally {
                resolve();
            }
        }, timeout)
    })
}

/**
 * 浇水
 */
function giveWater(timeout = 3 * 1000) {
    return new Promise((resolve) => {
        let url = {
            url: `http://minigame.zijieapi.com/ttgame/game_orchard_ecom/tree/water`,
            headers: {"referer":"https://tmaservice.developer.toutiao.com/?appid=tte684903979bdf21a02&version=1.0.18","User-Agent":`${ua}`,"content-type":"application/json","Accept-Encoding":"br, gzip","Host":"minigame.zijieapi.com","Connection":"Keep-Alive","Cookie":`${ddgyCk}`},
        }

        if (debug) {
            log(`\n【debug】=============== 这是 浇水 请求 url ===============`);
            log(JSON.stringify(url));
        }

        $.get(url, async (error, response, data) => {
            try {
                if (debug) {
                    log(`\n\n【debug】===============这是 浇水 返回data==============`);
                    log(data)
                }

                let result = JSON.parse(data);
                if (result.status_code == 0) {

                    progress =+ result.data.progress.current/result.data.progress.target;
                    progress = progress * 100;
                    progress = progress.toFixed(2);
                    log(`浇水成功，当前果树等级：${result.data.status}级，剩余水滴：${result.data.kettle.water_num}，进度：${progress}%`)
                    challengeTimes =+ result.data.red_points.challenge.times;
                    challengeState =+ result.data.red_points.challenge.state;
                    if (boxBack) {
                        boxState =+ result.data.red_points.box.state;
                        boxTimes =+ result.data.red_points.box.times;
                    }

                } else if (result.status_code == 1001) {

                    waterBack =+ result.status_code;
                    log(`浇水失败，原因是:水滴数量不足`)

                } else {

                    log(`浇水失败，原因是:${result.message}`)

                }

            } catch (e) {
                log(e)
            } finally {
                resolve();
            }
        }, timeout)
    })
}

/**
 * 开宝箱 （浇水十次开一次）
 */
function openBox(timeout = 3 * 1000) {
    return new Promise((resolve) => {
        let url = {
            url: `http://minigame.zijieapi.com/ttgame/game_orchard_ecom/box/open`,
            headers: {"referer":"https://tmaservice.developer.toutiao.com/?appid=tte684903979bdf21a02&version=1.0.18","User-Agent":`${ua}`,"content-type":"application/json","Accept-Encoding":"br, gzip","Host":"minigame.zijieapi.com","Connection":"Keep-Alive","Cookie":`${ddgyCk}`},
        }

        if (debug) {
            log(`\n【debug】=============== 这是 开宝箱 请求 url ===============`);
            log(JSON.stringify(url));
        }

        $.get(url, async (error, response, data) => {
            try {
                if (debug) {
                    log(`\n\n【debug】===============这是 开宝箱 返回data==============`);
                    log(data)
                }

                let result = JSON.parse(data);
                if (result.status_code == 0) {

                    log(`开宝箱成功，获得：${result.data.reward_item.num}${result.data.reward_item.name}`)

                } else if (result.status_code == 1001) {

                    log(`开宝箱失败，原因是:开宝箱次数已用完`)

                } else {

                    log(`开宝箱失败，原因是:${result.message}`)

                }

            } catch (e) {
                log(e)
            } finally {
                resolve();
            }
        }, timeout)
    })
}

/**
 * 领取每日水滴 （一天五次，五分钟一次）
 */
function getTask1(timeout = 3 * 1000) {
    return new Promise((resolve) => {
        let url = {
            url: `http://minigame.zijieapi.com/ttgame/game_orchard_ecom/tasks/reward?task_id=1`,
            headers: {"referer":"https://tmaservice.developer.toutiao.com/?appid=tte684903979bdf21a02&version=1.0.18","User-Agent":`${ua}`,"content-type":"application/json","Accept-Encoding":"br, gzip","Host":"minigame.zijieapi.com","Connection":"Keep-Alive","Cookie":`${ddgyCk}`},
        }

        if (debug) {
            log(`\n【debug】=============== 这是 领取每日水滴 请求 url ===============`);
            log(JSON.stringify(url));
        }

        $.get(url, async (error, response, data) => {
            try {
                if (debug) {
                    log(`\n\n【debug】===============这是 领取每日水滴 返回data==============`);
                    log(data)
                }

                let result = JSON.parse(data);
                if (result.status_code == 0) {

                    log(`领取每日水滴成功，获得：${result.data.task.reward_item.num}水滴`)

                } else if (result.status_code == 1001) {

                    log(`领取每日水滴失败，原因是:未到时间`)

                } else {

                    log(`领取每日水滴失败，原因是:${result.message}`)

                }

            } catch (e) {
                log(e)
            } finally {
                resolve();
            }
        }, timeout)
    })
}

/**
 * 领取三餐礼包 （7-9 12-14 18-21点）
 */
function getTask2(timeout = 3 * 1000) {
    return new Promise((resolve) => {
        let url = {
            url: `http://minigame.zijieapi.com/ttgame/game_orchard_ecom/tasks/reward?task_id=2`,
            headers: {"referer":"https://tmaservice.developer.toutiao.com/?appid=tte684903979bdf21a02&version=1.0.18","User-Agent":`${ua}`,"content-type":"application/json","Accept-Encoding":"br, gzip","Host":"minigame.zijieapi.com","Connection":"Keep-Alive","Cookie":`${ddgyCk}`},
        }

        if (debug) {
            log(`\n【debug】=============== 这是 领取三餐礼包 请求 url ===============`);
            log(JSON.stringify(url));
        }

        $.get(url, async (error, response, data) => {
            try {
                if (debug) {
                    log(`\n\n【debug】===============这是 领取三餐礼包 返回data==============`);
                    log(data)
                }

                let result = JSON.parse(data);
                if (result.status_code == 0) {

                    log(`领取三餐礼包成功，获得：${result.data.task.reward_item.num}水滴`)

                } else if (result.status_code == 1001) {

                    log(`领取三餐礼包失败，原因是:未到时间`)

                } else {

                    log(`领取三餐礼包失败，原因是:${result.message}`)

                }

            } catch (e) {
                log(e)
            } finally {
                resolve();
            }
        }, timeout)
    })
}

/**
 * 获取肥料列表
 */
function getNutrientList(timeout = 3 * 1000) {
    return new Promise((resolve) => {
        let url = {
            url: `http://minigame.zijieapi.com/ttgame/game_orchard_ecom/nutrient/list`,
            headers: {"referer":"https://tmaservice.developer.toutiao.com/?appid=tte684903979bdf21a02&version=1.0.18","User-Agent":`${ua}`,"content-type":"application/json","Accept-Encoding":"br, gzip","Host":"minigame.zijieapi.com","Connection":"Keep-Alive","Cookie":`${ddgyCk}`},
        }

        if (debug) {
            log(`\n【debug】=============== 这是 获取肥料列表 请求 url ===============`);
            log(JSON.stringify(url));
        }

        $.get(url, async (error, response, data) => {
            try {
                if (debug) {
                    log(`\n\n【debug】===============这是 获取肥料列表 返回data==============`);
                    log(data)
                }

                let result = JSON.parse(data);
                if (result.status_code == 0) {

                    log(`获取肥料列表成功`)
                    normalFertilizerType = result.data.fertilizer.normal;
                    liteFertilizerType = result.data.fertilizer.lite;
                    nutrientSignDay = result.data.sign.cur_times;

                } else {

                    log(`获取肥料列表失败，原因是:${result.message}`)

                }

            } catch (e) {
                log(e)
            } finally {
                resolve();
            }
        }, timeout)
    })
}

/**
 * 肥料签到
 */
function nutrientSignin(timeout = 3 * 1000) {
    return new Promise((resolve) => {
        let url = {
            url: `http://minigame.zijieapi.com/ttgame/game_orchard_ecom/nutrient/sign_in`,
            headers: {"referer":"https://tmaservice.developer.toutiao.com/?appid=tte684903979bdf21a02&version=1.0.18","User-Agent":`${ua}`,"content-type":"application/json","Accept-Encoding":"br, gzip","Host":"minigame.zijieapi.com","Connection":"Keep-Alive","Cookie":`${ddgyCk}`},
        }

        if (debug) {
            log(`\n【debug】=============== 这是 肥料签到 请求 url ===============`);
            log(JSON.stringify(url));
        }

        $.get(url, async (error, response, data) => {
            try {
                if (debug) {
                    log(`\n\n【debug】===============这是 肥料签到 返回data==============`);
                    log(data)
                }

                let result = JSON.parse(data);
                if (result.status_code == 0) {

                    log(`肥料签到成功，已签到：${result.data.sign.cur_times}天`)

                } else if (result.status_code == 1001) {

                    log(`肥料签到失败，原因是:已签到`)

                } else {

                    log(`肥料签到失败，原因是:${result.message}`)

                }

            } catch (e) {
                log(e)
            } finally {
                resolve();
            }
        }, timeout)
    })
}

/**
 * 使用小袋肥料
 */
function useLiteNutrient(timeout = 3 * 1000) {
    return new Promise((resolve) => {
        let url = {
            url: `http://minigame.zijieapi.com/ttgame/game_orchard_ecom/use/fertilizer?fertilizer_type=4`,
            headers: {"referer":"https://tmaservice.developer.toutiao.com/?appid=tte684903979bdf21a02&version=1.0.18","User-Agent":`${ua}`,"content-type":"application/json","Accept-Encoding":"br, gzip","Host":"minigame.zijieapi.com","Connection":"Keep-Alive","Cookie":`${ddgyCk}`},
        }

        if (debug) {
            log(`\n【debug】=============== 这是 使用小袋肥料 请求 url ===============`);
            log(JSON.stringify(url));
        }

        $.get(url, async (error, response, data) => {
            try {
                if (debug) {
                    log(`\n\n【debug】===============这是 使用小袋肥料 返回data==============`);
                    log(data)
                }

                let result = JSON.parse(data);
                if (result.status_code == 0) {

                    log(`使用小袋肥料成功，剩余肥料为：${result.data.nutrient}`)

                } else if (result.status_code == 1001) {

                    log(`使用小袋肥料失败，原因是:小袋肥料不足`)

                } else {

                    log(`使用小袋肥料失败，原因是:${result.message}`)

                }

            } catch (e) {
                log(e)
            } finally {
                resolve();
            }
        }, timeout)
    })
}

/**
 * 获取主页信息
 */
function getHomeInfo(timeout = 3 * 1000) {
    return new Promise((resolve) => {
        let url = {
            url: `http://minigame.zijieapi.com/ttgame/game_orchard_ecom/home_info`,
            headers: {"referer":"https://tmaservice.developer.toutiao.com/?appid=tte684903979bdf21a02&version=1.0.18","User-Agent":`${ua}`,"content-type":"application/json","Accept-Encoding":"br, gzip","Host":"minigame.zijieapi.com","Connection":"Keep-Alive","Cookie":`${ddgyCk}`},
        }

        if (debug) {
            log(`\n【debug】=============== 这是 获取主页信息 请求 url ===============`);
            log(JSON.stringify(url));
        }

        $.get(url, async (error, response, data) => {
            try {
                if (debug) {
                    log(`\n\n【debug】===============这是 获取主页信息 返回data==============`);
                    log(data)
                }

                let result = JSON.parse(data);
                if (result.status_code == 0) {

                    progress =+ result.data.info.progress.current/result.data.info.progress.target;
                    progress = progress * 100;
                    progress = progress.toFixed(2);
                    log(`获取主页信息成功，当前果树等级：${result.data.info.status}级，养分：${result.data.info.nutrient}，进度：${progress}%`)
                    msg += `\n当前果树等级：${result.data.info.status}级，养分：${result.data.info.nutrient}，进度：${progress}%`
                    //fruit_id=5应该是芒果，4是橙子，其他未知，后期补上

                } else {

                    log(`获取主页信息失败，原因是:${result.message}`)

                }

            } catch (e) {
                log(e)
            } finally {
                resolve();
            }
        }, timeout)
    })
}

/**
 * 戳鸭子 （应该只有五次）
 */
function touchDuck(timeout = 3 * 1000) {
    return new Promise((resolve) => {
        let url = {
            url: `http://minigame.zijieapi.com/ttgame/game_orchard_ecom/scene/touch?scene_id=1`,
            headers: {"referer":"https://tmaservice.developer.toutiao.com/?appid=tte684903979bdf21a02&version=1.0.18","User-Agent":`${ua}`,"content-type":"application/json","Accept-Encoding":"br, gzip","Host":"minigame.zijieapi.com","Connection":"Keep-Alive","Cookie":`${ddgyCk}`},
        }

        if (debug) {
            log(`\n【debug】=============== 这是 戳鸭子 请求 url ===============`);
            log(JSON.stringify(url));
        }

        $.get(url, async (error, response, data) => {
            try {
                if (debug) {
                    log(`\n\n【debug】===============这是 戳鸭子 返回data==============`);
                    log(data)
                }

                let result = JSON.parse(data);
                if (result.status_code == 0) {

                    if (result.data.reward_item != null){
                        log(`戳鸭子成功，获得：${result.data.reward_item.num}${result.data.reward_item.name}`)
                    }
                    if (result.data.red_point[0].round_info.current_round != result.data.red_point[0].round_info.total_round) {
                        touchDuckBack = 1;
                    } else {
                        touchDuckBack = 0;
                    }

                } else if (result.status_code == 1001) {

                    log(`戳鸭子失败，原因是:戳鸭子次数已用完`)

                } else {

                    log(`戳鸭子失败，原因是:${result.message}`)

                }

            } catch (e) {
                log(e)
            } finally {
                resolve();
            }
        }, timeout)
    })
}

/**
 * 获取信息
 */
function getInfo(timeout = 3 * 1000) {
    return new Promise((resolve) => {
        let url = {
            url: `http://minigame.zijieapi.com/ttgame/game_orchard_ecom/polling_info`,
            headers: {"referer":"https://tmaservice.developer.toutiao.com/?appid=tte684903979bdf21a02&version=1.0.18","User-Agent":`${ua}`,"content-type":"application/json","Accept-Encoding":"br, gzip","Host":"minigame.zijieapi.com","Connection":"Keep-Alive","Cookie":`${ddgyCk}`},
        }

        if (debug) {
            log(`\n【debug】=============== 这是 获取主页信息 请求 url ===============`);
            log(JSON.stringify(url));
        }

        $.get(url, async (error, response, data) => {
            try {
                if (debug) {
                    log(`\n\n【debug】===============这是 获取主页信息 返回data==============`);
                    log(data)
                }

                let result = data == "undefined" ? await getInfo() : JSON.parse(data);
                if (result.status_code == 0) {
                    loginBack = 1;
                    if (result.data.show_info.show_green_gift == true) {
                        giftBack = 1;
                    }
                    if (result.data.red_points.box) {
                        boxBack = 1;
                    }
                    if (result.data.show_info.show_nutrient == true) {
                        nutrientBack = 1;
                    }
                } else {

                    log(`获取主页信息失败，原因是:${result.message}，退出脚本`)

                }

            } catch (e) {
                log(e)
            } finally {
                resolve();
            }
        }, timeout)
    })
}

/**
 * 新手礼物 （四次）
 */
function getGift(timeout = 3 * 1000) {
    return new Promise((resolve) => {
        let url = {
            url: `http://minigame.zijieapi.com/ttgame/game_orchard_ecom/green_gift/reward?aid=1128`,
            headers: {"referer":"https://tmaservice.developer.toutiao.com/?appid=tte684903979bdf21a02&version=1.0.18","User-Agent":`${ua}`,"content-type":"application/json","Accept-Encoding":"br, gzip","Host":"minigame.zijieapi.com","Connection":"Keep-Alive","Cookie":`${ddgyCk}`},
        }

        if (debug) {
            log(`\n【debug】=============== 这是 新手礼物 请求 url ===============`);
            log(JSON.stringify(url));
        }

        $.get(url, async (error, response, data) => {
            try {
                if (debug) {
                    log(`\n\n【debug】===============这是 新手礼物 返回data==============`);
                    log(data)
                }

                let result = JSON.parse(data);
                if (result.status_code == 0) {

                    log(`领取新手礼物成功，获得：${result.data.reward_item.num}水滴`)

                } else if (result.status_code == 1001) {

                    log(`领取新手礼物失败，原因是:${result.message}`)

                } else {

                    log(`领取新手礼物失败，原因是:${result.message}`)

                }

            } catch (e) {
                log(e)
            } finally {
                resolve();
            }
        }, timeout)
    })
}

// ============================================重写============================================ \\
async function GetRewrite() {
    if ($request.url.indexOf("game_orchard_ecom/polling_info") > -1) {
        const ck = $request.headers.Cookie;
        if (ddgyCk) {
            if (ddgyCk.indexOf(ck) == -1) {
                ddgyCk = ddgyCk + "@" + ck;
                $.setdata(ckStr, "ddgyCk");
                List = ddgyCk.split("@");
                $.msg($.name + ` 获取第${ddgyCk.length}个 ck 成功: ${ck} ,不用请自行关闭重写!`);
            }
        } else {
            $.setdata(ck, "ddgyCk");
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
    if (ddgyCk) {
        if (ddgyCk.indexOf("@") != -1) {
            ddgyCk.split("@").forEach((item) => {
                ddgyCkArr.push(item);
            });
        } else if (ddgyCk.indexOf("\n") != -1) {
            ddgyCk.split("\n").forEach((item) => {
                ddgyCkArr.push(item);
            });
        } else {
            ddgyCkArr.push(ddgyCk);
        }
    } else {
        log(`\n 【${$.name}】：未填写变量 ddgyCk`)
        return;
    }

    return true;
}

// ============================================发送消息============================================ \\
async function SendMsg(message) {
    if (!message)
        return;

    if (Notify > 0) {
        if ($.isNode()) {
            var notify = require('./sendNotify');
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
    for (i = 0; i < e; i++)
        n += t.charAt(Math.floor(Math.random() * a));
    return n
}

/**
 * 随机整数生成
 */
function randomInt(min, max) {
    return Math.round(Math.random() * (max - min) + min)
}

/**
 * 获取毫秒时间戳
 */
function timestampMs(){
    return new Date().getTime();
}

/**
 * 获取秒时间戳
 */
function timestampS(){
    return Date.parse(new Date())/1000;
}

/**
 * 获取随机诗词
 */
function poem(timeout = 3 * 1000) {
    return new Promise((resolve) => {
        let url = {
            url: `https://v1.jinrishici.com/all.json`
        }
        $.get(url, async (err, resp, data) => {
            try {
                data = JSON.parse(data)
                log(`${data.content}  \n————《${data.origin}》${data.author}`);
            } catch (e) {
                log(e, resp);
            } finally {
                resolve()
            }
        }, timeout)
    })
}

/**
 * 修改配置文件
 */
function modify() {

    fs.readFile('/ql/data/config/config.sh','utf8',function(err,dataStr){
        if(err){
            return log('读取文件失败！'+err)
        }
        else {
            var result = dataStr.replace(/regular/g,string);
            fs.writeFile('/ql/data/config/config.sh', result, 'utf8', function (err) {
                if (err) {return log(err);}
            });
        }
    })
}

/**
 * 获取远程版本
 */
function getVersion(timeout = 3 * 1000) {
    return new Promise((resolve) => {
        let url = {
            url: `https://raw.gh.fakev.cn/LinYuanovo/scripts/main/dygy.js`,
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
function Env(t, e) { "undefined" != typeof process && JSON.stringify(process.env).indexOf("GITHUB") > -1 && process.exit(0); class s { constructor(t) { this.env = t } send(t, e = "GET") { t = "string" == typeof t ? { url: t } : t; let s = this.get; return "POST" === e && (s = this.post), new Promise((e, i) => { s.call(this, t, (t, s, r) => { t ? i(t) : e(s) }) }) } get(t) { return this.send.call(this.env, t) } post(t) { return this.send.call(this.env, t, "POST") } } return new class { constructor(t, e) { this.name = t, this.http = new s(this), this.data = null, this.dataFile = "box.dat", this.logs = [], this.isMute = !1, this.isNeedRewrite = !1, this.logSeparator = "\n", this.startTime = (new Date).getTime(), Object.assign(this, e), this.log("", `🔔${this.name}, 开始!`) } isNode() { return "undefined" != typeof module && !!module.exports } isQuanX() { return "undefined" != typeof $task } isSurge() { return "undefined" != typeof $httpClient && "undefined" == typeof $loon } isLoon() { return "undefined" != typeof $loon } toObj(t, e = null) { try { return JSON.parse(t) } catch { return e } } toStr(t, e = null) { try { return JSON.stringify(t) } catch { return e } } getjson(t, e) { let s = e; const i = this.getdata(t); if (i) try { s = JSON.parse(this.getdata(t)) } catch { } return s } setjson(t, e) { try { return this.setdata(JSON.stringify(t), e) } catch { return !1 } } getScript(t) { return new Promise(e => { this.get({ url: t }, (t, s, i) => e(i)) }) } runScript(t, e) { return new Promise(s => { let i = this.getdata("@chavy_boxjs_userCfgs.httpapi"); i = i ? i.replace(/\n/g, "").trim() : i; let r = this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout"); r = r ? 1 * r : 20, r = e && e.timeout ? e.timeout : r; const [o, h] = i.split("@"), n = { url: `http://${h}/v1/scripting/evaluate`, body: { script_text: t, mock_type: "cron", timeout: r }, headers: { "X-Key": o, Accept: "*/*" } }; this.post(n, (t, e, i) => s(i)) }).catch(t => this.logErr(t)) } loaddata() { if (!this.isNode()) return {}; { this.fs = this.fs ? this.fs : require("fs"), this.path = this.path ? this.path : require("path"); const t = this.path.resolve(this.dataFile), e = this.path.resolve(process.cwd(), this.dataFile), s = this.fs.existsSync(t), i = !s && this.fs.existsSync(e); if (!s && !i) return {}; { const i = s ? t : e; try { return JSON.parse(this.fs.readFileSync(i)) } catch (t) { return {} } } } } writedata() { if (this.isNode()) { this.fs = this.fs ? this.fs : require("fs"), this.path = this.path ? this.path : require("path"); const t = this.path.resolve(this.dataFile), e = this.path.resolve(process.cwd(), this.dataFile), s = this.fs.existsSync(t), i = !s && this.fs.existsSync(e), r = JSON.stringify(this.data); s ? this.fs.writeFileSync(t, r) : i ? this.fs.writeFileSync(e, r) : this.fs.writeFileSync(t, r) } } lodash_get(t, e, s) { const i = e.replace(/\[(\d+)\]/g, ".$1").split("."); let r = t; for (const t of i) if (r = Object(r)[t], void 0 === r) return s; return r } lodash_set(t, e, s) { return Object(t) !== t ? t : (Array.isArray(e) || (e = e.toString().match(/[^.[\]]+/g) || []), e.slice(0, -1).reduce((t, s, i) => Object(t[s]) === t[s] ? t[s] : t[s] = Math.abs(e[i + 1]) >> 0 == +e[i + 1] ? [] : {}, t)[e[e.length - 1]] = s, t) } getdata(t) { let e = this.getval(t); if (/^@/.test(t)) { const [, s, i] = /^@(.*?)\.(.*?)$/.exec(t), r = s ? this.getval(s) : ""; if (r) try { const t = JSON.parse(r); e = t ? this.lodash_get(t, i, "") : e } catch (t) { e = "" } } return e } setdata(t, e) { let s = !1; if (/^@/.test(e)) { const [, i, r] = /^@(.*?)\.(.*?)$/.exec(e), o = this.getval(i), h = i ? "null" === o ? null : o || "{}" : "{}"; try { const e = JSON.parse(h); this.lodash_set(e, r, t), s = this.setval(JSON.stringify(e), i) } catch (e) { const o = {}; this.lodash_set(o, r, t), s = this.setval(JSON.stringify(o), i) } } else s = this.setval(t, e); return s } getval(t) { return this.isSurge() || this.isLoon() ? $persistentStore.read(t) : this.isQuanX() ? $prefs.valueForKey(t) : this.isNode() ? (this.data = this.loaddata(), this.data[t]) : this.data && this.data[t] || null } setval(t, e) { return this.isSurge() || this.isLoon() ? $persistentStore.write(t, e) : this.isQuanX() ? $prefs.setValueForKey(t, e) : this.isNode() ? (this.data = this.loaddata(), this.data[e] = t, this.writedata(), !0) : this.data && this.data[e] || null } initGotEnv(t) { this.got = this.got ? this.got : require("got"), this.cktough = this.cktough ? this.cktough : require("tough-cookie"), this.ckjar = this.ckjar ? this.ckjar : new this.cktough.CookieJar, t && (t.headers = t.headers ? t.headers : {}, void 0 === t.headers.Cookie && void 0 === t.cookieJar && (t.cookieJar = this.ckjar)) } get(t, e = (() => { })) { t.headers && (delete t.headers["Content-Type"], delete t.headers["Content-Length"]), this.isSurge() || this.isLoon() ? (this.isSurge() && this.isNeedRewrite && (t.headers = t.headers || {}, Object.assign(t.headers, { "X-Surge-Skip-Scripting": !1 })), $httpClient.get(t, (t, s, i) => { !t && s && (s.body = i, s.statusCode = s.status), e(t, s, i) })) : this.isQuanX() ? (this.isNeedRewrite && (t.opts = t.opts || {}, Object.assign(t.opts, { hints: !1 })), $task.fetch(t).then(t => { const { statusCode: s, statusCode: i, headers: r, body: o } = t; e(null, { status: s, statusCode: i, headers: r, body: o }, o) }, t => e(t))) : this.isNode() && (this.initGotEnv(t), this.got(t).on("redirect", (t, e) => { try { if (t.headers["set-cookie"]) { const s = t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString(); s && this.ckjar.setCookieSync(s, null), e.cookieJar = this.ckjar } } catch (t) { this.logErr(t) } }).then(t => { const { statusCode: s, statusCode: i, headers: r, body: o } = t; e(null, { status: s, statusCode: i, headers: r, body: o }, o) }, t => { const { message: s, response: i } = t; e(s, i, i && i.body) })) } post(t, e = (() => { })) { if (t.body && t.headers && !t.headers["Content-Type"] && (t.headers["Content-Type"] = "application/x-www-form-urlencoded"), t.headers && delete t.headers["Content-Length"], this.isSurge() || this.isLoon()) this.isSurge() && this.isNeedRewrite && (t.headers = t.headers || {}, Object.assign(t.headers, { "X-Surge-Skip-Scripting": !1 })), $httpClient.post(t, (t, s, i) => { !t && s && (s.body = i, s.statusCode = s.status), e(t, s, i) }); else if (this.isQuanX()) t.method = "POST", this.isNeedRewrite && (t.opts = t.opts || {}, Object.assign(t.opts, { hints: !1 })), $task.fetch(t).then(t => { const { statusCode: s, statusCode: i, headers: r, body: o } = t; e(null, { status: s, statusCode: i, headers: r, body: o }, o) }, t => e(t)); else if (this.isNode()) { this.initGotEnv(t); const { url: s, ...i } = t; this.got.post(s, i).then(t => { const { statusCode: s, statusCode: i, headers: r, body: o } = t; e(null, { status: s, statusCode: i, headers: r, body: o }, o) }, t => { const { message: s, response: i } = t; e(s, i, i && i.body) }) } } time(t, e = null) { const s = e ? new Date(e) : new Date; let i = { "M+": s.getMonth() + 1, "d+": s.getDate(), "H+": s.getHours(), "m+": s.getMinutes(), "s+": s.getSeconds(), "q+": Math.floor((s.getMonth() + 3) / 3), S: s.getMilliseconds() }; /(y+)/.test(t) && (t = t.replace(RegExp.$1, (s.getFullYear() + "").substr(4 - RegExp.$1.length))); for (let e in i) new RegExp("(" + e + ")").test(t) && (t = t.replace(RegExp.$1, 1 == RegExp.$1.length ? i[e] : ("00" + i[e]).substr(("" + i[e]).length))); return t } msg(e = t, s = "", i = "", r) { const o = t => { if (!t) return t; if ("string" == typeof t) return this.isLoon() ? t : this.isQuanX() ? { "open-url": t } : this.isSurge() ? { url: t } : void 0; if ("object" == typeof t) { if (this.isLoon()) { let e = t.openUrl || t.url || t["open-url"], s = t.mediaUrl || t["media-url"]; return { openUrl: e, mediaUrl: s } } if (this.isQuanX()) { let e = t["open-url"] || t.url || t.openUrl, s = t["media-url"] || t.mediaUrl; return { "open-url": e, "media-url": s } } if (this.isSurge()) { let e = t.url || t.openUrl || t["open-url"]; return { url: e } } } }; if (this.isMute || (this.isSurge() || this.isLoon() ? $notification.post(e, s, i, o(r)) : this.isQuanX() && $notify(e, s, i, o(r))), !this.isMuteLog) { let t = ["", "==============📣系统通知📣=============="]; t.push(e), s && t.push(s), i && t.push(i), console.log(t.join("\n")), this.logs = this.logs.concat(t) } } log(...t) { t.length > 0 && (this.logs = [...this.logs, ...t]), console.log(t.join(this.logSeparator)) } logErr(t, e) { const s = !this.isSurge() && !this.isQuanX() && !this.isLoon(); s ? this.log("", `❗️${this.name}, 错误!`, t.stack) : this.log("", `❗️${this.name}, 错误!`, t) } wait(t) { return new Promise(e => setTimeout(e, t)) } done(t = {}) { const e = (new Date).getTime(), s = (e - this.startTime) / 1e3; this.log("", `🔔${this.name}, 结束! 🕛 ${s} 秒`), this.log(), (this.isSurge() || this.isQuanX() || this.isLoon()) && $done(t) } }(t, e) }
