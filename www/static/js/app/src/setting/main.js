define("app/src/setting/main", ["lib/jquery-lib", "lib/util", "lib/artDialog/jquery-artDialog", "../../common/core", "../../tpl/copyright.html", "../../tpl/search.html", "../../tpl/search_list.html", "../../tpl/upload.html", "./setting", "./fav", "./group", "./member", "./antivirus", "./file","./system","./usblist"], function(e) {
    e("lib/jquery-lib"),
    e("lib/util"),
    e("lib/artDialog/jquery-artDialog"),
    core = e("../../common/core"),
    Setting = e("./setting"),
    Fav = e("./fav"),
    Group = e("./group"),
    Member = e("./member"),
    Filetype = e("./file"),
    Usblist = e("./usblist"),
    System = e("./system"),
    Antivirus = e("./antivirus"),
    Setting.init(),
    Fav.bindEvent(),
    Member.bindEvent(),
    Filetype.bindEvent(),
    Usblist.bindEvent(),
    Group.bindEvent(),
    Antivirus.bindEvent(),
    System.bindEvent()
}),
define("app/common/core", [], function(require, exports) {
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
            var t = G.static_path + "images/file_16/"
              , 
            a = ["folder", "file", "edit", "search", "up", "setting", "appStore", "error", "info", "mp3", "flv", "pdf", "doc", "xls", "ppt", "html", "swf"]
              , 
            i = $.inArray(e, a);
            return -1 == i ? t + "file.png" : t + e + ".png"
        },
        contextmenu: function(e) {
            try {
                rightMenu.hidden()
            } catch (t) {}
            var t = e || window.event;
            return t ? t && $(t.target).is("textarea") || $(t.target).is("input") || 0 != $(t.target).parents(".topbar").length || 0 != $(t.target).parents(".edit_body").length || 0 != $(t.target).parents(".aui_state_focus").length ? !0 : !1 : !0
        },
        pathThis: function(e) {
            e = e.replace(/\\/g, "/");
            var t = e.split("/")
              , 
            a = t[t.length - 1];
            if ("" == a && (a = t[t.length - 2]),
            0 == a.search("fileProxy")) {
                a = urlDecode(a.substr(a.search("&path=")));
                var t = a.split("/");
                a = t[t.length - 1],
                "" == a && (a = t[t.length - 2])
            }
            return a
        },
        pathFather: function(e) {
            e = e.replace(/\\/g, "/");
            var t = e.lastIndexOf("/");
            return e.substr(0, t + 1)
        },
        pathExt: function(e) {
            e = e.replace(/\\/g, "/"),
            e = e.replace(/\/+/g, "/");
            var t = e.lastIndexOf(".");
            return e = e.substr(t + 1),
            e.toLowerCase()
        },
        path2url: function(e) {
            if ("http" == e.substr(0, 4))
                return e;
            if (e = e.replace(/\\/g, "/"),
            e = e.replace(/\/+/g, "/"),
            e = e.replace(/\/\.*\//g, "/"),
            G.is_root && e.substring(0, G.web_root.length) == G.web_root)
                return G.web_host + e.replace(G.web_root, "");
            var t = G.app_host + "/index.php?explorer/fileProxy&path=" + urlEncode(e);
            return G.share_page !== void 0 && (t = G.app_host + "/index.php?share/fileProxy&user=" + G.user + "&sid=" + G.sid + "&path=" + urlEncode(e)),
            t
        },
        authCheck: function(e, t) {
            return G.is_root ? !0 : AUTH.hasOwnProperty(e) ? AUTH[e] ? !0 : (void 0 == t && (t = LNG.no_permission),
            core.tips.tips(t, !1),
            !1) : !0
        },
        ajaxError: function(e) {
            core.tips.close(LNG.system_error, !1);
            var t = e.responseText
              , 
            a = '<div class="ajaxError">' + t + "</div>"
              , 
            i = $.dialog.list.ajaxErrorDialog;
            return "<!--user login-->" == t.substr(0, 17) ? (FrameCall.goRefresh(),
            void 0) : (i ? i.content(a) : $.dialog({
                id: "ajaxErrorDialog",
                padding: 0,
                width: "60%",
                height: "50%",
                fixed: !0,
                resize: !0,
                ico: core.ico("error"),
                title: "ajax error",
                content: a
            }),
            void 0)
        },
        file_get: function(e, t) {
            var a = "./index.php?editor/fileGet&filename=" + urlEncode2(e);
            G.share_page !== void 0 && (a = "./index.php?share/fileGet&user=" + G.user + "&sid=" + G.sid + "&filename=" + urlEncode2(e)),
            $.ajax({
                url: a,
                dataType: "json",
                beforeSend: function() {
                    core.tips.loading(LNG.loading)
                },
                error: core.ajaxError,
                success: function(e) {
                    core.tips.close(LNG.success),
                    "function" == typeof t && t(e.data.content)
                }
            })
        },
        setting: function(e) {
            void 0 == e && (e = G.is_root ? "system" : "user"),
            void 0 == window.top.frames.Opensetting_mode ? $.dialog.open("./index.php?setting#" + e, {
                id: "setting_mode",
                fixed: !0,
                ico: core.ico("setting"),
                resize: !0,
                title: LNG.setting,
                width: 960,
                height: 580
            }) : ($.dialog.list.setting_mode.display(!0),
            FrameCall.top("Opensetting_mode", "Setting.setGoto", '"' + e + '"'))
        },
        copyright: function() {
            var e = require("../tpl/copyright.html")
              , 
            t = template.compile(e)
              , 
            a = t({
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
                content: a
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
        openLog: function() {
            $.dialog.open("/cgi-bin/viruslog.cgi", {
                fixed: !0,
                resize: !0,
                title: LNG.log_virus,
                width: "80%",
                height: "70%"
            })
        },
        openApp: function(app) {
            if ("url" == app.type) {
                var icon = app.icon;
                -1 == app.icon.search(G.static_path) && "http" != app.icon.substring(0, 4) && (icon = G.static_path + "images/app/" + app.icon),
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
            require.async(e, function() {
                try {} catch (e) {}
            })
        },
        explorer: function(e, t) {
            void 0 == e && (e = ""),
            void 0 == t && (t = core.pathThis(e));
            var a = "./index.php?/explorer&type=iframe&path=" + e;
            G.share_page !== void 0 && (a = "./index.php?share/folder&type=iframe&user=" + G.user + "&sid=" + G.sid + "&path=" + e),
            $.dialog.open(a, {
                resize: !0,
                fixed: !0,
                ico: core.ico("folder"),
                title: t,
                width: 880,
                height: 550
            })
        },
        explorerCode: function(e) {
            void 0 == e && (e = "");
            var t = "index.php?/editor&project=" + e;
            G.share_page !== void 0 && (t = "./index.php?share/code_read&user=" + G.user + "&sid=" + G.sid + "&project=" + e),
            $.dialog.open(t, {
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
            e && ($("#link_css_list").attr("href", e),
            $(".setSkin_finished").remove())
        },
        setSkin: function(e, t) {
            var a = G.static_path + "style/skin/" + e + t;
            $("body").append('<img src="' + a + '" onload="core.setSkin_finished();" onerror="core.setSkin_finished();" class="setSkin_finished">')
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
                return "undefined" != typeof Global && Global.topbar_height ? Global.topbar_height : 0
            },
            loading: function(e) {
                Tips.loading(e, "info", core.tips.topHeight())
            },
            close: function(e, t) {
                "object" == typeof e ? Tips.close(e.data, e.code, core.tips.topHeight()) : Tips.close(e, t, core.tips.topHeight())
            },
            tips: function(e, t) {
                "object" == typeof e ? Tips.tips(e.data, e.code, core.tips.topHeight()) : Tips.tips(e, t, core.tips.topHeight())
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
        createFlash: function(e, t, a) {
            var i = '<object type="application/x-shockwave-flash" id="' + a + '" data="' + e + '" width="100%" height="100%">' + '<param name="movie" value="' + e + '"/>' + '<param name="allowfullscreen" value="true" />' + '<param name="allowscriptaccess" value="always" />' + '<param name="flashvars" value="' + t + '" />' + '<param name="wmode" value="transparent" />' + "</object>";
            return i
        },
        search: function(e, t) {
            var a, i, n = require("../tpl/search.html"), 
            o = require("../tpl/search_list.html"), 
            s = function() {
                var o = template.compile(n);
                0 == $(".dialog_do_search").length ? (l(),
                i = {
                    search: e,
                    path: t,
                    is_content: void 0,
                    is_case: void 0,
                    ext: "",
                    LNG: LNG
                },
                a = $.dialog({
                    id: "dialog_do_search",
                    padding: 0,
                    fixed: !0,
                    ico: core.ico("search"),
                    resize: !0,
                    title: LNG.search,
                    width: 450,
                    content: o(i)
                }),
                c(i),
                $("#search_ext").tooltip({
                    placement: "bottom",
                    html: !0
                }),
                $("#search_path").tooltip({
                    placement: "bottom",
                    html: !0,
                    title: function() {
                        return $("#search_path").val()
                    }
                })) : ($("#search_value").val(e),
                $("#search_path").val(t),
                r(),
                $.dialog.list.dialog_do_search.display(!0))
            }
            , 
            r = function() {
                i = {
                    search: $("#search_value").val(),
                    path: $("#search_path").val(),
                    is_content: $("#search_is_content").attr("checked"),
                    is_case: $("#search_is_case").attr("checked"),
                    ext: $("#search_ext").val()
                },
                c(i)
            }
            , 
            l = function() {
                $("#search_value").die("keyup").live("keyup", function() {
                    ui.path.setSearchByStr($(this).val())
                }),
                $("#search_value,#search_ext,#search_path").keyEnter(r),
                $(".search_header a.button").die("click").live("click", r),
                $(".search_result .list .name").die("click").live("click", function() {
                    var e = $(this).find("a").html()
                      , 
                    t = $(this).parent().find(".path a").html() + e;
                    $(this).parent().hasClass("file") ? ui.pathOpen.open(t) : "explorer" == Config.pageApp ? ui.path.list(t + "/", "tips") : core.explorer(t + "/")
                }),
                $(".search_result .list .path a").die("click").live("click", function() {
                    var e = $(this).html();
                    "explorer" == Config.pageApp ? ui.path.list(e, "tips") : core.explorer(e)
                })
            }
            , 
            c = function(e) {
                var t = 150;
                $("#search_value").focus(),
                $(".search_result .list").remove();
                var a = $(".search_result .message td");
                if (!e.search || !e.path)
                    return a.hide().html(LNG.search_info).fadeIn(t),
                    void 0;
                if (1 >= e.search.length)
                    return a.hide().html("too short!").fadeIn(t),
                    void 0;
                var i = "index.php?explorer/search";
                G.share_page !== void 0 && (i = "index.php?share/search&user=" + G.user + "&sid=" + G.sid),
                $.ajax({
                    url: i,
                    dataType: "json",
                    type: "POST",
                    data: e,
                    beforeSend: function() {
                        a.hide().html(LNG.searching + '<img src="' + G.static_path + 'images/loading.gif">').fadeIn(t)
                    },
                    error: core.ajaxError,
                    success: function(e) {
                        if (!e.code)
                            return a.hide().html(e.data).fadeIn(t),
                            void 0;
                        if (0 == e.data.filelist.length && 0 == e.data.folderlist.length)
                            return a.hide().html(LNG.search_null).fadeIn(t),
                            void 0;
                        a.hide();
                        var i = template.compile(o);
                        e.data.LNG = LNG,
                        $(i(e.data)).insertAfter(".search_result .message").fadeIn(t)
                    }
                })
            }
            ;
            s()
        },
        server_dwonload: function(e) {
            core.upload_check("explorer:serverDownload");
            var t = $(".download_box")
              , 
            a = t.find("#download_list")
              , 
            i = t.find("input").val();
            if (t.find("input").val(""),
            !i || "http" != i.substr(0, 4))
                return core.tips.tips("url false!", !1),
                void 0;
            var n = UUID()
              , 
            o = '<div id="' + n + '" class="item">' + '<div class="info"><span class="title" tytle="' + i + '">' + core.pathThis(i) + "</span>" + '<span class="size">0b</span>' + '<span class="state">' + LNG.upload_ready + "</span>" + '<a class="remove font-icon icon-remove" href="javascript:void(0)"></a>' + '<div style="clear:both"></div></div></div>';
            a.find(".item").length > 0 ? $(o).insertBefore(a.find(".item:eq(0)")) : a.append(o);
            var s, r, l, c = 0, 
            d = $("#" + n), 
            p = $("#" + n + " .state").text(LNG.download_ready), 
            u = $('<div class="progress progress-striped active"><div class="progress-bar" role="progressbar" style="width: 0%;text-align:right;"></div></div>').appendTo("#" + n).find(".progress-bar");
            $("#" + n + " .remove").bind("click", function() {
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
                error: function(e, t, a) {
                    core.ajaxError(e, t, a),
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
                    }),
                    p.text(LNG.download_success),
                    $("#" + n + " .info .title").html(e.info)) : p.addClass("error").text(LNG.error),
                    u.parent().remove()
                }
            });
            var h = function() {
                $.ajax({
                    url: "./index.php?explorer/serverDownload&type=percent&uuid=" + n,
                    dataType: "json",
                    success: function(e) {
                        var t = ""
                          , 
                        a = e.data;
                        if (s) {
                            if (!e.code)
                                return p.text(LNG.loading),
                                void 0;
                            if (a) {
                                if (a.size = parseFloat(a.size),
                                a.time = parseFloat(a.time),
                                l) {
                                    var i = (a.size - l.size) / (a.time - l.time);
                                    if (c > .2 * i) {
                                        var n = c;
                                        c = i,
                                        i = n
                                    } else
                                        c = i;
                                    t = core.file_size(i) + "/s"
                                }
                                if (0 == a.length)
                                    d.find(".progress-bar").css("width", "100%").text(LNG.loading);
                                else {
                                    var o = 100 * (a.size / a.length);
                                    d.find(".progress-bar").css("width", o + "%"),
                                    p.text(parseInt(o) + "%(" + t + ")")
                                }
                                d.find(".size").text(core.file_size(a.length)),
                                l = a
                            }
                        }
                    }
                })
            }
            ;
            r = setTimeout(function() {
                h(),
                s = setInterval(function() {
                    h()
                }, 1e3)
            }, 100)
        },
        file_size: function(e) {
            if (0 == e)
                return "0B";
            e = parseFloat(e);
            var t = {
                GB: 1073741824,
                MB: 1048576,
                KB: 1024,
                "B ": 0
            };
            for (var a in t)
                if (e >= t[a])
                    return (e / t[a]).toFixed(1) + a;
            return "0B"
        },
        upload_check: function(e) {
            return void 0 == e && (e = "explorer:fileUpload"),
            !G.is_root && AUTH.hasOwnProperty(e) && 1 != AUTH[e] ? (core.tips.tips(LNG.no_permission, !1),
            void 0) : "*recycle*/" == G.this_path || "*share*/" == G.this_path || "*share*/" == G.this_path || G.json_data && "writeable" != G.json_data.path_type ? (core.tips.tips(LNG.no_permission_write, !1),
            !1) : !0
        },
        upload: function() {
            G.upload_path = G.this_path;
            var e = urlDecode(G.upload_path);
            if (uploader.option("server", "index.php?explorer/fileUpload&path=" + urlEncode(G.upload_path)),
            30 >= e.length ? e : "..." + e.substr(e.length - 30),
            0 != $(".dialog_file_upload").length)
                return $.dialog.list.dialog_file_upload.display(!0),
                void 0;
            var t = require("../tpl/upload.html")
              , 
            a = template.compile(t)
              , 
            i = WebUploader.Base.formatSize(G.upload_max);
            $.dialog({
                padding: 5,
                resize: !0,
                ico: core.ico("up"),
                id: "dialog_file_upload",
                fixed: !0,
                title: LNG.upload_muti,
                content: a({
                    LNG: LNG,
                    maxsize: i
                }),
                close: function() {
                    $.each(uploader.getFiles(), function(e, t) {
                        uploader.skipFile(t),
                        uploader.removeFile(t)
                    }),
                    $.each($("#download_list .item"), function() {
                        $(this).find(".remove").click()
                    })
                }
            }),
            $(".file_upload .tips").tooltip({
                placement: "bottom"
            }),
            $(".file_upload .top_nav a.menu").unbind("click").bind("click", function() {
                $(this).hasClass("tab_upload") ? ($(".file_upload .tab_upload").addClass("this"),
                $(".file_upload .tab_download").removeClass("this"),
                $(".file_upload .upload_box").removeClass("hidden"),
                $(".file_upload .download_box").addClass("hidden")) : ($(".file_upload .tab_upload").removeClass("this"),
                $(".file_upload .tab_download").addClass("this"),
                $(".file_upload .upload_box").addClass("hidden"),
                $(".file_upload .download_box").removeClass("hidden"))
            }),
            $(".file_upload .download_box button").unbind("click").bind("click", function() {
                core.server_dwonload(G.upload_path)
            }),
            uploader.addButton({
                id: "#picker"
            })
        },
        upload_init: function() {
            var e = "#thelist"
              , 
            t = !0;
            $.browser.msie && (t = !1);
            var a = 10485760;
            a >= G.upload_max && (a = .5 * G.upload_max),
            uploader = WebUploader.create({
                swf: G.static_path + "js/lib/webuploader/Uploader.swf",
                dnd: "body",
                threads: 2,
                compress: !1,
                resize: !1,
                prepareNextFile: !0,
                duplicate: !0,
                chunked: t,
                chunkRetry: 3,
                chunkSize: a
            }),
            $("#uploader .success").die("click").live("click", function() {
                var e = $(this).find("span.title").attr("title");
                "explorer" == Config.pageApp ? ui.path.list(core.pathFather(e), "tips", function() {
                    ui.path.setSelectByFilename(core.pathThis(e))
                }) : core.explorer(core.pathFather(e))
            }),
            $("#uploader .open").die("click").live("click", function(e) {
                var t = $(this).find("span.title").attr("title");
                ui.pathOpen.open(t),
                stopPP(e)
            }),
            $(".upload_box_clear").die("click").live("click", function() {
                $("#thelist .item.success,#thelist .item.error").each(function() {
                    $(this).slideUp(300, function() {
                        $(this).remove()
                    })
                })
            }),
            $(".upload_box_setting").die("click").live("click", function() {
                $(".upload_box_config").toggleClass("hidden")
            }),
            $("#uploader .remove").die("click").live("click", function(e) {
                var t = $(this).parent().parent().attr("id");
                uploader.skipFile(t),
                uploader.removeFile(t, !0),
                $(this).parent().parent().slideUp(function() {
                    $(this).remove()
                }),
                stopPP(e)
            });
            var i = 0
              , 
            n = 0
              , 
            o = "0B/s"
              , 
            s = function(e, t) {
                var a = e.size * t
                  , 
                i = 5;
                e.speed === void 0 ? e.speed = [
                [time() - 500, 0], 
                [time(), a]
                ] : i >= e.speed.length ? e.speed.push([time(), a]) : (e.speed = e.speed.slice(1, i),
                e.speed.push([time(), a]));
                var n = e.speed[e.speed.length - 1]
                  , 
                s = e.speed[0]
                  , 
                r = (n[1] - s[1]) / ((n[0] - s[0]) / 1e3);
                return r = core.file_size(r) + "/s",
                o = r,
                r
            }
              , 
            r = [];
            uploader.on("uploadBeforeSend", function(e, t) {
                var a = urlEncode(e.file.fullPath);
                (void 0 == a || "undefined" == a) && (a = ""),
                t.fullPath = a
            }).on("fileQueued", function(t) {
                if (!core.upload_check())
                    return uploader.skipFile(t),
                    uploader.removeFile(t),
                    void 0;
                var a, n = $(e), 
                a = t.fullPath;
                t.finished = !1,
                (void 0 == a || "undefined" == a) && (a = t.name),
                i++,
                $(e).find(".item").length > 0 && (n = $(e).find(".item:eq(0)"));
                var o = '<div id="' + t.id + '" class="item"><div class="info">' + '<span class="title" title="' + G.upload_path + a + '">' + core.pathThis(a) + "</span>" + '<span class="size">' + core.file_size(t.size) + "</span>" + '<span class="state">' + LNG.upload_ready + "</span>" + '<a class="remove font-icon icon-remove" href="javascript:void(0)"></a>' + '<div style="clear:both"></div></div></div>';
                $(e).find(".item").length > 0 ? $(o).insertBefore($(e).find(".item:eq(0)")) : $(e).append(o),
                uploader.upload()
            }).on("uploadProgress", function(e, t) {
                $(".dialog_file_upload .aui_title").text(LNG.uploading + ": " + n + "/" + i + " (" + o + ")");
                var a = s(e, t)
                  , 
                r = $("#" + e.id)
                  , 
                l = r.find(".progress .progress-bar");
                l.length || (l = $('<div class="progress progress-striped active"><div class="progress-bar" role="progressbar" style="width: 0%"></div></div>').appendTo(r).find(".progress-bar")),
                r.find(".state").text(parseInt(100 * t) + "%(" + a + ")"),
                l.css("width", 100 * t + "%")
            }).on("uploadAccept", function(e, t) {
                e.file.serverData = t;
                try {
                    r.push(core.pathThis(t.info))
                } catch (a) {}
            }).on("uploadSuccess", function(e) {
                var t = 36 * $("#" + e.id).index(".item");
                $("#uploader").scrollTop(t),
                n++;
                var a = e.serverData;
                if (a.code ? ($("#" + e.id).addClass("success"),
                $("#" + e.id).find(".state").text(a.data),
                $("#" + e.id).find(".remove").removeClass("icon-remove").addClass("icon-ok").addClass("open").removeClass("remove")) : ($("#" + e.id).addClass("error").find(".state").addClass("error"),
                $("#" + e.id).find(".state").text(a.data).attr("title", a.data)),
                uploader.removeFile(e),
                $("#" + e.id).find(".progress").fadeOut(),
                !e.fullPath) {
                    var i = r;
                    ui.f5_callback(function() {
                        ui.path.setSelectByFilename(i)
                    })
                }
            }).on("uploadError", function(e, t) {
                n++,
                $("#" + e.id).find(".progress").fadeOut(),
                $("#" + e.id).addClass("error").find(".state").addClass("error"),
                $("#" + e.id).find(".state").text(LNG.upload_error + "(" + t + ")")
            }).on("uploadFinished", function() {
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
            }).on("error", function(e) {
                core.tips.tips(e, !1)
            });
            var l;
            inState = !1,
            dragOver = function() {
                0 == inState && (inState = !0,
                MaskView.tips(LNG.upload_drag_tips)),
                l && window.clearTimeout(l)
            }
            ,
            dragLeave = function(e) {
                stopPP(e),
                l && window.clearTimeout(l),
                l = window.setTimeout(function() {
                    inState = !1,
                    MaskView.close()
                }, 100)
            }
            ,
            dragDrop = function(e) {
                try {
                    if (e = e.originalEvent || e,
                    core.upload_check()) {
                        var t = e.dataTransfer.getData("text/plain");
                        t && "http" == t.substring(0, 4) ? ui.pathOperate.appAddURL(t) : core.upload()
                    }
                    stopPP(e)
                } catch (e) {}
                inState && (inState = !1,
                MaskView.close())
            }
        }
    }
}),
define("app/tpl/copyright.html", [], '<div class="copyright_dialog_content">\n	<div class="title">\n		<div class="logo"><i class="icon-cloud"></i>KodExplorer v{{G.version}}</div>\n		<div class=\'info\'>——{{LNG.secros_name_copyright}}</div>\n	</div>\n	<div class="content">\n		<p>{{#LNG.copyright_desc}}</p>\n		<div>{{#LNG.copyright_contact}}</div>\n		<div>{{#LNG.copyright_info}}</div> \n	</div>\n</div>'),
define("app/tpl/search.html", [], "<div class='do_search'>\n    <div class='search_header'>\n       <div class='s_br'>\n            <input type='text' id='search_value' value='{{search}}'/><a class='right button icon-search'></a>\n            <div style='float:right'>{{LNG.path}}:<input type='text' id='search_path' value='{{path}}'/></div>\n        </div>\n       <div class='s_br'>\n            <input type='checkbox' id='search_is_case' {{if is_case}}checked='true'{{/if}}/>\n            <label for='search_is_case'>{{LNG.search_uplow}}</label>\n            <input type='checkbox' id='search_is_content' {{if is_content}}checked='true'{{/if}}/>\n            <label for='search_is_content'>{{LNG.search_content}}</label>\n            <div style='float:right'>{{LNG.file_type}}:<input type='text' id='search_ext' value='{{ext}}' title='{{LNG.search_ext_tips}}'/></div>\n        </div>\n    </div>\n    <div class='search_result'>\n        <table border='0' cellspacing='0' cellpadding='0'>\n            <tr class='search_title'>\n               <td class='name'>{{LNG.name}}</td>\n               <td class='type'>{{LNG.type}}</td>\n               <td class='size'>{{LNG.size}}</td>\n               <td class='path'>{{LNG.path}}</td>\n            </tr>\n            <tr class='message'><td colspan='4'></td></tr>\n        </table>\n    </div>\n</div>\n\n"),
define("app/tpl/search_list.html", [], "{{each folderlist as v i}}\n    <tr class='list folder' data-path='{{v.path}}{{v.name}}' data-type='folder' data-size='0'>\n        <td class='name'><a href='javascript:void(0);' title='{{LNG.open}}{{v.name}}'>{{v.name}}</a></td>\n        <td class='type'>{{LNG.folder}}</td>\n        <td class='size'>0</td>\n        <td class='path'><a href='javascript:void(0);' title='{{LNG.goto}}{{v.path}}'>{{v.path}}</a></td>\n    </tr>\n{{/each}}\n{{each filelist as v i}}\n<tr class='list file'\n    data-path='{{v.path}}{{v.name}}' \n    data-type='{{v.ext}}' \n    data-size='{{v.size}}'>\n    <td class='name'><a href='javascript:void(0);' title='{{LNG.open}}{{v.name}}'>{{v.name}}</a></td>\n    <td class='type'>{{v.ext}}</td>\n    <td class='size'>{{v.size_friendly}}</td>\n    <td class='path'><a href='javascript:void(0);' title='{{LNG.goto}}{{v.path}}'>{{v.path}}</a></td>\n</tr>\n{{/each}}"),
define("app/tpl/upload.html", [], "<div class='file_upload'>\n    <div class='top_nav'>\n       <a href='javascript:void(0);' class='menu this tab_upload'>{{LNG.upload_local}}</a>\n       <a href='javascript:void(0);' class='menu tab_download''>{{LNG.download_from_server}}</a>\n       <div style='clear:both'></div>\n    </div>\n    <div class='upload_box'>\n        <div class='btns'>\n            <div id='picker'>{{LNG.upload_select}}</div>\n            <div class=\"upload_box_tips\">\n            <a href=\"javascript:void(0);\" class=\"upload_box_clear\">{{LNG.upload_clear}}</a> \n            <!-- \n            | <a href=\"javascript:void(0);\" class=\"upload_box_setting\">\n            {{LNG.upload_setting}}<b class=\"caret\"></b></a> \n            -->\n            </div>\n            <div style='clear:both'></div>\n        </div>\n\n        <div class=\"upload_box_config hidden\">\n            <i>{{LNG.upload_tips}}</i>\n            <div class=\"upload_check_box\">\n                <b>{{LNG.upload_exist}}</b>\n                <label><input type=\"radio\" name=\"existing\" value=\"rename\" checked=\"checked\">{{LNG.upload_exist_rename}}</label>\n                <label><input type=\"radio\" name=\"existing\" value=\"replace\">{{LNG.upload_exist_replace}}</label>\n                <label><input type=\"radio\" name=\"existing\" value=\"skip\">{{LNG.upload_exist_skip}}</label>\n            </div>\n        </div>\n        <div id='uploader' class='wu-example'>\n            <div id='thelist' class='uploader-list'></div>\n        </div>\n    </div>\n    <div class='download_box hidden'>\n        <div class='list'>{{LNG.download_address}}<input type='text' name='url'/>\n        <button class='btn btn-default btn-sm' type='button'>{{LNG.download}}</button>\n        </div>\n        <div style='clear:both'></div>\n        <div id='downloader'>\n            <div id='download_list' class='uploader-list'></div>\n        </div>\n    </div>\n</div>"),
define("app/src/setting/setting", [], function() {
    var e, t = function(e) {
        core.setSkin(e, "app_setting.css"),
        FrameCall.father("ui.setTheme", '"' + e + '"')
    }
    , 
    a = function(e) {
        core.setSkin(e, "app_setting.css")
    }
    , 
    i = function(t) {
        ("" == t || void 0 == t) && (t = "user"),
        e = t,
        "fav&" == t.substring(0, 4) && (t = "fav"),
        $(".selected").removeClass("selected"),
        $("ul.setting li#" + t).addClass("selected"),
        window.location.href = "#" + t,
        $.ajax({
            url: "./index.php?setting/slider&slider=" + t,
            beforeSend: function() {
                $(".main").html("<img src='./static/images/loading.gif'/>")
            },
            success: function(a) {
                $(".main").css("display", "none"),
                $(".main").html(a),
                $(".main").fadeIn("fast"),
                "fav" == t && Fav.init(e),
                "member" == t && Group.init(),
                "file" == t && Filetype.init(),
                "usblist" == t && Usblist.init(),
                e = t
            }
        })
    }
    , 
    n = function() {
        G.is_root ? $("ul.setting #system").show() : $("ul.setting #system").hide(),
        G.is_root ? $("ul.setting #antivirus").show() : $("ul.setting #antivirus").hide(),
        G.is_root ? $("ul.setting #net").show() : $("ul.setting #net").hide(),
        G.is_root ? $("ul.setting #usblist").show() : $("ul.setting #usblist").hide(),
        G.is_root ? $("ul.setting #file").show() : $("ul.setting #file").hide(),
        G.is_root || 1 == AUTH["member:get"] ? $("ul.setting #member").show() : $("ul.setting #member").hide(),
        e = location.hash.split("#", 2)[1],
        i(e),
        $("ul.setting li").hover(function() {
            $(this).addClass("hover")
        }, function() {
            $(this).toggleClass("hover")
        }).click(function() {
            e = $(this).attr("id"),
            i(e)
        }),
        $(".box .list").live("hover", function() {
            $(this).addClass("listhover")
        }, function() {
            $(this).toggleClass("listhover")
        }).live("click", function() {
            var e = $(this)
              , 
            a = e.parent();
            switch (type = a.attr("data-type"),
            value = e.attr("data-value"),
            a.find(".this").removeClass("this"),
            e.addClass("this"),
            type) {
            case "wall":
                var i = G.static_path + "images/wall_page/" + value + ".jpg";
                FrameCall.father("ui.setWall", '"' + i + '"');
                break;
            case "theme":
                t(value);
                break;
            case "musictheme":
                FrameCall.father("CMPlayer.changeTheme", '"music","' + value + '"');
                break;
            case "movietheme":
                FrameCall.father("CMPlayer.changeTheme", '"movie","' + value + '"');
                break;
            default:
            }
            var n = "index.php?setting/set&k=" + type + "&v=" + value;
            $.ajax({
                url: n,
                type: "json",
                success: function(e) {
                    e.code ? tips(e) : core.authCheck("setting:set") ? tips(LNG.config_save_error_file, !1) : tips(LNG.config_save_error_auth, !1)
                }
            })
        })
    }
    , 
    o = function() {
        var e = $(".selected").attr("id");
        switch (e) {
        case "user":
            var t = $("#password_now").val()
              , 
            a = $("#password_new").val()
            ,b = $("#password_renew").val();
            if ("" == a || "" == t || "" == b) {
                tips(LNG.password_not_null, "error");
                break
            }
            if (a != b) {
            	 tips(LNG.newpassword_wrong, "error");
                break
            }
            $.ajax({
                url: "index.php?user/changePassword&password_now=" + t + "&password_new=" + a,
                dataType: "json",
                success: function(e) {
                    tips(e),
                    e.code && (window.top.location.href = "./index.php?user/logout")
                }
            });
            break;
        case "net":
            var ip = $("#net_ip").val()
              , 
            mask = $("#net_mask").val();
            gateway = $("#net_gateway").val();
            if ("" == ip) {
                tips(LNG.ip_not_null, "error");
                break
            }
            if ("" == mask) {
                tips(LNG.mask_not_null, "error");
                break
            }
            $.ajax({
                url: "index.php?net/changeNet&net_ip=" + ip + "&net_mask=" + mask + "&net_gateway=" + gateway,
                dataType: "json",
                success: function(e) {
                    tips(e),
                    e.code && (window.top.location.href = "http://" + ip + "/index.php?user/logout")
                }
            });
            break;
        case "wall":
            var i = $("#wall_url").val();
            if ("" == i) {
                tips(LNG.picture_can_not_null, "error");
                break
            }
            FrameCall.father("ui.setWall", '"' + i + '"'),
            $(".box").find(".this").removeClass("this");
            var n = "index.php?setting/set&k=wall&v=" + urlEncode(i);
            $.ajax({
                url: n,
                type: "json",
                success: function(e) {
                    tips(e)
                }
            });
        default:
        }
    }
    ;
    return {
        init: n,
        setGoto: i,
        tools: o,
        setThemeSelf: a,
        setTheme: t
    }
}),
define("app/src/setting/fav", [], function() {
    var e = "index.php?fav/"
      , 
    t = function(t) {
        var a;
        $.ajax({
            url: e + "get",
            dataType: "json",
            async: !1,
            success: function(e) {
                return e.code ? (a = e.data,
                void 0) : (tips(e),
                void 0)
            },
            error: function() {
                return !1
            }
        });
        var i = "<tr class='title'><td class='name'>" + LNG.name + "<span>(" + LNG.can_not_repeat + ")</span></td>" + "<td class='path'>" + LNG.address + "<span>(" + LNG.absolute_path + ")</span></td>" + "<td class='action'>" + LNG.action + "</td>" + "</tr>";
        for (var n in a)
            i += "<tr class='favlist' name='" + a[n].name + "' path='" + a[n].path + "'>" + "   <td class='name'><input type='text' id='sname' value='" + a[n].name + "' /></td>" + "   <td class='path'><input type='text' id='spath' value='" + a[n].path + "' /></td>" + "   <td class='action'>" + "       <a href='javascript:void(0)' onclick='' class='button edit'>" + LNG.button_save_edit + "</a>" + "       <a href='javascript:void(0)' onclick='' class='button del'>" + LNG.button_del + "</a>" + "   </td>" + "</tr>";
        if ($("table#list").html(i),
        "fav&" == t.substring(0, 4)) {
            var o = t.split("&")[1].split("=")[1]
              , 
            s = t.split("&")[2].split("=")[1]
              , 
            r = "<tr class='favlist' name='' path=''>   <td class='name'><input type='text' id='sname' value='" + urlDecode(o) + "' /></td>" + "   <td class='path'><input type='text' id='spath' value='" + urlDecode(s) + "' /></td>" + "   <td class='action'>" + "       <a href='javascript:void(0)' class='button addsave'>" + LNG.button_save + "</a>" + "       <a href='javascript:void(0)' class='button addexit'>" + LNG.button_cancel + "</a>" + "   </td>" + "</tr>";
            $(r).insertAfter("table#list tr:last")
        }
    }
      , 
    a = function() {
        var e = "<tr class='favlist' name='' path=''>   <td class='name'><input type='text' id='sname' value='' /></td>   <td class='path'><input type='text' id='spath' value='' /></td>   <td class='action'>       <a href='javascript:void(0)' class='button addsave'>" + LNG.button_save + "</a>" + "       <a href='javascript:void(0)' class='button addexit'>" + LNG.button_cancel + "</a>" + "   </td>" + "</tr>";
        $(e).insertAfter("table#list tr:last")
    }
      , 
    i = function() {
        var e = $(this).parent().parent();
        $(e).detach()
    }
      , 
    n = function() {
        var t = $(this).parent().parent()
          , 
        a = $(t).find("#sname").val()
          , 
        i = $(t).find("#spath").val();
        return "" == a || "" == i ? (tips(LNG.not_null, "error"),
        !1) : ($.ajax({
            url: e + "add&name=" + a + "&path=" + i,
            dataType: "json",
            success: function(e) {
                if (tips(e),
                e.code) {
                    $(t).attr("name", a),
                    $(t).attr("path", i);
                    var n = "<a href='javascript:void(0)' class='button edit'>" + LNG.button_save_edit + "</a>&nbsp;" + "<a href='javascript:void(0)' class='button del'>" + LNG.button_del + "</a>";
                    $(t).find("td.action").html(n),
                    FrameCall.father("ui.tree.init", '""')
                }
            }
        }),
        void 0)
    }
      , 
    o = function() {
        var t = $(this).parent().parent()
          , 
        a = $(t).attr("name")
          , 
        i = $(t).find("#sname").val()
          , 
        n = $(t).find("#spath").val();
        return "" == i || "" == n ? (tips(LNG.not_null, "error"),
        !1) : ($.ajax({
            dataType: "json",
            url: e + "edit&name=" + a + "&name_to=" + i + "&path_to=" + n,
            success: function(e) {
                tips(e),
                e.code && ($(t).attr("name", i),
                FrameCall.father("ui.tree.init", '""'))
            }
        }),
        void 0)
    }
      , 
    s = function() {
        var t = $(this).parent().parent()
          , 
        a = $(t).attr("name");
        $.ajax({
            url: e + "del&name=" + a,
            dataType: "json",
            async: !1,
            success: function(e) {
                tips(e),
                e.code && ($(t).detach(),
                FrameCall.father("ui.tree.init", '""'))
            }
        })
    }
      , 
    r = function() {
        $(".fav a.add").live("click", a),
        $(".fav a.addexit").live("click", i),
        $(".fav a.addsave").live("click", n),
        $(".fav a.edit").live("click", o),
        $(".fav a.del").live("click", s)
    }
    ;
    return {
        init: t,
        bindEvent: r
    }
}),
define("app/src/setting/file", [], function() {
		var e = "index.php?file/"
		 , 
    t = {}
      , 
    a = function() {
        $.ajax({
            url: e + "get",
            dataType: "json",
            async: !1,
            success: function(e) {
                if (!e.code)
                    return tips(e),
                    void 0;
                var r = e.data;
                o(r)
            },
            error: function() {
                return !1
            }
        })
    }
    ,o = function(r) {
        var a;
        a = r,
        $(".file_editor .tag").removeClass("this"),
        $(".file_editor input").removeAttr("checked"),
        $(".file_editor #ext_allow").val(a.ext_allow),
        $(".file_editor .tag").each(function() {
            var e = $(this)
              , 
            t = e.attr("data-role");
            t = t.split(";"),
            t = t[0],
            a[t] && (e.addClass("this"),
            e.find("input").attr("checked", !0))
        });
        if (a.file_deepcheck == "1"){
        	$(".file_editor #file_deepcheck").attr("checked", !0);
        }
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
     s = function() {
        var o = $(".file_editor #ext_allow").val().toLowerCase(),
        cg = function(){
            if(o.length>0){
                let arr = o.split(",");
                for(let k = 0;k<arr.length;k++){
                    arr[k] = arr[k].split(".")[arr[k].split(".").length - 1];
                }
                o = arr.join(",");
            }
        },
        s = {}, 
        r = "", 
        l = "add";
        cg();
        if ($(".file_editor #file_deepcheck").attr("checked")) {
         a = 1;
        }
        else {
        	a = 0;
        }
        if ($(".file_editor .tag.this").each(function() {
            for (var e = $(this).attr("data-role").split(";"), t = 0; e.length > t; t++)
                s[e[t]] = 1
        }),
       $(".file_editor .add_save").hasClass("hidden")) {
            l = "edit";
            var c = $(".group_editor #role").attr("data-before");
            r = "edit&role_old=" + c + "&role=" + t + "&name=" + i + "&ext_not_allow=" + o
        } else
            r = "set&ext_allow=" + o + "&file_deepcheck=" + a;
        $.ajax({
            url: e + r,
            data: s,
            type: "POST",
            dataType: "json",
            success: function(e) {
                tips(e)
            }
        })
    }
    ,
    c = function() {
        $(".file_editor a.edit_save").live("click", s),
        $(".file_editor a.revert").live("click", function() {
            $(".file_editor .tag").each(function() {
                $(this).hasClass("this") ? ($(this).removeClass("this"),
                $(this).find("input").removeAttr("checked")) : ($(this).addClass("this"),
                $(this).find("input").attr("checked", !0))
            })
        }),
        $(".nav a").live("click", function() {
            l($(this))
        }),
        $(".file_ai a.ai").live("click", function() {
        	  /*if ($('#uploadfile').val().length == 0) {
        			tips(LNG.upload_error_null, "error");
        			return 0;
        		}
            document.getElementById("upload").submit();
            var obj = document.getElementById("ai_tip");
                        obj.innerHTML='<img src=\"/static/images/lazy.gif\" />';*/
                
if(($('#upload #uploadfile')[0].files[0].size / 1024 /1024).toFixed(0)>200){
    alert(LNG.group_upload_tips);
    return false;
    }

						var formData = new FormData($('#upload')[0]);
			     //如果上传的文件不为空
			     if($("input[type='file']").val() != ""){  
			        var obj = document.getElementById("ai_tip");
							obj.innerHTML='<img src=\"/static/images/study.gif\" />'
			        //ajax上传数据
			        $.ajax({
			            cache:false,
			            contentType: false,
			            processData: false,
			            url:'/cgi-bin/fileai.cgi',
			            type:'POST',
			            enctype:'multipart/form-data',
			            data:formData,
			            dataType:'JSON',
			            success:function (data) {
			                if (data.code == 0) {
			                	tips(data.info);
			                }else{
			                	tips(data.info,"error");
			              	}
			                obj.innerHTML='';
			                $("input[type='file']").val()='';
			            }
			        })
			    }
        }),
        $(".file_editor .tag").live("click", function() {
            var e = $(this);
            if (select = !1,
            e.toggleClass("this"),
            e.hasClass("this") ? (select = !0,
            e.find("input").attr("checked", !0)) : (select = !1,
            e.find("input").removeAttr("checked")),
            e.parent().hasClass("combox")) {
                var t = e.index();
                1 == t && 0 == select && (e.parent().find(".tag").removeClass("this"),
                e.parent().find("input").removeAttr("checked")),
                1 != t && 1 == select && (e.parent().find(".tag:eq(0)").addClass("this"),
                e.parent().find("input:eq(0)").attr("checked", !0))
            }
        })
    }
    ,
    d = function() {
        return t
    }
    ;
    return {
        getData: d,
        init: a,
        bindEvent: c
    }
}),
define("app/src/setting/usblist", [], function() {
    var e = "index.php?usbwhitelist/", 
t = {}, 
a = function() {
    $.ajax({
        url: e + "get",
        dataType: "json",
        async: !1,
        success: function(e) {
            if (!e.code)
            return tips(e),
            void 0;
            var r = e.data;
            o(r);
        },
        error: function() {
            return !1
        }
    });
    $.ajax({
        url: "/index.php?usbpolicy/get",
        dataType: "json",
        async: !1,
        success: function(e) {
            // console.log(e);
            if(!e.data){
                $("input[type=radio][name=settingUsbStatus][value='0']").attr("checked",true);
        $.ajax({
            url: "/index.php?usbpolicy/edit&policy=0",
            dataType: "json",
            async: !1,
            success: function(e) {
                tips(e.data);
            },
            error: function() {
                return !1
            }
        });
                return;
            }
            $("input[type=radio][name=settingUsbStatus][value="+e.data+"]").attr("checked",true);
        },
        error: function() {
            return !1
        }
    });
},
o = function(data){
var t = "<tr><td>U盘SID</td><td width='20%'>使用人</td><td width='20%'>备注</td><td width='20%'>" + LNG.action + "</td></tr>";
if(data){
for(let k in data){
   t +=  "<tr><td class='usb_name'>"+data[k].name+"</td><td width='20%' class='usb_user'>"+data[k].user+"</td><td width='20%' class='usb_desc'>"+data[k].desc+"</td><td width='20%'>"+ 
   "<a href='javascript:void(0)' class='button edit' >" + "编辑" + "</a><a href='javascript:void(0)' class='button delete'>" + "删除" + "</a></td></tr>";
}
}
  $(".setting_usblist_whitelist table#list").html(t);
},
edit = function(){
    let name = $(this).parent().parent().find('.usb_name').text();
    let user= $(this).parent().parent().find('.usb_user').text();
    let desc = $(this).parent().parent().find('.usb_desc').text();
    let t =  "<td class='usb_name'>"+name+"</td><td width='20%'><input type='text' class='usb_user'  value='"+user+"' data-old='"+user+"'/></td><td width='20%'>"+
    "<input type='text' class='usb_desc' value='"+desc+"' data-old='"+desc+"'/></td><td width='20%'>"+ 
    "<a href='javascript:void(0)' class='button editsave' >" + "确认编辑" + "</a><a href='javascript:void(0)' class='button editcancle'>" + "取消" + "</a></td>";
    $(this).parent().parent().html(t);
},
getusbsid = function(){
    let h = '<div class="getusbsid_frame"><div class="frame_context">'+
    '<div class="frame_context_value"><img src="./static/images/bar_loading.gif"><div>智能学习中。。。</div></div>'+
    '<div class="frame_context_control"><a class="button hidden getusbsidok">确认</a><a class="button  getusbsidcancle">取消</a></div></div></div>';
    $("body",parent.document).append(h);

    $.ajax({
        url: "/cgi-bin/getusid.cgi",
        dataType: "json",
        async: !1,
        success: function(e) {
            if(e.code == 200){
                let h = '<div class="value_row"><div>U盘SID</div><div class="usb_sid">'+e.data.sid+'</div></div>';
                if(e.data.vendor){
                    h += '<div class="value_row"><div>供应商</div><div>'+e.data.vendor+'</div></div>';
                }
                $('.getusbsid_frame .frame_context_value',parent.document).html(h);
        $('.getusbsid_frame .getusbsidok',parent.document).removeClass('hidden');
            }else{
        $('.getusbsid_frame',parent.document).remove();
        tips(e.msg,false);
            }
        },
        error: function() {
            return !1
        }
    });
},
add = function(usb) {
    var e = "<tr><td><div class='usb_name'>"+usb+"</div></td>"+
    "<td><input type='text' class='usb_user'  value=''/></td><td><input type='text' class='usb_desc' value=''/></td>"+
    "<td> <a href='javascript:void(0)' class='button addsave' >" + "确认添加" + "</a><a href='javascript:void(0)' class='button addcancle'>" + "取消" + "</a></td></tr>";
    $(e).insertAfter(".setting_usblist_whitelist table#list tr:last");
},
editsave = function(){
    let name = $(this).parent().parent().find(".usb_name").text();
    let user = $(this).parent().parent().find(".usb_user").val();
    let desc = $(this).parent().parent().find(".usb_desc").val();
    $.ajax({
        url: e + "edit&name="+ name + "&user=" + user + "&desc=" + desc,
        dataType: "json",
        async: !1,
        success: function(e) {
            if(e.code){
                a();
                tips(e.data);
            }else{
                tips(e.data,false);
            }
        },
        error: function() {
            return !1
        }
    });
},
addsave = function(){
    let name = $(this).parent().parent().find(".usb_name").text();
    let user = $(this).parent().parent().find(".usb_user").val();
    let desc = $(this).parent().parent().find(".usb_desc").val();
    $.ajax({
        url: e + "add&name="+ name + "&user=" + user + "&desc=" + desc,
        dataType: "json",
        async: !1,
        success: function(e) {
            if(e.code){
                a();
                tips(e.data);
            }else{
                tips(e.data,false);
            }
        },
        error: function() {
            return !1
        }
    });
},
addcancle = function(){
    $(this).parent().parent().remove();
},
listdelete = function(){
    let name = $(this).parent().parent().find('.usb_name').text();
    $.ajax({
        url: e + "del&name="+ name,
        dataType: "json",
        async: !1,
        success: function(e) {
            if(e.code){
                a();
                tips(e.data);
            }else{
                tips(e.data,false);
            }
        },
        error: function() {
            return !1
        }
    });
},
editcancle = function(){
    let name = $(this).parent().parent().find('.usb_name').text();
    let user= $(this).parent().parent().find('.usb_user').data('old');
    let desc = $(this).parent().parent().find('.usb_desc').data('old');
    let t =  "<td class='usb_name'>"+name+"</td><td width='20%' class='usb_user'>"+user+"</td><td width='20%' class='usb_desc'>"+desc+"</td><td width='20%'>"+ 
    "<a href='javascript:void(0)' class='button edit' >" + "编辑" + "</a><a href='javascript:void(0)' class='button delete'>" + "删除" + "</a></td>";
    $(this).parent().parent().html(t);
},
getusbsidcancle = function(){
$('.getusbsid_frame',parent.document).remove();
},
getusbsidok = function(){
  let name = $(".getusbsid_frame .frame_context_value .usb_sid",parent.document).text();
  add(name);
  $('.getusbsid_frame',parent.document).remove();
},
c = function() {
    $(".setting_usblist_whitelist a.add").live("click",getusbsid);
    // $(".setting_usblist_whitelist a.add").live("click",add);
    $(".setting_usblist_whitelist a.edit").live("click",edit);
    $(".setting_usblist_whitelist a.addsave").live("click",addsave);
    $(".setting_usblist_whitelist a.editsave").live("click",editsave);
    $(".setting_usblist_whitelist a.delete").live("click",listdelete);
    $(".setting_usblist_whitelist a.editcancle").live("click",editcancle);
    $(".setting_usblist_whitelist a.addcancle").live("click",addcancle);
    $(".getusbsid_frame .getusbsidok",parent.document).live("click",getusbsidok);
    $(".getusbsid_frame .getusbsidcancle",parent.document).live("click",getusbsidcancle);
    $('input:radio[name="settingUsbStatus"]').live("click",function(){
        var checkValue = $('input:radio[name="settingUsbStatus"]:checked').val();
        $.ajax({
            url: "/index.php?usbpolicy/edit&policy="+ checkValue,
            dataType: "json",
            async: !1,
            success: function(e) {
                tips(e.data);
            },
            error: function() {
                return !1
            }
        });
    });
},
d = function() {
    return t
};
return {
    getData: d,
    init: a,
    bindEvent: c
}
}),
define("app/src/setting/group", [], function() {
    var e = "index.php?group/"
      , 
    t = {}
      , 
    a = function() {
        $.ajax({
            url: e + "get",
            dataType: "json",
            async: !1,
            success: function(e) {
                if (!e.code)
                    return tips(e),
                    void 0;
                var a = e.data;
                t = {};
                for (var n in a)
                    t[a[n].role] = a[n];
                i(),
                Member.init()
            },
            error: function() {
                return !1
            }
        }),
        $(".group_editor .path_ext_tips").tooltip({
            placement: "bottom",
            html: !0
        }),
        $(".group_editor .warning").tooltip({
            placement: "bottom",
            html: !0,
            title: function() {
                return $(".group_tips").html()
            }
        })
    }
      , 
    i = function() {
        var e = "<tr class='title'><td width='20%'>" + LNG.group + "</td>" + "<td width=''>" + LNG.name + "</td>" + "<td width='35%'>" + LNG.action + "</td>" + "</tr>";
        for (var a in t) {
            var i = "<a href='javascript:void(0)' class='button edit'>" + LNG.button_edit + "</a>" + "<a href='javascript:void(0)' class='button del'> " + LNG.button_del + "</a>";
            "root" == t[a].role && (i = LNG.default_group_can_not_do),
            e += "<tr role='" + t[a].role + "'>" + "   <td>" + t[a].role + "</td>" + "   <td>" + t[a].name + "</td><td>" + i + "</td>"
        }
        $(".group table#list").html(e)
    }
      , 
    n = function() {
        l($(".nav .group_status")),
        $(".group_editor #role").val("").focus(),
        $(".group_editor #name").val(""),
        $(".group_editor #ext_not_allow").val($(".group_editor #ext_not_allow").attr("default")),
        $(".group_editor .tag").removeClass("this"),
        $(".group_editor input").removeAttr("checked"),
        $(".group_editor .edit_save").addClass("hidden"),
        $(".group_editor .edit_exit").addClass("hidden"),
        $(".group_editor .add_save").removeClass("hidden"),
        $(".nav .group_status").html(LNG.setting_group_add)
    }
      , 
    o = function(e) {
        var a;
        a = t[e],
        $(".group_editor .tag").removeClass("this"),
        $(".group_editor input").removeAttr("checked"),
        $(".group_editor .edit_save").removeClass("hidden"),
        $(".group_editor .edit_exit").removeClass("hidden"),
        $(".group_editor .add_save").addClass("hidden"),
        $(".nav .group_status").html(LNG.setting_group_edit),
        l($(".nav .group_status")),
        $(".group_editor #role").val(a.role).attr("data-before", a.role),
        $(".group_editor #name").val(a.name),
        $(".group_editor #ext_not_allow").val(a.ext_not_allow),
        $(".group_editor .tag").each(function() {
            var e = $(this)
              , 
            t = e.attr("data-role");
            t = t.split(";"),
            t = t[0],
            a[t] && (e.addClass("this"),
            e.find("input").attr("checked", !0))
        })
    }
      , 
    s = function() {
        var t = $(".group_editor #role").val()
          , 
        i = $(".group_editor #name").val()
          , 
        o = $(".group_editor #ext_not_allow").val()
          , 
        s = {}
          , 
        r = ""
          , 
        l = "add";
        if (void 0 == o && (o = ""),
        "" == t || "" == i)
            return tips(LNG.not_null, "error"),
            !1;
        if (escape(t).indexOf("%u") >= 0)
            return tips("名称不能为中文！", "warning"),
            !1;
        if ($(".group_editor .tag.this").each(function() {
            for (var e = $(this).attr("data-role").split(";"), t = 0; e.length > t; t++)
                s[e[t]] = 1
        }),
        $(".group_editor .add_save").hasClass("hidden")) {
            l = "edit";
            var c = $(".group_editor #role").attr("data-before");
            r = "edit&role_old=" + c + "&role=" + t + "&name=" + i + "&ext_not_allow=" + o
        } else
            r = "add&role=" + t + "&name=" + i + "&ext_not_allow=" + o;
        $.ajax({
            url: e + r,
            data: s,
            type: "POST",
            dataType: "json",
            success: function(e) {
                tips(e),
                e.code && (a(),
                "add" == l && n())
            }
        })
    }
      , 
    r = function() {
        var t = $(this).parent().parent()
          , 
        i = $(t).attr("role");
        $.dialog({
            fixed: !0,
            icon: "question",
            drag: !0,
            title: LNG.warning,
            content: LNG.if_remove + i + "?<br/>" + LNG.group_remove_tips,
            ok: function() {
                $.ajax({
                    url: e + "del&role=" + i,
                    async: !1,
                    dataType: "json",
                    success: function(e) {
                        tips(e),
                        e.code && ($(t).detach(),
                        a(),
                        l($(".nav a:eq(1)")))
                    }
                })
            },
            cancel: !0
        })
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
    c = function() {
        $(".group a.add").live("click", n),
        $(".group a.del").live("click", r),
        $(".group a.edit").live("click", function() {
            var e = $(this).parent().parent();
            o(e.attr("role"))
        }),
        $(".group_editor a.add_save").live("click", s),
        $(".group_editor a.edit_save").live("click", s),
        $(".group_editor a.edit_exit").live("click", n),
        $(".group_editor a.revert").live("click", function() {
            $(".group_editor .tag").each(function() {
                $(this).hasClass("this") ? ($(this).removeClass("this"),
                $(this).find("input").removeAttr("checked")) : ($(this).addClass("this"),
                $(this).find("input").attr("checked", !0))
            }),
            $(".group_editor .combox:eq(0) .tag:eq(0)").hasClass("this") || ($(".group_editor .combox:eq(0) .tag").removeClass("this"),
            $(".group_editor .combox:eq(0) .tag").find("input").removeAttr("checked")),
            $(".group_editor .combox:eq(1) .tag:eq(0)").hasClass("this") || ($(".group_editor .combox:eq(1) .tag").removeClass("this"),
            $(".group_editor .combox:eq(1) .tag").find("input").removeAttr("checked"))
        }),
        $(".nav a").live("click", function() {
            l($(this))
        }),
        $(".group_editor .tag").live("click", function() {
            var e = $(this);
            if (select = !1,
            e.toggleClass("this"),
            e.hasClass("this") ? (select = !0,
            e.find("input").attr("checked", !0)) : (select = !1,
            e.find("input").removeAttr("checked")),
            e.parent().hasClass("combox")) {
                var t = e.index();
                1 == t && 0 == select && (e.parent().find(".tag").removeClass("this"),
                e.parent().find("input").removeAttr("checked")),
                1 != t && 1 == select && (e.parent().find(".tag:eq(0)").addClass("this"),
                e.parent().find("input:eq(0)").attr("checked", !0))
            }
        })
    }
      , 
    d = function() {
        return t
    }
    ;
    return {
        getData: d,
        edit: o,
        init: a,
        bindEvent: c
    }
}),
define("app/src/setting/member", [], function() {
    var e, t = "index.php?member/", 
    a = "", 
    i = {}, 
    n = function() {
        i = Group.getData(),
        $.ajax({
            url: t + "get",
            dataType: "json",
            async: !1,
            success: function(t) {
                return t.code ? (e = t.data,
                o(),
                void 0) : (tips(t),
                void 0)
            },
            error: function() {
                return !1
            }
        })
    }
    , 
    o = function() {
        var t = "<tr class='title'><td width=''>" + LNG.username + "</td>" + "<td width='20%'>" + LNG.group_name + "</td>" + "<td width='35%'>" + LNG.action + "</td>" + "</tr>"
          , 
        n = objectKeys(i);
        a = "";
        for (var o = n.length - 1; o >= 0; o--) {
            var r = i[n[o]];
            a += "<option value='" + r.role + "'>" + r.name + "</option>"
        }
        for (var o in e)
            t += s(e[o].name, e[o].role);
        $(".member table#list").html(t)
    }
    , 
    s = function(e, t) {
        void 0 == e && (e = ""),
        void 0 == t && (t = "");
        var a;
        i[t] ? a = i[t].name : (a = LNG.group_not_exists,
        t = "");
        var n = "<a href='javascript:void(0)' class='button edit'>" + LNG.button_edit + "</a>  " + "<a href='javascript:void(0)' class='button del'>" + LNG.button_del + "</a>";
        "admin" == e && (n = LNG.default_group_can_not_do);
        var o = "<tr name='" + urlDecode(e) + "' role='" + t + "'>" + "   <td>" + e + "</td>" + "   <td><a href='javascript:void(0)' class='edit_role'>" + a + "</a></td>" + "   <td>" + n + "</td>" + "</tr>";
        return o
    }
    , 
    r = function(e, t, i) {
        void 0 == t && (t = ""),
        void 0 == i && (i = "");
        var n = "";
        n = "add" == e ? {
            b1: "add_save'>" + LNG.member_add,
            b2: "add_exit'>" + LNG.button_cancel
        } : {
            b1: "edit_save'>" + LNG.button_save_edit,
            b2: "edit_exit'>" + LNG.button_cancel
        };
        var o = "<tr name='" + t + "' role='" + i + "'>" + "   <td class='member'>" + LNG.username + ":<input type='text' id='name' value='" + t + "'/>" + "       <span>" + LNG.password + ":</span><input type='text' id='password'/></td>" + "   <td><select id='role' value='" + i + "'>" + a + "</select></td>" + "   <td>" + "       <a href='javascript:void(0)' class='button " + n.b1 + "</a>" + "       <a href='javascript:void(0)' class='button " + n.b2 + "</a>" + "   </td>" + "</tr>";
        return o
    }
    , 
    l = function() {
        var e = r("add");
        $(e).insertAfter(".member table#list tr:last")
    }, 
    c = function() {
        var e = $(this).parent().parent();
        $(e).detach()
    }
    , 
    d = function() {
        var e = $(this).parent().parent()
          , 
        a = urlEncode($(e).find("#name").val())
          , 
        i = urlEncode($(e).find("#password").val())
          , 
        n = $(e).find("#role").val();
        return "" == a || "" == i || "" == n ? (tips(LNG.not_null, "warning"),
        !1) : ($.ajax({
            url: t + "add&name=" + a + "&password=" + i + "&role=" + n,
            dataType: "json",
            success: function(t) {
                if (tips(t),
                t.code) {
                    var i = s(a, n);
                    $(i).insertAfter(e),
                    $(e).detach()
                }
            }
        }),
        void 0)
    }
    , 
    p = function() {
        var e = $(this).parent().parent()
          , 
        t = r("edit", $(e).attr("name"), $(e).attr("role"));
        $(".info").html(LNG.password_null_not_update).fadeIn(100),
        $(t).insertAfter(e);
        var a = $(e).attr("role");
        $(e).next().find("option[value=" + a + "]").attr("selected", "true"),
        $(e).detach()
    }
    , 
    u = function() {
        var e = $(this).parent().parent()
          , 
        t = s($(e).attr("name"), $(e).attr("role"));
        $(t).insertAfter(e),
        $(e).detach(),
        $(".info").fadeOut(100)
    }
    , 
    h = function() {
        var e = $(this).parent().parent()
          , 
        a = urlEncode($(e).attr("name"))
          , 
        i = urlEncode($(e).find("#name").val())
          , 
        n = $(e).find("#role").val()
          , 
        o = urlEncode($(e).find("#password").val());
        if ("" == i || "" == n)
            return tips(LNG.not_null, "error"),
            !1;
        var r = "";
        "" != o && (r = "&password_to=" + o),
        $.ajax({
            url: t + "edit&name=" + a + "&name_to=" + i + "&role_to=" + n + r,
            dataType: "json",
            success: function(t) {
                if (tips(t),
                t.code) {
                    var a = s(i, n);
                    $(a).insertAfter(e),
                    $(e).detach(),
                    $(".info").fadeOut(100)
                }
            }
        })
    }
    , 
    f = function() {
        var e = $(this).parent().parent()
          , 
        a = $(e).attr("name");
        $.dialog({
            fixed: !0,
            icon: "question",
            drag: !0,
            title: LNG.warning,
            content: LNG.if_remove + a + "<br/>",
            ok: function() {
                $.ajax({
                    url: t + "del&name=" + a,
                    dataType: "json",
                    async: !1,
                    success: function(t) {
                        tips(t),
                        t.code && $(e).detach()
                    }
                })
            },
            cancel: !0
        })
    }
    , 
    m = function() {
        $(".member a.add").live("click", l),
        $(".member a.add_exit").live("click", c),
        $(".member a.add_save").live("click", d),
        $(".member a.edit").live("click", p),
        $(".member a.edit_save").live("click", h),
        $(".member a.edit_exit").live("click", u),
        $(".member a.del").live("click", f),
        $(".member a.folder").live("click", function() {
            var e = $(this).parent().parent().attr("name");
            core.explorer(G.basic_path + "data/User/" + e + "/home/")
        }),
        $(".member a.edit_role").live("click", function() {
            var e = $(this).parent().parent().attr("role");
            return "" == e ? (tips(LNG.group_already_remove, !1),
            void 0) : (Group.edit(e),
            void 0)
        })
    }
    ;
    return {
        init: n,
        bindEvent: m
    }
}),
define("app/src/setting/antivirus", [], function() {
    var e, a, t = "/cgi-bin/avverify.cgi", 
    d = function() {
        var key = $("#key").val();
        var dealmethod = $("input[name='deal']:checked").val();
        if ($("#antivirus_file").attr("checked")) {
         a = 1;
        }
        else {
        	a = 0;
        }
        if ("" == key){
            return tips(LNG.antivirus_not_null, "error");
        }
        if(!dealmethod){
            return tips(LNG.antivirus_deal_not_null, "error");
        }
				$.ajax({
            url: t + "?key=" + key + "&antivirus_file=" + a + "&antivirus_policy=" + dealmethod,
            dataType: "json",
            success: function(e) {
                if (e.code){
                    $("#signatures").val(e.signature);
                    $("#update").val(e.updatetime);
                    $("#expire").val(e.expiredate);
                    tips(LNG.success);
                }
                else{
                    tips(LNG.antivirus_invalid_key,"error");
                }
                
            }
        })
    },
    update=function(){
        $.ajax({
            url: '/cgi-bin/avupgrade.cgi',
            dataType: "json",
            success: function(res) {
                if (res.code == 200){
                    tips("病毒库升级已启动");
                }
                else{
                    tips(res.msg,false);
                }
            }
        });
    },
    m = function() {
        $(".antivirus a.av_save").live("click", d);
        $(".antivirus a.av_update").live("click", update);
    }
    ;
    return {
        bindEvent: m
    }
}),
define("app/src/setting/system", [], function() {
    var e = function() {
        $("input[name='first_in']").live("click", function() {
            $("input[name='first_in']").removeAttr("checked"),
            $(this).attr("checked", "checked")
        }),
        $(".system_save").live("click", function() {
            var e = {};
            $(".system_setting .box_line input").each(function() {
                var t = $(this);
                if ("checkbox" == t.attr("type")) {
                    var a = void 0 == t.attr("checked") ? "0" : "1";
                    e[t.attr("name")] = a
                } else
                    "radius" != t.attr("type") && (e[t.attr("name")] = urlEncode(t.val()))
            }),
            e.first_in = $("input[name='first_in'][checked]").val(),
            a(e)
        }),
        $(".system_save_all").live("click", function() {
        	$.ajax({
            url: "index.php?setting/savecfg",
            dataType: "json",
            success: function(e) {
                tips(e)
            }
        	})
        }),
        $(".reboot").live("click", function() {
        	$.dialog({
            fixed: !0,
            icon: "question",
            drag: !0,
            title: LNG.warning,
            content: LNG.if_reboot + "?" +"<br/>",
            ok: function() {
                $.ajax({
                    url: "index.php?setting/reboot",
                    dataType: "json",
                    async: !1,
                    success: function(t) {
                        tips(t);
                        $('.rebootdom',window.parent.document).removeClass('hidden');
          var progresswidth = 0;
          var rebootsever = setInterval(() => {
				if(progresswidth + 3 < 99){
					$('.rebootdom #rebootdom_text', window.parent.document).text("正在重启中");
					progresswidth += 3;
				$('.rebootdom #rebootdom_progress_bar', window.parent.document).css('width', progresswidth + '%');
                $('.rebootdom #rebootdom_progress_value', window.parent.document).text(progresswidth + '%');
                }
                
                $.ajax({
                    url: "cgi-bin/ready.cgi",
                    dataType:'json',
                    type:'GET',
                    success: function(t) {
                        if(t.code == 200){
                            if(!rebootsever){
                                return false;
                            }
                            clearInterval(rebootsever);
                            rebootsever = null;
                                            $('.rebootdom #rebootdom_progress_bar', window.parent.document).css('width', '100%');
                                                    $('.rebootdom #rebootdom_progress_value', window.parent.document).text('100%');
                                    setTimeout(() => {
                                     $('.rebootdom',window.parent.document).addClass('hidden');
                                    //  $('.aui_close',window.parent.document)[0].click();
                                    window.parent.location.reload();
                                    }, 1000); 
                            }
                                    
                                          if (t.code == 400) {
                                            alert(t.msg);
                                            $('.rebootdom', window.parent.document).addClass('hidden');
                                        }
                    }
                    });
			},2000);
		  
                        
                    }
                });
            },
            cancel: !0
        })
      	}),
        t(),
        $(".path_ext_tips").die("click").live("click", function() {
            art.dialog.open("./index.php?setting/php_info", {
                title: "php_info",
                width: "70%",
                height: "65%",
                resize: !0
            })
        }),
        $(".license_setting").die("click").live("click", function() {
            art.dialog.open("./index.php?setting/licence", {
                title: LNG.system_license,
                width: "70%",
                height: "65%",
                resize: !0
            })
        }),
        $(".upgrade_software").die("click").live("click", function() {
            art.dialog.open("./index.php?setting/upgrade", {
                title: LNG.upgrade_software,
                width: "400px",
                height: "380px",
                drag:!1,
                resize: !1,
                lock:!0
            })
        })
    }
      , 
    t = function() {
        $('.setting_menu .menu_list input[name="target"]').live("click", function() {
            "_blank" == $(this).val() ? ($(this).val("_self"),
            $(this).removeAttr("checked")) : ($(this).val("_blank"),
            $(this).attr("checked", "checked"))
        }),
        $(".system_menu_add").live("click", function() {
            var e = $(".menu_default").clone().removeClass("menu_default hidden").addClass("menu_list");
            e.insertAfter(".setting_menu .menu_list:last")
        }),
        $(".setting_menu .menu_list .move_up").live("click", function() {
            var e = $(this).parent().parent();
            e.prev().hasClass("menu_list") && e.insertBefore(e.prev())
        }),
        $(".setting_menu .menu_list .move_down").live("click", function() {
            var e = $(this).parent().parent();
            e.next().hasClass("menu_list") && e.insertAfter(e.next())
        }),
        $(".setting_menu .menu_list .move_hidden").live("click", function() {
            var e = $(this).parent().parent();
            e.hasClass("menu_hidden") ? (e.removeClass("menu_hidden"),
            $(this).text(LNG.menu_hidden)) : (e.addClass("menu_hidden"),
            $(this).text(LNG.menu_show))
        }),
        $(".setting_menu .menu_list .move_del").live("click", function() {
            var e = $(this).parent().parent();
            e.remove()
        }),
        $(".system_menu_save").live("click", function() {
            var e = [];
            $(".setting_menu .menu_list").each(function() {
                var t = $(this), 
                a = {};
                t.hasClass("menu_default") || (t.find("input").each(function() {
                    a[$(this).attr("name")] = urlEncode($(this).attr("value"))
                }),
                "" != a.name && (a.use = "1",
                a.type = "",
                t.hasClass("menu_hidden") && (a.use = "0"),
                t.hasClass("menu_system") && (a.type = "system"),
                e.push(a)))
            }),
            a({
                menu: e
            })
        })
    }
      , 
    a = function(e) {
        $.ajax({
            url: "index.php?setting/system_setting",
            type: "POST",
            data: "data=" + urlEncode(json_encode(e)),
            dataType: "json",
            success: function(e) {
                tips(e)
            }
        })
    }
    ;
    return {
        bindEvent: e
    }
});
