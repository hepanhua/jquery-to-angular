<?php

class pwdstrategy extends Controller{
   
    function __construct(){
        parent::__construct();
    }
    
    public function get() {
        $pwdfile = new fileCache(CONFIG_PATH.'pwdstrategy.php');
        $safetime = $pwdfile->get('safetime');
        $pwd_hight = $pwdfile->get('pwd_hight');
        $blacklistnumbers = $pwdfile->get('blacklistnumbers');
        $result = array(
            'safetime'      => $safetime,
            'pwd_hight' => $pwd_hight,
            'blacklistnumbers'   => $blacklistnumbers
        );
        show_json($result);
    }
    
    public function set() {
        $safetime =  $this->in['safetime'];
        $pwd_hight =  $this->in['pwd_hight'];
        $blacklistnumbers =  $this->in['blacklistnumbers'];

        $pwdfile = new fileCache(CONFIG_PATH.'pwdstrategy.php');

        if(! $pwdfile -> update('safetime',$safetime)){
            $pwdfile -> add('safetime',$safetime);
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