$(function() {
    $("#page-wrapper").css("minHeight", $(window).height() - 51),
    $.validator.addMethod("tel", function(a, b) {
        var c = /^1[3-9]\d{9}$/;
        return this.optional(b) || c.test(a)
    }),
    $("input#checkall").change(function() {
        var a = this.checked;
        $(this).parents("table").find("td").find("input[name='id']").each(function() {
            this.checked = a
        })
    }),
    $("#chooseImgFile").change(function() {
        if (window.FileReader && this.files[0]) {
            var a = $("#preImg")
              , b = this.files[0]
              , c = new FileReader;
            c.onload = function(b) {
                a.show().attr("src", b.target.result),
                $("#del-img-btn").show()
            }
            ,
            c.readAsDataURL(b)
        }
        $(this).next("[name='imageFile']").val(this.value)
    }),
    $("#del-img-btn").click(function() {
        $(this).hide(),
        $("#preImg").attr("src", "").hide(),
        $("#chooseImgFile").val("")
    })
}),
$.dialog = function(a) {
    var b = $.extend({
        title: "",
        width: 470,
        titCenter: !1,
        content: "",
        modal: !0,
        ioc: "",
        okTxt: "确定",
        cancleTxt: "取消",
        onshow: function() {},
        ok: function() {},
        cancle: function() {}
    }, a, !0)
      , c = parseInt(1e5 * Math.random())
      , d = b.modal ? '<div class="dialog-mark" id="dk' + c + '"></div>' : ""
      , e = b.title ? '<div class="title" ' + (b.titCenter ? 'style="text-align:center"' : "") + ">" + b.title + "</div>" : ""
      , f = b.ioc ? '<div class="ioc-warn"></div>' : ""
      , g = b.okTxt ? '<div class="btn-wrapper" ><div class=" btn-ok">' + b.okTxt + "</div>" + (b.cancleTxt ? '<div class=" btn-cancle">' + b.cancleTxt + "</div>" : "") + "</div>" : ""
      , h = d + '<div style="width:' + b.width + 'px"   id="d' + c + '" class="dialog-diy">' + e + f + '\t\t\t<div class="content"><div>' + b.content + "</div></div>" + g + "</div>";
    $("body").append($(h));
    var i = $("#d" + c)
      , j = $("#dk" + c);
    "function" == typeof b.onshow && b.onshow(i, j),
    i.find(".btn-ok").click(function() {
        "function" == typeof b.ok && b.ok(i, function() {
            i.remove(),
            j.remove()
        })
    }),
    i.find(".btn-cancle").click(function() {
        "function" == typeof b.cancle && b.cancle(i),
        j.remove(),
        i.remove()
    })
}
;
var FUNC = {
    istype: function(a, b) {
        return Object.prototype.toString.call(a).indexOf(b) > -1
    },
    dialog: function(a) {
        $.dialog(a)
    },
    showToast: function(a, b, c, d) {
        var e = parseInt(1e5 * Math.random());
        return $("body").append('<div class="toast" id="toast' + e + '"><div class="content"><i class="' + (b || "success") + '"></i><span>' + a + "</span></div></div>"),
        c && setTimeout(function() {
            $("#toast" + e).remove(),
            "function" == typeof d && d()
        }, c),
        $("#toast" + e)
    },
    closeToast: function(a) {
        (a || $(".toast")).remove()
    },
    alert: function(a) {
        this.dialog({
            content: a,
            width: 270,
            modal: !0,
            cancleTxt: null,
            ok: function(a, b) {
                b()
            }
        })
    },
    loadHTML: function(a, b) {
        $(a).load(b, function(b) {
            $(a).html(b)
        })
    },
    $http: function(a) {
        var b = this.showToast("正在加载", !0)
          , c = $.extend({
            dataType: "JSON",
            complete: function() {
                FUNC.closeToast(b)
            },
            fail: function(a) {
                FUNC.alert("网络错误"),
                console.error(a)
            }
        }, a, !0);
        $.ajax(c)
    },
    getUrlParma: function(a) {
        var b = location.search
          , c = {};
        if (b) {
            var d = location.search.slice(1).split("&");
            $.each(d, function(a) {
                c[d[a].slice(0, d[a].indexOf("="))] = d[a].slice(d[a].indexOf("=") + 1)
            })
        }
        return c[a] || ""
    },
    dateToStr: function(a) {
        return a.getFullYear() + "-" + this.dubbleInt(a.getMonth() + 1) + "-" + this.dubbleInt(a.getDate())
    },
    dubbleInt: function(a) {
        return a < 10 ? "0" + a : a
    },
    toDisplay: function(a, b, c) {
        a && $.dialog({
            title: "提示",
            content: "确定" + ("close" == b ? "不显示" : "显示") + "此条数据吗？",
            ok: function(d, e) {
                FUNC.$http({
                    url: (FUNC.toDisplayURL || "") + "?id=" + a + "&status=" + ("close" == b ? 2 : 1),
                    success: function(a) {
                        0 == a.status ? (FUNC.showToast("设置成功", "success", 2e3),
                        $(c).children("i").attr("class", "glyphicon glyphicon-eye-" + b + " mr5").end().find("span").text("close" == b ? "不显示" : "显示")) : FUNC.showToast(a.message, "fail", 2e3),
                        e()
                    }
                })
            }
        })
    },
    toDisplayAll: function(a, b) {
        var c = b.find("td").find("input[name='id']:checked")
          , d = [];
        c.each(function() {
            d.push(this.value)
        }),
        d.join() && $.dialog({
            title: "提示",
            content: "确定" + (2 == a ? "不显示" : "显示") + "所选中数据吗？",
            ok: function(b, c) {
                FUNC.$http({
                    url: (FUNC.toDisplayURL || "") + "?id=" + d.join() + "&status=" + a,
                    success: function(a) {
                        0 == a.status ? FUNC.showToast("设置成功", "success", 2e3, function() {
                            location.reload()
                        }) : FUNC.showToast(a.message, "fail", 2e3),
                        c()
                    }
                })
            }
        })
    },
    toDelAll: function(a, b) {
        var c = a.find("td").find("input[name='id']:checked")
          , d = [];
        c.each(function() {
            d.push(this.value)
        }),
        d.join() && $.dialog({
            title: "提示",
            content: b || "确定删除所选中数据吗？",
            ok: function(a, b) {
                FUNC.$http({
                    url: (FUNC.toDelURL || "") + "?id=" + d.join(),
                    success: function(a) {
                        0 == a.status ? FUNC.showToast("删除成功", "success", 2e3, function() {
                            location.reload()
                        }) : FUNC.showToast(a.message, "fail", 2e3),
                        b()
                    }
                })
            }
        })
    },
    toDel: function(a, b) {
        a && $.dialog({
            title: "提示",
            content: b || "确定删除此条数据吗？",
            ok: function(b, c) {
                FUNC.$http({
                    url: (FUNC.toDelURL || "") + "?id=" + a,
                    success: function(b) {
                        0 == b.status ? (FUNC.showToast("删除成功", "success", 2e3),
                        $("#list-tr-" + a).remove()) : FUNC.showToast(b.message, "fail", 2e3),
                        c()
                    }
                })
            }
        })
    },
    productOne: function() {
        new Vue({
            el: "#vue-wrapper",
            data: $.extend({
                imgArr: [],
                titleCn: "",
                titleEn: "",
                productCode: "",
                productSize: "",
                priceCn: 0,
                priceEn: 0,
                productCount: 0,
                introCn: "",
                introEn: "",
                fileArr: [],
                qaArr: []
            }, window.productInitData || {}, !0),
            methods: {
                addImg: function() {
                    this.imgArr.push({
                        title: "",
                        src: ""
                    })
                },
                delImg: function(a) {
                    this.imgArr.splice(a, 1)
                },
                delQa: function(a) {
                    this.qaArr.splice(a, 1)
                },
                addQa: function() {
                    this.qaArr.push("")
                },
                addFile: function() {
                    this.fileArr.push({
                        title: "",
                        src: ""
                    })
                },
                delFile: function(a) {
                    this.fileArr.splice(a, 1)
                },
                chooseImg: function(a, b) {
                    var c = this;
                    if (window.FileReader && a.files) {
                        var d = a.files[0]
                          , e = new FileReader;
                        e.onload = function(a) {
                            c.imgArr[b].title = d.name,
                            c.imgArr[b].src = a.target.result
                        }
                        ,
                        e.readAsDataURL(d)
                    }
                },
                chooseFile: function(a, b) {
                    var c = this;
                    if (window.FileReader && a.files) {
                        var d = a.files[0]
                          , e = new FileReader;
                        e.onload = function(a) {
                            c.fileArr[b].title = d.name,
                            c.fileArr[b].src = a.target.result
                        }
                        ,
                        e.readAsDataURL(d)
                    }
                }
            }
        })
    }
};
