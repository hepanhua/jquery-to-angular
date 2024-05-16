<?php

class member extends Controller{
    private $sql;
    function __construct()    {
        parent::__construct();
        $this->tpl = TEMPLATE.'member/';
        $this->sql=new fileCache(CONFIG_PATH.'member.php');
    }
    
    /**
     * 获取用户列表数据
     */
    public function get() {
        show_json($this->sql->get());
    }
    /**
     * 用户添加
     */
    public function add(){
        if (!$this->in['name'] || 
            !$this->in['password'] ||
            !$this->in['role'] ) show_json($this->L["data_not_full"],false);

		if ($this->in['name'] == 'super') show_json($this->L['default_user_can_not_do'],false);
		
        $this->in['name'] = rawurldecode($this->in['name']);
        $this->in['password'] = rawurldecode($this->in['password']);
        $user = array(
            'name'      =>  rawurldecode($this->in['name']),
            'password'  =>  md5(rawurldecode($this->in['password'])),
            'role'      =>  $this->in['role'],
            'status'    =>  0,
        );
        if ($this->sql->add($this->in['name'],$user)) {
            $this->_initUser($this->in['name']);
            system('/usr/sbin/setusboxftpd');
            system('smbpasswd -a ' . $this->in['name'] . ' -P ' . $this->in['password'] . '>>/dev/null &');
            system('/usr/sbin/setusboxsmbd');
            write_audit('信息','设置','成功',$this->L["setting_member"].':添加'.$user['name']);
            show_json($this->L['success']);
        }
        write_audit('警告','设置','失败',$this->L["setting_member"].':添加'.$this->in['name'].$this->L['error_repeat']);
        show_json($this->L['error_repeat'],false);
    }

    /**
     * 编辑
     */
    public function edit() {        
        if (!$this->in['name'] || 
            !$this->in['name_to'] || 
            !$this->in['role_to'] ) show_json($this->L["data_not_full"],false);

        $this->in['name'] = rawurldecode($this->in['name']);
        $this->in['name_to'] = rawurldecode($this->in['name_to']);
        $this->in['password_to'] = rawurldecode($this->in['password_to']);
        if ($this->in['name'] == 'admin') show_json($this->L['default_user_can_not_do'],false);

        //查找到一条记录，修改为该数组
        $user = $this->sql->get($this->in['name']);
        $user['name'] = $this->in['name_to'];
        $user['role'] = $this->in['role_to'];

        if (strlen($this->in['password_to'])>=1) {
            $user['password'] = md5($this->in['password_to']);
        }
        if($this->sql->replace_update($this->in['name'],$user['name'],$user)){
            rename(USER_PATH.$this->in['name'],USER_PATH.$this->in['name_to']);
            system('/usr/sbin/setusboxftpd');
            if (strlen($this->in['password_to'])>=1) {
            	system('smbpasswd -a ' . $user['name'] . ' -P ' . $this->in['password_to'] . '>>/dev/null &');
            }
            system('/usr/sbin/setusboxsmbd');
            write_audit('信息','设置','成功',$this->L["setting_member"].':编辑'.$user['name']);
            show_json($this->L['success']);
        }
         write_audit('警告','设置','失败',$this->L["setting_member"].':编辑'.$this->in['name'].$this->L['error_repeat']);
        show_json($this->L['error_repeat'],false);
    }

    /**
     * 删除
     */
    public function del() {
        $name = $this->in['name'];
        if (!$name) show_json($this->L["username_can_not_null"],false);
        if ($name == 'admin') show_json($this->L['default_user_can_not_do'],false);
        if($this->sql->delete($name)){
            del_dir(USER_PATH.$name.'/');
            system('/usr/sbin/setusboxftpd');
            system('smbpasswd -x ' . $name . '>>/dev/null &');
            system('/usr/sbin/setusboxsmbd');
            write_audit('信息','设置','成功',$this->L["setting_member"].':删除'.$name);
            show_json($this->L['success']);
        }
        show_json($this->L['error'],false);
    }

    //============内部处理函数=============
    /**
     *初始化用户数据和配置。
     */    
    public function _initUser($name){
        $root = array('home','recycle','data');
        $new_user_folder = $this->config['setting_system']['new_user_folder'];
        $home = explode(',',$new_user_folder);

        $user_path = USER_PATH.$name.'/';
        mk_dir($user_path);
        foreach ($root as $dir) {
            mk_dir($user_path.$dir);
        }
        foreach ($home as $dir) {
            mk_dir($user_path.'home/'.$dir);
        }
        fileCache::save($user_path.'data/config.php',$this->config['setting_default']);
    }
}