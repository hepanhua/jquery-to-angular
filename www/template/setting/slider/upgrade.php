<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" scroll="no">
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
	<meta name="renderer" content="webkit">
	<title><?php echo $L['ui_explorer'];?></title>
	<link rel="Shortcut Icon" href="<?php echo STATIC_PATH;?>images/favicon.ico">
	<link href="<?php echo STATIC_PATH;?>js/lib/picasa/style/style.css?ver=<?php echo SECROS_VERSION;?>" rel="stylesheet"/>
	<link href="<?php echo STATIC_PATH;?>style/bootstrap.css?ver=<?php echo SECROS_VERSION;?>" rel="stylesheet"/>
	<link rel="stylesheet" href="./static/style/font-awesome/css/font-awesome.css">
	<link href="<?php echo STATIC_PATH;?>style/skin/<?php echo $config['user']['theme'];?>app_setting.css?ver=<?php echo SECROS_VERSION;?>" rel="stylesheet" id='link_css_list'/>
</head>
<BODY>
<TABLE border=0 width=100% height=100% align=center cellpadding=2 cellspacing=0>
<TR valign=middle><TD>
<TABLE cellPadding=3 width=400 NOWRAP align=center border=0>
<TR><TD>&nbsp;</TD></TR>

<FORM method=post id=upload name=upload action="/cgi-bin/upgrade.cgi"  enctype="multipart/form-data">
<TR><TD>导入升级文件：</TD></TR>
<TR><TD><input id=upgradefile_id name=upgradefile type=file size=32></TD></TR>
<TR><TD>&nbsp;</TD></TR>
<TR>
<TD align=center valign=bottom>
		<a href="javascript:formSubmit();" class="button">确定</a>
</TD>
</TR>
<TR><TD>
<div id=upgrade_tip>
<TR><TD><font color="#ff0000" size=5pt><b>注意：</b></font></TD></TR>
<TR><TD><font color="#ff0000" size=4pt><b>设备升级时请拔出所有USB设备</b></font></TD></TR>
<TR><TD><font color="#ff0000" size=4pt><b>以免造成升级失败！</b></font></TD></TR>
</div>
</TD></TR>
</FORM>
</TABLE></TD></TR></TABLE></td></tr></TABLE>
	</body>
</html>
<script type="text/javascript">
function formSubmit()
{
	document.getElementById("upload").submit();
	var obj = document.getElementById("upgrade_tip");
	obj.innerHTML='<TR><TD><font color=\"#ff0000\" size=5pt><b>设备升级中，请勿断电。。。</b></font></TD></TR><TR><TD><center><img src=\"/static/images/lazy.gif\" /></center></TD></TR>';
}
</script>