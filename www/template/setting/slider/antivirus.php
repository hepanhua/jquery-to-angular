<div class='h1'><i class="font-icon icon-star"></i><?php echo $L['setting_antivirus'];?></div>
<div class="nav">
    <a href="javascript:;"  class="this" data-page="antivirus"><?php echo $L['setting_antivirus'];?></a>
    <div style="clear:both;"></div>
</div>
<?php
$antivirus_key  = config_get_value_from_file('/mnt/config/antivirus.conf','Key');
$antivirus_signatures = config_get_value_from_file('/mnt/config/antivirus.conf','Signature_number');
$antivirus_updatetime = config_get_value_from_file('/mnt/config/antivirus.conf','Update_time');
$antivirus_expiretime = config_get_value_from_file('/mnt/config/antivirus.conf','License_expiredate');
$antivirus_file = config_get_value_from_file('/mnt/config/antivirus.conf','antivirus_file');
$av_status = config_get_value_from_file('/dev/secros','av_status');
if (isset($av_status) && ($av_status == 2)){
	$avexpired = 1;
}
?>
<div class="section antivirus">
	<div class="box_line">
		<span class='infotitle'><?php echo $L['antivirus_key'];?>:</span><input type="text" id="key" name="key" 
    value="<?php echo $antivirus_key;?>" />
	</div>
	<div class="box_line">
		<span class='infotitle'><?php echo $L['antivirus_signatures'];?>:</span><input type="text" id="signatures" name="signatures" 
    value="<?php echo $antivirus_signatures;?>" disabled/>
	</div>
	<div class="box_line">
		<span class='infotitle'><?php echo $L['antivirus_update'];?>:</span><input type="text" id="update" name="update" 
    value="<?php echo $antivirus_updatetime;?>" disabled/>
	</div>
	<div class="box_line">
		<span class='infotitle'><?php echo $L['antivirus_expire'];?>:</span><input type="text" id="expire" name="expire" 
    value="<?php echo $antivirus_expiretime;?>" disabled/>
    <?php
    	if ($avexpired==1){?>
    		<i><font color='red' size=3><?php echo $L['antivirus_licence_expired'];?></font></i>
    <?php
    	}
    ?>
	</div>
	<div class="box_line">
		<span class='infotitle'><?php echo $L['antivirus_file'];?>:</span>
		<input type="checkbox" id='antivirus_file' name="antivirus_file" 
		<?php
		if ($antivirus_file==1) {
		?>	
		checked='true' 
		<?php
		}
		?>
		<?php
		if ($antivirus_key==NULL) {
		?>	
		disabled 
		<?php
		}
		?>
		/>           
		<span class="text"><?php echo $L['antivirus_file_tips'];?></span>
	</div>
  <div class="box_line">
    <a href="javascript:void(0);" class="av_save button"><?php echo $L['button_save'];?></a>
  </div>
  <div style="clear:both;"></div>
</div>



