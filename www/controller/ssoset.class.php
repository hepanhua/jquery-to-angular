<?php

class ssoset extends Controller{
   
    function __construct(){
        parent::__construct();
    }
    
    public function get() {
        $url = config_get_value_from_file(CONFIG_PATH.'sso.conf','url');
        $outurl = config_get_value_from_file(CONFIG_PATH.'sso.conf','outurl');
        $checkurl = config_get_value_from_file(CONFIG_PATH.'sso.conf','checkurl');
        $result = array(
            'url'      => $url,
            'checkurl' => $checkurl,
            'outurl'   => $outurl
        );
        show_json($result);
    }
    
    public function set() {
        $url =  $this->in['url'];
        $checkurl =  $this->in['checkurl'];
        $outurl =  $this->in['outurl'];
        $file = CONFIG_PATH.'sso.conf';
        config_update($file,"url",$url);
        config_update($file,"checkurl",$checkurl);
        config_update($file,"outurl",$outurl);
        write_audit('信息','设置','成功','设置'.$this->L['setting_sso']);
        show_json($this->L['success']);
    }
}