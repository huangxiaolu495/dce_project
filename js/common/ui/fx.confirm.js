/** 
 * 确认框控件
 * created by mr.x on 16/04/18.
 * @import common/fx.common.js 
 *
 * @id                     		string              (可选)对象id										默认 null
 * @drag	               		boolean             (可选)是否允许拖拽			     					默认 true
 * @html              			string              (可选)内容  		 								默认 null 
 * @title              			string              (可选)标题,支持html标签 	  		 				默认 系统提示
 * @position               		string              (必须)定位方式      	   		 					默认 fixed ⇒ fixed/absolute
 * @status              		boolean             (可选)icon状态			  		 				默认 null
 * @is_close_button	            boolean             (可选)是否允许关闭按钮			     				默认 true
 * @time                   		number              (可选)自动消失时间        		 					默认 null
 * @data                  		object              (可选)ajax请求参数     							默认null 
 * @url                    		string              (可选)Ajax请求地址     							默认null
 * --@button			  	  	object				
 * --''href''     	  		  	string      		(可选)按钮链接										默认 null    
 * --''html''     	  		  	string      		(可选)按钮文字,支持html标签							默认 '关闭'  
 * --''callback''     	  		function      		(可选)点击回调								
 * @close               		function            (可选)关闭之后回调
 */
;(function(M,window){
	M.ui.define('confirm',function(){
		function Confirm(ops,args){
			this.ops=ops;
			this.init(args);
		};
		Confirm.prototype={
			constructor:Confirm,
			init:function(args){
				this.creat(args);
				return this;
			},
			creat:function(args){
				this.innerHeight=M(window).height();
				this.scrollTop=/absolute/g.test(this.ops.position)?M(window).scrollTop():0;
				this.container=M(M.creatlabel(),{
					'class':'mt-master-container mt-confirm-master',
					id:this.ops.id||'mt-confirm-'+M.now(),
					css:{
						opacity:0,
						position:'absolute',
						height:M(document).height(),
						zIndex:M.now()
					}	
				});
				this.content=M(M.creatlabel(),{
					'class':'mt-master-content mt-confirm-container',
					css:{
						position:this.ops.position	
					},
					html:this.renderIcon()
				});
				if(M.isString(this.ops.title)){
					this.title=this.renderTitle();
					this.content.append(this.title);
					if(this.ops.drag){
						M.ui.drag.init({target:this.title,container:this.content});
					};
				};
				this.body=this.renderBody();
				this.button=this.renderButton(args);
				this.content.append(this.body);
				this.content.append(this.button);
				M(document.body).append(this.container.append(this.content));
				this.resolve(args);
			},
			resolve:function(args){
				var that=this,width=Math.max(300,this.content.width()),height=this.content.outerHeight(true);
				this.container.fadeTo(300,1);
				this.content.css({
					left:'50%',
					opacity:0,
					marginLeft:-0.5*(width+100),
					width:width,
					top:(this.innerHeight-height)*0.5+this.scrollTop,
					marginTop:-30
				}).animate({marginTop:0,opacity:1},300,function(){
					delete that.body;
					delete that.scrollTop;
					delete that.innerHeight;
					delete that.button;
					delete that.title;
					that.dismiss(args);		
				});	
			},
			dismiss:function(args){
				M.isNumeric(this.ops.time)&&M.delay(this.ops.time,function(){
					this.remove(this,this.ops.button[this.ops.button.length-1].callback,args);	
				},this);
			},
			remove:function(that,fn,args){
				this.content.animate({top:this.content.position().top+30,opacity:0},300,function(){
					that.container.remove();
					M.isFunction(fn)&&fn.apply(that,args);
					that.destroy(that);
				});	
				that.container.fadeOut(300);
			},
			submit:function(e){
				var that=e.data.context,args=e.data.args,type=e.data.type,callback=e.data.callback;
				switch(type){
					case  0 : 
						if(that.ops.url==null){
							that.remove(that,callback,args);
						}else{
							M.ui.ajax.init({
								url:that.ops.url,
								data:that.ops.param,
								isload:false,
								beforeSend:function(){
									that.waiting=M.ui.waiting.creat({warp:that.content,hide:false});	
								},
								success:function(data){
									M.delay(1,function(){
										delete that.waiting;
										that.remove(that,callback,[data].concat(args));
									});
								},
								error:function(msg){
									M.delay(300,function(){
										that.waiting.cancel();
										delete that.waiting;
										M.ui.waiting.creat({status:false,warp:that.content,text:msg,time:500});	
									});
								}
							},this);
						};
						break ;	
					case  1 : 
						that.remove(that,callback,args);
						break ;	
					default : break ;	
				};	
			},
			renderBody:function(){
				return M(M.creatlabel(),{
					'class':'mt-confirm-content',
					html:this.ops.html
				});	
			},
			renderIcon:function(){
				return M.renderHTML({
					name:'em',
					proto:{
						'class':'iconfont mt-confirm-icon'
					},
					html:this.ops.icon
				});	
			},
			renderButton:function(args){
				var o=M(M.creatlabel(),{
					'class':'mt-confirm-button'
				});
				for(var color=['blue','white'],list=[],i=0;i<this.ops.button.length;i++){
					M(M.creatlabel('a'),{
						'class':color[i]+' mt-confirm-sure-button',
						href:this.ops.button[i].href||'javascript:;',
						html:this.ops.button[i].html
					}).bind('click',{context:this,callback:this.ops.button[i].callback,type:i,args:args},this.submit).appendTo(o);
				};
				return o;
			},
			renderTitle:function(){
				return M(M.creatlabel(),{
					'class':'mt-confirm-title',
					html:this.ops.title
				});
			},
			destroy:function(that){
				delete that;	
			}	
		};
		return {
			defaults:{
				id:null,
				drag:true,
				title:'系统提示',
				position:'fixed',
				html:'请输入您的提示文字内容',
				icon:M.Font.error_fill_triangle,
				time:null,
				param:null,
				url:null, 
				button:[
					{
						href:null,
						html:'确认',
						callback:function(){}
					},
					{
						href:null,
						html:'关闭',
						callback:function(){}
					}
				]
			},	
			init:function(ops){
				return new Confirm(M.extend(true,{},this.defaults,ops),[].slice.call(arguments,1));
			}
		};
	});
})(window.jQuery||window.Zepto||window.xQuery,window);