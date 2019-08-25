<?php 

class file extends Controller{
    private $sql;
    function __construct(){
        parent::__construct();
        $this->tpl = TEMPLATE.'file/';
        $this->sql=new fileCache(CONFIG_PATH.'filetype.php');
    }
    public function set(){
    	$filetype = $this->_init_data();
    	$this->sql->save(CONFIG_PATH.'filetype.php',$filetype);
    	system('/usr/sbin/setusboxftpd');
    	system('/usr/sbin/setusboxsmbd');
      show_json('success');
    }
    public function get(){
        show_json($this->sql->get());
    }

    //===========内部调用============
    /**
     * 初始化数据 get   
     * 只传键即可  &ext_allow=''&vedio:avi&pic:bmp
     */
    private function _init_data(){
    	$filetype_arr['ext_allow'] = $this->in['ext_allow'];
    	$filetype_arr['file_deepcheck'] = $this->in['file_deepcheck'];
        foreach ($this->config['filetype_setting'] as $key => $actions) {
            foreach ($actions as $action) {
                $k = $key.':'.$action;
                if (isset($this->in[$k])){
                    $filetype_arr[$k] = 1;
                }else{
                    $filetype_arr[$k] = 0;
                }
            }
        }
        return $filetype_arr;
    }
}