<div class='h1'><i class="font-icon icon-star"></i><?php echo $L['setting_platform'];?></div>
<?php
$platform_serverip  = config_get_value_from_file('/mnt/config/noc.conf','serverip');
$platform_monitoringUnitId = config_get_value_from_file('/mnt/config/noc.conf','monitoringUnitId');
$platform_authmode =config_get_value_from_file('/mnt/config/noc.conf','authmode');
$platform_id = config_get_value_from_file('/mnt/config/noc.conf','id');
$platform_password = config_get_value_from_file('/mnt/config/noc.conf','password');
$platform_filename = config_get_value_from_file('/mnt/config/noc.conf','certname');
?>
<div class="section platform">
	<div class="box_line">
		<span class='infotitle'><?php echo $L['platform_serverip'];?>:</span><input type="text" id="serverip"
    value="<?php echo $platform_serverip;?>" />
	</div>

    <div class="box_line" style="border-top: 1px solid #ccc!important;margin-top: 8px;padding-top:8px!important;">
		<span class='infotitle' style="font-szie:18px;font-weight:bold;">设备接入认证:
	</div>
    


	<div class="box_line">
		<span class='infotitle'><?php echo $L['platform_monitoringUnitId'];?>:</span><input type="text" id="monitoringUnitId"
    value="<?php echo $platform_monitoringUnitId;?>" />
	</div>

	<div class="box_line" style="display:flex;align-items:center">
		<span class='infotitle'><?php echo $L['platform_authmode'];?>:</span>
		<div style="display:flex;align-items:center">
<input type="radio" name="authmode" value="1"  style="margin: 0;border: none!important;box-shadow: none!important;margin-right: 6px;"
<?php
		if ($platform_authmode=="1") {
		?>	
		checked='true' 
		<?php
		}
		?>/> <?php echo $L['platform_typea'];?>
<input type="radio" name="authmode" value="2"  style="margin: 0;margin-left:22px;border: none!important;box-shadow: none!important;margin-right: 6px;"
<?php
		if ($platform_authmode=="2") {
		?>	
		checked='true' 
		<?php
		}
		?>/> <?php echo $L['platform_typeb'];?>
		</div>
	</div>


	<div class="box_line platform_typea <?php echo $platform_authmode=="2"?"hidden":"";?>" style="margin-bottom: 8px;">
		<span class='infotitle'><?php echo $L['platform_id'];?>:</span><input type="text" id="id"  
    value="<?php echo $platform_id;?>" />
	</div>
	<div class="box_line platform_typea <?php echo $platform_authmode=="2"?"hidden":"";?>">
		<span class='infotitle'><?php echo $L['platform_password'];?>:</span><input type="text" id="password" 
    value="<?php echo $platform_password;?>" />
	</div>
    <div class="box_line platform_typeb <?php echo $platform_authmode=="2"?"":"hidden";?>">
    
		<span class='infotitle'><?php echo $L['platform_filename'];?>:</span>
        <input id="ssl_file"   type="file"   style="display:none">
        <div style="display: block;width: 350px; float: left;height:27px;">
<div  style="float:left;width:180px;border: 1px solid #bbb;height: 26px;line-height: 26px;"><p class="select_file_nametext" style="margin:0;white-space: nowrap; text-overflow: ellipsis; overflow: hidden;text-indent: 16px;">
<?php echo $platform_filename;?></p> </div>
<div class="upload_file_btn" style="float:left;float: left; height: 26px; line-height: 26px; padding: 0 18px;" id="ssl_file_btn_click">上传</div>
</div>
	</div>



  <div class="box_line" style="border-top: 1px solid #ccc!important;margin-top: 16px;padding-top: 16px!important;">
	<a href="javascript:void(0);" class="platform_save button"><?php echo $L['button_save'];?></a>
  </div>
  <div style="clear:both;"></div>
</div>