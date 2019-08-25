<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" 
http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml"  menu="menubody">
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
	<title><?php echo $L['log_transfer'];?></title>
	<link rel="stylesheet" href="./static/style/font-awesome/css/font-awesome.css">
	<link href="<?php echo STATIC_PATH;?>style/bootstrap.css?ver=<?php echo SECROS_VERSION;?>" rel="stylesheet"/>	  
	<link href="<?php echo STATIC_PATH;?>style/skin/<?php echo $config['user']['theme'];?>app_log.css?ver=<?php echo SECROS_VERSION;?>" rel="stylesheet" id='link_css_list'/>
</head>
<?php
$antivirus  = config_get_unsign_int_from_file('/etc/system/quota.conf','antivirus');
?>
<body>
	<div id="body">	
		<div class='main'>
			<div class="h1" align=center><?php echo $L['log_title'];?></div>
			<div class="nav">
			<a href="javascript:httpLog.init();" class="this" data-page="web"><?php echo $L['log_type_web'];?></a>
			<a href="javascript:ftpLog.init();" data-page="ftp"><?php echo $L['log_type_ftp'];?></a>
			<a href="javascript:sambaLog.init();" data-page="samba"><?php echo $L['log_type_samba'];?></a>
			<?php
			if ($antivirus == 1) {
			?>
				<a href="javascript:avLog.init();" data-page="antivirus"><?php echo $L['log_type_virus'];?></a>
			<?php
			}
			?>
			<div style="clear:both;"></div>
			</div>
				<!-- WEB日志 -->
				<div class="section web">
					<div class="tools" id="tools">
						<div class="tools-left"><?php echo $L['log_counttip'];?><label id="count">0</label> <div style="display:none">( <label id="fnum">0</label> - <label id="lnum">0</label>) </div> </div>  
							<div class="tools-right">
							<button class="btn btn-default" id="log_filter" title=<?php echo $L['log_filter'];?> type="button">
									<i class="font-icon icon-filter"></i>
								</button>
								<button class="btn btn-default" id="log_clean" title=<?php echo $L['log_clean'];?> type="button">
									<i class="font-icon icon-trash"></i>
								</button>
								<button class="btn btn-default" id="log_fresh" title=<?php echo $L['log_fresh'];?> type="button">
									<i class="font-icon icon-refresh"></i>
								</button>
								<button class="btn btn-default" id="log_first" title=<?php echo $L['log_first'];?> type="button">
									<i class="font-icon icon-step-backward"></i>
								</button>
								<button class="btn btn-default" id="log_prev" title=<?php echo $L['log_prev'];?> type="button">
									<i class="font-icon icon-chevron-left"></i>
								</button>
								<button class="btn btn-default" id="log_next" title=<?php echo $L['log_next'];?> type="button">
									<i class="font-icon icon-chevron-right"></i>
								</button>
								<button class="btn btn-default" id="log_last" title=<?php echo $L['log_last'];?> type="button">
									<i class="font-icon icon-step-forward"></i>
								</button>
								<button class="btn btn-default" id="log_download" title=<?php echo $L['log_download'];?> type="button">
									<i class="font-icon icon-download-alt"></i>
								</button>
							</div>
							<div style="clear:both">
						</div>
					</div>
					<table id='list' align="center" border=0 cellspacing=0 cellpadding=0 ></table>
				</div>
				<div class="section ftp hidden">
					<div class="tools" id="tools">
						<div class="tools-left"><?php echo $L['log_counttip'];?><label id="count">0</label> <div style="display:none">( <label id="fnum">0</label> - <label id="lnum">0</label>) </div></div>  
							<div class="tools-right">
							<button class="btn btn-default" id="log_filter" title=<?php echo $L['log_filter'];?> type="button">
									<i class="font-icon icon-filter"></i>
								</button>
								<button class="btn btn-default" id="log_clean" title=<?php echo $L['log_clean'];?> type="button">
									<i class="font-icon icon-trash"></i>
								</button>
								<button class="btn btn-default" id="log_fresh" title=<?php echo $L['log_fresh'];?> type="button">
									<i class="font-icon icon-refresh"></i>
								</button>
								<button class="btn btn-default" id="log_first" title=<?php echo $L['log_first'];?> type="button">
									<i class="font-icon icon-step-backward"></i>
								</button>
								<button class="btn btn-default" id="log_prev" title=<?php echo $L['log_prev'];?> type="button">
									<i class="font-icon icon-chevron-left"></i>
								</button>
								<button class="btn btn-default" id="log_next" title=<?php echo $L['log_next'];?> type="button">
									<i class="font-icon icon-chevron-right"></i>
								</button>
								<button class="btn btn-default" id="log_last" title=<?php echo $L['log_last'];?> type="button">
									<i class="font-icon icon-step-forward"></i>
								</button>
								<button class="btn btn-default" id="log_download" title=<?php echo $L['log_download'];?> type="button">
									<i class="font-icon icon-download-alt"></i>
								</button>
							</div>
							<div style="clear:both">
						</div>
					</div>
					<table id='list' align="center" border=0 cellspacing=0 cellpadding=0 ></table>
				</div>
				<div class="section samba hidden">
					<div class="tools" id="tools">
						<div class="tools-left"><?php echo $L['log_counttip'];?><label id="count">0</label> <div style="display:none">( <label id="fnum">0</label> - <label id="lnum">0</label>) </div></div>  
							<div class="tools-right">
							<button class="btn btn-default" id="log_filter" title=<?php echo $L['log_filter'];?> type="button">
									<i class="font-icon icon-filter"></i>
								</button>
								<button class="btn btn-default" id="log_clean" title=<?php echo $L['log_clean'];?> type="button">
									<i class="font-icon icon-trash"></i>
								</button>
								<button class="btn btn-default" id="log_fresh" title=<?php echo $L['log_fresh'];?> type="button">
									<i class="font-icon icon-refresh"></i>
								</button>
								<button class="btn btn-default" id="log_first" title=<?php echo $L['log_first'];?> type="button">
									<i class="font-icon icon-step-backward"></i>
								</button>
								<button class="btn btn-default" id="log_prev" title=<?php echo $L['log_prev'];?> type="button">
									<i class="font-icon icon-chevron-left"></i>
								</button>
								<button class="btn btn-default" id="log_next" title=<?php echo $L['log_next'];?> type="button">
									<i class="font-icon icon-chevron-right"></i>
								</button>
								<button class="btn btn-default" id="log_last" title=<?php echo $L['log_last'];?> type="button">
									<i class="font-icon icon-step-forward"></i>
								</button>
								<button class="btn btn-default" id="log_download" title=<?php echo $L['log_download'];?> type="button">
									<i class="font-icon icon-download-alt"></i>
								</button>
							</div>
							<div style="clear:both">
						</div>
					</div>
					<table id='list' align="center" border=0 cellspacing=0 cellpadding=0 ></table>
				</div>
				<?php
				if ($antivirus == 1) {
				?>
				<div class="section antivirus hidden">
					<div class="tools" id="tools">
						<div class="tools-left"><?php echo $L['log_counttip'];?><label id="count">0</label> <div style="display:none">( <label id="fnum">0</label> - <label id="lnum">0</label>) </div></div>  
							<div class="tools-right">
							<button class="btn btn-default" id="log_filter" title=<?php echo $L['log_filter'];?> type="button">
									<i class="font-icon icon-filter"></i>
								</button>
								<button class="btn btn-default" id="log_clean" title=<?php echo $L['log_clean'];?> type="button">
									<i class="font-icon icon-trash"></i>
								</button>
								<button class="btn btn-default" id="log_fresh" title=<?php echo $L['log_fresh'];?> type="button">
									<i class="font-icon icon-refresh"></i>
								</button>
								<button class="btn btn-default" id="log_first" title=<?php echo $L['log_first'];?> type="button">
									<i class="font-icon icon-step-backward"></i>
								</button>
								<button class="btn btn-default" id="log_prev" title=<?php echo $L['log_prev'];?> type="button">
									<i class="font-icon icon-chevron-left"></i>
								</button>
								<button class="btn btn-default" id="log_next" title=<?php echo $L['log_next'];?> type="button">
									<i class="font-icon icon-chevron-right"></i>
								</button>
								<button class="btn btn-default" id="log_last" title=<?php echo $L['log_last'];?> type="button">
									<i class="font-icon icon-step-forward"></i>
								</button>
								<button class="btn btn-default" id="log_download" title=<?php echo $L['log_download'];?> type="button">
									<i class="font-icon icon-download-alt"></i>
								</button>
							</div>
							<div style="clear:both">
						</div>
					</div>
					<table id='list' align="center" border=0 cellspacing=0 cellpadding=0 ></table>
				</div>
				<?php
				}
				?>
			</div>
		</div>
	</div>
<script src="<?php echo STATIC_PATH;?>js/lib/seajs/sea.js?ver=<?php echo SECROS_VERSION;?>"></script>
<script src="./index.php?user/common_js#id=<?php echo rand_string(8);?>"></script>
<script type="text/javascript">
	seajs.config({
		base: "<?php echo STATIC_PATH;?>js/",
		preload: ["lib/jquery-1.8.0.min"],
		map:[
			[ /^(.*\.(?:css|js))(.*)$/i,'$1$2?ver='+G.version]
		]
	});
	seajs.use('app/src/log/main');
</script>
</body>
</html>
