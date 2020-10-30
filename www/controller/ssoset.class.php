<?php

class ssoset extends Controller{
   
    function __construct(){
        parent::__construct();
    }
    
    public function get() {
        // $url = config_get_value_from_file(CONFIG_PATH.'sso.conf','url');
        // $outurl = config_get_value_from_file(CONFIG_PATH.'sso.conf','outurl');
        // $checkurl = config_get_value_from_file(CONFIG_PATH.'sso.conf','checkurl');
        $sso = new fileCache(CONFIG_PATH.'sso.php');
        $url = $sso->get('url');
        $outurl = $sso->get('outurl');
        $checkurl = $sso->get('checkurl');
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
        $sso = new fileCache(CONFIG_PATH.'sso.php');
        if(! $sso -> update('url',$url)){
            $sso -> add('url',$url);
        }
       
        if(! $sso -> update('outurl',$outurl)){
            $sso -> add('outurl',$outurl);
        }
        if(! $sso -> update('checkurl',$checkurl)){
            $sso -> add('checkurl',$checkurl);
        }
        
        write_audit('信息','设置','成功','设置'.$this->L['setting_sso']);
        show_json($this->L['success']);
    }
}