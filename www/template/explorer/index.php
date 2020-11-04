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
	<script src="<?php echo STATIC_PATH;?>js/lib/pahomqtt.js?ver=<?php echo SECROS_VERSION;?>"></script>
	<?php
	if(SSO_ON == 1){
	?>
		<link rel="stylesheet" href="http://passport.citics.com/passport/resources/captcha/css/captcha.css" type="text/css">
		<script src="http://passport.citics.com/passport/resources/captcha/js/captcha.js" type="text/javascript"></script>
		<script language="javascript">
		var authLevel = '${authLevel}';
			var errorMessage = '${error}';
			var capthca = '${captcha}';
			initCaptcha({
				element : '#captcha_div',// requred by type [3/4/5]
				imgElement : '#captchaImg', // requred by type [1/2]
				inputElement : '#captchaInput',// requred by type [1/2]
				logLevel : 5, // logLevel error[1],warning[2],log[3],debug[4],all[5]
				type : '1', // TEXT("字符验证码", 1), ARITHMETIC("数字计算验证码", 2), DRAG("滑动验证码", 3), CHOOSE("选择结果验证码", 4), POSITION("位置选择验证码", 5);
				width : "260px",
				onVerify : function(message, instance) {
					if (message.result) {
						$('#captchaInput')[0].style.borderColor = "#00ff00";
						$('#captchaValidate')[0].value = message.validate;
						$('#captchaToken')[0].value = message.data.token;
					} else {
						$('#captchaInput')[0].style.borderColor = "#ff0000";
						instance.refresh();
					}
				}
			}, function(instance) {
				if (instance.conf.type >= 3) {
					$('#tr_validation_code')[0].style.display = '';
				} else {
					$('#tr_validation_code_input')[0].style.display = '';
				}
				instance.log("captcha instance initialization success, waiting for image loading");
			}, function(err) {
				alert(err);
			});
			</script>
	<?php
	}
	?>
	<style>
		html,body{
			padding:0;
			width:100%;
			height:100%;
		}
	</style>
</head>
<?php
	if (file_exists('/etc/system/Test.key')){
		$licencetype = 2;
		$licencestatus = config_get_unsign_int_from_file('/var/run/roswan','licencestatus');
	}
	if (file_exists('/etc/system/Licence.key')){
		$licencetype = 1;
	}
	$antivirus  = config_get_unsign_int_from_file('/etc/system/quota.conf','antivirus');
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
	<?php if ( AUDIT_ON == 1 &&  $GLOBALS['is_root'] === 'audit') {?>
<div style="display:flex;flex-direction: column;overflow:hidden;width:100%;height:100%;">
<div style="width:100%;height:90px"></div>
<iframe src="./index.php?log" frameborder="0" allowtransparency="true" style="flex:auto;border:0px none;"></iframe>
</div>
	<?php }else{ ?>
<div class="hidden"  id="devUpdataTips"  style="position: absolute;top: 0;left: 0;width: 100%;z-index: 9999;display: flex;justify-content: center;">
	<div style="background-color: #fffbe6;border: 1px solid #ffe58f;padding: 4px 32px;display: flex;justify-content: center;align-items: center;">
	<i class="font-icon icon-cog icon-spin" style="color: #EEAD0E;"></i><span style="margin-left:6px">设备正在升级中,请勿断开电源</span></div>
</div>
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
			
			<div class="usbStorage hidden">
			</div>

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
<!-- 回收站还原 -->
					<div class="btn-group btn-group-sm secros_recycle_restore  hidden">
							<button id='recycle_restore' class="btn btn-default" type="button">
					        	<i class="font-icon icon-folder-close-alt"></i><?php echo $L['recycle_restore'];?>
					        </button>
						</div>

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
							<?php
							if ($antivirus == 1) {
							?>
							<button id='scanvirus' class="btn btn-default" type="button">
					        	<i class="font-icon icon-bolt"></i><?php echo $L['scanvirus'];?>
					        </button>
							<?php
							}
							?>
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
	<?php } ?>

	<div class="getusbsid_frame_warning hidden"></div>

	
	<div class="canvasframe hidden">
        <div class="canvasframe_flex">
		  <div class="radar" id="radar">
<div class="rad1"></div>
<div class="rad2"></div>
	</div>
            <div class="progress">
                <div class="progress_bar" id="reboot_progress_bar">
                    <div class="progress_value" id="reboot_progress_value">0</div>
                </div>
			</div>
			<div class="infected_txt"></div>
	<div class="shutdown_loading  hidden">
	<div class="loading_btn shutdown_loading_btn">终止扫描</div>
	</div>

			<div class="loading_btn_frame  hidden">
	<div class="loading_btn loading_btn_ok">确认</div>
	<div class="loading_btn loading_btn_cancle" style="margin-left:48px">取消</div>
	<div class="loading_btn loading_btn_details hidden" style="margin-left:48px">查看详情</div>
	</div>
		</div>
		
	</div>


	<div class="av_details hidden">
        <div class="av_flex">
		<div class="av_hidden">
		<img src="./static/images/CLOSE.png" style="width:18px;height:18px;">
		</div>
		 <div style="height:20%;font-size: 22px;align-items: center;display: flex;">病毒详情</div>
		 <div class="av_title">
		<div>病毒名称</div>
		<div>路径</div>
		<div>日期</div>
		<div>处理方式</div>
		 </div>
		 <div class="av_content">
		 </div>
		</div>
	</div>


	<div class="updateframe rebootdom hidden">
    <div class="updateframe_flex">
	<div class="rebootsever_Ani">
  <div class="a1"></div>
  <div class="a2"></div>
  <div class="a3"></div>
  <div class="w1"></div>
  <div class="w2"></div>
  <div class="w3"></div>
</div>
		  <div  id="rebootdom_text">重启中</div>
                <div class="updateprogress">
                    <div class="updateprogress_bar" id="rebootdom_progress_bar">
                        <div class="updateprogress_value" id="rebootdom_progress_value">0</div>
                    </div>
                </div>
            </div>
    </div>
	

	<div class="updateframe updatedom hidden">
    <div class="updateframe_flex">
            <div class="updateloading"  >
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
		  </div>
		  <div  id="update_text">文件上传中</div>
                <div class="updateprogress">
                    <div class="updateprogress_bar" id="update_progress_bar">
                        <div class="updateprogress_value" id="update_progress_value">0</div>
                    </div>
                </div>
            </div>
	</div>
	
	<div class="usb_mount hidden">
	<div class="usb_mount_sf">
	<span id="usbname_loading">存储器挂载中</span>
	<div ><img src="./static/images/loading_simple.gif"></div>
	</div>
	</div>

	<div class="file_loading hidden">
	<div class="file_loading_sf">
	<span>文件传输中</span>
	<div ><img src="./static/images/loading_simple.gif"></div>
	</div>
	</div>


	<!-- 病毒库升级 -->
	<div class="updateframe  antivirus_update hidden">
    <div class="updateframe_flex">
      <img src="./static/images/CLOSE.png" class="close_antivirus">
      <div class="box_rotate_loading">
        <div class="box_bordera">  
          <div class="box_context"></div>
        </div>  
        <div class="box_borderb">
          <div class="box_context"></div>
        </div>
      </div>

		  <div  class="ant_update_text">病毒库更新中</div>
                <div class="updateprogress">
                    <div class="updateprogress_bar">
                        <div class="updateprogress_value">0</div>
                    </div>
                </div>
                <!-- <div class="antivirus_alwayshidden">
                  <input type="checkbox">本次更新完成前,始终隐藏在右下角
                </div> -->
                <div class="loading_btn_frame">
                  </div>
            </div>
  </div>
  

  <div class="ant_update_small hidden">
    <div class="hidden_ant_update_small">隐藏</div>
    <div class="small_progree_title">病毒库更新中</div>
    <div style="display: flex;align-items: center;">
      <div class="ant_update_progress">
        <div style="width:0%;"></div>
      </div>
      <div class="ant_update_percent">11%</div>
    </div>
  </div>
	<!-- 病毒库升级end -->

	<?php
	if (SSO_ON == 1) {
	?>
	<tr id="tr_validation_code_input" >
	<td class="lui_login_input_title">验证码：</td>
		<td class="lui_login_input_td">
			<div class="lui_login_input_div">
				<input type="text" id="captchaInput" name="j_validation_code" class="lui_login_input_vcode" placeholder="验证码"> <img id="captchaImg" style="cursor: pointer;"> 
                <input type="hidden" id="captchaValidate" name="captchaValidation"/>
                <input type="hidden" id="captchaToken" name="captchaToken"/>
			</div>
	    </td>
</tr>
<tr id="tr_validation_code" style="display: block">
	<td>
		<div id="captcha_div" width="260px"></div>
	</tr>
	<?php
	}
	?>

<?php include(TEMPLATE.'common/footer.html');?>
<script src="<?php echo STATIC_PATH;?>js/lib/seajs/sea.js?ver=<?php echo SECROS_VERSION;?>"></script>
<script src="./index.php?user/common_js&type=explorer&id=<?php echo rand_string(8);?>"></script>
<script type="text/javascript">
	G.this_path = "<?php echo $dir;?>";
	G.Pic_View = "<?php echo X86;?>";
	G.Super = "<?php echo $_SESSION['super'];?>";
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
