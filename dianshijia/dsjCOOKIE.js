//要么自己填写，要么复制自己的boxjs会话 粘贴【xzf 账号1第71行你的userid&authorization； 账号2第76行你的userid&authorization； 账号3第82行你的userid&authorization；依次自己看】

module.exports = {
    "id": "dsj",
    "name": "电视家APP",
    "keys": ["dsjheader", "dsjtx", "dsjheader2", "dsjtx2", "dsjheader3", "dsjtx3", "dsjheader4", "dsjtx4", "dsjheader5", "dsjtx5", "dsjheader6", "dsjtx6", "dsjheader7", "dsjtx7", "dsjheader8", "dsjtx8", "dsjheader9", "dsjtx9", "dsjheader10", "dsjtx10", "dsjheader11", "dsjtx11", "dsjheader12", "dsjtx12", "dsjheader13", "dsjtx13", "dsjheader14", "dsjtx14", "dsjheader15", "dsjtx15", "dsjheader16", "dsjtx16", "dsjheader17", "dsjtx17", "dsjheader18", "dsjtx18", "dsjheader19", "dsjtx19", "dsjheader20", "dsjtx20"],
    "author": "@ziye",
    "settings": [{
        "id": "dsjSuffix",
        "name": "当前账号",
        "val": "1",
        "type": "number",
        "desc": "当前抓取ck记录的账号序号，如：1、2、3、"
    }, {
        "id": "dsjCount",
        "name": "账号个数",
        "val": "4",
        "type": "number",
        "desc": "指定任务最多跑几个账号，根据抓取的账号数据个数来设值"
    }, {
        "id": "dsjXH",
        "name": "循环获取CK",
        "val": "0",
        "type": "number",
        "desc": "0关闭 1开启,默认关闭"
    }, {
        "id": "dsjXYZ",
        "name": "执行概率",
        "val": "100",
        "type": "number",
        "desc": "0不执行 可设置0-100,默认百分百"
    }, {
        "id": "dsjTXTX",
        "name": "余额提醒",
        "val": "5",
        "type": "number",
        "desc": "0不提醒 可设置0,5,10,20,25,30,50,100"
    }, {
        "id": "dsjZDTX",
        "name": "自动提现",
        "val": "5",
        "type": "number",
        "desc": "0不提现 可设置0,5,10,20,25,30,50,99  99由上到下提现 "
    }, {
        "id": "dsjnotifyttt",
        "name": "推送控制",
        "val": "1",
        "type": "number",
        "desc": "0关闭，1推送,默认12点以及23点推送"
    }, {
        "id": "dsjnotifyInterval",
        "name": "通知控制",
        "val": "2",
        "type": "number",
        "desc": "0关闭，1为 所有通知，2为 12，23 点通知，3为 6，12，18，23 点通知 "
    }, {
        "id": "dsjMinutes",
        "name": "推送-通知 分钟控制",
        "val": "59",
        "type": "number",
        "desc": "推送以及通知控制在什么分钟段，可设置0-59,默认0到10"
    }],
    "repo": "https://cdn.jsdelivr.net/gh/ziye888/JavaScript@main/Task/dsj.js",
    "icons": ["https://cdn.jsdelivr.net/gh/ziye888/JavaScript@main/Task/dsj.png", "https://cdn.jsdelivr.net/gh/ziye888/JavaScript@main/Task/dsj.png"],
    "script": "https://cdn.jsdelivr.net/gh/ziye888/JavaScript@main/Task/dsj.js",
    "icon": "https://cdn.jsdelivr.net/gh/ziye888/JavaScript@main/Task/dsj.png",
    "favIcon": "mdi-star-outline",
    "favIconColor": "grey",
    "datas": [{
        "key": "dsjheader",
        "val": "61f72a01e1c636240d1834c814047a4e&WlRBd1kyVTJaRFEwT1RFMlpUUTFaRFV3T0RJell6QTVOMkZpWldNd01tUT18MTY1NTYzMjU2MTY3OTgzMjkyNHxmMmUxY2IwODAyYTYzYTM4M2Y2ZjhlOTkyMDY2ODA0YjVlYzJiNDY2"
    }, {
        "key": "dsjtx",
        "val": ""
    }, {
        "key": "dsjheader2",
        "val": "2c7442b222c2464c98cbf0fa5bd05ce7&Tm1aaFpXTTNaVE5tTmpsaFpUUmpZakJqWkRWbE5XVmhPVEJrT1dVME5UST18MTY1NTcyMTEzNzQxMTg3MDY1MnxlMDVlOGUwNDNmMDgzMjBmZjM5NWU2Mzk4MzRmNDI4MDQ5MmJlMGJl"
    }, {
        "key": "dsjtx2",
        "val": ""
    }, {
        "key": "dsjheader3",
        "val": "4fbd772a0f9a1e704aca7995a8d6bb4d&WlRBME9EUXlOakUyTkROak5HVXpNR1pqWmpjeU9HTTJPV0ptTldaaE1qRT18MTY1NTcyMTU1MjI5NjE0OTc2NnwyZTNhMTJjNWY0NTgzNDA2ZDZkZDRhNDBhMTczMzFlZGM3MmIwZTY2"
    }, {
        "key": "dsjtx3",
        "val": ""
    }, {
        "key": "dsjheader4",
        "val": "4663cc2d653bd1149b03fd0a3783ed11&TkdZME9UWTNZVFk1WkRCa01qZzJaREZoTURSaFltVTBNR1JoWkRNek1HWT18MTY1NTcyMjA5NTMzOTU2OTc2MHw5ZDk0NDBkM2YzZDYyYWYzOGM2NTNmYmMyM2YzMGM0MGZhMGE4NTVl"
    }, {
        "key": "dsjtx4",
        "val": ""
    }, {
        "key": "dsjheader5",
        "val": ""
    }, {
        "key": "dsjtx5",
        "val": ""
    }, {
        "key": "dsjheader6",
        "val": ""
    }, {
        "key": "dsjtx6",
        "val": ""
    }, {
        "key": "dsjheader7",
        "val": ""
    }, {
        "key": "dsjtx7",
        "val": ""
    }, {
        "key": "dsjheader8",
        "val": ""
    }, {
        "key": "dsjtx8",
        "val": ""
    }, {
        "key": "dsjheader9",
        "val": ""
    }, {
        "key": "dsjtx9",
        "val": ""
    }, {
        "key": "dsjheader10",
        "val": ""
    }, {
        "key": "dsjtx10",
        "val": ""
    }, {
        "key": "dsjheader11",
        "val": ""
    }, {
        "key": "dsjtx11",
        "val": ""
    }, {
        "key": "dsjheader12",
        "val": ""
    }, {
        "key": "dsjtx12",
        "val": ""
    }, {
        "key": "dsjheader13",
        "val": ""
    }, {
        "key": "dsjtx13",
        "val": ""
    }, {
        "key": "dsjheader14",
        "val": ""
    }, {
        "key": "dsjtx14",
        "val": ""
    }, {
        "key": "dsjheader15",
        "val": ""
    }, {
        "key": "dsjtx15",
        "val": ""
    }, {
        "key": "dsjheader16",
        "val": ""
    }, {
        "key": "dsjtx16",
        "val": ""
    }, {
        "key": "dsjheader17",
        "val": ""
    }, {
        "key": "dsjtx17",
        "val": ""
    }, {
        "key": "dsjheader18",
        "val": ""
    }, {
        "key": "dsjtx18",
        "val": ""
    }, {
        "key": "dsjheader19",
        "val": ""
    }, {
        "key": "dsjtx19",
        "val": ""
    }, {
        "key": "dsjheader20",
        "val": ""
    }, {
        "key": "dsjtx20",
        "val": ""
    }],
    "sessions": [],
    "isLoaded": true
}