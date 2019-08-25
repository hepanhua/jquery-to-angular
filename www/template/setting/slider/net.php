<div class='h1'><i class="font-icon icon-picture"></i><?php echo $L['setting_net'];?></div>
<div class="section">
	<div class='box'>
		<span ><?php echo $L['net_ip'];?></span>
		<input type="text" id="net_ip" value="<?php echo $config['net']['net_ip'];?>" />
		<div class='line'></div>
		<span ><?php echo $L['net_mask'];?></span>
		<input type="text" id="net_mask" value="<?php echo $config['net']['net_mask'];?>"/>
		<div class='line'></div>
		<span ><?php echo $L['net_gateway'];?></span>
		<input type="text" id="net_gateway" value="<?php echo $config['net']['net_gateway'];?>"/>
		<div class='unetinfo'></div>
		<a onclick="Setting.tools();" href="javascript:void(0);" class="save button"><?php echo $L['button_save'];?></a>
	</div>
</div>
