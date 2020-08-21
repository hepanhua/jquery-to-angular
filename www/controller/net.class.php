<?php 

class net extends Controller{
    private $sql;
    function __construct(){
        parent::__construct();
    }
    
    public function changeNet(){
    		$net_ip=$this->in['net_ip'];
    		$net_mask=$this->in['net_mask'];
    		$net_gateway=$this->in['net_gateway'];
    		$net_file = CONFIG_PATH.'net.conf';
    		config_update($net_file,"net_ip",$net_ip);
    		config_update($net_file,"net_mask",$net_mask);
    		config_update($net_file,"net_gateway",$net_gateway);
			//$exeinfo = 'sleep 1; /sbin/ifconfig LAN0 '.$net_ip.' netmask'.$net_mask;
			write_audit('信息','网络设置','成功','网络设置');
    		$use_time = mtime() - $GLOBALS['config']['app_startTime'];
				$result = array('code' => true ,'use_time'=> $use_time,'data' => $L['success']);
				header("X-Powered-By: SecROS.");
				header('Content-Type: application/json; charset=utf-8');
				echo json_encode($result);
        system('/usr/sbin/setnet');
    }
}
