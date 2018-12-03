/** 
 * 弹出框控件
 * created by mr.x on 16/04/14.
 * @import common/fx.common.js   common/ui/fx.waiting.js  common/ui/fx.status.js   common/ui/fx.drag.js   common/ui/fx.scroll.js
 *
 * @id                     		string              (可选)对象id										默认 null
 * @drag	               		boolean             (可选)是否允许拖拽			     					默认 true
 * @html              			string              (可选)内容  		 								默认 null
 * @url               			string              (可选)Ajax请求地址       	   		 				默认 null
 * @data             			object              (可选)ajax请求参数  	  		 					默认 null
 * @title              			string              (可选)标题,支持html标签 	  		 				默认 null
 * @position               		string              (必须)定位方式      	   		 					默认 fixed ⇒ fixed/absolute
 * @width                   	number              (必须)初始化宽度        		 					默认 400
 * @height                  	number              (必须)初始化高度      		  		 				默认 200
 * @is_close_button	            boolean             (可选)是否允许关闭按钮			     				默认 true
 * @src							string				(必须)所需图片路径	
 * @callback               		function            (可选)初始化完成回调
 * @close               		function            (可选)关闭之后回调
 */
;(function(M,window){
	M.ui.define('dialog',function(){
		function Dialog(ops,args){
			this.ops=ops;
			this.init(args);
		};
		Dialog.prototype={
			constructor:Dialog,
			init:function(args){
				M.ui.loadImage.init({
					pic:M.getNormalPath(this.ops.src.loading),
					onComplete:function(that){
						M.isString(that.ops.html)?that.set(args,that.ops.html):that.exec(true,args);
					}
				},this);
				return this;
			},
			creat:function(args,fn){
				if(!this.tip(['waiting','status'])){
					return ;	
				};
				this.titleHeight=M.isString(this.ops.title)?51:0;
				this.size=40;
				this.innerHeight=M(window).height();
				this.maxHeight=M(document).height();
				this.scrollTop=/absolute/g.test(this.ops.position)?M(window).scrollTop():0;
				this.container=M(M.creatlabel(),{
					'class':'mt-master-container mt-dialog-master',
					id:this.ops.id||'mt-dialog-'+M.now(),
					css:{
						position:'absolute',
						height:M(document).height(),
						zIndex:M.now()
					}	
				});
				this.content=M(M.creatlabel(),{
					'class':'mt-master-content',
					css:{
						position:this.ops.position,
						left:'50%',
						width:this.ops.width,
						marginLeft:-0.5*this.ops.width,
						height:this.titleHeight+this.ops.height,
						top:(this.innerHeight-this.titleHeight-this.ops.height)*0.5+this.scrollTop,
						marginTop:0
					}
				});
				if(M.isString(this.ops.title)){
					this.title=this.renderTitle();
					this.content.append(this.title);
				};
				if(this.ops.is_close_button){
					this.close=this.renderClose();
					this.content.append(this.close);
					this.close.bind('click',{context:this,args:args},this.dismiss);
				};
				this.body=this.renderBody();
				this.error=this.renderError();
				this.main=this.renderMain();
				this.body.append(this.error);
				this.body.append(this.main);
				this.content.append(this.body);
				M(document.body).append(this.container.append(this.content));	
				fn.call(this,args);
			},
			exec:function(status,args){
				M.ui.ajax.init({
					dataType:'text',
					url:this.ops.url,
					data:this.ops.data,
					isload:status,
					success:function(data){
						M.delay(1,function(){
							this.waiting&&delete this.waiting;
							this.set(args,data);
						},this);
					},
					error:function(msg){
						//M.ui.waiting.creat({status:false,time:500,text:msg});
						if(this.waiting){
							M.delay(300,function(){
								M.ui.waiting.dismiss(this.waiting,[],0);
								M(document.getElementsByClassName('error')[0],this.body)[0].innerHTML=msg;
								delete this.waiting;
								this.error.show();
							},this);
						}else{
							this.error(msg,args);
						};
					}
				},this);
			},
			set:function(args,data){
				this.creat(args,function(args){
					this.main[0].innerHTML=data;
					var box=this.main.children('div'),width=box.outerWidth(true),height=box.outerHeight(true),top;
					if(height>=this.innerHeight-2*this.size){
						this.ops.position='absolute';
						this.content.css({position:this.ops.position});
					};
					if(/absolute/g.test(this.ops.position)){
						this.scrollTop=M(window).scrollTop();
						if(height>this.maxHeight-2*this.size){
							if(this.tip(['scroll'])){
								this.scroll=true
								M('html,body').css({overflowY:'hidden',height:this.innerHeight});
								M(window).bind('resize',function(e){
									M('html,body').css({height:M(window).height()});
								}.bind(this));
							};
						}else{
							top=height+2*this.size>this.innerHeight?this.scrollTop+height+2*this.size>=this.maxHeight?this.maxHeight-this.size-height-this.titleHeight:this.scrollTop+this.size:(this.innerHeight-this.titleHeight-height)*0.5+this.scrollTop;
						};
					}else{
						top=(this.innerHeight-this.titleHeight-height)*0.5+this.scrollTop;
					};
					this.resolve(this,width,height,top,function(that){
						box.css({visibility:'visible'}).hide().fadeIn(300,function(){
							that.ops.drag&&that.tip(['drag'])&&!!!that.scroll&&M.ui.drag.init({target:that.title,container:that.content});
							delete that.titleHeight;
							delete that.body;
							delete that.main;
							delete that.scrollTop;
							delete that.innerHeight;
							delete that.maxHeight;
							delete that.size;
							delete that.close;
							delete that.title;
							M.isFunction(that.ops.callback)&&that.ops.callback.apply(that,args);
						});
						if(that.scroll){
							that.scroll=M.ui.scroll.init({
								scrollbar:{
									className:'dialog',
									style:{
										marginLeft:10,
										marginRight:10,
										marginTop:10,
										marginBottom:10,
										size:8
									}	
								},
								container:this.container,
								mouseWheelSpeed:50
							});
						};
					});
				});	
			},
			error:function(msg,args){
				M.ui.loadImage.init({
					pic:M.getNormalPath(this.ops.src.error),
					onComplete:function(that){
						that.creat(args,function(args){
							M(document.getElementsByClassName('error')[0],this.body)[0].innerHTML=msg;
							var _w=M(window).width()>=768?600:300,_h=M(window).width()>=768?337:169;
							this.resolve(this,_w,_h,(this.innerHeight-this.titleHeight-_h)*0.5+this.scrollTop,function(){
								this.error.fadeIn(300,function(){
									M(document.getElementsByClassName('reload')[0],this.body).bind('click',function(){
										that.error.hide();
										that.waiting=M.ui.waiting.creat({warp:that.body,hide:false});	
										that.exec(false,args);
									})
								});
							});
						});
					}
				},this);
			},
			resolve:function(that,width,height,top,fn){
				that.ops.loading&&M.ui.waiting.creat({warp:this.body});
				this.content.animate({width:width,height:height+this.titleHeight,marginLeft:-width*0.5,top:top},500,'easeOutBack',function(){
					that.ops.loading&&M.ui.waiting.dismiss();
					fn.call(that,that);
				});
				this.body.animate({width:width,height:height},500,'easeOutBack');	
			},
			tip:function(list){
				for(var i=0,flag=true;i<list.length;i++){
					if(!M.ui[list[i]]){
						M.ui.status.init({
							html:'缺少 <i class="red">'+list[i]+'</i> 组件 ⇒ <i class="red">'+M.getNormalPath('fx.'+list[i]+'.js',2)+'</i>',
							status:false,
							button:{
								html:'确定'
							},
							close:function(){
								console.log(this);	
							}
						});
						flag=false;
						break;	
					};
				};
				return flag;
			},
			renderMain:function(){
				return 	M(M.creatlabel(),{
					'class':'mt-master-main relative'
				});	
			},
			renderBody:function(){
				return M(M.creatlabel(),{
					'class':'mt-master-body',
					css:{
						width:this.ops.width,
						height:this.ops.height
					}
				});	
			},
			renderError:function(){
				return M(M.creatlabel(),{
					'class':'mt-master-error hide',
					html:M.renderHTML({
						name:'img',
						proto:{
							'class':'block',
							src:M.getNormalPath(this.ops.src.error)
						}
					})+M.renderHTML({
						name:'p',
						proto:{
							'class':'error'
						}
					})+M.renderHTML({
						name:'span',
						html:'您可以：'+M.renderHTML({
							name:'a',
							proto:{
								href:'javascript:;',
								'class':'reload'
							},
							html:'刷新试试'
						})
					})
				});		
			},
			renderClose:function(){
				return M(M.creatlabel(),{
					'class':'mt-master-close'
				});	
			},
			renderTitle:function(){
				return M(M.creatlabel(),{
					'class':'mt-master-head',
					html:M.renderHTML({
						proto:{
							'class':'title'
						},
						html:this.ops.title
					})
				});
			},
			dismiss:function(e){
				var that=e.data.context;
				that.remove(that,e.data.args);
				return false;	
			},
			remove:function(that,args){
				that.container.fadeOut(300,function(){
					that.container.remove();
					if(that.scroll){
						M('html,body').css({height:'auto',overflowY:'visible'});
						that.scroll&&delete that.scroll;
					};
					M.isFunction(that.ops.close)&&that.ops.close.apply(that,args);
				});
			},
			destroy:function(){
				delete this;	
			}	
		};
		return {
			defaults:{
				id:null,
				drag:true,
				url:null,
				data:null,
				title:null,
				position:'fixed',
				width:400,
				height:200,
				html:null,
				loading:true,
				is_close_button:true,
				src:{
					loading:'base/loading.gif',
					error:'base/y_error.jpg'
				},
				callback:function(){},
				close:function(){}
			},	
			init:function(ops){
				return new Dialog(M.extend(true,{},this.defaults,ops),[].slice.call(arguments,1));
			}
		};
	});
})(window.jQuery||window.Zepto||window.xQuery,window);