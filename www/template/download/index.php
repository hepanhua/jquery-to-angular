<!DOCTYPE html>
<html>
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
	<title><?php echo $L['log_transfer'];?></title>
	<link rel="stylesheet" href="./static/style/font-awesome/css/font-awesome.css">
	<link href="<?php echo STATIC_PATH;?>style/bootstrap.css?ver=<?php echo SECROS_VERSION;?>" rel="stylesheet"/>	  
	<link href="<?php echo STATIC_PATH;?>style/skin/<?php echo $config['user']['theme'];?>app_log.css?ver=<?php echo SECROS_VERSION;?>" rel="stylesheet" id='link_css_list'/>
	<script src="<?php echo STATIC_PATH;?>js/lib/jquery-1.8.0.min.js"></script>
<style>
/* #body .main .tools {
	height:auto!important;
} */
#body .section {
    width: 97% !important;
}
.nav a{
	cursor: pointer;
}
.nav a:hover{
	background: #03bdbc;
}
#body .main .section .box_line {
margin:0;
}
</style>
</head>
<body>
<div id="body">	
		<div class='main'>
		<div class="h1" align=center><?php echo $L['tools_title'];?></div>
			<div class="nav" id="toolsNav">
			<a onclick="toolsDownloadInit(this)" class="this"><?php echo $L['tools_download'];?></a>
			<a onclick="toolsPingInit(this)" >ping</a>
			<a onclick="toolsTracerouteInit(this)" >traceroute</a>
			<div style="clear:both;"></div>
			</div>

			<!-- 工具下载 -->
			<div class="section toolsDownload" id="toolsDownload">
	
		<table id='list' align="center" border=0 cellspacing=0 cellpadding=0 >
			<tr class="title">
			  <td width="10%">ID</td>
				<td width="40%">文件名</td>
				<td width="30%">说明</td>
				<td width="20%">下载</td>
			</tr>
			<tr>
			  <td width="10%">1</td>
				<td width="40%">ftpclient.rar</td>
				<td width="30%">FTP文件上传下载工具</td>
				<td width="20%">
					<a href="./ftpclient.rar">
					<i class="font-icon icon-download-alt" title="下载"></i>
					</a>
				</td>
			</tr>
			<tr>
			  <td width="10%">1</td>
				<td width="40%">usbforbid.rar</td>
				<td width="30%">禁止电脑USB存储工具(需管理员权限运行)</td>
				<td width="20%">
					<a href="./usbforbid.rar">
					<i class="font-icon icon-download-alt" title="下载"></i>
					</a>
				</td>
			</tr>
		</table>
</div>
	<!-- 工具下载 END-->

<!-- PING -->
<div class="section toolsPing hidden" id="toolsPing">
<div class="box_line">
<span class="infotitle">目的地址:</span><input type="text" id="pingip">
</div>
<div class="box_line">
<span class="infotitle">Ping次数:</span><input type="number" max="10" min="1" id="pingcount" value="4"><i>(1-10)</i>
</div>
<div class="box_line">
<span class="infotitle">数据包大小:</span><input type="text" id="pingsize" value="56">
</div>
<a class="system_save button" onclick="pingStart()">开始测试</a>
<div id="pingResult"></div>
<div id="loadingping"></div>
</div>
	<!-- PING END -->

	<!-- traceroute -->
<div class="section toolsTraceroute hidden" id="toolsTraceroute">
<div class="box_line">
<span class="infotitle">目的地址:</span><input type="text" id="tracerouteip">
</div>
<a  class="system_save button" onclick="tracerouteStart()">开始测试</a>
<div id="tracerouteResult"></div>
<div id="loading"></div>
</div>
	<!-- traceroute END -->

</div>
</div>
	
<script src="<?php echo STATIC_PATH;?>js/app/src/tools/main.js"></script>
</body>
</html>
