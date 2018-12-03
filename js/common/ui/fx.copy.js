/** 
 * 复制
 * created by mr.x on 16/06/02.
 * @import common/fx.common.js     
 *
 * @target		               	object              (必须)事件源			     						默认 null
 * @text		               	string              (必须)需要复制的内容			     				默认 null
 * @callback               		function            (可选)复制完成回调
 */
;(function(M,window){
	M.ui.define('copy',function(){
		function Copy(ops,args){
			this.ops=ops;
			this.init(args);
		};
		Copy.prototype={
			constructor:Copy,
			init:function(args){
				if(!this.ops.target.length) return;
				if(!!M.browser.versions.ie){
					this.ops.target.bind('click',{context:this,args:args},this.compile);
				}else{
					this.exec(this,args);
				};
				return this;
			},
			exec:function(that,args){
				ZeroClipboard.setMoviePath(M.getNormalPath('common/ui/ZeroClipboard.swf',2));
				that.clip=new ZeroClipboard.Client();
				that.clip.setHandCursor(true);					
				that.clip.addEventListener('mouseOver',function(client){
					that.clip.setText(that.ops.text);
				});			
				that.clip.addEventListener('complete',function(client,text){
					that.resolve(args);
				});			
				that.clip.glue(that.ops.target[0],that.ops.target[0].parentNode);
			},
			compile:function(e){
				var that=e.data.context,args=e.data.args;
				window.clipboardData.setData('text',that.ops.text); 
				that.resolve(args);
			},
			resolve:function(args){
				M.ui.waiting.creat({status:true,time:500,text:'复制成功'});			
				M.isFunction(this.ops.callback)&&this.ops.callback.apply(this,args);	
			},
			destroy:function(){
				delete this;	
			}	
		};
		return {
			defaults:{
				target:null,
				text:null,
				callback:function(){}
			},	
			init:function(ops){
				return new Copy(M.extend(true,{},this.defaults,ops),[].slice.call(arguments,1));
			}
		};
	});
})(window.jQuery||window.Zepto||window.xQuery,window);