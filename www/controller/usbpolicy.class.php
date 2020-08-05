<?php 

class usbpolicy extends Controller{
    function __construct()    {
        parent::__construct();
    }
    public function get() {
        $usb_policy = config_get_value_from_file('/mnt/config/usbpolicy.conf','policy');
        show_json($usb_policy);
    }

    public function edit(){
        $policy = $this->in['policy'];
        $file = '/mnt/config/usbpolicy.conf';
        if($fp = fopen($file, "w")){
            if (flock($fp, LOCK_EX)) {
                fwrite($fp,"policy=".$policy);
                fflush($fp);  
                flock($fp, LOCK_UN); 
            }
            fclose($fp);            
        }
        show_json("修改成功");
    }

}