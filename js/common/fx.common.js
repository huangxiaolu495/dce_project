/** 
 * 公共库
 * created by mr.x on 16/04/11.
 * @import core/jquery.js  
 */
;
(function (M, window) {
  M.extend({

    server: function () { //服务器环境
      return {
        0: '', //生产
        1: '', //测试
        2: '', //开发 
        888: '' //本地
      } [888] /*[/\(updebug\s(\d+)\)/g.exec(navigator.userAgent.toLowerCase())[1]];//(updebug 888)*/
    }(),
    isString: function (obj) { //是否字符串
      return this.type(obj) === 'string';
    },
    ellipsisToggle: function () {
      var self = this;
      setTimeout(function () {
        self.ellipsisT();
        setTimeout(function () {
          self.ellipsisT();
        }, 1000);
      }, 100);
    },
    ellipsisT: function () {

      var list = document.querySelectorAll(".y-ellipsis-flag");
      for (var i = 0; i < list.length; i++) {
        list[i].classList.remove("y-ellipsis-flag");
        var p = document.createElement("p");
        p.innerText = list[i].innerText;
        p.style.top = '-2000px';
        p.style.position = 'absolute';
        p.width = list[i].offsetWidth;
        list[i].parentNode.appendChild(p);
        if (p.offsetHeight > list[i].clientHeight) {
          var h6 = document.createElement("h6");
          h6.innerText = '展开';
          h6.className = 'y-text-right y-ellipsis-tag';
          h6.onclick = function () {
            var el = this;
            var elPre = el.previousElementSibling;

            elPre.classList.contains('y-ellipsis') ? (elPre.classList.remove('y-ellipsis'), el.innerText = '收起') : (elPre.classList.add('y-ellipsis'), el.innerText = '展开');

          }
          //					h6.addEventListener('tap', function() {
          //						var el = this;
          //						var elPre = el.previousElementSibling;
          //
          //						elPre.classList.contains('y-ellipsis') ? (elPre.classList.remove('y-ellipsis'), el.innerText = '收起') : (elPre.classList.add('y-ellipsis'), el.innerText = '展开');
          //						//							console.log('111:::' + elPre.offsetHeight)
          //						//							var y = mui('.mui-scroll-wrapper').scroll()[0].y;
          //						//							mui('.mui-scroll-wrapper').scroll()[0].scrollTo(0, y + 10, 100);
          //						//							mui.trigger(elPre, 'swipedown');
          //					});
          list[i].parentNode.lastChild == list[i] ? list[i].parentNode.appendChild(h6) : list[i].parentNode.insertBefore(h6, list[i].nextElementSibling)

        }
        list[i].parentNode.removeChild(p);
      }

    },
    //ajax get请求 
    ajaxGet: function (url, success, fail) {
      $.ajax({
        url: url,
        type: "GET",
        // data: param,
        contentType: 'application/json;charset=utf-8',
        context: this,
        datatype: 'json',
        success: function (data) {
          $.delay(1, function () {
            $.isFunction(success) && success.call(this, data);
          }, this);
        },
        error: function (XMLHttpRequest, status) {
          $.isFunction(fail) && fail.call(this, {
            error: '请求失败',
            timeout: '请求超时',
            parsererror: '数据格式错误'
          } [status], this);
        }
      });
    },
    //获取浏览器参数
    GetQueryString: function (name) {
      var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
      var r = window.location.search.substr(1).match(reg);
      if (r != null) return unescape(r[2]);
      return null;
    },
    isBoolean: function (obj) { //是否boolean
      return this.type(obj) === 'boolean';
    },
    isDate: function (obj) { //是否日期
      return this.type(obj) === 'date';
    },
    isRegExp: function (obj) { //是否正则
      return this.type(obj) === 'regexp';
    },
    isObject: function (obj) { //是否普通对象
      return this.type(obj) === 'object';
    },
    delay: function (time, callback) { //延迟
      return this.isNumeric(time) && setTimeout(function () {
        callback.apply(arguments[0][0] || this, [].slice.call(arguments[0], 1));
      }.bind(this, [].slice.call(arguments, 2)), time);
    },
    setNumberPoint: function (number, n) { //保留n位小数,默认2位
      return this.isString(number) ? number : this.isNumeric(number) ? Number(number).toFixed(n || 2) : number;
    },
    getArraySum: function (obj, s) { //数组求和(递加|递减)
      return this.isArray(obj) && obj.length > 0 ? eval(obj.join({
        1: String.fromCharCode(43),
        '-1': String.fromCharCode(45)
      } [s || 1])) : obj;
    },
    JsonToString: function (obj) { //json to string
      return this.isPlainObject(obj) ? JSON.stringify(obj) : obj;
    },
    StringToJson: function (obj) { //string to json
      if (this.isString(obj)) {
        try {
          return JSON.parse(obj);
        } catch (e) {
          return obj;
        };
      } else {
        return obj;
      };
    },
    format: function (date, fmt) { //author: meizz 

      var d = date;
      var o = {
        "M+": d.getMonth() + 1, //月份 
        "d+": d.getDate(), //日 
        "h+": d.getHours(), //小时 
        "m+": d.getMinutes(), //分 
        "s+": d.getSeconds(), //秒 
        "q+": Math.floor((d.getMonth() + 3) / 3), //季度 
        "S": d.getMilliseconds() //毫秒 
      };
      if (/(y+)/.test(fmt))
        fmt = fmt.replace(RegExp.$1, (d.getFullYear() + "").substr(4 - RegExp.$1.length));
      for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt))
          fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
      return fmt.replace('T', ' ').replace('+08:00', '').replace(/-/g, "-");
    },
    formatDate: function (number) { //格式化数字
      return this.isNumeric(number) ? number < 10 ? '0' + number : number : number;
    },
    getWeekend: function (date) { //获取星期
      return '星期' + ['日', '一', '二', '三', '四', '五', '六'][(this.isDate(date) ? date : new Date()).getDay()];
    },
    getArrayIndex: function (arr, value) { //匹配数组中value对应索引
      arr = arr.toString();
      return arr.indexOf(value) >= 0 ? arr.replace(new RegExp('((^|,)' + value + '(,|$))', 'gi'), '$2@$3').replace(/[^,@]/g, '').indexOf('@') : -1;
    },
    arrayToJson: function (arr, obj) { //数组转对象
      if (M.isArray(arr) && arr.length) {
        obj = M.isObject(obj) ? obj : {};
        for (var i = 0; i < arr.length; i++) {
          if (obj[arr[i].name]) {
            if (!M.isArray(obj[arr[i].name])) {
              obj[arr[i].name] = [obj[arr[i].name]];
            };
            obj[arr[i].name].push(arr[i].value);
          } else {
            obj[arr[i].name] = arr[i].value;
          };
        };
        return obj;
      };
      return arr;
    },
    getFormatTellphone: function (s) { //格式化手机号码
      s = s.toString();
      return s.substr(0, 3) + String.fromCharCode(32) + s.substr(3, 4) + String.fromCharCode(32) + s.substring(7);
    },
    getFormatNumber: function (s, n) { //格式化数字 例如['13,234,234.89','9,872,980','8,872.10']
      if (this.isNumeric(s)) {
        s += '';
        s.indexOf('.') == -1 && parseFloat(s.replace(/[^\d\.-]/g, '')).toFixed(n || 2);
        var l = s.split('.')[0].split('').reverse();
        for (var i = 0, t = ''; i < l.length; i++) {
          t += l[i] + ((i + 1) % 3 == 0 && (i + 1) != l.length ? ',' : '');
        };
        return t.split('').reverse().join('') + (s.indexOf('.') == -1 ? '.' + new Array((n || 2) + 1).join('0') : Number('0.' + s.split('.')[1]).toFixed(n || 2).toString().substring(1));
      };
      return s;
    },
    getChineseNumber: function (number) { //金额转大写
      if (this.isNumeric(number)) {
        var AA = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖'],
          BB = ['', '拾', '佰', '仟', '万', '亿', '圆', ''],
          CC = ['角', '分', '厘'];
        var a = number.toString().replace(/(^0*)/g, '').split('.'),
          k = 0,
          re = '';
        for (var i = a[0].length - 1; i >= 0; i--) {
          switch (k) {
            case 0:
              re = BB[7] + re;
              break;
            case 4:
              !new RegExp('0{4}\\d{' + (a[0].length - i - 1) + '}M').test(a[0]) && (re = BB[4] + re);
              break;
            case 8:
              re = BB[5] + re;
              BB[7] = BB[5];
              k = 0;
              break;
          };
          if (k % 4 == 2 && a[0].charAt(i) == '0' && a[0].charAt(i + 2) != '0') re = AA[0] + re;
          if (a[0].charAt(i) != 0) re = AA[a[0].charAt(i)] + BB[k % 4] + re;
          k++;
        };
        if (a.length > 1) {
          re += BB[6];
          for (var i = 0; i < a[1].length; i++) {
            re += AA[a[1].charAt(i)] + CC[i];
            if (i == 2) break;
          };
        } else {
          re += '圆整';
        };
        return re;
      };
      return number;
    },
    getFormatCard: function (card, m) { //格式化银行卡号 @card卡号 string  @m 分割位，默认为4
      if (this.isString(card)) {
        m = this.isNumeric(m) ? m : 4;
        for (var i = 0, str = ''; i < card.length; i += m) {
          str += card.substr(i, m - 1) + card.charAt(i + m - 1).concat(String.fromCharCode(32));
        };
        return this.trim(str);
      };
      return card;
    },
    formatPanCard: function (pan, m) { //隐藏银行卡号|手机号
      if (this.isString(pan) && (pan = this.trim(pan)).length >= 11) {
        m = this.isNumeric(m) ? m : 4;
        return pan.substr(0, m).concat(new Array(pan.length - 3 - m).join(String.fromCharCode(42))).concat(pan.slice(-4));
      };
      return pan;
    },
    browser: function (n) { //浏览器信息
      var u = n.userAgent,
        app = n.appVersion;
      return {
        touch: ('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch, //是否支持touch事件
        isInstalledApp: /youragent/g.test(u.toLowerCase()),
        isWeixin: /micromessenger/g.test(u.toLowerCase()),
        isIOS: /iphone|ipad|ipod/g.test(u.toLowerCase()),
        versions: {
          trident: u.indexOf('Trident') > -1, //IE内核
          ie: u.indexOf('Trident') > -1 && ((Object.hasOwnProperty.call(window, 'ActiveXObject') && !window.ActiveXObject) || parseInt(u.toLowerCase().match(/msie ([\d.]+)/)[1])), //ie版本(>=ie11为true)
          presto: u.indexOf('Presto') > -1, //opera内核
          webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
          gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, //火狐内核
          mobile: !!u.match(/AppleWebKit.*Mobile.*/) || !!u.match(/AppleWebKit/), //是否为移动终端
          ios: !!u.match(/(i[^;]+;(U;)? CPU.+Mac OS X)/), //ios终端
          android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, //android终端或者uc浏览器
          iPhone: u.indexOf('iPhone') > -1 || u.indexOf('Mac') > -1, //是否为iPhone或者QQHD浏览器
          iPod: u.indexOf('iPod') > -1, //是否iPod
          iPad: u.indexOf('iPad') > -1, //是否iPad
          webApp: u.indexOf('Safari') == -1 //是否web应该程序，没有头部与底部
        },
        language: (n.browserLanguage || n.language).toLowerCase()
      };
    }(navigator),
    deParam: function (str) { // url to json
      str = str || location.search.substr(1);
      var pairs = str.split('&'),
        obj = {},
        pair, i;
      for (i in pairs) {
        if (pairs[i] === '') continue;
        pair = pairs[i].split('=');
        obj[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1]);
      };
      return obj;
    },
    getNormalPath: function (param, type) { //获取绝对路径
      var s = {
        1: 'res/images',
        2: 'res/js',
        3: 'res/css',
        4: 'res/data',
        5: 'res/music'
      } [type || 1];
      if (this.isString(param)) {
        return this.server + s + '/' + param;
      };
      if (this.isArray(param) && param.length > 0) {
        for (var i = 0, str = []; i < param.length; i++) {
          str.push(this.server + s + '/' + param[i]);
        };
        return str;
      };
      return param;
    },
    creatObj: function (name, value) { //创建简单对象
      var o = {};
      o[name] = value;
      return o;
    },
    creatlabel: function (s) { //创建<div>
      return String.fromCharCode(60) + (s || 'div') + String.fromCharCode(62);
    },
    renderHTML: function (param) { //创建dom outerHTML
      var m = param.name || 'div',
        k = /(img)|(input)/g.test(m),
        c = function (s) {
          return s.replace(/[A-Z]/g, function (a, b) {
            return '-' + a.toLowerCase();
          });
        },
        get = function (obj, type) {
          if (M.isPlainObject(obj)) {
            var str = '',
              s = [{
                a: '="',
                b: '"',
                c: ' '
              }, {
                a: ':',
                b: ';',
                c: ''
              }][type];
            for (var name in obj) {
              str += s.c + c(name) + s.a + (M.isPlainObject(obj[name]) ? arguments.callee(obj[name], 1) : obj[name]) + s.b;
            };
            return str;
          };
          return '';
        };
      return this.creatlabel(m + get(param.proto, 0)) + (M.isFunction(param.html) ? param.html() : (param.html || '')) + (k ? '' : this.creatlabel('/' + m));
    },

    /* 模板引擎 */
    template: {
      init: function (data, fn, context, id) {
        var controller = document.getElementById(id || 'template-controller');
        controller.innerHTML = this.resolve(controller.innerHTML, data);
        M.isFunction(fn) && fn.apply(context || this, [].slice.call(arguments, 4));
      },
      resolve: function (template, data) {
        var key;
        for (key in data) {
          M.isPlainObject(data[key]) ? arguments.callee(template, data[key]) : template = this.replace(template, key, data[key] == undefined ? '' : data[key]);
        };
        return template;
      },
      replace: function (template, key, value) {
        return template.replace(new RegExp('{{\\s*' + key + '\\s*}}', 'ig'), value);
      }
    },

    /* 操作查询url字符串 */
    query: {
      get: location.search,
      getUrl: function () {
        return encodeURI(decodeURI(this.get));
      },
      setItem: function (key, value) { //设置 参数(键,键值)
        value = encodeURIComponent(value);
        this.get.length == 0 ? this.get = '?' + key + '=' + value : this.get = this.get + '&' + key + '=' + value;
      },
      getItem: function (key) { //获取 参数(键),返回(指定key对应的value)
        var str = this.get.substring(this.get.indexOf('?') + 1);
        if (str.length) {
          str = '{"' + str.replace(/=/g, '":"').replace(/&/g, '","') + '"}';
          str = JSON.parse(str);
          return decodeURIComponent(decodeURI(str[key]));
        };
        return null;
      },
      removeItem: function (key) { //移除 参数(键)
        var str = this.get.substring(this.get.indexOf('?') + 1);
        str = '{"' + str.replace(/=/g, '":"').replace(/&/g, '","') + '"}';
        str = JSON.parse(str);
        delete str[key];
        str = JSON.stringify(str);
        str = '?' + str.substring(2, str.length - 2);
        str = str.replace(/:/g, '=').replace(/,/g, '&').replace(/"/g, '');
        this.get = str;
      },
      clear: function () { //清空
        this.get = '';
      }
    },

    /* localStorage操作 */
    localStorage: {
      get: function (name) {
        var value;
        try {
          value = localStorage.getItem(name);
        } catch (e) {};
        value == null && (value = M.cookie.read(name));
        return M.StringToJson(value);
      },
      set: function (name, value) {
        value = M.JsonToString(value);
        try {
          localStorage.setItem(name, value);
        } catch (e) {
          M.cookie.set(name, value, {
            expires: 365
          });
        };
        return value;
      },
      clear: function (name) {
        M.isString(name) ? function () {
          try {
            localStorage.removeItem(name);
          } catch (e) {
            M.cookie.clear(name);
          };
        }() : function () {
          try {
            localStorage.clear();
          } catch (e) {};
        }();
      }
    },

    /**
     * 设置cookie
     * @name         string      (必须)名字
     * @value        string      (必须)值
     * **对象options**
     * ''expires''   number      (可选)有效期（天）
     * ''path''      string      (可选)路径
     * ''domain''    string      (可选)cookie
     * ''secure''    boolean     (可选)是否安全协议https  默认false	
     */
    cookie: {
      get: function () { //获取
        return document.cookie;
      },
      set: function (name, value, param) { //设置
        var str = '',
          param = param || {};
        if (param.expires != undefined && M.isNumeric(param.expires)) {
          var d = new Date();
          d.setTime(d.getTime() + param.expires * 24 * 60 * 60 * 1000);
          str += ';expires=' + d.toUTCString();
        };
        M.isString(param.path) && (str += ';path=' + param.path);
        M.isString(param.domain) && (str += ';domain=' + param.domain);
        str += ';' + ((M.isBoolean(param.secure) && param.secure) ? true : false);
        document.cookie = name + '=' + encodeURIComponent(value) + str;
      },
      read: function (name) { //读
        var cookie = this.get();
        if (cookie.length > 0) {
          name += '=';
          var list = cookie.split(';');
          for (var i = 0; i < list.length; i++) {
            var c = M.trim(list[i]);
            if (c.indexOf(name) != -1) {
              return decodeURIComponent(c.substring(name.length, c.length));
            } else {
              if (i == list.length - 1) {
                return 'undefined';
              };
            };
          };
        } else {
          return 'undefined';
        };
      },
      clear: function (name) { //清除
        this.set(name, null, -1);
      }
    },

    ui: {
      define: function () {
        return M.define.apply(this, arguments);
      },

      /**
       * 缓存图片
       * @pic                     string|array        (必须)图片						默认[]
       * @time	                number              (可选)延迟时间			     		默认0
       * @onProgress              function            (可选)单张图片缓存成功回调      		  		 	
       * @onComplete              function            (可选)全部图片缓存成功回调
       */
      loadImage: {
        defaults: {
          pic: [],
          time: 0,
          onProgress: function () {},
          onComplete: function () {}
        },
        init: function (ops) {
          ops = M.extend(true, {}, this.defaults, ops);
          M.isString(ops.pic) && (ops.pic = [ops.pic]);
          this.creat(ops, [].slice.call(arguments, 1));
        },
        creat: function (ops, args) {
          (M.isArray(ops.pic) && ops.pic.length > 0) ? this.load(0, ops, args): ops.onComplete.apply(ops.pic, args);
        },
        load: function (index, ops, args) {
          M.delay(ops.time, function () {
            var img = new Image();
            M(img).load(function () {
              M.isFunction(ops.onProgress) && ops.onProgress.apply([ops.pic[index]], [index + 1, ops.pic.length].concat(args));
              (++index) < ops.pic.length ? this.load(index, ops, args) : M.isFunction(ops.onComplete) && ops.onComplete.apply(ops.pic, args);
            }.bind(this)).attr('src', ops.pic[index]);
          }, this);
        }
      },

      /**
       * 图片懒加载
       * @warp	               object	           (必须)被包裹容器			默认document
       * @isBind                 boolean             (可选)是否绑定滚动事件   	默认true
       */
      lazyload: {
        defaults: {
          warp: null,
          isBind: true
        },
        init: function (ops) {
          ops = M.extend(true, {}, this.defaults, ops);
          ops.warp = ops.warp || M(document.getElementsByClassName('lazy-propfix-piel'));
          var list = [];
          M('img', ops.warp).each(function () {
            list.push({
              target: this,
              status: false
            });
          });
          this.exec(ops, list);
          ops.isBind && M(window).bind('scroll', function () {
            this.exec(ops, list);
          }.bind(this));
          return M.extend(true, {}, this, {
            defaults: ops
          });
        },
        exec: function (ops, list) {
          M.delay(50, function () {
            var o = M(window),
              x_oSize = o.width(),
              y_oSize = o.height();
            for (var i = 0; i < list.length; i++) {
              if (list[i].status) {
                continue;
              };
              var target = M(list[i].target),
                pic = target.attr('original'),
                x_offset = target.offset().left,
                x_distance = o.scrollLeft(),
                x_size = target.width(),
                y_offset = target.offset().top,
                y_distance = o.scrollTop(),
                y_size = target.height();
              if ((x_offset >= x_distance - x_size && x_offset < x_oSize + x_distance) && (y_offset >= y_distance - y_size && y_offset < y_oSize + y_distance)) {
                M.ui.loadImage.init({
                  pic: pic,
                  onComplete: function (that, i) {
                    list[i].status = true;
                    that.css({
                      display: 'none'
                    }).attr('src', this[0]).addClass('lazy-propfix-img').removeAttr('original').fadeIn();
                  }
                }, target, i);
              };
            };
          }, this);
        }
      },

      /**
       * ajax请求
       * @data                  object              (可选)请求参数                       		默认null
       * @url                   string              (必须)请求地址                       		默认null
       * @type                  string              (必须)请求方式                       		默认get
       * @dataType              boolean             (必须)请求数据类型                    		默认json	
       * @timeout               number              (可选)请求超时时间                    		默认10000毫秒
       * @delay                 number              (可选)延迟失败回调处理时间     				默认0      
       * @times                 number              (可选)请求失败后重新连续请求次数     	 		默认0    
       * @isload                boolean             (可选)请求之前是否显示loading     	 		默认true 
       * @enabled               boolean             (可选)是否渲染失败映射                   		默认false
       * @container             object              (可选)展示失败映射,仅当enabled为true生效   	默认null
       * @button                boolean             (可选)展示失败映射按钮,仅当enabled为true生效	默认false
       * @event				  boolean             (可选)是否绑定重新加载事件						默认true
       * @beforeSend            function            (可选)请求之前回调  
       * @success               function            (可选)请求成功回调  
       * @error                 function            (可选)请求失败或超时回调
       * @context               object              (可选)上下文指定	                    	
       */
      ajax: {
        defaults: {
          data: null,
          url: null,
          type: 'post',
          dataType: 'json',
          timeout: 10000,
          times: 0,
          delay: 0,
          isload: true,
          render: {
            enabled: false,
            container: null,
            reload: true,
            event: true
          },
          beforeSend: function () {},
          success: function () {},
          error: function () {}
        },
        init: function (ops, context) {
          ops = M.extend(true, {}, this.defaults, ops);
          ops.status = true;
          this.creat(0, ops.isload, ops, context, [].slice.call(arguments, 2));
          return M.extend(true, {}, this, {
            defaults: ops
          });
        },
        creat: function (index, status, ops, context, args) {
          M.ajax({
            data: M.extend({}, ops.data),
            url: ops.url,
            type: ops.type,
            dataType: ops.dataType,
            context: this,
            timeout: ops.timeout,
            contentType: 'application/json',
            beforeSend: function () {
              if (index == 0) {
                if (status) {
                  M.ui.waiting.dismiss();
                  M.delay(300, function () {
                    ops.status && M.ui.waiting.creat();
                  });
                };
                M.isFunction(ops.beforeSend) && ops.beforeSend.apply(context || this, args);
              };
            },
            success: function (data) {
              M.delay(ops.delay, function () {
                ops.status = false;
                status && M.ui.waiting.dismiss();
                if (!!!data) {
                  ops.render.enabled && this.render(data.msg, ops, context, args);
                  M.isFunction(ops.error) && ops.error.apply(context || this, ['没有数据'].concat(args));
                } else {
                  if (data.state) {
                    if (data.state == 0) {
                      M.isFunction(ops.success) && ops.success.apply(context || this, [data.RETURN || data].concat(args));
                    } else {
                      ops.render.enabled && this.render(data.msg, ops, context, args);
                      M.isFunction(ops.error) && ops.error.apply(context || this, [data.msg, data.state].concat(args));
                    };
                  } else {
                    M.isFunction(ops.success) && ops.success.apply(context || this, [data].concat(args));
                  };
                };
              }, this);
            },
            complete: function (XMLHttpRequest, status) {
              M.delay(ops.delay, function () {
                ops.status = false;
                if (status != 'success') {
                  if (index < ops.times) {
                    this.creat(++index, status, ops, context, args);
                  } else {
                    var text = {
                      error: '请求失败',
                      timeout: '请求超时',
                      parsererror: '数据格式错误'
                    } [status];
                    M.ui.waiting.dismiss();
                    ops.render.enabled && this.render(text, ops, context, args);
                    M.isFunction(ops.error) && ops.error.apply(context || this, [text].concat(args));
                  };
                };
                XMLHttpRequest.abort();
              }, this);
            }
          });
        },
        render: function (text, ops, context, args) {
          M.ui.error.init({
            warp: ops.render.container,
            text: text,
            isReload: ops.render.reload,
            callback: function () {
              ops.render.event && M.delay(ops.delay, function () {
                this.creat(0, true, ops, context, args);
              }, this);
            }
          }, this);
        }
      },

      /**
       * 请求失败渲染页面
       * @type                  number              (可选)展示图标类型                       默认 网络故障(0|1-网络故障,2-请求失败,3-请求超时,4-数据格式错误,5-无数据)
       * @warp             	  object              (可选)渲染映射外包装					    默认 body
       * @enabled               boolean             (可选)是否渲染按钮					    默认 true
       * @text                  string              (可选)渲染按钮内容,仅当enabled为true生效					    
       * @callback              function            (可选)重新加载回调
       * @context               object              (必须)执行上下文                       	       	
       */
      error: {
        defaults: {
          warp: null,
          text: '测试文字',
          isReload: true,
          callback: function () {}
        },
        init: function (ops, context) {
          ops = M.extend(true, {}, this.defaults, ops);
          ops.container = this.creat(ops, context, [].slice.call(arguments, 2));
          return M.extend(true, {}, this, {
            defaults: ops
          });
        },
        creat: function (ops, context, args) {
          var self = this,
            o = M(M.creatlabel(), {
              'class': 'mt-error-container',
              html: M.renderHTML({
                proto: {
                  'class': 'mt-error-main'
                },
                html: ops.text + (ops.isReload ? '，' : '')
              })
            });
          ops.isReload && o.children().append(M(M.creatlabel('a'), {
            'class': 'red',
            href: 'javascript:;',
            html: '点击重新加载',
            click: function () {
              ops.container.remove();
              M.isFunction(ops.callback) && ops.callback.apply(context || this, args);
            }
          }));
          ops.warp.append(o);
          return o;
        }
      }

    },

    /**
     * 定义组件
     * @name                  string              (必须)组件名称                       
     * @value                 object|function     (可选)组件内容               	       	
     */
    define: function (name, value) {
      if (M.isString(name)) {
        M.extend(this, M.creatObj(name, M.isFunction(value) ? value.call(this) : value));
      };
      return M;
    },

    /* 阻止默认事件及冒泡 */
    tools: {
      preventDefault: function (e) {
        e.preventDefault();
      },
      stopPropagation: function (e) {
        e.stopPropagation();
      }
    }
  });

  M.fn.extend({
    preventDefault: function (type) {
      this.bind(type || 'click', M.tools.preventDefault);
      return this;
    },
    stopPropagation: function (type) {
      this.bind(type || 'click', M.tools.stopPropagation);
      return this;
    },
    release: function (type) {
      this.unbind(type || 'click', M.tools.preventDefault);
      return this;
    }
  });

  if (!Function.prototype.bind) {
    Function.prototype.bind = function (oThis) {
      if (!M.isFunction(this)) {
        M.error('Function.prototype.bind - 非方法');
        return;
      };
      var aArgs = Array.prototype.slice.call(arguments, 1),
        fToBind = this,
        fNOP = function () {},
        fBound = function () {
          return fToBind.apply(this instanceof fNOP && oThis ? this : oThis, aArgs.concat(Array.prototype.slice.call(arguments)));
        };
      fNOP.prototype = this.prototype;
      fBound.prototype = new fNOP();
      return fBound;
    };
  };

  if (!document.getElementsByClassName) {
    document.getElementsByClassName = function (className, element) {
      var children = (element || document).getElementsByTagName('*'),
        elements = [];
      for (var i = 0; i < children.length; i++) {
        var child = children[i],
          classNames = child.className.split(' ');
        for (var j = 0; j < classNames.length; j++) {
          if (classNames[j] == className) {
            elements.push(child);
            break;
          };
        };
      };
      return elements;
    };
  };

  M(document).bind('keydown', function (e) {
    if (e.keyCode == 13) return false;
  });

})(window.jQuery, window);