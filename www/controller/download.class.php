<?php 

class download extends Controller{
    // private $sql;
//     function __construct(){
// // 				parent::__construct();
				
// // echo "111"; // '111'
//     }
public function index() {
	$this->tpl = TEMPLATE.'download/';
		$this->display('index.php');
	}

	}
