// window.onload=function(){
// // console.log('==========');
// }

var toolsPing=document.getElementById("toolsPing");
var toolsTraceroute=document.getElementById("toolsTraceroute");
var toolsDownload=document.getElementById("toolsDownload");
var toolsNav=document.getElementById("toolsNav");
var toolsSpeedView=document.getElementById("toolsSpeedView");

var spvechart = echarts.init(document.getElementById('graphSpeedView'));
var getbit = [];
var sendbit = [];
var dsqtime = null;
var optionvv = '';
var sendbitvalue= [];
var getbitvalue= [];
var sendkbvalue= [];
var getkbvalue= [];
var sendmbvalue= [];
var getmbvalue= [];
var speed = 'B/S';
var oldget = null;
var oldsend = null;

function toolsDownloadInit(e){
    toolsDownload.classList.remove('hidden');
    toolsTraceroute.classList.add("hidden");
    toolsPing.classList.add("hidden");
    toolsSpeedView.classList.add("hidden");
    if(toolsNav.getElementsByClassName("this")[0]){
        toolsNav.getElementsByClassName("this")[0].classList.remove("this");
        e.classList.add("this");
           }
  
    }
    function toolsPingInit(e){
        toolsPing.classList.remove('hidden');
        toolsTraceroute.classList.add("hidden");
        toolsDownload.classList.add("hidden");
        toolsSpeedView.classList.add("hidden");
        if(toolsNav.getElementsByClassName("this")[0]){
            toolsNav.getElementsByClassName("this")[0].classList.remove("this");
            e.classList.add("this");
               }
               
        }
        function toolsTracerouteInit(e){
            toolsTraceroute.classList.remove('hidden');
           toolsDownload.classList.add("hidden");
            toolsPing.classList.add("hidden");
            toolsSpeedView.classList.add("hidden");
            if(toolsNav.getElementsByClassName("this")[0]){
                toolsNav.getElementsByClassName("this")[0].classList.remove("this");
                e.classList.add("this");
                   }
            }
            
            function toolsSpeedViewInit(e){
              toolsTraceroute.classList.add('hidden');
              toolsDownload.classList.add("hidden");
               toolsPing.classList.add("hidden");
               toolsSpeedView.classList.remove("hidden");
               if(toolsNav.getElementsByClassName("this")[0]){
                toolsNav.getElementsByClassName("this")[0].classList.remove("this");
                e.classList.add("this");
                   }
               SpeedViewEachartinit();
            }

function SpeedViewEachartinit(){
var lineX = [];
 //x轴的值 （时间）
for (let k = 0; k <= 15; k++) {
lineX.push(k*3);
}


optionvv = {
    legend: {
        textStyle: {
            fontSize: 12,
            color: 'rgb(39,166,144)'
        },
        bottom:0,
        right: '4%',
        data: ['发送', '接收']
    },
    grid: {
        width: '80%',
        height: '65%',
        left: '10%',
        bottom: '12%',
        containLabel: true,
    },
    xAxis: {
        name: '时间',
        type: 'category',
        color: "red",
        boundaryGap: false,
        data: lineX,
        axisLine: {  //坐标轴轴线相关设置
            lineStyle: {
                color: '#000'
            }
        },
        axisLabel: {   //刻度标签
            show: false,
            textStyle: {
                color: 'rgb(39,166,144)'
            }
        },
        splitLine: {    //分隔线
            show: true,  //显示

            lineStyle: {
                color: ['rgba(0,0,0,.1)'],
                type: 'dashed' //虚线
            }
        },
        nameTextStyle: {
            color: 'rgb(39,166,144)',
            padding: [10, 0, 0, 0]
        },
        nameGap: 15  //横轴name与标签距离
    },
    yAxis: {
        name: '流量 ( '+ speed +' )',
        type: 'value',
        axisLine: {  //坐标轴轴线相关设置
            lineStyle: {
                color: '#000'
            }
        },
        axisLabel: {
            formatter: '{value}',
            textStyle: {
                color: 'rgb(39,166,144)'
            }
        },
        splitLine: {    //分隔线
            show: true,  //显示

            lineStyle: {
                color: ['rgba(0,0,0,.1)'],
                type: 'dashed' //虚线
            }
        },
        nameTextStyle: {
            color: 'rgb(39,166,144)'
        }
    },
    series: [
        {
            name: "发送",
            type: 'line',
            color: 'rgba(108,177,68,1)',
            smooth: true,  //曲线   [0,1]  越小越接近直线
            // label:{ //显示坐标值
            // show:true
            // },
            areaStyle: {
                normal: {
                    color: {
                        type: 'linear',
                        x: 0,
                        y: 0,
                        x2: 0,
                        y2: 1,
                        colorStops: [{
                            offset: 0, color: 'rgba(108,177,68,1)' // 0% 处的颜色
                        }, {
                            offset: 0.5, color: 'rgba(108,177,68,0.5)' // 100% 处的颜色
                        }, {
                            offset: 1, color: 'rgba(0,0,0,0.1)' // 100% 处的颜色
                        }],
                        globalCoord: false // 缺省为 false
                    },
                    shadowColor: 'rgba(0, 0, 0, 0.1)',
                    shadowBlur: 10
                }
            },
            symbol: 'circle',
            symbolSize: 5,
            data: sendbit
        },
        {
            name: "接收",
            type: 'line',
            color: 'rgba(231, 35, 16,1)',
            smooth: true,
            areaStyle: {
                normal: {
                    color: {
                        type: 'linear',
                        x: 0,
                        y: 0,
                        x2: 0,
                        y2: 1,
                        colorStops: [{
                            offset: 0, color: 'rgba(231, 35, 16,1)' // 0% 处的颜色
                        }, {
                            offset: 0.5, color: 'rgba(231, 35, 16,0.5)' // 100% 处的颜色
                        }, {
                            offset: 1, color: 'rgba(0,0,0,0.1)' // 100% 处的颜色
                        }],
                        globalCoord: false // 缺省为 false
                    },
                    shadowColor: 'rgba(0, 0, 0, 0.1)',
                    shadowBlur: 10
                }
            },
            symbol: 'circle',
            symbolSize: 5,
            data: getbit
        }
    ]
};
spvechart.setOption(optionvv,true);
serverget();
// if(!dsqtime){
//   dsqtime = setInterval(function (){
//     $.ajax({
//  type : "get",
//  async : true, 
//  url : "/cgi-bin/getifspeed.cgi",
//  data : {},
//  dataType : "json",        //返回数据形式为json
//  success : function(res) {
// var newgetbit = 0;
// var newsendbit = 0;

// if(oldget == null){
//     oldget = res.data.rxbytes;
//     oldsend = res.data.txbytes;
//  }else{
//     // if(sendbitvalue.length == 0){
//         newsendbit = res.data.txbytes - oldsend;
//         newgetbit =  res.data.rxbytes - oldget;
//     //  }
//     // if(sendbitvalue.length > 0){
//     //     newsendbit = res.data.txbytes - sentbitarray[sentbitarray.length-1];
//     //     newgetbit =  res.data.rxbytes - getbitarray[getbitarray.length-1];
//     //  }
//     if (sendbitvalue.length > 15) {
//         // sentbitarray.splice(0, 1);//删掉第一个
//         // getbitarray.splice(0, 1);//删掉第一个
// //速率
//        sendbitvalue.splice(0, 1);//删掉第一个
//         getbitvalue.splice(0, 1);//删掉第一个
//         sendkbvalue.splice(0, 1);//删掉第一个
//          getkbvalue.splice(0, 1);//删掉第一个
//         sendmbvalue.splice(0, 1);//删掉第一个
//          getmbvalue.splice(0, 1);//删掉第一个
//     }
//     var kbsent = Math.ceil(newsendbit / 1024);
//     var kbrevice = Math.ceil(newgetbit / 1024);
//     var mbsent = Math.ceil((newsendbit / 1048576) * 10) / 10;
//     var mbrevice = Math.ceil((newgetbit / 1048576) * 10) / 10;

//                 if (mbsent == 0.1) {
//                     mbsent = Math.ceil((newsendbit / 1048576) * 100) / 100;
//                     if (mbsent == 0.01) {
//                         mbsent = Math.ceil((newsendbit / 1048576) * 1000) / 1000;
//                     }
//                 }
//                 if (mbrevice == 0.1) {
//                     mbrevice = Math.ceil((newgetbit / 1048576) * 100) / 100;
//                     if (mbrevice == 0.01) {
//                         mbrevice = Math.ceil((newgetbit / 1048576) * 1000) / 1000;
//                     }
//                 }

//                 // getbitarray.push(res.data.rxbytes);
//                 // sentbitarray.push(res.data.txbytes);             
//                 sendbitvalue.push(newsendbit); //发送
//                 getbitvalue.push(newgetbit);//接收
//                 sendkbvalue.push(kbsent); //发送
//                 getkbvalue.push(kbrevice);//接收
//                 sendmbvalue.push(mbsent); //发送
//                 getmbvalue.push(mbrevice);//接收

//                 getbit=getbitvalue;
//                 sendbit=sendbitvalue;

//                 speed = 'B/S';
//                 if (newsendbit > 1024 || newgetbit > 1024) { //大于1kb 用kb为单位
//                     speed = 'KB/S';
//                     getbit=getkbvalue;
//                     sendbit=sendkbvalue;
//                     if (newsendbit > 1048576 || newgetbit > 1048576) {//大于1mb，用mb为单位
//                         speed = 'MB/S';
//                         getbit=getmbvalue;
//                         sendbit=sendmbvalue;
//                     }
//                 }
//     spvechart.setOption({
//         yAxis:{name: '流量 ( '+ speed +' )'},
//         series:[{data:sendbit},{data:getbit}]
//     });
//    var textv ='发送：' + sendbit[sendbit.length - 1] + speed;
//    var textvv = '接收：' + getbit[getbit.length - 1] + speed;
// $('#Speedviewtext').text(textv);
// $('#Speedviewtextb').text(textvv);
//  }
//  oldget = res.data.rxbytes;
//  oldsend = res.data.txbytes;


//     }
//      });
//     },1000);
// }

}

function serverget(){
  $.ajax({
    type : "get",
    async : true, 
    url : "/cgi-bin/getifspeed.cgi",
    data : {},
    dataType : "json",        //返回数据形式为json
    success : function(res) {
   var newgetbit = 0;
   var newsendbit = 0;
   
   if(oldget == null){
       oldget = res.data.rxbytes;
       oldsend = res.data.txbytes;
    }else{
       // if(sendbitvalue.length == 0){
           newsendbit = res.data.txbytes - oldsend;
           newgetbit =  res.data.rxbytes - oldget;
       //  }
       // if(sendbitvalue.length > 0){
       //     newsendbit = res.data.txbytes - sentbitarray[sentbitarray.length-1];
       //     newgetbit =  res.data.rxbytes - getbitarray[getbitarray.length-1];
       //  }
       if (sendbitvalue.length > 15) {
           // sentbitarray.splice(0, 1);//删掉第一个
           // getbitarray.splice(0, 1);//删掉第一个
   //速率
          sendbitvalue.splice(0, 1);//删掉第一个
           getbitvalue.splice(0, 1);//删掉第一个
           sendkbvalue.splice(0, 1);//删掉第一个
            getkbvalue.splice(0, 1);//删掉第一个
           sendmbvalue.splice(0, 1);//删掉第一个
            getmbvalue.splice(0, 1);//删掉第一个
       }
       var kbsent = Math.ceil(newsendbit / 1024);
       var kbrevice = Math.ceil(newgetbit / 1024);
       var mbsent = Math.ceil((newsendbit / 1048576) * 10) / 10;
       var mbrevice = Math.ceil((newgetbit / 1048576) * 10) / 10;
   
                   if (mbsent == 0.1) {
                       mbsent = Math.ceil((newsendbit / 1048576) * 100) / 100;
                       if (mbsent == 0.01) {
                           mbsent = Math.ceil((newsendbit / 1048576) * 1000) / 1000;
                       }
                   }
                   if (mbrevice == 0.1) {
                       mbrevice = Math.ceil((newgetbit / 1048576) * 100) / 100;
                       if (mbrevice == 0.01) {
                           mbrevice = Math.ceil((newgetbit / 1048576) * 1000) / 1000;
                       }
                   }
   
                   // getbitarray.push(res.data.rxbytes);
                   // sentbitarray.push(res.data.txbytes);             
                   sendbitvalue.push(newsendbit); //发送
                   getbitvalue.push(newgetbit);//接收
                   sendkbvalue.push(kbsent); //发送
                   getkbvalue.push(kbrevice);//接收
                   sendmbvalue.push(mbsent); //发送
                   getmbvalue.push(mbrevice);//接收
   
                   getbit=getbitvalue;
                   sendbit=sendbitvalue;
   
                   speed = 'B/S';
                   if (newsendbit > 1024 || newgetbit > 1024) { //大于1kb 用kb为单位
                       speed = 'KB/S';
                       getbit=getkbvalue;
                       sendbit=sendkbvalue;
                       if (newsendbit > 1048576 || newgetbit > 1048576) {//大于1mb，用mb为单位
                           speed = 'MB/S';
                           getbit=getmbvalue;
                           sendbit=sendmbvalue;
                       }
                   }
       spvechart.setOption({
           yAxis:{name: '流量 ( '+ speed +' )'},
           series:[{data:sendbit},{data:getbit}]
       });
      var textv ='发送：' + sendbit[sendbit.length - 1] + speed;
      var textvv = '接收：' + getbit[getbit.length - 1] + speed;
   $('#Speedviewtext').text(textv);
   $('#Speedviewtextb').text(textvv);
    }
    oldget = res.data.rxbytes;
    oldsend = res.data.txbytes;
   
   setTimeout(() => {
    serverget();
   }, 1000); 
   console.log('running');
       }
        });
}

function  SpeedViewclose(){
  $('.speed_view_frame').attr("style","display:none");
  clearInterval(dsqtime);
  getbit = [];
  sendbit = [];
  dsqtime = null;
  optionvv = '';
  sendbitvalue= [];
  getbitvalue= [];
  sendkbvalue= [];
  getkbvalue= [];
  sendmbvalue= [];
  getmbvalue= [];
  speed = 'B/S';
  oldget = null;
  oldsend = null;
$('#Speedviewtext').text("");
$('#Speedviewtextb').text("");
}

// $(window).unload(function(){
//   clearInterval(dsqtime);
// }); 


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