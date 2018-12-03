var type = $.GetQueryString("type"); //获取那个页面
var number = $.GetQueryString("number"); //获取查询号码
var trade_date = $.GetQueryString("trade_date"); //时间
var last_date = $.GetQueryString("last_date"); //时间
var url = "";
var url2 = "";
$(function () {
  //1是客户2是关联3是实控
  if (type == 1) {
    //监管
    url = 'http://172.52.29.100:10001/dce/client_info/cli_daily_self_alarm?client_id=' + number + '&trade_date=' + trade_date + '&last_date=' + last_date;
    //预测
    url2 = 'http://172.52.29.100:10001/dce/client_info/cli_daily_predict_alarm?client_id=' + number + '&trade_date=' + trade_date + '&last_date=' + last_date;
    wgjy(url);
    ycjg(url2);
  } else if (type == 2) {
    //预测
    url2 = 'http://172.52.29.100:10003/dce/rela_info/rela_daily_predict_alarm?group_id=' + number + '&trade_date=' + trade_date + '&last_date=' + last_date;
    $("#container").hide();
    ycjg(url2);
  } else if (type == 3) {
    //监管
    url = 'http://172.52.29.100:10002/dce/group_info/grp_daily_self_alarm?group_id=' + number + '&trade_date=' + trade_date + '&last_date=' + last_date;
    //预测
    url2 = 'http://172.52.29.100:10002/dce/group_info/grp_daily_predict_alarm?group_id=' + number + '&trade_date=' + trade_date + '&last_date=' + last_date;
    wgjy(url);
    ycjg(url2);
  }

})

//违规交易(监管记录)
function wgjy(url) {
  var par = {
    client_id: number,
    trade_date: '20160520'
  };
  $.ajaxGet(url, function (d) {
    if (d.message == 'success') {
      var data = [];
      var xAxis = [];
      var name = "";
      if (d.result.length > 0) {
        $.each(d.result, function (i, item) {
          xAxis.push(item.trade_date);
          if (item.alarm_type.length > 0) {
            $.each(item.alarm_type, function (a, index) {
              name += index + "  ";
            })
          }
          data.push([
            item.trade_date,
            1,
            name
          ]);
          name = "";
        });
      }
      //违规交易
      var dom = document.getElementById("container");
      var myChart = echarts.init(dom);
      option = {
        backgroundColor: '#fff',
        title: {
          text: '监管记录',
          textStyle: {
            fontSize: 16,
          }
        },
        tooltip: {
          /*返回需要的信息*/
          formatter: function (param) {
            var value = param.value;
            return '<div style="border-bottom: 1px solid rgba(255,255,255,.3); font-size: 16px;padding-bottom: 7px;margin-bottom: 7px;"> ' + value[2] + '(' + value[0] + ')' +
              '</div>';
          }
        },
        xAxis: {
          data: xAxis,
          axisLabel: {
            interval: 0,
            // rotate: -50
          },
        },
        yAxis: {
          splitArea: {
            show: false
          }
        },
        series: [{
          name: '',
          data: data,
          type: 'scatter',
          symbolSize: 20
        }]
      };
      myChart.setOption(option, true);
    }
  });
}

//违规交易(预测结果)
function ycjg(url2) {
  var par = {
    client_id: number,
    trade_date: '20160520'
  };
  $.ajaxGet(url2, function (d) {
    if (d.message == 'success') {
      var data = [];
      var xAxis = [];
      var name = "";
      if (d.result.length > 0) {
        $.each(d.result, function (i, item) {
          xAxis.push(item.trade_date);
          if (item.alarm_type.length > 0) {
            $.each(item.alarm_type, function (a, index) {
              name += index + "  ";
            })
          }
          data.push([
            item.trade_date,
            1,
            name
          ]);
          name = "";
        });
      }
      //违规交易
      var dom = document.getElementById("container2");
      var myChart = echarts.init(dom);
      option = {
        backgroundColor: '#fff',
        title: {
          text: '预测结果',
          textStyle: {
            fontSize: 16,
          }
        },
        tooltip: {
          /*返回需要的信息*/
          formatter: function (param) {
            var value = param.value;
            return '<div style="border-bottom: 1px solid rgba(255,255,255,.3); font-size: 16px;padding-bottom: 7px;margin-bottom: 7px;"> ' + value[2] + '(' + value[0] + ')' +
              '</div>';
          }
        },
        xAxis: {
          data: xAxis,
          axisLabel: {
            interval: 0,
            // rotate: -50
          },
        },
        yAxis: {
          splitArea: {
            show: false
          }
        },
        series: [{
          name: '',
          data: data,
          type: 'scatter',
          symbolSize: 20
        }]
      };
      myChart.setOption(option, true);
    }
  });
}