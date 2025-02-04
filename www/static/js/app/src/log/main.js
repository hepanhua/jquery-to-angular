define("app/src/log/main", ["lib/jquery-lib", "lib/util", "lib/artDialog/jquery-artDialog", "../../common/core", "../../tpl/copyright.html", "../../tpl/search.html", "../../tpl/search_list.html", "../../tpl/upload.html", "./httplog", "./ftplog", "./sambalog","./auditlog", "./avlog"],
function(e) {
    e("lib/jquery-lib"),
    e("lib/util"),
    e("lib/artDialog/jquery-artDialog"),
    core = e("../../common/core"),
    httpLog = e("./httplog"),
    ftpLog = e("./ftplog"),
    sambaLog = e("./sambalog"),
    auditLog = e("./auditlog"),
    avLog = e("./avlog"),
    httpLog.init(),
    httpLog.bindEvent(),
    ftpLog.bindEvent(),
    sambaLog.bindEvent(),
    auditLog.bindEvent(),
    avLog.bindEvent()
}),
define("app/common/core", [],
function(require, exports) {
    return {
        filetype: {
            image: ["jpg", "jpeg", "png", "bmp", "gif", "ico"],
            music: ["mp3", "wma", "wav", "mid", "m4a", "aac", "midi"],
            movie: ["avi", "flv", "f4v", "wmv", "3gp", "mp4", "wmv", "asf", "m4v", "mov", "mpg"],
            doc: ["doc", "docx", "docm", "xls", "xlsx", "xlsb", "xlsm", "ppt", "pptx", "pptm"],
            text: ["oexe", "inc", "inf", "csv", "log", "asc", "tsv", "lnk", "url", "webloc"],
            code: ["abap", "abc", "as", "ada", "adb", "htgroups", "htpasswd", "conf", "htaccess", "htgroups", "htpasswd", "asciidoc", "asm", "ahk", "bat", "cmd", "c9search_results", "cpp", "c", "cc", "cxx", "h", "hh", "hpp", "cirru", "cr", "clj", "cljs", "CBL", "COB", "coffee", "cf", "cson", "Cakefile", "cfm", "cs", "css", "curly", "d", "di", "dart", "diff", "patch", "Dockerfile", "dot", "dummy", "dummy", "e", "ejs", "ex", "exs", "elm", "erl", "hrl", "frt", "fs", "ldr", "ftl", "gcode", "feature", ".gitignore", "glsl", "frag", "vert", "go", "groovy", "haml", "hbs", "handlebars", "tpl", "mustache", "hs", "hx", "html", "htm", "xhtml", "erb", "rhtml", "ini", "cfg", "prefs", "io", "jack", "jade", "java", "js", "jsm", "json", "jq", "jsp", "jsx", "jl", "tex", "latex", "ltx", "bib", "lean", "hlean", "less", "liquid", "lisp", "ls", "logic", "lql", "lsl", "lua", "lp", "lucene", "Makefile", "GNUmakefile", "makefile", "OCamlMakefile", "make", "md", "markdown", "mask", "matlab", "mel", "mc", "mush", "mysql", "nix", "m", "mm", "ml", "mli", "pas", "p", "pl", "pm", "pgsql", "php", "phtml", "ps1", "praat", "praatscript", "psc", "proc", "plg", "prolog", "properties", "proto", "py", "r", "Rd", "Rhtml", "rb", "ru", "gemspec", "rake", "Guardfile", "Rakefile", "Gemfile", "rs", "sass", "scad", "scala", "scm", "rkt", "scss", "sh", "bash", ".bashrc", "sjs", "smarty", "tpl", "snippets", "soy", "space", "sql", "styl", "stylus", "svg", "tcl", "tex", "txt", "textile", "toml", "twig", "ts", "typescript", "str", "vala", "vbs", "vb", "vm", "v", "vh", "sv", "svh", "vhd", "vhdl", "xml", "rdf", "rss", "wsdl", "xslt", "atom", "mathml", "mml", "xul", "xbl", "xaml", "xq", "yaml", "yml", "htm", "xib", "xsd", "storyboard", "plist", "csproj"],
            bindary: ["pdf", "bin", "zip", "swf", "gzip", "rar", "arj", "tar", "gz", "cab", "tbz", "tbz2", "lzh", "uue", "bz2", "ace", "exe", "so", "dll", "chm", "rtf", "odp", "odt", "pages", "class", "psd", "ttf", "fla", "7z", "dmg", "iso", "dat", "ipa"]
        },
        ico: function(e) {
            var a = G.static_path + "images/file_16/",
            t = ["folder", "file", "edit", "search", "up", "setting", "appStore", "error", "info", "mp3", "flv", "pdf", "doc", "xls", "ppt", "html", "swf"],
            i = $.inArray(e, t);
            return - 1 == i ? a + "file.png": a + e + ".png"
        },
        contextmenu: function(e) {
            try {
                rightMenu.hidden()
            } catch(a) {}
            var a = e || window.event;
            return a ? a && $(a.target).is("textarea") || $(a.target).is("input") || 0 != $(a.target).parents(".topbar").length || 0 != $(a.target).parents(".edit_body").length || 0 != $(a.target).parents(".aui_state_focus").length ? !0 : !1 : !0
        },
        pathThis: function(e) {
            e = e.replace(/\\/g, "/");
            var a = e.split("/"),
            t = a[a.length - 1];
            if ("" == t && (t = a[a.length - 2]), 0 == t.search("fileProxy")) {
                t = urlDecode(t.substr(t.search("&path=")));
                var a = t.split("/");
                t = a[a.length - 1],
                "" == t && (t = a[a.length - 2])
            }
            return t
        },
        pathFather: function(e) {
            e = e.replace(/\\/g, "/");
            var a = e.lastIndexOf("/");
            return e.substr(0, a + 1)
        },
        pathExt: function(e) {
            e = e.replace(/\\/g, "/"),
            e = e.replace(/\/+/g, "/");
            var a = e.lastIndexOf(".");
            return e = e.substr(a + 1),
            e.toLowerCase()
        },
        path2url: function(e) {
            if ("http" == e.substr(0, 4)) return e;
            if (e = e.replace(/\\/g, "/"), e = e.replace(/\/+/g, "/"), e = e.replace(/\/\.*\//g, "/"), G.is_root && e.substring(0, G.web_root.length) == G.web_root) return G.web_host + e.replace(G.web_root, "");
            var a = G.app_host + "/index.php?explorer/fileProxy&path=" + urlEncode(e);
            return G.share_page !== void 0 && (a = G.app_host + "/index.php?share/fileProxy&user=" + G.user + "&sid=" + G.sid + "&path=" + urlEncode(e)),
            a
        },
        authCheck: function(e, a) {
            return G.is_root ? !0 : AUTH.hasOwnProperty(e) ? AUTH[e] ? !0 : (void 0 == a && (a = LNG.no_permission), core.tips.tips(a, !1), !1) : !0
        },
        ajaxError: function(e) {
            core.tips.close(LNG.system_error, !1);
            var a = e.responseText,
            t = '<div class="ajaxError">' + a + "</div>",
            i = $.dialog.list.ajaxErrorDialog;
            return "<!--user login-->" == a.substr(0, 17) ? (FrameCall.goRefresh(), void 0) : (i ? i.content(t) : $.dialog({
                id: "ajaxErrorDialog",
                padding: 0,
                width: "60%",
                height: "50%",
                fixed: !0,
                resize: !0,
                ico: core.ico("error"),
                title: "ajax error",
                content: t
            }), void 0)
        },
        file_get: function(e, a) {
            var t = "./index.php?editor/fileGet&filename=" + urlEncode2(e);
            G.share_page !== void 0 && (t = "./index.php?share/fileGet&user=" + G.user + "&sid=" + G.sid + "&filename=" + urlEncode2(e)),
            $.ajax({
                url: t,
                dataType: "json",
                beforeSend: function() {
                    core.tips.loading(LNG.loading)
                },
                error: core.ajaxError,
                success: function(e) {
                    core.tips.close(LNG.success),
                    "function" == typeof a && a(e.data.content)
                }
            })
        },
        setting: function(e) {
            void 0 == e && (e = G.is_root ? "system": "user"),
            void 0 == window.top.frames.Opensetting_mode ? $.dialog.open("./index.php?setting#" + e, {
                id: "setting_mode",
                fixed: !0,
                ico: core.ico("setting"),
                resize: !0,
                title: LNG.setting,
                width: 960,
                height: 580
            }) : ($.dialog.list.setting_mode.display(!0), FrameCall.top("Opensetting_mode", "Setting.setGoto", '"' + e + '"'))
        },
        copyright: function() {
            var e = require("../tpl/copyright.html"),
            a = template.compile(e),
            t = a({
                LNG: LNG,
                G: G
            });
            $.dialog({
                id: "copyright_dialog",
                bottom: 0,
                right: 0,
                simple: !0,
                resize: !1,
                title: LNG.about + " secros",
                width: 425,
                padding: "0",
                fixed: !0,
                content: t
            })
        },
        appStore: function() {
            $.dialog.open("./index.php?app", {
                id: "app_store",
                fixed: !0,
                ico: core.ico("appStore"),
                resize: !0,
                title: LNG.app_store,
                width: 900,
                height: 550
            })
        },
        openIE: function(e) {
            $.dialog.open(e, {
                fixed: !0,
                resize: !0,
                title: LNG.app_store,
                width: "80%",
                height: "70%"
            })
        },
        openApp: function(app) {
            if ("url" == app.type) {
                var icon = app.icon; - 1 == app.icon.search(G.static_path) && "http" != app.icon.substring(0, 4) && (icon = G.static_path + "images/app/" + app.icon),
                "number" != typeof app.width && -1 == app.width.search("%") && (app.width = parseInt(app.width)),
                "number" != typeof app.height && -1 == app.height.search("%") && (app.height = parseInt(app.height)),
                $.dialog.open(app.content, {
                    title: app.name,
                    fixed: !0,
                    ico: icon,
                    resize: app.resize,
                    simple: app.simple,
                    title: app.name.replace(".oexe", ""),
                    width: app.width,
                    height: app.height
                })
            } else {
                var exec = app.content;
                console.log(exec),
                eval("{" + exec + "}")
            }
        },
        update: function() {
            var e = base64_decode("aHR0cDovL3d3dy5hbnlzZWMuY29tL3VwZGF0ZS9tYWluLmpz") + "?a=" + UUID();
            require.async(e,
            function() {
                try {} catch(e) {}
            })
        },
        explorer: function(e, a) {
            void 0 == e && (e = ""),
            void 0 == a && (a = core.pathThis(e));
            var t = "./index.php?/explorer&type=iframe&path=" + e;
            G.share_page !== void 0 && (t = "./index.php?share/folder&type=iframe&user=" + G.user + "&sid=" + G.sid + "&path=" + e),
            $.dialog.open(t, {
                resize: !0,
                fixed: !0,
                ico: core.ico("folder"),
                title: a,
                width: 880,
                height: 550
            })
        },
        explorerCode: function(e) {
            void 0 == e && (e = "");
            var a = "index.php?/editor&project=" + e;
            G.share_page !== void 0 && (a = "./index.php?share/code_read&user=" + G.user + "&sid=" + G.sid + "&project=" + e),
            $.dialog.open(a, {
                resize: !0,
                fixed: !0,
                ico: core.ico("folder"),
                title: core.pathThis(e),
                width: "80%",
                height: "70%"
            })
        },
        setSkin_finished: function() {
            var e = $(".setSkin_finished").attr("src");
            e && ($("#link_css_list").attr("href", e), $(".setSkin_finished").remove())
        },
        setSkin: function(e, a) {
            var t = G.static_path + "style/skin/" + e + a;
            $("body").append('<img src="' + t + '" onload="core.setSkin_finished();" onerror="core.setSkin_finished();" class="setSkin_finished">')
        },
        editorFull: function() {
            var e = $("iframe[name=OpenopenEditor]");
            e.toggleClass("frame_fullscreen")
        },
        language: function(e) {
            Cookie.set("secros_user_language", e, 8760),
            window.location.reload()
        },
        tips: {
            topHeight: function() {
                return "undefined" != typeof Global && Global.topbar_height ? Global.topbar_height: 0
            },
            loading: function(e) {
                Tips.loading(e, "info", core.tips.topHeight())
            },
            close: function(e, a) {
                "object" == typeof e ? Tips.close(e.data, e.code, core.tips.topHeight()) : Tips.close(e, a, core.tips.topHeight())
            },
            tips: function(e, a) {
                "object" == typeof e ? Tips.tips(e.data, e.code, core.tips.topHeight()) : Tips.tips(e, a, core.tips.topHeight())
            }
        },
        fullScreen: function() {
            "true" == $("body").attr("fullScreen") && core.exitfullScreen(),
            $("body").attr("fullScreen", "true");
            var e = document.documentElement;
            e.requestFullscreen ? e.requestFullscreen() : e.mozRequestFullScreen ? e.mozRequestFullScreen() : e.webkitRequestFullScreen && e.webkitRequestFullScreen()
        },
        exitfullScreen: function() {
            $("body").attr("fullScreen", "false"),
            document.exitFullscreen ? document.exitFullscreen() : document.mozCancelFullScreen ? document.mozCancelFullScreen() : document.webkitCancelFullScreen && document.webkitCancelFullScreen()
        },
        createFlash: function(e, a, t) {
            var i = '<object type="application/x-shockwave-flash" id="' + t + '" data="' + e + '" width="100%" height="100%">' + '<param name="movie" value="' + e + '"/>' + '<param name="allowfullscreen" value="true" />' + '<param name="allowscriptaccess" value="always" />' + '<param name="flashvars" value="' + a + '" />' + '<param name="wmode" value="transparent" />' + "</object>";
            return i
        },
        search: function(e, a) {
            var t, i, n = require("../tpl/search.html"),
            o = require("../tpl/search_list.html"),
            s = function() {
                var o = template.compile(n);
                0 == $(".dialog_do_search").length ? (l(), i = {
                    search: e,
                    path: a,
                    is_content: void 0,
                    is_case: void 0,
                    ext: "",
                    LNG: LNG
                },
                t = $.dialog({
                    id: "dialog_do_search",
                    padding: 0,
                    fixed: !0,
                    ico: core.ico("search"),
                    resize: !0,
                    title: LNG.search,
                    width: 450,
                    content: o(i)
                }), c(i), $("#search_ext").tooltip({
                    placement: "bottom",
                    html: !0
                }), $("#search_path").tooltip({
                    placement: "bottom",
                    html: !0,
                    title: function() {
                        return $("#search_path").val()
                    }
                })) : ($("#search_value").val(e), $("#search_path").val(a), r(), $.dialog.list.dialog_do_search.display(!0))
            },
            r = function() {
                i = {
                    search: $("#search_value").val(),
                    path: $("#search_path").val(),
                    is_content: $("#search_is_content").attr("checked"),
                    is_case: $("#search_is_case").attr("checked"),
                    ext: $("#search_ext").val()
                },
                c(i)
            },
            l = function() {
                $("#search_value").die("keyup").live("keyup",
                function() {
                    ui.path.setSearchByStr($(this).val())
                }),
                $("#search_value,#search_ext,#search_path").keyEnter(r),
                $(".search_header a.button").die("click").live("click", r),
                $(".search_result .list .name").die("click").live("click",
                function() {
                    var e = $(this).find("a").html(),
                    a = $(this).parent().find(".path a").html() + e;
                    $(this).parent().hasClass("file") ? ui.pathOpen.open(a) : "explorer" == Config.pageApp ? ui.path.list(a + "/", "tips") : core.explorer(a + "/")
                }),
                $(".search_result .list .path a").die("click").live("click",
                function() {
                    var e = $(this).html();
                    "explorer" == Config.pageApp ? ui.path.list(e, "tips") : core.explorer(e)
                })
            },
            c = function(e) {
                var a = 150;
                $("#search_value").focus(),
                $(".search_result .list").remove();
                var t = $(".search_result .message td");
                if (!e.search || !e.path) return t.hide().html(LNG.search_info).fadeIn(a),
                void 0;
                if (1 >= e.search.length) return t.hide().html("too short!").fadeIn(a),
                void 0;
                var i = "index.php?explorer/search";
                G.share_page !== void 0 && (i = "index.php?share/search&user=" + G.user + "&sid=" + G.sid),
                $.ajax({
                    url: i,
                    dataType: "json",
                    type: "POST",
                    data: e,
                    beforeSend: function() {
                        t.hide().html(LNG.searching + '<img src="' + G.static_path + 'images/loading.gif">').fadeIn(a)
                    },
                    error: core.ajaxError,
                    success: function(e) {
                        if (!e.code) return t.hide().html(e.data).fadeIn(a),
                        void 0;
                        if (0 == e.data.filelist.length && 0 == e.data.folderlist.length) return t.hide().html(LNG.search_null).fadeIn(a),
                        void 0;
                        t.hide();
                        var i = template.compile(o);
                        e.data.LNG = LNG,
                        $(i(e.data)).insertAfter(".search_result .message").fadeIn(a)
                    }
                })
            };
            s()
        },
        server_dwonload: function(e) {
            core.upload_check("explorer:serverDownload");
            var a = $(".download_box"),
            t = a.find("#download_list"),
            i = a.find("input").val();
            if (a.find("input").val(""), !i || "http" != i.substr(0, 4)) return core.tips.tips("url false!", !1),
            void 0;
            var n = UUID(),
            o = '<div id="' + n + '" class="item">' + '<div class="info"><span class="title" tytle="' + i + '">' + core.pathThis(i) + "</span>" + '<span class="size">0b</span>' + '<span class="state">' + LNG.upload_ready + "</span>" + '<a class="remove font-icon icon-remove" href="javascript:void(0)"></a>' + '<div style="clear:both"></div></div></div>';
            t.find(".item").length > 0 ? $(o).insertBefore(t.find(".item:eq(0)")) : t.append(o);
            var s, r, l, c = 0,
            d = $("#" + n),
            p = $("#" + n + " .state").text(LNG.download_ready),
            u = $('<div class="progress progress-striped active"><div class="progress-bar" role="progressbar" style="width: 0%;text-align:right;"></div></div>').appendTo("#" + n).find(".progress-bar");
            $("#" + n + " .remove").bind("click",
            function() {
                clearInterval(s),
                s = !1,
                clearTimeout(r),
                s = !1,
                $.get("./index.php?explorer/serverDownload&type=remove&uuid=" + n),
                $(this).parent().parent().slideUp(function() {
                    $(this).remove(),
                    ui.f5()
                })
            }),
            $.ajax({
                url: "./index.php?explorer/serverDownload&type=download&save_path=" + e + "&url=" + urlEncode2(i) + "&uuid=" + n,
                dataType: "json",
                error: function(e, a, t) {
                    core.ajaxError(e, a, t),
                    clearInterval(s),
                    s = !1,
                    clearTimeout(r),
                    s = !1,
                    u.parent().remove(),
                    p.addClass("error").text(LNG.download_error)
                },
                success: function(e) {
                    clearInterval(s),
                    s = !1,
                    clearTimeout(r),
                    s = !1,
                    e.code ? (ui.f5_callback(function() {
                        ui.path.setSelectByFilename(e.info)
                    }), p.text(LNG.download_success), $("#" + n + " .info .title").html(e.info)) : p.addClass("error").text(LNG.error),
                    u.parent().remove()
                }
            });
            var h = function() {
                $.ajax({
                    url: "./index.php?explorer/serverDownload&type=percent&uuid=" + n,
                    dataType: "json",
                    success: function(e) {
                        var a = "",
                        t = e.data;
                        if (s) {
                            if (!e.code) return p.text(LNG.loading),
                            void 0;
                            if (t) {
                                if (t.size = parseFloat(t.size), t.time = parseFloat(t.time), l) {
                                    var i = (t.size - l.size) / (t.time - l.time);
                                    if (c > .2 * i) {
                                        var n = c;
                                        c = i,
                                        i = n
                                    } else c = i;
                                    a = core.file_size(i) + "/s"
                                }
                                if (0 == t.length) d.find(".progress-bar").css("width", "100%").text(LNG.loading);
                                else {
                                    var o = 100 * (t.size / t.length);
                                    d.find(".progress-bar").css("width", o + "%"),
                                    p.text(parseInt(o) + "%(" + a + ")")
                                }
                                d.find(".size").text(core.file_size(t.length)),
                                l = t
                            }
                        }
                    }
                })
            };
            r = setTimeout(function() {
                h(),
                s = setInterval(function() {
                    h()
                },
                1e3)
            },
            100)
        },
        file_size: function(e) {
            if (0 == e) return "0B";
            e = parseFloat(e);
            var a = {
                GB: 1073741824,
                MB: 1048576,
                KB: 1024,
                "B ": 0
            };
            for (var t in a) if (e >= a[t]) return (e / a[t]).toFixed(1) + t;
            return "0B"
        },
        upload_check: function(e) {
            return void 0 == e && (e = "explorer:fileUpload"),
            !G.is_root && AUTH.hasOwnProperty(e) && 1 != AUTH[e] ? (core.tips.tips(LNG.no_permission, !1), void 0) : "*recycle*/" == G.this_path || "*share*/" == G.this_path || "*share*/" == G.this_path || G.json_data && "writeable" != G.json_data.path_type ? (core.tips.tips(LNG.no_permission_write, !1), !1) : !0
        },
        upload: function() {
            G.upload_path = G.this_path;
            var e = urlDecode(G.upload_path);
            if (uploader.option("server", "index.php?explorer/fileUpload&path=" + urlEncode(G.upload_path)), 30 >= e.length ? e: "..." + e.substr(e.length - 30), 0 != $(".dialog_file_upload").length) return $.dialog.list.dialog_file_upload.display(!0),
            void 0;
            var a = require("../tpl/upload.html"),
            t = template.compile(a),
            i = WebUploader.Base.formatSize(G.upload_max);
            $.dialog({
                padding: 5,
                resize: !0,
                ico: core.ico("up"),
                id: "dialog_file_upload",
                fixed: !0,
                title: LNG.upload_muti,
                content: t({
                    LNG: LNG,
                    maxsize: i
                }),
                close: function() {
                    $.each(uploader.getFiles(),
                    function(e, a) {
                        uploader.skipFile(a),
                        uploader.removeFile(a)
                    }),
                    $.each($("#download_list .item"),
                    function() {
                        $(this).find(".remove").click()
                    })
                }
            }),
            $(".file_upload .tips").tooltip({
                placement: "bottom"
            }),
            $(".file_upload .top_nav a.menu").unbind("click").bind("click",
            function() {
                $(this).hasClass("tab_upload") ? ($(".file_upload .tab_upload").addClass("this"), $(".file_upload .tab_download").removeClass("this"), $(".file_upload .upload_box").removeClass("hidden"), $(".file_upload .download_box").addClass("hidden")) : ($(".file_upload .tab_upload").removeClass("this"), $(".file_upload .tab_download").addClass("this"), $(".file_upload .upload_box").addClass("hidden"), $(".file_upload .download_box").removeClass("hidden"))
            }),
            $(".file_upload .download_box button").unbind("click").bind("click",
            function() {
                core.server_dwonload(G.upload_path)
            }),
            uploader.addButton({
                id: "#picker"
            })
        },
        upload_init: function() {
            var e = "#thelist",
            a = !0;
            $.browser.msie && (a = !1);
            var t = 10485760;
            t >= G.upload_max && (t = .5 * G.upload_max),
            uploader = WebUploader.create({
                swf: G.static_path + "js/lib/webuploader/Uploader.swf",
                dnd: "body",
                threads: 2,
                compress: !1,
                resize: !1,
                prepareNextFile: !0,
                duplicate: !0,
                chunked: a,
                chunkRetry: 3,
                chunkSize: t
            }),
            $("#uploader .success").die("click").live("click",
            function() {
                var e = $(this).find("span.title").attr("title");
                "explorer" == Config.pageApp ? ui.path.list(core.pathFather(e), "tips",
                function() {
                    ui.path.setSelectByFilename(core.pathThis(e))
                }) : core.explorer(core.pathFather(e))
            }),
            $("#uploader .open").die("click").live("click",
            function(e) {
                var a = $(this).find("span.title").attr("title");
                ui.pathOpen.open(a),
                stopPP(e)
            }),
            $(".upload_box_clear").die("click").live("click",
            function() {
                $("#thelist .item.success,#thelist .item.error").each(function() {
                    $(this).slideUp(300,
                    function() {
                        $(this).remove()
                    })
                })
            }),
            $(".upload_box_setting").die("click").live("click",
            function() {
                $(".upload_box_config").toggleClass("hidden")
            }),
            $("#uploader .remove").die("click").live("click",
            function(e) {
                var a = $(this).parent().parent().attr("id");
                uploader.skipFile(a),
                uploader.removeFile(a, !0),
                $(this).parent().parent().slideUp(function() {
                    $(this).remove()
                }),
                stopPP(e)
            });
            var i = 0,
            n = 0,
            o = "0B/s",
            s = function(e, a) {
                var t = e.size * a,
                i = 5;
                e.speed === void 0 ? e.speed = [[time() - 500, 0], [time(), t]] : i >= e.speed.length ? e.speed.push([time(), t]) : (e.speed = e.speed.slice(1, i), e.speed.push([time(), t]));
                var n = e.speed[e.speed.length - 1],
                s = e.speed[0],
                r = (n[1] - s[1]) / ((n[0] - s[0]) / 1e3);
                return r = core.file_size(r) + "/s",
                o = r,
                r
            },
            r = [];
            uploader.on("uploadBeforeSend",
            function(e, a) {
                var t = urlEncode(e.file.fullPath); (void 0 == t || "undefined" == t) && (t = ""),
                a.fullPath = t
            }).on("fileQueued",
            function(a) {
                if (!core.upload_check()) return uploader.skipFile(a),
                uploader.removeFile(a),
                void 0;
                var t, n = $(e),
                t = a.fullPath;
                a.finished = !1,
                (void 0 == t || "undefined" == t) && (t = a.name),
                i++,
                $(e).find(".item").length > 0 && (n = $(e).find(".item:eq(0)"));
                var o = '<div id="' + a.id + '" class="item"><div class="info">' + '<span class="title" title="' + G.upload_path + t + '">' + core.pathThis(t) + "</span>" + '<span class="size">' + core.file_size(a.size) + "</span>" + '<span class="state">' + LNG.upload_ready + "</span>" + '<a class="remove font-icon icon-remove" href="javascript:void(0)"></a>' + '<div style="clear:both"></div></div></div>';
                $(e).find(".item").length > 0 ? $(o).insertBefore($(e).find(".item:eq(0)")) : $(e).append(o),
                uploader.upload()
            }).on("uploadProgress",
            function(e, a) {
                $(".dialog_file_upload .aui_title").text(LNG.uploading + ": " + n + "/" + i + " (" + o + ")");
                var t = s(e, a),
                r = $("#" + e.id),
                l = r.find(".progress .progress-bar");
                l.length || (l = $('<div class="progress progress-striped active"><div class="progress-bar" role="progressbar" style="width: 0%"></div></div>').appendTo(r).find(".progress-bar")),
                r.find(".state").text(parseInt(100 * a) + "%(" + t + ")"),
                l.css("width", 100 * a + "%")
            }).on("uploadAccept",
            function(e, a) {
                e.file.serverData = a;
                try {
                    r.push(core.pathThis(a.info))
                } catch(t) {}
            }).on("uploadSuccess",
            function(e) {
                var a = 36 * $("#" + e.id).index(".item");
                $("#uploader").scrollTop(a),
                n++;
                var t = e.serverData;
                if (t.code ? ($("#" + e.id).addClass("success"), $("#" + e.id).find(".state").text(t.data), $("#" + e.id).find(".remove").removeClass("icon-remove").addClass("icon-ok").addClass("open").removeClass("remove")) : ($("#" + e.id).addClass("error").find(".state").addClass("error"), $("#" + e.id).find(".state").text(t.data).attr("title", t.data)), uploader.removeFile(e), $("#" + e.id).find(".progress").fadeOut(), !e.fullPath) {
                    var i = r;
                    ui.f5_callback(function() {
                        ui.path.setSelectByFilename(i)
                    })
                }
            }).on("uploadError",
            function(e, a) {
                n++,
                $("#" + e.id).find(".progress").fadeOut(),
                $("#" + e.id).addClass("error").find(".state").addClass("error"),
                $("#" + e.id).find(".state").text(LNG.upload_error + "(" + a + ")")
            }).on("uploadFinished",
            function() {
                $(".dialog_file_upload .aui_title").text(LNG.upload_success + ": " + n + "/" + i),
                i = 0,
                n = 0,
                uploader.reset(),
                "explorer" == Config.pageApp && ui.tree.checkIfChange(G.this_path);
                var e = r;
                ui.f5_callback(function() {
                    ui.path.setSelectByFilename(e),
                    r = []
                })
            }).on("error",
            function(e) {
                core.tips.tips(e, !1)
            });
            var l;
            inState = !1,
            dragOver = function() {
                0 == inState && (inState = !0, MaskView.tips(LNG.upload_drag_tips)),
                l && window.clearTimeout(l)
            },
            dragLeave = function(e) {
                stopPP(e),
                l && window.clearTimeout(l),
                l = window.setTimeout(function() {
                    inState = !1,
                    MaskView.close()
                },
                100)
            },
            dragDrop = function(e) {
                try {
                    if (e = e.originalEvent || e, core.upload_check()) {
                        var a = e.dataTransfer.getData("text/plain");
                        a && "http" == a.substring(0, 4) ? ui.pathOperate.appAddURL(a) : core.upload()
                    }
                    stopPP(e)
                } catch(e) {}
                inState && (inState = !1, MaskView.close())
            }
        }
    }
}),
define("app/tpl/copyright.html", [], '<div class="copyright_dialog_content">\n	<div class="title">\n		<div class="logo"><i class="icon-cloud"></i>KodExplorer v{{G.version}}</div>\n		<div class=\'info\'>����{{LNG.secros_name_copyright}}</div>\n	</div>\n	<div class="content">\n		<p>{{#LNG.copyright_desc}}</p>\n		<div>{{#LNG.copyright_contact}}</div>\n		<div>{{#LNG.copyright_info}}</div> \n	</div>\n</div>'),
define("app/tpl/search.html", [], "<div class='do_search'>\n    <div class='search_header'>\n       <div class='s_br'>\n            <input type='text' id='search_value' value='{{search}}'/><a class='right button icon-search'></a>\n            <div style='float:right'>{{LNG.path}}:<input type='text' id='search_path' value='{{path}}'/></div>\n        </div>\n       <div class='s_br'>\n            <input type='checkbox' id='search_is_case' {{if is_case}}checked='true'{{/if}}/>\n            <label for='search_is_case'>{{LNG.search_uplow}}</label>\n            <input type='checkbox' id='search_is_content' {{if is_content}}checked='true'{{/if}}/>\n            <label for='search_is_content'>{{LNG.search_content}}</label>\n            <div style='float:right'>{{LNG.file_type}}:<input type='text' id='search_ext' value='{{ext}}' title='{{LNG.search_ext_tips}}'/></div>\n        </div>\n    </div>\n    <div class='search_result'>\n        <table border='0' cellspacing='0' cellpadding='0'>\n            <tr class='search_title'>\n               <td class='name'>{{LNG.name}}</td>\n               <td class='type'>{{LNG.type}}</td>\n               <td class='size'>{{LNG.size}}</td>\n               <td class='path'>{{LNG.path}}</td>\n            </tr>\n            <tr class='message'><td colspan='4'></td></tr>\n        </table>\n    </div>\n</div>\n\n"),
define("app/tpl/search_list.html", [], "{{each folderlist as v i}}\n    <tr class='list folder' data-path='{{v.path}}{{v.name}}' data-type='folder' data-size='0'>\n        <td class='name'><a href='javascript:void(0);' title='{{LNG.open}}{{v.name}}'>{{v.name}}</a></td>\n        <td class='type'>{{LNG.folder}}</td>\n        <td class='size'>0</td>\n        <td class='path'><a href='javascript:void(0);' title='{{LNG.goto}}{{v.path}}'>{{v.path}}</a></td>\n    </tr>\n{{/each}}\n{{each filelist as v i}}\n<tr class='list file'\n    data-path='{{v.path}}{{v.name}}' \n    data-type='{{v.ext}}' \n    data-size='{{v.size}}'>\n    <td class='name'><a href='javascript:void(0);' title='{{LNG.open}}{{v.name}}'>{{v.name}}</a></td>\n    <td class='type'>{{v.ext}}</td>\n    <td class='size'>{{v.size_friendly}}</td>\n    <td class='path'><a href='javascript:void(0);' title='{{LNG.goto}}{{v.path}}'>{{v.path}}</a></td>\n</tr>\n{{/each}}"),
define("app/tpl/upload.html", [], "<div class='file_upload'>\n    <div class='top_nav'>\n       <a href='javascript:void(0);' class='menu this tab_upload'>{{LNG.upload_local}}</a>\n       <a href='javascript:void(0);' class='menu tab_download''>{{LNG.download_from_server}}</a>\n       <div style='clear:both'></div>\n    </div>\n    <div class='upload_box'>\n        <div class='btns'>\n            <div id='picker'>{{LNG.upload_select}}</div>\n            <div class=\"upload_box_tips\">\n            <a href=\"javascript:void(0);\" class=\"upload_box_clear\">{{LNG.upload_clear}}</a> \n            <!-- \n            | <a href=\"javascript:void(0);\" class=\"upload_box_setting\">\n            {{LNG.upload_setting}}<b class=\"caret\"></b></a> \n            -->\n            </div>\n            <div style='clear:both'></div>\n        </div>\n\n        <div class=\"upload_box_config hidden\">\n            <i>{{LNG.upload_tips}}</i>\n            <div class=\"upload_check_box\">\n                <b>{{LNG.upload_exist}}</b>\n                <label><input type=\"radio\" name=\"existing\" value=\"rename\" checked=\"checked\">{{LNG.upload_exist_rename}}</label>\n                <label><input type=\"radio\" name=\"existing\" value=\"replace\">{{LNG.upload_exist_replace}}</label>\n                <label><input type=\"radio\" name=\"existing\" value=\"skip\">{{LNG.upload_exist_skip}}</label>\n            </div>\n        </div>\n        <div id='uploader' class='wu-example'>\n            <div id='thelist' class='uploader-list'></div>\n        </div>\n    </div>\n    <div class='download_box hidden'>\n        <div class='list'>{{LNG.download_address}}<input type='text' name='url'/>\n        <button class='btn btn-default btn-sm' type='button'>{{LNG.download}}</button>\n        </div>\n        <div style='clear:both'></div>\n        <div id='downloader'>\n            <div id='download_list' class='uploader-list'></div>\n        </div>\n    </div>\n</div>"),
define("app/src/log/httplog", [],
function() {
    var datestart="";
    var dateend="";
    var username="";
    var filename="";
    var fdirect="";
    var action="";

    var e, t = "index.php?httplog/", 
    a = "", 
    i = {}, 
    n = function() {
     var z="get&datestart="+datestart+"&dateend="+dateend+"&username="+username+"&filename="+filename+"&fdirect="+fdirect+"&action="+action;
      
        $.ajax({
            url: t + z + "&direct=init",
            dataType: "json",
            async: !1,
            success: function(t) {
                return t.code ? (e = t.data, b(t.info),
                o(),i = t.data,
                void 0) : (tips(t),
                void 0)
            },
            error: function() {
                return !1
            }
        })
    }
    ,
    b = function(i) {
    	$(".web label#count").html(i.count);
    	$(".web label#fnum").html(i.fnum);
        $(".web label#lnum").html(i.lnum);
    }
    ,
    s = function(t, h, j, k, m, s, n, b) {
        void 0 == t && (t = ""),
        void 0 == h && (h = ""),
        void 0 == j && (j = ""),
        void 0 == k && (k = ""),
        void 0 == m && (m = ""),
        void 0 == s && (s = "");
        void 0 == n && (n = "");
        void 0 == b && (b = "");
        var o = "<tr>" + "<td>" + t + "</td>" + "<td>" + h + "</td>" + "<td>" + j + "</td>" + "<td>" + k + "</td>" + "<td>" + m + "</td>" + "<td>" + s + "</td>" +  "<td>" + n + "</td>" +  "<td>" + b + "</td>" + "</tr>";
        return o
    }
    , 
    o = function() {

				var t =  "<tr class='title'><td width='5%'>" + LNG.log_id + "</td>" + "<td width='17%'>" + LNG.log_time + "</td>" + "<td width='10%'>" + LNG.log_username + "</td>" + "<td width='12%'>" + LNG.log_clientip + "</td>" + "<td width='30%'>" + LNG.log_filename + "</td>" + "<td width='10%'>" + LNG.log_direct + "</td>" + "<td width='10%'>" + LNG.log_action + "</td>" + "<td width='20%'>" + LNG.log_desc + "</td>" + "</tr>"
          ;
        for (var o in e)
            t += s(e[o].id, e[o].datetime, e[o].username, e[o].clientip, e[o].filename, e[o].direct, e[o].action, e[o].desc);
        $(".web table#list").html(t)
    }
      , 
    l = function(e) {
        $(".nav .this").removeClass("this"),
        e.addClass("this");
        var t = e.attr("data-page");
        $(".section").addClass("hidden"),
        $("." + t).removeClass("hidden")
    }
    ,
    f = function() {
    	$.dialog({
            fixed: !0,
            icon: "question",
            drag: !0,
            title: LNG.warning,
            content: LNG.if_remove + LNG.log_all + LNG.log_type_web + "?" +"<br/>",
            ok: function() {
                $.ajax({
			            url: t + "clean",
			            dataType: "json",
			            async: !1,
			            success: function(t) {
			                return t.code ? (e = t.data, b(t.info),
			                o(),i = t.data,
			                void 0) : (tips(t),
			                void 0)
			            },
			            error: function() {
			                return !1
			            }
			        })
            },
            cancel: !0
        })
   	}
   	,
   	a = function() {
        document.location.href = t + "export";
    }
   	, 
   	c = function() {
   		var fnum = $(".web label#fnum").html();
        var lnum = $(".web label#lnum").html();

        var z="&datestart="+datestart+"&dateend="+dateend+"&username="+username+"&filename="+filename+"&fdirect="+fdirect+"&action="+action;
           var r = "get&fnum=" + fnum + "&lnum=" + lnum + z +"&direct=prev";
   		$.ajax({
            url: t + r,
            dataType: "json",
            async: !1,
            success: function(t) {
                return t.code ? (e = t.data, b(t.info),
                o(),i = t.data,
                void 0) : (tips(t),
                void 0)
            },
            error: function() {
                return !1
            }
        })
   	}
   	, 
   	h = function() {
   		var fnum = $(".web label#fnum").html();
        var lnum = $(".web label#lnum").html();

        var z="&datestart="+datestart+"&dateend="+dateend+"&username="+username+"&filename="+filename+"&fdirect="+fdirect+"&action="+action;
        var r = "get&fnum=" + fnum + "&lnum=" + lnum + z + "&direct=next";
        
   		$.ajax({
            url: t + r ,
            dataType: "json",
            async: !1,
            success: function(t) {
                return t.code ? (e = t.data, b(t.info),
                o(),i = t.data,
                void 0) : (tips(t),
                void 0)
            },
            error: function() {
                return !1
            }
        })
   	}
   	, 
    m = function() {
        $(".web button#log_filter").live("click", filter),
    	$(".web button#log_clean").live("click", f),
    	$(".web button#log_fresh").live("click", n),
    	$(".web button#log_first").live("click", n),
    	$(".web button#log_prev").live("click", c),
    	$(".web button#log_next").live("click", h),
    	$(".web button#log_last").live("click", d),
    	$(".web button#log_download").live("click", a),
    	$(".nav a").live("click", function() {
            l($(this))
        })
    }
    , 
    filter=function(){
//弹窗内容
var content ='<div class=fliterdiog> <div class="f_row"> <div class="fd_title">时间</div> <input type="datetime-local" id="fd_filterdatestart" value=""> <div style="margin-left:5px;margin-right:5px;">至</div> <input type="datetime-local" id="fd_filterdateend" value=""> </div> <div class="f_row"> <div class="fd_title">用户名</div> <input type="text" id="fd_username"> </div> <div class="f_row"> <div class="fd_title">文件名</div> <input type="text" id="fd_filename"> </div> <div class="f_row"> <div class="fd_title">传输方向</div> <select id="fd_direct"><option> </option> <option>上传</option> <option>下载</option> </select> </div> <div class="f_row"> <div class="fd_title">处理方式</div> <select id="fd_action"><option> </option> <option>通过</option> <option>阻止</option><option>删除</option><option>隔离</option> </select> </div> </div>';
//时间拼接
var getaa=function(s) {
    return s < 10 ? '0' + s: s;
}
//时间拼接
var nowtimepick=function(obj){
    var datefff=document.getElementById(obj);
    var myDate = new Date();
    var time=myDate.toLocaleDateString(); 
    var h=myDate.getHours();      
    var m=myDate.getMinutes();    
    var s=myDate.getSeconds(); 
    
    
    var x=time.split('/');
    if(x[1]<10){
        x[1]='0'+x[1];
    }
    if(x[2]<10){
        
        x[2]='0'+x[2];
    }
   time=x.join('-');
  time=time + "T" +getaa(h)+':'+getaa(m)+":"+getaa(s);

datefff.value=time;
};

        $.dialog({
            fixed: !0,
            icon: '',
            drag: !0,
            title: '查询',
            content: content,
            ok: function() {
                datestart=document.getElementById("fd_filterdatestart").value;
                dateend=document.getElementById("fd_filterdateend").value;
                username=document.getElementById("fd_username").value;
                filename=document.getElementById("fd_filename").value;
                fdirect=document.getElementById("fd_direct").value;
                action=document.getElementById("fd_action").value;

        var fnum = $(".web label#fnum").html();
        var lnum = $(".web label#lnum").html();
var z="&datestart="+datestart+"&dateend="+dateend+"&username="+username+"&filename="+filename+"&fdirect="+fdirect+"&action="+action;
            var r = "get&fnum=" + fnum + "&lnum=" + lnum + z + "&direct=init";
                $.ajax({
                 url: t + r,
                 dataType: "json",
                 async: !1,
                 success: function(t) {
                 
                     return t.code ? (e = t.data, b(t.info),
                     o(),i = t.data,
                     void 0) : (tips(t),
                     void 0)
                 },
                 error: function() {
                     return !1
                 }
             })
          
            },
            cancel: !0
        })
datestart=document.getElementById("fd_filterdatestart").value;
dateend=document.getElementById("fd_filterdateend").value;
if(datestart==''){
    nowtimepick('fd_filterdatestart');
}
if(dateend==''){
    nowtimepick('fd_filterdateend');
}
    }
    ,
    d = function() {
       var z="get&datestart="+datestart+"&dateend="+dateend+"&username="+username+"&filename="+filename+"&fdirect="+fdirect+"&action="+action;
       $.ajax({
            url: t + z + "&direct=last",
            dataType: "json",
            async: !1,
            success: function(t) {
                return t.code ? (e = t.data, b(t.info),
                o(),i = t.data,
                void 0) : (tips(t),
                void 0)
            },
            error: function() {
                return !1
            }
        })
    }
    ;
    return {
        init: n,
        bindEvent: m
    }
}),
define("app/src/log/ftplog", [],
function() {
    var datestart="";
    var dateend="";
    var username="";
    var filename="";
    var fdirect="";
    var action="";

    var e, t = "index.php?ftplog/", 
    a = "", 
    i = {}, 
    n = function() {
        var z="get&datestart="+datestart+"&dateend="+dateend+"&username="+username+"&filename="+filename+"&fdirect="+fdirect+"&action="+action;
     
        $.ajax({
            url: t + z + "&direct=init",
            dataType: "json",
            async: !1,
            success: function(t) {
                return t.code ? (e = t.data, b(t.info),
                o(),i = t.data,
                void 0) : (tips(t),
                void 0)
            },
            error: function() {
                return !1
            }
        })
    }
    ,
    b = function(i) {
    	$(".ftp label#count").html(i.count);
    	$(".ftp label#fnum").html(i.fnum);
    	$(".ftp label#lnum").html(i.lnum);
    }
    ,
    s = function(t, h, j, k, m, s, n, b) {
        void 0 == t && (t = ""),
        void 0 == h && (h = ""),
        void 0 == j && (j = ""),
        void 0 == k && (k = ""),
        void 0 == m && (m = ""),
        void 0 == s && (s = "");
        void 0 == n && (n = "");
        void 0 == b && (b = "");
        var o = "<tr>" + "<td>" + t + "</td>" + "<td>" + h + "</td>" + "<td>" + j + "</td>" + "<td>" + k + "</td>" + "<td>" + m + "</td>" +  "<td>" + s + "</td>" +  "<td>" + n + "</td>" +  "<td>" + b + "</td>" + "</tr>";
        return o
    }
    , 
    o = function() {

				var t =  "<tr class='title'><td width='5%'>" + LNG.log_id + "</td>" + "<td width='17%'>" + LNG.log_time + "</td>" + "<td width='10%'>" + LNG.log_username + "</td>" + "<td width='12%'>" + LNG.log_clientip + "</td>" + "<td width='30%'>" + LNG.log_filename + "</td>" + "<td width='10%'>" + LNG.log_direct + "</td>" + "<td width='10%'>" + LNG.log_action + "</td>" + "<td width='20%'>" + LNG.log_desc + "</td>" + "</tr>"
          ;
        for (var o in e)
            t += s(e[o].id, e[o].datetime, e[o].username, e[o].clientip, e[o].filename, e[o].direct, e[o].action, e[o].desc);
        $(".ftp table#list").html(t)
    }
      , 
    l = function(e) {
        $(".nav .this").removeClass("this"),
        e.addClass("this");
        var t = e.attr("data-page");
        $(".section").addClass("hidden"),
        $("." + t).removeClass("hidden")
    }
    ,
    f = function() {
    	$.dialog({
            fixed: !0,
            icon: "question",
            drag: !0,
            title: LNG.warning,
            content: LNG.if_remove + LNG.log_all + LNG.log_type_ftp + "?" +"<br/>",
            ok: function() {
                $.ajax({
			            url: t + "clean",
			            dataType: "json",
			            async: !1,
			            success: function(t) {
			                return t.code ? (e = t.data, b(t.info),
			                o(),i = t.data,
			                void 0) : (tips(t),
			                void 0)
			            },
			            error: function() {
			                return !1
			            }
			        })
            },
            cancel: !0
        })
   	}
   	,
   	a = function() {
        document.location.href = t + "export";
    }
   	, 
   	c = function() {
   		var fnum = $(".ftp label#fnum").html();
           var lnum = $(".ftp label#lnum").html();
    var z="&datestart="+datestart+"&dateend="+dateend+"&username="+username+"&filename="+filename+"&fdirect="+fdirect+"&action="+action;
   		var r = "get&fnum=" + fnum + "&lnum=" + lnum + z + "&direct=prev";
   		$.ajax({
            url: t + r,
            dataType: "json",
            async: !1,
            success: function(t) {
                return t.code ? (e = t.data, b(t.info),
                o(),i = t.data,
                void 0) : (tips(t),
                void 0)
            },
            error: function() {
                return !1
            }
        })
   	}
   	, 
   	h = function() {
   		var fnum = $(".ftp label#fnum").html();
           var lnum = $(".ftp label#lnum").html();
           var z="&datestart="+datestart+"&dateend="+dateend+"&username="+username+"&filename="+filename+"&fdirect="+fdirect+"&action="+action;
   		var r = "get&fnum=" + fnum + "&lnum=" + lnum + z + "&direct=next";
   		$.ajax({
            url: t + r,
            dataType: "json",
            async: !1,
            success: function(t) {
                return t.code ? (e = t.data, b(t.info),
                o(),i = t.data,
                void 0) : (tips(t),
                void 0)
            },
            error: function() {
                return !1
            }
        })
   	}
   	, 
    m = function() {
        $(".ftp button#log_filter").live("click", filter),
    	$(".ftp button#log_clean").live("click", f),
    	$(".ftp button#log_fresh").live("click", n),
    	$(".ftp button#log_first").live("click", n),
    	$(".ftp button#log_prev").live("click", c),
    	$(".ftp button#log_next").live("click", h),
    	$(".ftp button#log_last").live("click", d),
    	$(".ftp button#log_download").live("click", a),
    	$(".nav a").live("click", function() {
            l($(this))
        })
    },
    filter=function(){
        //弹窗内容
        var content ='<div class=fliterdiog> <div class="f_row"> <div class="fd_title">时间</div> <input type="datetime-local" id="fd_filterdatestart" value=""> <div style="margin-left:5px;margin-right:5px;">至</div> <input type="datetime-local" id="fd_filterdateend" value=""> </div> <div class="f_row"> <div class="fd_title">用户名</div> <input type="text" id="fd_username"> </div> <div class="f_row"> <div class="fd_title">文件名</div> <input type="text" id="fd_filename"> </div> <div class="f_row"> <div class="fd_title">传输方向</div> <select id="fd_direct"><option> </option> <option>上传</option> <option>下载</option> </select> </div> <div class="f_row"> <div class="fd_title">处理方式</div> <select id="fd_action"><option> </option> <option>通过</option> <option>阻止</option><option>删除</option><option>隔离</option> </select> </div> </div>';
        //时间拼接
        var getaa=function(s) {
            return s < 10 ? '0' + s: s;
        }
        //时间拼接
        var nowtimepick=function(obj){
            var datefff=document.getElementById(obj);
            var myDate = new Date();
            var time=myDate.toLocaleDateString(); 
            var h=myDate.getHours();      
            var m=myDate.getMinutes();    
            var s=myDate.getSeconds(); 
            
            
            var x=time.split('/');
            if(x[1]<10){
                x[1]='0'+x[1];
            }
            if(x[2]<10){
                x[2]='0'+x[2];
            }
           time=x.join('-');
          time=time + "T" +getaa(h)+':'+getaa(m)+":"+getaa(s);
          
        datefff.value=time;
        };
        
                $.dialog({
                    fixed: !0,
                    icon: '',
                    drag: !0,
                    title: '查询',
                    content: content,
                    ok: function() {
                        datestart=document.getElementById("fd_filterdatestart").value;
                        dateend=document.getElementById("fd_filterdateend").value;
                        username=document.getElementById("fd_username").value;
                        filename=document.getElementById("fd_filename").value;
                        fdirect=document.getElementById("fd_direct").value;
                        action=document.getElementById("fd_action").value;
        //改参数
                var fnum = $(".ftp label#fnum").html();
                var lnum = $(".ftp label#lnum").html();
        var z="&datestart="+datestart+"&dateend="+dateend+"&username="+username+"&filename="+filename+"&fdirect="+fdirect+"&action="+action;
                    var r = "get&fnum=" + fnum + "&lnum=" + lnum + z + "&direct=init";
                        $.ajax({
                         url: t + r,
                         dataType: "json",
                         async: !1,
                         success: function(t) {
                       
                             return t.code ? (e = t.data, b(t.info),
                             o(),i = t.data,
                             void 0) : (tips(t),
                             void 0)
                         },
                         error: function() {
                             return !1
                         }
                     })
                 
                    },
                    cancel: !0
                })
        datestart=document.getElementById("fd_filterdatestart").value;
        dateend=document.getElementById("fd_filterdateend").value;
        if(datestart==''){
            nowtimepick('fd_filterdatestart');
        }
        if(dateend==''){
            nowtimepick('fd_filterdateend');
        }
            }
    , 
    d = function() {
var z="get&datestart="+datestart+"&dateend="+dateend+"&username="+username+"&filename="+filename+"&fdirect="+fdirect+"&action="+action;
       $.ajax({
            url: t + z + "&direct=last",
            dataType: "json",
            async: !1,
            success: function(t) {
                return t.code ? (e = t.data, b(t.info),
                o(),i = t.data,
                void 0) : (tips(t),
                void 0)
            },
            error: function() {
                return !1
            }
        })
    }
    ;
    return {
        init: n,
        bindEvent: m
    }
}),
define("app/src/log/sambalog", [],
function() {
    var datestart="";
    var dateend="";
    var username="";
    var filename="";
    var fdirect="";
    var action="";

    var e, t = "index.php?sambalog/", 
    a = "", 
    i = {}, 
    n = function() {
        var z="get&datestart="+datestart+"&dateend="+dateend+"&username="+username+"&filename="+filename+"&fdirect="+fdirect+"&action="+action;
     
        $.ajax({
            url: t + z + "&direct=init",
            dataType: "json",
            async: !1,
            success: function(t) {
                return t.code ? (e = t.data, b(t.info),
                o(),i = t.data,
                void 0) : (tips(t),
                void 0)
            },
            error: function() {
                return !1
            }
        })
    }
    ,
    b = function(i) {
    	$(".samba label#count").html(i.count);
    	$(".samba label#fnum").html(i.fnum);
    	$(".samba label#lnum").html(i.lnum);
    }
    ,
    s = function(t, h, j, k, m, s, n, b) {
        void 0 == t && (t = ""),
        void 0 == h && (h = ""),
        void 0 == j && (j = ""),
        void 0 == k && (k = ""),
        void 0 == m && (m = ""),
        void 0 == s && (s = "");
        void 0 == n && (n = "");
        void 0 == b && (b = "");
        var o = "<tr>" + "<td>" + t + "</td>" + "<td>" + h + "</td>" + "<td>" + j + "</td>" + "<td>" + k + "</td>" + "<td>" + m + "</td>" +  "<td>" + s + "</td>" +  "<td>" + n + "</td>" +  "<td>" + b + "</td>" + "</tr>";
        return o
    }
    , 
    o = function() {

				var t =  "<tr class='title'><td width='5%'>" + LNG.log_id + "</td>" + "<td width='17%'>" + LNG.log_time + "</td>" + "<td width='10%'>" + LNG.log_username + "</td>" + "<td width='12%'>" + LNG.log_clientip + "</td>" + "<td width='30%'>" + LNG.log_filename + "</td>" + "<td width='10%'>" + LNG.log_direct + "</td>" + "<td width='10%'>" + LNG.log_action + "</td>" + "<td width='20%'>" + LNG.log_desc + "</td>" + "</tr>"
				;
        for (var o in e)
            t += s(e[o].id, e[o].datetime, e[o].username, e[o].clientip, e[o].filename, e[o].direct, e[o].action, e[o].desc);
        $(".samba table#list").html(t)
    }
      , 
    l = function(e) {
        $(".nav .this").removeClass("this"),
        e.addClass("this");
        var t = e.attr("data-page");
        $(".section").addClass("hidden"),
        $("." + t).removeClass("hidden")
    }
    ,
    f = function() {
    	$.dialog({
            fixed: !0,
            icon: "question",
            drag: !0,
            title: LNG.warning,
            content: LNG.if_remove + LNG.log_all + LNG.log_type_samba + "?" +"<br/>",
            ok: function() {
                $.ajax({
			            url: t + "clean",
			            dataType: "json",
			            async: !1,
			            success: function(t) {
			                return t.code ? (e = t.data, b(t.info),
			                o(),i = t.data,
			                void 0) : (tips(t),
			                void 0)
			            },
			            error: function() {
			                return !1
			            }
			        })
            },
            cancel: !0
        })
   	}
   	,
   	a = function() {
        document.location.href = t + "export";
    }
   	, 
   	c = function() {
   		var fnum = $(".samba label#fnum").html();
        var lnum = $(".samba label#lnum").html();
        var z="&datestart="+datestart+"&dateend="+dateend+"&username="+username+"&filename="+filename+"&fdirect="+fdirect+"&action="+action;
   		var r = "get&fnum=" + fnum + "&lnum=" + lnum + z +"&direct=prev";
   		$.ajax({
            url: t + r,
            dataType: "json",
            async: !1,
            success: function(t) {
                return t.code ? (e = t.data, b(t.info),
                o(),i = t.data,
                void 0) : (tips(t),
                void 0)
            },
            error: function() {
                return !1
            }
        })
   	}
   	, 
   	h = function() {
   		var fnum = $(".samba label#fnum").html();
           var lnum = $(".samba label#lnum").html();
           var z="&datestart="+datestart+"&dateend="+dateend+"&username="+username+"&filename="+filename+"&fdirect="+fdirect+"&action="+action;
   		var r = "get&fnum=" + fnum + "&lnum=" + lnum + z +"&direct=next";
   		$.ajax({
            url: t + r,
            dataType: "json",
            async: !1,
            success: function(t) {
                return t.code ? (e = t.data, b(t.info),
                o(),i = t.data,
                void 0) : (tips(t),
                void 0)
            },
            error: function() {
                return !1
            }
        })
   	}
   	, 
    m = function() {
        $(".samba button#log_filter").live("click", filter),
    	$(".samba button#log_clean").live("click", f),
    	$(".samba button#log_fresh").live("click", n),
    	$(".samba button#log_first").live("click", n),
    	$(".samba button#log_prev").live("click", c),
    	$(".samba button#log_next").live("click", h),
    	$(".samba button#log_last").live("click", d),
    	$(".samba button#log_download").live("click", a),
    	$(".nav a").live("click", function() {
            l($(this))
        })
    },
    filter=function(){
        //弹窗内容
        var content ='<div class=fliterdiog> <div class="f_row"> <div class="fd_title">时间</div> <input type="datetime-local" id="fd_filterdatestart" value=""> <div style="margin-left:5px;margin-right:5px;">至</div> <input type="datetime-local" id="fd_filterdateend" value=""> </div> <div class="f_row"> <div class="fd_title">用户名</div> <input type="text" id="fd_username"> </div> <div class="f_row"> <div class="fd_title">文件名</div> <input type="text" id="fd_filename"> </div> <div class="f_row"> <div class="fd_title">传输方向</div> <select id="fd_direct"><option> </option> <option>上传</option> <option>下载</option> </select> </div> <div class="f_row"> <div class="fd_title">处理方式</div> <select id="fd_action"><option> </option> <option>通过</option> <option>阻止</option><option>删除</option><option>隔离</option> </select> </div> </div>';
        //时间拼接
        var getaa=function(s) {
            return s < 10 ? '0' + s: s;
        }
        //时间拼接
        var nowtimepick=function(obj){
            var datefff=document.getElementById(obj);
            var myDate = new Date();
            var time=myDate.toLocaleDateString(); 
            var h=myDate.getHours();      
            var m=myDate.getMinutes();    
            var s=myDate.getSeconds(); 
            
            
            var x=time.split('/');
            if(x[1]<10){
                x[1]='0'+x[1];
            }
            if(x[2]<10){
                x[2]='0'+x[2];
            }
           time=x.join('-');
          time=time + "T" +getaa(h)+':'+getaa(m)+":"+getaa(s);
           
        datefff.value=time;
        };
        
                $.dialog({
                    fixed: !0,
                    icon: '',
                    drag: !0,
                    title: '查询',
                    content: content,
                    ok: function() {
                        datestart=document.getElementById("fd_filterdatestart").value;
                        dateend=document.getElementById("fd_filterdateend").value;
                        username=document.getElementById("fd_username").value;
                        filename=document.getElementById("fd_filename").value;
                        fdirect=document.getElementById("fd_direct").value;
                        action=document.getElementById("fd_action").value;
        //改参数
                var fnum = $(".samba label#fnum").html();
                var lnum = $(".samba label#lnum").html();
        var z="&datestart="+datestart+"&dateend="+dateend+"&username="+username+"&filename="+filename+"&fdirect="+fdirect+"&action="+action;
                    var r = "get&fnum=" + fnum + "&lnum=" + lnum + z + "&direct=init";
                        $.ajax({
                         url: t + r,
                         dataType: "json",
                         async: !1,
                         success: function(t) {
                           
                             return t.code ? (e = t.data, b(t.info),
                             o(),i = t.data,
                             void 0) : (tips(t),
                             void 0)
                         },
                         error: function() {
                             return !1
                         }
                     })
        
                    },
                    cancel: !0
                })
        datestart=document.getElementById("fd_filterdatestart").value;
        dateend=document.getElementById("fd_filterdateend").value;
        if(datestart==''){
            nowtimepick('fd_filterdatestart');
        }
        if(dateend==''){
            nowtimepick('fd_filterdateend');
        }
            }
    , 
    d = function() {
 var z="get&datestart="+datestart+"&dateend="+dateend+"&username="+username+"&filename="+filename+"&fdirect="+fdirect+"&action="+action;
       $.ajax({
            url: t + z + "&direct=last",
            dataType: "json",
            async: !1,
            success: function(t) {
                return t.code ? (e = t.data, b(t.info),
                o(),i = t.data,
                void 0) : (tips(t),
                void 0)
            },
            error: function() {
                return !1
            }
        })
    }
    ;
    return {
        init: n,
        bindEvent: m
    }
}),
//start
define("app/src/log/auditlog", [],
function() {
    var datestart="";
    var dateend="";
    var username="";
    var filename="";
    var event="";
    var result="";
    var e, t = "index.php?auditlog/", 
    a = "", 
    i = {}, 
    n = function() {
        var z="get&datestart="+datestart+"&dateend="+dateend+"&username="+username+"&event="+event+"&result="+result;
     
        $.ajax({
            url: t + z + "&direct=init",
            dataType: "json",
            async: !1,
            success: function(t) {
                return t.code ? (e = t.data, b(t.info),
                o(),i = t.data,
                void 0) : (tips(t),
                void 0)
            },
            error: function() {
                return !1
            }
        })
    }
    ,
    b = function(i) {
    	$(".audit label#count").html(i.count);
    	$(".audit label#fnum").html(i.fnum);
    	$(".audit label#lnum").html(i.lnum);
    }
    ,
    s = function(t, type,h, j, event, res, desc) {
        void 0 == t && (t = ""),
        void 0 == type && (type = ""),
        void 0 == h && (h = ""),
        void 0 == j && (j = ""),
        void 0 == event && (event = "");
        void 0 == res && (res = "");
        void 0 == desc && (desc = "");
        var o = "<tr>" + "<td>" + t + "</td>" +  "<td>" + type + "</td>" + "<td>" + h + "</td>" + "<td>" + j + "</td>"   +  "<td>" + event + "</td>" +  "<td>" + res + "</td>" +  "<td>" + desc + "</td>" + "</tr>";
        return o
    }
    , 
    o = function() {

				var t =  "<tr class='title'><td width='5%'>" + LNG.log_id + "</td>" + "<td width='17%'>" + '类型' + "</td>" + "<td width='17%'>" + LNG.log_time + "</td>" + "<td width='10%'>" + LNG.log_username + "</td>"  + "<td width='10%'>" + '事件' + "</td>" + "<td width='10%'>" + '结果' + "</td>" + "<td width='20%'>" + LNG.log_desc + "</td>" + "</tr>"
				;
        for (var o in e)
            t += s(e[o].id, e[o].type,e[o].time, e[o].user, e[o].event, e[o].result, e[o].desc);
        $(".audit table#list").html(t)
    }
      , 
    l = function(e) {
        $(".nav .this").removeClass("this"),
        e.addClass("this");
        var t = e.attr("data-page");
        $(".section").addClass("hidden"),
        $("." + t).removeClass("hidden")
    }
    ,
    f = function() {
    	$.dialog({
            fixed: !0,
            icon: "question",
            drag: !0,
            title: LNG.warning,
            content: LNG.if_remove + LNG.log_all + LNG.log_type_audit + "?" +"<br/>",
            ok: function() {
                $.ajax({
			            url: t + "clean",
			            dataType: "json",
			            async: !1,
			            success: function(t) {
			                return t.code ? (e = t.data, b(t.info),
			                o(),i = t.data,
			                void 0) : (tips(t),
			                void 0)
			            },
			            error: function() {
			                return !1
			            }
			        })
            },
            cancel: !0
        })
   	}
   	,
   	a = function() {
        document.location.href = t + "export";
    }
   	, 
   	c = function() {
   		var fnum = $(".audit label#fnum").html();
        var lnum = $(".audit label#lnum").html();
        var z="&datestart="+datestart+"&dateend="+dateend+"&username="+username+"&filename="+filename+"&event="+event+"&result="+result;
   		var r = "get&fnum=" + fnum + "&lnum=" + lnum + z +"&direct=prev";
   		$.ajax({
            url: t + r,
            dataType: "json",
            async: !1,
            success: function(t) {
                return t.code ? (e = t.data, b(t.info),
                o(),i = t.data,
                void 0) : (tips(t),
                void 0)
            },
            error: function() {
                return !1
            }
        })
   	}
   	, 
   	h = function() {
   		var fnum = $(".audit label#fnum").html();
           var lnum = $(".audit label#lnum").html();
           var z="&datestart="+datestart+"&dateend="+dateend+"&username="+username+"&filename="+filename+"&event="+event+"&result="+result;
   		var r = "get&fnum=" + fnum + "&lnum=" + lnum + z +"&direct=next";
   		$.ajax({
            url: t + r,
            dataType: "json",
            async: !1,
            success: function(t) {
                return t.code ? (e = t.data, b(t.info),
                o(),i = t.data,
                void 0) : (tips(t),
                void 0)
            },
            error: function() {
                return !1
            }
        })
   	}
   	, 
    m = function() {
        $(".audit button#log_filter").live("click", filter),
    	$(".audit button#log_clean").live("click", f),
    	$(".audit button#log_fresh").live("click", n),
    	$(".audit button#log_first").live("click", n),
    	$(".audit button#log_prev").live("click", c),
    	$(".audit button#log_next").live("click", h),
    	$(".audit button#log_last").live("click", d),
    	$(".audit button#log_download").live("click", a),
    	$(".nav a").live("click", function() {
            l($(this))
        })
    },
    filter=function(){
        //弹窗内容
        var content ='<div class=fliterdiog> <div class="f_row"> <div class="fd_title">时间</div> <input type="datetime-local" id="fd_filterdatestart" value=""> <div style="margin-left:5px;margin-right:5px;">至</div> <input type="datetime-local" id="fd_filterdateend" value=""> </div> <div class="f_row"><div class="fd_title">用户名</div> <input type="text" id="fd_username"> </div><div class="f_row"> <div class="fd_title">类型</div> <select id="fd_type"><option> </option> <option>信息</option> <option>警告</option> </select> </div><div class="f_row"> <div class="fd_title">事件</div> <input type="text" id="fd_event"></div> <div class="f_row"> <div class="fd_title">结果</div> <input type="text" id="fd_result"> </div></div>';
        //时间拼接
        var getaa=function(s) {
            return s < 10 ? '0' + s: s;
        }
        //时间拼接
        var nowtimepick=function(obj){
            var datefff=document.getElementById(obj);
            var myDate = new Date();
            var time=myDate.toLocaleDateString(); 
            var h=myDate.getHours();      
            var m=myDate.getMinutes();    
            var s=myDate.getSeconds(); 
            
            
            var x=time.split('/');
            if(x[1]<10){
                x[1]='0'+x[1];
            }
            if(x[2]<10){
                x[2]='0'+x[2];
            }
           time=x.join('-');
          time=time + "T" +getaa(h)+':'+getaa(m)+":"+getaa(s);
           
        datefff.value=time;
        };
        
                $.dialog({
                    fixed: !0,
                    icon: '',
                    drag: !0,
                    title: '查询',
                    content: content,
                    ok: function() {
                        datestart=document.getElementById("fd_filterdatestart").value;
                        dateend=document.getElementById("fd_filterdateend").value;
                        username=document.getElementById("fd_username").value;
                        type=document.getElementById("fd_type").value;
                        event=document.getElementById("fd_event").value;
                        result=document.getElementById("fd_result").value;
        //改参数
                var fnum = $(".audit label#fnum").html();
                var lnum = $(".audit label#lnum").html();
        var z="&datestart="+datestart+"&dateend="+dateend+"&username="+username+"&event="+event+"&result="+result + "&type="+type;
                    var r = "get&fnum=" + fnum + "&lnum=" + lnum + z + "&direct=init";
                        $.ajax({
                         url: t + r,
                         dataType: "json",
                         async: !1,
                         success: function(t) {
                           
                             return t.code ? (e = t.data, b(t.info),
                             o(),i = t.data,
                             void 0) : (tips(t),
                             void 0)
                         },
                         error: function() {
                             return !1
                         }
                     })
        
                    },
                    cancel: !0
                })
        datestart=document.getElementById("fd_filterdatestart").value;
        dateend=document.getElementById("fd_filterdateend").value;
        if(datestart==''){
            nowtimepick('fd_filterdatestart');
        }
        if(dateend==''){
            nowtimepick('fd_filterdateend');
        }
            }
    , 
    d = function() {
 var z="get&datestart="+datestart+"&dateend="+dateend+"&username="+username+"&filename="+filename+"&event="+event+"&result="+result;
       $.ajax({
            url: t + z + "&direct=last",
            dataType: "json",
            async: !1,
            success: function(t) {
                return t.code ? (e = t.data, b(t.info),
                o(),i = t.data,
                void 0) : (tips(t),
                void 0)
            },
            error: function() {
                return !1
            }
        })
    }
    ;
    return {
        init: n,
        bindEvent: m
    }
}),
//edn
define("app/src/log/avlog", [],
function() {
    var datestart="";
    var dateend="";
    var virusname="";
    // var username="";
    var filename="";
    var action="";

    var e, t = "index.php?avlog/", 
    a = "", 
    i = {}, 
    n = function() {
var z="get&datestart="+datestart+"&dateend="+dateend+"&virusname="+virusname+"&filename="+filename+"&action="+action;
        $.ajax({
            url: t + z +"&direct=init",
            dataType: "json",
            async: !1,
            success: function(t) {
                return t.code ? (e = t.data, b(t.info),
                o(),i = t.data,
                void 0) : (tips(t),
                void 0)
            },
            error: function() {
                return !1
            }
        })
    }
    ,
    b = function(i) {
    	$(".antivirus label#count").html(i.count);
    	$(".antivirus label#fnum").html(i.fnum);
    	$(".antivirus label#lnum").html(i.lnum);
    }
    ,
    s = function(t, h, j, k, m) {
        void 0 == t && (t = ""),
        void 0 == h && (h = ""),
        void 0 == j && (j = ""),
        void 0 == k && (k = ""),
        void 0 == m && (m = "");
        var o = "<tr>" + "<td>" + t + "</td>" + "<td>" + h + "</td>" + "<td>" + j + "</td>" + "<td>" + k + "</td>" + "<td>" + m + "</td>" + "</tr>";
        return o
    }
    , 
    o = function() {

				var t =  "<tr class='title'><td width='5%'>" + LNG.log_id + "</td>" + "<td width='17%'>" + LNG.log_time + "</td>" + "<td width='30%'>" + LNG.log_filename + "</td>" + "<td width='30%'>" + LNG.log_virusname + "</td>" + "<td width='20%'>" + LNG.log_action + "</td>" + "</tr>"
				;
        for (var o in e)
            t += s(e[o].id, e[o].datetime, e[o].filename, e[o].virusname, e[o].action, e[o].desc);
        $(".antivirus table#list").html(t)
    }
      , 
    l = function(e) {
        $(".nav .this").removeClass("this"),
        e.addClass("this");
        var t = e.attr("data-page");
        $(".section").addClass("hidden"),
        $("." + t).removeClass("hidden")
    }
    ,
    f = function() {
    	$.dialog({
            fixed: !0,
            icon: "question",
            drag: !0,
            title: LNG.warning,
            content: LNG.if_remove + LNG.log_all + LNG.log_type_virus + "?" +"<br/>",
            ok: function() {
                $.ajax({
			            url: t + "clean",
			            dataType: "json",
			            async: !1,
			            success: function(t) {
			                return t.code ? (e = t.data, b(t.info),
			                o(),i = t.data,
			                void 0) : (tips(t),
			                void 0)
			            },
			            error: function() {
			                return !1
			            }
			        })
            },
            cancel: !0
        })
   	}
   	,
   	a = function() {
        document.location.href = t + "export";
    }
   	, 
   	c = function() {
   		var fnum = $(".antivirus label#fnum").html();
        var lnum = $(".antivirus label#lnum").html();
        var z="&datestart="+datestart+"&dateend="+dateend+"&virusname="+virusname+"&filename="+filename+"&action="+action;
   		var r = "get&fnum=" + fnum + "&lnum=" + lnum + z +"&direct=prev";
   		$.ajax({
            url: t + r,
            dataType: "json",
            async: !1,
            success: function(t) {
                return t.code ? (e = t.data, b(t.info),
                o(),i = t.data,
                void 0) : (tips(t),
                void 0)
            },
            error: function() {
                return !1
            }
        })
   	}
   	, 
   	h = function() {
   		var fnum = $(".antivirus label#fnum").html();
        var lnum = $(".antivirus label#lnum").html();
        var z="&datestart="+datestart+"&dateend="+dateend+"&virusname="+virusname+"&filename="+filename+"&action="+action;
   		var r = "get&fnum=" + fnum + "&lnum=" + lnum + z +"&direct=next";
   		$.ajax({
            url: t + r,
            dataType: "json",
            async: !1,
            success: function(t) {
                return t.code ? (e = t.data, b(t.info),
                o(),i = t.data,
                void 0) : (tips(t),
                void 0)
            },
            error: function() {
                return !1
            }
        })
   	}
   	, 
    m = function() {
        $(".antivirus button#log_filter").live("click", filter),
    	$(".antivirus button#log_clean").live("click", f),
    	$(".antivirus button#log_fresh").live("click", n),
    	$(".antivirus button#log_first").live("click", n),
    	$(".antivirus button#log_prev").live("click", c),
    	$(".antivirus button#log_next").live("click", h),
    	$(".antivirus button#log_last").live("click", d),
    	$(".antivirus button#log_download").live("click", a),
    	$(".nav a").live("click", function() {
            l($(this))
        })
    },
    filter=function(){
        //弹窗内容
        var content ='<div class=fliterdiog> <div class="f_row"> <div class="fd_title">时间</div> <input type="datetime-local" id="fd_filterdatestart" value=""> <div style="margin-left:5px;margin-right:5px;">至</div> <input type="datetime-local" id="fd_filterdateend" value=""> </div> <div class="f_row"> <div class="fd_title">病毒名称</div> <input type="text" id="fd_virusname"> </div> <div class="f_row"> <div class="fd_title">文件名</div> <input type="text" id="fd_filename"> </div>  <div class="f_row"> <div class="fd_title">处理方式</div> <select id="fd_action"><option> </option><option>危险警告</option> <option>删除文件</option>  <option>隔离文件</option></select> </div> </div>';
        //时间拼接
        var getaa=function(s) {
            return s < 10 ? '0' + s: s;
        }
        //时间拼接
        var nowtimepick=function(obj){
            var datefff=document.getElementById(obj);
            var myDate = new Date();
            var time=myDate.toLocaleDateString(); 
            var h=myDate.getHours();      
            var m=myDate.getMinutes();    
            var s=myDate.getSeconds(); 
            
            
            var x=time.split('/');
            if(x[1]<10){
                x[1]='0'+x[1];
            }
            if(x[2]<10){
                x[2]='0'+x[2];
            }
           time=x.join('-');
          time=time + "T" +getaa(h)+':'+getaa(m)+":"+getaa(s);
       
        datefff.value=time;
        };
        
                $.dialog({
                    fixed: !0,
                    icon: '',
                    drag: !0,
                    title: '查询',
                    content: content,
                    ok: function() {
                        datestart=document.getElementById("fd_filterdatestart").value;
                        dateend=document.getElementById("fd_filterdateend").value;
                        virusname=document.getElementById("fd_virusname").value;
                        filename=document.getElementById("fd_filename").value;
                        action=document.getElementById("fd_action").value;
    
                var fnum = $(".antivirus label#fnum").html();
                var lnum = $(".antivirus label#lnum").html();
        var z="&datestart="+datestart+"&dateend="+dateend+"&virusname="+virusname+"&filename="+filename+"&action="+action;
                    var r = "get&fnum=" + fnum + "&lnum=" + lnum + z + "&direct=init";
                        $.ajax({
                         url: t + r,
                         dataType: "json",
                         async: !1,
                         success: function(t) {
                            
                             return t.code ? (e = t.data, b(t.info),
                             o(),i = t.data,
                             void 0) : (tips(t),
                             void 0)
                         },
                         error: function() {
                             return !1
                         }
                     })
                  
                    },
                    cancel: !0
                })
        datestart=document.getElementById("fd_filterdatestart").value;
        dateend=document.getElementById("fd_filterdateend").value;
        if(datestart==''){
            nowtimepick('fd_filterdatestart');
        }
        if(dateend==''){
            nowtimepick('fd_filterdateend');
        }
            }
    , 
    d = function() {
        var z="get&datestart="+datestart+"&dateend="+dateend+"&virusname="+virusname+"&filename="+filename+"&action="+action;
  
       $.ajax({
            url: t + z + "&direct=last",
            dataType: "json",
            async: !1,
            success: function(t) {
                return t.code ? (e = t.data, b(t.info),
                o(),i = t.data,
                void 0) : (tips(t),
                void 0)
            },
            error: function() {
                return !1
            }
        })
    }
    ;
    return {
        init: n,
        bindEvent: m
    }
});
