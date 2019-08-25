<?php 


class log extends Controller{
    private $sql;
    function __construct(){
        parent::__construct();
    }

    /**
     * 用户首页展示
     */
    public function index() {
		$this->tpl = TEMPLATE.'log/';
    	$this->display('index.php');
    }

    /**
     * 用户首页展示
     */
    public function slider() {
		$this->tpl = TEMPLATE . 'log/slider/';
    	$this->display($this->in['slider'].'.php');
    }
    
    
    public function php_info(){
        phpinfo();
    }
    
}
