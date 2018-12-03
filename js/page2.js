var number = $.GetQueryString("number"); //获取查询号码
var last_date = '20160420';
var trade_date = '20160520';
$(function () {
  $("#month_start").html("2018-11-20").text("2018-11-20");
  calendar();
  init();
  cjl();
  wtl();
  ccl();
})

function calendar() {
  $("#month_start").showCalendar({
    className: 'startDate'
  });
  $("#month_stop").showCalendar({
    className: 'endDate'
  });
}

function init() {
  $.ajaxGet('http://172.52.29.100:10000/dce/home_info/trade_date_query', function (data) {
    if (data.code == '0') {
      last_date = data.last_date;
      trade_date = data.trade_date;
    }
  });

  //所有品种
  var url = 'http://172.52.29.100:10003/dce/rela_info/rela_daily_type?group_id=' + number + '&trade_date=' + trade_date + '&last_date=' + last_date;
  $.ajaxGet(url, function (data) {
    var name = "";
    var id = "";
    var name2 = "";
    var id2 = "";
    if (data.contract_type_name_match.length > 0) {
      $.each(data.contract_type_name_match, function (i, index) {
        name += ' <option value="' + index + '">' + index + '</option>';
      })
      $("#contract_type_name_match").append(name);
      $("#contract_type_name_match2").append(name);
    }
    if (data.contract_id_match.length > 0) {
      $.each(data.contract_id_match, function (i, index) {
        id += ' <option value="' + index + '">' + index + '</option>';
      })
      $("#contract_id_match").append(id);
      $("#contract_id_match2").append(id);
    }
    if (data.contract_type_name_hold.length > 0) {
      $.each(data.contract_type_name_hold, function (i, index) {
        id2 += ' <option value="' + index + '">' + index + '</option>';
      })
      $("#contract_type_name_hold").append(id2);
    }
    if (data.contract_id_hold.length > 0) {
      $.each(data.contract_id_hold, function (i, index) {
        name2 += ' <option value="' + index + '">' + index + '</option>';
      })
      $("#contract_id_hold").append(name2);
    }
  });

  onechart();
  twochart();
  threechart();
  fourschart();

  username();
}

//用户名排行榜
function username() {
  var url = 'http://172.52.29.100:10003/dce/rela_info/rela_last3m_member_qty?group_id=' + number + '&trade_date=' + trade_date;
  $.ajaxGet(url, function (data) {
    if (data.message == 'success') {
      if (data.result.length > 0) {
        var html = [];
        $.each(data.result, function (i, index) {
          html += '<span>' + index.CLIENT_ID + '   ' + index.CLIENT_NAME + '</span>'
        })
        $("#username").append(html);
        if (data.result.length > 3) {
          $("#more").show();
        }
      }
    }
  });
}

//进一个月交易总情况
function onechart() {
  var url = 'http://172.52.29.100:10003/dce/rela_info/rela_last1m_match_count?group_id=' + number + '&trade_date=' + trade_date;
  $.ajaxGet(url, function (data) {
    if (data.message == 'success') {
      if (data.result.length > 0) {
        var match_qty = 0;
        var trade_date_cnt = 0;
        $.each(data.result, function (i, item) {
          match_qty = item.MATCH_QTY; //交易手数
          trade_date_cnt = item.TRADE_DATE_CNT; //交易天数
        })
      }
      //第一个图标
      // 初始化图表标签
      var myChart = echarts.init(document.getElementById('chart'));
      var url2 = 'http://172.52.29.100:10003/dce/rela_info/rela_last1m_contract_qty?group_id=' + number + '&trade_date=' + trade_date;
      var yAxis = [];
      var data = [];
      $.ajaxGet(url2, function (d) {
        if (d.message == 'success') {
          if (d.result.length > 0) {
            $.each(d.result, function (i, item) {
              yAxis.push(item.CONTRACT_TYPE_NAME); //品种
              data.push(item.MATCH_QTY); //交易量
              var options = {
                //定义一个标题
                title: {
                  text: '近一个月成交品种',
                  subtext: "交易天数" + trade_date_cnt + "    交易手数" + match_qty
                },
                tooltip: {},
                //X轴设置
                xAxis: {
                  type: 'value'
                },
                yAxis: {
                  data: yAxis,
                  axisLabel: {
                    interval: 0,
                    rotate: -30,
                    textStyle: {
                      fontSize: '11',
                    }
                  }
                },
                //name=legend.data的时候才能显示图例
                series: [{
                  name: '交易数量',
                  type: 'bar',
                  data: data,
                  barWidth: 22
                }]
              };
              myChart.setOption(options);
            })
          }
        }
      });
    }
  });
}

//成交量
function twochart(type, id) {
  //第二个图标
  var url = "";
  var title = "";
  if (type == undefined && id) {
    url = 'http://172.52.29.100:10003/dce/rela_info/rela_daily_match_qty?group_id=' + number + '&trade_date=' + trade_date + '&last_date=' + last_date + '&contract_id=' + id;
    title = "合约号:";
  } else if (id == undefined && type) {
    url = 'http://172.52.29.100:10003/dce/rela_info/rela_daily_match_qty?group_id=' + number + '&trade_date=' + trade_date + '&last_date=' + last_date + '&type_id=' + type;
    title = "品种:";
  } else if (id == undefined && type == undefined) {
    url = 'http://172.52.29.100:10003/dce/rela_info/rela_daily_match_qty?group_id=' + number + '&trade_date=' + trade_date + '&last_date=' + last_date;
    title = "全部:";
  } else {
    url = 'http://172.52.29.100:10003/dce/rela_info/rela_daily_match_qty?group_id=' + number + '&trade_date=' + trade_date + '&last_date=' + last_date + '&contract_id=' + id;
    title = "全部:";
  }
  $.ajaxGet(url, function (d) {
    if (d.message == 'success') {
      var dom = document.getElementById("container");
      var myChart2 = echarts.init(dom);
      var name = "";
      var xAxis = [];
      var data = [];
      if (d.result.length > 0) {
        $.each(d.result, function (i, item) {
          xAxis.push(item.TRADE_DATE); //时间
          name = item.TYPE_ID; //品种
          data.push(item.MATCH_QTY);
        })
      }
      option = {
        title: {
          text: title,
          align: 'left',
          left: 20,
          textStyle: {
            fontSize: 14,
          }
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: [name],
          align: 'left',
          left: 60
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        toolbox: {
          feature: {
            saveAsImage: {}
          }
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: xAxis
        },
        yAxis: {
          type: 'value'
        },
        series: [{
          name: name,
          type: 'line',
          stack: '总量',
          data: data
        }]
      };
      myChart2.setOption(option);
    }
  });
}

//日持仓
function threechart(type, id) {
  //第三图标
  var url = "";
  var title = "";
  if (type == undefined && id) {
    url = 'http://172.52.29.100:10003/dce/rela_info/rela_daily_hold_qty?group_id=' + number + '&trade_date=' + trade_date + '&last_date=' + last_date + '&contract_id=' + id;
    title = "合约号:";
  } else if (id == undefined && type) {
    url = 'http://172.52.29.100:10003/dce/rela_info/rela_daily_hold_qty?group_id=' + number + '&trade_date=' + trade_date + '&last_date=' + last_date + '&type_id=' + type;
    title = "品种:";
  } else if (id == undefined && type == undefined) {
    url = 'http://172.52.29.100:10003/dce/rela_info/rela_daily_hold_qty?group_id=' + number + '&trade_date=' + trade_date + '&last_date=' + last_date;
    title = "全部:";
  } else {
    url = 'http://172.52.29.100:10003/dce/rela_info/rela_daily_hold_qty?group_id=' + number + '&trade_date=' + trade_date + '&last_date=' + last_date + '&contract_id=' + id;
    title = "全部:";
  }
  $.ajaxGet(url, function (data) {
    if (data.message == 'success') {
      var dom = document.getElementById("container2");
      var myChart3 = echarts.init(dom);
      var xAxisData = [];
      var id = "";
      var buy = [];
      var sell = [];
      var d = [];
      if (data.result.length > 0) {
        $.each(data.result, function (i, item) {
          xAxisData.push(item.TRADE_DATE);
          id = item.TYPE_ID;
          buy.push(item.HOLD_BUY_QTY);
          sell.push('-' + item.HOLD_SELL_QTY);
        })
      }
      option = {
        backgroundColor: '#fff',
        title: {
          text: title,
          align: 'left',
          left: 50,
          textStyle: {
            fontSize: 14,
          }
        },
        legend: {
          data: [id],
          align: 'left',
          left: 90
        },
        tooltip: {},
        xAxis: {
          data: xAxisData,
          name: 'X Axis',
          axisLabel: {
            interval: 0,
            rotate: -50
          },
        },
        yAxis: {
          // inverse: true,
          splitArea: {
            show: false
          }
        },
        grid: {
          left: 100
        },
        series: [{
            name: id,
            type: 'bar',
            stack: 'one',
            data: buy,
            barWidth: 20,
            itemStyle: {
              normal: {
                color: '#f8d0b0'
              }
            }
          },
          {
            name: id,
            type: 'bar',
            stack: 'one',
            data: sell,
            barWidth: 20,
            itemStyle: {
              normal: {
                color: '#f7aa00'
              }
            }
          }
        ]
      };
      myChart3.on('brushSelected', renderBrushed);
      myChart3.setOption(option, true);
    }
  });
}

//账户盈亏
function fourschart(type, id) {
  //第四个图标
  var url = "";
  var title = "";
  if (type == undefined && id) {
    url = 'http://172.52.29.100:10003/dce/rela_info/rela_daily_hold_profit?group_id=' + number + '&trade_date=' + trade_date + '&last_date=' + last_date + '&contract_id=' + id;
    title = "合约号:";
  } else if (id == undefined && type) {
    url = 'http://172.52.29.100:10003/dce/rela_info/rela_daily_hold_profit?group_id=' + number + '&trade_date=' + trade_date + '&last_date=' + last_date + '&type_id=' + type;
    title = "品种:";
  } else if (id == undefined && type == undefined) {
    url = 'http://172.52.29.100:10003/dce/rela_info/rela_daily_hold_profit?group_id=' + number + '&trade_date=' + trade_date + '&last_date=' + last_date;
    title = "全部:";
  } else {
    url = 'http://172.52.29.100:10003/dce/rela_info/rela_daily_hold_profit?group_id=' + number + '&trade_date=' + trade_date + '&last_date=' + last_date + '&contract_id=' + id;
    title = "全部:";
  }
  $.ajaxGet(url, function (data) {
    if (data.message == 'success') {
      var dom = document.getElementById("container3");
      var myChart = echarts.init(dom);
      var xAxisData = [];
      var name = "";
      var buy = [];
      var sell = [];
      if (data.result.length > 0) {
        $.each(data.result, function (i, index) {
          xAxisData.push(index.TRADE_DATE);
          name = index.TYPE_ID;
          if (index.profit.toString().indexOf('-') == 0) {
            sell.push(index.profit);
            buy.push(0);
          } else {
            buy.push(index.profit);
            sell.push(0);
          }
        })
      }
      option = {
        backgroundColor: '#fff',
        title: {
          text: title,
          align: 'left',
          left: 50,
          textStyle: {
            fontSize: 14,
          }
        },
        legend: {
          data: [name],
          align: 'left',
          left: 90,
        },
        tooltip: {},
        xAxis: {
          data: xAxisData,
          name: 'X Axis',
          axisLabel: {
            interval: 0,
            rotate: -50
          },
        },
        yAxis: {
          splitArea: {
            show: false
          }
        },
        grid: {
          left: 100
        },
        series: [{
            name: name,
            type: 'bar',
            stack: 'one',
            data: buy,
            barWidth: 20,
            itemStyle: {
              normal: {
                color: '#db2d43'
              }
            }
          },
          {
            name: name,
            type: 'bar',
            stack: 'one',
            data: sell,
            barWidth: 20,
            itemStyle: {
              normal: {
                color: '#87e5da'
              }
            }
          }
        ]
      };
      myChart.on('brushSelected', renderBrushed);
      myChart.setOption(option, true);
    }
  });
}

//成交量情况
function cjl() {
  var url = 'http://172.52.29.100:10003/dce/rela_info/rela_daily_mkt_match_qty?group_id=' + number + '&trade_date=' + trade_date;
  $.ajaxGet(url, function (data) {
    if (data.message == 'success') {
      var html = [];
      if (data.result.length > 0) {
        $.each(data.result, function (i, index) {
          html.push({
            name: index.CONTRACT_TYPE_NAME,
            match_qty: index.MATCH_QTY,
            match_pct: index.MATCH_PCT,
            rank: index.RANK
          });
        });
        var Main = {
          data() {
            return {
              columns1: [{
                  title: '品牌',
                  key: 'name'
                },
                {
                  title: '成交量',
                  key: 'match_qty'
                },
                {
                  title: '成交占比',
                  key: 'match_pct'
                }, {
                  title: '排名',
                  key: 'rank'
                }
              ],
              data1: html
            }
          }
        }
        var Component = Vue.extend(Main)
        new Component().$mount('#cjl')
      }
    }
  });
}


//客户委托情况
function wtl() {
  var url = 'http://172.52.29.100:10003/dce/rela_info/rela_daily_mkt_order_qty?group_id=' + number + '&trade_date=' + trade_date;
  $.ajaxGet(url, function (data) {
    if (data.message == 'success') {
      var html = [];
      if (data.result.length > 0) {
        $.each(data.result, function (i, index) {
          html.push({
            name: index.CONTRACT_ID,
            qty: index.ORDER_QTY,
            cnt: index.ORDER_CNT,
            pct: index.TRADED_PCT,
            rank: index.ORDER_RANK
          });
        });
        var Main = {
          data() {
            return {
              columns2: [{
                  title: '合约',
                  key: 'name'
                },
                {
                  title: '委托量',
                  key: 'qty'
                },
                {
                  title: '委托次数',
                  key: 'pct'
                },
                {
                  title: '委托占比',
                  key: 'pct'
                }, {
                  title: '排名',
                  key: 'rank'
                }
              ],
              data2: html
            }
          }
        }
        var Component = Vue.extend(Main)
        new Component().$mount('#wtl')
      }
    }
  });
}

//持仓量情况
function ccl() {
  var url = 'http://172.52.29.100:10003/dce/rela_info/rela_daily_mkt_hold_qty?group_id=' + number + '&trade_date=' + trade_date;
  $.ajaxGet(url, function (data) {
    if (data.message == 'success') {
      var html = [];
      if (data.result.length > 0) {
        $.each(data.result, function (i, index) {
          html.push({
            name: index.CONTRACT_ID,
            qty: index.HOLD_BUY_QTY,
            pct: index.HOLD_BUY_QTY_PCT,
            chg: index.HOLD_BUY_QTY_CHG,
            rank: index.HOLD_BUY_QTY_RANK,
            sqty: index.HOLD_SELL_QTY,
            spct: index.HOLD_SELL_QTY_PCT,
            schg: index.HOLD_SELL_QTY_CHG,
            srank: index.HOLD_SELL_QTY_RANK,
            nqty: index.HOLD_NET_QTY,
            nrank: index.HOLD_NET_QTY_RANK
          });
        });
        var Main = {
          data() {
            return {
              columns3: [{
                  title: '合约',
                  key: 'name'
                },
                {
                  title: '买持仓量',
                  key: 'qty'
                },
                {
                  title: '买持仓占比',
                  key: 'pct'
                },
                {
                  title: '买持仓量变化',
                  key: 'chg'
                },
                {
                  title: '买排名',
                  key: 'rank'
                }, {
                  title: '卖持仓量',
                  key: 'sqty'
                },
                {
                  title: '卖持仓占比',
                  key: 'spct'
                },
                {
                  title: '卖持仓量变化',
                  key: 'schg'
                },
                {
                  title: '卖排名',
                  key: 'srank'
                },
                {
                  title: '净持仓',
                  key: 'nqty'
                }, {
                  title: '净持仓排名',
                  key: 'nrank'
                }
              ],
              data3: html
            }
          }
        }
        var Component = Vue.extend(Main)
        new Component().$mount('#ccl')
      }
    }
  });
}

function renderBrushed(params) {
  var brushed = [];
  var brushComponent = params.batch[0];

  for (var sIdx = 0; sIdx < brushComponent.selected.length; sIdx++) {
    var rawIndices = brushComponent.selected[sIdx].dataIndex;
    brushed.push('[Series ' + sIdx + '] ' + rawIndices.join(', '));
  }

  myChart.setOption({
    title: {
      // backgroundColor: '#333',
      text: 'SELECTED DATA INDICES: \n' + brushed.join('\n'),
      bottom: 0,
      right: 0,
      width: 100,
      textStyle: {
        fontSize: 12,
        color: '#fff'
      }
    }
  });
}

$("#time-btn").click(function () {
  last_date = $("#month_start").val().toString().replace(/-/g, "");
  trade_date = $("#month_stop").val().toString().replace(/-/g, "");
  twochart();
  threechart();
  fourschart();
});
$("#btn").click(function () {
  var type = $('#contract_type_name_match option:selected').val();
  var id = $('#contract_id_match option:selected').val();
  if (type != "全部" && id != "全部") {
    twochart(type, id);
  } else if (type == "全部" && id != "全部") {
    type = undefined;
    twochart(type, id);
  } else if (id == "全部" && type != "全部") {
    id = undefined;
    twochart(type, id);
  } else {
    twochart();
  }
});
$("#btn2").click(function () {
  var type = $('#contract_type_name_hold option:selected').val();
  var id = $('#contract_id_hold option:selected').val();
  if (type != "全部" && id != "全部") {
    threechart(type, id);
  } else if (type == "全部" && id != "全部") {
    type = undefined;
    threechart(type, id);
  } else if (id == "全部" && type != "全部") {
    id = undefined;
    threechart(type, id);
  } else {
    threechart();
  }
});
$("#btn3").click(function () {
  var type = $('#contract_type_name_match2 option:selected').val();
  var id = $('#contract_id_match2 option:selected').val();
  if (type != "全部" && id != "全部") {
    fourschart(type, id);
  } else if (type == "全部" && id != "全部") {
    type = undefined;
    fourschart(type, id);
  } else if (id == "全部" && type != "全部") {
    id = undefined;
    fourschart(type, id);
  } else {
    fourschart();
  }
});


$("#more").click(function () {
  var html = $("#more").html();
  if (html == "更多") {
    $("#username").removeClass("username-three");
    $("#more").html("收起");
  } else {
    $("#username").addClass("username-three");
    $("#more").html("更多");
  }
})

//违规交易
$("#title-one").click(function () {
  window.location.href = "transactions.html?type=2" + "&number=" + number + "&trade_date=" + trade_date + "&last_date=" + last_date;
});

//股权关系
$("#title-three").click(function () {
  window.location.href = "demo.html";
});

//词云
$("#title-two").click(function () {
  window.location.href = "wordCloud.html?type=2" + "&number=" + number + "&trade_date=" + trade_date;
});