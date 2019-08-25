// window.onload=function(){
// // console.log('==========');
// }

var toolsPing=document.getElementById("toolsPing");
var toolsTraceroute=document.getElementById("toolsTraceroute");
var toolsDownload=document.getElementById("toolsDownload");
var toolsNav=document.getElementById("toolsNav");
function toolsDownloadInit(e){
    toolsDownload.classList.remove('hidden');
    toolsTraceroute.classList.add("hidden");
    toolsPing.classList.add("hidden");
    if(toolsNav.getElementsByClassName("this")[0]){
        toolsNav.getElementsByClassName("this")[0].classList.remove("this");
        e.classList.add("this");
           }
  
    }
    function toolsPingInit(e){
        toolsPing.classList.remove('hidden');
        toolsTraceroute.classList.add("hidden");
        toolsDownload.classList.add("hidden");
        if(toolsNav.getElementsByClassName("this")[0]){
            toolsNav.getElementsByClassName("this")[0].classList.remove("this");
            e.classList.add("this");
               }
               
        }
        function toolsTracerouteInit(e){
            toolsTraceroute.classList.remove('hidden');
           toolsDownload.classList.add("hidden");
            toolsPing.classList.add("hidden");
            if(toolsNav.getElementsByClassName("this")[0]){
                toolsNav.getElementsByClassName("this")[0].classList.remove("this");
                e.classList.add("this");
                   }
            }          


  function tracerouteStart(){
    var tracerouteip=document.getElementById("tracerouteip");
    // console.log(tracerouteip.value);
    $.ajax({
      url:'/index.php?tools/traceroute&tracerouteip='+tracerouteip.value,
      dataType:'text',
      timeout:15000, //超时时间
      beforeSend:function(XMLHttpRequest){ 
      $("#loading").html("<img src='/static/images/lazy.gif' />"); //在后台返回
      },
			success:function(data){
        $("#loading").html("");
        document.getElementById('tracerouteResult').innerText=data;
      },
      error:function(result){
        console.log('erroe');
        console.log(result);
    }
		});
  }
  function pingStart(){
   

    var pingsize=document.getElementById("pingsize");
    var pingcount=document.getElementById("pingcount");
    var pingip=document.getElementById("pingip");
    $.ajax({
      url:'/index.php?tools/ping&pingsize='+pingsize.value+'&pingcount=' + pingcount.value+ '&pingip='+pingip.value,
      dataType:'text',
      timeout:15000, //超时时间
beforeSend:function(XMLHttpRequest){ 
$("#loadingping").html("<img src='/static/images/lazy.gif' />"); //在后台返回
},
			success:function(data){
        $("#loadingping").html("");
        document.getElementById('pingResult').innerText=data;
			}
		});
  }