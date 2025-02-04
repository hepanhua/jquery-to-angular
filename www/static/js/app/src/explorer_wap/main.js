define("app/src/explorer_wap/main", ["lib/jquery-lib", "lib/util", "lib/artDialog/jquery-artDialog", "./ui", "../../common/core", "../../tpl/copyright.html", "../../tpl/search.html", "../../tpl/search_list.html", "../../tpl/upload.html", "./path", "../../common/pathOperate", "../../tpl/fileinfo/file_info.html", "../../tpl/fileinfo/path_info.html", "../../tpl/fileinfo/path_info_more.html", "../../tpl/share.html", "../../tpl/app.html", "../../common/pathOpen", "../../common/CMPlayer"], function(e) {
    Config = {
        BodyContent: ".bodymain",
        FileBoxSelector: ".fileContiner",
        FileBoxClass: ".fileContiner .file",
        FileBoxClassName: "file",
        FileBoxTittleClass: ".fileContiner .title",
        SelectClass: ".fileContiner .select",
        SelectClassName: "select",
        TypeFolderClass: "folderBox",
        TypeFileClass: "fileBox",
        HoverClassName: "hover",
        FileOrderAttr: "number",
        TreeId: "folderList",
        pageApp: "explorer_wap",
        treeAjaxURL: "index.php?explorer/treeList&app=explorer",
        AnimateTime: 200
    },
    Global = {
        fileListAll: "",
        fileListNum: 0,
        fileRowNum: 0,
        frameLeftWidth: 200,
        treeSpaceWide: 10,
        topbar_height: 40,
        ctrlKey: !1,
        shiftKey: !1,
        fileListSelect: "",
        fileListSelectNum: "",
        isIE: !-[1],
        isDragSelect: !1,
        historyStatus: {
            back: 1,
            next: 0
        }
    },
    e("lib/jquery-lib"),
    e("lib/util"),
    e("lib/artDialog/jquery-artDialog"),
    ui = e("./ui"),
    core = e("../../common/core"),
    ui.path = e("./path"),
    $(document).ready(function() {
        e.async("lib/webuploader/webuploader-min", function() {
            core.upload_init()
        }),
        ui.init(),
        core.update()
    })
}),
define("app/src/explorer_wap/ui", [], function(require, exports) {
    var _ajaxLive = function() {
        $(".fileContiner .picture img").lazyload({
            container: $(".bodymain")
        })
    }
      , _sortBy = function(e, t) {
        var t = "down" == t ? -1 : 1;
        return function(a, i) {
            return a = a[e],
            i = i[e],
            i > a ? -1 * t : a > i ? 1 * t : void 0
        }
    }
      , _setListSort = function(e, t) {
        0 != e && (G.sort_field = e,
        $(".menu_set_sort").removeClass("selected"),
        $(".set_sort_" + e).addClass("selected")),
        0 != t && (G.sort_order = t,
        $(".menu_set_desc").removeClass("selected"),
        $(".set_sort_" + t).addClass("selected")),
        _f5(!1, !0),
        $.ajax({
            url: "index.php?setting/set&k=list_sort_field,list_sort_order&v=" + G.sort_field + "," + G.sort_order
        })
    }
      , _jsonSortTitle = function() {
        var up = '<i class="font-icon icon-chevron-up"></i>'
          , down = '<i class="font-icon icon-chevron-down"></i>';
        $("#main_title .this").toggleClass("this").attr("id", "").find("span").html(""),
        $("#main_title div[field=" + G.sort_field + "]").addClass("this").attr("id", G.sort_order).find("span").html(eval(G.sort_order))
    }
      , _menuActionBind = function() {
        $(".drop-menu-action li").bind("click", function() {
            if (!$(this).hasClass("disabled")) {
                var e = $(this).attr("id");
                switch (e) {
                case "past":
                    ui.path.past();
                    break;
                case "info":
                    ui.path.info();
                    break;
                default:
                }
            }
        })
    }
    ;
    this._getFolderBoxList = function(e) {
        var t = e.name;
        "number" == typeof e.exists && 0 == e.exists && (t = '<b style="color:red;">' + t + "</b>");
        var a = "<div class='file folderBox menufolder' onclick=''>";
        return a += "	<div class='folder ico' filetype='folder'></div>",
        a += "	<div id='" + e.name + "' class='titleBox'><span class='title' title='" + LNG.double_click_rename + "'>" + t + "</span></div>",
        a += "	<div class='filesize'></div>",
        a += "	<div class='filetime'>" + e.mtime + "</div>",
        a += "	<div style='clear:both'></div>",
        a += "</div>"
    }
    ,
    this._getFileBoxList = function(e) {
        var t = ""
          , a = e.name;
        if ("number" == typeof e.exists && 0 == e.exists && (a = '<b style="color:red;">' + a + "</b>"),
        "oexe" == e.ext) {
            var i = urlEncode(json_encode(e));
            t = "<div class='file fileBox menufile' data-app=" + i + " onclick=''>",
            a = a.replace(".oexe", ""),
            "app_link" == e.type ? (t += 0 == e.content.search("ui.path.open") ? "<div class='" + core.pathExt(e.name.replace(".oexe", "")) + " ico'" : "<div class='folder ico'",
            t += ' filetype="oexe"></div><div class="app_link"></div>') : t += "<div class='oexe ico' filetype='oexe'></div>"
        } else if (inArray(core.filetype.image, e.ext)) {
            var n = core.path2url(G.this_path + e.name)
              , o = "index.php?explorer/image&path=" + urlEncode(G.this_path + e.name);
            t += "<div picasa='" + n + "' thumb='" + o + "' class='picasaImage file fileBox menufile' onclick=''>",
            t += "	<div class='" + e.ext + " ico' filetype='" + e.ext + "'></div>"
        } else
            t += "<div class='file fileBox menufile'  onclick=''>",
            t += "	<div class='" + e.ext + " ico' filetype='" + e.ext + "'></div>";
        return t += "	<div id='" + e.name + "' class='titleBox'><span class='title' title='" + LNG.double_click_rename + "'>" + a + "</span></div>",
        t += "	<div class='filesize'>" + e.size_friendly + "</div>",
        t += "	<div class='filetime'>" + e.mtime + "</div>",
        t += "	<div style='clear:both'></div>",
        t += "</div>"
    };
    var _mainSetData = function(e) {
        G.json_data && G.json_data.filelist && G.json_data.folderlist || _mainSetDataShare();
        var t = ""
          , a = G.json_data.folderlist
          , i = G.json_data.filelist;
        a = "size" == G.sort_field || "ext" == G.sort_field ? a.sort(_sortBy("name", G.sort_order)) : a.sort(_sortBy(G.sort_field, G.sort_order)),
        i = i.sort(_sortBy(G.sort_field, G.sort_order)),
        G.json_data.folderlist = a,
        G.json_data.filelist = i;
        for (var n = "_getFileBoxList", o = "_getFolderBoxList", s = "", r = "", l = 0; i.length > l; l++)
            s += this[n](i[l]);
        for (var l = 0; a.length > l; l++)
            r += this[o](a[l]);
        t = "up" == G.sort_order ? r + s : s + r,
        "" == t && (t = '<div style="text-align:center;color:#aaa;">' + LNG.path_null + "</div>"),
        t += "<div style='clear:both'></div>",
        e ? $(Config.FileBoxSelector).hide().html(t).fadeIn(Config.AnimateTime) : $(Config.FileBoxSelector).html(t),
        $('<i class="file-action icon-font icon-ellipsis-horizontal"></i>').appendTo(Config.FileBoxClass),
        $(Config.FileBoxSelector + " .file:nth-child(2n)").addClass("file2"),
        _ajaxLive()
    }
      , _f5 = function(e, t) {
        void 0 == e && (e = !0),
        void 0 == t && (t = !1),
        _jsonSortTitle(),
        e ? $.ajax({
            url: "index.php?explorer/pathList&path=" + urlEncode(G.this_path),
            dataType: "json",
            beforeSend: function() {
                $(".tools-left .msg").stop(!0, !0).fadeIn(100)
            },
            success: function(e) {
                return $(".tools-left .msg").fadeOut(100),
                e.code ? (G.json_data = e.data,
                _f5_time_user(),
                Global.historyStatus = G.json_data.history_status,
                _mainSetData(t),
                ui.header.addressSet(),
                void 0) : (core.tips.tips(e),
                $(Config.FileBoxSelector).html(""),
                !1)
            },
            error: function(e, t, a) {
                $(".tools-left .msg").fadeOut(100),
                $(Config.FileBoxSelector).html(""),
                core.ajaxError(e, t, a)
            }
        }) : (fileLight.getAllName(),
        _mainSetData(t))
    }
      , _f5_callback = function(e) {
        _f5(!0, !1, e)
    }
      , _f5_time_user = function() {
        if (G.json_data && G.json_data.filelist && G.json_data.folderlist) {
            for (var e = 0; G.json_data.filelist.length > e; e++)
                if (G.json_data.filelist[e].atime = date(LNG.time_type, G.json_data.filelist[e].atime),
                G.json_data.filelist[e].ctime = date(LNG.time_type, G.json_data.filelist[e].ctime),
                "*share*/" == G.this_path) {
                    var t = parseInt(G.json_data.filelist[e].num_view);
                    t = isNaN(t) ? 0 : t;
                    var a = parseInt(G.json_data.filelist[e].num_download);
                    a = isNaN(a) ? 0 : a;
                    var i = date("Y/m/d ", G.json_data.filelist[e].mtime) + "  ";
                    i += LNG.share_view_num + t + "  " + LNG.share_download_num + a,
                    G.json_data.filelist[e].mtime = i
                } else
                    G.json_data.filelist[e].mtime = date(LNG.time_type, G.json_data.filelist[e].mtime);
            for (var e = 0; G.json_data.folderlist.length > e; e++)
                if (G.json_data.folderlist[e].atime = date(LNG.time_type, G.json_data.folderlist[e].atime),
                G.json_data.folderlist[e].ctime = date(LNG.time_type, G.json_data.folderlist[e].ctime),
                "*share*/" == G.this_path) {
                    var t = parseInt(G.json_data.folderlist[e].num_view);
                    t = isNaN(t) ? 0 : t;
                    var a = parseInt(G.json_data.folderlist[e].num_download);
                    a = isNaN(a) ? 0 : a;
                    var i = date("Y/m/d ", G.json_data.folderlist[e].mtime) + "  ";
                    i += LNG.share_view_num + t + "  " + LNG.share_download_num + a,
                    G.json_data.folderlist[e].mtime = i
                } else
                    G.json_data.folderlist[e].mtime = date(LNG.time_type, G.json_data.folderlist[e].mtime)
        }
    }
      , _toolsAction = function(e) {
        switch (e) {
        case "refresh":
            ui.f5();
            break;
        case "newfolder":
            ui.path.newFolder();
            break;
        case "upload":
            core.upload();
            break;
        default:
        }
    }
      , _fileMenuAction = function(e, t) {
        var a = e.find(".titleBox").attr("id")
          , i = e.find(".ico").attr("filetype");
        switch (t) {
        case "action_copy":
            ui.path.copy(a, i);
            break;
        case "action_rname":
            ui.path.rname(a);
            break;
        case "action_info":
            ui.path.info(a, i);
            break;
        case "action_remove":
            ui.path.remove(a, i);
            break;
        default:
        }
    }
      , _fileActionBind = function() {
        $(window).bind("hashchange", function() {
            var e = window.location.href
              , t = e.split("#");
            "" != t[1] && t[1] != G.this_path && ui.path.list(t[1])
        }),
        $(".fileContiner .file").die("click").live("click", function(e) {
            if ($(".fileContiner .file .file_action_menu").animate({
                left: "100%"
            }, 300, 0, function() {
                $(this).remove()
            }),
            $(this).find(".file_action_menu").length > 0) {
                if ($(e.target).hasClass("action_menu")) {
                    var t = $(e.target).attr("data-action");
                    _fileMenuAction($(this), t)
                }
                if ($(e.target).parent().hasClass("action_menu")) {
                    var t = $(e.target).parent().attr("data-action");
                    _fileMenuAction($(this), t)
                }
            } else {
                if ($(e.target).hasClass("file-action")) {
                    var a = $(".common_footer .file_action_menu").clone();
                    return a.appendTo($(this)),
                    a.removeClass("hidden").css({
                        left: "100%"
                    }).animate({
                        left: "0%"
                    }, 300, 0, function() {}),
                    void 0
                }
                var i = $(this).find(".ico").attr("filetype")
                  , n = $(this).find(".titleBox").attr("id");
                ui.path.open(G.this_path + n, i),
                stopPP(e)
            }
        }),
        $(".address li").die("click").live("click", function(e) {
            var t = $(this).find("a").attr("title");
            ui.path.list(t),
            stopPP(e)
        })
    }
    ;
    return {
        f5: _f5,
        f5_callback: _f5_callback,
        init: function() {
            _f5_callback(function() {
                _f5(!1, !0)
            }),
            _fileActionBind(),
            ui.header.bindEvent()
        },
        header: {
            bindEvent: function() {
                $(".right_tool").on("click", function() {
                    $(this).parent().toggleClass("open")
                }),
                $(".left_tool").on("click", function() {
                    $("body").toggleClass("menu-open")
                }),
                $(".panel-menu li").on("click", function() {
                    $("body").removeClass("menu-open");
                    var e = $(this).attr("data-action");
                    switch (e) {
                    case "public":
                        ui.path.list("*usbox*/");
                        break;
                    case "my_doc":
                        ui.path.list(G.myhome);
                        break;
                    case "my_desktop":
                        ui.path.list(G.myhome + "/desktop/");
                        break;
                    case "exit":
                        window.location.href = "./index.php?user/logout";
                        break;
                    default:
                    }
                }),
                $(".menu-right_tool li").on("click", function() {
                    $(".menu_group").removeClass("open");
                    var e = $(this).attr("data-action");
                    switch (e) {
                    case "upload":
                        core.upload();
                        break;
                    case "newfolder":
                        ui.path.newFolder();
                        break;
                    case "past":
                        ui.path.past();
                        break;
                    default:
                    }
                })
            },
            addressSet: function() {
                var e = G.this_path
                  , t = function(e) {
                    var t = '<li class="item" onclick=""><a title="@1@" style="z-index:{$2};">{$3}</a><i>></i></li>\n';
                    e = e.replace(/\/+/g, "/");
                    var a = e.split("/");
                    "" == a[a.length - 1] && a.pop();
                    var i = a[0] + "/"
                      , n = t.replace(/@1@/g, i)
                      , o = a[0];
                    "" != a[0] ? "*share*" == o ? o = LNG.my_share : "*usbox*" == o ? o =  LNG.secros_name_desc : "*recycle*" == o && (o = LNG.recycle) : o = LNG.secros_name_desc,
                    n = n.replace("{$2}", a.length),
                    n = n.replace("{$3}", o);
                    for (var s = n, r = 1, l = a.length - 1; a.length > r; r++,
                    l--)
                        i += a[r] + "/",
                        n = t.replace(/@1@/g, i),
                        n = n.replace("{$2}", l),
                        n = n.replace("{$3}", a[r]),
                        s += n;
                    return s
                }
                ;
                $(".frame-main .address ul").html(t(e))
            },
            gotoPath: function() {
                var e = $("input.path").val();
                e = e.replace(/\\/g, "/"),
                $("input.path").val(e),
                "/" != e.substr(e.length - 1, 1) && (e += "/"),
                ui.path.list(e),
                ui.header.addressSet()
            }
        }
    }
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
              , a = ["folder", "file", "edit", "search", "up", "setting", "appStore", "error", "info", "mp3", "flv", "pdf", "doc", "xls", "ppt", "html", "swf"]
              , i = $.inArray(e, a);
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
              , a = t[t.length - 1];
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
              , a = '<div class="ajaxError">' + t + "</div>"
              , i = $.dialog.list.ajaxErrorDialog;
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
              , t = template.compile(e)
              , a = t({
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
            /*var e = base64_decode("aHR0cDovL3d3dy5hbnlzZWMuY29tL3VwZGF0ZS9tYWluLmpz") + "?a=" + UUID();
            require.async(e, function() {
                try {} catch (e) {}
            })*/
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
            var a, i, n = require("../tpl/search.html"), o = require("../tpl/search_list.html"), s = function() {
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
            , r = function() {
                i = {
                    search: $("#search_value").val(),
                    path: $("#search_path").val(),
                    is_content: $("#search_is_content").attr("checked"),
                    is_case: $("#search_is_case").attr("checked"),
                    ext: $("#search_ext").val()
                },
                c(i)
            }
            , l = function() {
                $("#search_value").die("keyup").live("keyup", function() {
                    ui.path.setSearchByStr($(this).val())
                }),
                $("#search_value,#search_ext,#search_path").keyEnter(r),
                $(".search_header a.button").die("click").live("click", r),
                $(".search_result .list .name").die("click").live("click", function() {
                    var e = $(this).find("a").html()
                      , t = $(this).parent().find(".path a").html() + e;
                    $(this).parent().hasClass("file") ? ui.pathOpen.open(t) : "explorer" == Config.pageApp ? ui.path.list(t + "/", "tips") : core.explorer(t + "/")
                }),
                $(".search_result .list .path a").die("click").live("click", function() {
                    var e = $(this).html();
                    "explorer" == Config.pageApp ? ui.path.list(e, "tips") : core.explorer(e)
                })
            }
            , c = function(e) {
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
              , a = t.find("#download_list")
              , i = t.find("input").val();
            if (t.find("input").val(""),
            !i || "http" != i.substr(0, 4))
                return core.tips.tips("url false!", !1),
                void 0;
            var n = UUID()
              , o = '<div id="' + n + '" class="item">' + '<div class="info"><span class="title" tytle="' + i + '">' + core.pathThis(i) + "</span>" + '<span class="size">0b</span>' + '<span class="state">' + LNG.upload_ready + "</span>" + '<a class="remove font-icon icon-remove" href="javascript:void(0)"></a>' + '<div style="clear:both"></div></div></div>';
            a.find(".item").length > 0 ? $(o).insertBefore(a.find(".item:eq(0)")) : a.append(o);
            var s, r, l, c = 0, d = $("#" + n), p = $("#" + n + " .state").text(LNG.download_ready), u = $('<div class="progress progress-striped active"><div class="progress-bar" role="progressbar" style="width: 0%;text-align:right;"></div></div>').appendTo("#" + n).find(".progress-bar");
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
                          , a = e.data;
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
              , a = template.compile(t)
              , i = WebUploader.Base.formatSize(G.upload_max);
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
              , t = !0;
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
              , n = 0
              , o = "0B/s"
              , s = function(e, t) {
                var a = e.size * t
                  , i = 5;
                e.speed === void 0 ? e.speed = [[time() - 500, 0], [time(), a]] : i >= e.speed.length ? e.speed.push([time(), a]) : (e.speed = e.speed.slice(1, i),
                e.speed.push([time(), a]));
                var n = e.speed[e.speed.length - 1]
                  , s = e.speed[0]
                  , r = (n[1] - s[1]) / ((n[0] - s[0]) / 1e3);
                return r = core.file_size(r) + "/s",
                o = r,
                r
            }
              , r = [];
            uploader.on("uploadBeforeSend", function(e, t) {
                var a = urlEncode(e.file.fullPath);
                (void 0 == a || "undefined" == a) && (a = ""),
                t.fullPath = a
            }).on("fileQueued", function(t) {
                if (!core.upload_check())
                    return uploader.skipFile(t),
                    uploader.removeFile(t),
                    void 0;
                var a, n = $(e), a = t.fullPath;
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
                  , r = $("#" + e.id)
                  , l = r.find(".progress .progress-bar");
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
define("app/tpl/upload.html", [], "<div class='file_upload'>\n    <div class='top_nav'>\n       <a href='javascript:void(0);' class='menu this tab_upload'>{{LNG.upload_local}}</a>\n    <!--   <a href='javascript:void(0);' class='menu tab_download''>{{LNG.download_from_server}}</a>\n  -->     <div style='clear:both'></div>\n    </div>\n    <div class='upload_box'>\n        <div class='btns'>\n            <div id='picker'>{{LNG.upload_select}}</div>\n            <div class=\"upload_box_tips\">\n            <a href=\"javascript:void(0);\" class=\"upload_box_clear\">{{LNG.upload_clear}}</a> \n            <!-- \n            | <a href=\"javascript:void(0);\" class=\"upload_box_setting\">\n            {{LNG.upload_setting}}<b class=\"caret\"></b></a> \n            -->\n            </div>\n            <div style='clear:both'></div>\n        </div>\n\n        <div class=\"upload_box_config hidden\">\n            <i>{{LNG.upload_tips}}</i>\n            <div class=\"upload_check_box\">\n                <b>{{LNG.upload_exist}}</b>\n                <label><input type=\"radio\" name=\"existing\" value=\"rename\" checked=\"checked\">{{LNG.upload_exist_rename}}</label>\n                <label><input type=\"radio\" name=\"existing\" value=\"replace\">{{LNG.upload_exist_replace}}</label>\n                <label><input type=\"radio\" name=\"existing\" value=\"skip\">{{LNG.upload_exist_skip}}</label>\n            </div>\n        </div>\n        <div id='uploader' class='wu-example'>\n            <div id='thelist' class='uploader-list'></div>\n        </div>\n    </div>\n    <div class='download_box hidden'>\n        <div class='list'>{{LNG.download_address}}<input type='text' name='url'/>\n        <button class='btn btn-default btn-sm' type='button'>{{LNG.download}}</button>\n        </div>\n        <div style='clear:both'></div>\n        <div id='downloader'>\n            <div id='download_list' class='uploader-list'></div>\n        </div>\n    </div>\n</div>"),
define("app/src/explorer_wap/path", ["../../common/pathOperate", "../../tpl/fileinfo/file_info.html", "../../tpl/fileinfo/path_info.html", "../../tpl/fileinfo/path_info_more.html", "../../tpl/share.html", "../../tpl/app.html", "../../common/pathOpen", "../../common/CMPlayer"], function(e) {
    var t = e("../../common/pathOperate")
      , a = e("../../common/pathOpen");
    ui.pathOpen = a;
    var n = function(e, t, a) {
        if (void 0 != e) {
            if (e == G.this_path)
                return void 0 != t && "" != t && core.tips.tips(LNG.path_is_current, "info"),
                void 0;
            G.this_path = e.replace(/\\/g, "/"),
            G.this_path = e.replace(/\/+/g, "/"),
            "/" != G.this_path.substr(G.this_path.length - 1) && (G.this_path += "/"),
            window.location.href = "index.php#" + G.this_path,
            ui.f5_callback(function() {
                "function" == typeof a && a()
            })
        }
    }
      , o = function(e, t) {
        if (void 0 != e) {
            if ("folder" == t)
                return ui.path.list(e + "/"),
                void 0;
            var a = core.path2url(e)
              , i = ["pdf", "mp4", "mp3", "wma", "m4v", "mov"];
            if (inArray(core.filetype.image, t) || inArray(i, t) || inArray(core.filetype.text, t) || inArray(core.filetype.code, t))
                window.location.href = a;
            else {
                var n = "index.php?explorer/fileDownload&path=" + urlEncode2(e)
                  , o = '<div class="unknow_file" style="width:200px;word-break: break-all;"><span>' + LNG.unknow_file_tips + "<br/>" + '</span><br/><a class="btn btn-success btn-sm" href="' + n + '"> ' + LNG.unknow_file_download + " </a></div>";
                $.dialog({
                    fixed: !0,
                    icon: "warning",
                    width: 30,
                    lock: !0,
                    background: "#000",
                    opacity: .2,
                    title: LNG.unknow_file_title,
                    padding: 10,
                    content: o,
                    cancel: !0
                })
            }
        }
    }
      , s = function(e, t, a) {
        var n = e.length;
        for (i = 0; n > i; i++)
            if (e[i][t] == a)
                return e[i]
    }
      , r = function(e) {
        var t = ""
          , a = 0;
        return null  != G.json_data.filelist && (t = s(G.json_data.filelist, "name", e),
        null  != t && (a = 1)),
        null  != G.json_data.folderlist && (t = s(G.json_data.folderlist, "name", e),
        null  != t && (a = 1)),
        a
    }
      , l = function(e, t) {
        var a, i = 0;
        if (void 0 == t) {
            if (!r(e))
                return e;
            for (a = e + "(0)"; r(a); )
                i++,
                a = e + "(" + i + ")";
            return a
        }
        if (!r(e + "." + t))
            return e + "." + t;
        for (a = e + "(0)." + t; r(a); )
            i++,
            a = e + "(" + i + ")." + t;
        return a
    }
      , c = function() {
        artDialog.prompt("", function(e) {
            t.newFolder(G.this_path + e, function() {
                ui.f5()
            })
        }, l("folder"))
    }
      , d = function(e) {
        artDialog.prompt("", function(a) {
            var i = urlEncode(G.this_path + e)
              , n = urlEncode(G.this_path + a);
            t.rname(i, n, function() {
                ui.f5()
            })
        }, e)
    }
      , p = function(e, t, a) {
        return "folder" != a && (a = "file"),
        e ? [{
            path: G.this_path + t,
            type: a
        }] : {
            path: G.this_path + t,
            type: a
        }
    }
    ;
    return {
        pathOperate: t,
        remove: function(e, a) {
            t.remove(p(!0, e, a), null )
        },
        copy: function(e, a) {
            t.copy(p(!0, e, a))
        },
        cute: function(e, a) {
            t.cute(p(!0, e, a), ui.f5)
        },
        info: function(e, a) {
            t.info(p(!0, e, a))
        },
        past: function() {
            t.past(G.this_path, ui.f5)
        },
        open: o,
        list: n,
        newFolder: c,
        rname: d
    }
}),
define("app/common/pathOperate", [], function(e) {
    var t = {};
    t.file_info = e("../tpl/fileinfo/file_info.html"),
    t.path_info = e("../tpl/fileinfo/path_info.html"),
    t.path_info_more = e("../tpl/fileinfo/path_info_more.html");
    var a = ["/", "\\", ":", "*", "?", '"', "<", ">", "|"]
      , i = function(e) {
        var t = function(e, t) {
            for (var a = t.length, i = 0; a > i; i++)
                if (e.indexOf(t[i]) > 0)
                    return !0;
            return !1
        }
        ;
        return t(e, a) ? (core.tips.tips(LNG.path_not_allow + ':/  : * ? " < > |', !1),
        !1) : !0
    }
      , n = function(e) {
        for (var t = "list=[", a = 0; e.length > a; a++)
            t += '{"type":"' + e[a].type + '","path":"' + urlEncode2(e[a].path) + '"}',
            e.length - 1 > a && (t += ",");
        return t + "]"
    }
      , o = function(e, t) {
        if (e) {
            var a = core.pathThis(e);
            return i(a) ? ($.ajax({
                dataType: "json",
                url: "index.php?explorer/mkfile&path=" + urlEncode2(e),
                beforeSend: function() {
                    core.tips.loading()
                },
                error: core.ajaxError,
                success: function(e) {
                    core.tips.close(e),
                    "function" == typeof t && t(e)
                }
            }),
            void 0) : ("function" == typeof t && t(),
            void 0)
        }
    }
      , s = function(e, t) {
        if (e) {
            var a = core.pathThis(e);
            return i(a) ? ($.ajax({
                dataType: "json",
                url: "index.php?explorer/mkdir&path=" + urlEncode2(e),
                beforeSend: function() {
                    core.tips.loading()
                },
                error: core.ajaxError,
                success: function(e) {
                    core.tips.close(e),
                    "function" == typeof t && t(e)
                }
            }),
            void 0) : ("function" == typeof t && t(),
            void 0)
        }
    }
      , r = function(e, t, a) {
        return e && t && e != t ? i(core.pathThis(t)) ? ($.ajax({
            type: "POST",
            dataType: "json",
            url: "index.php?explorer/pathRname",
            data: "path=" + urlEncode(e) + "&rname_to=" + urlEncode(t),
            beforeSend: function() {
                core.tips.loading()
            },
            error: core.ajaxError,
            success: function(e) {
                core.tips.close(e),
                "function" == typeof a && a(e)
            }
        }),
        void 0) : ("function" == typeof a && a(),
        void 0) : void 0
    }
      , l = function(e, t) {
        if (!(1 > e.length)) {
            var a = e[0].path
              , i = LNG.remove_title
              , o = a + "<br/><br/>" + LNG.remove_info
              , s = "index.php?explorer/pathDelete";
            "*recycle*/" == G.this_path && (o = LNG.recycle_remove + "?",
            s = "index.php?explorer/pathDeleteRecycle",
            i = LNG.recycle_remove),
            "share" == e[0].type && (o = LNG.share_remove_tips,
            s = "index.php?userShare/del",
            i = LNG.share_remove),
            e.length > 1 && (o += ' ... <span class="badge">' + e.length + "</span>"),
            $.dialog({
                id: "dialog_path_remove",
                fixed: !0,
                icon: "question",
                title: i,
                padding: 20,
                width: 200,
                lock: !0,
                background: "#000",
                opacity: .3,
                content: o,
                ok: function() {
                    $.ajax({
                        url: s,
                        type: "POST",
                        dataType: "json",
                        data: n(e),
                        beforeSend: function() {
                            core.tips.loading()
                        },
                        error: core.ajaxError,
                        success: function(a) {
                            if (core.tips.close(a),
                            FrameCall.father("ui.f5", ""),
                            "share" == e[0].type) {
                                var i = art.dialog.list.share_dialog;
                                void 0 != i && i.close()
                            }
                            "function" == typeof t && t(a)
                        }
                    })
                },
                cancel: !0
            })
        }
    }
      , c = function(e) {
        1 > e.length || $.ajax({
            url: "index.php?explorer/pathCopy",
            type: "POST",
            dataType: "json",
            data: n(e),
            error: core.ajaxError,
            success: function(e) {
                core.tips.tips(e)
            }
        })
    }
      , d = function(e) {
        var t = e.path
          , a = "folder" == e.type ? "folder" : "file";
        1 > t.length || core.authCheck("userShare:set") && $.ajax({
            url: "./index.php?userShare/checkByPath&path=" + urlEncode(t),
            dataType: "json",
            success: function(e) {
                e.code ? p(e.data) : p(void 0, function() {
                    $(".content_info input[name=type]").val(a),
                    $(".content_info input[name=path]").val(t),
                    $(".content_info input[name=name]").val(core.pathThis(t)),
                    "file" == a && $(".label_code_read").addClass("hidden")
                })
            }
        })
    }
      , p = function(t, a) {
        0 != $(".share_dialog").length && $(".share_dialog").shake(2, 5, 100),
        seajs.use("lib/jquery.datetimepicker/jquery.datetimepicker.css"),
        e.async("lib/jquery.datetimepicker/jquery.datetimepicker", function() {
            u(t),
            void 0 != a && a()
        })
    }
      , u = function(t) {
        var a = e("../tpl/share.html")
          , i = template.compile(a)
          , n = i({
            LNG: LNG
        });
        $.dialog({
            id: "share_dialog",
            simple: !0,
            resize: !1,
            width: 425,
            title: LNG.share,
            padding: "0",
            fixed: !0,
            content: n,
            cancel: function() {}
        });
        var o = "zh_CN" == G.lang ? "ch" : "en";
        $("#share_time").datetimepicker({
            format: "Y/m/d",
            formatDate: "Y/m/d",
            timepicker: !1,
            lang: o
        }),
        $("#share_time").unbind("blur").bind("blur", function(e) {
            stopPP(e)
        });
        var s = function(e) {
            if ($(".share_setting_more").addClass("hidden"),
            void 0 == e)
                $(".share_has_url").addClass("hidden"),
                $(".share_action .share_remove_button").addClass("hidden"),
                $(".content_info input[name=sid]").val(""),
                $(".content_info input[name=type]").val(""),
                $(".content_info input[name=name]").val(""),
                $(".content_info input[name=path]").val(""),
                $(".content_info input[name=time_to]").val(""),
                $(".content_info input[name=share_password]").val(""),
                $(".share_view_info").addClass("hidden");
            else {
                t = e,
                $(".content_info input[name=sid]").val(e.sid),
                $(".content_info input[name=type]").val(e.type),
                $(".content_info input[name=name]").val(e.name),
                $(".content_info input[name=path]").val(e.path),
                $(".content_info input[name=time_to]").val(e.time_to),
                $(".content_info input[name=share_password]").val(e.share_password),
                $(".share_view_info").removeClass("hidden"),
                e.num_download === void 0 && (e.num_download = 0),
                e.num_view === void 0 && (e.num_view = 0);
                var a = LNG.share_view_num + e.num_view + "  " + LNG.share_download_num + e.num_download;
                $(".share_view_info").html(a),
                "1" == e.code_read ? $(".content_info input[name=code_read]").attr("checked", "checked") : $(".content_info input[name=code_read]").removeAttr("checked"),
                "1" == e.not_download ? $(".content_info input[name=not_download]").attr("checked", "checked") : $(".content_info input[name=not_download]").removeAttr("checked"),
                $(".share_has_url").removeClass("hidden"),
                "file" == e.type ? $(".label_code_read").addClass("hidden") : $(".label_code_read").removeClass("hidden");
                var i = e.type;
                "folder" == e.type && (i = 1 == e.code_read ? "code_read" : "folder");
                var n = G.app_host + "index.php?share/" + i + "&user=" + G.user_name + "&sid=" + e.sid;
                $(".content_info .share_url").val(n),
                ("" != e.time_to || "" != e.share_password || "1" == e.code_read || "1" == e.not_download) && $(".share_setting_more").removeClass("hidden"),
                $(".share_remove_button").removeClass("hidden"),
                $(".share_create_button").text(LNG.share_save),
                jiathis_config = {
                    url: n,
                    summary: e.name,
                    title: "share to ##",
                    shortUrl: !1,
                    hideMore: !1
                }
            }
        }
          , r = function() {
            $(".share_action .share_remove_button").unbind("click").click(function() {
                ui.pathOperate.remove([{
                    type: "share",
                    path: t.sid
                }]),
                "*share*/" == G.this_path && ui.f5()
            }),
            $(".content_info .share_more").unbind("click").click(function() {
                $(".share_setting_more").toggleClass("hidden")
            }),
            $(".share_action .share_create_button").unbind("click").click(function() {
                var e = "";
                $(".share_dialog .content_info input[name]").each(function() {
                    var t = urlEncode($(this).val());
                    "checkbox" == $(this).attr("type") && (t = $(this).attr("checked") ? "1" : ""),
                    e += "&" + $(this).attr("name") + "=" + t
                }),
                $.ajax({
                    url: "index.php?userShare/set",
                    data: e,
                    type: "POST",
                    dataType: "json",
                    beforeSend: function() {
                        $(".share_create_button").addClass("disabled")
                    },
                    error: function() {
                        core.tips.tips(LNG.error, !1)
                    },
                    success: function(e) {
                        $(".share_create_button").removeClass("disabled"),
                        e.code ? (s(e.data),
                        $(".share_create_button").text(LNG.share_save),
                        "*share*/" == G.this_path && ui.f5(),
                        core.tips.tips(LNG.success, !0)) : core.tips.tips(e)
                    }
                })
            }),
            $(".content_info .open_window").unbind("click").bind("click", function() {
                window.open($("input.share_url").val())
            });
            var e = $("input.share_url")
              , a = e.get(0);
            e.unbind("hover click").bind("hover click", function() {
                $(this).focus();
                var t = e.val().length;
                if (Global.isIE) {
                    var i = a.createTextRange();
                    i.moveEnd("character", -a.value.length),
                    i.moveEnd("character", t),
                    i.moveStart("character", 0),
                    i.select()
                } else
                    a.setSelectionRange(0, t)
            })
        }
        ;
        s(t),
        r()
    }
      , h = function(e) {
        if (!(1 > e.length)) {
            var t = core.path2url(e);
            FrameCall.father("ui.setWall", '"' + t + '"'),
            $.ajax({
                url: "index.php?setting/set&k=wall&v=" + urlEncode(t),
                type: "json",
                success: function(e) {
                    core.tips.tips(e)
                }
            })
        }
    }
      , f = function(e, t, a) {
        if (!(1 > e.length)) {
            var i, n = core.pathThis(e), o = core.pathFather(e);
            i = "folder" == t ? "ui.path.list('" + urlEncode(e) + "');" : "ui.path.open('" + urlEncode(e) + "');";
            var s = urlEncode2(o + n + ".oexe");
            $.ajax({
                url: "./index.php?explorer/mkfile&path=" + s,
                type: "POST",
                dataType: "json",
                data: 'content={"type":"app_link","content":"' + i + '","icon":"app_s2.png"}',
                success: function(e) {
                    e.code && "function" == typeof a && a(e)
                }
            })
        }
    }
      , m = function(e, t) {
        if (!(1 > e.length)) {
            var a = core.pathThis(e)
              , i = core.pathFather(e);
            jsrun = "core.explorerCode('" + urlEncode(e) + "');";
            var n = urlEncode2(i + a + "_project.oexe");
            $.ajax({
                url: "./index.php?explorer/mkfile&path=" + n,
                type: "POST",
                dataType: "json",
                data: 'content={"type":"app_link","content":"' + jsrun + '","icon":"app_s2.png"}',
                success: function(e) {
                    e.code && "function" == typeof t && t(e)
                }
            })
        }
    }
      , v = function(e) {
        1 > e.length || $.ajax({
            url: "index.php?explorer/pathCute",
            type: "POST",
            dataType: "json",
            data: n(e),
            error: core.ajaxError,
            success: function(e) {
                core.tips.tips(e)
            }
        })
    }
      , _ = function(e, t) {
        if (e) {
            var a = "index.php?explorer/pathPast&path=" + urlEncode2(e);
            $.ajax({
                url: a,
                dataType: "json",
                beforeSend: function() {
                    core.tips.loading(LNG.moving)
                },
                error: core.ajaxError,
                success: function(e) {
                    core.tips.close(e),
                    "function" == typeof t && t(e.info)
                }
            })
        }
    }
      , g = function(e) {
        1 > e.length && (e = [{
            path: G.this_path,
            type: "folder"
        }]);
        var a = "index.php?explorer/pathInfo";
        G.share_page !== void 0 && (a = "index.php?share/pathInfo&user=" + G.user + "&sid=" + G.sid),
        $.ajax({
            url: a,
            type: "POST",
            dataType: "json",
            data: n(e),
            beforeSend: function() {
                core.tips.loading(LNG.getting)
            },
            error: core.ajaxError,
            success: function(a) {
                if (!a.code)
                    return core.tips.close(a),
                    void 0;
                core.tips.close(LNG.get_success, !0);
                var i = "path_info_more"
                  , n = LNG.info;
                1 == e.length && (i = "folder" == e[0].type ? "path_info" : "file_info",
                n = core.pathThis(e[0].path),
                n.length > 15 && (n = n.substr(0, 15) + "...  " + LNG.info));
                var o = template.compile(t[i])
                  , s = UUID();
                a.data.LNG = LNG,
                a.data.atime = date(LNG.time_type_info, a.data.atime),
                a.data.ctime = date(LNG.time_type_info, a.data.ctime),
                a.data.mtime = date(LNG.time_type_info, a.data.mtime),
                $.dialog({
                    id: s,
                    padding: 5,
                    ico: core.ico("info"),
                    fixed: !0,
                    title: n,
                    content: o(a.data),
                    cancel: !0
                }),
                b(s, e)
            }
        })
    }
      , b = function(e, t) {
        var a = $("." + e);
        a.find(".open_window").bind("click", function() {
            window.open(a.find("input.download_url").val())
        });
        var i = a.find("input.download_url")
          , o = i.get(0);
        i.unbind("hover click").bind("hover click", function() {
            $(this).focus();
            var e = i.val().length;
            if (Global.isIE) {
                var t = o.createTextRange();
                t.moveEnd("character", -o.value.length),
                t.moveEnd("character", e),
                t.moveStart("character", 0),
                t.select()
            } else
                o.setSelectionRange(0, e)
        }),
        a.find(".edit_chmod").click(function() {
            var e = $(this).parent().find("input")
              , a = $(this);
            $.ajax({
                url: "index.php?explorer/pathChmod&mod=" + e.val(),
                type: "POST",
                data: n(t),
                beforeSend: function() {
                    a.text(LNG.loading)
                },
                error: function() {
                    a.text(LNG.button_save)
                },
                success: function(e) {
                    a.text(e.data).animate({
                        opacity: .6
                    }, 400, 0).delay(1e3).animate({
                        opacity: 1
                    }, 200, 0, function() {
                        a.text(LNG.button_save)
                    })
                }
            })
        })
    }
      , y = function(e) {
        if (core.authCheck("explorer:fileDownload") && !(1 > e.length)) {
            var t = "index.php?explorer/zipDownload";
            G.share_page !== void 0 && (t = "index.php?share/zipDownload&user=" + G.user + "&sid=" + G.sid),
            $.ajax({
                url: t,
                type: "POST",
                dataType: "json",
                data: n(e),
                beforeSend: function() {
                    core.tips.loading(LNG.zip_download_ready)
                },
                error: core.ajaxError,
                success: function(e) {
                    core.tips.close(e),
                    core.tips.tips(e);
                    var t = "index.php?explorer/fileDownloadRemove&path=" + urlEncode2(e.info);
                    G.share_page !== void 0 && (t = "index.php?share/fileDownloadRemove&user=" + G.user + "&sid=" + G.sid + "&path=" + urlEncode2(e.info));
                    var a = '<iframe src="' + t + '" style="width:0px;height:0px;border:0;" frameborder=0></iframe>' + LNG.download_ready + "..."
                      , i = $.dialog({
                        icon: "succeed",
                        title: !1,
                        time: 1.5,
                        content: a
                    });
                    i.DOM.wrap.find(".aui_loading").remove()
                }
            })
        }
    }
      , x = function(e, t) {
        1 > e.length || $.ajax({
            url: "index.php?explorer/zip",
            type: "POST",
            dataType: "json",
            data: n(e),
            beforeSend: function() {
                core.tips.loading(LNG.ziping)
            },
            error: core.ajaxError,
            success: function(e) {
                core.tips.close(e),
                core.tips.tips(e),
                "function" == typeof t && t(e)
            }
        })
    }
      , w = function(e, t) {
        if (e) {
            var a = "index.php?explorer/unzip&path=" + urlEncode2(e);
            $.ajax({
                url: a,
                beforeSend: function() {
                    core.tips.loading(LNG.unziping)
                },
                error: core.ajaxError,
                success: function(e) {
                    core.tips.close(e),
                    "function" == typeof t && t(e)
                }
            })
        }
    }
      , k = function(e, t, a) {
        t && $.ajax({
            url: "index.php?explorer/pathCuteDrag",
            type: "POST",
            dataType: "json",
            data: n(e) + "&path=" + urlEncode2(t + "/"),
            beforeSend: function() {
                core.tips.loading(LNG.moving)
            },
            error: core.ajaxError,
            success: function(e) {
                core.tips.close(e),
                "function" == typeof a && a(e)
            }
        })
    }
      , N = function(e, t, a, i) {
        t && (void 0 == i && (i = 0),
        $.ajax({
            url: "index.php?explorer/pathCopyDrag",
            type: "POST",
            dataType: "json",
            data: n(e) + "&path=" + urlEncode2(t + "/") + "&filename_auto=" + Number(i),
            beforeSend: function() {
                core.tips.loading(LNG.moving)
            },
            error: core.ajaxError,
            success: function(e) {
                core.tips.close(e),
                "function" == typeof a && a(e)
            }
        }))
    }
      , L = function() {
        $.ajax({
            url: "index.php?explorer/clipboard",
            dataType: "json",
            error: core.ajaxError,
            success: function(e) {
                e.code && $.dialog({
                    title: LNG.clipboard,
                    padding: 0,
                    height: 200,
                    width: 400,
                    content: e.data
                })
            }
        })
    }
      , C = function(e) {
        if (e) {
            var t = "&name=" + urlEncode(core.pathThis(e)) + "&path=" + urlEncode(e);
            core.setting("fav" + t)
        }
    }
      , j = function(e) {
        var t = {};
        return t.type = e.find("input[type=radio]:checked").val(),
        t.content = e.find("textarea").val(),
        t.group = e.find("[name=group]").val(),
        e.find("input[type=text]").each(function() {
            var e = $(this).attr("name");
            t[e] = $(this).val()
        }),
        e.find("input[type=checkbox]").each(function() {
            var e = $(this).attr("name");
            t[e] = "checked" == $(this).attr("checked") ? 1 : 0
        }),
        t
    }
      , S = function(e) {
        e.find(".type input").change(function() {
            var t = $(this).attr("apptype");
            e.find("[data-type]").addClass("hidden"),
            e.find("[data-type=" + t + "]").removeClass("hidden")
        })
    }
      , T = function(t, a, i) {
        var n, o, s, r = LNG.app_create, l = UUID(), c = e("../tpl/app.html"), d = G.basic_path + "static/images/app/", p = template.compile(c);
        switch (void 0 == i && (i = "user_edit"),
        "root_edit" == i && (t = t),
        "user_edit" == i || "root_edit" == i ? (r = LNG.app_edit,
        s = p({
            LNG: LNG,
            iconPath: d,
            uuid: l,
            data: t
        })) : s = p({
            LNG: LNG,
            iconPath: d,
            uuid: l,
            data: {}
        }),
        $.dialog({
            fixed: !0,
            width: 450,
            id: l,
            padding: 15,
            title: r,
            content: s,
            button: [{
                name: LNG.preview,
                callback: function() {
                    var e = j(n);
                    return core.openApp(e),
                    !1
                }
            }, {
                name: LNG.button_save,
                focus: !0,
                callback: function() {
                    var e = j(n);
                    switch (i) {
                    case "user_add":
                        var s = urlEncode2(G.this_path + e.name);
                        o = "./index.php?app/user_app&action=add&path=" + s;
                        break;
                    case "user_edit":
                        o = "./index.php?app/user_app&path=" + urlEncode2(t.path);
                        break;
                    case "root_add":
                        o = "./index.php?app/add&name=" + e.name;
                        break;
                    case "root_edit":
                        o = "./index.php?app/edit&name=" + e.name + "&old_name=" + t.name;
                        break;
                    default:
                    }
                    $.ajax({
                        url: o,
                        type: "POST",
                        dataType: "json",
                        data: "data=" + urlEncode2(json_encode(e)),
                        beforeSend: function() {
                            core.tips.loading()
                        },
                        error: core.ajaxError,
                        success: function(e) {
                            if (core.tips.close(e),
                            e.code)
                                if ("root_edit" == i || "root_add" == i) {
                                    if (!e.code)
                                        return;
                                    FrameCall.top("Openapp_store", "App.reload", '""')
                                } else
                                    "function" == typeof a ? a() : ui.f5()
                        }
                    })
                }
            }]
        }),
        n = $("." + l),
        G.is_root || $(".appbox .appline .right a.open").remove(),
        t.group && n.find("option").eq(t.group).attr("selected", 1),
        n.find(".aui_content").css("overflow", "inherit"),
        i) {
        case "user_edit":
            n.find(".name").addClass("hidden"),
            n.find(".desc").addClass("hidden"),
            n.find(".group").addClass("hidden"),
            n.find("option[value=" + t.group + "]").attr("checked", !0);
            break;
        case "user_add":
            n.find(".desc").addClass("hidden"),
            n.find(".group").addClass("hidden"),
            n.find("[apptype=url]").attr("checked", !0),
            n.find("[data-type=url] input[name=resize]").attr("checked", !0),
            n.find("input[name=width]").attr("value", "800"),
            n.find("input[name=height]").attr("value", "600"),
            n.find("input[name=icon]").attr("value", "oexe.png");
            break;
        case "root_add":
            n.find("[apptype=url]").attr("checked", !0),
            n.find("[data-type=url] input[name=resize]").attr("checked", !0),
            n.find("input[name=width]").attr("value", "800"),
            n.find("input[name=height]").attr("value", "600"),
            n.find("input[name=icon]").attr("value", "oexe.png");
            break;
        case "root_edit":
            n.find("option[value=" + t.group + "]").attr("selected", !0);
            break;
        default:
        }
        S(n)
    }
      , E = function() {
        core.appStore()
    }
      , z = function(e) {
        e && 4 > e.length && "http" != e.substring(0, 4) || $.ajax({
            url: "./index.php?app/get_url_title&url=" + e,
            dataType: "json",
            beforeSend: function() {
                core.tips.loading()
            },
            success: function(t) {
                var a = t.data;
                core.tips.close(t);
                var i = {
                    content: "window.open('" + e + "');",
                    desc: "",
                    group: "others",
                    type: "app",
                    icon: "internet.png",
                    name: a,
                    resize: 1,
                    simple: 0,
                    height: "",
                    width: ""
                }
                  , n = urlEncode2(G.this_path + a);
                e = "./index.php?app/user_app&action=add&path=" + n,
                $.ajax({
                    url: e,
                    type: "POST",
                    dataType: "json",
                    data: "data=" + urlEncode2(json_encode(i)),
                    success: function(e) {
                        core.tips.close(e),
                        e.code && ui.f5()
                    }
                })
            }
        })
    }
    ;
    return {
        appEdit: T,
        appList: E,
        appAddURL: z,
        share: d,
        share_box: p,
        setBackground: h,
        createLink: f,
        createProject: m,
        newFile: o,
        newFolder: s,
        rname: r,
        unZip: w,
        zipDownload: y,
        zip: x,
        copy: c,
        cute: v,
        info: g,
        remove: l,
        cuteDrag: k,
        copyDrag: N,
        past: _,
        clipboard: L,
        fav: C
    }
}),
define("app/tpl/fileinfo/file_info.html", [], "<div class='pathinfo'>\n    <div class='p'>\n        <div class='icon file_icon'></div>\n        <input type='text' class='info_name' name='filename' value='{{name}}'/>\n        <div style='clear:both'></div>\n    </div>\n    \n    {{if download_path}}\n    <div class='line'></div>\n  <!--  <div class='p'>\n        <div class='title'>{{LNG.download_address}}:</div>\n        <div class=\"content input-group\">\n            <input type=\"text\" class=\"download_url\" value='{{download_path}}'>\n            <div class=\"input-group-btn\">\n                <button type=\"button\" class=\"btn btn-default open_window\">{{LNG.open}}</button>\n            </div>\n        </div>\n        <div style='clear:both'></div>\n    </div>\n    {{/if}}\n\n    <div class='line'></div>\n    <div class='p'>\n        <div class='title'>{{LNG.address}}:</div>\n        <div class='content' id='id_fileinfo_path'>{{path}}</div>\n        <div style='clear:both'></div>\n    </div>\n  -->  <div class='p'>\n        <div class='title'>{{LNG.size}}:</div>\n        <div class='content'>{{size_friendly}}  ({{size}} Byte)</div>\n        <div style='clear:both'></div>\n    </div>\n    <div class='line'></div>\n    <div class='p'>\n        <div class='title'>{{LNG.create_time}}</div>\n        <div class='content'>{{ctime}}</div>\n        <div style='clear:both'></div>\n    </div>\n    <div class='p'>\n        <div class='title'>{{LNG.modify_time}}</div>\n        <div class='content'>{{mtime}}</div>\n        <div style='clear:both'></div>\n    </div>\n    <div class='p'>\n        <div class='title'>{{LNG.last_time}}</div>\n        <div class='content'>{{atime}}</div>\n        <div style='clear:both'></div>\n    </div>\n\n    {{if download_path}}\n    <div class='line'></div>\n    <div class='p'>\n        <div class='title'>{{LNG.permission}}:</div>\n        <div class='content'>{{mode}}</div>\n        <div style='clear:both'></div>\n    </div>\n    <div class='p'>\n        <div class='title'>{{LNG.permission_edit}}:</div>\n        <div class='content'><input type='text' class='info_chmod' value='777'/>\n        <button class='btn btn-default btn-sm edit_chmod' type='button'>{{LNG.button_save}}</button></div>\n        <div style='clear:both'></div>\n    </div>\n    {{/if}}\n</div>"),
define("app/tpl/fileinfo/path_info.html", [], "<div class='pathinfo'>\n    <div class='p'>\n        <div class='icon folder_icon'></div>\n        <input type='text' class='info_name' name='filename' value='{{name}}'/>\n        <div style='clear:both'></div>\n    </div>\n    <div class='line'></div>\n  <!--  <div class='p'>\n        <div class='title'>{{LNG.address}}:</div>\n        <div class='content'>{{path}}</div>\n        <div style='clear:both'></div>\n    </div>\n  -->  <div class='p'>\n        <div class='title'>{{LNG.size}}:</div>\n        <div class='content'>{{size_friendly}}  ({{size}} Byte)</div>\n        <div style='clear:both'></div>\n    </div>\n    <div class='p'>\n        <div class='title'>{{LNG.contain}}:</div> \n        <div class='content'>{{file_num}}  {{LNG.file}},{{folder_num}}  {{LNG.folder}}</div>\n        <div style='clear:both'></div>\n    </div>\n    <div class='line'></div>\n    <div class='p'>\n        <div class='title'>{{LNG.create_time}}</div>\n        <div class='content'>{{ctime}}</div>\n        <div style='clear:both'></div>\n    </div>\n    <div class='p'>\n        <div class='title'>{{LNG.modify_time}}</div>\n        <div class='content'>{{mtime}}</div>\n        <div style='clear:both'></div>\n    </div>\n    <div class='p'>\n        <div class='title'>{{LNG.last_time}}</div>\n        <div class='content'>{{atime}}</div>\n        <div style='clear:both'></div>\n    </div>\n    <div class='line'></div>\n    <div class='p'>\n        <div class='title'>{{LNG.permission}}:</div>\n        <div class='content'>{{mode}}</div>\n        <div style='clear:both'></div>\n    </div>\n    <div class='p'>\n        <div class='title'>{{LNG.permission_edit}}:</div>\n        <div class='content'><input type='text' class='info_chmod' value='777'/>\n        <button class='btn btn-default btn-sm edit_chmod' type='button'>{{LNG.button_save}}</button></div>\n        <div style='clear:both'></div>\n    </div>\n</div>"),
define("app/tpl/fileinfo/path_info_more.html", [], "<div class='pathinfo'>\n    <div class='p'>\n        <div class='icon folder_icon'></div>\n        <div class='content' style='line-height:40px;margin-left:40px;'>\n            {{file_num}}  {{LNG.file}},{{folder_num}}  {{LNG.folder}}</div>\n        <div style='clear:both'></div>\n    </div>\n    <div class='line'></div>\n    <div class='p'>\n        <div class='title'>{{LNG.size}}:</div>\n        <div class='content'>{{size_friendly}} ({{size}} Byte)</div>\n        <div style='clear:both'></div>\n    </div>\n    <div class='line'></div>\n    <div class='p'>\n        <div class='title'>{{LNG.permission}}:</div>\n        <div class='content'>{{mode}}</div>\n        <div style='clear:both'></div>\n    </div>\n    <div class='p'>\n        <div class='title'>{{LNG.permission_edit}}:</div>\n        <div class='content'><input type='text' class='info_chmod' value='777'/>\n        <button class='btn btn-default btn-sm edit_chmod' type='button'>{{LNG.button_save}}</button></div>\n        <div style='clear:both'></div>\n    </div>\n</div>"),
define("app/tpl/share.html", [], '<div class=\'content_box\'>\n    <div class=\'title\'>\n        <div class="titleinfo">{{LNG.share_title}}</div>\n        <div class="share_view_info"></div>\n    </div>\n    <div class=\'content_info\'>\n\n    	<div class="input_line">\n			<span class="input_title">{{LNG.share_path}}:</span>\n			<input id="share_name" type="text" name="path" value="" />\n			<div style="clear:both"></div>\n		</div>\n		<div class="input_line">\n			<span class="input_title">{{LNG.share_name}}:</span>\n			<input type="hidden" name="sid"/>\n			<input type="hidden" name="type"/>\n			<input id="share_name" type="text" placeholder="{{LNG.share_name}}" name="name"/>\n			\n			<a href="javascript:void(0);" class="share_more">{{LNG.more}}<b class="caret"></b></a>\n			<div style="clear:both"></div>\n		</div>\n\n		<div class="share_setting_more hidden">\n			<div class="input_line">\n				<span class="input_title">{{LNG.share_time}}:</span>\n				<input id="share_time" type="text" placeholder="{{LNG.share_time}}" name="time_to"/>\n				<i>{{LNG.share_time_desc}}</i>\n				<div style="clear:both"></div>\n			</div>\n			<div class="input_line">\n				<span class="input_title">{{LNG.share_password}}:</span>\n				<input type="text" placeholder="{{LNG.share_password}}" name="share_password"/>\n				<i>{{LNG.share_password_desc}}</i>\n				<div style="clear:both"></div>\n			</div>\n			<div class="input_line share_others">\n				<span class="input_title">{{LNG.others}}:</span>\n				<label class="label_code_read">\n					<input type="checkbox" name="code_read" value="">{{LNG.share_code_read}}\n				</label>\n				<label>\n					<input type="checkbox" name="not_download" value="">{{LNG.share_not_download}}\n				</label>\n				<div style="clear:both"></div>\n			</div>\n		</div>\n\n		<div class="input_line share_has_url">\n			<span class="input_title">{{LNG.share_url}}:</span>\n			<div class="input-group">\n	          <input type="text" class="share_url" aria-label="Text input with segmented button dropdown">\n	          <div class="input-group-btn">\n	            <button type="button" class="btn btn-default open_window">{{LNG.open}}</button>\n	          </div>\n	          <!-- <div class="share_jiathis_box"></div> -->\n	        </div>\n	        <div style="clear:both"></div>\n		</div>\n	</div>\n	<div class="share_action">		\n		<button type="button" class="btn btn-primary share_create_button">{{LNG.share_create}}</button>\n		<a type="button" href="javascript:void(0);" class="share_remove_button">{{LNG.share_cancle}}</a>\n	</div>\n</div>'),
define("app/tpl/app.html", [], "<div class='appbox'>\n    <div class='appline name'>\n        <div class='left'>{{LNG.name}}</div>\n        <div class='right'><input type='text' name='name' value='{{data.name}}'/></div>\n        <div style='clear:both;'></div>\n    </div>\n    <div class='appline desc'>\n        <div class='left'>{{LNG.app_desc}}</div>\n        <div class='right'><input type='text' name='desc' value='{{data.desc}}'/></div>\n        <div style='clear:both;'></div>\n    </div>\n    <div class='appline icon'>\n        <div class='left'>{{LNG.app_icon}}</div>\n        <div class='right'><input type='text' name='icon' value='{{data.icon}}'/>\n        {{LNG.app_icon_show}}<a href='javascript:core.explorer(\"{{iconPath}}\");' class='button open'><img src='./static/images/app/computer.png'/></a></div>\n        <div style='clear:both;'></div>\n    </div>\n    <div class='appline group'>\n        <div class='left'>{{LNG.app_group}}</div>\n        <div class='right'><select name='group'>\n        <option value ='others'>{{LNG.app_group_others}}</option><option value ='game'>{{LNG.app_group_game}}</option>\n        <option value ='tools'>{{LNG.app_group_tools}}</option><option value ='reader'>{{LNG.app_group_reader}}</option>\n        <option value ='movie'>{{LNG.app_group_movie}}</option><option value ='music'>{{LNG.app_group_music}}</option>\n        </option><option value ='life'>{{LNG.app_group_life}}</option>\n        <select></div>\n        <div style='clear:both;'></div>\n    </div>\n    <div class='appline type'>\n        <div class='left'>{{LNG.app_type}}</div>\n        <div class='right'>\n            <input class='w20' type='radio' id='url{{uuid}}' apptype='url' value='url' name='{{uuid}}type' {{if data.type=='url'}}checked='checked'{{/if}}>\n            <label for='url{{uuid}}'>{{LNG.app_type_url}}</label>\n            <input class='w20' type='radio' id='app{{uuid}}' apptype='app' value='app' name='{{uuid}}type' {{if data.type=='app'}}checked='checked'{{/if}}>\n            <label for='app{{uuid}}'>{{LNG.app_type_code}}</label>\n            <input class='w20' type='radio' id='app_link{{uuid}}' apptype='app_link' value='app_link' name='{{uuid}}type' {{if data.type=='app_link'}}checked='checked'{{/if}}>\n            <label for='app_link{{uuid}}'>{{LNG.app_type_link}}</label>\n        </div>\n        <div style='clear:both;'></div>\n    </div>\n    <div class='appline' data-type='url'>\n        <div class='left'>{{LNG.app_display}}</div>\n        <div class='right'>\n            <input class='w20' type='checkbox' id='simple{{uuid}}' name='simple' {{if data.simple}}checked='true'{{/if}}>\n            <label for='simple{{uuid}}'>{{LNG.app_display_border}}</label>\n            <input class='w20' type='checkbox' id='resize{{uuid}}' name='resize' {{if data.resize}}checked='true'{{/if}}>\n            <label for='resize{{uuid}}'>{{LNG.app_display_size}}</label>\n        </div>\n        <div style='clear:both;'></div>\n    </div>\n    <div class='appline' data-type='url'>\n        <div class='left'>{{LNG.app_size}}</div>\n        <div class='right'>\n            {{LNG.width}}:&nbsp;&nbsp;<input class='w30' type='text' name='width'  value='{{data.width}}'/>\n            {{LNG.height}}:&nbsp;&nbsp;<input class='w30' type='text' name='height' value='{{data.height}}'/>\n        </div>\n        <div style='clear:both;'></div>\n    </div>\n    <div class='appline content'>\n        <div class='left hidden' data-type='app'>{{LNG.app_code}}</div>\n        <div class='left hidden' data-type='app_link'>{{LNG.app_code}}</div>\n        <div class='left' data-type='url'>{{LNG.app_url}}</div>\n        <div class='right'><textarea name='content'>{{data.content}}</textarea></div>\n        <div style='clear:both;'></div>\n    </div>\n</div>"),
define("app/common/pathOpen", ["./CMPlayer"], function(e) {
    var t = function(e, t) {
        if (void 0 != e) {
            if (void 0 == t && (t = core.pathExt(e)),
            t = t.toLowerCase(),
            "folder" == t)
                return "explorer" == Config.pageApp ? ui.path.list(e + "/") : core.explorer(e),
                void 0;
            if (console.log(e),
            "oexe" != t) {
                if (core.authCheck("explorer:fileDownload", LNG.no_permission_download)) {
                    if ("swf" == t) {
                        var n = core.path2url(e);
                        return o(n, core.ico("swf"), core.pathThis(e)),
                        void 0
                    }
                    if ("pdf" == t) {
                        if (Config.isIE)
                            return i(e),
                            void 0;
                        var c = "pdf" + UUID()
                          , n = core.path2url(e)
                          , d = '<div id="' + c + '" style="height:100%;">			<a href="' + n + '" target="_blank" style="display:block;margin:0 auto;margin-top:80px;font-size:16px;text-align:center;">' + LNG.error + "   " + LNG.download + " PDF</a></div>";
                        return $.dialog({
                            resize: !0,
                            fixed: !0,
                            ico: core.ico("pdf"),
                            title: core.pathThis(e),
                            width: 800,
                            height: 400,
                            padding: 0,
                            content: d
                        }),
                        new PDFObject({
                            url: n
                        }).embed(c),
                        void 0
                    }
                    if ("html" == t || "htm" == t) {
                        var n = core.path2url(e);
                        return o(n, core.ico("html"), core.pathThis(e)),
                        void 0
                    }
                    if (inArray(core.filetype.image, t)) {
                        var n = urlDecode(e);
                        return -1 == e.indexOf("http:") && (n = core.path2url(n)),
                        MaskView.image(n),
                        void 0
                    }
                    if (inArray(core.filetype.music, t) || inArray(core.filetype.movie, t)) {
                        var n = core.path2url(e);
                        return l(n, t),
                        void 0
                    }
                    return inArray(core.filetype.doc, t) ? (r(e),
                    void 0) : inArray(core.filetype.text, t) || inArray(core.filetype.code, t) ? (s(e),
                    void 0) : ("editor" == Config.pageApp ? core.tips.tips(t + LNG.edit_can_not, !1) : a(e, ""),
                    void 0)
                }
            } else if (console.log(e),
            "string" == typeof e) {
                var p = e;
                "string" != typeof e && (p = e.content.split("'")[1]),
                core.file_get(p, function(e) {
                    var t = json_decode(e);
                    t.name = core.pathThis(p),
                    core.openApp(t)
                })
            } else
                core.openApp(e)
        }
    }
      , a = function(e, t) {
        var a = '<div class="unknow_file" style="width:260px;word-break: break-all;"><span>' + LNG.unknow_file_tips + "<br/>" + t + '</span><br/><a class="btn btn-success btn-sm" href="javascript:ui.path.download(\'' + e + "');\"> " + LNG.unknow_file_download + " </a></div>";
        $.dialog({
            fixed: !0,
            icon: "warning",
            title: LNG.unknow_file_title,
            padding: 30,
            content: a,
            cancel: !0
        })
    }
      , i = function(e) {
        if (core.authCheck("explorer:fileDownload", LNG.no_permission_download) && e) {
            var t = "index.php?explorer/fileDownload&path=" + urlEncode2(e);
            G.share_page !== void 0 && (t = "index.php?share/fileDownload&user=" + G.user + "&sid=" + G.sid + "&path=" + urlEncode2(e));
            var a = '<iframe src="' + t + '" style="width:0px;height:0px;border:0;" frameborder=0></iframe>' + LNG.download_ready + "..."
              , i = $.dialog({
                icon: "succeed",
                title: !1,
                time: 1,
                content: a
            });
            i.DOM.wrap.find(".aui_loading").remove()
        }
    }
      , n = function(e) {
        if (core.authCheck("explorer:fileDownload") && void 0 != e) {
            var t = core.path2url(e);
            window.open(t)
        }
    }
      , o = function(e, t, a, i) {
        if (e) {
            void 0 == i && (i = "openWindow" + UUID());
            var n = "<iframe frameborder='0' name='Open" + i + "' src='" + e + "' style='width:100%;height:100%;border:0;'></iframe>";
            art.dialog.through({
                id: i,
                title: a,
                ico: t,
                width: "78%",
                height: "70%",
                padding: 0,
                content: n,
                resize: !0
            })
        }
    }
      , s = function(e) {
        if (core.authCheck("explorer:fileDownload", LNG.no_permission_download) && e) {
            var a = core.pathExt(e)
              , i = core.pathThis(e);
            if (inArray(core.filetype.bindary, a) || inArray(core.filetype.music, a) || inArray(core.filetype.image, a) || inArray(core.filetype.movie, a) || inArray(core.filetype.doc, a))
                return t(e, a),
                void 0;
            if ($.dialog.list.openEditor && $.dialog.list.openEditor.zIndex(),
            "editor" == Config.pageApp)
                return FrameCall.child("OpenopenEditor", "Editor.add", '"' + urlEncode2(e) + '"'),
                void 0;
            if (void 0 == window.top.frames.OpenopenEditor) {
                var n = "./index.php?editor/edit&filename=" + urlEncode(urlEncode2(e));
                G.share_page !== void 0 && (n = "./index.php?share/edit&user=" + G.user + "&sid=" + G.sid + "&filename=" + urlEncode(urlEncode2(e)));
                var s = i + " ——" + LNG.edit;
                o(n, core.ico("edit"), s.substring(s.length - 50), "openEditor")
            } else
                $.dialog.list.openEditor && $.dialog.list.openEditor.display(!0),
                FrameCall.top("OpenopenEditor", "Editor.add", '"' + urlEncode2(e) + '"')
        }
    }
      , r = function(e) {
        var t = "./index.php?explorer/officeView&path=" + urlEncode(e);
        if (G.share_page !== void 0)
            var t = G.app_host + "index.php?share/officeView&user=" + G.user + "&sid=" + G.sid + "&path=" + urlEncode2(e);
        art.dialog.open(t, {
            ico: core.ico("doc"),
            title: title = core.pathThis(e),
            width: "80%",
            height: "70%",
            resize: !0
        })
    }
      , l = function(t, a) {
        t && ("string" == typeof t && (t = [t]),
        CMPlayer = e("./CMPlayer"),
        CMPlayer.play(t, a))
    }
    ;
    return {
        open: t,
        play: l,
        openEditor: s,
        openIE: n,
        download: i
    }
}),
define("app/common/CMPlayer", [], function() {
    var e = {
        ting: {
            path: "music/ting",
            width: 410,
            height: 530
        },
        beveled: {
            path: "music/beveled",
            width: 350,
            height: 200
        },
        kuwo: {
            path: "music/kuwo",
            width: 480,
            height: 200
        },
        manila: {
            path: "music/manila",
            width: 320,
            height: 400
        },
        mp3player: {
            path: "music/mp3player",
            width: 320,
            height: 410
        },
        qqmusic: {
            path: "music/qqmusic",
            width: 300,
            height: 400
        },
        somusic: {
            path: "music/somusic",
            width: 420,
            height: 137
        },
        xdj: {
            path: "music/xdj",
            width: 595,
            height: 235
        },
        webplayer: {
            path: "movie/webplayer",
            width: 600,
            height: 400
        },
        qqplayer: {
            path: "movie/qqplayer",
            width: 600,
            height: 400
        },
        tvlive: {
            path: "movie/tvlive",
            width: 600,
            height: 400
        },
        youtube: {
            path: "movie/youtube",
            width: 600,
            height: 400
        },
        vplayer: {
            path: "movie/vplayer",
            width: 600,
            height: 400
        }
    }
      , t = function(e) {
        return "music" == e ? "music_player" : (void 0 == e && (e = "mp3"),
        inArray(core.filetype.music, e) ? "music_player" : "movie_player")
    }
      , a = function(t) {
        var a, i, o, s;
        "music_player" == t ? (s = core.ico("mp3"),
        a = e[G.musictheme],
        i = "music player",
        o = !1) : (s = core.ico("flv"),
        a = e[G.movietheme],
        i = "movie player",
        o = !0);
        var r = core.createFlash(G.static_path + "js/lib/cmp4/cmp.swf", "context_menu=2&auto_play=1&play_mode=1&skin=skins/" + a.path + ".zip", t)
          , l = {
            id: t + "_dialog",
            simple: !0,
            ico: s,
            title: i,
            width: a.width + 10,
            height: a.height,
            content: '<div class="wmp_player"></div><div class="flash_player">' + r + "</div>",
            resize: o,
            padding: 0,
            fixed: !0,
            close: function() {
                var e = n(t);
                e && e.sendEvent && e.sendEvent("view_stop")
            }
        };
        window.top.CMP ? art.dialog.through(l) : $.dialog(l)
    }
      , i = function(e) {
        var t, a = "";
        for (t = e.length - 1; t >= 0; t--) {
            var i, n;
            -1 == e[t].search("fileProxy") ? (i = urlEncode(e[t]),
            n = core.pathThis(e[t])) : (i = e[t],
            n = core.pathThis(urlDecode(i))),
            i = i.replace(/%2F/g, "/"),
            i = i.replace(/%3F/g, "?"),
            i = i.replace(/%26/g, "&"),
            i = i.replace(/%3A/g, ":"),
            i = i.replace(/%3D/g, "="),
            a += '<list><m type="" src="' + i + '" label="' + n + '"/></list>'
        }
        return a
    }
      , n = function(e) {
        return window.top.CMP ? window.top.CMP.get(e) : CMP.get(e)
    }
      , o = function(e, t) {
        var a = n(t)
          , o = i(e);
        try {
            a.config("play_mode", "normal");
            var s = a.list().length;
            a.list_xml(o, !0),
            a.sendEvent("view_play", s + 1)
        } catch (r) {}
    }
      , s = function(e) {
        if ("music_player" != e) {
            var a = n(t("movie"));
            a && (a.addEventListener("control_load", "new_play"),
            a.addEventListener("control_play", "new_play"))
        }
    }
    ;
    return {
        changeTheme: function(t, a) {
            var i, o, s;
            "music" == t ? (G.musictheme = a,
            i = "music_player") : "movie" == t && (G.movietheme = a,
            i = "movie_player"),
            s = n(i),
            s && (o = e[a],
            window.top.art.dialog.list[i + "_dialog"].size(o.width, o.height),
            s.sendEvent("skin_load", "skins/" + o.path + ".zip"))
        },
        play: function(e, i) {
            var r = t(i)
              , l = n(r);
            if (l)
                o(e, r),
                s(r),
                window.top.art.dialog.list[r + "_dialog"].display(!0);
            else {
                a(r);
                var c = setInterval(function() {
                    n(r) && (o(e, r),
                    s(r),
                    new_play(r),
                    clearInterval(c),
                    c = !1)
                }, 1e3)
            }
        }
    }
});
var new_play = function(e) {
    if ("music_player" == e)
        return $(".music_player_dialog .wmp_player").html("").css({
            width: "0px",
            height: "0px"
        }),
        $(".music_player_dialog .flash_player").css({
            width: "100%",
            height: "100%"
        }),
        void 0;
    var t;
    t = window.top.CMP ? window.top.CMP.get("movie_player") : CMP.get("movie_player");
    var a = function(e) {
        var t = '<object id="the_wmp_player" '
          , a = navigator.userAgent;
        return -1 != a.indexOf("MSIE") ? t += 'classid="clsid:6BF52A52-394A-11d3-B153-00C04F79FAA6" ' : (-1 != a.indexOf("Firefox") || -1 != a.indexOf("Chrome") || -1 != a.indexOf("Opera") || -1 != a.indexOf("Safari")) && (t += 'type="application/x-ms-wmp" '),
        t += 'width="100%" height="100%">',
        t += '<param name="URL" value="' + e + '">',
        t += '<param name="autoStart" value="true">',
        t += '<param name="autoSize" value="true">',
        t += '<param name="invokeURLs" value="false">',
        t += '<param name="playCount" value="100">',
        t += '<param name="Volume" value="100">',
        t += '<param name="defaultFrame" value="datawindow">',
        t += "</object>"
    }
    ;
    try {
        var i = t.item("src").toLowerCase();
        if (i.indexOf("wmv") > 1 || i.indexOf("mpg") > 1 || i.indexOf("avi") > 1 || i.indexOf("wvx") > 1 || i.indexOf("3gp") > 1) {
            $("div[id^='DIV_CMP_']").remove();
            var n = a(i);
            $(".movie_player_dialog .wmp_player").html(""),
            $(".movie_player_dialog .flash_player").css({
                width: "0px",
                height: "0px"
            }),
            setTimeout(function() {
                $(".movie_player_dialog .wmp_player").html(n).css({
                    width: "100%",
                    height: "100%"
                })
            }, 300)
        } else
            $(".movie_player_dialog .wmp_player").html("").css({
                width: "0px",
                height: "0px"
            }),
            setTimeout(function() {
                $(".movie_player_dialog .flash_player").css({
                    width: "100%",
                    height: "100%"
                })
            }, 200)
    } catch (o) {}
}
;
