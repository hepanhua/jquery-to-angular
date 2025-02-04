<?php


//处理成标准目录
function _DIR_CLEAR($path){
    $path = htmlspecial_decode($path);
    $path = str_replace('\\','/',trim($path));
    if (strstr($path,'../')) {//preg耗性能
        $path = preg_replace('/\.+\/+/', '/', $path);
    }
    $path = preg_replace('/\/+/', '/', $path);
    return $path;
}

//处理成用户目录，并且不允许相对目录的请求操作
function _DIR($path){
    $path = _DIR_CLEAR(rawurldecode($path));
    $path = iconv_system($path);
    if (substr($path,0,strlen('*recycle*/')) == '*recycle*/') {
        return USER_RECYCLE.str_replace('*recycle*/','',$path);
    }
    if (substr($path,0,strlen('*usbox*/')) == '*usbox*/') {
        return PUBLIC_PATH.str_replace('*usbox*/','',$path);
    }
    if (substr($path,0,strlen('*shared*/')) == '*shared*/') {
        return SHARE_PATH.str_replace('*shared*/','',$path);
    }
    if (substr($path,0,strlen('*share*/')) == '*share*/') {
        return "*share*/";
    }
    $path = HOME.$path;
    if (is_dir($path)) $path = rtrim($path,'/').'/';
    return $path;
}

//处理成用户目录输出
function _DIR_OUT(&$arr){
    xxsClear($arr);
    //if (isset($GLOBALS['is_root'])&&$GLOBALS['is_root']) return;
    if (is_array($arr)) {
        foreach ($arr['filelist'] as $key => $value) {
            $arr['filelist'][$key]['path'] = pre_clear($value['path']);
        }
        foreach ($arr['folderlist'] as $key => $value) {
            $arr['folderlist'][$key]['path'] = pre_clear($value['path']);
        }
    }else{
        $arr = pre_clear($arr);
    }
}
//前缀处理 非root用户目录/从HOME开始
function pre_clear($path){
    if (ST=='share') {
        return str_replace(HOME,'',$path);
    }
    if (substr($path,0,strlen(PUBLIC_PATH)) == PUBLIC_PATH) {
        return '*usbox*/'.str_replace(PUBLIC_PATH,'',$path);
    }
    if (substr($path,0,strlen(USER_RECYCLE)) == USER_RECYCLE) {
        return '*recycle*/'.str_replace(USER_RECYCLE,'',$path);
    }
    return str_replace(HOME,'',$path);
}
function xxsClear(&$list){
    if (is_array($list)) {
        foreach ($list['filelist'] as $key => $value) {
            $list['filelist'][$key]['ext'] = htmlspecial($value['ext']);
            $list['filelist'][$key]['path'] = htmlspecial($value['path']);
            $list['filelist'][$key]['name'] = htmlspecial($value['name']);
        }
        foreach ($list['folderlist'] as $key => $value) {
            $list['folderlist'][$key]['path'] = htmlspecial($value['path']);
            $list['folderlist'][$key]['name'] = htmlspecial($value['name']);
        }
    }else{
        $list = htmlspecial($list);
    }
}
function htmlspecial($str){
    return str_replace(
        array('<','>','"',"'"),
        array('&lt;','&gt;','&quot;','&#039;','&amp;'),
        $str
    );
}
function htmlspecial_decode($str){
    return str_replace(        
        array('&lt;','&gt;','&quot;','&#039;'),
        array('<','>','"',"'"),
        $str
    );
}

//扩展名权限判断
function checkExtUnzip($s,$info){
    return checkExt($info['stored_filename']);
}
//扩展名权限判断 有权限则返回1 不是true
function checkExt($file,$changExt=false){
    if (strstr($file,'<') || strstr($file,'>') || $file=='') {
        return 0;
    }
    //if ($GLOBALS['is_root'] == 1) return 1;
    //$not_allow = $GLOBALS['auth']['ext_not_allow'];
    //$ext_arr = explode('|',$not_allow);
    $ext_arr = $GLOBALS['config']['whitelist'];
    foreach ($ext_arr as $current) {
        if ($current !== '' && stristr($file,'.'.$current)){//含有扩展名
            return 1;
        }
    }
    return 0;
}


function get_charset(&$str) {
    if ($str == '') return 'utf-8';
    //前面检测成功则，自动忽略后面
    $charset=strtolower(mb_detect_encoding($str,$GLOBALS['config']['check_charset']));
    if (substr($str,0,3)==chr(0xEF).chr(0xBB).chr(0xBF)){
        $charset='utf-8';
    }else if($charset=='cp936'){
        $charset='gbk';
    }
    if ($charset == 'ascii') $charset = 'utf-8';
    return strtolower($charset);
}

function php_env_check(){
    $L = $GLOBALS['L'];
    $error = '';
    $base_path = get_path_this(BASIC_PATH).'/'; 
    if(!function_exists('iconv')) $error.= '<li>'.$L['php_env_error_iconv'].'</li>';
    if(!function_exists('mb_convert_encoding')) $error.= '<li>'.$L['php_env_error_mb_string'].'</li>';
    if(!version_compare(PHP_VERSION,'5.0','>=')) $error.= '<li>'.$L['php_env_error_version'].'</li>';
    if(!function_exists('file_get_contents')) $error.='<li>'.$L['php_env_error_file'].'</li>';
    if(!path_writable(BASIC_PATH)) $error.= '<li>'.$base_path.'	'.$L['php_env_error_path'].'</li>';
    if(!path_writable(BASIC_PATH.'data')) $error.= '<li>'.$base_path.'data	'.$L['php_env_error_path'].'</li>';
    if(!path_writable(BASIC_PATH.'data/system')) $error.= '<li>'.$base_path.'data/system	'.$L['php_env_error_path'].'</li>';
    if(!path_writable(BASIC_PATH.'data/User')) $error.= '<li>'.$base_path.'data/User	'.$L['php_env_error_path'].'</li>';
    if(!path_writable(BASIC_PATH.'data/thumb')) $error.= '<li>'.$base_path.'data/thumb	'.$L['php_env_error_path'].'</li>';
    if( !function_exists('imagecreatefromjpeg')||
        !function_exists('imagecreatefromgif')||
        !function_exists('imagecreatefrompng')||	
        !function_exists('imagecolorallocate')){
        $error.= '<li>'.$L['php_env_error_gd'].'</li>';
    }
    return $error;
}

//语言包加载：优先级：cookie获取>自动识别
//首次没有cookie则自动识别——存入cookie,过期时间无限
function init_lang(){
    if (isset($_COOKIE['secros_user_language'])) {
        $lang = $_COOKIE['secros_user_language'];
    }else{//没有cookie
        preg_match('/^([a-z\-]+)/i', $_SERVER['HTTP_ACCEPT_LANGUAGE'], $matches);
        $lang = $matches[1];
        switch (substr($lang,0,2)) {
            case 'zh':
                if ($lang != 'zn-TW'){
                    $lang = 'zh-CN';
                }
                break;
            case 'en':$lang = 'en';break;
            default:$lang = 'zh-CN';break;
        }
        $lang = str_replace('-', '_',$lang);
        setcookie('secros_user_language',$lang, time()+3600*24*365);
    }
    if ($lang == '') $lang = 'zh-CN';
    
    $lang = str_replace(array('/','\\','..','.'),'',$lang);
    define('LANGUAGE_TYPE', $lang);
    include(LANGUAGE_PATH.$lang.'/main.php');
    $GLOBALS['L'] = $L;
}

function init_setting(){
    $setting_file = CONFIG_PATH.'system_setting.php';
    if (!file_exists($setting_file)){//不存在则建立
        $setting = $GLOBALS['config']['setting_system_default'];
        $setting['menu'] = $GLOBALS['config']['setting_menu_default'];
        fileCache::save($setting_file,$setting);
    }else{
        $setting = fileCache::load($setting_file);   
    }
    if (!is_array($setting)) {
        $setting = $GLOBALS['config']['setting_system_default'];
    }
    if (!is_array($setting['menu'])) {
        $setting['menu'] = $GLOBALS['config']['setting_menu_default'];
    }
    $net_file = CONFIG_PATH.'net.conf';
		if (file_exists($net_file)) {
			$setting['net'] = config_read($net_file);
		}
		$sys_file = '/etc/system/sys.conf';
		if (file_exists($sys_file)) {
			$setting['system_info'] = config_read($sys_file);
			$setting['system_info']['SERIALNO'] = config_get_value_from_file("/dev/serialno","SERIALNO");
			$setting['system_info']['UPTIME'] = get_uptime();
		}
		$filetype_file = CONFIG_PATH.'filetype.php';
    if (file_exists($filetype_file)){//存在
        $filetype = fileCache::load($filetype_file);
        if ($filetype){
        	foreach ($filetype as $k => $v) {
        		if ($k == 'ext_allow') {
        			$whitelist = explode(',',$v);
        		}
        		elseif ($k == 'file_deepcheck'){
        			$setting['system_info']['deepcheck'] = $v;
        		}
        		else {
        			if ($v == 1) {
        				$whitelist[] = substr(strrchr($k, ":"), 1);
        			}
        		}
        	}
        }   
    }
    if (isset($setting['first_in'])){
    	$GLOBALS['app']->setDefaultController($setting['first_in']);//设置默认控制器
    }
    else{
    	$GLOBALS['app']->setDefaultController('explorer');//设置默认控制器
   	}
    $GLOBALS['app']->setDefaultAction('index');    //设置默认控制器函数

    $GLOBALS['config']['setting_system'] = $setting;//全局
    $GLOBALS['config']['net'] = $setting['net'];//全局
    $GLOBALS['config']['whitelist'] = $whitelist;//全局
    $GLOBALS['config']['system_info'] = $setting['system_info'];//全局
    $GLOBALS['L']['secros_name'] = $setting['system_name'];
    $GLOBALS['L']['secros_name_desc'] = $setting['system_desc'];
    $sysname = config_get_value_from_file('/etc/system/oem.conf','SYSNAME');
    if (isset($sysname)){
    	$GLOBALS['L']['secros_name_desc']= $sysname;
  	}
    if (isset($setting['powerby'])) {
        $GLOBALS['L']['secros_power_by'] = $setting['powerby'];
    }

    //加载用户自定义配置
    $setting_user = BASIC_PATH.'config/setting_user.php';
    if (file_exists($setting_user)) {
        include($setting_user);
    }
}

//防止恶意请求
function check_post_many(){
    $check_time = 4;
    $maxt_num   = 40;//5秒内最大请求次数。超过则自动退出
    $total_time = 60;//10nmin
    $total_time_num = 500;
    
    //管理员不受限制
    if( isset($_SESSION['secros_user']) && 
        $_SESSION['secros_user']['role']=='root'){
        return;
    }
    //上传不受限制
    $URI = $GLOBALS['in']['URLremote'];
    if (isset($URI[1]) && $URI[1] =='fileUpload') {
        return;
    }
    $session_key = 'check_post_many';
    $_SESSION['check_session_has'] = 'secrosexplorer';
    if (!isset($_SESSION[$session_key])) {
        $_SESSION[$session_key] = array('last_time'=>time(),'total_num'=>0,'max_time'=>time(),'max_num'=>0);
    }else{
        $info = $_SESSION[$session_key]; 
        //----短期内并发控制       
        if (time()-$info['last_time'] >=$check_time) {//大于时长s 则清空
            $info = array('last_time'=>time(),'total_num'=>0,'max_time'=>time(),'max_num'=>0);
        }else{
            if ($info['total_num'] >=$maxt_num) {//大于100次则直接退出
                user_logout();
            }else{
                $info['total_num'] +=1;
            }
        }
        //----总量控制
        if (time()-$info['max_time'] >=$total_time) {//大于时长s 则清空
            $info = array('last_time'=>time(),'total_num'=>0,'max_time'=>time(),'max_num'=>0);
        }else{
            if ($info['total_num'] >=$total_time_num) {//大于100次则直接退出
                user_logout();
            }else{
                $info['max_num'] +=1;
            }
        }
        $_SESSION[$session_key] = $info;
    }
}
function is_wap(){    
    if(preg_match('/(up.browser|up.link|mmp|symbian|smartphone|midp|wap|phone|iphone|ipad|ipod|android|xoom)/i', 
        strtolower($_SERVER['HTTP_USER_AGENT']))){
        return true;
    }    
    if((isset($_SERVER['HTTP_ACCEPT'])) && 
        (strpos(strtolower($_SERVER['HTTP_ACCEPT']),'application/vnd.wap.xhtml+xml') !== false)){
        return true;
    }
    return false;
}
function user_logout(){
    setcookie('PHPSESSID', '', time()-3600,'/'); 
    setcookie('secros_name', '', time()-3600); 
    setcookie('secros_token', '', time()-3600);
    setcookie('secros_user_language', '', time()-3600);
    session_destroy();
    $sso = new fileCache(CONFIG_PATH.'sso.php');
    $outurl = $sso->get('outurl');
    if(SSO_ON == 1 && $outurl){
        $ip = $_SERVER['SERVER_ADDR'];
        $port = $_SERVER['SERVER_PORT'];
        // $spurl = strtolower(explode('/',$_SERVER['SERVER_PROTOCOL'])[0]).'://'. $ip.':'.$port.'/index.php?user/login';
        header('location:'. $outurl);// https://10.1.2.152/passport/logout?spUrl=http://ehr.citicsinfo.com/hr/&remoteAppId=HR@CRSC.COM
    }else{
        header('location:./index.php?user/login');
    }
    exit;
}


