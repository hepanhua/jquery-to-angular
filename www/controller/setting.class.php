<?php 


class setting extends Controller{
    private $sql;
    function __construct(){
        parent::__construct();
    }

    /**
     * 用户首页展示
     */
    public function index() {
		$this->tpl = TEMPLATE.'setting/';
    	$this->display('index.php');
    }

    /**
     * 用户首页展示
     */
    public function slider() {
		$this->tpl = TEMPLATE . 'setting/slider/';
    	$this->display($this->in['slider'].'.php');
    }
    
    public function licence() {
		$this->tpl = TEMPLATE . 'setting/slider/';
    	$this->display('licence.php');
    }
    
    public function upgrade() {
		$this->tpl = TEMPLATE . 'setting/slider/';
    	$this->display('upgrade.php');
    }
    
    public function php_info(){
        phpinfo();
    }
    public function get_setting(){
        $setting = $GLOBALS['config']['setting_system']['menu'];
        if (!$setting) {
            $setting = $this->config['setting_menu_default'];
        }
        show_json($setting);
    }


    //管理员  系统设置全局数据
    public function system_setting(){
        $setting_file = CONFIG_PATH.'system_setting.php';
        $data = json_decode($this->in['data'],true);
        if (!$data) {
            show_json($this->L['error'],false);
        }
        $setting = $GLOBALS['config']['setting_system'];
        foreach ($data as $key => $value){
            if ($key=='menu') {
                $setting[$key] = $value;
            }else{
                $setting[$key] = rawurldecode($value);
            }
        }
        //$setting['menu'] = $GLOBALS['config']['setting_menu_default'];
        //为了保存更多的数据；不直接覆盖文件 $data->setting_file;
        fileCache::save($setting_file,$setting);
        show_json($this->L['success']);
        //show_json($setting);
    }

    /**
     * 参数设置
     * 可以同时修改多个：key=a,b,c&value=1,2,3
     */
    public function set(){
        $file = $this->config['user_seting_file'];
        if (!is_writeable($file)) {//配置不可写
            show_json($this->L['no_permission_write_file'],false);
        }
        $key   = $this->in['k'];
        $value = $this->in['v'];
        if ($key !='' && $value != '') {
            $conf = $this->config['user'];
            $arr_k = explode(',', $key);
            $arr_v = explode(',',$value);
            $num = count($arr_k);

            for ($i=0; $i < $num; $i++) { 
                $conf[$arr_k[$i]] = $arr_v[$i];
            }
            fileCache::save($file,$conf);
            show_json($this->L["setting_success"]);
        }else{
            show_json($this->L['error'],false);
        }
    }
    
    public function reboot(){
    	system("reboot");
    	show_json($this->L["reboot_success"]);
    }
    
    public function savecfg(){
    	system("/bin/savecfg",$retval);
    	if ($retval == 0){
    		show_json($this->L["savecfg_success"]);
    	}
    	else{
    		show_json($this->L["savecfg_failed"],false);
    	}
    }

    
    public function timeset(){
        $method=$this->in['method'];
        $ip=$this->in['ip'];
        $ck=$this->in['ck'];
        if($method == 1){
            $time=$this->in['time'];
            exec('date -s "'.$time.'"');
        }
        $time_file = CONFIG_PATH.'time.conf';
        config_update($time_file,"method",$method);
        config_update($time_file,"ip",$ip);
        config_update($time_file,"ck",$ck);
        system("/bin/setntp");
        show_json($this->L['success']);
    }

    public function timeget(){
        $ip = config_get_value_from_file(CONFIG_PATH.'time.conf','ip');
        $ck = config_get_value_from_file(CONFIG_PATH.'time.conf','ck');
        $method = config_get_value_from_file(CONFIG_PATH.'time.conf','method');
        $now_time= time();
        $now_date= date('Y-m-d H:i:s',$now_time);//2018-11-28 15:29:29
        $s_data = array(
            'method'      =>  $method,
            'ip'  =>  $ip,
            'ck'      =>  $ck,
            'now'    => $now_date,
        );
        show_json($s_data);
    }

    public function timeauto(){
        $now_time= date('Y');
        $time=$this->in['time'];
        if(!empty($time)){
            if($now_time != substr($time,-4)){
                exec('date -s "'.$time.'"');
            }
        }
        show_json(true);
    }
}
