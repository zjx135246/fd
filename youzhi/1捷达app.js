/*
5.22 èå­è¿ð¦ð¦ð¦ð¦
è½¯ä»¶:æ·è¾¾app
 
1.æ·è¾¾ä¼åæ¯æ¥è¿å¥æ´»å¨å¯é¢å1ä¸ªç°éçº¢åï¼çº¢åéé¢è¿è¡ç´¯ç§¯ï¼
2.ç´¯ç§¯çç°éçº¢åå¯äºæ¬¡æ18å·è¿è¡æç°ï¼18å·æªæç°çº¢åå°äº19å·é¶ç¹æ¸é¶ï¼æ æ³åæç°ï¼
3.æ¬¡æ18å·å®ææç°åï¼19å·å¯ç»§ç»­åä¸æ´»å¨é¢åç°éçº¢å
çº¢åæç°
1.æç°æ¶é´ï¼æ¬¡æ18å·ï¼
2.æç°æ¹å¼ï¼ç¨æ·å¨æ´»å¨ä¸­åèµ·æç°âå³æ³¨âJETTAæ·è¾¾åçå®æ¹æå¡å·ââç¹å»é¢åçº¢åâç°éæç°è³å¾®ä¿¡é±åã

[rewrite_local]
https://service-yy.jconnect.faw-vw.com/redpackbank/user url script-request-body https://raw.githubusercontent.com/liuqi6968/-/main/jetta.js
[mitm]
hostname = service-yy.jconnect.faw-vw.com
0 6 * * * https://raw.githubusercontent.com/liuqi6968/-/main/jetta.js
 åé  JETTA_token
 å¤è´¦å·@åå²
 å¤è´¦å·åªæµè¯éé¾ 

 xzfä¿®æ¹
 1ãå¤è´¦å·æ¢è¡åå²
 2ãæç°ç´æ¥å¾®ä¿¡æ«äºç»´ç 
 3ãæåæç´¢-authorization çå¼å»æ Bearer 
cron: 12 32 12 * * *
*/
 

const $ = new Env("æ·è¾¾ APPç­¾å°");
const notify = $.isNode() ? require("./sendNotify") : "";
const qs = $.isNode() ? require("qs") : "";
const debug = 1; //0ä¸ºå³é­è°è¯ï¼1ä¸ºæå¼è°è¯,é»è®¤ä¸º0
let status;
let result = '';

status = (status = $.getval("JETTA_tokenstatus") || "1") > 1 ? `${status}` : ""; // è´¦å·æ©å±å­ç¬¦
let JETTA_tokenArr = [];
let JETTA_token = $.isNode()
  ? process.env.JETTA_token
    ? process.env.JETTA_token
    : ""
  : $.getdata("JETTA_token")
    ? $.getdata("JETTA_token")
    : "";
let JETTA_tokens = "";
let tz = $.getval("JETTA_tokentz") || "1";
let host = `https://yuasg.com`;
$.message = "";

//å¼å§è¿è¡
!(async () => {
  if (typeof $request !== "undefined") {
     jdck()
  } else {
    if (!$.isNode()) {
      JETTA_tokenArr.push($.getdata("JETTA_token"));
      let count = $.getval("JETTA_tokencount") || "1";
      for (let i = 2; i <= count; i++) {
        JETTA_tokenArr.push($.getdata(`JETTA_token${i}`));
      }
      if (!JETTA_tokenArr[0]) {
        $.log(`\nãå»åæç¤ºãï¼ä½ æ²¡æå¡«åckè·ä¸ªå`);
        $.message += `\nãå»åæç¤ºãï¼ä½ æ²¡æå¡«åckè·ä¸ªå`;
      } else {
        console.log(
          `-------------å±${JETTA_tokenArr.length}ä¸ªè´¦å·-------------\n`
        );
      }
      for (let i = 0; i < JETTA_tokenArr.length; i++) {
        if (JETTA_tokenArr[i]) {
          JETTA_token = JETTA_tokenArr[i];
          $.index = i + 1;
          console.log(`\nå¼å§ãæ·è¾¾ è´¦æ· ${$.index}ã`);
          
          await hbxxh();
    await getUserInfo();
        }
      }
    } else {
      if (process.env.JETTA_token && process.env.JETTA_token.indexOf("\n") > -1) {
        JETTA_tokenArr = process.env.JETTA_token.split("\n");
        console.log(`æ¨éæ©çæ¯ç¨"\n"éå¼\n`);
      } else {
        JETTA_tokens = [process.env.JETTA_token];
      }
      Object.keys(JETTA_tokens).forEach((item) => {
        if (JETTA_tokens[item]) {
          JETTA_tokenArr.push(JETTA_tokens[item]);
        }
      });

      if (!JETTA_tokenArr[0]) {
        $.log(`\nãå»åæç¤ºãï¼ä½ æ²¡æå¡«åckè·ä¸ªå`);
        $.message += `\nãå»åæç¤ºãï¼ä½ æ²¡æå¡«åckè·ä¸ªå`;
      } else {
        console.log(
          `-------------å±${JETTA_tokenArr.length}ä¸ªè´¦å·-------------\n`
        );
      }
      for (let k = 0; k < JETTA_tokenArr.length; k++) {
        JETTA_token = JETTA_tokenArr[k];
        $.index = k + 1;
        console.log(`\nå¼å§ãæ·è¾¾ è´¦æ· ${$.index}ã`);
       
        await hbxxh();
      await getUserInfo();
      }
    }
  }
  message(); //éç¥
})()
  .catch((e) => $.logErr(e))
  .finally(() => $.done());

function jdck() {
    if ($request.url.indexOf("getUserInfo") > -1) {
 
        const sytthd = JSON.stringify($request.headers.token)
        if (sytthd) $.setdata(sytthd, `sytthd${status}`)
        $.log(sytthd)
 
        
 
        $.msg($.name, "", `æ·è¾¾${status}è·åtokenæå`)
 
    }
}
//çº¢åå°é¶è¡
function hbxxh(timeout = 0) {
  return new Promise((resolve) => {
  
    
    let url = {
      url: `https://service-yy.jconnect.faw-vw.com/redpackbank/prize/getPrize`,
      headers: {
    "Host": "service-yy.jconnect.faw-vw.com",
    "pragma": "no-cache",
    "cache-control": "no-cache",
    "accept": "application/json, text/plain, */*",
    "origin": "https://serviceui-yy-ui.jconnect.faw-vw.com",
    "sec-fetch-dest": "empty",
    "token": `${JETTA_token}`,   
  },
      
    };
    
    $.get(
      url,
      async (err, resp, data) => {
        try {
          data = JSON.parse(data);

          if (data.status == 'SUCCEED') {
            
            console.log("\nãè·å¾ã: " + data.data.todayPrize);
            
            
            $.message += "\nãè·å¾ã: " + data.data.data.data.todayPrize+'å'
            
            
          } else {
          console.log('\nã ' + data.errorMessage + 'ã')
            
            $.message +='\nçº¢åå°é¶è¡ã '+ data.errorMessage + 'ã'
            
          }
        } catch (e) {
        } finally {
          resolve();
        }
      },
      timeout
    );
  });
}
function getUserInfo(timeout = 0) {
  return new Promise((resolve) => {
  
    
    let url = {
      url: `https://service-yy.jconnect.faw-vw.com/redpackbank/user/getUserInfo`,
      headers: {
    "Host": "service-yy.jconnect.faw-vw.com",
    "pragma": "no-cache",
    "cache-control": "no-cache",
    "accept": "application/json, text/plain, */*",
    "origin": "https://serviceui-yy-ui.jconnect.faw-vw.com",
    "sec-fetch-dest": "empty",
    "token": `${JETTA_token}`,   
  },
      
    };
    
    $.get(
      url,
      async (err, resp, data) => {
        try {
          data = JSON.parse(data);

          if (data.status == 'SUCCEED') {
            console.log("\nãä½é¢ã: " + data.data.detail.allPrize);
            
            
            $.message +="\nãä½é¢ã: " +  data.data.detail.allPrize+'å'
          
            
          } else {
          
          }
        } catch (e) {
        } finally {
          resolve();
        }
      },
      timeout
    );
  });
}
//éç¥
async function message() {
  if (tz == 1) {
    $.msg($.name, "", $.message);
  }
  if ($.isNode()) {
    await notify.sendNotify($.name, $.message);
  }
}

 
 
 
//envæ¨¡å    ä¸è¦å¨  
function Env(t, e) { class s { constructor(t) { this.env = t } send(t, e = "GET") { t = "string" == typeof t ? { url: t } : t; let s = this.get; return "POST" === e && (s = this.post), new Promise((e, i) => { s.call(this, t, (t, s, r) => { t ? i(t) : e(s) }) }) } get(t) { return this.send.call(this.env, t) } post(t) { return this.send.call(this.env, t, "POST") } } return new class { constructor(t, e) { this.name = t, this.http = new s(this), this.data = null, this.dataFile = "box.dat", this.logs = [], this.isMute = !1, this.isNeedRewrite = !1, this.logSeparator = "\n", this.startTime = (new Date).getTime(), Object.assign(this, e), this.log("", `\ud83d\udd14${this.name}, \u5f00\u59cb!`) } isNode() { return "undefined" != typeof module && !!module.exports } isQuanX() { return "undefined" != typeof $task } isSurge() { return "undefined" != typeof $httpClient && "undefined" == typeof $loon } isLoon() { return "undefined" != typeof $loon } toObj(t, e = null) { try { return JSON.parse(t) } catch { return e } } toStr(t, e = null) { try { return JSON.stringify(t) } catch { return e } } getjson(t, e) { let s = e; const i = this.getdata(t); if (i) try { s = JSON.parse(this.getdata(t)) } catch { } return s } setjson(t, e) { try { return this.setdata(JSON.stringify(t), e) } catch { return !1 } } getScript(t) { return new Promise(e => { this.get({ url: t }, (t, s, i) => e(i)) }) } runScript(t, e) { return new Promise(s => { let i = this.getdata("@chavy_boxjs_userCfgs.httpapi"); i = i ? i.replace(/\n/g, "").trim() : i; let r = this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout"); r = r ? 1 * r : 20, r = e && e.timeout ? e.timeout : r; const [o, h] = i.split("@"), a = { url: `http://${h}/v1/scripting/evaluate`, body: { script_text: t, mock_type: "cron", timeout: r }, headers: { "X-Key": o, Accept: "*/*" } }; this.post(a, (t, e, i) => s(i)) }).catch(t => this.logErr(t)) } loaddata() { if (!this.isNode()) return {}; { this.fs = this.fs ? this.fs : require("fs"), this.path = this.path ? this.path : require("path"); const t = this.path.resolve(this.dataFile), e = this.path.resolve(process.cwd(), this.dataFile), s = this.fs.existsSync(t), i = !s && this.fs.existsSync(e); if (!s && !i) return {}; { const i = s ? t : e; try { return JSON.parse(this.fs.readFileSync(i)) } catch (t) { return {} } } } } writedata() { if (this.isNode()) { this.fs = this.fs ? this.fs : require("fs"), this.path = this.path ? this.path : require("path"); const t = this.path.resolve(this.dataFile), e = this.path.resolve(process.cwd(), this.dataFile), s = this.fs.existsSync(t), i = !s && this.fs.existsSync(e), r = JSON.stringify(this.data); s ? this.fs.writeFileSync(t, r) : i ? this.fs.writeFileSync(e, r) : this.fs.writeFileSync(t, r) } } lodash_get(t, e, s) { const i = e.replace(/\[(\d+)\]/g, ".$1").split("."); let r = t; for (const t of i) if (r = Object(r)[t], void 0 === r) return s; return r } lodash_set(t, e, s) { return Object(t) !== t ? t : (Array.isArray(e) || (e = e.toString().match(/[^.[\]]+/g) || []), e.slice(0, -1).reduce((t, s, i) => Object(t[s]) === t[s] ? t[s] : t[s] = Math.abs(e[i + 1]) >> 0 == +e[i + 1] ? [] : {}, t)[e[e.length - 1]] = s, t) } getdata(t) { let e = this.getval(t); if (/^@/.test(t)) { const [, s, i] = /^@(.*?)\.(.*?)$/.exec(t), r = s ? this.getval(s) : ""; if (r) try { const t = JSON.parse(r); e = t ? this.lodash_get(t, i, "") : e } catch (t) { e = "" } } return e } setdata(t, e) { let s = !1; if (/^@/.test(e)) { const [, i, r] = /^@(.*?)\.(.*?)$/.exec(e), o = this.getval(i), h = i ? "null" === o ? null : o || "{}" : "{}"; try { const e = JSON.parse(h); this.lodash_set(e, r, t), s = this.setval(JSON.stringify(e), i) } catch (e) { const o = {}; this.lodash_set(o, r, t), s = this.setval(JSON.stringify(o), i) } } else s = this.setval(t, e); return s } getval(t) { return this.isSurge() || this.isLoon() ? $persistentStore.read(t) : this.isQuanX() ? $prefs.valueForKey(t) : this.isNode() ? (this.data = this.loaddata(), this.data[t]) : this.data && this.data[t] || null } setval(t, e) { return this.isSurge() || this.isLoon() ? $persistentStore.write(t, e) : this.isQuanX() ? $prefs.setValueForKey(t, e) : this.isNode() ? (this.data = this.loaddata(), this.data[e] = t, this.writedata(), !0) : this.data && this.data[e] || null } initGotEnv(t) { this.got = this.got ? this.got : require("got"), this.cktough = this.cktough ? this.cktough : require("tough-cookie"), this.ckjar = this.ckjar ? this.ckjar : new this.cktough.CookieJar, t && (t.headers = t.headers ? t.headers : {}, void 0 === t.headers.Cookie && void 0 === t.cookieJar && (t.cookieJar = this.ckjar)) } get(t, e = (() => { })) { t.headers && (delete t.headers["Content-Type"], delete t.headers["Content-Length"]), this.isSurge() || this.isLoon() ? (this.isSurge() && this.isNeedRewrite && (t.headers = t.headers || {}, Object.assign(t.headers, { "X-Surge-Skip-Scripting": !1 })), $httpClient.get(t, (t, s, i) => { !t && s && (s.body = i, s.statusCode = s.status), e(t, s, i) })) : this.isQuanX() ? (this.isNeedRewrite && (t.opts = t.opts || {}, Object.assign(t.opts, { hints: !1 })), $task.fetch(t).then(t => { const { statusCode: s, statusCode: i, headers: r, body: o } = t; e(null, { status: s, statusCode: i, headers: r, body: o }, o) }, t => e(t))) : this.isNode() && (this.initGotEnv(t), this.got(t).on("redirect", (t, e) => { try { if (t.headers["set-cookie"]) { const s = t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString(); this.ckjar.setCookieSync(s, null), e.cookieJar = this.ckjar } } catch (t) { this.logErr(t) } }).then(t => { const { statusCode: s, statusCode: i, headers: r, body: o } = t; e(null, { status: s, statusCode: i, headers: r, body: o }, o) }, t => { const { message: s, response: i } = t; e(s, i, i && i.body) })) } post(t, e = (() => { })) { if (t.body && t.headers && !t.headers["Content-Type"] && (t.headers["Content-Type"] = "application/x-www-form-urlencoded"), t.headers && delete t.headers["Content-Length"], this.isSurge() || this.isLoon()) this.isSurge() && this.isNeedRewrite && (t.headers = t.headers || {}, Object.assign(t.headers, { "X-Surge-Skip-Scripting": !1 })), $httpClient.post(t, (t, s, i) => { !t && s && (s.body = i, s.statusCode = s.status), e(t, s, i) }); else if (this.isQuanX()) t.method = "POST", this.isNeedRewrite && (t.opts = t.opts || {}, Object.assign(t.opts, { hints: !1 })), $task.fetch(t).then(t => { const { statusCode: s, statusCode: i, headers: r, body: o } = t; e(null, { status: s, statusCode: i, headers: r, body: o }, o) }, t => e(t)); else if (this.isNode()) { this.initGotEnv(t); const { url: s, ...i } = t; this.got.post(s, i).then(t => { const { statusCode: s, statusCode: i, headers: r, body: o } = t; e(null, { status: s, statusCode: i, headers: r, body: o }, o) }, t => { const { message: s, response: i } = t; e(s, i, i && i.body) }) } } time(t) { let e = { "M+": (new Date).getMonth() + 1, "d+": (new Date).getDate(), "H+": (new Date).getHours(), "m+": (new Date).getMinutes(), "s+": (new Date).getSeconds(), "q+": Math.floor(((new Date).getMonth() + 3) / 3), S: (new Date).getMilliseconds() }; /(y+)/.test(t) && (t = t.replace(RegExp.$1, ((new Date).getFullYear() + "").substr(4 - RegExp.$1.length))); for (let s in e) new RegExp("(" + s + ")").test(t) && (t = t.replace(RegExp.$1, 1 == RegExp.$1.length ? e[s] : ("00" + e[s]).substr(("" + e[s]).length))); return t } msg(e = t, s = "", i = "", r) { const o = t => { if (!t) return t; if ("string" == typeof t) return this.isLoon() ? t : this.isQuanX() ? { "open-url": t } : this.isSurge() ? { url: t } : void 0; if ("object" == typeof t) { if (this.isLoon()) { let e = t.openUrl || t.url || t["open-url"], s = t.mediaUrl || t["media-url"]; return { openUrl: e, mediaUrl: s } } if (this.isQuanX()) { let e = t["open-url"] || t.url || t.openUrl, s = t["media-url"] || t.mediaUrl; return { "open-url": e, "media-url": s } } if (this.isSurge()) { let e = t.url || t.openUrl || t["open-url"]; return { url: e } } } }; this.isMute || (this.isSurge() || this.isLoon() ? $notification.post(e, s, i, o(r)) : this.isQuanX() && $notify(e, s, i, o(r))); let h = ["", "==============\ud83d\udce3\u7cfb\u7edf\u901a\u77e5\ud83d\udce3=============="]; h.push(e), s && h.push(s), i && h.push(i), console.log(h.join("\n")), this.logs = this.logs.concat(h) } log(...t) { t.length > 0 && (this.logs = [...this.logs, ...t]), console.log(t.join(this.logSeparator)) } logErr(t, e) { const s = !this.isSurge() && !this.isQuanX() && !this.isLoon(); s ? this.log("", `\u2757\ufe0f${this.name}, \u9519\u8bef!`, t.stack) : this.log("", `\u2757\ufe0f${this.name}, \u9519\u8bef!`, t) } wait(t) { return new Promise(e => setTimeout(e, t)) } done(t = {}) { const e = (new Date).getTime(), s = (e - this.startTime) / 1e3; this.log("", `\ud83d\udd14${this.name}, \u7ed3\u675f! \ud83d\udd5b ${s} \u79d2`), this.log(), (this.isSurge() || this.isQuanX() || this.isLoon()) && $done(t) } }(t, e) }
