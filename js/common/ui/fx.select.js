/** 
 * 下拉选择控件
 * created by mr.x on 16/04/25.
 * @import common/fx.common.js    common/ui/fx.scroll.js 
 *
 * @container	               	object              (必须)内容块			     						默认 null
 * @defaults              		boolean             (必须)是否改变下拉头  		 						默认 true
 * @title	              		string              (可选)默认标题		  		 						默认 '请选择'
 * @callback               		function            (可选)选择成功完成回调
 */
;(function(M,window){
	M.ui.define('select',function(){
		function Select(ops,args){
			this.ops=ops;
			this.init(args);
		};
		Select.prototype={
			constructor:Select,
			init:function(args){
				if(!this.ops.container.length) return;
				this.args=args;
				this.container=this.ops.container
				this.title=this.ops.container.children().eq(0);
				this.inner=this.title.children().eq(0);
				this.body=this.ops.container.children().eq(1);
				this.list=this.body.children().eq(0).children();
				this.input=this.body.children().eq(1)[0];
				this.titleHeight=this.title.height()+2;
				this.selectHeight=this.body.outerHeight(true);
				this.windowHeight=M(document.body).height();
				this.text=this.ops.title;
				this.value='';
				if(this.ops.defaults&&this.input&&this.input.value.length){
					var v=this.list.filter('[uid='+this.input.value+']');
					if(v.length){
						this.value=this.input.value;
						this.text=v.text();
						this.inner[0].innerHTML=this.text;	
					};
				};
				this.msg=this.input?this.input.getAttribute('error'):this.container.attr('error');
				this.addEvent(args);
				delete this.ops.container;
				return this;
			},
			addEvent:function(args){
				this.title.bind('click',{context:this,args:args},this.creat);
				this.list.bind('click',{context:this,args:args},this.select);
				M(document).bind('click',{context:this},this.hide);
			},
			creat:function(e){
				var that=e.data.context,args=e.data.args,top=that.container.offset().top;
				M(document.getElementsByClassName('mt-pop-container')).hide();
				M(document.getElementsByClassName('mt-select-body')).not(that.body).hide();
				if(!that.container.hasClass('disabled')){
					if(that.body.is(':hidden')){
						that.body.show().css(that.selectHeight+that.titleHeight+top>=that.windowHeight?{top:'auto',bottom:that.titleHeight}:{bottom:'auto',top:that.titleHeight});
						if(!that.scroll){
							that.scroll=M.ui.scroll.init({
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
								container:that.body
							});
						};
					}else{
						that.body.hide();
					};
				};
				return false;
			},
			hide:function(e){
				(e?e.data.context:this).body.hide();	
			},
			select:function(e){
				var target=M(this),that=e.data.context,args=e.data.args;
				that.input.value=that.value=target.attr('uid');
				that.input&&(that.input.value=that.value);
				that.inner[0].innerHTML=that.text=target.text();
				that.setTrue();
				that.hide();
				M.isFunction(that.ops.callback)&&that.ops.callback.apply(that,args);
			},
			refresh:function(data){
				this.set();
				this.body.children()[0].innerHTML=this.get(data);
				this.selectHeight=this.body.outerHeight(true);
				this.list=this.body.children().eq(0).children();
				this.list.bind('click',{context:this,args:this.args},this.select);
				this.container.removeClass('error').removeClass('true');
				if(this.scroll){
					this.scroll.clear();	
					delete this.scroll;
				};
			},
			set:function(name,value){
				this.text=name||this.ops.title;
				this.value=value||'';
				this.input&&(this.input.value=this.value);	
				this.inner[0].innerHTML=this.text;
			},
			on:function(){
				this.container.removeClass('disabled');
			},
			off:function(){
				this.container.addClass('disabled');
			},
			forbid:function(){
				this.title.unbind('click');	
				this.list.unbind('click');
			},
			get:function(data){
				for(var i=0,str='',c=this.render();i<data.length;i++){
					str+=M.template.resolve(c,data[i]);
				};
				return str;
			},
			render:function(){
				return M.renderHTML({
					proto:{
						'class':'mt-select-list',
						uid:'{{value}}',
						title:'{{name}}'
					},
					html:'{{name}}'
				});
			},
			setError:function(){
				this.container.removeClass('true').addClass('error');	
			},
			setTrue:function(){
				this.container.removeClass('error').addClass('true');	
			},
			destroy:function(){
				delete this;	
			}	
		};
		return {
			defaults:{
				defaults:true,
				title:'请选择',
				container:null,
				callback:function(){}
			},	
			init:function(ops){
				return new Select(M.extend(true,{},this.defaults,ops),[].slice.call(arguments,1));
			}
		};
	});
})(window.jQuery||window.Zepto||window.xQuery,window);