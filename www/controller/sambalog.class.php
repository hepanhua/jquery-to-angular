<?php 

class sambalog extends Controller{
    private $sql;
    function __construct(){
        parent::__construct();
    }

		public function init() {
			$db = new SQLite3('/var/spool/antivirus/log.db');
			if ($db)
			{
				$results= $db->query("select count(*) as count from sambalog");
			}
			else
			{
				show_json($L['data_error'],false);
			}
			while ($res= $results->fetchArray(1))
			{
				$count= $res['count'];
			}
			$results= $db->query("select * from sambalog order by id desc limit 10");	
			$data= array();
			$i = 0; 
			$lnum = 0;
			$fnum = 0;
			
			while ($res= $results->fetchArray(1))
			{
				if ($i==0){
					$lnum = $res['id'];
				}
				$fnum = $res['id']; 
				$i++;
				array_push($data, $res);
			}

			$info= array('count' => $count,'fnum'=> $fnum,'lnum' => $lnum);
			
			show_json($data,true,$info);
    }
    
    public function clean() {
			$db = new SQLite3('/var/spool/antivirus/log.db');
			
			if ($db)
			{
				$results= $db->query("delete from sambalog");	
			}
			else
			{
				show_json($L['data_error'],false);
			}
			
			$data= array();
			$i = 0; 
			$lnum = 0;
			$fnum = 0;
			while ($res= $results->fetchArray(1))
			{
				//insert row into array
				if ($i==0){
					$lnum = $res['id'];
				}
				$fnum = $res['id']; 
				$i++;
				array_push($data, $res);
			}
			
			$results= $db->query("update sqlite_sequence set seq = 0 where name = 'sambalog'");
			$results= $db->query("select count(*) as count from sambalog");

			while ($res= $results->fetchArray(1))
			{
				$count= $res['count'];
			}
			
			
			$info= array('count' => $count,'fnum'=> $fnum,'lnum' => $lnum);
			
			show_json($data,true,$info);
    }
    public function get() {
		//show_json($this->L['success']);
		$fnum = $this->in['fnum'];
		$lnum = $this->in['lnum'];
		$direct = $this->in['direct'];
		$fdirect = $this->in['fdirect'];
		$datestart = $this->in['datestart'];
		$dateend = $this->in['dateend'];
		$username = $this->in['username'];
		$filename = $this->in['filename'];
		$action = $this->in['action'];

		$db = new SQLite3('/var/spool/antivirus/log.db');
		
		if ($db)
		{
			$results= $db->query("select count(*) as count from sambalog");
		}
		else
		{
			show_json($L['data_error'],false);
		}
		while ($res= $results->fetchArray(1))
		{
			$count= $res['count'];
		}
		
// 条件查询
$filterweb=" ";
if($username !=""){
$filterweb=$filterweb . " and username == '" . $username . "'";
}
if($filename !=""){
$filterweb=$filterweb . " and filename like '" . "%" . $filename . "%" . "'";
}
if($action !=""){
 $filterweb=$filterweb . " and action == '" . $action . "'";
}
if($fdirect !=""){
$filterweb=$filterweb . " and  direct == '" . $fdirect . "'";
}
if($datestart !=""){
$datetime=explode("T",$datestart);
$datestart = implode(" ",$datetime);
$filterweb=$filterweb . " and  datetime >= '" . $datestart . "'";
}
if($dateend !=""){
$datetime2=explode("T",$dateend);
$dateend = implode(" ",$datetime2);
$filterweb=$filterweb . " and  datetime <= '" . $dateend . "'";
}

//过滤后的总数
if($filterweb != " "){
$where2=" where id <= " . $count;
$afterfilter= $db->query("select count(*) as count from sambalog" . $where2 . $filterweb);
$aftercount=0;
while ($res= $afterfilter->fetchArray(1))
{
	$aftercount= $res['count'];
}
// var_dump($aftercount);
}

	//下一页
		  if ($direct=="next"){
			$where=" where id < " . $fnum;
			if ($fnum == 1){
				$where=" where id <= " . $lnum;
			}
	//数据库
	$results= $db->query("select * from sambalog"  . $where .  $filterweb . "order by id desc limit 10"); //倒序
	$data= array();
	$i = 0; 
	while ($res= $results->fetchArray(1))
	{
		if ($i==0){
			$lnum = $res['id'];
		}
		$fnum = $res['id']; 
		$i++;
		array_push($data, $res);
	}
//若下一页无数据，则
if($data == array()){
	$where=" where id >= 1 ";
		//过滤情况，总数用过滤后的
		if($aftercount && $aftercount != 0){
			$limitcount=$aftercount % 10;
		}
		else{
			$limitcount=$count % 10;
		}
		if($limitcount == 0){
			$limitcount = 10;
		}
	//数据库（正序）
$results1= $db->query("select * from  sambalog"  . $where .  $filterweb . "order by id asc limit " . $limitcount);  //正序
$data= array();
$ascdata = array();
$k = 0; 
while ($res= $results1->fetchArray(1))
{
if ($i==0){
	$lnum = $res['id'];
}
$fnum = $res['id']; 
$i++;
array_push($ascdata, $res);
}
	for($k = count($ascdata)-1;$k>=0;$k--){
		if($k == count($ascdata)-1){
			$lnum = $ascdata[$k]['id'];
		}
		if($k == 0){
			$fnum = $ascdata[$k]['id']; 
		}
		if($ascdata[$k]['id'] != null){
			array_push($data,$ascdata[$k]);
		}
}
}
}
		//上一页
		else if ($direct=="prev")
		{
			if($lnum < $count){
		$where=" where id > " . $lnum;
				//数据库（正序）
$results1= $db->query("select * from  sambalog"  . $where .  $filterweb . "order by id asc limit 10");  //正序
$data= array();
$ascdata = array();
$k = 0; 
while ($res= $results1->fetchArray(1))
{
	if ($i==0){
		$lnum = $res['id'];
	}
	$fnum = $res['id']; 
	$i++;
	array_push($ascdata, $res);
}
//遍历倒序	
if($ascdata){
	// var_dump($ascdata);
for($k = count($ascdata)-1;$k>=0;$k--){
		if($k == count($ascdata)-1){
			$lnum = $ascdata[$k]['id'];
		}
		if($k == 0){
			$fnum = $ascdata[$k]['id']; 
		}
		if($ascdata[$k]['id'] != null){
			array_push($data,$ascdata[$k]);
		}
}
// var_dump($where);
}
else{
$where=" where id <= " . $lnum;
//数据库
$results= $db->query("select * from sambalog"  . $where .  $filterweb . "order by id desc limit 10"); //倒序
$data= array();
$i = 0; 
while ($res= $results->fetchArray(1))
{
	//insert row into array
	if ($i==0){
		$lnum = $res['id'];
	}
	$fnum = $res['id']; 
	$i++;
	array_push($data, $res);
}

}
}
			else if($lnum == $count){
				$where=" where id <= " . $count;
				//数据库
		$results= $db->query("select * from sambalog"  . $where .  $filterweb . "order by id desc limit 10"); //倒序
		$data= array();
		$i = 0; 
		while ($res= $results->fetchArray(1))
		{
			
			//insert row into array
			if ($i==0){
				$lnum = $res['id'];
			}
			$fnum = $res['id']; 
			$i++;
			array_push($data, $res);
		}
			}

//
		}
		//第一次渲染
		else if($direct=="init"){
			$where=" where id <= " . $count;
			
			// var_dump($filterweb);
		//数据库
		$results= $db->query("select * from sambalog"  . $where .  $filterweb . "order by id desc limit 10"); //倒序
		$data= array();
		$i = 0; 
		while ($res= $results->fetchArray(1))
		{
			
			//insert row into array
			if ($i==0){
				$lnum = $res['id'];
			}
			$fnum = $res['id']; 
			$i++;
			array_push($data, $res);
		}
	}
		//最后一页
		else if($direct=="last"){
			$where=" where id >= 1 ";
			//过滤情况，总数用过滤后的
			if($aftercount && $aftercount != 0){
				$limitcount=$aftercount % 10;
			}
			else{
				$limitcount=$count % 10;
			}
			if($limitcount == 0){
				$limitcount = 10;
			}
	
//数据库（正序）
$results1= $db->query("select * from sambalog"  . $where .  $filterweb . "order by id asc limit " . $limitcount);  //正序
$data= array();
$ascdata = array();
$k = 0; 
	while ($res= $results1->fetchArray(1))
	{
		if ($i==0){
			$lnum = $res['id'];
		}
		$fnum = $res['id']; 
		$i++;
		array_push($ascdata, $res);
	}
//遍历倒序	
if($ascdata){
	for($k = count($ascdata)-1;$k>=0;$k--){
			if($k == count($ascdata)-1){
				$lnum = $ascdata[$k]['id'];
			}
			if($k == 0){
				$fnum = $ascdata[$k]['id']; 
			}
			if($ascdata[$k]['id'] != null){
				array_push($data,$ascdata[$k]);
			}
	}
}
else{
	array_push($data, $res);
	if($data[0]==false){
		$data=array();
	}
}

}

	if($filterweb != " "){
		$count = $aftercount;
		if($count==0){
			$fnum=0;
			$lnum=0;
		}
	
	}

//拼接总数和id号
		$info= array('count' => $count,'fnum'=> $fnum,'lnum' => $lnum);	
		//返回json对象
		show_json($data,true,$info);
}

    
   
    
    public function export() {
    	
			$db = new SQLite3('/var/spool/antivirus/log.db');
			if ($db)
			{
				$results= $db->query("select * from sambalog");	
			}
			else
			{
				return;
			}
			
			system("/sbin/sqlite3 -header -csv /var/spool/antivirus/log.db 'select * from sambalog;' > /tmp/sambalog.txt");
			
			header('Content-type: text/csv; charset=utf-8');
			header("Content-Disposition: attachment; filename=sambalog.txt");
			
			$fp = fopen("/tmp/sambalog.txt", "rb");
			fseek($fp, $start);
			while (!feof($fp)) {
				print (fread($fp, 1024 * 8)); //����ļ�  
				flush(); 
				ob_flush();
			}  
			fclose($fp);
			unlink("/tmp/sambalog.txt");

    }
}
