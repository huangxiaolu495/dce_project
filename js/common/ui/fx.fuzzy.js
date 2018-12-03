/** 
 * 模糊搜索控件
 * created by mr.x on 16/05/09.
 * @import common/fx.common.js   common/ui/fx.scroll.js    
 *
 * @target		               	object              (必须)事件源			     						默认 null
 * @tip		               		boolean             (可选)是否展示右边标记			     				默认 false
 * @isClick		               	boolean             (可选)是否点击即触发			     				默认 false
 * @data                  		object              (可选)已知数据     								默认 null 
 * @param                  		object              (可选)ajax请求参数     							默认 null 
 * @url                    		string              (可选)Ajax请求地址     							默认 null
 * @callback               		function            (可选)选择成功完成回调
 */
;(function(M,window){
	M.ui.define('fuzzy',function(){
		function Fuzzy(ops,args){
			this.ops=ops;
			this.init(args);
		};
		Fuzzy.prototype={
			constructor:Fuzzy,
			init:function(args){
				if(!this.ops.target.length) return;
				this.targetElement=this.ops.target;
				this.valueElement=M('input[name='+this.targetElement[0].getAttribute("for")+']');
				delete this.ops.target;
				this.targetElement.bind('keyup',function(){
					M(document.getElementsByClassName('mt-pop-container')).hide();
					if(this.targetElement[0].value.length){
						if(this.container){
							this.container.show();
							this.creat(args);
						}else{
							this.exec(args);
						};
					}else{
						this.hide();
					};
					return false;
				}.bind(this));
				if(this.ops.isClick){
					this.targetElement.bind('click',function(){
						M(document.getElementsByClassName('mt-pop-container')).hide();
						if(this.container){
							this.container.show();
							this.creat(args);
						}else{
							this.exec(args);
						};
						return false;
					}.bind(this));	
				};
				return this;
			},
			exec:function(args){
				this.container=this.creatContainer();
				this.content=this.creatContent();
				this.main=this.creatMain();
				this.loading=this.creatLoad();
				this.empty=this.creatNull();
				this.content.append(this.main).append(this.loading);
				this.container.append(this.content).append(this.empty);
				M(document.body).append(this.container);
				this.creat(args);
				this.size();
				M(window).bind('resize',function(e){
					M.delay(300,function(){
						this.size();
					},this);	
				}.bind(this));
				M(document).bind('click',{context:this},this.hide);
				this.container.stopPropagation('touchstart');
			},
			size:function(){
				var o=M(window),
					height=this.targetElement.parent().outerHeight(true),
					offsetLeft=this.targetElement.parent().offset().left,
					offsetTop=this.targetElement.parent().offset().top,
					scrollTop=o.scrollTop(),
					targetHeight=this.container.height(),
					innerHeight=o.height(),
					outerHeight=M(document.body).height(),
					name=['left-top','left-bottom'],
					index;	
				index=offsetTop+height+targetHeight<=outerHeight?0:1;
				this.container.css({
					0:{left:offsetLeft,top:offsetTop+height},
					1:{left:offsetLeft,top:offsetTop-targetHeight}
				}[index||0]).css({width:this.targetElement.parent().outerWidth(true)});
			},
			creat:function(args){
				this.get(function(data){
					this.loading.hide();
					this.empty.hide();
					if(data.length){
						this.resolve(data,args);
					}else{
						this.main[0].innerHTML='';
						this.empty.show().html(this.setNull(this.targetElement[0].value,1));
						//this.hide();
					};
					this.size();
				});
			},
			addEvent:function(args){
				this.main.children().bind('click',{context:this,args:args},this.select);
			},
			select:function(e){
				var that=e.data.context,args=e.data.args;
				that.name=this.innerHTML.replace(/\<(.*)\>/g,'');
				that.value=this.getAttribute('uid');
				that.change();
				that.hide();
				M.isFunction(that.ops.callback)&&that.ops.callback.apply(that,args);	
			},
			change:function(){
				//this.targetElement.val(this.name);
				this.valueElement.val(this.value);
			},
			resolve:function(data,args){
				for(var i=0,str='';i<data.length;i++){
					str+=M.template.resolve(this.ops.tip?this.renderItemTip():this.renderItem(),{name:data[i].title,value:data[i].uid,tip:data[i].s});
				};
				this.main[0].innerHTML=str;
				if(!this.scroll){
					this.scroll=M.ui.scroll.init({
						scrollbar:{
							place:true,
							style:{
								marginLeft:3,
								marginRight:3,
								marginTop:3,
								marginBottom:3,
								size:3
							}	
						},
						container:this.content
					});
				}else{
					this.scroll.refresh();	
					this.scroll.scrollTop();
				};
				this.addEvent(args);
			},
			get:function(fn){
				if(this.ops.data){
					var value=this.targetElement[0].value.toLowerCase(),re=/^[\u4e00-\u9fa5]+$/g.test(value);
					for(var i=0,arr=[];i<this.ops.data.length;i++){
						if((re?this.ops.data[i].n:this.ops.data[i].s).substr(0,1).toLowerCase()==value.substr(0,1)){
							if((re?this.ops.data[i].n:this.ops.data[i].s).toLowerCase().indexOf(value)!=-1){
								arr.push(this.ops.data[i]);	
							};
						};
					};
					fn.call(this,arr);
				}else{
					M.ui.ajax.init({
						url:this.ops.url,
						param:M.extend({key:this.targetElement[0].value},this.ops.param),
						isload:false,
						beforeSend:function(){
							this.empty.hide();
							this.loading.hide();
						},
						success:function(data){
							
							data=data.RETURN.list;
							
							// mock 
							var value=this.targetElement[0].value.toLowerCase(),re=/^[\u4e00-\u9fa5]+$/g.test(value);
							if(value.length){
								for(var i=0,arr=[];i<data.length;i++){
									//if(data[i].title.substr(0,1).toLowerCase()==value.substr(0,1)){
										if(data[i].title.indexOf(value)!=-1){
											arr.push(data[i]);	
										};
									//};
								};
								fn.call(this,arr);
							}else{
								fn.call(this,data);
							};
							
							// normal
							//fn.call(this,data);
						},
						error:function(msg){
							this.empty.show().html(this.setNull(msg,0));
							this.loading.hide();
							this.size();
						}
					},this);		
				};
			},
			hide:function(e){
				(e?e.data.context:this).container.hide();	
			},
			renderItem:function(){
				return '<li uid="{{value}}">{{name}}</li>';	
			},
			renderItemTip:function(){
				return '<li uid="{{value}}">{{name}}<i class="tip">{{tip}}</i></li>';	
			},
			creatContainer:function(){
				return M(M.creatlabel(),{
					'class':'mt-pop-container mt-fuzzy-container',
					id:'mt-pop-'+M.now(),
					css:{
						zIndex:M.now(),
						width:this.targetElement.parent().outerWidth(true)	
					}
				});	
			},
			creatMain:function(){
				return M(M.creatlabel('ul'),{
					'class':'mt-pop-fuzzy'
				});	
			},
			creatContent:function(){
				return M(M.creatlabel(),{
					'class':'mt-pop-content mt-fuzzy-content'
				});	
			},
			creatLoad:function(){
				return M(M.creatlabel(),{
					'class':'mt-pop-load',
					html:M.renderHTML({
						name:'img',
						proto:{
							src:M.getNormalPath(this.ops.src.loading)	
						}
					})
				});
			},
			creatNull:function(){
				return M(M.creatlabel(),{
					'class':'mt-pop-null hide'
				})
			},
			setNull:function(text,status){
				return status?'没有“'+M.renderHTML({
					name:'i',
					proto:{
						'class':'orange'	
					},
					html:text
				})+'”相关的搜索':text;	
			},
			destroy:function(){
				delete this;	
			}	
		};
		return {
			defaults:{
				target:null,
				url:null,
				param:null,
				data:null,
				tip:false,
				isClick:false,
				src:{
					loading:'base/load.gif'
				},
				callback:function(){}
			},	
			init:function(ops){
				return new Fuzzy(M.extend(true,{},this.defaults,ops),[].slice.call(arguments,1));
			}
		};
	});
})(window.jQuery||window.Zepto||window.xQuery,window);