/** 
 * 分页
 * created by mr.x on 16/06/02.
 * @import common/fx.common.js 
 *
 * @container                   object              (必须)展示对象										默认 null
 * @total                     	number              (必须)一共多少条信息								默认 0
 * @items	               		number              (必须)每页对应多少条信息			     				默认 10
 * @number               		number              (必须)显示多少条分页,超出打点      	   		 		默认 10
 * @current             		number              (必须)当前页,从0开始 	  		 					默认 0 
 * @entries              		number              (可选)距离多少页出现省略号 	  		 				默认 2
 * @prev/@next                 	       								  	
 * --''enabled''     	  	  	boolean      		(可选)是否出现										默认 true    
 * --''text''     	  	  	  	string		      	(可选)文本										默认 '上一页'  ⇒  '下一页'  
 * @callback               		function            (可选)选择之后回调
 */
;(function(M,window){
	M.ui.define('page',function(){
		function Page(ops,args){
			this.ops=ops;
			this.init(args);
		};
		Page.prototype={
			constructor:Page,
			init:function(args){
				if(this.ops.container==null) return;
				this.ops.maxPage=this.getMaxNumber();
				this.creat(args);
				return this;
			},
			prev:function(e){
				var that=e.data.context,args=e.data.args;
				if(that.ops.current>0){
					that.ops.current--;	
					that.creat(args,that.ops.callback||[]);
				};
			},
			next:function(e){
				var that=e.data.context,args=e.data.args;
				if(that.ops.current<that.ops.maxPage-1){
					that.ops.current++;	
					that.creat(args,that.ops.callback||[]);
				};
			},
			creat:function(args,fn){
				var interval=this.getInterval(),str='';
				if(this.ops.prev.enabled){
					if(this.ops.current==0){
						str+=M.template.resolve(this.renderItem(),{text:'&#xe64a;',className:'iconfont disabled first'});	
						str+=M.template.resolve(this.renderItem(),{text:this.ops.prev.text,className:'iconfont disabled prev'});	
					}else{
						str+=M.template.resolve(this.renderButton(),{text:'&#xe64a;',title:'首页',page:'0',className:'iconfont page-btn first _go_'});	
						str+=M.template.resolve(this.renderButton(),{text:this.ops.prev.text,title:'上一页',page:(this.ops.current-1).toString(),className:'iconfont page-btn prev _go_'});	
					};
				};
				if(interval[0]>0&&this.ops.entries>0){
					var end=Math.min(this.ops.entries,interval[0]);
					for(var i=0;i<end;i++){
						str+=this.creatInner(i+1);
					};
					if(this.ops.entries<interval[0]){
						str+='<span class="dian">...</span>';
					};
				};
				for(var i=interval[0];i<interval[1];i++){
					str+=this.creatInner(i+1);
				};
				if(interval[1]<this.ops.maxPage&&this.ops.entries>0){
					if(this.ops.maxPage-this.ops.entries>interval[1]){
						str+='<span class="dian">...</span>';	
					};	
					for(var i=Math.max(this.ops.maxPage-this.ops.entries,interval[1]);i<this.ops.maxPage;i++){
						str+=this.creatInner(i+1);
					};
				};
				if(this.ops.next.enabled){
					if(this.ops.current==this.ops.maxPage-1){
						str+=M.template.resolve(this.renderItem(),{text:this.ops.next.text,className:'iconfont disabled next'});	
						str+=M.template.resolve(this.renderItem(),{text:'&#xe647;',className:'iconfont disabled last'});	
					}else{
						str+=M.template.resolve(this.renderButton(),{text:this.ops.next.text,title:'下一页',page:(this.ops.current+1).toString(),className:'iconfont page-btn next _go_'});	
						str+=M.template.resolve(this.renderButton(),{text:'&#xe647;',title:'最后一页',page:(this.ops.maxPage-1).toString(),className:'iconfont page-btn last _go_'});	
					};
				};
				if(this.ops.isText){
					str='<em class="text">共查询到'+M.getFormatNumber(this.ops.total).split('.')[0]+'条数据，'+this.ops.maxPage+'页</em>'+str;
				};
				if(this.ops.isInput){
					str+=this.renderNumber();	
				};
				this.ops.container.innerHTML=str;
				this.ops.list=M(this.ops.container.children);
				this.ops.list.filter(function(){
					return /_go_/g.test(this.className); 
				}).bind('click',{context:this,args:args},this.resolve);
				if(this.ops.isInput){
					this.ops.list.find('a.submit').bind('click',{context:this,args:args},this.submit);	
					this.ops.list.find('input.number').bind('keyup',{context:this,args:args},this.keyup);	
				};
				M.isFunction(fn)&&fn.apply(this,args);
			},
			submit:function(e){
				var that=e.data.context,args=e.data.args,input=M(this).prev();
				if(input.val().length){
					that.ops.current=Number(input[0].value)-1;	
					input[0].value='';
					that.creat(args,that.ops.callback||[]);
				}else{
					return input.focus();
				};
			},
			keyup:function(e){
				if(!/^[0-9]\d*$/.test(this.value)){
					this.value='';	
				};
				this.value=Math.min(e.data.context.ops.maxPage,Math.max(0,Number(this.value)));
			},
			resolve:function(e){
				var that=e.data.context,args=e.data.args;
				that.ops.current=Number(this.getAttribute('page'));	
				that.creat(args,that.ops.callback||[]);
			},
			getMaxNumber:function(){
				return Math.ceil(this.ops.total/this.ops.items);
			},
			getInterval:function(){
				var half=Math.ceil(this.ops.number/2),limit=this.ops.maxPage-this.ops.number;
				return [
					this.ops.current>half?Math.max(Math.min(this.ops.current-half,limit),0):0,
					this.ops.current>half?Math.min(this.ops.current+half,this.ops.maxPage):Math.min(this.ops.number,this.ops.maxPage)
				];	
			},
			creatInner:function(page){
				return page==this.ops.current+1?M.template.resolve(this.renderItem(),{text:page.toString(),className:'current'}):M.template.resolve(this.renderButton(),{text:page.toString(),title:page,page:(page-1).toString(),className:'normal _go_'});	
			},
			renderNumber:function(){
				return '<div class="page">\
					<input type="text" class="number"/>\
					<a href="javascript:;" class="btn submit">GO</a>\
				</div>';	
			},
			renderButton:function(){
				return M.renderHTML({
					name:'a',
					proto:{
						title:'{{title}}',
						page:'{{page}}',
						href:'javascript:;',
						'class':'{{className}}'
					},
					
					html:'{{text}}'
				});
			},
			renderItem:function(){
				return M.renderHTML({
					name:'span',
					proto:{
						'class':'{{className}}'
					},
					html:'{{text}}'
				});
			},
			destroy:function(){
				delete this;	
			}	
		};
		return {
			defaults:{
				container:null,
				total:0,
				items:10,
				number:10,
				current:0,
				entries:2,
				isText:false,
				isInput:false,
				prev:{
					enabled:true,
					text:M.Font.arrow_left_empty
				},
				next:{
					enabled:true,
					text:M.Font.arrow_right_empty
				},
				callback:function(){}
			},	
			init:function(ops){
				return new Page(M.extend(true,{},this.defaults,ops),[].slice.call(arguments,1));
			}
		};
	});
})(window.jQuery||window.Zepto||window.xQuery,window);