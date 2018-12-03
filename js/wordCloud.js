var type = $.GetQueryString("type"); //获取那个页面
var number = $.GetQueryString("number"); //获取查询号码
var trade_date = $.GetQueryString("trade_date"); //获取时间
$(function () {
  if (type == 1) {
    khcloud();
  } else if (type == 2) {
    glcloud();
  } else if (type == 3) {
    skcloud();
  }
})


//客户词云
function khcloud() {
  var url = 'http://172.52.29.100:10001/dce/client_info/cli_cloud_label?client_id=' + number + '&trade_date=' + trade_date;
  $.ajaxGet(url, function (data) {
    if (data.message == 'success') {
      var html = [];
      if (data.result.length > 0) {
        $.each(data.result, function (i, index) {
          html.push({
            name: index,
            value: 100000,
            textStyle: {
              normal: {
                color: '#23a393'
              },
              emphasis: {
                color: '#20716a'
              }
            }
          });
        })
      }
      var chart = echarts.init(document.getElementById('main'));
      var option = {
        tooltip: {},
        series: [{
          type: 'wordCloud',
          gridSize: 2,
          sizeRange: [12, 50],
          rotationRange: [-90, 90],
          shape: 'pentagon',
          width: 1000,
          height: 700,
          drawOutOfBound: true,
          textStyle: {
            normal: {
              color: function () {
                return 'rgb(' + [
                  Math.round(Math.random() * 160),
                  Math.round(Math.random() * 160),
                  Math.round(Math.random() * 160)
                ].join(',') + ')';
              }
            },
            emphasis: {
              shadowBlur: 10,
              shadowColor: '#333'
            }
          },
          data: html
        }]
      };

      chart.setOption(option);
      window.onresize = chart.resize;
    }
  });
}
//关联词云
function glcloud() {
  var url = 'http://172.52.29.100:10003/dce/rela_info/rela_cloud_label?group_id=' + number + '&trade_date=' + trade_date;
  $.ajaxGet(url, function (data) {
    if (data.message == 'success') {
      var html = [];
      if (data.result.length > 0) {
        $.each(data.result, function (i, index) {
          html.push({
            name: index,
            value: 1000,
            textStyle: {
              normal: {
                color: '#ff8f56'
              },
              emphasis: {
                color: '#ff5959'
              }
            }
          });
        })
      }
      var chart = echarts.init(document.getElementById('main'));
      var option = {
        tooltip: {},
        series: [{
          type: 'wordCloud',
          gridSize: 2,
          sizeRange: [12, 50],
          rotationRange: [-90, 90],
          shape: 'pentagon',
          width: 1000,
          height: 700,
          drawOutOfBound: true,
          textStyle: {
            normal: {
              color: function () {
                return 'rgb(' + [
                  Math.round(Math.random() * 160),
                  Math.round(Math.random() * 160),
                  Math.round(Math.random() * 160)
                ].join(',') + ')';
              }
            },
            emphasis: {
              shadowBlur: 10,
              shadowColor: '#333'
            }
          },
          data: html
        }]
      };

      chart.setOption(option);
      window.onresize = chart.resize;
    }
  });
}
//实控词云
function skcloud() {
  var url = 'http://172.52.29.100:10002/dce/group_info/grp_cloud_label?group_id=' + number + '&trade_date=' + trade_date;
  $.ajaxGet(url, function (data) {
    if (data.message == 'success') {
      var html = [];
      if (data.result.length > 0) {
        $.each(data.result, function (i, index) {
          html.push({
            name: index,
            value: '1000',
            textStyle: {
              normal: {
                color: '#add2c9'
              },
              emphasis: {
                color: '#5ea3a3'
              }
            }
          });
        })
      }
      var chart = echarts.init(document.getElementById('main'));
      var option = {
        tooltip: {},
        series: [{
          type: 'wordCloud',
          gridSize: 2,
          sizeRange: [12, 50],
          rotationRange: [-90, 90],
          shape: 'pentagon',
          width: 1000,
          height: 700,
          drawOutOfBound: true,
          textStyle: {
            normal: {
              color: function () {
                return 'rgb(' + [
                  Math.round(Math.random() * 160),
                  Math.round(Math.random() * 160),
                  Math.round(Math.random() * 160)
                ].join(',') + ')';
              }
            },
            emphasis: {
              shadowBlur: 10,
              shadowColor: '#333'
            }
          },
          data: html
        }]
      };

      chart.setOption(option);
      window.onresize = chart.resize;
    }
  });
}