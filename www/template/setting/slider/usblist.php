<div class='h1'><i class="font-icon icon-anchor"></i><?php echo $L['setting_usblist'];?></div>
<div class="nav">
    <a href="javascript:;" class="this"  data-page="setting_usblist_whitelist"><?php echo $L['setting_usblist_whitelist'];?></a>
    <div style="clear:both;"></div>
</div>

<div class="section setting_usblist_whitelist">
<div class="box_line" style="display:flex;align-items:center;margin-bottom:8px;">
		<span class='infotitle'><?php echo $L['setting_usblist_method'];?>:</span>
		<div style="display:flex;align-items:center">
<input type="radio" name="settingUsbStatus" value="0"  style="margin: 0;border: none!important;box-shadow: none!important;"/>允许所有U盘
<input type="radio" name="settingUsbStatus" value="1"  style="margin: 0;margin-left:22px;border: none!important;box-shadow: none!important;"/>只允许以下白名单接入
		</div>
	</div>


    <!-- usb_white_list -->
    <table id='list' align="center" border=0 cellspacing=0 cellpadding=0 ></table>
	<a href="javascript:void(0)" class='add'><i class="icon-plus pr-10"></i><?php echo $L['button_add'];?></a>
</div>