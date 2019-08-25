<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" scroll="no">
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
	<meta name="renderer" content="webkit">
	<title><?php echo $L['secros_name_desc'];?></title>
	<?php
	  $ico = STATIC_PATH."images/secros.ico";
	  $oem  = config_get_value_from_file('/etc/system/oem.conf','OEM');
		if (isset($oem)){
			$ico = STATIC_PATH."images/".$oem.".ico";
		}
	?>
	<link rel="Shortcut Icon" href="<?php echo $ico;?>">
	<link href="<?php echo STATIC_PATH;?>js/lib/picasa/style/style.css?ver=<?php echo SECROS_VERSION;?>" rel="stylesheet"/>
	<link href="<?php echo STATIC_PATH;?>style/bootstrap.css?ver=<?php echo SECROS_VERSION;?>" rel="stylesheet"/>
	<link rel="stylesheet" href="./static/style/font-awesome/css/font-awesome.css">
	<link href="<?php echo STATIC_PATH;?>style/skin/<?php echo $config['user']['theme'];?>app_explorer.css?ver=<?php echo SECROS_VERSION;?>" rel="stylesheet" id='link_css_list'/>
	
</head>
<?php 
	if (file_exists('/etc/system/Test.key')){
		$licencetype = 2;
		$licencestatus = config_get_unsign_int_from_file('/var/run/roswan','licencestatus');
	}
	if (file_exists('/etc/system/Licence.key')){
		$licencetype = 1;
	}
	/*if (file_exists('/mnt/config/antivirus.conf')){
		$currenttime = strtotime("now");
		$expiretime = config_get_value_from_file('/mnt/config/antivirus.conf','License_expireGMT');
		if (isset($expiretime) && ($currenttime > $expiretime)){
			$avexpired = 1;
		}
	}*/
?>
	<?php if ($licencetype == 0){?>
		<script type="text/javascript">
			window.onload=function(){
		   alert("当前设备无任何授权许可证，请与您的设备供应商联系以获取技术支持!");
		}
		</script>
	<?php }?>
	<?php if ($licencestatus == 1){?>
		<script type="text/javascript">
			window.onload=function(){
		   alert("测试许可证已过期，请与您的设备供应商联系以免影响您的使用!");
		}
		</script>
	<?php }?>
	<?php if ($GLOBALS['av_expired'] == 1){?>
		<script type="text/javascript">
			window.onload=function(){
		   alert("当前设备病毒防护功能已过期，为保证文件安全，请与您的设备供应商联系以重新获取防病毒许可!");
		}
		</script>
	<?php }?>
<?php if(isset($_GET['type'])){?>
<style>.topbar{display: none;}.frame-header{top:0;}.frame-main{top:50px;}</style>
<?php } ?>

<body style="overflow:hidden;" oncontextmenu="return core.contextmenu();">
	<?php include(TEMPLATE.'common/navbar.html');?>
	<div class="frame-header">
		<div class="header-content">
			<div class="header-left">
				<div class="btn-group btn-group-sm">
					<button class="btn btn-default" id='history_back' title='<?php echo $L['history_back'];?>' type="button">
						<i class="font-icon icon-arrow-left"></i>
					</button>
					<button class="btn btn-default" id='history_next' title='<?php echo $L['history_next'];?>' type="button">
						<i class="font-icon icon-arrow-right"></i>
					</button>
				</div>
			</div><!-- /header left -->
			
			<div class='header-middle'>
				<button class="btn btn-default" id='home' title='<?php echo $L['secros_name_desc'];?>'>
					<i class="font-icon icon-home"></i>
				</button>

				<div id='yarnball' title="<?php echo $L['address_in_edit'];?>"></div>
				<div id='yarnball_input'><input type="text" name="path" value="" class="path" id="path"/></div>
				<button class="btn btn-default" id='up' title='<?php echo $L['go_up'];?>' type="button">
					<i class="font-icon icon-circle-arrow-up"></i>
				</button>
				<button class="btn btn-default" id='refresh' title='<?php echo $L['refresh_all'];?>' type="button">
						<i class="font-icon icon-refresh"></i>
					</button>
				<div class="path_tips" title="<?php echo $L['only_read_desc'];?>"><i class="icon-warning-sign"></i><?php echo $L['only_read'];?></div>
			</div><!-- /header-middle end-->		
			<div class='header-right'>
			</div>
		</div>
	</div><!-- / header end -->

	<div class="frame-main">
		<div class='frame-left'>
		
			<ul id="folderList" class="ztree"></ul>
			<div class="bottom_box">
				<div class="box_content">
					<a href="javascript:ui.path.list('*recycle*');" class="cell menuRecycleButton"><i class="font-icon icon-bug"></i><span><?php echo $L['recycle'];?></span></a>
					<div style="clear:both"></div>
				</div>
			</div>
		</div><!-- / frame-left end-->
		<div class='frame-resize'></div>
		<div class='frame-right'>
			<div class="frame-right-main">
				<div class="tools">
					<div class="tools-left">
						<!-- 回收站tool -->
						<div class="btn-group btn-group-sm secros_recycle_tool hidden">
							<button id='recycle_clear' class="btn btn-default" type="button">
					        	<i class="font-icon icon-folder-close-alt"></i><?php echo $L['recycle_clear'];?>
					        </button>
						</div>

						<!-- 分享 tool -->
						<div class="btn-group btn-group-sm secros_share_tool hidden">
							<button id='refresh' class="btn btn-default" type="button">
					        	<i class="font-icon icon-folder-close-alt"></i><?php echo $L['refresh'];?>
					        </button>
						</div>

						<!-- 文件功能 -->
						<div class="btn-group btn-group-sm secros_path_tool">
					        <button id='upload' class="btn btn-default" type="button">
					        	<i class="font-icon icon-cloud-upload"></i><?php echo $L['upload'];?>
					        </button>
					        <button id='download' class="btn btn-default" type="button">
					        	<i class="font-icon icon-cloud-download"></i><?php echo $L['download'];?>
					        </button>
									<button id='scanvirus' class="btn btn-default" type="button">
					        	<i class="font-icon icon-bolt"></i><?php echo $L['scanvirus'];?>
					        </button>
					        <div class="btn-group btn-group-sm">
						    <button type="button" class="btn btn-default btn-sm dropdown-toggle" data-toggle="dropdown">
						      <i class="font-icon icon-tasks"></i>more&nbsp;<span class="caret"></span>	      
						    </button>
						    <ul class="dropdown-menu pull-right drop-menu-action fadein">
							    <li id="copy"><a href='javascript:;'><i class="font-icon icon-copy"></i><?php echo $L['copy'];?></a></li>
							    <li id="rname"><a href='javascript:;'><i class="font-icon icon-pencil"></i><?php echo $L['rename'];?></a></li>
							    <li id="cute"><a href='javascript:;'><i class="font-icon icon-cut"></i><?php echo $L['cute'];?></a></li>
							    <li id="past"><a href='javascript:;'><i class="font-icon icon-paste"></i><?php echo $L['past'];?></a></li>
							    <li id="remove"><a href='javascript:;'><i class="font-icon icon-trash"></i><?php echo $L['remove'];?></a></li>
							    <li class="divider"></li>
							    <li id="info"><a href='javascript:;'><i class="font-icon icon-info"></i><?php echo $L['info'];?></a></li>
						    </ul>
						  </div>
						</div>
						<span class='msg'><?php echo $L['path_loading'];?></span>
					</div>
					<div class="tools-right">
						<div class="btn-group btn-group-sm">
						  <button id='set_icon' title="<?php echo $L['list_icon'];?>" type="button" class="btn btn-default">
						  	<i class="font-icon icon-th"></i>
						  </button>
						  <button id='set_list' title="<?php echo $L['list_list'];?>" type="button" class="btn btn-default">
						  	<i class="font-icon icon-list"></i>
						  </button>
						  <div class="btn-group btn-group-sm">
						    <ul class="dropdown-menu pull-right dropdown-menu-theme fadein">
							    <?php 
									$tpl="<li class='list {this}' theme='{0}'><a href='javascript:void(0);'>{1}</a></li>\n";
									echo getTplList(',',':',$config['setting_all']['themeall'],$tpl,$config['user']['theme'],'this');
								?>
						    </ul>
						  </div>
						</div>
					</div>
					<div style="clear:both"></div>
				</div><!-- end tools -->
				<div id='list_type_list'></div><!-- list type 列表排序方式 -->
				<div class='bodymain html5_drag_upload_box menuBodyMain'>
					<div class="fileContiner"></div>
				</div><!-- html5拖拽上传list -->
			</div>
		</div><!-- / frame-right end-->
	</div><!-- / frame-main end-->
<?php include(TEMPLATE.'common/footer.html');?>
<script src="<?php echo STATIC_PATH;?>js/lib/seajs/sea.js?ver=<?php echo SECROS_VERSION;?>"></script>
<script src="./index.php?user/common_js&type=explorer&id=<?php echo rand_string(8);?>"></script>
<script type="text/javascript">
	G.this_path = "<?php echo $dir;?>";
	seajs.config({
		base: "<?php echo STATIC_PATH;?>js/",
		preload: ["lib/jquery-1.8.0.min"],
		map:[
			[ /^(.*\.(?:css|js))(.*)$/i,'$1$2?ver='+G.version]
		]
	});
	seajs.use("app/src/explorer/main");
</script>
</body>
</html>
