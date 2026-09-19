$.ym = $.ym || { version: '2.3.0' };
var _adminPath = _adminPath || "admin";
var isEncrypt = ""
var _isOSS = false;
var _keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
$.extend($.ym, {
    ajax: function (url, action, params) {
        var data = {};
        action = action.toLowerCase()
        action = (action == "" ? "json" : action)
        if (action == "get") {
            data = $.param(params.params)
        } else {
            data = params.params
        }
        if (isEncrypt) {
            data = this.encryptData(data)
        }
        var token = this.getStorage("token");
        var defaultParms = {
            type: action == "get" ? "get" : "post",
            url: url,
            data: action == "json" ? JSON.stringify(data) : data,
            processData: action != "formdata",
            contentType: action == "json" ? "application/json" : action == "formdata" ? false : "application/x-www-form-urlencoded",
            headers: { Authorization: 'Bearer ' + token },
            error: function (res) {
                if (res.status === 401) {
                    $.ym.delStorage("token");
                    $.ym.delCookie("token");
                    layer.msg("登录信息已过期，请重新登录", {
                        icon: 2,
                        time: 1000
                    }, function () {
                        location.href = "/Login?back=" + (window.location.pathname.toLowerCase() == '/login' ? '' : window.location.pathname + window.location.search)
                    });
                }
            }, complete: function (res) {
                if (res.status === 401) {
                    $.ym.delStorage("token");
                    $.ym.delCookie("token");
                    layer.msg("登录信息已过期，请重新登录", {
                        icon: 2,
                        time: 1000
                    }, function () {
                        location.href = "/Login?back=" + (window.location.pathname.toLowerCase() == '/login' ? '' : window.location.pathname + window.location.search)
                    });
                }
                // 400
                if (res.status === 400) {
                    let data = res.responseJSON;
                    console.log('xxxxxxx',res)
                    if (data?.title){
                        var errorMessages = Object.keys(data.errors).reduce(function (messages, key) {
                              return messages.concat(data.errors[key].map(function (msg) {
                                return `${key}: ${msg}`;
                              }));
                            }, []).join('<br>');
                        layer.msg(errorMessages, {
                            icon: 2,
                            time: 1000
                        })
                    }else{
                        layer.msg(res.responseText||'请求错误', {
                            icon: 2,
                            time: 1000
                        })
                    }
                }
                var tokenNew = res.getResponseHeader('NewToken');
                if (tokenNew != undefined && tokenNew != "")
                    $.ym.setStorage("token", tokenNew);
            }
        };
        var settings = $.extend(defaultParms, params);
        const task = $.ajax(settings);
        return task
    },
    Base64: {
        encode: function (input) {
            var output = "";
            var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
            var i = 0;
            input = this._utf8_encode(input);
            while (i < input.length) {
                chr1 = input.charCodeAt(i++);
                chr2 = input.charCodeAt(i++);
                chr3 = input.charCodeAt(i++);
                enc1 = chr1 >> 2;
                enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
                enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
                enc4 = chr3 & 63;
                if (isNaN(chr2)) {
                    enc3 = enc4 = 64;
                } else if (isNaN(chr3)) {
                    enc4 = 64;
                }
                output = output +
                    _keyStr.charAt(enc1) + _keyStr.charAt(enc2) +
                    _keyStr.charAt(enc3) + _keyStr.charAt(enc4);
            }
            return output;
        },
        decode: function (input) {
            if (input === undefined || input === "" || input == null)
                return "";
            var output = "";
            var chr1, chr2, chr3;
            var enc1, enc2, enc3, enc4;
            var i = 0;
            input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
            while (i < input.length) {
                enc1 = _keyStr.indexOf(input.charAt(i++));
                enc2 = _keyStr.indexOf(input.charAt(i++));
                enc3 = _keyStr.indexOf(input.charAt(i++));
                enc4 = _keyStr.indexOf(input.charAt(i++));
                chr1 = (enc1 << 2) | (enc2 >> 4);
                chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
                chr3 = ((enc3 & 3) << 6) | enc4;
                output = output + String.fromCharCode(chr1);
                if (enc3 !== 64) {
                    output = output + String.fromCharCode(chr2);
                }
                if (enc4 !== 64) {
                    output = output + String.fromCharCode(chr3);
                }
            }
            output = this._utf8_decode(output);
            return output;
        },
        _utf8_encode: function (string) {
            string = string.replace(/\r\n/g, "\n");
            var utftext = "";
            for (var n = 0; n < string.length; n++) {
                var c = string.charCodeAt(n);
                if (c < 128) {
                    utftext += String.fromCharCode(c);
                } else if ((c > 127) && (c < 2048)) {
                    utftext += String.fromCharCode((c >> 6) | 192);
                    utftext += String.fromCharCode((c & 63) | 128);
                } else {
                    utftext += String.fromCharCode((c >> 12) | 224);
                    utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                    utftext += String.fromCharCode((c & 63) | 128);
                }

            }
            return utftext;
        },
        _utf8_decode: function (utftext) {
            var string = "";
            var i = 0;
            var c = c1 = c2 = 0;
            while (i < utftext.length) {
                c = utftext.charCodeAt(i);
                if (c < 128) {
                    string += String.fromCharCode(c);
                    i++;
                } else if ((c > 191) && (c < 224)) {
                    c2 = utftext.charCodeAt(i + 1);
                    string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
                    i += 2;
                } else {
                    c2 = utftext.charCodeAt(i + 1);
                    c3 = utftext.charCodeAt(i + 2);
                    string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
                    i += 3;
                }
            }
            return string;
        }
    },
    encryptData: function (json) {
        // 生成一个 AES 密钥
        let aesKey = CryptoJS.lib.WordArray.random(16);
        let encrypt = new JSEncrypt()
        encrypt.setPublicKey(rsaKey)
        let key = encrypt.encrypt(CryptoJS.enc.Base64.stringify(aesKey))

        let iv = CryptoJS.lib.WordArray.random(16); // 生成 16 字节的随机 IV 
        // 使用 AES 加密数据
        let encryptedData = CryptoJS.AES.encrypt(JSON.stringify(json), aesKey, {
            iv: iv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
        }).toString();
        console.log(1111, encryptedData)
        return { key: key, data: encryptedData, iv: CryptoJS.enc.Base64.stringify(iv) }
    },
    getjsonDate: function (jsonDate, format) {

        if (!jsonDate) {
            return "";
        }
        var date = null;

        if (isNaN(jsonDate)) {
            jsonDate = jsonDate.replace("星期一", "").replace("星期二", "").replace("星期三", "").replace("星期四", "").replace("星期五", "").replace("星期六", "").replace("星期日", "").replace("T", " ");

            if (jsonDate.toLowerCase().lastIndexOf("/date(") >= 0) {
                if (jsonDate) {
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
                if (jsonDate.lastIndexOf("-") >= 0)
                    jsonDate = jsonDate.replace(/-/g, "/");
                date = new Date(jsonDate);
            }
            if (!date) {
                return "";
            }
        } else
            date = new Date(jsonDate);

        date = { year: date.getFullYear(), month: date.getMonth() + 1, day: date.getDate(), hour: date.getHours(), minutes: date.getMinutes(), seconds: date.getSeconds() };
        switch (format) {
            case 'yyyy-MM-dd':
                format = "-";
                return date.year + format + getTime(date.month) + format + getTime(date.day);
            case 'yyyy-MM-dd HH:mm:ss':
                format = "-";
                return date.year + format + getTime(date.month) + format + getTime(date.day) + ' ' + getTime(date.hour) + ':' + getTime(date.minutes) + ':' + getTime(date.seconds);
            case 'yyyy年MM月dd日':
                return date.year + '年' + getTime(date.month) + '月' + getTime(date.day) + '日';
            case 'yyyy年MM月dd日 HH时mm分ss秒':
                return date.year + '年' + getTime(date.month) + '月' + getTime(date.day) + '日 ' + getTime(date.hour) + '时' + getTime(date.minutes) + '分' + getTime(date.seconds) + '秒';
            case '/':
                return date.year + format + getTime(date.month) + format + getTime(date.day) + ' ' + getTime(date.hour) + ':' + getTime(date.minutes);
            case ' • ':
                return date.year + format + getTime(date.month) + format + getTime(date.day);
            case '-':
                return date.year + '-' + getTime(date.month) + '-' + getTime(date.day);
            case 'cn':
                return date.year + '年' + getTime(date.month) + '月' + getTime(date.day) + '日';
            default:
                return date.year + '-' + getTime(date.month) + '-' + getTime(date.day) + ' ' + getTime(date.hour) + ':' + getTime(date.minutes) + ':' + getTime(date.seconds);
        }
        function getTime(value) {
            return value.toString().length > 1 ? value : "0" + value;
        }
    },
    getjsonTime: function (jsonDate, format) {

        if (!jsonDate) {
            return "";
        }
        var date = null;

        if (isNaN(jsonDate)) {
            jsonDate = jsonDate.replace("星期一", "").replace("星期二", "").replace("星期三", "").replace("星期四", "").replace("星期五", "").replace("星期六", "").replace("星期日", "").replace("T", " ");

            if (jsonDate.toLowerCase().lastIndexOf("/date(") >= 0) {
                if (jsonDate) {
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
                if (jsonDate.lastIndexOf("-") >= 0)
                    jsonDate = jsonDate.replace(/-/g, "/");
                date = new Date(jsonDate);
            }
            if (!date) {
                return "";
            }
        } else
            date = new Date(jsonDate);

        date = { year: date.getFullYear(), month: date.getMonth() + 1, day: date.getDate(), hour: date.getHours(), minutes: date.getMinutes(), seconds: date.getSeconds() };
        switch (format) {
            case 'hh':
                return getTime(date.hour);
            case 'hh:mm':
                return getTime(date.hour) + ':' + getTime(date.minutes);
            case 'hh:mm:ss':
                return getTime(date.hour) + ':' + getTime(date.minutes) + ':' + getTime(date.seconds);
            case 'cn':
                return getTime(date.hour) + '时' + getTime(date.minutes) + '分' + getTime(date.seconds) + '秒';
            default:
                return getTime(date.hour) + ':' + getTime(date.minutes) + ':' + getTime(date.seconds);
        }
        function getTime(value) {
            return value.toString().length > 1 ? value : "0" + value;
        }
    },
    subString: function (data, subLenth, subStr) {
        if (data !== "" && data !== null && data !== undefined) {
            data = data.replace(/<[^>]+>/g, "");
            if (data.length > subLenth) {
                return data.substring(0, subLenth) + (subStr || "...");
            }
        }
        return data;
    },
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
    editor: function (el, height) {
        tinymce.init({
            selector: el,
            language: "zh_CN",
            height: height | 500,
            min_height: 500, //最小高度 
            toolbar: true, //工具栏
            menubar: true, //菜单栏
            branding: false, //右下角技术支持
            inline: false, //开启内联模式
            elementpath: false,
            skin: 'oxide',
            toolbar_sticky: true,
            image_dimensions: false,
            visualchars_default_state: false, //显示不可见字符
            image_caption: true,
            paste_data_images: true,
            relative_urls: false,
            extended_valid_elements: "",// 不允许使用的元素类型
            toolbar_mode: 'wrap',
            fontsize_formats: '12px 14px 16px 18px 24px 36px 48px 56px 72px',
            font_formats: '思源黑体=Source Han Sans;微软雅黑=Microsoft YaHei,Helvetica Neue,PingFang SC,sans-serif;苹果苹方=PingFang SC,Microsoft YaHei,sans-serif;宋体=simsun,serif;仿宋体=FangSong,serif;黑体=SimHei,sans-serif;楷体=楷体_GB2312,SimKai;Arial=arial,helvetica,sans-serif;Arial Black=arial black,avant garde;Book Antiqua=book antiqua,palatino;',
            images_upload_url: _adminPath + '/API/AdminUpload?isEditor=1&uploadType=0',
            plugins: 'print preview searchreplace autolink directionality visualblocks visualchars fullscreen image link media template codesample table charmap hr pagebreak nonbreaking anchor insertdatetime advlist lists wordcount imagetools textpattern help emoticons autosave indent2em autoresize axupimgs axupfiles code lineheight importword',
            toolbar: 'code undo redo restoredraft | cut copy paste pastetext | forecolor backcolor bold italic underline strikethrough link anchor | alignleft aligncenter alignright alignjustify outdent indent indent2em lineheight| \
                     styleselect fontselect fontsizeselect | bullist numlist | blockquote subscript superscript removeformat | \
                     table image media charmap emoticons hr pagebreak insertdatetime print preview axupimgs axupfiles importword| fullscreen',
            file_picker_callback: function (callback, value, meta) {
                //文件分类
                var filetype = '';
                //后端接收上传文件的地址
                var url = '';
                //为不同插件指定文件类型及后端地址
                switch (meta.filetype) {
                    case 'image':
                        filetype = '.jpg,.jpeg,.png,.gif,.tiff';
                        url = _adminPath + '/API/AdminUpload?isEditor=1&uploadType=0';
                        break;
                    case 'file':
                        var filetype = '.pdf,.txt,.zip,.rar,.7z,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.mp3,.mp4';
                        url = _adminPath + '/API/AdminUpload?isEditor=1&uploadType=1';
                        break;
                    case 'media':
                        filetype = '.mp3,.mp4';
                        url = _adminPath + '/API/AdminUpload?isEditor=1&uploadType=2';
                        break;
                }
                if (_isOSS)
                    url = _ossUrl;
                //模拟出一个input用于添加本地文件
                var input = document.createElement('input');
                input.setAttribute('type', 'file');
                input.setAttribute('accept', filetype);
                input.click();
                input.onchange = function () {
                    $('.tox-dialog').append('<div id="quiProgressBox" style="position:absolute;width:100%;height:100%;z-index:99;left:0;top:0;background:rgba(0,0,0,.6);color:#fff;text-align:center;font-size:16px"><div style="position:absolute;z-index:100;left:50%;top:50%;transform:translateX(-50%) translateY(-50%);-webkit-transform:translateX(-50%) translateY(-50%);"><div style="margin-top:15px"><i class="layui-icon layui-icon-loading-1 layui-anim layui-anim-rotate layui-anim-loop" style="font-size: 30px; color: #fff;"></i></div><span id="quiProgress">0</span><span>%</span></div></div>');
                    var file = this.files[0];

                    var progress, xhr, formData;
                    console.log(file.name);
                    xhr = new XMLHttpRequest();
                    xhr.upload.onprogress = function (e) {
                        progress = parseInt(e.loaded / e.total * 100)
                        console.log(progress)
                        $('#quiProgress').html(progress);
                        if (progress == '100') {
                            setTimeout(function () {
                                $('#quiProgressBox').remove();
                            }, 500);
                        }
                    }
                    xhr.withCredentials = false;
                    xhr.open('POST', url);
                    xhr.onload = function () {
                        var json;
                        if (xhr.status != 200) {
                            layer.msg('HTTP Error: ' + xhr.status);
                            return;
                        }
                        json = JSON.parse(xhr.responseText);
                        if (!json || typeof json.location != 'string') {
                            layer.msg('Invalid JSON: ' + xhr.responseText);
                            return;
                        }
                        callback(json.location);
                    };
                    formData = new FormData();
                    if (_isOSS) {
                        var ossData = set_upload_param(file.name, false);
                        formData = new FormData();
                        formData.append('key', ossData.key);
                        formData.append('policy', ossData.policy);
                        formData.append('OSSAccessKeyId', ossData.OSSAccessKeyId);
                        formData.append('success_action_status', ossData.success_action_status);
                        formData.append('callback', ossData.callback);
                        formData.append('signature', ossData.signature);
                        formData.append('Content-Disposition', ossData["Content-Disposition"]);
                    }
                    formData.append('file', file, file.name);
                    xhr.send(formData);
                };
            },
            images_upload_handler: function (blobInfo, succFun, failFun) {
                var progress, xhr, formData;
                var file = blobInfo.blob();//转化为易于理解的file对象
                var url = _adminPath + '/API/AdminUpload?isEditor=1&uploadType=0';
                if (_isOSS)
                    url = _ossUrl;
                xhr = new XMLHttpRequest();
                xhr.withCredentials = false;
                xhr.open('POST', url);
                xhr.onload = function () {
                    var json;
                    if (xhr.status != 200) {
                        failFun('HTTP Error: ' + xhr.status);
                        return;
                    }
                    json = JSON.parse(xhr.responseText);
                    if (!json || typeof json.location != 'string') {
                        failFun('上传失败: ' + json.msg);
                        return;
                    }
                    succFun(json.location);
                };
                if (file.size > 50000) {
                    $('.tox-dialog').append('<div id="quiProgressBox" style="position:absolute;width:100%;height:100%;z-index:99;left:0;top:0;background:rgba(0,0,0,.6);color:#fff;text-align:center;font-size:16px"><div style="position:absolute;z-index:100;left:50%;top:50%;transform:translateX(-50%) translateY(-50%);-webkit-transform:translateX(-50%) translateY(-50%);"><div style="margin-top:15px"><i class="layui-icon layui-icon-loading-1 layui-anim layui-anim-rotate layui-anim-loop" style="font-size: 30px; color: #fff;"></i></div><span id="quiProgress">0</span><span>%</span></div></div>');
                    xhr.upload.onprogress = function (e) {
                        progress = parseInt(e.loaded / e.total * 100)
                        $('#quiProgress').html(progress);
                        if (progress == '100') {
                            $('#quiProgressBox').remove();
                        }
                    }
                } else {
                    $('#quiProgressBox').remove();
                }
                formData = new FormData();
                if (_isOSS) {
                    var ossData = set_upload_param(file.name, false);
                    formData.append('key', ossData.key);
                    formData.append('policy', ossData.policy);
                    formData.append('OSSAccessKeyId', ossData.OSSAccessKeyId);
                    formData.append('success_action_status', ossData.success_action_status);
                    formData.append('callback', ossData.callback);
                    formData.append('signature', ossData.signature);
                    formData.append('Content-Disposition', ossData["Content-Disposition"]);
                }
                formData.append('file', file, file.name);
                xhr.send(formData);
            },
            files_upload_handler: function (blobInfo, succFun, failFun) {
                var progress, xhr, formData;
                var file = blobInfo.blob();//转化为易于理解的file对象
                var url = _adminPath + '/API/AdminUpload?isEditor=1&uploadType=1';
                if (_isOSS)
                    url = _ossUrl;
                xhr = new XMLHttpRequest();
                xhr.withCredentials = false;
                xhr.open('POST', url);
                xhr.onload = function () {
                    var json;
                    if (xhr.status != 200) {
                        failFun('HTTP Error: ' + xhr.status);
                        return;
                    }
                    json = JSON.parse(xhr.responseText);
                    if (!json || typeof json.location != 'string') {
                        failFun('上传失败: ' + json.msg);
                        return;
                    }
                    succFun(json.location);
                };
                if (file.size > 50000) {
                    $('.tox-dialog').append('<div id="quiProgressBox" style="position:absolute;width:100%;height:100%;z-index:99;left:0;top:0;background:rgba(0,0,0,.6);color:#fff;text-align:center;font-size:16px"><div style="position:absolute;z-index:100;left:50%;top:50%;transform:translateX(-50%) translateY(-50%);-webkit-transform:translateX(-50%) translateY(-50%);"><div style="margin-top:15px"><i class="layui-icon layui-icon-loading-1 layui-anim layui-anim-rotate layui-anim-loop" style="font-size: 30px; color: #fff;"></i></div><span id="quiProgress">0</span><span>%</span></div></div>');
                    xhr.upload.onprogress = function (e) {
                        progress = parseInt(e.loaded / e.total * 100)
                        $('#quiProgress').html(progress);
                        if (progress == '100') {
                            $('#quiProgressBox').remove();
                        }
                    }
                } else {
                    $('#quiProgressBox').remove();
                }
                formData = new FormData();
                if (_isOSS) {
                    var ossData = set_upload_param(file.name, false);
                    formData.append('key', ossData.key);
                    formData.append('policy', ossData.policy);
                    formData.append('OSSAccessKeyId', ossData.OSSAccessKeyId);
                    formData.append('success_action_status', ossData.success_action_status);
                    formData.append('callback', ossData.callback);
                    formData.append('signature', ossData.signature);
                    formData.append('Content-Disposition', ossData["Content-Disposition"]);

                }
                formData.append('file', file, file.name);
                xhr.send(formData);
            }
        });
    },
    randomNum: function (minNum, maxNum) {
        minNum = (minNum == undefined ? 0 : minNum);
        maxNum = (maxNum == undefined ? 2147483647 : maxNum);
        return parseInt(Math.random() * (maxNum - minNum + 1) + minNum, 10);
    },
    getIcon: function (file) {
        var ico = "unknown";
        if (file.indexOf('?') >= 0)
            file = file.replace("?" + file.split('?').pop(), "");
        if (file.indexOf('.') >= 0)
            ico = file.split('.').pop().toLowerCase();
        return "./uploadfiles/ico/" + ico + ".png";
    },
    getAlt: function (file) {
        var alt = "";
        if (file.indexOf('?') >= 0)
            alt = file.split('?').pop();
        alt = this.Base64.decode(alt);
        return alt;
    },
    setImage: function (src) {
        var html = '';
        var num = this.randomNum();
        if (src == null || src === undefined || src === '') return "";
        if (src.indexOf('*') > -1) {
            html += '<span id="img' + num + '" >';
            var imgList = src.split('*');
            for (var i = 0; i < imgList.length; i++) {
                html += '<img src="' + imgList[i] + '" class="img-list-preview" onclick="$.ym.openImage(\'img' + num + '\')"/>';
            }
            html += "</span>";
        }
        else
            html = '<span id="img' + num + '" ><img src="' + src + '" class="img-list-preview" onclick="$.ym.openImage(\'img' + num + '\')"/></span>';
        return html;
    },
    openImage: function (img) {
        layer.photos({
            photos: "#" + img
            , anim: 5 //0-6的选择，指定弹出图片动画类型
        });
    },
    setFile: function (src) {
        var html = '';
        if (src == null || src === undefined || src === '') return "";
        if (src.indexOf('*') > -1) {
            var imgList = src.split('*');
            for (var i = 0; i < imgList.length; i++) {
                var name = this.getAlt(imgList[i]);
                name = name === "" ? ('下载文件' + (i + 1)) : name;
                html += '<a target="_blank" download="' + name + '" href="' + imgList[i] + '">' + name + ' </a> ';
            }
        }
        else {
            var name = this.getAlt(src);
            name = name === "" ? '下载文件' : name;
            html = '<a target="_blank" download="' + name + '"  href="' + src + '">' + name + '</a> ';
        }
        return html;
    },
    setVideo: function (src) {
        var html = '';
        if (src == null || src === undefined || src === '') return "";

        var name = this.getAlt(src);
        name = name === "" ? '下载视频' : name;
        html = '<a target="_blank" download="' + name + '"  href="' + src + '">' + name + '</a> <a href="javascript:videoPreview(\'' + src + '\')">预览</a> ';

        return html;
    },
    setOption: function (option, options) {
        if (option == "")
            return "";
        try {
            try {
                option = JSON.parse(option);
            }
            catch (ex) {
                var temp = [];
                temp.push(option);
                option = temp;
            }
            if (!Array.isArray(options))
                options = JSON.parse(options);
            if (option === null || option === "" || option.length == 0 || options.length == 0)
                return "";
            try {
                option = option.map(function (p) { return options.filter(function (m) { return m.value == p })[0]; });
            }
            catch (ex) {
                option = options.filter(function (m) { return m.value == option });
            }
            var titles = option.map(function (m) { return m.title }).join(",");
            if (option.length == 1 && option[0].parentId != null && option[0].parentId !== undefined && option[0].parentId != "" && option[0].parentId != "0")//只有一个父级,递归找父级
            {
                titles = this.setOption(option[0].parentId, options) + "->" + titles;
            }
            var html = '<span>' + titles.replace(/\s+/g, "") + "</span>";
            return html;
        }
        catch (ex) {
            console.log(ex)
            return "";
        }
    },
    getArea: function (data, el, id) {
        var self = this;
        if (data == null || data === "")
            return "";
        if (areaList === undefined || areaList.length == 0) {
            return "";
        }
        else {
            try {
                var provinceId = data.split("|")[0] || 0;
                var province = areaList[86][provinceId];
                var cityId = data.split("|")[1] || 0;
                var city = areaList[provinceId][cityId];
                var areaId = data.split("|")[2] || 0;
                var area = areaList[cityId][areaId];
                var html = (province || '') + (city || '') + (area || '');
                return html;
            } catch (e) {
                return data;
            }
        }
    },
    getDateDiff: function (dateStr) {
        var publishTime = Date.parse(dateStr.replace(/-/gi, "/")) / 1000,
            d_seconds,
            d_minutes,
            d_hours,
            d_days,
            timeNow = parseInt(new Date().getTime() / 1000),
            d,

            date = new Date(publishTime * 1000),
            Y = date.getFullYear(),
            M = date.getMonth() + 1,
            D = date.getDate(),
            H = date.getHours(),
            m = date.getMinutes(),
            s = date.getSeconds();
        //小于10的在前面补0
        if (M < 10) {
            M = '0' + M;
        }
        if (D < 10) {
            D = '0' + D;
        }
        if (H < 10) {
            H = '0' + H;
        }
        if (m < 10) {
            m = '0' + m;
        }
        if (s < 10) {
            s = '0' + s;
        }

        d = timeNow - publishTime;
        d_days = parseInt(d / 86400);
        d_hours = parseInt(d / 3600);
        d_minutes = parseInt(d / 60);
        d_seconds = parseInt(d);

        if (d_days > 0 && d_days < 3) {
            return d_days + '天前';
        } else if (d_days <= 0 && d_hours > 0) {
            return d_hours + '小时前';
        } else if (d_hours <= 0 && d_minutes > 0) {
            return d_minutes + '分钟前';
        } else if (d_seconds < 60) {
            if (d_seconds <= 0) {
                return '刚刚';
            } else {
                return d_seconds + '秒前';
            }
        } else if (d_days >= 3) {
            return Y + '.' + M + '.' + D;
        }
    },
    addDate: function (nowDate, year, month, day, hour, minute, second, millisecond) {
        //添加年数
        nowDate.setYear(nowDate.getFullYear() + year);
        //添加月数
        nowDate.setMonth(nowDate.getMonth() + month);
        //添加天数
        nowDate.setDate(nowDate.getDate() + day);
        //添加小时 使用时间戳
        var stamp = nowDate.getTime();
        stamp += (hour || 0) * 60 * 60 * 1000;
        stamp += (minute || 0) * 60 * 1000;
        stamp += (second || 0) * 1000;
        stamp += (millisecond || 0);
        return new Date(stamp);
    },
    setCookie: function (name, value, day) {
        var exp = new Date();
        exp.setTime(exp.getTime() + day * 24 * 60 * 60 * 1000);
        document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString();
    },
    getCookie: function (name) {
        var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");

        if (arr = document.cookie.match(reg))

            return unescape(arr[2]);
        else
            return null;
    },
    delCookie: function (name) {
        var exp = new Date();
        exp.setTime(exp.getTime() - 1);
        var cval = this.getCookie(name);
        if (cval != null)
            document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();
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
    getWhereJson: function () {
        try {
            var page = JSON.parse(this.Base64.decode(this.getStorage(this.Base64.encode(window.location.search + "where")) || ""));
            if (page === undefined)
                return true;
            else
                return page;
        } catch (ex) {
            return true;
        }
    },
    setWhereJson: function (pageStr) {
        this.setStorage(this.Base64.encode(window.location.search + "where"), this.Base64.encode(pageStr));
    },
    getPageOption: function () {
        try {
            var page = JSON.parse(this.Base64.decode(this.getStorage(this.Base64.encode(window.location.search)) || ""));
            if (page === undefined)
                return true;
            else
                return page;
        } catch (ex) {
            return true;
        }
    },
    setPageOption: function (pageStr) {
        this.setStorage(this.Base64.encode(window.location.search), this.Base64.encode(pageStr));
    },
    removeHtml: function (html) {
        html = html || '';
        var regex = /(<([^>]+)>)/ig
        return html.replace(regex, "");
    },
    /**
    * 处理富文本里的图片宽度自适应
    * 1.去掉img标签里的style、width、height属性
    * 2.img标签添加style属性：max-width:100%;height:auto
    * 3.修改所有style里的width属性为max-width:100%
    * 4.去掉<br/>标签
    */
    formatRichText: function (html) {
        let newContent = html.replace(/<img[^>]*>/gi, function (match, capture) {
            match = match.replace(/style="[^"]+"/gi, '').replace(/style='[^']+'/gi, '');
            match = match.replace(/width="[^"]+"/gi, '').replace(/width='[^']+'/gi, '');
            match = match.replace(/height="[^"]+"/gi, '').replace(/height='[^']+'/gi, '');
            return match;
        });
        newContent = newContent.replace(/style="[^"]+"/gi, function (match, capture) {
            match = match.replace(/width:[^;]+;/gi, 'max-width:100%;').replace(/width:[^;]+;/gi, 'max-width:100%;');
            return match;
        });
        newContent = newContent.replace(/<br[^>]*\/>/gi, '');
        newContent = newContent.replace(/\<img/gi, '<img style="max-width:100%;height:auto; margin: 0px auto; display:block;margin-top:0;margin-bottom:0;"');
        return newContent;
    },
    // 格式化文件大小
    getSize: function (filesize) {
        if (null == filesize || filesize == '0') {
            return "--";
        }
        var unitArr = new Array("Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB");
        var index = 0;
        var srcsize = parseFloat(filesize);
        index = Math.floor(Math.log(srcsize) / Math.log(1024));
        var size = srcsize / Math.pow(1024, index);
        size = size.toFixed(2);//保留的小数位数
        return size + unitArr[index];

    },
    // 格式化文件、文件夹图标
    getFileIcon: function (file, type) {
        if (type == 1) {
            return '<img src="' + this.getIcon(".dir") + '" class="dirOpen img-list-preview" title="' + file + '" />';
        } else if (type == 2)
            return this.setImage(file);
        else {
            return '<img src="' + this.getIcon(file) + '" class="dirFile img-list-preview" />';
        }

    },
    /**
     * 替换url的指定参数
     * @param {*} url 需要替换的url
     * @param {*} name 参数名称
     * @param {*} value 替换的值
     */
    replaceQueryString: function (url, name, value) {
        if (url.indexOf(name) <= -1) {
            if (url.indexOf('?') <= -1)
                url += "?" + name + "=" + value;
            else
                url += "&" + name + "=" + value;
            return url;
        } else {
            let re = new RegExp(name + '=[^&]*', 'gi')
            return url.replace(re, name + '=' + value)
        }
    }
});

