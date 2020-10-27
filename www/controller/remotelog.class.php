<?php

class remotelog extends Controller{
   
    function __construct(){
        parent::__construct();
    }
    
    public function get() {
        $remotelog = config_get_value_from_file(CONFIG_PATH.'remotelog.conf','remotelog');
        $remotelogserver = config_get_value_from_file(CONFIG_PATH.'remotelog.conf','remotelogserver');
        $result = array(
            'remotelog'      => $remotelog,
            'remotelogserver'   =>  $remotelogserver
        );
        show_json($result);
    }
    
    public function set() {
        $remotelog =  $this->in['remotelog'];
        $remotelogserver =  $this->in['remotelogserver'];
        $file = CONFIG_PATH.'remotelog.conf';
        config_update($file,"remotelog",$remotelog);
        config_update($file,"remotelogserver",$remotelogserver);
        system('/usr/sbin/setremotelog');
        write_audit('信息','设置','成功','设置'.$this->L['setting_remotelog']);
        show_json($this->L['success']);
    }
}