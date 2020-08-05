<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" 
http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml"  menu="menubody">
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
	<title><?php echo $L['setting_title'];?></title>
	<link rel="stylesheet" href="./static/style/font-awesome/css/font-awesome.css">
	<link href="<?php echo STATIC_PATH;?>style/bootstrap.css?ver=<?php echo SECROS_VERSION;?>" rel="stylesheet"/>	  
	<link href="<?php echo STATIC_PATH;?>style/skin/<?php echo $config['user']['theme'];?>app_setting.css?ver=<?php echo SECROS_VERSION;?>" rel="stylesheet" id='link_css_list'/>
	
</head>
<?php
$antivirus  = config_get_unsign_int_from_file('/etc/system/quota.conf','antivirus');
?>
<body>
	<div id="body">
		<div class="menu_left">	
			<h1><?php echo $L['setting_title'];?></h1>
			<ul class='setting'>

			<?php if($GLOBALS['is_root']){ ?>
				<li id="system"><i class="font-icon icon-cog"></i><?php echo $L['system_setting'];?></li>
				<li id="net"><i class="font-icon icon-picture"></i><?php echo $L['setting_net'];?></li>
				<li id="file"><i class="font-icon icon-dashboard"></i><?php echo $L['setting_file'];?></li>
				<li id="usblist"><i class="font-icon icon-anchor"></i><?php echo $L['setting_usblist'];?></li>
			<?php } ?>
				<li id="member"><i class="font-icon icon-group"></i><?php echo $L['setting_member'];?></li>
				<?php
				if ($antivirus == 1 && $GLOBALS['is_root']) {
				?>	
				<li id="antivirus"><i class="font-icon icon-star"></i><?php echo $L['setting_antivirus'];?></li>
				<?php
				}
				?>
					<li id="user"><i class="font-icon icon-user"></i><?php echo $L['setting_user'];?></li>
			</ul>
		</div>		
		<div class='main'></div>
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
	seajs.use('app/src/setting/main');
</script>
</body>
</html>
