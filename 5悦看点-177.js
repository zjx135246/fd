/*
�ű�����: QuantumultX, Surge, Loon, JSBox, Node.js
��������ÿ���
�������ӣ�https://yuekandian.yichengw.cn/download?app=1&referrer=465331
��REWRITE��
ƥ������ https://yuekandian.yichengw.cn/api/v1/reward/coin?
��Ӧ��дĿ�� https://raw.fastgit.org/byxiaopeng/myscripts/main/ykd.js
[MITM]
hostname = yuekandian.yichengw.cn
boxjs��ַ : https://raw.fastgit.org/byxiaopeng/myscripts/main/byxiaopeng.boxjs.json
ʳ�÷����������ҳ���ݼ��ɻ�ȡ
cron: 10 9 * * * ykd.js
//nodejs
export ykdhd='{"Host":"yuekandian.yichengw.cn".......}'
ץ��head��ͷȫ������Ȼ��ת��json��ʽ�����,https://tooltt.com/header2json/
/////////////////////////////////////////////////////////////////////////////
*/

const $ = new Env('�ÿ���');
let status;
status = (status = ($.getval("ykdstatus") || "1")) > 1 ? `${status}` : ""; // �˺���չ�ַ�
const ykdhdArr = [],
    ykdcount = ''
let ykdhd = $.isNode() ? (process.env.ykdhd ? process.env.ykdhd : "") : ($.getdata('ykdhd') ? $.getdata('ykdhd') : "")
let ykdhds = ""
let times = new Date().getTime();
let tz = ($.getval('tz') || '1');
let arr = [1, 2, 3, 4];
let cgarr = [1, 2, 3, 4, 5, 6, 7];
let host=`https://yuekandian.yichengw.cn`
$.message = ''

!(async() => {
  if (typeof $request !== "undefined") {
    ykdck()
  } else {
    if (!$.isNode()) {
        ykdhdArr.push($.getdata('ykdhd'))
      let ykdcount = ($.getval('ykdcount') || '1');
      for (let i = 2; i <= ykdcount; i++) {
        ykdhdArr.push($.getdata(`ykdhd${i}`))
      }
      console.log(`-------------��${ykdhdArr.length}���˺�-------------\n`)
      for (let i = 0; i < ykdhdArr.length; i++) {
        if (ykdhdArr[i]) {
            ykdhd = ykdhdArr[i];
            $.index = i + 1;
            console.log(`\n���ÿ��� �˺�${$.index} ��`)
            await sign() 
        }
      }
    } else {
      if (process.env.ykdhd && process.env.ykdhd.indexOf('@') > -1) {
        ykdhdArr = process.env.ykdhd.split('@');
        console.log(`��ѡ�������"@"����\n`)
      } else {
        ykdhds = [process.env.ykdhd]
      };
      Object.keys(ykdhds).forEach((item) => {
        if (ykdhds[item]) {
            ykdhdArr.push(ykdhds[item])
        }
      })
      console.log(`��${ykdhdArr.length}���˺�`)
      for (let k = 0; k < ykdhdArr.length; k++) {
        $.message = ""
        ykdhd = ykdhdArr[k]
        $.index = k + 1;
        console.log(`\n���ÿ��� �˺�${$.index} ��`)
        await sign() 
      }
    }
  }
  message()
})()
  .catch ((e) => $.logErr(e))
  .finally(() => $.done())


function ykdck() {
    if ($request.url.indexOf("api/v1/reward/coin?") > -1) {
        const ykdhd = JSON.stringify($request.headers)
        if (ykdhd) $.setdata(ykdhd, `ykdhd${status}`)
        $.log(ykdhd)
        $.msg($.name, "", `�ÿ���${status}headers��ȡ�ɹ�`)
    }
}



//������Ϣ
function profile(timeout = 0) {
    return new Promise((resolve) => {
        let url = {
            url: `${host}/api/v1/member/profile?debug=0&`,
            headers: JSON.parse(ykdhd),
        }
        $.get(url, async (err, resp, data) => {
            try {
                result = JSON.parse(data)
                if (result.code == 0) {
                    $.message += `\n��10.22�����޸��Զ��������Ӵ��ػ��ֻ�`
                    $.message += `\n����ӭ��ë�û�����${result.result.nickname}`
                    $.message += `\n����ǰ�˻���ҡ���${result.result.point}`
                    $.message += `\n������ȯ����${result.result.ticket}`
                    $.message += `\n���ֻ���Ƭ����${result.result.fragment}`
                    $.message += `\n���˻������롿��${result.result.pin}`
                    $.message += `\n�����������ҡ���${result.result['today_point']}`
                } else {
                    $.log(`\n������̫����~`)
                }
            } catch (e) {

            } finally {

                resolve()
            }
        }, timeout)
    })
}
//ǩ����Ϣ
function sign(timeout = 0) {
    return new Promise((resolve) => {
        let url = {
            url: `${host}/api/v1/reward/sign?`,
            headers: JSON.parse(ykdhd),
        }
        $.post(url, async (err, resp, data) => {
            try {
                result = JSON.parse(data)
                if (result.code == 0) {
                    $.log(`\n��ǩ��״̬����${result.result.message}`)
                    $.log(`\n��ǩ����ý�ҡ���${result.result.coin}`)
                    $.log(`\n��ǩ���������ȯ����${result.result.coupon}`)
                    await $.wait(2000)
                    await allcoin(arr) //��ҳ����
                    await $.wait(2000)
                    for (let p = 0; p < 10; p++) {
                        $.index = p + 1
                        $.log(`\n����ʼ��${p + 1}������Ƶ����`)
                        await video()
                        await $.wait(10000)
                    }
                    for (let t = 0; t < 10; t++) {
                        $.index = t + 1
                        $.log(`\n����ʼ��${t + 1}�γ齱��`)
                        await lottery()
                        await $.wait(20000)
                    }
                    await $.wait(2000)
                    await news()  //ˢ����
                    await $.wait(2000)
                    await short()  //ˢС��Ƶ
                    await $.wait(5000)
                    await allbarrier(cgarr) //����
                    await $.wait(5000)
                    await profile()
                    await $.wait(5000)
                    await exchange() //��ʼ����
                } else {
                    $.log(`\n��ǩ��״̬����${result.message}`)
                    await $.wait(2000)
                    await allcoin(arr)
                }
            } catch (e) {

            } finally {

                resolve()
            }
        }, timeout)
    })
}
//��ѯ�Ƿ��������Ҫ��
function exchange(timeout = 0) {
    return new Promise((resolve) => {
        let url = {
            url: `${host}/api/v1/cash/exchange?`,
            headers: JSON.parse(ykdhd),
        }
        $.get(url, async (err, resp, data) => {
            try {
                result = JSON.parse(data)
                if (result.result.items[0]['is_ok'] == 1) {
                    $.log(`\n������Ҫ�󡿣�${result.result.items[0]['tixian_tip']}`)
                    await $.wait(2000)
                    await exchangetx() //��ʼ����
                } else {
                    $.log(`\n������������Ҫ�� ȥ��Ѷҳ��ۿ�2���ӡ�`)
                }
            } catch (e) {
            } finally {
                resolve()
            }
        }, timeout)
    })
}
//��������
function exchangetx(timeout = 0) {
    return new Promise((resolve) => {
        let url = {
            url: `${host}/api/v1/cash/exchange?`,
            headers: JSON.parse(ykdhd),
            body: `amount=0.3&gate=wechat&`,
        }
        $.post(url, async (err, resp, data) => {
            try {
                result = JSON.parse(data)
                if (result.code == 0) {
                    $.log(`\n������״̬����${result.result.message}`)
                    $.log(`\n�����ֽ��ȡ���${result.result.title}`)
                    $.message += `\n������״̬����${result.result.message}`
                    $.message += `\n�����ֽ��ȡ���${result.result.title}`
                } else {
                    $.log(`\n������״̬����${result.message}`)
                }
            } catch (e) {
            } finally {
                resolve()
            }
        }, timeout)
    })
}
//������׼��
function news(timeout = 0) {
    return new Promise((resolve) => {
        let url = {
            url: `${host}/api/v1/reward/news/detail?`,
            headers: JSON.parse(ykdhd),
        }
        $.get(url, async (err, resp, data) => {
            try {
                result = JSON.parse(data)
                if (result.code == 0) {
                    console.log(`��׼����ʼ����Ѷ��\n`)
                    newstime1 = result.result.time * 1000
                    newstck1 = result.result.ticket
                    await interval() //��ʼ��¼�Ķ�ʱ��
                    await $.wait(newstime1)
                    await rewardnews(newstck1)
                } else {
                    console.log(`����ȡ����Ѷʧ�ܡ�`)

                }
            } catch (e) {

            } finally {

                resolve()
            }
        }, timeout)
    })
}

//��ʼ��¼�Ķ�ʱ��
function interval(timeout = 0) {
    return new Promise((resolve) => {
        let url = {
            url: `${host}/api/v1/reward/news/interval?`,
            headers: JSON.parse(ykdhd),
        }
        $.get(url, async (err, resp, data) => {
            try {
                result = JSON.parse(data)
                if (result.code == 0) {
                    console.log(`������Ѷʱ����¼��ʼ��\n`)
                } else {
                    console.log(`������Ѷʱ����¼ʧ�ܡ�`)

                }
            } catch (e) {

            } finally {

                resolve()
            }
        }, timeout)
    })
}

//������¼�Ķ�ʱ��
function intervalend(timeout = 0) {
    return new Promise((resolve) => {
        let url = {
            url: `${host}/api/v1/reward/news/interval?end=1&`,
            headers: JSON.parse(ykdhd),
        }
        $.get(url, async (err, resp, data) => {
            try {
                result = JSON.parse(data)
                if (result.code == 0) {
                    console.log(`������Ѷʱ����¼��ϡ�\n`)
                } else {
                    console.log(`������Ѷʱ����¼ʧ�ܡ�`)

                }
            } catch (e) {

            } finally {

                resolve()
            }
        }, timeout)
    })
}
//������15��
function rewardnews(newstck) {
    return new Promise((resolve) => {
        let url = {
            url: `${host}/api/v1/reward/news?`,
            headers: JSON.parse(ykdhd),
            body: `ticket=${newstck}&`,
        }
        $.post(url, async (err, resp, data) => {
            try {
                result = JSON.parse(data)
                if (result.code == 0) {
                    if (result.result['today_count'] >= 15) {
                        console.log(`����ˢ��Ѷ15�Ρ�\n`)
                        await intervalend() //������¼�Ķ�ʱ��
                    } else {
                        console.log(`������Ѷ��ý�ҡ���${result.result.reward}\n`)
                        console.log(`����ˢ��Ѷ${result.result['today_count']}�Ρ�`)
                        newtime2 = result.result.time * 1000
                        newstck2 = result.result.ticket
                        await $.wait(newtime2)
                        await rewardnews(newstck2)
                    }
                } else {
                    console.log(`������Ѷʧ�ܡ���${result.message}\n`)

                }
            } catch (e) {

            } finally {

                resolve()
            }
        }, 0)
    })
}
//��ȡС��Ƶtck
function short(timeout = 0) {
    return new Promise((resolve) => {
        let url = {
            url: `${host}/api/v1/reward/video?short=0&`,
            headers: JSON.parse(ykdhd),
        }
        $.get(url, async (err, resp, data) => {
            try {
                result = JSON.parse(data)
                if (result.code == 0) {
                    sptime1 = result.result.time * 1000
                    sptck1 = result.result.ticket
                    console.log(`��׼����ʼˢС��Ƶ��\n`)
                    await $.wait(sptime1)
                    await spvideo(sptck1)
                } else {
                    console.log(`��ˢ��Ƶ�����ȡʧ�ܡ���${result.message}\n`)
                }
            } catch (e) {

            } finally {

                resolve()
            }
        }, timeout)
    })
}
//ˢ��Ƶ15��
function spvideo(sptck) {
    return new Promise((resolve) => {
        let url = {
            url: `${host}/api/v1/reward/video?`,
            headers: JSON.parse(ykdhd),
            body: `ticket=${sptck}&short=0&`,
        }
        $.post(url, async (err, resp, data) => {
            try {
                result = JSON.parse(data)
                if (result.code == 0) {
                    if (result.result['today_count'] >= 15) {
                        console.log(`����ˢ��Ƶ15�Ρ�`)
                    } else {
                        console.log(`��ˢ��Ƶ��ý�ҡ���${result.result.reward}\n`)
                        console.log(`����ˢ��Ƶ${result.result['today_count']}�Ρ�`)
                        sptime2 = result.result.time * 1000
                        sptck2 = result.result.ticket
                        await $.wait(sptime2)
                        await spvideo(sptck2)
                    }
                } else {
                    console.log(`��ˢ��Ƶʧ�ܡ���${result.message}\n`)
                }
            } catch (e) {

            } finally {

                resolve()
            }
        }, 0)
    })
}
//��ҳ��� 4��
async function allcoin(Array) {
    for (const i of Array) {
        await coin(i)
        await $.wait(5000)
    }
}
//��ҳ���
function coin(qpnum) {
    return new Promise((resolve) => {
        let url = {
            url: `${host}/api/v1/reward/coin?`,
            headers: JSON.parse(ykdhd),
        }
        $.get(url, async (err, resp, data) => {
            try {
                result = JSON.parse(data)
                if (result.code == 0) {
                    i = qpnum - 1
                    if (result.result.coins[i].num > 0) {
                        if (result.result.coins[i].ad == 1) {
                            await $.wait(2000)
                            await placement14() //��ʼ���ݹ��
                            await $.wait(2000)
                            await coinlq(qpnum)  //������ݽ���
                        } else {
                            await $.wait(2000)
                            await coinlq(qpnum)
                        }
                    }
                } else {
                    $.log(`\n��ȡ��������ʧ��~`)
                }
            } catch (e) {

            } finally {

                resolve()
            }
        }, 0)
    })
}

//��ʼ���ݹ��
function placement14(timeout = 0) {
    return new Promise((resolve) => {
        let url = {
            url: `${host}/api/v1/ad/topon/placement/id?type=14&`,
            headers: JSON.parse(ykdhd),
        }
        $.get(url, async (err, resp, data) => {
            try {
                result = JSON.parse(data)
                if (result.code == 0) {
                    $.log(`\n��ʼִ�����ݹ��`)
                    await $.wait(20000)
                    await log14() //�������ݹ��
                } else {
                    $.log(`\n��ʼִ�����ݹ��ʧ��`)
                }
            } catch (e) {

            } finally {

                resolve()
            }
        }, timeout)
    })
}
//�������ݹ��
function log14(timeout = 0) {
    return new Promise((resolve) => {
        let url = {
            url: `${host}/api/v1/ad/log?type=14&`,
            headers: JSON.parse(ykdhd),
        }
        $.get(url, async (err, resp, data) => {
            try {
                result = JSON.parse(data)
                if (result.code == 0) {
                    $.log(`\nִ�����ݹ�����`)
                } else {
                    $.log(`\nִ�����ݹ�����`)
                }
            } catch (e) {

            } finally {

                resolve()
            }
        }, timeout)
    })
}
//��ҳ���
function coinlq(num) {
    return new Promise((resolve) => {
        let url = {
            url: `${host}/api/v1/reward/coin?`,
            headers: JSON.parse(ykdhd),
            body: `id=${num}&`,
        }
        $.post(url, async (err, resp, data) => {
            try {
                result = JSON.parse(data)
                if (result.code == 0) {
                    $.log(`\n��ȡ�ɹ���ң�${result.result.coin}`)
                    await $.wait(2000)
                } else {
                    $.log(`\n������̫����~`)
                }
            } catch (e) {

            } finally {

                resolve()
            }
        }, 0)
    })
}

//��Ƶ����
function video(timeout = 0) {
    return new Promise((resolve) => {
        let url = {
            url: `${host}/api/v1/zhuan/video?`,
            headers: JSON.parse(ykdhd),
        }
        $.post(url, async (err, resp, data) => {
            try {
                result = JSON.parse(data)
                if (result.code == 0) {
                    tick = result.result.ticket
                    $.log(`\n�������ƣ�${result.result.tip}`)
                    $.log(`\n��ý�ң�${result.result.coin}`)
                    $.log(`\n�������ȯ��${result.result.coupon}`)
                    await $.wait(37000)
                    await ticket(tick)
                } else {
                    $.log(`\n������̫����~`)
                }
            } catch (e) {

            } finally {

                resolve()
            }
        }, timeout)
    })
}
function ticket(num) {
    return new Promise((resolve) => {
        let url = {
            url: `${host}/api/v1/ad/log?ticket=${num}&type=5&`,
            headers: JSON.parse(ykdhd),
        }
        $.get(url, async (err, resp, data) => {
            try {
                result = JSON.parse(data)
                if (result.code == 0) {
                    $.log(`\n�ۿ����ɹ���${result.result.status}`)
                    await $.wait(2000)
                    await coupon()
                } else {
                    $.log(`\n�ۿ����ʧ��`)
                }
            } catch (e) {

            } finally {

                resolve()
            }
        }, 0)
    })
}
//���񵹼�ʱ
function coupon(timeout = 0) {
    return new Promise((resolve) => {
        let url = {
            url: `${host}/api/v1/zhuan/coupon?`,
            headers: JSON.parse(ykdhd),
        }
        $.post(url, async (err, resp, data) => {
            try {
                result = JSON.parse(data)
                if (result.code == 0) {
                    time = result.result.items[1].time * 1000
                    $.log(`\nִ���¸���Ƶ����ʱ�䣺${time}����`)
                    await $.wait(time)
                } else {
                    $.log(`\n��ȡʱ��ʧ��`)
                }
            } catch (e) {

            } finally {

                resolve()
            }
        }, timeout)
    })
}
//��ȡ�齱����
function lottery(timeout = 0) {
    return new Promise((resolve) => {
        let url = {
            url: `${host}/api/v1/reward/lottery/index?`,
            headers: JSON.parse(ykdhd),
        }
        $.get(url, async (err, resp, data) => {
            try {
                result = JSON.parse(data)
                if (result.code == 0) {
                    lotteryid = result.result.ticket
                    $.log(`\n��ʼ�齱`)
                    await $.wait(200)
                    await lotterycj(lotteryid)
                } else {
                    $.log(`\nû�л�ȡ���齱����`)
                }
            } catch (e) {

            } finally {

                resolve()
            }
        }, timeout)
    })
}
//��ʼ�齱
function lotterycj(num) {
    return new Promise((resolve) => {
        let url = {
            url: `${host}/api/v1/reward/lottery/index?`,
            headers: JSON.parse(ykdhd),
            body: `ticket=${num}&`,
        }
        $.post(url, async (err, resp, data) => {
            try {
                result = JSON.parse(data)
                if (result.code == 0) {
                    $.log(`\n�齱�ɹ�`)
                } else {
                    $.log(`\n�齱ʧ��`)
                }
            } catch (e) {

            } finally {

                resolve()
            }
        }, 0)
    })
}
//�齱��ȡ
function done(timeout = 0) {
    return new Promise((resolve) => {
        let url = {
            url: `${host}/api/v1/zhuan/done?`,
            headers: JSON.parse(ykdhd),
            body: `id=4&`,
        }
        $.post(url, async (err, resp, data) => {
            try {
                result = JSON.parse(data)
                if (result.code == 0) {
                    $.log(`\n��ý�ң�${result.result.coin}`)
                } else {
                    $.log(`\n��ȡʧ��`)
                }
            } catch (e) {

            } finally {

                resolve()
            }
        }, timeout)
    })
}


//����7��
async function allbarrier(Array) {
    for (const i of Array) {
        await barrier(i)
        await $.wait(5000)
    }
}
//���ػ��ֻ�
function barrier(num) {
    return new Promise((resolve) => {
        let url = {
            url: `${host}/api/v1/reward/barrier/index?`,
            headers: JSON.parse(ykdhd),
        }
        $.get(url, async (err, resp, data) => {
            try {
                result = JSON.parse(data)
                if (result.result['current_barrier'] == 7) {
                    $.log(`\n�������������7��`)
                } else {
                    $.log(`\n��ʼ��������`)
                    await $.wait(5000)
                    await barrierlq(num)
                }
            } catch (e) {

            } finally {

                resolve()
            }
        }, 0)
    })
}
//���ػ��ֻ�
function barrierlq(num) {
    return new Promise((resolve) => {
        let url = {
            url: `${host}/api/v1/reward/barrier/index?`,
            headers: JSON.parse(ykdhd),
            body: `no=${num}&`,
        }
        $.post(url, async (err, resp, data) => {
            try {
                result = JSON.parse(data)
                if (result.code == 0) {
                    $.log(`\n���ػ�ý�ң�${result.result.coin}`)
                } else {
                    $.log(`\n������ȡʧ��`)
                }
            } catch (e) {

            } finally {

                resolve()
            }
        }, 0)
    })
}
//���ֽ𿴹��
//https://yuekandian.yichengw.cn/api/v1/reward/help/click?
//https://yuekandian.yichengw.cn/api/v1/ad/log?ticket=xxx&type=5&
//https://yuekandian.yichengw.cn/api/v1/reward/help/index?
function message() {
    if (tz == 1) { $.msg($.name, "", $.message) }
}

function RT(X, Y) {
    do rt = Math.floor(Math.random() * Y);
    while (rt < X)
    return rt;
}
//Env.min.js  ��Դhttps://raw.fastgit.org/chavyleung/scripts/master/Env.min.js
function Env(t,e){class s{constructor(t){this.env=t}send(t,e="GET"){t="string"==typeof t?{url:t}:t;let s=this.get;return"POST"===e&&(s=this.post),new Promise((e,i)=>{s.call(this,t,(t,s,r)=>{t?i(t):e(s)})})}get(t){return this.send.call(this.env,t)}post(t){return this.send.call(this.env,t,"POST")}}return new class{constructor(t,e){this.name=t,this.http=new s(this),this.data=null,this.dataFile="box.dat",this.logs=[],this.isMute=!1,this.isNeedRewrite=!1,this.logSeparator="\n",this.encoding="utf-8",this.startTime=(new Date).getTime(),Object.assign(this,e),this.log("",`\ud83d\udd14${this.name}, \u5f00\u59cb!`)}isNode(){return"undefined"!=typeof module&&!!module.exports}isQuanX(){return"undefined"!=typeof $task}isSurge(){return"undefined"!=typeof $httpClient&&"undefined"==typeof $loon}isLoon(){return"undefined"!=typeof $loon}isShadowrocket(){return"undefined"!=typeof $rocket}toObj(t,e=null){try{return JSON.parse(t)}catch{return e}}toStr(t,e=null){try{return JSON.stringify(t)}catch{return e}}getjson(t,e){let s=e;const i=this.getdata(t);if(i)try{s=JSON.parse(this.getdata(t))}catch{}return s}setjson(t,e){try{return this.setdata(JSON.stringify(t),e)}catch{return!1}}getScript(t){return new Promise(e=>{this.get({url:t},(t,s,i)=>e(i))})}runScript(t,e){return new Promise(s=>{let i=this.getdata("@chavy_boxjs_userCfgs.httpapi");i=i?i.replace(/\n/g,"").trim():i;let r=this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout");r=r?1*r:20,r=e&&e.timeout?e.timeout:r;const[o,h]=i.split("@"),n={url:`http://${h}/v1/scripting/evaluate`,body:{script_text:t,mock_type:"cron",timeout:r},headers:{"X-Key":o,Accept:"*/*"}};this.post(n,(t,e,i)=>s(i))}).catch(t=>this.logErr(t))}loaddata(){if(!this.isNode())return{};{this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e);if(!s&&!i)return{};{const i=s?t:e;try{return JSON.parse(this.fs.readFileSync(i))}catch(t){return{}}}}}writedata(){if(this.isNode()){this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e),r=JSON.stringify(this.data);s?this.fs.writeFileSync(t,r):i?this.fs.writeFileSync(e,r):this.fs.writeFileSync(t,r)}}lodash_get(t,e,s){const i=e.replace(/\[(\d+)\]/g,".$1").split(".");let r=t;for(const t of i)if(r=Object(r)[t],void 0===r)return s;return r}lodash_set(t,e,s){return Object(t)!==t?t:(Array.isArray(e)||(e=e.toString().match(/[^.[\]]+/g)||[]),e.slice(0,-1).reduce((t,s,i)=>Object(t[s])===t[s]?t[s]:t[s]=Math.abs(e[i+1])>>0==+e[i+1]?[]:{},t)[e[e.length-1]]=s,t)}getdata(t){let e=this.getval(t);if(/^@/.test(t)){const[,s,i]=/^@(.*?)\.(.*?)$/.exec(t),r=s?this.getval(s):"";if(r)try{const t=JSON.parse(r);e=t?this.lodash_get(t,i,""):e}catch(t){e=""}}return e}setdata(t,e){let s=!1;if(/^@/.test(e)){const[,i,r]=/^@(.*?)\.(.*?)$/.exec(e),o=this.getval(i),h=i?"null"===o?null:o||"{}":"{}";try{const e=JSON.parse(h);this.lodash_set(e,r,t),s=this.setval(JSON.stringify(e),i)}catch(e){const o={};this.lodash_set(o,r,t),s=this.setval(JSON.stringify(o),i)}}else s=this.setval(t,e);return s}getval(t){return this.isSurge()||this.isLoon()?$persistentStore.read(t):this.isQuanX()?$prefs.valueForKey(t):this.isNode()?(this.data=this.loaddata(),this.data[t]):this.data&&this.data[t]||null}setval(t,e){return this.isSurge()||this.isLoon()?$persistentStore.write(t,e):this.isQuanX()?$prefs.setValueForKey(t,e):this.isNode()?(this.data=this.loaddata(),this.data[e]=t,this.writedata(),!0):this.data&&this.data[e]||null}initGotEnv(t){this.got=this.got?this.got:require("got"),this.cktough=this.cktough?this.cktough:require("tough-cookie"),this.ckjar=this.ckjar?this.ckjar:new this.cktough.CookieJar,t&&(t.headers=t.headers?t.headers:{},void 0===t.headers.Cookie&&void 0===t.cookieJar&&(t.cookieJar=this.ckjar))}get(t,e=(()=>{})){if(t.headers&&(delete t.headers["Content-Type"],delete t.headers["Content-Length"]),this.isSurge()||this.isLoon())this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.get(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)});else if(this.isQuanX())this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t));else if(this.isNode()){let s=require("iconv-lite");this.initGotEnv(t),this.got(t).on("redirect",(t,e)=>{try{if(t.headers["set-cookie"]){const s=t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString();s&&this.ckjar.setCookieSync(s,null),e.cookieJar=this.ckjar}}catch(t){this.logErr(t)}}).then(t=>{const{statusCode:i,statusCode:r,headers:o,rawBody:h}=t;e(null,{status:i,statusCode:r,headers:o,rawBody:h},s.decode(h,this.encoding))},t=>{const{message:i,response:r}=t;e(i,r,r&&s.decode(r.rawBody,this.encoding))})}}post(t,e=(()=>{})){const s=t.method?t.method.toLocaleLowerCase():"post";if(t.body&&t.headers&&!t.headers["Content-Type"]&&(t.headers["Content-Type"]="application/x-www-form-urlencoded"),t.headers&&delete t.headers["Content-Length"],this.isSurge()||this.isLoon())this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient[s](t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)});else if(this.isQuanX())t.method=s,this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t));else if(this.isNode()){let i=require("iconv-lite");this.initGotEnv(t);const{url:r,...o}=t;this.got[s](r,o).then(t=>{const{statusCode:s,statusCode:r,headers:o,rawBody:h}=t;e(null,{status:s,statusCode:r,headers:o,rawBody:h},i.decode(h,this.encoding))},t=>{const{message:s,response:r}=t;e(s,r,r&&i.decode(r.rawBody,this.encoding))})}}time(t,e=null){const s=e?new Date(e):new Date;let i={"M+":s.getMonth()+1,"d+":s.getDate(),"H+":s.getHours(),"m+":s.getMinutes(),"s+":s.getSeconds(),"q+":Math.floor((s.getMonth()+3)/3),S:s.getMilliseconds()};/(y+)/.test(t)&&(t=t.replace(RegExp.$1,(s.getFullYear()+"").substr(4-RegExp.$1.length)));for(let e in i)new RegExp("("+e+")").test(t)&&(t=t.replace(RegExp.$1,1==RegExp.$1.length?i[e]:("00"+i[e]).substr((""+i[e]).length)));return t}msg(e=t,s="",i="",r){const o=t=>{if(!t)return t;if("string"==typeof t)return this.isLoon()?t:this.isQuanX()?{"open-url":t}:this.isSurge()?{url:t}:void 0;if("object"==typeof t){if(this.isLoon()){let e=t.openUrl||t.url||t["open-url"],s=t.mediaUrl||t["media-url"];return{openUrl:e,mediaUrl:s}}if(this.isQuanX()){let e=t["open-url"]||t.url||t.openUrl,s=t["media-url"]||t.mediaUrl;return{"open-url":e,"media-url":s}}if(this.isSurge()){let e=t.url||t.openUrl||t["open-url"];return{url:e}}}};if(this.isMute||(this.isSurge()||this.isLoon()?$notification.post(e,s,i,o(r)):this.isQuanX()&&$notify(e,s,i,o(r))),!this.isMuteLog){let t=["","==============\ud83d\udce3\u7cfb\u7edf\u901a\u77e5\ud83d\udce3=============="];t.push(e),s&&t.push(s),i&&t.push(i),console.log(t.join("\n")),this.logs=this.logs.concat(t)}}log(...t){t.length>0&&(this.logs=[...this.logs,...t]),console.log(t.join(this.logSeparator))}logErr(t,e){const s=!this.isSurge()&&!this.isQuanX()&&!this.isLoon();s?this.log("",`\u2757\ufe0f${this.name}, \u9519\u8bef!`,t.stack):this.log("",`\u2757\ufe0f${this.name}, \u9519\u8bef!`,t)}wait(t){return new Promise(e=>setTimeout(e,t))}done(t={}){const e=(new Date).getTime(),s=(e-this.startTime)/1e3;this.log("",`\ud83d\udd14${this.name}, \u7ed3\u675f! \ud83d\udd5b ${s} \u79d2`),this.log(),(this.isSurge()||this.isQuanX()||this.isLoon())&&$done(t)}}(t,e)}
