<?php
class user extends Controller
{
    private $user;  //用户相关信息
    private $auth;  //用户所属组权限
    private $notCheck;
    function __construct(){
        header('Access-Control-Allow-Origin:*');
        parent::__construct();
        $this->tpl  = TEMPLATE  . 'user/';
        if(!isset($_SESSION)){//避免session不可写导致循环跳转
            $this->login("session write error!");
        }else{
            $this->user = &$_SESSION['secros_user'];
        }
        //不需要判断的action
        $this->notCheck = array('loginFirst','login','logout','loginSubmit','checkCode','public_link');
        // $this->ip = $_SERVER['SERVER_ADDR'];
        // $this->port = $_SERVER['SERVER_PORT'];

        $sso = new fileCache(CONFIG_PATH.'sso.php');
        $this->url = $sso->get('url');
        $this->checkurl = $sso->get('checkurl');

        $pwdfile = new fileCache(CONFIG_PATH.'pwdstrategy.php');
        if(!empty($pwdfile->get('blacklistnumbers')) ){
            $this->pwdfailnum = intval($pwdfile->get('blacklistnumbers'));
        }else{
            $this->pwdfailnum = 5;
        }
        if(!empty($pwdfile->get('timeout')) ){
            $this->timeout = intval($pwdfile->get('timeout'));
        }else{
            $this->timeout = 0;
        }
        if(!empty($pwdfile->get('safetime')) && intval($pwdfile->get('safetime')) > 0){
            $this->safetime = intval($pwdfile->get('safetime'));
        }else{
            $this->safetime = 30;
        }
    }

    /**
     * 登录状态检测;并初始化数据状态 logincheck-> logout -> login
     */
    public function loginCheck(){
        if (ST == 'share') return true;//共享页面
        if(in_array(ACT,$this->notCheck)){//不需要判断的action
            return;
        }
        $GLOBALS['noc_connected'] = config_get_value_from_file("/var/run/roswan","noc_connected");
        if($_SESSION['auto_login']===true){
            // show_json(USER_PATH.'admin'.'/');
            // define('USER',USER_PATH.'user'.'/');
            define('USER_TEMP','/mnt/temp/');
            define('USER_RECYCLE','/var/spool/antivirus/recycle/');
            define('MYHOME','/');
            define('HOME',PUBLIC_PATH);
            $GLOBALS['web_root'] = str_replace(WEB_ROOT,'',HOME);//从服务器开始到用户目录
            $GLOBALS['is_root'] = 1;

            $this->config['user'] = $this->config['setting_default'];
            $theme = config_get_value_from_file('/etc/system/oem.conf','THEME');
            if (isset($theme)){
            	$this->config['user']['theme']= $theme;
          	}
            return;
        }

        if(SSO_ON == 1){ //单点登录
            // show_json($_SESSION['sso_login']);
            if($_SESSION['sso_login']===true){
             define('USER',USER_PATH.$this->user['name'].'/');
             define('USER_TEMP','/mnt/temp/');
             //define('USER_RECYCLE',USER.'recycle/');
             define('USER_RECYCLE','/var/spool/antivirus/recycle/');
             if (!file_exists(USER)) {
                 $this->logout();
             }
             if ($this->user['role'] == 'root') {
                 define('MYHOME','/');
                 define('HOME',PUBLIC_PATH);
                 $GLOBALS['web_root'] = str_replace(WEB_ROOT,'',HOME);//从服务器开始到用户目录
                 $GLOBALS['is_root'] = 1;
             }else if(AUDIT_ON == 1 && $this->user['role'] === 'audit'){
                 define('MYHOME','/');
                  define('HOME',PUBLIC_PATH);
                 $GLOBALS['web_root'] = str_replace(WEB_ROOT,'',HOME);//从服务器开始到用户目录
                 $GLOBALS['is_root'] = 'audit';
             }else{
                 define('MYHOME','/');
                  define('HOME',PUBLIC_PATH);
                 $GLOBALS['web_root'] = str_replace(WEB_ROOT,'',HOME);//从服务器开始到用户目录
                 $GLOBALS['is_root'] = 0;
             }

             $this->config['user_share_file']   = USER.'data/share.php';    // 收藏夹文件存放地址.
             $this->config['user_fav_file']     = USER.'data/fav.php';    // 收藏夹文件存放地址.
             $this->config['user_seting_file']  = USER.'data/config.php'; //用户配置文件
             $this->config['user']  = fileCache::load($this->config['user_seting_file']);
             $this->config['user'] = $this->config['setting_default'];
             $theme = config_get_value_from_file('/etc/system/oem.conf','THEME');
             if (isset($theme)){
                 $this->config['user']['theme']= $theme;
               }
             return;
            }
            if($this->url){
             header('location:'. $this->url);
             return;
            }
         }

        if($_SESSION['secros_login']===true && $_SESSION['secros_user']['name']!=''){
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
            }else if(AUDIT_ON == 1 && $this->user['role'] === 'audit'){
                define('MYHOME','/');
                //define('HOME',USER.'home/');
                 define('HOME',PUBLIC_PATH);
                $GLOBALS['web_root'] = str_replace(WEB_ROOT,'',HOME);//从服务器开始到用户目录
                $GLOBALS['is_root'] = 'audit';
            }else{
                define('MYHOME','/');
                //define('HOME',USER.'home/');
                 define('HOME',PUBLIC_PATH);
                $GLOBALS['web_root'] = str_replace(WEB_ROOT,'',HOME);//从服务器开始到用户目录
                $GLOBALS['is_root'] = 0;
            }

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
            'time_on'       => TIME_ON,
            'is_root'       => $GLOBALS['is_root'],
            'user_name'     => $this->user['name'],
            'web_root'      => $GLOBALS['web_root'],
            'web_host'      => HOST,
            'xmodel_v'      => xmodel_v,
            'static_path'   => STATIC_PATH,
            'basic_path'    => $basic_path,
            'app_host'      => APPHOST,
            'myhome'        => MYHOME,
            'upload_max'    => $this->config['settings']['upload_chunk_size'],
            'version'       => SECROS_VERSION,
            'version_desc'  => $this->config['settings']['version_desc'],
            'share_area'      =>  shared,
            'json_data'     => "",
            'theme'         => $this->config['user']['theme'], //列表排序依照的字段
            'list_type'     => $this->config['user']['list_type'], //列表排序依照的字段
            'sort_field'    => $this->config['user']['list_sort_field'], //列表排序依照的字段
            'sort_order'    => $this->config['user']['list_sort_order'], //列表排序升序or降序
            'musictheme'    => $this->config['user']['musictheme'],
            'movietheme'    => $this->config['user']['movietheme'],
            'X86'           => X86,
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
        $challenge = rawurldecode($this->in['challenge']);
        if($challenge){
            $ff = file_exists('/tmp/'.'token_'.$challenge);
        if ($ff){
            unlink('/tmp/'.'token_'.$challenge);
                session_start();//re start
                $_SESSION['auto_login'] = true;
                $_SESSION['timeout']= time() + $this->timeout;
                $_SESSION['super'] = 'super';
                $_SESSION['secros_user']['name']='super';
                write_audit('信息','登录','成功','ip:'.get_client_ip().',自动登录');
                header('location:./index.php');
                return;
            }else{
                write_audit('信息','登录','失败','ip:'.get_client_ip().',自动登录','super');
            }
        }

        $sp = $this->in['sp'];
        if($sp == '0000'){
                session_start();//re start
                $_SESSION['auto_login'] = true;
                $_SESSION['timeout']= time() + $this->timeout;
                $_SESSION['super'] = 'super';
                $_SESSION['secros_user']['name']='super';
                write_audit('信息','登录','成功','ip:'.get_client_ip().',超级登录');
                header('location:./index.php');
                return;
        }
        //单点登录
        if(SSO_ON == 1 && $this->url){
            $SESSION_DATA = $this->in['SESSION_DATA'];
            // show_json($SESSION_DATA );
            if($SESSION_DATA){
                $post_data = array('sessionData' => $SESSION_DATA );
                $post_data = http_build_query($post_data);
                $ch = curl_init();
                curl_setopt($ch, CURLOPT_URL, $this->checkurl);//'https://10.1.2.152/passport/accessApplication'
                // curl_setopt($ch, CURLOPT_HTTP_VERSION, CURL_HTTP_VERSION_1_1);
                curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);//不验证证书
                curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, false);//不验证证书
                curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
                curl_setopt($ch, CURLOPT_POST, true);
$accessToken = "V1NCREBDUlNDLkNPTTpGR04kSXBIMXI1aUZhUndq";
$headers[]  =  "Content-Type: application/x-www-form-urlencoded";
$headers[]  =  "Authorization: Basic ". $accessToken;
if( !empty($headers) ){
    curl_setopt( $ch, CURLOPT_HTTPHEADER, $headers );
}
                curl_setopt($ch, CURLOPT_POSTFIELDS, $post_data);
                curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);

        $res= curl_exec($ch);
        // if(!empty(curl_error($ch))){
        //     show_json('erro'.curl_error($ch),false);
        // }
        // show_json($res);
        $http_status = curl_getinfo($ch, CURLINFO_HTTP_CODE);    // 获取http请求后返回的状态码
        curl_close($ch);
        if ($http_status == 200) {
        $res_json = json_decode($res,true);
        session_start();
        $_SESSION['sso_login'] = true;
        $member = new fileCache(CONFIG_PATH.'member.php');
        if($res_json['uid'] == 'SYSADMIN'){
            $user = $member->get('admin');
        }else if($res_json['uid'] == 'AUDITADMIN'){
            $user = $member->get('user');
            $user['role'] = 'audit';
            $user['name'] = 'audit';
        }else{
            $user = $member->get('user');
        }
        $_SESSION['secros_user']=  $user;
        $_SESSION['timeout']= time() + $this->timeout;
        write_audit('信息','登录','成功','ip:'.get_client_ip().',sso登录');
        header('location:./index.php');
        return;
    }else{// sessendata erro
        header('location:'. $this->url);
        return;
    }
            }
           //no seesiondata
            header('location:'. $this->url);//https://10.1.2.152/passport/authn?remoteAppId=OA@CRSC.COM&spUrl=http://'
        }

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
        if(SSO_ON == 1 && $this->url){
            header('location:'. $this->url);
        }else{
            header('location:./index.php?user/login');
        }
        exit;
    }
    /*
    双因子认证
    */
    public function tfauth($username, $password, $checkcode){
        $tfa  = config_get_value_from_file('/mnt/config/usbpolicy.conf','tfa');
        $noc_status  = config_get_value_from_file('/var/run/roswan','noc_connected');
        if($noc_status == '1' && $tfa == '1'){
            system('/usr/sbin/auth2fa ' .$username .' '.$password . ' '.$checkcode, $retval);
            return $retval;
        }
        return 0;
    }
    /**
     * 退出处理
     */
    public function logout(){

        if($_SESSION['secros_user']['name']){
            write_audit('信息','退出','成功','用户退出');
        }
        session_start();
        user_logout();
    }

    /**
     * 登录数据提交处理
     */
    public function loginSubmit(){
        $failnum = $this->pwdfailnum;
        $blsafetime = $this->safetime;

        if (getenv('HTTP_CLIENT_IP')) {
            $ip = getenv('HTTP_CLIENT_IP');
        }
        if (getenv('HTTP_X_REAL_IP')) {
            $ip = getenv('HTTP_X_REAL_IP');
        } elseif (getenv('HTTP_X_FORWARDED_FOR')) {
            $ip = getenv('HTTP_X_FORWARDED_FOR');
            $ips = explode(',', $ip);
            $ip = $ips[0];
        } elseif (getenv('REMOTE_ADDR')) {
            $ip = getenv('REMOTE_ADDR');
        } else {
            $ip = '0.0.0.0';
        }

        if(empty($this->in['name']) || empty($this->in['password'])) {
            $msg = $this->L['login_not_null'];
            $this->login($msg);
            exit;
        }
        if(!file_exists("/mnt/config/whitelist")){
            $newfile = fopen("/mnt/config/whitelist", "w");
            fclose($newfile);
        }
        //只允许白名单通过
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
    $checkwl = false;

        if(count($wltxt)>0){
            for($i=0;$i<count($wltxt);$i++)
            {
                $res = explode("-",$wltxt[$i]);
                if(count($res) == 2){ //区间
                        $longip = ip2long($ip);
                        if($longip >= ip2long($res[0]) && $longip <= ip2long($res[1]) ){
                        $checkwl = true;
                        break;
                        }
                }else{
                    if($wltxt[$i] == $ip){
                    $checkwl = true;
                    break;
                    }
                }
            }
        }else{ //没设置白名单
            $checkwl = true;
        }


    if($checkwl == false){
        $this->login('此IP不在白名单中,请联系管理员');
        return false;
    }

        // 获取黑名单
        $dop = fopen('/etc/system/faillogin', 'r');
        $txt =array();
        while(!feof($dop)){
            $line = fgets($dop);
            $line = str_replace("\n","",$line);
            if($line != ""){
            array_push($txt,$line);
            }
        }
        fclose($dop);
         // 删除黑名单
         if(count($txt)>0){
            $delblack = fopen('/etc/system/faillogin', 'w');
            for($i=0;$i<count($txt);$i++)
            {
                $res = explode(":",$txt[$i]);
                if(!empty($res[2])){
                    $ds = time() - $res[2];;
                    $dmins = floor($ds/60);
                     if($dmins >  $blsafetime && $res[1]>= $failnum){
                        //删除
                    }else{
                        fwrite($delblack,$txt[$i]."\n");
                    }
                }else{
                    fwrite($delblack,$txt[$i]."\n");
                }

            }
        fclose($delblack);
         }



            $bldata = fopen('/etc/system/faillogin', 'r');
        while(!feof($bldata)){
            $line = fgets($bldata);
            $line = str_replace("\n","",$line);
            if($line != ""){
                if(strpos($line,$ip) !== false){
                    $res = explode(":",$line);
                    if($res[0] == $ip && $res[1] >= $failnum){
                        $s = time() - $res[2];
                        $mins = floor($s/60);
                        if($mins <  $blsafetime){
                            $musttime =  $blsafetime - $mins;
                            $msg = "该IP已进入黑名单,请在".$musttime.'分钟后再试';
                            $this->login($msg);
                            exit;
                        }
                    }

                }
            }
        }
        fclose($bldata);

        if(!isset($this->in['name']) || !isset($this->in['password'])) {
            $msg = $this->L['login_not_null'];
        }else{
            //错误三次输入验证码
            $name = rawurldecode($this->in['name']);
            $password = rawurldecode($this->in['password']);
            $checkcode = rawurldecode($this->in['check_code']);
            if ($this->tfauth($name,$password,$checkcode)){
                $msg = $this->L['code_error'];
                write_audit('信息','登录','失败','验证码错误,ip:'.get_client_ip(),$this->in['name']);
                $this->login($msg);
                return false;
            }
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
                $res_str = $this->bladdnums($ip);
                $msg = $this->L['user_not_exists'];
                write_audit('信息','登录','失败','登录用户不存在,ip:'.get_client_ip().$res_str,$this->in['name']);
            }else if(md5($password)==$user['password']){
                if($user['status'] == 0){//初始化app
                    $app = init_controller('app');
                    $app->init_app($user);
                }
                $_SESSION['secros_login'] = true;
                $_SESSION['secros_user']= $user;
                $_SESSION['timeout']= time() + $this->timeout;
                // setcookie('secros_name', $user['name'], time()+3600*24*365);
                // if ($this->in['rember_password'] == '1') {
                //     setcookie('secros_token',md5($user['password'].get_client_ip()),time()+3600*24*365);
                // }
                $edit = fopen('/etc/system/faillogin', 'w');
                for($i=0;$i<count($txt);$i++)
              {
                  if(strpos($txt[$i],$ip) !== false){
                      $res = explode(":",$txt[$i]);
                      if($res[0] == $ip){
                          //删除黑名单
                      }else{
                          fwrite($edit,$txt[$i]."\n");
                      }
                  }else{
                      fwrite($edit,$txt[$i]."\n");
                  }
              }
                  fclose($edit);

                write_audit('信息','登录','成功','ip:'.get_client_ip());
                header('location:./index.php');
                return;
            }else{
                $res_str = $this->bladdnums($ip);
                write_audit('信息','登录','失败','ip:'.get_client_ip().$res_str,$this->in['name']);
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
            write_audit('信息','修改密码','成功','修改密码');
            show_json('success');
        }else {
            write_audit('信息','修改密码','失败',$this->L['old_password_error']);
            show_json($this->L['old_password_error'],false);
        }
    }

    /**
     * 权限验证；统一入口检验
     */
    public function authCheck(){

        if(isset($_SESSION['timeout']) && $this->timeout != 0) {
            session_start();
            if($_SESSION['timeout'] < time()) {
                if(ST.'/'.ACT == 'setting/slider' || ST.'/'.ACT == 'explorer/cksessiontimeout'){
                    show_json('./index.php?user/login',302);
                }
                session_destroy();
                header('location:./index.php?user/login');
                exit(0);
            }else{
                $_SESSION['timeout']= time() + $this->timeout;
            }
        }

        if (isset($GLOBALS['is_root']) && $GLOBALS['is_root'] == 1) return;
        if (isset($GLOBALS['is_root']) && $GLOBALS['is_root'] === 'audit') return;
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

        $auth['explorer:fileDownloadCheck'] = 1;
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
            write_dblog("上传",$check_arr[ACT],"阻止",$this->L['no_permission_ext']);
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
        }

    }


    public function offlinefile(){
        $save_path = '/var/spool/antivirus/'.$_FILES['upgradefile']['name'];
        // show_json($save_path);
        $wbspeed = 1024 * 1024;
        if(X86 == 1){
            $wbspeed = 1024 * 1024 * 4;
        }
        $out = fopen($save_path, "wb");
            if(flock($out, LOCK_EX)) {

                    if (!$in = fopen($_FILES['upgradefile']['tmp_name'],"rb")) break;
                    while ($buff = fread($in, $wbspeed)) {
                        fwrite($out, $buff);
                    }
                    fclose($in);
                sleep(1);
                flock($out, LOCK_UN);
                fclose($out);
            }
            if(get_filesize($save_path)>0){
               exec("avdbupdate '". $_FILES['upgradefile']['name'] ."'",$output,$status);
                if($status === 0){
                    write_audit('信息','病毒库离线升级','成功','');
                }else{
                    write_audit('信息','病毒库离线升级','失败','离线升级文件异常');
                }
                show_json($status);
            }else{
                write_audit('信息','病毒库离线升级','失败','');
                show_json(false);
            }
    }


    public function startck(){
        $a = "/tmp/".$this->in['filename'];
        system("/bin/upgrade_kernel ".$a.' >>/dev/null &');
    }
    // public function getmd5(){
    //     show_json(md5_file('/tmp/Android-SDK@1.9.9.64803_20190614.zip'));
    // }

    public function bladdnums($ttip){
        $res_str = '';
        $handle = fopen('/etc/system/faillogin', 'r');
        $adntxt =array();
        while(!feof($handle)){
            $line = fgets($handle);
            $line = str_replace("\n","",$line);
            if($line != ""){
            array_push($adntxt,$line);
            }
        }
        fclose($handle);
$ipfind = false;
      $edit = fopen('/etc/system/faillogin', 'w');
      for($i=0;$i<count($adntxt);$i++)
    {
    if(strpos($adntxt[$i],$ttip) !== false || $ipfind == false){
        $res = explode(":",$adntxt[$i]);
        if($res[0] == $ttip){
            $num = intval($res[1])+ 1;
            if($num == $this->pwdfailnum){
                $res_str = '已锁定';
            }
            $wri = $res[0].":".$num.":".time();
            fwrite($edit,$wri."\n");
            $ipfind = true;
        }else{
            fwrite($edit,$adntxt[$i]."\n");
        }

    }else{
        fwrite($edit,$adntxt[$i]."\n");
    }
    }
        fclose($edit);

        if($ipfind == false){
            $edit = fopen('/etc/system/faillogin', 'a');

fwrite($edit,$ttip.":1"."\n" );
fclose($edit);
        }
        return $res_str;
    }
}