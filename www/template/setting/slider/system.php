<div class='h1'><i class="font-icon icon-user"></i><?php echo $L['system_setting'];?></div>
<div class="nav">
    <a href="javascript:;"  class="this" data-page="setting"><?php echo $L['system_setting'];?></a>
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
	<div class="box_line">
		<span class='infotitle'><?php echo $L['system_software'];?>:</span><input type="text" name="system_software" 
    value="<?php echo $config['system_info']['SOFTWARE'];?>" disabled/>
    <i><a href="javascript:;" class="upgrade_software"><?php $image = STATIC_PATH.'images/upgrade.png';echo '<img src="'.$image.'" />';?></a></i>
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



