var ym = window.ym || {};

ym.util = {
    htmlEncode: function (text) {
        var value = text;
        try {
            value = value.replace(/&emsp;/g, "&nbsp;");
            value = value.replace(/&/, "&amp;");
            value = value.replace(/</g, "&lt;");
            value = value.replace(/>/g, "&gt;");
            value = value.replace(/'/g, "&apos;");
            value = value.replace(/"/g, "&quot;");
        } catch (e) {
            var span = $('<span>');
            span.html(value);
            value = span.html();
            value = value.replace(/&/, "&amp;");
            value = value.replace(/</g, "&lt;");
            value = value.replace(/>/g, "&gt;");
            value = value.replace(/'/g, "&apos;");
            value = value.replace(/"/g, "&quot;");
        }
        return value;
    },
    is_Weixn: function () {
        var ua = navigator.userAgent.toLowerCase();
        if (ua.match(/MicroMessenger/i) == 'micromessenger') {
            return true;
        } else {
            return false;
        }
    },
    fixTime: function (value) {
        return value.toString().length > 1 ? value : "0" + value;
    },
    getDateFromString: function (date, format) {
        if (!date)
            return '';
        return this.getFormatDate(new Date(date.replace(/-/g, '/')), format);
    },
    getDateFromZDY: function (date, format) {
        if (!date)
            return '';
        return date.replace(/-/g,format);
    },
    getFormatDate: function (ydate, format) {
        if (!ydate || !this.isFunction(ydate.getFullYear)) {
            return "";
        }
        var date = { year: ydate.getFullYear(), month: ydate.getMonth() + 1, day: ydate.getDate(), hour: ydate.getHours(), minutes: ydate.getMinutes(), seconds: ydate.getSeconds() };
        switch (format) {
            case '-':
                return date.year + '-' + this.fixTime(date.month) + '-' + this.fixTime(date.day);
            case '/':
                return date.year + '/' + this.fixTime(date.month) + '/' + this.fixTime(date.day) + ' ' + this.fixTime(date.hour) + ':' + this.fixTime(date.minutes) + ':' + this.fixTime(date.seconds);
            case 'date':
                return date.year + '/' + this.fixTime(date.month) + '/' + this.fixTime(date.day);
            case 'time':
                return this.fixTime(date.hour) + ':' + this.fixTime(date.minutes) + ':' + this.fixTime(date.seconds);
            case 'zh':
                return date.year + '年' + this.fixTime(date.month) + '月' + this.fixTime(date.day) + '日';
            default:
                return date.year + '-' + this.fixTime(date.month) + '-' + this.fixTime(date.day) + ' ' + this.fixTime(date.hour) + ':' + this.fixTime(date.minutes) + ':' + this.fixTime(date.seconds);
        }
    },
    getDate: function (strDate) {
        var date = null;
        if (strDate.toLowerCase().lastIndexOf("/date(") >= 0) {
            if (strDate) {
                var strDate = jsonDate.toLowerCase().replace("/date(", "").replace(")/", "");
                try {
                    date = new Date(parseInt(strDate));
                }
                catch (ex) {
                    return "";
                }
            }
        }
        else {
            if (strDate.lastIndexOf("-") >= 0)
                strDate = strDate.replace(/-/g, "/");
            date = new Date(strDate);
        }
        return date;
    },
    formatJsonDate: function (jsonDate, format) {
        var date = null;
        if (jsonDate) {
            var strDate = jsonDate.replace("/Date(", "").replace(")/", "");
            try {
                date = new Date(parseInt(strDate));
            } catch (ex) { }
        }
        return this.getFormatDate(date, format);
    },
    formatSQLXmlDate: function (xmlDate, format) {
        var date = new Date(xmlDate.replace('T', ' ').replace(/-/g, '/').replace(/\.\d+/, ''));
        return this.getFormatDate(date, format);
    },
    getNowFormatDate: function () {
        var date = new Date();
        var seperator1 = "-";
        var seperator2 = ":";
        var month = date.getMonth() + 1;
        var strDate = date.getDate();
        if (month >= 1 && month <= 9) {
            month = "0" + month;
        }
        if (strDate >= 0 && strDate <= 9) {
            strDate = "0" + strDate;
        }
        var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
            + " " + date.getHours() + seperator2 + date.getMinutes()
            + seperator2 + date.getSeconds();
        return currentdate;
    },
    getDaysBetween: function (startDate, enDate) {
        const sDate = Date.parse(startDate)
        const eDate = Date.parse(enDate)
        if (sDate > eDate) {
            return 0
        }
        // 这个判断可以根据需求来确定是否需要加上
        if (sDate === eDate) {
            return 1
        }
        const days = (eDate - sDate) / (1 * 24 * 60 * 60 * 1000)
        return Math.ceil(days)
    },
    clearHTML: function (html) {
        return html.replace(/<[^>]*>/g, "");
    },
    isArray: function (obj) {
        return obj && Object.prototype.toString.call(obj) === '[object Array]';
    },
    isObject: function (obj) {
        return obj && Object.prototype.toString.call(obj) === '[object Object]';
    },
    isFunction: function (obj) {
        return obj && Object.prototype.toString.call(obj) === '[object Function]';
    },
    isNumber: function (obj) {
        return /^\d+(\.\d*)?$/.test(obj);
    },
    isInArray: function (arr, value) {
        for (var i = 0; i < arr.length; i++) {
            if (value == arr[i]) return true;
        }
        return false;
    },
    isURL: function (obj) {
        return new RegExp("http(s)?://([\\w-]+\\.)+[\\w-]+(/[\\w-./?%&=]*)?").test(obj);
    },
    isPhone: function (obj) {
        return /^1[3-9]\d{9}$/.test(obj);
    },
    isEmail: function (obj) {
        return /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/.test(obj);
    },
    isIdCard: function (obj) {
        return /^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/.test(obj);
    },
    isBandCard: function (obj) {
        return /^([1-9]{1})(\d{15}|\d{18})$/.test(obj);
    },
    checkPwd(obj) {
        var reg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$/
        var re = new RegExp(reg)
        if (re.test(obj)) {
            return true;
        } else {
            return false;
        }
    },
    jsonToYmd: function (jsonDate, format) {
        var date = null;
        if (jsonDate) {
            var strDate = jsonDate.replace("/Date(", "").replace(")/", "");
            try {
                date = new Date(parseInt(strDate, 10));
            } catch (ex) {

            }
        }
        if (!date) {
            date = new Date();
        }
        date = { year: date.getFullYear(), month: date.getMonth() + 1, day: date.getDate(), hour: date.getHours(), minutes: date.getMinutes() };
        switch (format) {
            case '-':
                return date.year + '-' + fixTime(date.month) + '-' + fixTime(date.day);
                break;
            case 'zh':
                return date.year + '年' + fixTime(date.month) + '月' + fixTime(date.day) + '日';
                break;
            default:
                return date.year + '-' + fixTime(date.month) + '-' + fixTime(date.day) + ' ' + fixTime(date.hour) + ':' + fixTime(date.minutes);
        }
        function fixTime(value) {
            return value.toString().length > 1 ? value : "0" + value;
        }
    },
    replace: function (str, obj) {
        for (var p in obj) {
            if (this.isObject(obj[p])) {
                str = this.Replace(str, obj[p]);
            }
            else {
                if (!this.isNumber(p.toString())) {
                    var reg = new RegExp('{' + p + '}', "g");
                    str = str.replace(reg, obj[p]);
                }
            }
        }
        return str;
    },
    trim: function (str) {
        return str.replace(/\s*/g, "");
    },
    fixdNumber: function (val, type) {
        if (!val)
            val = 0;
        var result = parseFloat(val).toFixed(2);
        if (type == 0)
            return result;
        else if (type == 1)
            return result.split('.')[0];
        if (type == 2)
            return result.split('.')[1];
    },
    getBrowser: function () {
        var browser = {}, result, agent = navigator.userAgent.toLowerCase();
        (result = agent.match(/msie ([\d.]+)/)) ? browser.IE = result[1] :
            (result = agent.match(/firefox\/([\d.]+)/)) ? browser.FireFox = result[1] :
                (result = agent.match(/chrome\/([\d.]+)/)) ? browser.Chrome = result[1] :
                    (result = agent.match(/opera\/([\d.]+)/)) ? browser.Opera = result[1] :
                        (result = agent.match(/version\/([\d.]+).*safari/)) ? browser.Safari = result[1] : 0;
        return browser;
    },
    queryStrings: function (url) {
        url = url || window.location.search;
        var arr = url.split('?'), params = arr.length > 1 ? arr[1] : null;
        if (params) {
            for (var i = 0, _form = {}, list = params.split('&'), l = list.length; i < l; i++) {
                var p = list[i].split('='), n = p.length > 0 ? p[0] : 'i', v = p.length > 1 ? p[1] : '';
                _form[n] = v;
            }
            return _form;
        }
        return {};
    },
    queryString: function (name, url) {
        var params = this.queryStrings((url || window.location.href));
        return params[name];
    },
    getQuery: function (queryName) {
        var reg = new RegExp("(^|&)" + queryName + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) {
            return decodeURIComponent(r[2]);
        } else {
            return null;
        }
    },
    fixUrlCallback: function (callback) {
        if (typeof callback == 'string') {
            for (var i = 0, names = callback.toString().split('.'), w = window; i < names.length; i++) {
                if (names[i] != 'window') {
                    if (typeof w[names[i]] == 'object') {
                        w = w[names[i]];
                    } else if (this.isFunction(w[names[i]])) {
                        return w[names[i]];
                    }
                }
            }
        }
        return callback;
    },
    image: {
        adaptSize: function (src, mw, mh) {
            var image = new Image();
            image.src = src;
            var pos = this._get(image.width, image.height, mw, mh);
            return pos;
        },
        _get: function (w, h, mw, mh) {
            var scale = 1;
            if (w / h > 1) { //宽大于高
                if (w > mw) {
                    scale = h / w;
                    w = mw;
                    h = parseInt(w * scale);
                    if (h > mh) {
                        h = mh;
                        w = parseInt(h / scale);
                    }
                }
            } else { // 高大于宽
                if (h > mh) {
                    scale = w / h;
                    h = mh;
                    w = parseInt(h * scale);
                    if (w > mw) {
                        w = mw;
                        h = parseInt(w / scale);
                    }
                }
            }
            return { width: w, height: h };
        }
    },
    cookie: {
        setCookie: function (cookieName, cookieValue, cookieExpdate, domain) {
            var cookie = cookieName + "=" + encodeURIComponent(cookieValue);
            if (domain != "" && domain != undefined) {
                cookie += "; domain=" + domain
            }
            cookie += "; path=/";
            cookie += "; expires=" + cookieExpdate.toGMTString();
            document.cookie = cookie
        },
        getCookie: function (name) {
            var arr = document.cookie.match(new RegExp("(^| )" + name + "=([^;]*)(;|$)"));
            if (arr != null) {
                return decodeURIComponent(arr[2])
            }
            return null
        },
        delCookie: function (cookieName) {
            var exp = new Date();
            exp.setTime(exp.getTime() - 1);
            ym.util.cookie.setCookie(cookieName, '', exp)
        },
    },
    setStorage: function (name, value) {
        localStorage.setItem(name, value);
    },
    getStorage: function (name) {
        return localStorage.getItem(name);
    },
    delStorage: function (name) {
        localStorage.removeItem(name);
    },
    setSessionStorage: function (name, value) {
        sessionStorage.setItem(name, value);
    },
    getSessionStorage: function (name) {
        return sessionStorage.getItem(name);
    },
    delSessionStorage: function (name) {
        sessionStorage.removeItem(name);
    },
    iframe: {
        get: function (id) {
            return document.getElementById(id).contentWindow;
        }
    },
    video: {
        render: function (selector, url, ext) {
            var html = '';
            switch (ext) {
                case 'mp4':
                    html += '<video width="100%" controls="true">';
                    html += '   <source src="' + url + '" type=\'video/' + ext + ' codecs="avc1.42E01E, mp4a.40.2"\'/>';
                    html += '</video>';
                    break;
                case 'webm':
                    html += '<video width="100%" controls="true">';
                    html += '   <source src="' + url + '" type=\'video/' + ext + ' codecs="vp8, vorbis"\'/>';
                    html += '</video>';
                case 'mpeg4':
                    html += '<video width="100%" controls="true">';
                    html += '   <source src="' + url + '" type="video/' + ext + '"/>';
                    html += '</video>';
                    break;
                case 'swf':
                    html += '<embed width="100%" height="100%" wmode="opaque" name="plugin" src="' + url + '" type="application/x-shockwave-flash">';
                    break;
            }
            $(selector).html(html);
        }
    },
    subString: function (data, subLenth) {
        if (data != "" && data != null) {
            data = data.replace(/<[^>]+>/g, "");
            if (data.length > subLenth) {
                return data.substring(0, subLenth) + ".....";
            }
        }
        return data;
    },
    getGuid: function () {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    },
    copy: function (className) {
        // 创建range对象
        let range = document.createRange();
        // 传入需要选中的节点
        range.selectNodeContents(document.querySelector(className));
        var selection = document.getSelection();
        // 清空选中的区域
        selection.removeAllRanges();
        // 添加选中区域
        selection.addRange(range);
        // 执行复制
        document.execCommand('Copy');
    },
    plusXing(str, frontLen, endLen, starLen) {
        if (!str)
            return str;
        if (frontLen >= str.length || endLen >= str.length)
            return str;

        var len = str.length - frontLen - endLen;
        var xing = '';
        for (var i = 0; i < starLen; i++) {
            xing += '*';
        }
        return str.substring(0, frontLen) + xing + str.substring(str.length - endLen);
    },
    delUrl: function (url, names) {
        url = url || window.location.href;
        var param = {};
        var arr1 = url.split("?");
        if (arr1.length == 1) return arr1[0]
        var arr2 = arr1[1].split("&");
        var str = arr1[0] + "?"
        for (var i = 0; i < arr2.length; i++) {
            var res = arr2[i].split("=");
            if (names.indexOf(res[0]) > -1) { } else {
                if (!res[0] || !res[1]) continue
                param[res[0] || ""] = res[1] || "";
                str = str + (i == 0 ? "" : "&") + res[0] + "=" + res[1]
            }
        }
        return str
    },
    //滚动条在Y轴上的滚动距离
    getScrollTop: function () {
        var scrollTop = 0, bodyScrollTop = 0, documentScrollTop = 0;
        if (document.body) {
            bodyScrollTop = document.body.scrollTop;
        }
        if (document.documentElement) {
            documentScrollTop = document.documentElement.scrollTop;
        }
        scrollTop = (bodyScrollTop - documentScrollTop > 0) ? bodyScrollTop : documentScrollTop;
        return scrollTop;
    },
    //文档的总高度
    getScrollHeight: function () {
        var scrollHeight = 0, bodyScrollHeight = 0, documentScrollHeight = 0;
        if (document.body) {
            bodyScrollHeight = document.body.scrollHeight;
        }
        if (document.documentElement) {
            documentScrollHeight = document.documentElement.scrollHeight;
        }
        scrollHeight = (bodyScrollHeight - documentScrollHeight > 0) ? bodyScrollHeight : documentScrollHeight;
        return scrollHeight;
    },
    //浏览器视口的高度
    getWindowHeight: function () {
        var windowHeight = 0;
        if (document.compatMode == "CSS1Compat") {
            windowHeight = document.documentElement.clientHeight;
        } else {
            windowHeight = document.body.clientHeight;
        }
        return windowHeight;
    },
    formatMoney: function (number, places, symbol, thousand, decimal) {
        // console.log(number)
        // console.log(places)
        number = number || 0
        places = !isNaN((places = Math.abs(places))) ? places : 2
        symbol = symbol !== undefined ? symbol : '￥'
        thousand = thousand || ','
        decimal = decimal || '.'
        var negative = number < 0 ? '-' : '',
            i = parseInt((number = Math.abs(+number || 0).toFixed(places)), 10) + '',
            j = (j = i.length) > 3 ? j % 3 : 0
        return (
            symbol +
            negative +
            (j ? i.substr(0, j) + thousand : '') +
            i.substr(j).replace(/(\d{3})(?=\d)/g, '$1' + thousand) +
            (places ?
                decimal +
                Math.abs(number - i)
                    .toFixed(places)
                    .slice(2) :
                '')
        )
    },
    //无限滚动加载
    scrollLoad(callback) {
        if (ym.util.getScrollTop() + ym.util.getWindowHeight() >= ym.util.getScrollHeight() - 20) {
            callback && callback();
        }
    },
    countdown: function (endTime, serverTime, callback) {
        var that = this
            , type = typeof serverTime === 'function'
            , end = new Date(endTime).getTime()
            , now = new Date((!serverTime || type) ? new Date().getTime() : serverTime).getTime()
            , count = end - now
            , hm = (count / 1000 % 60).toFixed(2)
            , time = [
                Math.floor(count / (1000 * 60 * 60 * 24)) //天
                , Math.floor(count / (1000 * 60 * 60)) % 24 //时
                , Math.floor(count / (1000 * 60)) % 60 //分
                , Math.floor(count / 1000) % 60 //秒
                , hm.indexOf('.') != -1 ? Math.floor(hm.split('.')[1]) : 0 //毫秒
            ];

        if (type) callback = serverTime;

        var timer = setTimeout(function () {
            that.countdown(endTime, now + 88, callback);
        }, 88);

        callback && callback(count > 0 ? time : [0, 0, 0, 0, 0], serverTime, timer, count <= 0);

        if (count <= 0) clearTimeout(timer);
        return timer;
    },
    //获取随机编码
    getSN: function (str) {
        //声明一个随机数变量，默认为1
        var GetRandomn = 1;
        //js生成时间戳
        var timestamp = new Date().getTime();
        //获取随机范围内数值的函数
        function GetRandom(n) {
            //由随机数+时间戳+1组成
            GetRandomn = Math.floor(Math.random() * n + timestamp + 1);
        }
        //开始调用，获得一个1-100的随机数
        GetRandom("30");
        return str + GetRandomn;
    },
    stringToArray: function (str) {
        var arr = [];
        if (str.indexOf(',') != -1) {
            arr = str.split(',');
        } else {
            arr.push(str);
        }
        return arr;
    },
    //获取数组长度
    stringToArrayLength: function (str) {
        var arr = [];
        if (str.indexOf(',') != -1) {
            arr = str.split(',');
        } else {
            arr.push(str);
        }
        return arr.length;
    },
    openChat: function (id)
    {
        var token = ym.util.cookie.getCookie("access_token");
        if (!token) {
            layer.msg("请先登录。", function () {
                location.href = _shopConfig.sitePath + '/Member/Login?backUrl=' + encodeURIComponent(location.href);
            });
            return false;
        }
        layer.open({
            type: 2
            , title: '客服'
            , shadeClose: true
            , area: ['1000px', '80%']
            , offset: 'rb'
            , content: _shopConfig.sitePath + '/Member/Chat?tenantId=' + id
            , scrollbar: false
            , maxmin: true
            , resize: true
            , success: function (layero, index) {
                
            }
        });
    },
    openPtChat: function () {
        var token = ym.util.cookie.getCookie("access_token");
        if (!token) {
            layer.msg("请先登录。", function () {
                location.href = _shopConfig.sitePath + '/Member/Login?backUrl=' + encodeURIComponent(location.href);
            });
            return false;
        }
        layer.open({
            type: 2
            , title: '客服'
            , shadeClose: true
            , area: ['1000px', '80%']
            , offset: 'rb'
            , content: _shopConfig.sitePath + '/Member/PtChat?tenantId=0'
            , scrollbar: false
            , maxmin: true
            , resize: true
            , success: function (layero, index) {

            }
        });
    }
}