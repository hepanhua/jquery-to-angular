<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" scroll="no" style="width:100%;height:100%;">
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
	<meta name="renderer" content="webkit">
	<title><?php echo $L['ui_explorer'];?></title>
	<link rel="Shortcut Icon" href="<?php echo STATIC_PATH;?>images/favicon.ico">
	<link href="<?php echo STATIC_PATH;?>js/lib/picasa/style/style.css?ver=<?php echo SECROS_VERSION;?>" rel="stylesheet"/>
	<link href="<?php echo STATIC_PATH;?>style/bootstrap.css?ver=<?php echo SECROS_VERSION;?>" rel="stylesheet"/>
	<link rel="stylesheet" href="./static/style/font-awesome/css/font-awesome.css">
	<link href="<?php echo STATIC_PATH;?>style/skin/<?php echo $config['user']['theme'];?>app_setting.css?ver=<?php echo SECROS_VERSION;?>" rel="stylesheet" id='link_css_list'/>
</head>
<body>
<div style="width:100%;height:100%;display:flex;justify-content: center;align-items: center;flex-direction: column;">
<input id=upgradefile_id   type=file size=32 style="display:none">
<div style="display:flex;align-items: center;width:320px;margin-bottom: 36px;">
<div class="upload_file_btn" id="upload_file_btn_click">上传</div>
<div class="select_file_name"><p class="select_file_nametext" style="margin:0;white-space: nowrap; text-overflow: ellipsis; overflow: hidden;text-indent: 16px;"></p> </div>
</div>

<div style="display:flex;flex-direction:column;justify-content:center;align-items:flex-start;color:red;font-size:16px;">
<div>注意：</div>
<div>设备升级时请拔出所有USB设备</div>
<div>以免造成升级失败！</div>
</div>


<div class="upload_file_btn btn_no_drop" id="upload_file_btn_post" style="position: absolute;bottom: 24px;">确认</div>
</div>

<div style="position: fixed;top:0;left:0;wdith:100%;height:100%;z-index:1001;background:red"></div>
</body>
</html>
<script src="<?php echo STATIC_PATH;?>js/lib/jquery-1.8.0.min.js?ver=<?php echo SECROS_VERSION;?>"></script>
<script type="text/javascript">
var upsever = null;
var  progresswidth = 0;
var LENGTH = 1024 * 1024 * 2;//每次上传的大小 
$(document).on("click",'#upload_file_btn_click',function(e){
	document.getElementById("upgradefile_id").click();
});

$(document).on("change",'#upgradefile_id',function(e){
	let ls = e.currentTarget.files[0].name;
	if(ls){
		$('#upload_file_btn_post').removeClass('btn_no_drop');
		$('.select_file_nametext').text(e.currentTarget.files[0].name);
	}else{
		$('#upload_file_btn_post').addClass('btn_no_drop');
		$('.select_file_nametext').text('');
	}
});

$(document).on("click",'#upload_file_btn_post',function(e){
let ck = $('.select_file_nametext').text();
if(!ck){
	return;
}

if(($('#upgradefile_id')[0].files[0].size / 1024 /1024).toFixed(0)>200){
alert('非法文件');
return false;
}


//start
      
      var file = $('#upgradefile_id')[0].files[0];//文件对象 
      var filename=$('#upgradefile_id')[0].files[0].name; 
      var totalSize = file.size;//文件总大小 
      var start = 0;//每次上传的开始字节 
      var end = start + LENGTH;//每次上传的结尾字节 
      var fd = null//创建表单数据对象 
      var blob = null;//二进制对象 
      var xhr = null;//xhr对象 
  
        fd = new FormData();
		xhr = new XMLHttpRequest();
        xhr.open('POST','index.php?user/downloadfile',false); 
        blob = file.slice(start,end);//根据长度截取每次需要上传的数据 
        fd.append('upgradefile',blob); 
		fd.append('filename',filename);  

		$('.updatedom #update_text', window.parent.document).text("正在上传中，请勿切断电源");
		$('.updatedom', window.parent.document).removeClass('hidden');
		fd.append('first',true); 

		progresswidth = Math.floor( start / totalSize * 100);
        if (progresswidth < 100) {
			progresswidth += 1;
            $('.updatedom #update_progress_bar', window.parent.document).css('width', progresswidth + '%');
            $('.updatedom #update_progress_value', window.parent.document).text(progresswidth + '%');
		}

		if(start + LENGTH >= totalSize){
			fd.append('end',true); 
		}
		start = end; 
  end = start + LENGTH; 
		responseget(xhr,start,end,file,filename,totalSize);
  xhr.send(fd);

});


function responseget(xhr,start,end,file,filename,totalSize){
	//返回
	xhr.onreadystatechange = function() {
		setTimeout(() => {
              if(xhr.status == 200) {
            	  let responseText = xhr.responseText;//返回结果
				  let obj = JSON.parse(responseText); 
				  if(obj.data == 400){
					$('.updatedom', window.parent.document).addClass('hidden');
			alert('上传文件失败');
		clearInterval(upsever);
		upsever = null;
				  }
				  if(obj.data == 201){
					  if(start < totalSize){
		let fd = new FormData();
		let xhrb = new XMLHttpRequest();
        xhrb.open('POST','index.php?user/downloadfile',false); 
        let blob = file.slice(start,end);//根据长度截取每次需要上传的数据 
        fd.append('upgradefile',blob); 
		fd.append('filename',filename);  
		progresswidth = Math.floor( start / totalSize * 100);
        if (progresswidth < 100) {
            $('.updatedom #update_progress_bar', window.parent.document).css('width', progresswidth + '%');
            $('.updatedom #update_progress_value', window.parent.document).text(progresswidth + '%');
		}
	if(start + LENGTH >= totalSize){
			fd.append('end',true); 
		}
  start = end; 
  end = start + LENGTH; 
		responseget(xhrb,start,end,file,filename,totalSize);
		xhrb.send(fd);
		}
				  }
				  if(obj.data == 200){
					startck(filename);
					progresswidth = 100;
					$('.updatedom #update_progress_bar', window.parent.document).css('width', progresswidth + '%');
                                $('.updatedom #update_progress_value', window.parent.document).text(progresswidth + '%');
			setTimeout(() => {
				progresswidth = 0;
		  if(!upsever){
			upsever = setInterval(() => {
				if(progresswidth + 3 < 99){
					$('.updatedom #update_text', window.parent.document).text("正在升级中，请勿切断电源");
					progresswidth += 3;
				$('.updatedom #update_progress_bar', window.parent.document).css('width', progresswidth + '%');
                $('.updatedom #update_progress_value', window.parent.document).text(progresswidth + '%');
				}
			},1000);
		  }
				upgradeCheck();
			}, 1000); 
				  }
			  } 
		},500);
			
			}
   //end
}
function startck(e){
	$.ajax({
url: "index.php?user/startck&filename="+e,
dataType:'json',
type:'GET',
success: function(t){
}
});
}

function upgradeCheck(){
	$.ajax({
url: "cgi-bin/upgrade_check.cgi",
dataType:'json',
type:'GET',
success: function(t) {
	if(t.code == 201){
		setTimeout(() => {
			upgradeCheck();
		}, 3000);
	}

	if(t.code == 200){
		clearInterval(upsever);
		upsever = null;
                        $('.updatedom #update_progress_bar', window.parent.document).css('width', '100%');
                                $('.updatedom #update_progress_value', window.parent.document).text('100%');
                setTimeout(() => {
					alert('升级成功,请重启设备后生效');
                 $('.updatedom',window.parent.document).addClass('hidden');
                 $('.aui_close',window.parent.document)[0].click();
				}, 1000); 
		}
				
	                  if (t.code == 400) {
						alert(t.msg);
						clearInterval(upsever);
		upsever = null;
						$('.updatedom', window.parent.document).addClass('hidden');
						progresswidth = 0;
                    }
}
});
}
</script>