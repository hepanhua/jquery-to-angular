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
<FORM method=post id=upload name=upload action="/cgi-bin/licence.cgi"  enctype="multipart/form-data">
<?php 
if (!file_exists('/etc/system/Test.key')){
	echo "<TR><TD><input type=radio name=licencetype value=1>申请试用（二周）</TD></TR>";
}
?>
<TR><TD><input type=radio name=licencetype value=2 Checked>下载授权许可证申请</TD></TR>	
<TR><TD><input type=radio name=licencetype value=3>导入授权许可证：</TD></TR>
<TR><TD><input id=licencefile_id name=licencefile type=file size=32></TD></TR>
<TR><TD>&nbsp;</TD></TR>
<TR>
<TD align=center valign=bottom>
		<a href="javascript:formSubmit();" class="button">确定</a>
	</TD></TR></FORM></TABLE></TD></TR></TABLE></td></tr></TABLE>
	</body>
</html>
<script type="text/javascript">
function formSubmit()
{
document.getElementById("upload").submit();
}
</script>