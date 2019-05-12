window.FUNC = window.FUNC || {
    loadHTML: function(selector, url) {
        $(selector).load(url, function(dataHTML) {
            $(selector).html(dataHTML);
        })
    },
    /**
     * 获取URL中的search的key值
     * @param key
     * @returns {*|string}
     */
    getUrlParma: function(key) {
        var search = location.search,
            result = {};
        if (search) {
            var paramArr = location.search.slice(1).split("&");
            $.each(paramArr, function(i) {
                result[paramArr[i].slice(0, paramArr[i].indexOf("="))] = paramArr[i].slice(paramArr[i].indexOf("=") + 1);
            })
        }
        return result[key] || "";
    },
    validate: function(fn, opt) {
        $.validator.addMethod("isZipCode", function(value, element) {
            var reg = /^[0-9]{6}$/;
            return this.optional(element) || (reg.test(value));
        }, "请正确填写邮政编码");
        $.validator.addMethod("tel", function(value, element) {
            var reg = /^1[3-9]\d{9}$/;
            return this.optional(element) || (reg.test(value));
        }, "请正确填写手机号码");

        $.validator.addMethod("code2", function(value, element) {
            var reg = /^[0-9a-zA-Z]{6,8}$/;
            return this.optional(element) || (reg.test(value));
        }, "请填写正确的邀请码");

        $.validator.addMethod("username", function(value, element) {
            var reg = /^[A-Za-z\u4e00-\u9fa5][A-Za-z0-9\u4e00-\u9fa5_\\-]{1,15}$/;
            return this.optional(element) || (reg.test(value));
        }, "请正确填写用户名");
        $.validator.setDefaults($.extend(true, {
            errorClass: "k-v-error",
            validClass: "k-v-valid",
            errorElement: "var",
            parentElement: "",
            focusCleanup: false,
            onkeyup: function() {},
            debug: false,
            //ignore: ".ignore",
            //errorLabelContainer:"",
            //remote:null,//等同jq ajax
            //errorPlacement: function(error, element) {
            //    error.appendTo(element.parent());
            //},
            //debug:true,
            submitHandler: function(form) {
                $(this.submitButton).attr("disabled", true).val("SEND...");
                form.submit();
            }
        }, opt));
        $.isFunction(fn) && fn();

    },
    /**
     * 弹窗 通用 包括 alert  confirm propt pop 等公用弹窗
     * @param opt
     * @param fn
     */
    dialog: function(opt, fn) {
        var a = dialog($.extend({
            title: '提示信息',
            content: "",
            fixed: true,
            cancel: true, // x  按钮
            skin: 'min-dialog',
            modal: true
        }, opt));
        if ($.isFunction(fn)) {
            fn(a);
        } else {
            a.show();
        }
    },
    messager: {
        alert: function(text, fn, opt) {
            Z.dialog($.extend({
                title: "提示信息",
                content: text,
                width: 250,
                okValue: "确定",
                fixed: true,
                cancel: false,
                skin: 'min-dialog',
                ok: function() {
                    $.isFunction(fn) && fn();
                }
            }, opt || {}));
        },
        confirm: function(text, fn, opt) {
            Z.dialog($.extend({
                title: "确认信息",
                content: text,
                width: 350,
                okValue: "确定",
                cancelValue: "取消",
                skin: 'min-dialog',
                fixed: true,
                ok: function() {
                    $.isFunction(fn) && fn();
                }
            }, opt || {}));
        },
        prompt: function(text, fn, opt) {
            Z.dialog($.extend({
                title: "输入信息",
                content: "<div class='pb10'>" + text + "</div><input data-dialog-prompt-input='1' style='width:91%;'  class='k-input-text '/><var class='k-v-error' data-prompt-input='1'  style='display:none'>" + (opt.required || "请输入值") + "</var>",
                width: 350,
                okValue: "确定",
                skin: 'min-dialog',
                cancelValue: "取消",
                fixed: true,
                ok: function() {
                    var val = $('[data-dialog-prompt-input]').val();
                    if (opt.required && val == "") {
                        $('[data-prompt-input]').show();
                        return false;
                    } else {
                        $.isFunction(fn) && fn(val);
                    }
                }
            }, opt || {}));
        },
        /**
         * 临时弹窗
         * @param obj 用于显示的位置 DOM
         * @param text
         * @param fn
         */
        tooltip: function(obj, text, fn) {
            Z.dialog({
                title: "",
                content: text,
                quickClose: true,
                fixed: false,
                modal: false,
                ok: null,
                cancel: null
            }, function(d) {
                d.show(obj);
                $.isFunction(fn) && fn(d);
            });
        },
        pop: function(opt, fn) {
            var timer = null;
            var opts = $.extend({
                title: " ",
                text: "",
                quickClose: false,
                skin: 'koo-dialog koo-dialog-icons',
                width: 350,
                ok: null,
                cancel: false,
                second: 0, //多少秒后自动关闭
                type: 1, //1 right 2.error 3.wran, 4 info
                onclose: function() {
                    timer && clearInterval(timer);
                }
            }, opt);
            var iocStr = opts.type ? "<em class='ioc-" + opts.type + "'></em>" : "";
            var secondStr = opts.second ? "<p class='gray666 tac pb20'>" + opts.second + "秒后自动关闭</p>" : "";
            var contentStr = "<div class='k-dialog-text'>" + iocStr + "<div>" + opts.text + "</div>" + secondStr + "</div>";
            Z.dialog($.extend({
                content: contentStr
            }, opts), function(d) {
                if (!opts.title.match(/^\s*$/)) {
                    $(".ui-dialog-body").css("padding", 30)
                };
                d.show();
                if (opts.second) {
                    timer = null, num = opts.second;
                    timer = setInterval(function() {
                        num--;
                        if (num <= 0) {
                            $.isFunction(fn) && fn(d);
                            timer && clearInterval(timer);
                            d.close();
                        } else {
                            d.content("<div class='k-dialog-text'>" + iocStr + "<div>" + opts.text + "</div><p class='gray666 tac pb20'>" + num + "秒后自动关闭</p></div>")
                        }
                    }, 1000);
                } else {
                    $.isFunction(fn) && fn(d);
                }

            });
        }
    },
    /**
     * 图片懒加载
     * @param selector
     * @param options
     */
    lazyload: function(selector, options) {
        $.fn.scrollLoading = function(options) {
            var defaults = {
                attr: "data-url",
                container: $(window),
                callback: $.noop
            };
            var params = $.extend({}, defaults, options || {});
            params.cache = [];
            $(this).each(function() {
                var node = this.nodeName.toLowerCase(),
                    url = $(this).attr(params["attr"]);
                //重组
                var data = {
                    obj: $(this),
                    tag: node,
                    url: url
                };
                params.cache.push(data);
            });
            var callback = function(call) {
                if ($.isFunction(params.callback)) {
                    params.callback.call(call.get(0));
                }
            };
            //动态显示数据cookie.js
            var loading = function() {

                var contHeight = params.container.height(),
                    contop = "";

                if (params.container.get(0) === window) {
                    contop = $(window).scrollTop();
                } else {
                    contop = params.container.offset().top;
                }

                $.each(params.cache, function(i, data) {
                    var o = data.obj,
                        tag = data.tag,
                        url = data.url,
                        post, posb;

                    if (o) {
                        post = o.offset().top - contop, posb = post + o.height();
                        if ((post >= 0 && post < contHeight) || (posb > 0 && posb <= contHeight)) {
                            if (url) {
                                //在浏览器窗口内
                                if (tag === "img") {
                                    //图片，改变src
                                    callback(o.attr("src", url));
                                } else {
                                    o.load(url, {}, function() {
                                        callback(o);
                                    });
                                }
                            } else {
                                // 无地址，直接触发回调
                                callback(o);
                            }
                            data.obj = null;
                        }
                    }
                });
            };
            //事件触发
            //加载完毕即执行
            loading();
            //滚动执行
            params.container.bind("scroll", loading);
        };
        $(selector).scrollLoading(options);
    },
    /**
     对Date的扩展，将 Date 转化为指定格式的String * 月(M)、日(d)、12小时(h)、24小时(H)、分(m)、秒(s)、周(E)、季度(q)
     可以用 1-2 个占位符 * 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字) * eg: *
     KC.formateDate(42123123123,"yyyy-MM-dd hh:mm:ss.S")==> 2006-07-02 08:09:04.423
     * KC.formateDate(42123123123,"yyyy-MM-dd E HH:mm:ss") ==> 2009-03-10 二 20:09:04
     * KC.formateDate(42123123123,"yyyy-MM-dd EE hh:mm:ss") ==> 2009-03-10 周二 08:09:04
     * KC.formateDate(42123123123,"yyyy-MM-dd EEE hh:mm:ss") ==> 2009-03-10 星期二 08:09:04
     * KC.formateDate(42123123123,"yyyy-M-d h:m:s.S") ==> 2006-7-2 8:9:4.18
     */
    formateDate: function(int, fmt) {
        var D = new Date(int);
        var o = {
            "M+": D.getMonth() + 1, //月份
            "d+": D.getDate(), //日
            "h+": D.getHours() % 12 == 0 ? 12 : D.getHours() % 12, //小时
            "H+": D.getHours(), //小时
            "m+": D.getMinutes(), //分
            "s+": D.getSeconds(), //秒
            "q+": Math.floor((D.getMonth() + 3) / 3), //季度
            "S": D.getMilliseconds() //毫秒
        };
        var week = {
            "0": "/u65e5",
            "1": "/u4e00",
            "2": "/u4e8c",
            "3": "/u4e09",
            "4": "/u56db",
            "5": "/u4e94",
            "6": "/u516d"
        };
        if (/(y+)/.test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (D.getFullYear() + "").substr(4 - RegExp.$1.length));
        }
        if (/(E+)/.test(fmt)) {
            fmt = fmt.replace(RegExp.$1, ((RegExp.$1.length > 1) ? (RegExp.$1.length > 2 ? "/u661f/u671f" : "/u5468") : "") + week[D.getDay() + ""]);
        }
        for (var k in o) {
            if (new RegExp("(" + k + ")").test(fmt)) {
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
            }
        }
        return fmt;
    },
    toggleSome:function(obj,selecotr){
        $(obj).toggle(function(){
            $(this).addClass('active');
            $(selecotr).show();
        },function(){
             $(selecotr).hide();
            $(this).removeClass('active')
        })
    }
};

