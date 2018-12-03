var last_date = '20160420';
var trade_date = '20160520';
$(function () {
  init();
})

function init() {
  //获取时间
  $.ajaxGet('http://172.52.29.100:10000/dce/home_info/trade_date_query', function (data) {
    if (data.code == '0') {
      last_date = data.last_date;
      trade_date = data.trade_date;
    }
  });
  kh();
  gl();
  sk();
}


//客户组
function kh() {
  var url = 'http://172.52.29.100:10000/dce/home_info/cli_daily_predict_alarm?trade_date=' + trade_date;
  $.ajaxGet(url, function (data) {
    if (data.message == 'success') {
      var html1 = [];
      var html2 = [];
      var html3 = [];
      var html4 = [];
      if (data.result.agree_trade_list.length > 0) {
        $.each(data.result.agree_trade_list, function (i, index) {
          html1.push('<span><a href="page1.html?number=' + index + '">' + index + '</a></span>');
        });
        $("#ydjy").append(html1);
      }
      if (data.result.false_declaim_list.length > 0) {
        $.each(data.result.false_declaim_list, function (i, index) {
          html2.push('<span><a href="page1.html?number=' + index + '">' + index + '</a></span>');
        });
        $("#xjsb").append(html2);
      }
      if (data.result.suspect_rela_0045_list.length > 0) {
        $.each(data.result.suspect_rela_0045_list, function (i, index) {
          html3.push('<span><a href="page1.html?number=' + index + '">' + index + '</a></span>');
        });
        $("#ysgl45").append(html3);
      }
      if (data.result.suspect_rela_0056_list.length > 0) {
        $.each(data.result.suspect_rela_0056_list, function (i, index) {
          html4.push('<span><a href="page1.html?number=' + index + '">' + index + '</a></span>');
        });
        $("#ysgl56").append(html4);
      }
    }
  });
}
//实控组
function sk() {
  var url = 'http://172.52.29.100:10000/dce/home_info/grp_daily_predict_alarm?trade_date=' + trade_date;
  $.ajaxGet(url, function (data) {
    if (data.message == 'success') {
      var html = [];
      if (data.result.length > 0) {
        $.each(data.result, function (i, index) {
          html.push('<span><a href="page3.html?number=' + index.GROUP_ID + '">' + index.GROUP_ID + '</a></span>');
        });
        $("#sk").append(html);
      }
    }
  });
}
//关联组
function gl() {
  var url = 'http://172.52.29.100:10000/dce/home_info/rela_daily_predict_alarm?trade_date=' + trade_date;
  $.ajaxGet(url, function (data) {
    if (data.message == 'success') {
      var html = [];
      if (data.result.length > 0) {
        $.each(data.result, function (i, index) {
          html.push('<span><a href="page2.html?number=' + index.GROUP_ID + '">' + index.GROUP_ID + '</a></span >');
        });
        $("#gl").append(html);
      }
    }
  });
}

$("#btn").click(function () {
  var number = $("#number").val(); //查询号码
  var value = $('#select option:selected').val(); //获取选中内容
  if (number) {
    if (value == "客户号") {
      window.location.href = "page1.html?number=" + number;
    } else if (value == "关联组号") {
      window.location.href = "page2.html?number=" + number;
    } else if (value == "实控组号") {
      window.location.href = "page3.html?number=" + number;
    }
  } else {
    $("#errormsg").show();
  }
})