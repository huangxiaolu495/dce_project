/** 
 * 年月季度选择控件
 * created by mr.x on 16/09/19.
 * @import common/fx.common.js   
 *
 * @target                    object        		(必须)触发源					          									默认 null
 * --@year					  object
 * --''select''     	  	  string      			(可选)指定当前年份															默认 null    
 * --''min''     	  	  	  string		      	(可选)最小年份,支持now相当于当前日期											默认 null   ⇒ now  
 * --''max''     	 	  	  string      			(可选)最大年份,支持now相当于当前日期											默认 null   ⇒ now
 * --@attach				  object
 * --''type''     	  	  	  string      			(可选)次级类型(月份或者季度)													默认 quart  ⇒ quart
 * --''select''     	  	  number      			(可选)指定当前时间,月份1-12,季度1-4											默认 null    
 * --''min''     	  	  	  number		      	(可选)最小时间,支持now相当于当前时间											默认 null   ⇒ now 
 * --''max''     	 	  	  number      			(可选)最大时间,支持now相当于当前时间											默认 null   ⇒ now  
 * --''enabled''     	  	  boolean      			(可选)是否展示时间选择														默认 true    
 * @auto    	  	  	  	  boolean      			(可选)是否初始化自动赋值	,和selected搭配使用									默认 false
 * --@tool     	  		  						
 * --''clear''     	  	  	  boolean      			(可选)是否显示清除按钮														默认 true   
 * --@relative				  object
 * --''type''     	  	  	  string      			(可选)联动类型																默认 null ⇒ 'stop'结束日期  'start'开始日期 
 * --''point''     	  	 	  object      			(可选)联动日期对象															默认 null    
 * @callback                  function            	(可选)初始化完成回调
 * @choose                    function            	(可选)选择完成回调
 */
;(function(M,window){
	M.ui.define('datePicker',function(){
		function datePicker(ops,args){
			this.ops=ops;
			this.init(args);
		};
		datePicker.prototype={
			constructor:datePicker,
			versions:'1.0.0',
			init:function(args){
				if(!this.ops.target.length) return;
				this.args=args;
				this.id=Math.random().toString(36).substr(2);
				this.distance=203;
				this.getAuto(function(){
					this.ops.auto&&this.setValue();	
					this.cache={
						year:{
							select:this.ops.year.select,
							max:this.ops.year.max,
							min:this.ops.year.min
						}
					};
					if(this.ops.attach.enabled){
						this.cache.attach={
							select:this.ops.attach.select,
							max:this.ops.attach.max,
							min:this.ops.attach.min
						};
					};
					this.ops.target.bind('click',{context:this},this.exec);
					M.isFunction(this.ops.callback)&&this.ops.callback.apply(this,this.args||[]);	
				});
				return this;
			},
			getAuto:function(fn){
				var date=this.getDateInfo(),m_date,min_date,max_date;	
				if(!this.ops.year.min){
					this.ops.year.min=date.year-50;
				}else if(/now/g.test(this.ops.year.min)){
					this.ops.year.min=date.year;
				};
				if(!this.ops.year.max){
					this.ops.year.max=date.year+50;
				}else if(/now/g.test(this.ops.year.max)){
					this.ops.year.max=date.year;
				}else{
					this.ops.year.max=Math.max(this.ops.year.max,this.ops.year.min);		
				};
				if(!this.ops.year.select){
					this.ops.year.select=Math.max(this.ops.year.min,Math.min(this.ops.year.max,date.year));
				};
				if(this.ops.attach.enabled){
					var obj={
						month:{
							min:1,
							max:12,
							current:date.month	
						},
						quart:{
							min:1,
							max:4,
							current:this.getQuart(date.month)	
						}
					}[this.ops.attach.type];
					if(!this.ops.attach.min){
						this.ops.attach.min=obj.min;
					}else if(/now/g.test(this.ops.attach.min)&&this.ops.year.select==this.ops.year.max){
						this.ops.attach.min=obj.current;
					}else{
						this.ops.attach.min=Math.min(obj.max,this.ops.attach.min);	
					};
					if(!this.ops.attach.max){
						this.ops.attach.max=obj.max;
					}else if(/now/g.test(this.ops.attach.max)&&this.ops.year.select==this.ops.year.max){
						this.ops.attach.max=obj.current;
					}else{
						this.ops.attach.max=Math.max(obj.max,this.ops.attach.min);	
					};
					if(!this.ops.attach.select){
						this.ops.attach.select=Math.max(this.ops.attach.min,Math.min(this.ops.attach.max,obj.current));
					};
				};
				fn&&fn.call(this);
			},
			getQuart:function(month){
				return Math.ceil(month/3);	
			},
			getDateInfo:function(date){
				date=date||new Date();
				return {
					year:date.getFullYear(),
					month:date.getMonth()+1,
					day:date.getDate(),
					hour:date.getHours(),
					minute:date.getMinutes(),
					second:date.getSeconds(),
					weekend:date.getDay()	
				};
			},
			getNewDate:function(y,m,d){
				return new Date(y,m-1,d,1,1,1);	
			},
			setValue:function(){
				var str=this.ops.year.select+'年';
				if(this.ops.attach.enabled){
					var obj={
						month:{value:M.formatDate(this.ops.attach.select),unit:'月'},
						quart:{value:this.ops.attach.select,unit:'季度'}
					}[this.ops.attach.type];
					str+=obj.value+obj.unit;	
				};
				this.ops.target.val(str);	
			},
			exec:function(e){
				e.stopPropagation();
				var that=e.data.context;
				M(that._class('mt-pop-container')).hide();
				if(that.container){
					that.creatItem();
					that.container.show();
					that.size();
				}else{
					that.create();
				};	
			},
			create:function(){
				this.container=this.creatContainer();
				this.content=this.creatContent();
				this.group=this.creatElement('mt-calendar-group');
				this.main=this.creatElement('relative pad-bottom-5');
				this.group.append(this.main);
				this.creatItem();
				if(this.ops.tool.clear){
					this.button=this.creatElement('mt-calendar-button');
					if(this.ops.tool.clear){
						this.clear=M(M.creatlabel('a'),{
							'class':'btn',
							href:'javascript:;',
							html:'清空'
						});	
						this.button.append(this.clear);
						this.clear.bind('click',{context:this},this.clearValue);
					};
					this.main.after(this.button);
				};
				this.content.append(this.group);
				this.container.append(this.content).hide();
				M(document.body).append(this.container);
				this.size();
				M(window).bind('resize',function(e){
					this.size();	
				}.bind(this));
				M(document).bind('click',{context:this},this.hide);
				this.container.show().stopPropagation();
				delete this.group;
				delete this.content;
				delete this.button;
				delete this.clear;
			},
			size:function(){
				var o=M(window),
					width=this.ops.target.outerWidth(true),
					height=this.ops.target.outerHeight(true),
					offsetLeft=this.ops.target.offset().left,
					offsetTop=this.ops.target.offset().top,
					scrollLeft=o.scrollLeft(),
					scrollTop=o.scrollTop(),
					targetWidth=this.container.width(),
					targetHeight=this.container.height(),
					innerWidth=o.width(),
					innerHeight=o.height(),
					name=['left-top','right-top','left-bottom','right-bottom'],
					index;	
				if(offsetTop-scrollTop+height+targetHeight<=innerHeight){
					index=offsetLeft-scrollLeft+width+targetWidth<=innerWidth?0:1;
				}else{
					index=offsetLeft-scrollLeft+width+targetWidth<=innerWidth?2:3;	
				};
				this.container[0].className='mt-pop-container'.concat(String.fromCharCode(32)).concat(name[index]);
				this.container.css({
					0:{left:offsetLeft,top:offsetTop+height},
					1:{left:offsetLeft-targetWidth+width,top:offsetTop+height},
					2:{left:offsetLeft,top:offsetTop-targetHeight},
					3:{left:offsetLeft-targetWidth+width,top:offsetTop-targetHeight}	
				}[index]);
			},
			clearValue:function(e){
				var that=e.data.context;
				that.ops.year.select=that.cache.year.select;
				that.ops.year.max=that.cache.year.max;
				if(that.cache.attach){
					that.ops.attach.select=that.cache.attach.select;
					that.ops.attach.max=that.cache.attach.max;
				};
				that.setValue();
				that.hide();
				that.ops.target[0].value='';
				M.isFunction(that.ops.callback)&&that.ops.callback.apply(that,that.args||[]);	
			},
			setAttach:function(){
				if(this.ops.attach.enabled){
					this.ops.attach.max=this.ops.year.select<this.cache.year.max?{month:12,quart:4}[this.ops.attach.type]:this.cache.attach.max;	
					this.ops.attach.select=Math.min(this.ops.attach.select,this.ops.attach.max);	
				};
			},
			setStart:function(){
				this.ops.relative.point.ops.year.max=this.ops.year.select;
				if(this.ops.attach.enabled){
					this.ops.attach.min=this.ops.relative.point.ops.year.select==this.ops.year.select?this.ops.relative.point.ops.attach.select:this.cache.attach.min;
					this.ops.attach.max=this.ops.year.select==this.ops.year.max?this.cache.attach.max:this.ops.relative.point.cache.attach.max;
					this.ops.attach.select=Math.max(this.ops.attach.min,Math.min(this.ops.attach.select,this.ops.attach.max));
					this.setValue();
					this.ops.relative.point.ops.attach.max=this.ops.relative.point.ops.year.select==this.ops.year.select?this.ops.attach.select:this.ops.relative.point.cache.attach.max;		
				};
			},
			setStop:function(){
				this.ops.relative.point.ops.year.min=this.ops.year.select;
				if(this.ops.attach.enabled){
					this.ops.attach.max=this.ops.year.select==this.ops.year.max?this.ops.relative.point.ops.attach.select:this.cache.attach.max;
					this.ops.attach.min=this.ops.year.select>this.ops.year.min?1:this.cache.attach.min;
					this.ops.attach.select=Math.max(this.ops.attach.min,Math.min(this.ops.attach.select,this.ops.attach.max));
					this.setValue();
					this.ops.relative.point.ops.attach.min=this.ops.year.select==this.ops.relative.point.ops.year.select?this.ops.attach.select:this.cache.attach.min;		
				};
			},
			auto:function(){
				this['auto'+this.toCase(this.ops.relative.type)]();	
			},
			autoStop:function(){
				this.ops.relative.point.ops.year.min=this.ops.year.select;
				if(this.ops.attach.enabled&&this.ops.year.select==this.ops.relative.point.ops.year.select){
					this.ops.relative.point.ops.attach.min=this.ops.attach.select;	
				};
			},
			getPrevYear:function(e){
				var that=e.data.context,list=e.data.list,element=e.data.element;
				if(!e.data.animate){
					e.data.animate=true;
					list.start-=list.length;
					var box=that.compile(that.resolve(that.creatList(list.start,list.length,list.type)));
					element.panel.prepend(box).css({left:-that.distance}).animate({left:0},200,'easeOutQuad',function(){
						element.box.remove();
						element.box=box;
						that.addSelectYear(element,list);
						delete e.data.animate;
					});
				};
			},
			getNextYear:function(e){
				var that=e.data.context,list=e.data.list,element=e.data.element;
				if(!e.data.animate){
					e.data.animate=true;
					list.start+=list.length;
					var box=that.compile(that.resolve(that.creatList(list.start,list.length,list.type)));
					element.panel.append(box).animate({left:-that.distance},200,'easeOutQuad',function(){
						element.panel[0].style.left=0+'px';
						element.box.remove();
						element.box=box;
						that.addSelectYear(element,list);
						delete e.data.animate;
					});
				};
			},
			addSelectYear:function(element,data){
				this.disabled(element,data);
				element.box.find('li').bind('click',{context:this},this.select);
			},
			select:function(e){
				var that=e.data.context;
				if(!/disabled/g.test(this.className)){
					that.ops[/year/g.test(this.getAttribute('type'))?'year':'attach'].select=Number(this.innerHTML.match(/\d+/g)[0]);
					that.setAttach();
					that.setValue();	
					that.hide();
					that.ops.relative.type&&that.ops.relative.point&&that['set'+that.toCase(that.ops.relative.type)]();
					M.isFunction(that.ops.choose)&&that.ops.choose.apply(that,that.args);	
				};
			},
			toCase:function(str){
				return str.replace(/\b(\w)(\w*)/g,function($0,$1,$2){
					return $1.toUpperCase()+$2.toLowerCase();
				});	
			},
			disabled:function(ele,data){
				var m='disabled';
				data.min>=data.start?ele.prev.addClass(m):ele.prev.removeClass(m);
				data.max<=data.start+data.length-1?ele.next.addClass(m):ele.next.removeClass(m);
			},
			creatItem:function(){
				if(this.element){
					this.element&&delete this.element;	
					this.main[0].innerHTML='';
				};
				var data=this.creatList(this.ops.year.select-5,12,'year'),year=this.resolve(data);
				this.element={};
				this.element.year=this.invoke('year');
				this.element.year.box=this.compile(year);
				this.element.year.panel.append(this.element.year.box);
				this.main.append(this.element.year.main);
				this.addSelectYear(this.element.year,data);
				this.element.year.prev.bind('click',{context:this,list:data,element:this.element.year},this.getPrevYear);
				this.element.year.next.bind('click',{context:this,list:data,element:this.element.year},this.getNextYear);
				if(this.ops.attach.enabled){
					var attach=this.resolve(this.creatList(1,{month:12,quart:4}[this.ops.attach.type],this.ops.attach.type));
					this.element[this.ops.attach.type]=this.invoke(this.ops.attach.type);
					this.element[this.ops.attach.type].box=this.compile(attach);
					this.element[this.ops.attach.type].panel.append(this.element[this.ops.attach.type].box);
					this.main.append(this.element[this.ops.attach.type].main);
					this.element[this.ops.attach.type].box.find('li').bind('click',{context:this},this.select);
				};
				this.main.append(this.creatElement('clear'));	
			},
			invoke:function(type){
				var obj={};
				obj.main=this.creatElement('mt-calendar-item');
				obj.head=this.creatElement('mt-calendar-head '+{year:'first',quart:'last',month:'last'}[type]+(this.ops.attach.enabled?'':' last'));	
				obj.body=this.creatElement('mt-calendar-body');
				obj.fast=this.creatElement('mt-calendar-fast');
				obj.inner=this.creatElement('mt-calendar-inner');
				obj.panel=this.creatElement('mt-calendar-panel');
				obj.inner.append(obj.panel);
				obj.fast.append(obj.inner);
				obj.body.append(obj.fast);
				obj.main.append(obj.head).append(obj.body);
				if(/year/g.test(type)){
					obj.prev=this.creatElement('mt-calendar-fast-btn prev');
					obj.next=this.creatElement('mt-calendar-fast-btn next');
					obj.fast.append(obj.prev).append(obj.next);
				};	
				delete obj.body;
				delete obj.fast;
				delete obj.inner;
				return obj;	
			},
			compile:function(data){
				this.element[data.type].head.html(data.title);
				return this.creatElement('box').html(data.html);
			},
			resolve:function(data){
				for(var i=0,str='',tmp=this.renderList(),stp=/quart/g.test(data.type)?' w':'';i<data.list.length;i++){
					str+=M.template.resolve(tmp,{
						id:data.list[i].id,
						type:data.list[i].type,
						className:data.list[i].className+stp,
						unit:data.list[i].unit,
						value:data.list[i].value	
					});
				};
				return {
					title:M.template.resolve(this.renderTitle(),{value:[data.start,data.start+data.length-1].join('-'),unit:data.unit}),
					type:data.type,
					html:M.renderHTML({
						name:'ul',
						html:str
					})	
				};
			},
			creatList:function(start,length,type){
				var arr=[],obj={
					year:{min:this.ops.year.min,max:this.ops.year.max,current:this.ops.year.select,unit:''},
					quart:{min:this.ops.attach.min,max:this.ops.attach.max,current:this.ops.attach.select,unit:'季度'},
					month:{min:this.ops.attach.min,max:this.ops.attach.max,current:this.ops.attach.select,unit:'月'}
				}[type];
				for(var i=start;i<start+length;i++){
					arr.push({
						id:[this.id,i].join('_'),
						value:i,
						unit:obj.unit,
						type:type,
						className:i<obj.min||i>obj.max?'disabled':i==obj.current?'change selected':'change'
					});
				};
				return {
					min:obj.min,
					max:obj.max,
					start:start,
					type:type,
					length:length,
					unit:obj.unit.length?obj.unit:'年',
					list:arr	
				};
			},
			_class:function(name){
				return document.getElementsByClassName(name);
			},
			renderTitle:function(){
				return M.renderHTML({
					name:'i',
					html:'{{value}}{{unit}}'
				});
			},
			renderList:function(){
				return M.renderHTML({
					name:'li',
					proto:{
						id:'{{id}}',
						type:'{{type}}',
						'class':'{{className}}'
					},
					html:'{{value}}{{unit}}'
				});
			},
			creatElement:function(name){
				return M(M.creatlabel(),{
					'class':name
				});	
			},
			creatContainer:function(){
				return M(M.creatlabel(),{
					'class':'mt-pop-container',
					id:[this.id,M.now()].join('-'),
					css:{
						zIndex:M.now()	
					},
					html:M.renderHTML({
						proto:{
							'class':'mt-pop-shadow'
						}
					})
				});	
			},
			creatContent:function(){
				return M(M.creatlabel(),{
					'class':'mt-pop-content',
					css:{
						width:(this.ops.attach.enabled?2:1)*this.distance
					}
				});	
			},
			hide:function(e){
				(e?e.data.context:this).container.hide();	
			},
			dismiss:function(){
				this.container.remove();
				this.destroy();		
			},
			destroy:function(that){
				delete that||this;	
			}	
		};
		return {
			defaults:{
				target:null,
				year:{
					select:null, 
					min:null,
					max:null 
				},
				attach:{
					enabled:true,
					type:'month',
					select:null,  
					min:null, 
					max:null
				},
				auto:false,
				tool:{
					clear:false
				},
				relative:{
					type:null,
					point:null
				},
				callback:function(){},
				choose:function(){}
			},	
			init:function(ops){
				return new datePicker(M.extend(true,{},this.defaults,ops),[].slice.call(arguments,1));
			}
		};
	});
})(window.jQuery||window.Zepto||window.xQuery,window);