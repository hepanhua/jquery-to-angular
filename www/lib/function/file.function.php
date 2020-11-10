<?php


/**
 * 系统函数：				filesize(),file_exists(),pathinfo(),rname(),unlink(),filemtime(),is_readable(),is_wrieteable();
 * 获取文件详细信息		file_info($file_name)
 * 获取文件夹详细信息		path_info($dir)
 * 递归获取文件夹信息		path_info_more($dir,&$file_num=0,&$path_num=0,&$size=0)
 * 获取文件夹下文件列表	path_list($dir)
 * 路径当前文件[夹]名		get_path_this($path)
 * 获取路径父目录			get_path_father($path)
 * 删除文件				del_file($file)
 * 递归删除文件夹			del_dir($dir)
 * 递归复制文件夹			copy_dir($source, $dest)
 * 创建目录				mk_dir($dir, $mode = 0777)
 * 文件大小格式化			size_format($bytes, $precision = 2)
 * 判断是否绝对路径		path_is_absolute( $path ) 
 * 扩展名的文件类型		ext_type($ext)
 * 文件下载				file_download($file) 
 * 文件下载到服务器		file_download_this($from, $file_name)
 * 获取文件(夹)权限		get_mode($file)  //rwx_rwx_rwx [文件名需要系统编码]
 * 上传文件(单个，多个)	upload($fileInput, $path = './');//
 * 获取配置文件项			get_config($file, $ini, $type="string")
 * 修改配置文件项			update_config($file, $ini, $value,$type="string")
 * 写日志到LOG_PATH下		write_log('dd','default|.自建目录.','log|error|warning|debug|info|db')
 */

// 传入参数为程序编码时，有传出，则用程序编码，
// 传入参数没有和输出无关时，则传入时处理成系统编码。
function iconv_app($str){
	if(X86 == 1){
global $config;
	$result = iconv($config['system_charset'], $config['app_charset'], $str);
	if (strlen($result)==0) {
		$result = $str;
	}
	return $result;
	}else{
		return $str;
	}

	
}
function iconv_system($str){
	if(X86 == 1){
global $config;
$result = iconv($config['app_charset'], $config['system_charset'], $str);
if (strlen($result)==0) {
	$result = $str;
}
return $result;
	}else{
		return $str;
	}
	
}

/*
function get_filesize($path){
	@$ret = abs(sprintf("%lu",filesize($path))); 
	return $ret;
}*/

//filesize 解决大于2G 大小问题
//http://stackoverflow.com/questions/5501451/php-x86-how-to-get-filesize-of-2-gb-file-without-external-program
function get_filesize($file){

	if (strtoupper(substr(PHP_OS, 0, 3)) == 'WIN') {
		if (class_exists("COM")) {
		  $fsobj = new COM('Scripting.FileSystemObject');
		  $f = $fsobj->GetFile(realpath($file));
		  $file = $f->Size;
		} else {
		  $file = trim(exec("for %F in (\"" . $file . "\") do @echo %~zF"));
		}
	  } elseif (PHP_OS == 'Darwin') {
		$file = trim(shell_exec("stat -f %z " ."'". $file."'"));
	  } elseif ((PHP_OS == 'Linux') || (PHP_OS == 'FreeBSD') || (PHP_OS == 'Unix') || (PHP_OS == 'SunOS')) {
	  //   $file = trim(shell_exec("stat -c%s " . escapeshellarg($file)));
		$file = trim(shell_exec("stat -c%s " ."'". $file."'"));
	  } else {
		$file = filesize($file);
	  }
	  return $file;

	  //old
	// $result = false;
	// $fp = @fopen($path,"r");
	// if(! $fp = @fopen($path,"r")) return $result;
	// if(PHP_INT_SIZE >= 8 ){ //64bit
	// 	$result = (float)(abs(sprintf("%u",@filesize($path))));
	// }else{
	// 	if (fseek($fp, 0, SEEK_END) === 0) {
	// 		$result = 0.0;
	// 		$step = 0x7FFFFFFF;
	// 		while ($step > 0) {
	// 			if (fseek($fp, - $step, SEEK_CUR) === 0) {
	// 				$result += floatval($step);
	// 			} else {
	// 				$step >>= 1;
	// 			}
	// 		}
	// 	}else{
	// 		static $iswin;
	// 		if (!isset($iswin)) {
	// 			$iswin = (strtoupper(substr(PHP_OS, 0, 3)) == 'WIN');
	// 		}
	// 		static $exec_works;
	// 		if (!isset($exec_works)) {
	// 			$exec_works = (function_exists('exec') && !ini_get('safe_mode') && @exec('echo EXEC') == 'EXEC');
	// 		}
	// 		if ($iswin && class_exists("COM")) {
	// 			try {
	// 				$fsobj = new COM('Scripting.FileSystemObject');
	// 				$f = $fsobj->GetFile( realpath($path) );
	// 				$size = $f->Size;
	// 			} catch (Exception $e) {
	// 				$size = null;
	// 			}
	// 			if (is_numeric($size)) {
	// 				$result = $size;
	// 			}
	// 		}else if ($exec_works){
	// 			$cmd = ($iswin) ? "for %F in (\"$path\") do @echo %~zF" : "stat -c%s \"$path\"";
	// 			@exec($cmd, $output);
	// 			if (is_array($output) && is_numeric($size = trim(implode("\n", $output)))) {
	// 				$result = $size;
	// 			}
	// 		}else{
	// 			$result = filesize($path);
	// 		}
	// 	}
	// }
	// fclose($fp);
	// return $result;
}

/**
 * 获取文件详细信息
 * 文件名从程序编码转换成系统编码,传入utf8，系统函数需要为gbk
 */
function file_info($path){
	$name = get_path_this($path);
	$size = get_filesize($path);
	$info = array(
		'name'			=> iconv_app($name),
		'path'			=> iconv_app(get_path_father($path)),
		'ext'			=> get_path_ext($path),
		'type' 			=> 'file',
		'mode'			=> get_mode($path),
		'atime'			=> @fileatime($path), //最后访问时间
		'ctime'			=> @filectime($path), //创建时间
		'mtime'			=> @filemtime($path), //最后修改时间
		'is_readable'	=> intval(is_readable($path)),
		'is_writeable'	=> intval(is_writeable($path)),
		'size'			=> $size,
		'size_friendly'	=> size_format($size, 2)
	);
	return $info;
}
/**
 * 获取文件夹细信息
 */
function folder_info($path){
	$info = array(
		'name'			=> iconv_app(get_path_this($path)),
		'path'			=> iconv_app(get_path_father($path)),
		'type' 			=> 'folder',
		'mode'			=> get_mode($path),
		'atime'			=> fileatime($path), //访问时间
		'ctime'			=> filectime($path), //创建时间
		'mtime'			=> filemtime($path), //最后修改时间		
		'is_readable'	=> intval(is_readable($path)),
		'is_writeable'	=> intval(is_writeable($path))
	);
	return $info;
}


/**
 * 获取一个路径(文件夹&文件) 当前文件[夹]名
 * test/11/ ==>11 test/1.c  ==>1.c
 */
function get_path_this($path){
    $path = str_replace('\\','/', rtrim(trim($path),'/'));
    return substr($path,strrpos($path,'/')+1);
} 
/**
 * 获取一个路径(文件夹&文件) 父目录
 * /test/11/==>/test/   /test/1.c ==>/www/test/
 */
function get_path_father($path){
    $path = str_replace('\\','/', rtrim(trim($path),'/'));
    return substr($path, 0, strrpos($path,'/')+1);
}
/**
 * 获取扩展名
 */
function get_path_ext($path){
    $name = get_path_this($path);
    $ext = '';
    if(strstr($name,'.')){
        $ext = substr($name,strrpos($name,'.')+1);
        $ext = strtolower($ext);
    }
    if (strlen($ext)>3 && preg_match("/([\x81-\xfe][\x40-\xfe])/", $ext, $match)) {
        $ext = '';
    }
    return $ext;
}



//自动获取不重复文件(夹)名
//如果传入$file_add 则检测存在则自定重命名  a.txt 为a{$file_add}.txt
function get_filename_auto($path,$file_add = "",$same_file_type=''){
	if (is_dir($path)) {//文件夹则忽略
		return $path;
	}

	//重名处理方式;replace,skip,filename_auto
	if ($same_file_type == '') {
		$same_file_type = 'replace';
	}


	//重名处理
	if (file_exists($path)) {
		if ($same_file_type=='replace') {
			return $path;
		}else if($same_file_type=='skip'){
			return false;
		}
	}

	$i=1;
	$father = get_path_father($path);
	$name =  get_path_this($path);
	$ext = get_path_ext($name);
	if (strlen($ext)>0) {
		$ext='.'.$ext;
		$name = substr($name,0,strlen($name)-strlen($ext));
	}
	while(file_exists($path)){
		if ($file_add != '') {
			$path = $father.$name.$file_add.$ext;
			$file_add.='-';
		}else{
			$path = $father.$name.'('.$i.')'.$ext;
			$i++;
		}
	}
	return $path;
}

/**
 * 判断文件夹是否可写
 */
function path_writable($path) {	
	$file = $path.'/test'.time().'.txt';
	$dir  = $path.'/test'.time();
	if(@is_writable($path) && @touch($file) && @unlink($file)) return true;
	if(@mkdir($dir,0777) && @rmdir($dir)) return true;
	return false;
}

/**
 * 获取文件夹详细信息,文件夹属性时调用，包含子文件夹数量，文件数量，总大小
 */
function path_info($path){
	//if (!is_dir($path)) return false;
	if (!file_exists($path)) return false;
	$pathinfo = _path_info_more($path);//子目录文件大小统计信息
	$folderinfo = folder_info($path);
	return array_merge($pathinfo,$folderinfo);
}

/**
 * 检查名称是否合法
 */
function path_check($path){
	$check = array('/','\\',':','*','?','"','<','>','|');
	$path = rtrim($path,'/');
	$path = get_path_this($path);
	foreach ($check as $v) {
		if (strstr($path,$v)) {
			return false;
		}
	}
	return true;
}

/**
 * 递归获取文件夹信息： 子文件夹数量，文件数量，总大小
 */
function _path_info_more($dir, &$file_num = 0, &$path_num = 0, &$size = 0){
	if (!$dh = opendir($dir)) return false;
	while (($file = readdir($dh)) !== false) {
		if ($file != "." && $file != "..") {
			$fullpath = $dir . "/" . $file;
			if (!is_dir($fullpath)) {
				$file_num ++;
				$size += get_filesize($fullpath);
			} else {
				_path_info_more($fullpath, $file_num, $path_num, $size);
				$path_num ++;
			} 
		} 
	} 
	closedir($dh);
	$pathinfo['file_num'] = $file_num;
	$pathinfo['folder_num'] = $path_num;
	$pathinfo['size'] = $size;
	$pathinfo['size_friendly'] = size_format($size);
	return $pathinfo;
} 


/**
 * 获取多选文件信息,包含子文件夹数量，文件数量，总大小，父目录权限
 */
function path_info_muti($list,$time_type){
	if (count($list) == 1) {
		if ($list[0]['type']=="folder"){
	        return path_info($list[0]['path'],$time_type);
	    }else{
	        return file_info($list[0]['path'],$time_type);
	    }
	}
	$pathinfo = array(
		'file_num'		=> 0,
		'folder_num'	=> 0,
		'size'			=> 0,
		'size_friendly'	=> '',
		'father_name'	=> '',
		'mod'			=> ''
	);
	foreach ($list as $val){
		if ($val['type'] == 'folder') {
			$pathinfo['folder_num'] ++;
			$temp = path_info($val['path']);
			$pathinfo['folder_num']	+= $temp['folder_num'];
			$pathinfo['file_num']	+= $temp['file_num'];
			$pathinfo['size'] 		+= $temp['size'];
		}else{
			$pathinfo['file_num']++;
			$pathinfo['size'] += get_filesize($val['path']);
		}
	}
	$pathinfo['size_friendly'] = size_format($pathinfo['size']);
	$father_name = get_path_father($list[0]['path']);
	$pathinfo['mode'] = get_mode($father_name);
	return $pathinfo;
}

/** 
 * 获取文件夹下列表信息
 * dir 包含结尾/   d:/wwwroot/test/
 * 传入需要读取的文件夹路径,为程序编码
 */
function path_list($dir,$list_file=true,$check_children=false){
	$dir = rtrim($dir,'/').'/';
	if (!is_dir($dir) || !($dh = opendir($dir))){
		return array('folderlist'=>array(),'filelist'=>array());
	}
	$folderlist = array();$filelist = array();//文件夹与文件
	while (($file = readdir($dh)) !== false) {
		if ($file != "." && $file != ".." && $file != ".svn" ) {
			$fullpath = $dir . $file;
			if (is_dir($fullpath)) {
				$info = folder_info($fullpath);
				if($check_children){
					$info['isParent'] = path_haschildren($fullpath,$list_file);
				}
				$folderlist[] = $info;
			} else if($list_file) {//是否列出文件
				$info = file_info($fullpath);
				if($check_children) $info['isParent'] = false;
				$filelist[] = $info;
			}
		}
	}
	closedir($dh);
	return array('folderlist' => $folderlist,'filelist' => $filelist);
}

// 判断文件夹是否含有子内容【区分为文件或者只筛选文件夹才算】
function path_haschildren($dir,$check_file=false){
	$dir = rtrim($dir,'/').'/';
	if (!$dh = @opendir($dir)) return false;
	while (($file = readdir($dh)) !== false){
		if ($file != "." && $file != "..") {
			$fullpath = $dir.$file;
			if ($check_file) {//有子目录或者文件都说明有子内容
				if(is_file($fullpath) || is_dir($fullpath.'/')){
					return true;
				}
			}else{//只检查有没有文件
				@$ret =(is_dir($fullpath.'/'));
				return (bool)$ret;
			}
		} 
	} 	
	closedir($dh);
	return false;
}

/**
 * 删除文件 传入参数编码为操作系统编码. win--gbk
 */
function del_file($fullpath){
	if (!@unlink($fullpath)) { // 删除不了，尝试修改文件权限
		@chmod($fullpath, 0777);
		if (!@unlink($fullpath)) {
			return false;
		} 
	} else {
		return true;
	}
} 

/**
 * 删除文件夹 传入参数编码为操作系统编码. win--gbk
 */
function del_dir($dir){
	if (!$dh = opendir($dir)) return false;
	while (($file = readdir($dh)) !== false) {
		if ($file != "." && $file != "..") {
			$fullpath = $dir . '/' . $file;
			if (!is_dir($fullpath)) {
				if (!unlink($fullpath)) { // 删除不了，尝试修改文件权限
					chmod($fullpath, 0777);
					if (!unlink($fullpath)) {
						return false;
					} 
				} 
			} else {
				if (!del_dir($fullpath)) {
					chmod($fullpath, 0777);
					if (!del_dir($fullpath)) return false;
				} 
			} 
		} 
	}
	closedir($dh);
	if (rmdir($dir)) {
		return true;
	} else {
		return false;
	} 
} 

/**
 * 复制文件夹 
 * eg:将D:/wwwroot/下面wordpress复制到
 *	D:/wwwroot/www/explorer/0000/del/1/
 * 末尾都不需要加斜杠，复制到地址如果不加源文件夹名，
 * 就会将wordpress下面文件复制到D:/wwwroot/www/explorer/0000/del/1/下面
 * $from = 'D:/wwwroot/wordpress';
 * $to = 'D:/wwwroot/www/explorer/0000/del/1/wordpress';
 */

function copy_dir($source, $dest){
	if (!$dest) return false;

	if ($source == substr($dest,0,strlen($source))) return;//防止父文件夹拷贝到子文件夹，无限递归
	$result = false;
	if (is_file($source)) {
		if ($dest[strlen($dest)-1] == '/') {
			$__dest = $dest . "/" . basename($source);
		} else {
			$__dest = $dest;
		} 
		$result = copy($source, $__dest); 
		chmod($__dest, 0777);
	}elseif (is_dir($source)) {
		if ($dest[strlen($dest)-1] == '/') {
			$dest = $dest . basename($source);		
		}
		if (!is_dir($dest)) {
			mkdir($dest,0777);
		}
		if (!$dh = opendir($source)) return false;
		while (($file = readdir($dh)) !== false) {
			if ($file != "." && $file != "..") {
				if (!is_dir($source . "/" . $file)) {
					$__dest = $dest . "/" . $file;
				} else {
					$__dest = $dest . "/" . $file;
				} 
				$result = copy_dir($source . "/" . $file, $__dest);
			} 
		} 
		closedir($dh);
	}
	return $result;
}

/**
 * 创建目录
 * 
 * @param string $dir 
 * @param int $mode 
 * @return bool 
 */
function mk_dir($dir, $mode = 0777){
	if (is_dir($dir) || @mkdir($dir, $mode)){		
		return true;
	}
	if (!mk_dir(dirname($dir), $mode)){		
		return false;		
	}
	return @mkdir($dir, $mode);
}

/*
* 获取文件&文件夹列表(支持文件夹层级)
* path : 文件夹 $dir ——返回的文件夹array files ——返回的文件array 
* $deepest 是否完整递归；$deep 递归层级
*/
function recursion_dir($path,&$dir,&$file,$deepest=-1,$deep=0){
	$path = rtrim($path,'/').'/';
	if (!is_array($file)) $file=array();
	if (!is_array($dir)) $dir=array();
	if (!$dh = opendir($path)) return false;
	while(($val=readdir($dh)) !== false){
		if ($val=='.' || $val=='..') continue;
		$value = strval($path.$val);
		if (is_file($value)){
			$file[] = $value;
		}else if(is_dir($value)){
			$dir[]=$value;
			if ($deepest==-1 || $deep<$deepest){
				recursion_dir($value."/",$dir,$file,$deepest,$deep+1);
			}
		}
	}
	closedir($dh);
	return true;
}
/*
 * $search 为包含的字符串 
 * is_content 表示是否搜索文件内容;默认不搜索
 * is_case  表示区分大小写,默认不区分
 */
function path_search($path,$search,$is_content=false,$file_ext='',$is_case=false){
	$ext_arr=explode("|",$file_ext);
	recursion_dir($path,$dirs,$files,-1,0);
	$strpos = 'stripos';//是否区分大小写
	if ($is_case) $strpos = 'strpos';
	
	$filelist = array();
	$folderlist = array();
	foreach($files as $f){
		$ext = get_path_ext($f);
		$path_this = get_path_this($f);
		if ($file_ext !='' && !in_array($ext,$ext_arr)) continue;//文件类型不在用户限定内
		if ($strpos($path_this,$search) !== false){//搜索文件名;搜到就返回；搜不到继续
			$filelist[] = file_info($f);
			continue;
		}
		if ($is_content && is_file($f)){
			$fp = fopen($f, "r");
			$content = @fread($fp,get_filesize($f));
			fclose($fp);
			if ($strpos($content,iconv_app($search)) !== false){
				$filelist[] = file_info($f);
			}
		}
	}
	if ($file_ext == '') {//没限定扩展名则才搜索文件夹
		foreach($dirs as $f){
			$path_this = get_path_this($f);
			if ($strpos($path_this,$search) !== false){
				$folderlist[]= array(
					'name'  => iconv_app(get_path_this($f)),
					'path'  => iconv_app(get_path_father($f))			
				);
			}
		}
	}
	return array('folderlist' => $folderlist,'filelist' => $filelist);
}

/**
 * 修改文件、文件夹权限
 * @param  $path 文件(夹)目录
 * @return :string
 */
function chmod_path($path,$mod){
	//$mod = 0777;//
	if (!isset($mod)) $mod = 0777;
	if (!is_dir($path)) return @chmod($path,$mod);
	if (!$dh = opendir($path)) return false;
	while (($file = readdir($dh)) !== false){
		if ($file != "." && $file != "..") {
			$fullpath = $path . '/' . $file;
			chmod($fullpath,$mod);
			return chmod_path($fullpath,$mod);
		} 
	}
	closedir($dh);
	return chmod($path,$mod);
} 

/**
 * 文件大小格式化
 * 
 * @param  $ :$bytes, int 文件大小
 * @param  $ :$precision int  保留小数点
 * @return :string
 */
function size_format($bytes, $precision = 2){
	if ($bytes == 0) return "0 B";
	$unit = array(
		'TB' => 1099511627776,  // pow( 1024, 4)
		'GB' => 1073741824,		// pow( 1024, 3)
		'MB' => 1048576,		// pow( 1024, 2)
		'kB' => 1024,			// pow( 1024, 1)
		'B ' => 1,				// pow( 1024, 0)
	);
	foreach ($unit as $un => $mag) {
		if (doubleval($bytes) >= $mag)
			return round($bytes / $mag, $precision).' '.$un;
	} 
} 

/**
 * 判断路径是不是绝对路径
 * 返回true('/foo/bar','c:\windows').
 * 
 * @return 返回true则为绝对路径，否则为相对路径
 */
function path_is_absolute($path){
	if (realpath($path) == $path)// *nux 的绝对路径 /home/my
		return true;
	if (strlen($path) == 0 || $path[0] == '.')
		return false;
	if (preg_match('#^[a-zA-Z]:\\\\#', $path))// windows 的绝对路径 c:\aaa\
		return true;
	return (bool)preg_match('#^[/\\\\]#', $path); //绝对路径 运行 / 和 \绝对路径，其他的则为相对路径
} 

/**
 * 获取扩展名的文件类型
 * 
 * @param  $ :$ext string 扩展名
 * @return :string;
 */
function ext_type($ext){
	$ext2type = array(
		'text' => array('txt','ini','log','asc','csv','tsv','vbs','bat','cmd','inc','conf','inf'),
		'code'		=> array('css','htm','html','php','js','c','cpp','h','java','cs','sql','xml'),
		'picture'	=> array('jpg','jpeg','png','gif','ico','bmp','tif','tiff','dib','rle'),
		'audio'		=> array('mp3','ogg','oga','mid','midi','ram','wav','wma','aac','ac3','aif','aiff','m3a','m4a','m4b','mka','mp1','mx3','mp2'),
		'flash'		=> array('swf'),
		'video'		=> array('rm','rmvb','flv','mkv','wmv','asf','avi','aiff','mp4','divx','dv','m4v','mov','mpeg','vob','mpg','mpv','ogm','ogv','qt'),
		'document'	=> array('doc','docx','docm','dotm','odt','pages','pdf','rtf','xls','xlsx','xlsb','xlsm','ppt','pptx','pptm','odp'),
		'rar_achieve'	=> array('rar','arj','tar','ace','gz','lzh','uue','bz2'),
		'zip_achieve'	=> array('zip','gzip','cab','tbz','tbz2'),
		'other_achieve' => array('dmg','sea','sit','sqx')
	);
	foreach ($ext2type as $type => $exts) {
		if (in_array($ext, $exts)) {
			return $type;
		} 
	} 
}





// function zipupload($filepath){
// 	// $filepath= iconv("UTF-8", "GBK", $filepath);
// 	set_time_limit(0);
// 	if (isset($_SERVER['HTTP_RANGE']) && ($_SERVER['HTTP_RANGE'] != "") && 
// 		preg_match("/^bytes=([0-9]+)-$/i", $_SERVER['HTTP_RANGE'], $match) && ($match[1] < $fsize)) { 
// 		$start = $match[1];
// 	}else{
// 		$start = 0;
// 	}

// 	$filename = basename($filepath);
// 	$patharr=explode("/",$filepath);
// 	if(!end($patharr)){
// 		array_pop($patharr);
// 		array_pop($patharr);
// 	}else{
// 		array_pop($patharr);
// 	}
// 	$path = implode('/',$patharr);

// 	$zippath = $path.'/'.$filename.'.zip';
// // exec("cd '".$path."'; " ."zip -r  '". $filename.".zip'  '". $filename."'");
// exec("cd '".$path."'; " ."tar  cf  '". $filename.".zip'  '". $filename."'");
// // show_json("cd '".$path."'; " ."zip -r  '". $filename.".zip'  '". $filename."'");
//     if(!file_exists($zippath)){
//         echo 1;die;
// 	}
// 	$size = showsize($zippath);
// 	$filename = get_path_this($file);//解决在IE中下载时中文乱码问题
// 		if( preg_match('/MSIE/',$_SERVER['HTTP_USER_AGENT']) || 
// 			preg_match('/Trident/',$_SERVER['HTTP_USER_AGENT'])){
// 			if($GLOBALS['config']['system_os']!='windows'){//win主机 ie浏览器；中文文件下载urlencode问题
// 				$filename = str_replace('+','%20',urlencode($filename));
// 			}
// 		}
// 		write_dblog("下载",$filename,"通过","");
// 		header("Content-Type: application/octet-stream");
// 		header('Content-disposition: attachment; filename=' . basename($zippath)); //文件名
	
// 	header("Cache-Control: public");
// 	header("X-Powered-By: SecROS.");
// 	// header("Content-Type: ".$mime);
// 	if ($start > 0){
// 		header("HTTP/1.1 206 Partial Content");
// 		header("Content-Ranges: bytes".$start ."-".($size - 1)."/" .$size);
// 		header("Content-Length: ".($size - $start));		
// 	}else{
// 		header("Accept-Ranges: bytes");
// 		header("Content-Length: $size");
// 	}

// 	$fp = fopen($zippath, "rb");
// 	fseek($fp, $start);
// 	while (!feof($fp)) {
// 		print (fread($fp, 1024 * 8)); //输出文件  
// 		flush(); 
// 		ob_flush();
// 	}  
// 	fclose($fp);

//     // header("Cache-Control: public");
//     // header("Content-Description: File Transfer");
//     // header('Content-disposition: attachment; filename=' . basename($zippath)); //文件名
//     // header("Content-Type: application/zip"); //zip格式的
//     // header("Content-Transfer-Encoding: binary"); //告诉浏览器，这是二进制文件
//     // header('Content-Length: ' . filesize($zippath)); //告诉浏览器，文件大小
//     // @readfile($zippath);//下载到本地
//     @unlink($zippath);//删除压缩文件
// }

/**
 * 输出、文件下载
 * 默认以附件方式下载；$download为false时则为输出文件
 * 下载
 */
function file_put_out($file,$download=false){
	// ob_clean();
	// clearstatcache();
	set_time_limit(0);
	$filesize = get_filesize($file);
	if ($filesize > 0){

	// if (isset($_SERVER['HTTP_RANGE']) && ($_SERVER['HTTP_RANGE'] != "") && 
	// 	preg_match("/^bytes=([0-9]+)-$/i", $_SERVER['HTTP_RANGE'], $match) && ($match[1] < $fsize)) { 
	// 	$start = $match[1];
	// }else{
	// 	$start = 0;
	// }
	if ($GLOBALS['is_root'] != 1){
		if(X86 == 1){//x86
		$finfo = finfo_open(FILEINFO_MIME,"/usr/local/share/misc/magic.mgc");
		}else{//mips
		$finfo = finfo_open(FILEINFO_MIME,"/usr/local/share/misc/web.mgc");
		}
	  if ($finfo){
		$type = @finfo_file($finfo, $file);
		$type = explode(';', $type);
		$size = $filesize;
		$mime = get_file_mime(get_path_ext($file));
		if ($GLOBALS['config']['system_info']['deepcheck']==1 && $type[0] != $mime) {
			$filename = get_path_this($file);
			write_dblog("下载",$filename,"阻断","非法文件");
			show_json('deepcheck nodownload');
		}
	  }
	}else{
		$size = $filesize;
		$mime = get_file_mime(get_path_ext($file));
	}

	// if ($download || strstr($mime,'application/')) {//下载或者application则设置下载头
		$filename = get_path_this($file);//解决在IE中下载时中文乱码问题
		if( preg_match('/MSIE/',$_SERVER['HTTP_USER_AGENT']) || 
			preg_match('/Trident/',$_SERVER['HTTP_USER_AGENT'])){
			if($GLOBALS['config']['system_os']!='windows'){//win主机 ie浏览器；中文文件下载urlencode问题
				$filename = str_replace('+','%20',urlencode($filename));
			}
		}
	// 	header("Content-Type: application/octet-stream");
	// 	header("Content-Disposition: attachment;filename=".$filename);
	// }
	
	// header("Cache-Control: public");
	// header("X-Powered-By: SecROS.");
	// header("Content-Type: ".$mime);
	// if ($start > 0){
	// 	header("HTTP/1.1 206 Partial Content");
	// 	header("Content-Ranges: bytes".$start ."-".($size - 1)."/" .$size);
	// 	header("Content-Length: ".($size - $start));		
	// }else{
	// 	header("Accept-Ranges: bytes");
	// 	header("Content-Length: $size");
	// }


	$speed = 1024 * 1024;
	if(X86 == 1){
		$speed = 1024 * 1024 * 4;
	}
	
	header('Content-Description: File Transfer');
    header('Content-Type: application/octet-stream');
    header('Content-Transfer-Encoding: binary');
    header('Accept-Ranges: bytes');
    header('Expires: 0');
    header('Cache-Control: must-revalidate');
    header('Pragma: public');
    header('Content-Length: ' . $filesize);
    header('Content-Disposition: attachment; filename=' . $filename);

    // 打开文件
    $fp = fopen($file, 'rb');
    // 设置指针位置
    fseek($fp, 0);
    // 开启缓冲区
    ob_start();
    // 分段读取文件
    while (!feof($fp)) {
        echo fread($fp, $speed);
        ob_flush(); // 刷新PHP缓冲区到Web服务器
        flush(); // 刷新Web服务器缓冲区到浏览器
    }
    // 关闭缓冲区
    ob_end_clean();
    fclose($fp);
	write_dblog("下载",$filename,"通过","");
	}else{
		write_dblog("下载",$filename,"失败","文件不存在");
		show_json('文件不存在');
	}
}


function showsize($file) {
    if (strtoupper(substr(PHP_OS, 0, 3)) == 'WIN') {
      if (class_exists("COM")) {
        $fsobj = new COM('Scripting.FileSystemObject');
        $f = $fsobj->GetFile(realpath($file));
        $file = $f->Size;
      } else {
        $file = trim(exec("for %F in (\"" . $file . "\") do @echo %~zF"));
      }
    } else if (PHP_OS == 'Darwin') {
      $file = trim(shell_exec("stat -f %z " ."'". $file."'"));
    } else if ((PHP_OS == 'Linux') || (PHP_OS == 'FreeBSD') || (PHP_OS == 'Unix') || (PHP_OS == 'SunOS')) {
	//   $file = trim(shell_exec("stat -c%s " . escapeshellarg($file)));
	  $file = trim(shell_exec("stat -c%s " ."'". $file."'"));
    } else {
	  $file = filesize($file);
    }
	return $file;
  }

/**
 * 远程文件下载到服务器
 * 支持fopen的打开都可以；支持本地、url 
 * 
 */
function file_download_this($from, $file_name){
	set_time_limit(0);
	$fp = @fopen ($from, "rb");
	if ($fp){
		$new_fp = @fopen ($file_name, "wb");
		fclose($new_fp);

		$download_fp = @fopen ($file_name, "wb");
		while(!feof($fp)){
			if(!file_exists($file_name)){//删除目标文件；则终止下载
				fclose($download_fp);
				return false;
			}
			fwrite($download_fp, fread($fp, 1024 * 8 ), 1024 * 8);
		}
		//下载完成，重命名临时文件到目标文件
		fclose($download_fp);		
		return true;
	}else{
		return false;
	}	
}

/**
 * 获取文件(夹)权限 rwx_rwx_rwx
 */
function get_mode($file){
	$Mode = @fileperms($file);
	$theMode = ' '.decoct($Mode);
	$theMode = substr($theMode,-4);
	$Owner = array();$Group=array();$World=array();
	if ($Mode &0x1000) $Type = 'p'; // FIFO pipe
	elseif ($Mode &0x2000) $Type = 'c'; // Character special
	elseif ($Mode &0x4000) $Type = 'd'; // Directory
	elseif ($Mode &0x6000) $Type = 'b'; // Block special
	elseif ($Mode &0x8000) $Type = '-'; // Regular
	elseif ($Mode &0xA000) $Type = 'l'; // Symbolic Link
	elseif ($Mode &0xC000) $Type = 's'; // Socket
	else $Type = 'u'; // UNKNOWN 
	// Determine les permissions par Groupe
	$Owner['r'] = ($Mode &00400) ? 'r' : '-';
	$Owner['w'] = ($Mode &00200) ? 'w' : '-';
	$Owner['x'] = ($Mode &00100) ? 'x' : '-';
	$Group['r'] = ($Mode &00040) ? 'r' : '-';
	$Group['w'] = ($Mode &00020) ? 'w' : '-';
	$Group['e'] = ($Mode &00010) ? 'x' : '-';
	$World['r'] = ($Mode &00004) ? 'r' : '-';
	$World['w'] = ($Mode &00002) ? 'w' : '-';
	$World['e'] = ($Mode &00001) ? 'x' : '-'; 
	// Adjuste pour SUID, SGID et sticky bit
	if ($Mode &0x800) $Owner['e'] = ($Owner['e'] == 'x') ? 's' : 'S';
	if ($Mode &0x400) $Group['e'] = ($Group['e'] == 'x') ? 's' : 'S';
	if ($Mode &0x200) $World['e'] = ($World['e'] == 'x') ? 't' : 'T';
	$Mode = $Type.$Owner['r'].$Owner['w'].$Owner['x'].' '.
			$Group['r'].$Group['w'].$Group['e'].' '.
			$World['r'].$World['w'].$World['e'];
	return $Mode.' ('.$theMode.') ';
} 

/**
 * 获取可以上传的最大值
 * return * byte
 */
function get_post_max(){
	$upload = ini_get('upload_max_filesize');
	$upload = $upload==''?ini_get('upload_max_size'):$upload;
    $post = ini_get('post_max_size');
	$upload = intval($upload)*1024*1024;
	$post = intval($post)*1024*1024;
	return $upload<$post?$upload:$post;
}

/**
 * 文件上传处理。单个文件上传,多个分多次请求
 * 调用demo
 * upload('file','D:/www/');
 */
function upload($fileInput, $path = './'){
	global $config,$L;
	$file = $_FILES[$fileInput];
	if (!isset($file)) show_json($L['upload_error_null'],false);
	
	$file_name = iconv_system($file['name']);
	$save_path = get_filename_auto($path.$file_name);
	if(move_uploaded_file($file['tmp_name'],$save_path)){
		system("sync");
		system("sync");
		system("sync");
		show_json($L['upload_success'],true,iconv_app($save_pathe));
	}else {
		show_json($L['move_error'],false);
	}
}

//分片上传处理
//删除
function del_chunk($name,$chunks,$path){
	set_time_limit(0);
$temp_path = $path.$name;
$temp_file_pre = $temp_path.md5($temp_path.$name).'.part';
sleep(1);
for( $index = 0; $index < $chunks; $index++ ) {
	if (file_exists($temp_file_pre.$index)) {
		unlink($temp_file_pre.$index);
	}
}
show_json(true);
}
//上传
function upload_chunk($fileInput, $path = './',$temp_path){
	set_time_limit(0);
	global $config,$L;
	$file = $_FILES[$fileInput];
	$chunk = isset($_REQUEST["chunk"]) ? intval($_REQUEST["chunk"]) : 0;//which chunk
	$chunks = isset($_REQUEST["chunks"]) ? intval($_REQUEST["chunks"]) : 1;//total chunks
	if (!isset($file)) show_json($L['upload_error_null'],false);
	$file_name = iconv_system($file['name']);
	$ex_name = $GLOBALS['config']['whitelist'];
	$ext = get_path_ext($file_name);
	
	if ($GLOBALS['is_root'] != 1){
  	if (!in_array($ext,$ex_name)){
  		show_json($L['filetype_noupload'],false);
  	}
  }
        
	if ($chunks>1) {//并发上传，不一定有前后顺序
		$temp_path = $path.$file_name;
		$temp_file_pre = $temp_path.md5($temp_path.$file_name).'.part';
		if (get_filesize($file['tmp_name']) ==0) {
			show_json($L['upload_success'],false,'chunk_'.$chunk.' error!');
		}

// //第一次上传时没有文件，就创建文件，此后上传只需要把数据追加到此文件中 
// if(!file_exists($temp_file_pre)){
// 	// if($chunk == 0){
//  move_uploaded_file($file['tmp_name'],$temp_file_pre); 
//  show_json($L['upload_success'],true,'first chunk_'.$chunk.' success!');
// }else{ 
// 	// methoda:
// 	// $out = fopen($temp_file_pre, "a");
// 	// 	if (flock($out, LOCK_EX)) {
	   
// 	//             if (!$in = fopen($file['tmp_name'],"rb")) break;
// 	//             while ($buff = fread($in, 1024*1024*8)) {
// 	//                 fwrite($out, $buff);
// 	//             }
// 	//             fclose($in);
// 	//         sleep(1);
// 	//         flock($out, LOCK_UN);
// 	// 	    fclose($out);
// 	// 	}
// // methodb:
//  file_put_contents($temp_file_pre,file_get_contents($file['tmp_name']),FILE_APPEND | LOCK_EX); 
//  if($chunk + 1 >= $chunks){
// 	if (file_exists($temp_path)) {
// 		unlink($temp_path);
// 	}
// 	$save_path = $temp_path;
// 	rename($temp_file_pre,$save_path);

// 	if ($GLOBALS['is_root'] != 1){
// 		if(X86 == 1){//x86
// 			$finfo = finfo_open(FILEINFO_MIME,"/usr/local/share/misc/magic.mgc");
// 			}else{//mips
// 			$finfo = finfo_open(FILEINFO_MIME,"/usr/local/share/misc/web.mgc");
// 			}
// 	  if($finfo){
// 		$type = @finfo_file($finfo, $save_path);
// 		$type = explode(';', $type);
// 		$mime = get_file_mime($ext);
// 		if ($GLOBALS['config']['system_info']['deepcheck']==1 && $type[0] != $mime) {
// 			unlink($save_path);
// 			write_dblog("上传",$filename,"出错",$L['deepcheck_nodownload']);
// 			show_json($L['deepcheck_nodownload'],false);
// 		}
// 	  }else{
// 		write_dblog("上传",$filename,"出错","文件错误");
// 		show_json($L['move_error'],false);
// 	  }
// 	}
// 	write_dblog("上传",$file_name,"通过","");
// 	show_json($L['upload_success'],true,iconv_app($save_path));
// }
// 测试 //write_dblog("上传",$file_name,"通过",'chunk_'.$chunk.' success!'.$chunks);
//  show_json($L['upload_success'],true,'chunk_'.$chunk.' success!'.$chunks);
// } 


	
	//上传完合并
		if(move_uploaded_file($file['tmp_name'],$temp_file_pre.$chunk)){
			$done = true;
			for($index = 0; $index<$chunks; $index++ ){
			    if (!file_exists($temp_file_pre.$index)) {
			        $done = false;
			        break;
			    }
			}
			if (!$done){				
				show_json($L['upload_success'],true,'chunk_'.$chunk.' success!');
			}

			$speed = 1024 * 1024;
			if(X86 == 1){
				$speed = 1024 * 1024 * 4;
			}
			$save_path = $path.$file_name;
			$out = fopen($save_path, "wb");
			if ($done && flock($out, LOCK_EX)) {
		        for( $index = 0; $index < $chunks; $index++ ) {
		            if (!$in = fopen($temp_file_pre.$index,"rb")) break;
		            while ($buff = fread($in, $speed)) {
		                fwrite($out, $buff);
		            }
		            fclose($in);
		            unlink($temp_file_pre.$index);
		        }
		        flock($out, LOCK_UN);
			    fclose($out);
			}
			if ($GLOBALS['is_root'] != 1){
				if(X86 == 1){//x86
					$finfo = finfo_open(FILEINFO_MIME,"/usr/local/share/misc/magic.mgc");
					}else{//mips
					$finfo = finfo_open(FILEINFO_MIME,"/usr/local/share/misc/web.mgc");
					}
			  if ($finfo)
			  	$type = @finfo_file($finfo, $save_path);
				$type = explode(';', $type);
				$mime = get_file_mime($ext);
				if ($GLOBALS['config']['system_info']['deepcheck']==1 && $type[0] != $mime) {
					unlink($save_path);
				write_dblog("上传",$filename,"出错",$L['deepcheck_nodownload']);
					show_json($L['deepcheck_nodownload'],false);
				}
			}
			write_dblog("上传",$file_name,"通过","");
			show_json($L['upload_success'],true,iconv_app($save_path));
		}else {
			write_dblog("上传",$filename,"出错","文件错误");
			show_json($L['move_error'],false);
		}


		

	}

	//正常上传
	$save_path = get_filename_auto($path.$file_name); //自动重命名
	if(move_uploaded_file($file['tmp_name'],$save_path)){
		if ($GLOBALS['is_root'] != 1){
			if(X86 == 1){//x86
				$finfo = finfo_open(FILEINFO_MIME,"/usr/local/share/misc/magic.mgc");
				}else{//mips
				$finfo = finfo_open(FILEINFO_MIME,"/usr/local/share/misc/web.mgc");
				}
		  if ($finfo)
		  	$type = @finfo_file($finfo, $save_path);
			$type = explode(';', $type);//文件上传类型
			$mime = get_file_mime($ext);
			if ($GLOBALS['config']['system_info']['deepcheck']==1 && $type[0] != $mime) {
				unlink($save_path);
				write_dblog("上传",$filename,"出错",$L['deepcheck_nodownload']);
				show_json($L['deepcheck_nodownload'],false);
			}
		}
		write_dblog("上传",$file_name,"通过","");
		show_json($L['upload_success'],true,iconv_app($save_path));
	}else {
		write_dblog("上传",$filename,"出错","文件错误");
		show_json($L['move_error'],false);
	}
}

/**
 * 写日志
 * @param string $log   日志信息
 * @param string $type  日志类型 [system|app|...]
 * @param string $level 日志级别
 * @return boolean
 */
function write_log($log, $type = 'default', $level = 'log'){
	$now_time = date('[y-m-d H:i:s]');
	$now_day  = date('Y_m_d');
	// 根据类型设置日志目标位置
	$target   = LOG_PATH . strtolower($type) . '/';
	mk_dir($target, 0777);
	if (! is_writable($target)) exit('path can not write!');
	switch($level){// 分级写日志
		case 'error':	$target .= 'Error_' . $now_day . '.log';break;
		case 'warning':	$target .= 'Warning_' . $now_day . '.log';break;
		case 'debug':	$target .= 'Debug_' . $now_day . '.log';break;
		case 'info':	$target .= 'Info_' . $now_day . '.log';break;
		case 'db':		$target .= 'Db_' . $now_day . '.log';break;
		default:		$target .= 'Log_' . $now_day . '.log';break;
	}
	//检测日志文件大小, 超过配置大小则重命名
	if (file_exists($target) && get_filesize($target) <= 100000) {
		$file_name = substr(basename($target),0,strrpos(basename($target),'.log')).'.log';
		rename($target, dirname($target) .'/'. $file_name);
	}
	clearstatcache();
	return error_log("$now_time $log\n", 3, $target);
}

// function write_audit($type, $action, $result, $desc)
// {
// 	$now_time = date('y-m-d H:i:s');
// 	$target = $now_time . '|' . $type . '|' . $_SESSION['secros_user']['name'] . '|' .get_client_ip() . '|' . $action . '|' . $result . "|" . $desc . "\n";
// 	return error_log($target, 3, "/var/log/auditlog");
// }


//写入操作日志
function write_audit($type, $event, $result, $desc)
{
	// get_client_ip() //获取ip
	if ($event == "")
		return;
	$now_time = date('Y-m-d H:i:s');
	$db = new SQLite3('/var/spool/antivirus/log.db');
	$db->busyTimeout(5000);
	if ($db){
	$db->exec("insert into auditlog (user,type,time,event,result,desc) values ('" . $_SESSION['secros_user']['name']  . "','" . $type . "','" . $now_time  . "','" . $event . "','" . $result . "','" . $desc . "')");
	}
	$db->close();
	$ck_noc = config_get_value_from_file('/var/run/roswan','noc_connected');
	if($ck_noc){
		exec("oplogpub ". $type ." ".$_SESSION['secros_user']['name']." ".$event." ".$result." ".$desc);
	}
	openlog("httplog", LOG_PID , LOG_LOCAL1);
	syslog(LOG_INFO,$type ." | ".$_SESSION['secros_user']['name']." | ".$event." | ".$result." | ".$desc );
	closelog();
}


function write_dblog($direct, $filename, $action, $desc)
{
	if ($filename == "")
		return;
	$now_time = date('Y-m-d H:i:s');
	$db = new SQLite3('/var/spool/antivirus/log.db');
	$db->busyTimeout(5000);
	if ($db){
		$db->exec("insert into httplog (username,clientip,datetime,filename,direct,action,desc) values ('" . $_SESSION['secros_user']['name'] . "','" . get_client_ip() . "','" . $now_time . "','" . $filename . "','" . $direct . "','" . $action . "','" . $desc . "')");
	}
	$db->close();
	$ck_noc = config_get_value_from_file('/var/run/roswan','noc_connected');
	if($ck_noc){
		exec("hfslogpub 1 ".$_SESSION['secros_user']['name']." ". get_client_ip() ." '". $filename . "' ".$direct." ".$action." ".$desc);
	}
	openlog("httplog", LOG_PID , LOG_LOCAL1);
	syslog(LOG_INFO,$_SESSION['secros_user']['name']." | ". get_client_ip() ." | ". $filename . " | ".$direct." |　".$action." ｜".$desc);
	closelog();
}

function config_read($filename){
	$output = array();
	if (file_exists($filename)) {
			$fd = file($filename,FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
			foreach ($fd as $data) {
				$arr = explode('=',$data);
				$output[$arr[0]] = trim($arr[1],'"');
			}
	}
	return $output;
}

function config_update($filename, $key, $value)
{
	$arr = config_read($filename);
	$arr[$key] = $value;
	$fp = fopen($filename, "wb");
	if ($fp){
		foreach ($arr as $k => $v) {
			$buff = $k .'=' .'"'. $v .'"' ."\n";
			fwrite($fp, $buff);			
		}
		fflush($fp); 
		fclose($fp);
	}
}

function config_get_value_from_file($filename,$key){
	$arr = config_read($filename);
	return $arr[$key];
}

function config_get_unsign_int_from_file($filename,$key){
	$arr = config_read($filename);
	if ($arr[$key]){
		return intval($arr[$key]);
	}
	else{
		return 0;
	}
}

function get_uptime()
{
if (false === ($str = @file("/proc/uptime"))) return false;
$str = explode(" ", implode("", $str));
$str = trim($str[0]);
$min = $str / 60;
$hours = $min / 60;
$days = floor($hours / 24);
$hours = floor($hours - ($days * 24));
$min = floor($min - ($days * 60 * 24) - ($hours * 60));
if ($days !== 0) $res = $days."天";
if ($hours !== 0) $res .= $hours."小时";
$res .= $min."分钟";
return $res;
}

function get_extension($file)
{
return pathinfo($file, PATHINFO_EXTENSION);
}

