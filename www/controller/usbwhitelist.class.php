<?php 

class usbwhitelist extends Controller{
    private $sql;
    function __construct()    {
        parent::__construct();
        $this->tpl = TEMPLATE.'usbwhitelist/';
        $this->sql=new fileCache(CONFIG_PATH.'usbwhitelist.php');
    }
    public function get() {
        show_json($this->sql->get());
    }
    public function add(){
		if (!$this->in['name'] || 
		!$this->in['user'] || 
		!$this->in['desc']) show_json($this->L["data_not_full"],false);

        $usblist = array(
            'name'      =>  rawurldecode($this->in['name']),
            'user'      =>  rawurldecode($this->in['user']),
            'desc'      =>  rawurldecode($this->in['desc'])
        );
        if ($this->sql->add($this->in['name'],$usblist)) {
            write_audit('信息','设置','成功',$this->L["setting_usblist"].':添加'.$this->in['name']);
            show_json($this->L['success']);
        }
        write_audit('警告','设置','失败',$this->L["setting_usblist"].':添加'.$this->in['name'].$this->L['error_repeat']);
        show_json($this->L['error_repeat'],false);
	}
	
    public function edit() {
        if (!$this->in['name'] || 
            !$this->in['user'] || 
            !$this->in['desc']) show_json($this->L["data_not_full"],false);
    
        $usblist = $this->sql->get($this->in['name']);
        $usblist['name'] = rawurldecode($this->in['name']);
        $usblist['user'] = rawurldecode($this->in['user']);
        $usblist['desc'] = rawurldecode($this->in['desc']);

        if($this->sql->replace_update($this->in['name'],$usblist['name'],$usblist)){
                write_audit('信息','设置','成功',$this->L["setting_usblist"].':编辑'.$this->in['name']);
            show_json($this->L['success']);
        }
        write_audit('警告','设置','失败',$this->L["setting_usblist"].':编辑'.$this->in['name'].$this->L['error_repeat']);
        show_json($this->L['error_repeat'],false);
	}
	

    public function del() {
        $name = $this->in['name'];
        if($this->sql->delete($name)){
            write_audit('信息','设置','成功',$this->L["setting_usblist"].':删除'.$name);
            show_json($this->L['success']);
        }
        write_audit('警告','设置','失败',$this->L["setting_usblist"].':删除'.$name.$this->L['error']);
        show_json($this->L['error'],false);
	}

    
    // public function get() {
	// 		$db = new SQLite3('/var/spool/antivirus/log.db');
	// 		if ($db)
	// 		{
	// 			$results= $db->query("select count(*) as count from httplog");
	// 		}
	// 		else
	// 		{
	// 			show_json($L['data_error'],false);
	// 		}
		
		
	// $results1= $db->query("select * from httplog");  //正序
	// $data= array();
	// 	while ($res= $results1->fetchArray(1))
	// 	{
	// 		array_push($data, $res);
	// 	}
	// 		show_json($data,true);
//   }
    

    
}