<?php


class user extends Controller
{
    private $user;  //用户相关信息
    private $auth;  //用户所属组权限
    private $notCheck;
    function __construct(){
        parent::__construct();
        $this->tpl  = TEMPLATE  . 'user/';
        if(!isset($_SESSION)){//避免session不可写导致循环跳转
            $this->login("session write error!");
        }else{
            $this->user = &$_SESSION['secros_user'];
        }
        //不需要判断的action
        $this->notCheck = array('loginFirst','login','logout','loginSubmit','checkCode','public_link');
    }
    
    /**
     * 登录状态检测;并初始化数据状态
     */
    public function loginCheck(){
        if (ST == 'share') return true;//共享页面
        if(in_array(ACT,$this->notCheck)){//不需要判断的action
            return;
        }else if($_SESSION['secros_login']===true && $_SESSION['secros_user']['name']!=''){
            define('USER',USER_PATH.$this->user['name'].'/');
            define('USER_TEMP','/mnt/temp/');
            //define('USER_RECYCLE',USER.'recycle/');
            define('USER_RECYCLE','/var/spool/antivirus/recycle/');
            if (!file_exists(USER)) {
                $this->logout();
            }
            if ($this->user['role'] == 'root') {
                /*define('MYHOME',USER.'home/');
                define('HOME','');
                $GLOBALS['web_root'] = WEB_ROOT;//服务器目录
                $GLOBALS['is_root'] = 1;*/
                define('MYHOME','/');
                //define('HOME',USER.'home/');
                define('HOME',PUBLIC_PATH);
                $GLOBALS['web_root'] = str_replace(WEB_ROOT,'',HOME);//从服务器开始到用户目录
                $GLOBALS['is_root'] = 1;
            }else{
                define('MYHOME','/');
                //define('HOME',USER.'home/');
                 define('HOME',PUBLIC_PATH);
                $GLOBALS['web_root'] = str_replace(WEB_ROOT,'',HOME);//从服务器开始到用户目录
                $GLOBALS['is_root'] = 0;
            }
            date_default_timezone_set("Asia/Shanghai");
            $this->config['user_share_file']   = USER.'data/share.php';    // 收藏夹文件存放地址.
            $this->config['user_fav_file']     = USER.'data/fav.php';    // 收藏夹文件存放地址.
            $this->config['user_seting_file']  = USER.'data/config.php'; //用户配置文件
            $this->config['user']  = fileCache::load($this->config['user_seting_file']);
            //if($this->config['user']['theme']==''){
                $this->config['user'] = $this->config['setting_default'];
            //}
            $theme = config_get_value_from_file('/etc/system/oem.conf','THEME');
            if (isset($theme)){
            	$this->config['user']['theme']= $theme;
          	}
            return;
        }else if($_COOKIE['secros_name']!='' && $_COOKIE['secros_token']!=''){
            $member = new fileCache(CONFIG_PATH.'member.php');
            $user = $member->get($_COOKIE['secros_name']);
            if (!is_array($user) || !isset($user['password'])) {
                $this->logout();
            }
            if(md5($user['password'].get_client_ip()) == $_COOKIE['secros_token']){
                session_start();//re start
                $_SESSION['secros_login'] = true;
                $_SESSION['secros_user']= $user;
                setcookie('secros_name', $_COOKIE['secros_name'], time()+3600*24*365); 
                setcookie('secros_token',$_COOKIE['secros_token'],time()+3600*24*365); //密码的MD5值再次md5
                header('location:'.get_url());
                exit;
            }
            $this->logout();//session user数据不存在
        }else{
            if ($this->config['setting_system']['auto_login'] != '1') {
                $this->logout();//不自动登录
            }else{
                if (!file_exists(USER_SYSTEM.'install.lock')) {
                    $this->display('install.html');exit;
                }
                header('location:./index.php?user/loginSubmit&name=guest&password=guest');
            }
        }
    }

    //临时文件访问
    public function public_link(){
        load_class('mcrypt');
        $pass = $this->config['setting_system']['system_password'];
        $path = Mcrypt::decode($this->in['fid'],$pass);//一天内解密有效
        if (strlen($path) == 0) {
            show_json($this->L['error'],false);
        }
        if (!file_exists($path)) {
            show_tips($this->L['not_exists']);
        }
        file_put_out($path);
    }
    public function common_js(){
        $basic_path = BASIC_PATH;
        $av_status = 0;
        //if (!$GLOBALS['is_root']) {
            $basic_path = '/';//对非root用户隐藏所有地址
        //}
        $the_config = array(
            'lang'          => LANGUAGE_TYPE,
            'is_root'       => $GLOBALS['is_root'],
            'user_name'     => $this->user['name'],
            'web_root'      => $GLOBALS['web_root'],
            'web_host'      => HOST,
            'static_path'   => STATIC_PATH,
            'basic_path'    => $basic_path,
            'app_host'      => APPHOST,
            'myhome'        => MYHOME,
            'upload_max'    => $this->config['settings']['upload_chunk_size'],
            'version'       => SECROS_VERSION,
            'version_desc'  => $this->config['settings']['version_desc'],

            'json_data'     => "",
            'theme'         => $this->config['user']['theme'], //列表排序依照的字段
            'list_type'     => $this->config['user']['list_type'], //列表排序依照的字段
            'sort_field'    => $this->config['user']['list_sort_field'], //列表排序依照的字段  
            'sort_order'    => $this->config['user']['list_sort_order'], //列表排序升序or降序
            'musictheme'    => $this->config['user']['musictheme'],
            'movietheme'    => $this->config['user']['movietheme'],
            'av_status'			=> $av_status
        );
				if (!file_exists('/mnt/config/antivirus.conf')){
					$GLOBALS['av_status'] = 0;
        	$the_config['av_status'] = 0;
        }else{
        	$av_status = config_get_value_from_file('/dev/secros','av_status');
        	$the_config['av_status'] = $av_status;
        	if ($av_status == 2){
        		$the_config['av_expired'] = 1;
						$GLOBALS['av_expired'] = 1;
        	}
        }
        if (!isset($GLOBALS['auth'])) {
            $GLOBALS['auth'] = array();
        }
        $js  = 'LNG='.json_encode($GLOBALS['L']).';';
        $js .= 'AUTH='.json_encode($GLOBALS['auth']).';';
        $js .= 'G='.json_encode($the_config).';';
        header("Content-Type:application/javascript");
        echo $js;
    }

    /**
     * 登录view
     */
    public function login($msg = ''){
        if (!file_exists(USER_SYSTEM.'install.lock')) {
            $this->display('install.html');exit;
        }
        $this->assign('msg',$msg);
        if (is_wap()) {
            $this->display('login_wap.html');
        }else{
            $this->display('login.html');
        } 
        exit;
    }

    /**
     * 首次登录
     */
    public function loginFirst(){
        touch(USER_SYSTEM.'install.lock');
        header('location:./index.php?user/login');
        exit;
    }
    /**
     * 退出处理
     */
    public function logout(){
        write_audit('信息','退出','成功','用户退出');
        session_start();
        user_logout();
    }
    
    /**
     * 登录数据提交处理
     */
    public function loginSubmit(){
        if(!isset($this->in['name']) || !isset($this->in['password'])) {
            $msg = $this->L['login_not_null'];
        }else{
            //错误三次输入验证码            
            $name = rawurldecode($this->in['name']);
            $password = rawurldecode($this->in['password']);
            
            session_start();//re start 有新的修改后调用
            /*if(isset($_SESSION['code_error_time'])  && 
               intval($_SESSION['code_error_time']) >=3 && 
               $_SESSION['check_code'] !== strtolower($this->in['check_code'])){
                // pr($_SESSION['check_code'].'--'.strtolower($this->in['check_code']));exit;
                $this->login($this->L['code_error']);
            }*/
            $member = new fileCache(CONFIG_PATH.'member.php');
            $user = $member->get($name);
            if ($user ===false){
                $msg = $this->L['user_not_exists'];
            }else if(md5($password)==$user['password']){
                if($user['status'] == 0){//初始化app
                    $app = init_controller('app');
                    $app->init_app($user);
                }
                $_SESSION['secros_login'] = true;
                $_SESSION['secros_user']= $user;
                setcookie('secros_name', $user['name'], time()+3600*24*365);
                if ($this->in['rember_password'] == '1') {
                    setcookie('secros_token',md5($user['password'].get_client_ip()),time()+3600*24*365);
                }
                write_audit('信息','登录','成功','ip:'.get_client_ip());
                header('location:./index.php');
                return;
            }else{
                write_audit('信息','登录','失败','ip:'.get_client_ip());
                $msg = $this->L['password_error'];
            }
            $_SESSION['code_error_time'] = intval($_SESSION['code_error_time']) + 1;
        }
        $this->login($msg);
    }

    /**
     * 修改密码
     */
    public function changePassword(){
        $password_now=$this->in['password_now'];
        $password_new=$this->in['password_new'];
        if (!$password_now && !$password_new)show_json($this->L['password_not_null'],false);
        if ($this->user['password']==md5($password_now)){
            $member_file = CONFIG_PATH.'member.php';
            $sql=new fileCache(CONFIG_PATH.'member.php');
            $this->user['password'] = md5($password_new);
            $sql->update($this->user['name'],$this->user);
            system('/usr/sbin/setusboxftpd');
            system('smbpasswd -a ' . $this->user['name'] . ' -P ' . $password_new . '>>/dev/null &');
            system('/usr/sbin/setusboxsmbd');
            setcookie('secros_token',md5(md5($password_new)),time()+3600*24*365);
            show_json('success');
        }else {
            show_json($this->L['old_password_error'],false);
        }
    }

    /**
     * 权限验证；统一入口检验
     */
    public function authCheck(){
        if (isset($GLOBALS['is_root']) && $GLOBALS['is_root'] == 1) return;
        if (in_array(ACT,$this->notCheck)) return;
        if (!array_key_exists(ST,$this->config['role_setting']) ) return;
        if (!in_array(ACT,$this->config['role_setting'][ST]) &&
            ST.':'.ACT != 'user:common_js') return;//输出处理过的权限

        //有权限限制的函数
        $key = ST.':'.ACT;
        $group  = new fileCache(CONFIG_PATH.'group.php');
        $auth= $group->get($this->user['role']);
        
        //向下版本兼容处理
        //未定义；新版本首次使用默认开放的功能
        if(!isset($auth['userShare:set'])){
            $auth['userShare:set'] = 1;
        }
        if(!isset($auth['explorer:fileDownload'])){
            $auth['explorer:fileDownload'] = 1;
        }
        //默认扩展功能 等价权限
        $auth['user:common_js'] = 1;//权限数据配置后输出到前端
        $auth['explorer:pathChmod']         = $auth['explorer:pathRname'];
        $auth['explorer:pathDeleteRecycle'] = $auth['explorer:pathDelete'];
        $auth['explorer:pathCopyDrag']      = $auth['explorer:pathCuteDrag'];
        
        $auth['explorer:fileDownloadRemove']= $auth['explorer:fileDownload'];
        $auth['explorer:zipDownload']       = $auth['explorer:fileDownload'];
        $auth['explorer:fileProxy']         = $auth['explorer:fileDownload'];
        $auth['editor:fileGet']             = $auth['explorer:fileDownload'];
        $auth['explorer:officeView']        = $auth['explorer:fileDownload'];
        $auth['explorer:officeSave']        = $auth['editor:fileSave'];
        $auth['userShare:del']              = $auth['userShare:set'];
        if ($auth[$key] != 1) show_json($this->L['no_permission'],false);

        $GLOBALS['auth'] = $auth;//全局
        //扩展名限制：新建文件&上传文件&重命名文件&保存文件&zip解压文件
        $check_arr = array(
            'mkfile'    =>  $this->check_key('path'),
            'pathRname' =>  $this->check_key('rname_to'),
            'fileUpload'=>  isset($_FILES['file']['name'])?$_FILES['file']['name']:'',
            'fileSave'  =>  $this->check_key('path')
        );
        if (array_key_exists(ACT,$check_arr) && !checkExt($check_arr[ACT])){
            show_json($this->L['no_permission_ext'],false);
        }
    }
    private function check_key($key){
        return isset($this->in[$key])? rawurldecode($this->in[$key]):'';
    }

    public function checkCode() {
        session_start();//re start
        $code = rand_string(4);
        $_SESSION['check_code'] = strtolower($code);
        check_code($code);
    }

    public function downloadfile(){
        // show_json(ini_get('upload_max_filesize').'///'.ini_get('post_max_size'));
        if ($_FILES["upgradefile"]["error"] > 0) {
            show_json('400',false);
        }else{
            $filename = '/tmp/'.$_POST['filename'];//确定上传的文件名 
//第一次上传时没有文件，就创建文件，此后上传只需要把数据追加到此文件中 
if(!file_exists($filename) || $_POST['first']==true){ 
 move_uploaded_file($_FILES['upgradefile']['tmp_name'],$filename); 
}else{ 
 file_put_contents($filename,file_get_contents($_FILES['upgradefile']['tmp_name']),FILE_APPEND); 
} 

if($_POST['end']==true){
    show_json('200');
} 
show_json('201');
            // test end
            // $target_path  = "/mnt/abc/";
            // if(move_uploaded_file($_FILES["upgradefile"]["tmp_name"], $target_path.$_FILES['upgradefile']['name'])) {
            // show_json('ok');
            // }else{    
            // show_json($_FILES["upgradefile"]["error"],false);
            // }
        }
     
    }

    public function startck(){
        $a = "/tmp/".$this->in['filename'];
        system("/bin/upgrade_kernel ".$a.' >>/dev/null &');
    }
    // public function getmd5(){
    //     show_json(md5_file('/tmp/Android-SDK@1.9.9.64803_20190614.zip'));
    // }
}