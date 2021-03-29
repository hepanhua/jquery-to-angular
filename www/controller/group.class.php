<?php

class group extends Controller{
    private $sql;
    function __construct()    {
        parent::__construct();
        $this->sql=new fileCache(CONFIG_PATH.'group.php');
        $pwdfile = new fileCache(CONFIG_PATH.'pwdstrategy.php');
        if(!empty($pwdfile->get('blacklistnumbers')) ){
            $this->pwdfailnum = intval($pwdfile->get('blacklistnumbers'));
        }else{
            $this->pwdfailnum = 5;
        }
    }
    
    public function get() {
        show_json($this->sql->get());
    }
    /**
     * 用户添加
     */
    public function add(){
        $group = $this->_init_data();
        if($this->sql->add($this->in['role'],$group)){
            show_json($this->L['success']);
        }
        show_json($this->L['error_repeat'],false);
    }

    /**
     * 编辑
     */
    public function edit(){
        $group = $this->_init_data();
        $role_old = $this->in['role_old'];
        if (!$role_old) show_json($this->L["groupname_can_not_null"],false);
        if ($role_old == 'root') show_json($this->L['default_group_can_not_do'],false);
        if ($role == 'audit') show_json($this->L['default_group_can_not_do'],false);

        if ($this->sql->replace_update($role_old,$this->in['role'],$group)){
            $member = new fileCache(CONFIG_PATH.'member.php');
            if ($member -> update('role',$this->in['role'],$role_old)) {
            	  system('/usr/sbin/setusboxftpd');
            	  system('/usr/sbin/setusboxsmbd');
                show_json($this->L['success']);
            }
            show_json($this->L['group_move_user_error'],false);
        }
        show_json($this->L['error_repeat'],false);
    }

    /**
     * 删除
     */
    public function del() {
        $role = $this->in['role'];
        if (!$role) show_json($this->L["groupname_can_not_null"],false);
        if ($role == 'root') show_json($this->L['default_group_can_not_do'],false);
        if ($role == 'audit') show_json($this->L['default_group_can_not_do'],false);
        if($this->sql->delete($role)){
            $member = new fileCache(CONFIG_PATH.'member.php');
            $member -> update('role','',$role);//改组用户设置为空
            show_json($this->L['success']);
        }
        show_json($this->L['error'],false);
    }


    //===========内部调用============
    /**
     * 初始化数据 get   
     * 只传键即可  &ext_not_allow=''&explorer-mkfile&explorer-pathRname
     */
    private function _init_data(){
        if (strlen($this->in['role'])<1) show_json($this->L["groupname_can_not_null"],false);
        if (strlen($this->in['name'])<1) show_json($this->L["groupdesc_can_not_null"],false);
        
        $role_arr = array('role'=>$this->in['role'],'name'=>$this->in['name']);
        $role_arr['ext_not_allow'] = $this->in['ext_not_allow'];
        foreach ($this->config['role_setting'] as $key => $actions) {
            foreach ($actions as $action) {
                $k = $key.':'.$action;
                if (isset($this->in[$k])){
                    $role_arr[$k] = 1;
                }else{
                    $role_arr[$k] = 0;
                }
            }
        }
        $role_arr['explorer:mkdir'] = 1;
        $role_arr['explorer:mkfile'] = 1;
        $role_arr['explorer:pathRname'] = 1;
        $role_arr['explorer:pathInfo'] = 1;
        $role_arr['explorer:pathCopy'] = 1;
        $role_arr['explorer:pathChmod'] = 1;
        $role_arr['explorer:pathCuteDrag'] = 1;
        $role_arr['explorer:pathCopyDrag'] = 1;
        $role_arr['explorer:clipboard'] = 1;
        $role_arr['explorer:pathPast'] = 1;
        $role_arr['explorer:pathCute'] =1;
        return $role_arr;
    }

    
    public  function getblacklist()
    {
        $failnum = $this->pwdfailnum;
        $handle = fopen('/etc/system/faillogin', 'r');
        $txt =array();
    while(!feof($handle)){
        $line = fgets($handle);
        $line = str_replace("\n","",$line);
        if($line != ""){
            $res = explode(":",$line);
            if($res[1] >= $failnum){
                array_push($txt,$res[0]);
            }
        }
    }
    fclose($handle);
        show_json($txt);
    }
    
    public  function blacklistdelect()
    {
        $targetip =  $this->in['ip'];
        $handle = fopen('/etc/system/faillogin', 'r');
        $txt =array();
    while(!feof($handle)){
        $line = fgets($handle);
        $line = str_replace("\n","",$line);
        if($line != ""){
        array_push($txt,$line);
          }
    }
    fclose($handle);
  $edit = fopen('/etc/system/faillogin', 'w');
  for($i=0;$i<count($txt);$i++)
  {
    if(strpos($txt[$i],$targetip) !== false){
        $res = explode(":",$txt[$i]);
        if($res[0] == $targetip){

        }else{
            fwrite($edit,$txt[$i]."\n");
        }
    }else{
        fwrite($edit,$txt[$i]."\n");
    }
}
    fclose($edit);
    write_audit('信息','设置','成功','删除'.$this->L['blacklist'].$targetip);
    show_json($this->L['success']);
    }
    
    public  function getwhitelist()
    {   $handle = fopen('/mnt/config/whitelist', 'r');
        $txt =array();
    while(!feof($handle)){
        $line = fgets($handle);
        $line = str_replace("\n","",$line);
        if($line != ""){
            array_push($txt,$line);
        }
    }
    fclose($handle);
    show_json($txt);
    }

    public  function addwhitelist()
    { 
        $targetip =  $this->in['ip'];
        $wlfile = fopen('/mnt/config/whitelist', 'r');
        $wltxt =array();
    while(!feof($wlfile)){
        $line = fgets($wlfile);
        $line = str_replace("\n","",$line);
        if($line != ""){
            array_push($wltxt,$line);
        }
    }
    fclose($wlfile);

        if(in_array($targetip,$wltxt)){
            write_audit('警告','设置','失败','添加'.$this->L['file_whitelist'].',已存在相同IP');
            show_json('已存在相同IP',false);
        }

        $add = fopen('/mnt/config/whitelist', 'a');
        fwrite($add,$targetip."\n" );
        fclose($add);
        write_audit('信息','设置','成功','添加'.$this->L['file_whitelist']);
        show_json('添加成功');
    }
   
    
    public  function whitelistdelect()
    {
        $targetip =  $this->in['ip'];
        $handle = fopen('/mnt/config/whitelist', 'r');
        $txt =array();
    while(!feof($handle)){
        $line = fgets($handle);
        $line = str_replace("\n","",$line);
        if($line != ""){
        array_push($txt,$line);
          }
    }
    fclose($handle);
    
  $edit = fopen('/mnt/config/whitelist', 'w');
  for($i=0;$i<count($txt);$i++)
  {
    if(strpos($txt[$i],$targetip) !== false){
        if($txt[$i] == $targetip){

        }else{
            fwrite($edit,$txt[$i]."\n");
        }
    }else{
        fwrite($edit,$txt[$i]."\n");
    }
}
    fclose($edit);
    show_json($this->L['success']);
    }
}