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
        write_audit('信息','文件白名单','成功','设置文件白名单');
      show_json('success');
    }
    public function ai_study(){
        $res = $this->in['res'];
        $name = $this->in['name'];
        $res_value = '失败';
        if($res == 1){
            $res_value = '成功';
        }
        write_audit('信息','文件智能学习',$res_value,'学习'.$name);
        show_json(true);
    }
    public function get(){
        show_json($this->sql->get());
    }

    //===========�ڲ�����============
    /**
     * ��ʼ������ get   
     * ֻ��������  &ext_allow=''&vedio:avi&pic:bmp
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