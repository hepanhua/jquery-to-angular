<?php

class pwdstrategy extends Controller{
   
    function __construct(){
        parent::__construct();
    }
    
    public function get() {
        $pwdfile = new fileCache(CONFIG_PATH.'pwdstrategy.php');
        $safetime = $pwdfile->get('safetime');
        $pwd_hight = $pwdfile->get('pwd_hight');
        $timeout =   $pwdfile->get('timeout');
        $blacklistnumbers = $pwdfile->get('blacklistnumbers');
        $result = array(
            'safetime'      => $safetime,
            'timeout'       => $timeout,
            'pwd_hight' => $pwd_hight,
            'blacklistnumbers'   => $blacklistnumbers
        );
        show_json($result);
    }
    
    public function set() {
        $safetime =  $this->in['safetime'];
        $timeout = $this->in['timeout'];
        $pwd_hight =  $this->in['pwd_hight'];
        $blacklistnumbers =  $this->in['blacklistnumbers'];

        if($timeout < 30){
            write_audit('信息','设置','失败','设置'.$this->L['pwdstrategy']);
            show_json($this->L['error'].',超时锁定不得小于30秒',false);
        }
        
        $pwdfile = new fileCache(CONFIG_PATH.'pwdstrategy.php');

        if(! $pwdfile -> update('safetime',$safetime)){
            $pwdfile -> add('safetime',$safetime);
        }
       
        if(! $pwdfile -> update('timeout',$timeout)){
            $pwdfile -> add('timeout',$timeout);
        }

        if(! $pwdfile -> update('pwd_hight',$pwd_hight)){
            $pwdfile -> add('pwd_hight',$pwd_hight);
        }
        if(! $pwdfile -> update('blacklistnumbers',$blacklistnumbers)){
            $pwdfile -> add('blacklistnumbers',$blacklistnumbers);
        }
        
        write_audit('信息','设置','成功','设置'.$this->L['pwdstrategy']);
        show_json($this->L['success']);
    }
}