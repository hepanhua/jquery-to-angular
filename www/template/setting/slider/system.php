<div class='h1'><i class="font-icon icon-user"></i><?php echo $L['system_setting'];?></div>
<div class="nav">
    <a href="javascript:;"  class="this" data-page="setting"><?php echo $L['system_setting'];?></a>
	<a href="javascript:;" data-page="system_config"><?php echo $L['system_config_title'];?></a>
	<?php if (TIME_ON == 1) {  ?>
		<a href="javascript:;" id="system_timesetting" data-page="system_timesetting"><?php echo $L['system_timesetting'];?></a>
	<?php } ?>
	<div style="clear:both;"></div>
</div>

<div class="section setting system_setting">
	<div class="box_line">
		<span class='infotitle'><?php echo $L['system_desc'];?>:</span><input type="text" name="system_desc"
    value="<?php echo $L['secros_name_desc'];?>" >
		<i><?php echo $L['system_name_desc'];?></i>
	</div>
	<div class="box_line">
		<span class='infotitle'><?php echo $L['system_model'];?>:</span><input type="text" name="system_model"
    value="<?php echo $config['system_info']['MODEL'];?>" disabled/>
	</div>
	<div class="box_line">
		<span class='infotitle'><?php echo $L['system_serialno'];?>:</span><input type="text" name="system_serialno"
    value="<?php echo $config['system_info']['SERIALNO'];?>" disabled/>
	</div>
<?php
	if (file_exists('/etc/system/Test.key')){
		$licencetype = 2;
  	$endtime = config_get_unsign_int_from_file('/dev/test','endtime');
  	$licencestatus = config_get_unsign_int_from_file('/var/run/roswan','licencestatus');
	}
	if (file_exists('/etc/system/Licence.key')){
		$licencetype = 1;
	}
?>
	<div class="box_line">
		<span class='infotitle'><?php echo $L['system_license'];?>:</span><input type="text" name="system_license"
    value="<?php
    	if ($licencetype==0) {
    		echo $L['system_license_no'];
    	}else if ($licencetype==1){
    		echo $L['system_license_official'];
    	}else{
    		if ($endtime){
					if ($licencestatus){
						echo $L['system_license_test_timeout'];
					}else{
						$afterdate=date('Y-m-d',$endtime);
						echo $L['system_license_test_using'].$afterdate.')';
					}
				}else {
					echo $L['system_license_test'];
				}
    	}
    	?>" disabled/>
    <i><a href="javascript:;" class="license_setting"><?php $image = STATIC_PATH.'images/licence.png';echo '<img src="'.$image.'" />';?></a></i>
	</div>
	<?php
		$xmodel =  "";
			switch (xmodel_v)
			{
				case "1":
					$xmodel =  $L['xmodel_std'];
					break;
				case "2":
					$xmodel =  $L['xmodel_pro'];
					break;
				case "3":
					$xmodel =  $L['xmodel_ca'];
					break;
				case "4":
					$xmodel =  $L['xmodel_gm'];
					break;
				default:
					break;
			}
	?>
	<div class="box_line">
		<span class='infotitle'><?php echo $L['system_software'];?>:</span><input type="text" name="system_software"
    value="<?php echo $config['system_info']['SOFTWARE']; echo $xmodel;?>" disabled/>
    <i><a href="javascript:;" class="upgrade_software"><?php $image = STATIC_PATH.'images/upgrade.png';echo '<img src="'.$image.'" />';?></a></i>
	</div>
	<div class="box_line">
		<span class='infotitle'><?php echo $L['system_builddate'];?>:</span><input type="text" name="system_builddate"
    value="<?php echo $config['system_info']['BUILDDATE'];?>" disabled/>
	</div>
	<div class="box_line">
		<span class='infotitle'><?php echo $L['system_hardware'];?>:</span><input type="text" name="system_hardware"
    value="<?php echo $config['system_info']['HARDWARE'];?>" disabled/>
	</div>
	<div class="box_line">
		<span class='infotitle'><?php echo $L['system_uptime'];?>:</span><input type="text" name="system_uptime"
    value="<?php echo $config['system_info']['UPTIME'];?>" disabled/>
	</div>
  <div class="box_line">
    <a href="javascript:void(0);" class="system_save button"><?php echo $L['button_save'];?></a>

   <a href="javascript:void(0);" class="reboot button"><?php echo $L['reboot'];?></a>
  </div>
  <div style="clear:both;"></div>
</div>

<div class="section system_config hidden">
<div style="border: 1px solid #dde;border-bottom:none;line-height:48px;font-size:16px;display:flex;align-items: center;">
<input id="backupfile_id"   type="file" size="32" style="display:none">
    <div style="display:flex;align-items: center;flex-wrap:wrap;">
    <a class="button" style="width:90px;margin-left:22px"  id="backup_btn">恢复配置</a>
    <div><p class="select_file_nametext" style="margin:0;white-space: nowrap; text-overflow: ellipsis; overflow: hidden;text-indent: 16px;"></p> </div>
	<a class="button hidden" style="width:90px;margin-left:22px"  id="backup_btn_post">确定</a>
</div>

</div>
<div style="border: 1px solid #dde;border-bottom:none;height:48px;font-size:16px;display:flex;align-items: center;">
  <a class="button" style="width:90px;margin-left:22px"  id="download_backup">备份配置</a>
</div>
<div style="border: 1px solid #dde;height:48px;font-size:16px;display:flex;align-items: center;">
  <a class="button" style="width:90px;margin-left:22px"  id="factoryreset">还原出厂配置</a>
</div>
</div>

<!-- 时间设置 -->
<?php if (TIME_ON == 1) {  ?>
<div class="section system_timesetting hidden">
<div class="box_line">
<div style="display:flex;flex-direction: column;">
	<div style="display:flex;padding: 8px 0; font-size: 14px;">
	<div>当前PC时间</div>
	<div id="now_time" style="margin-left: 16px;"></div>
	</div>
	</div>
</div>
<div class="box_line">
	<div style="display:flex;flex-direction: column;">
	<div>
	<input type="radio" name="time_method" value="1"> 时间设置
	</div>
	<div style="display:flex;">
	<input type="datetime-local"  id="time_value">
	</div>
	</div>
</div>
<div class="box_line">
<div style="display:flex;flex-direction: column;">
	<div>
	<input type="radio" name="time_method" value="2">  与NTP服务器同步
	</div>
	<div style="display:flex;align-items: center; margin-bottom: 8px;">
<div  style="width:60px;">服务器</div>
<input type="text" id="ntp_server" style="width:152px;font-weight: normal;">
	</div>

	<div style="display:flex;align-items: center;">
<div style="width:60px;">同步间隔</div>
<input type="number" id="ntp_server_ck" min="100">
<span style="margin-left:8px;">(单位:秒)</span>
	</div>

	</div>
</div>

<div class="box_line">
    <a href="javascript:void(0);" class="add_save button"><?php echo $L['button_save'];?></a>
</div>
  <div style="clear:both;"></div>
</div>
<?php } ?>