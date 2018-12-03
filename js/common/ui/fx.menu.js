/** 
 * 自定义右键菜单
 * created by mr.x on 16/06/02.
 * @import common/fx.common.js 
 *
 * @data                  			array              		(必须)菜单数据      		  		 						默认 []
 * --''icon''     	  	  			string      			(可选)该条数据对应图标										默认 null    
 * --''text''     	  	  			string      			(可选)该条数据文本											默认 null    
 * --''target''     	  	  	  	string		      		(可选)该条数据对应打开方式									默认 '_self'  ⇒  '_blank'
 * --''href''     	 	  	 		string      			(可选)该条数据对应链接										默认 null
 * --''status''     	  	 		boolean      			(可选)该条数据是否可以点击									默认 true
 * --''sub''     	 	 	  		array      				(可选)该条数据下面二级数据									默认 []  ⇒ 该版本中该功能暂未开放   
 * --''callback''     	 	  	 	function      			(可选)该条数据点击之后回调											
 */
;(function(M,window){
	M.ui.define('menu',function(){
		function Menu(ops,args){
			this.ops=ops;
			this.init(args);
		};
		Menu.prototype={
			constructor:Menu,
			versions:'1.0.0',
			init:function(args){
				if(!this.ops.data.length) return;
				M(document).bind('mousedown',{context:this,args:args},this.exec);
				return this;
			},
			exec:function(e){
				if(e.which==3){
					e.stopPropagation();
					e.data.context.creat(e);
					document.oncontextmenu=function(){
						 return false;    
					};
				}else if(e.which==1){
					e.data.context.hide();
				};	
			},
			creat:function(e){
				if(this.container){
					this.container.show();
					this.size(e);
				}else{
					this.container=this.creatContainer();
					this.main=this.creatElement('mt-pop-content');
					this.content=this.creatElement('mt-menu-main');
					this.main.append(this.content);
					this.creatItem(e.data.args,this.ops.data);
					this.container.append(this.main);
					M(document.body).append(this.container);
					this.size(e);
					this.container.stopPropagation('mousedown');
					delete this.main;
				};
			},
			size:function(e){
				var o=M(window),
					offsetLeft=e.pageX,
					offsetTop=e.pageY,
					scrollLeft=o.scrollLeft(),
					scrollTop=o.scrollTop(),
					targetWidth=this.container.width(),
					targetHeight=this.container.height(),
					innerWidth=o.width(),
					innerHeight=o.height(),
					name=['left-top','right-top','left-bottom','right-bottom'],
					index;	
				if(offsetTop-scrollTop+targetHeight<=innerHeight){
					index=offsetLeft-scrollLeft+targetWidth<=innerWidth?0:1;
				}else{
					index=offsetLeft-scrollLeft+targetWidth<=innerWidth?2:3;	
				};
				this.container[0].className='mt-pop-container mt-menu-container'.concat(String.fromCharCode(32)).concat(name[index]);
				this.container.css({
					0:{left:offsetLeft,top:offsetTop},
					1:{left:offsetLeft-targetWidth,top:offsetTop},
					2:{left:offsetLeft,top:offsetTop-targetHeight},
					3:{left:offsetLeft-targetWidth,top:offsetTop-targetHeight}	
				}[index]);
			},
			creatItem:function(args,data){
				for(var i=0;i<data.length;i++){
					var inner=this.creatElement('mt-menu-item');
					for(var j=0;j<data[i].length;j++){
						var ele=document.createElement('a');
						ele.href=data[i][j].href||'javascript:;';	
						ele.innerHTML=data[i][j].text;
						ele.title=data[i][j].text;
						if(data[i][j].href&&data[i][j].status){
							ele.target=data[i][j].target;
						};
						if(this.ops.data[i][j].icon){
							M(ele).prepend(this.renderIcon(M.Font[data[i][j].icon],1));
						};
						if(this.ops.data[i][j].sub.length){
							M(ele).append(this.renderIcon());
							/*if(data[i][j].status){
								M(ele).bind('mouseover',{context:this},this.mouseover);
								M(ele).bind('mouseout',{context:this},this.mouseout);
							};*/
						};
						if(!data[i][j].status){
							ele.className='disabled';	
							ele.href='javascript:;';	
							M(ele).preventDefault();
						}else{
							!data[i][j].href&&M(ele).bind('click',{context:this,data:data[i][j],args:args},this.selectItem);	
						};
						inner.append(M(ele));
					};
					this.content.append(inner);
				};	
			},
			selectItem:function(e){
				var that=e.data.context,data=e.data.data;
				that.hide();
				M.isFunction(data.callback)&&data.callback.apply(that,e.data.args);	
			},
			renderIcon:function(text,type){
				return M.renderHTML({
					name:'i',
					proto:{
						'class':'iconfont m'+(type||2)
					},
					html:text||M.Font.arrow_right_empty
				});	
			},
			creatElement:function(name){
				return M(M.creatlabel(),{
					'class':name
				});	
			},
			creatContainer:function(){
				return M(M.creatlabel(),{
					'class':'mt-pop-container mt-menu-container',
					id:'mt-menu-'+M.now(),
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
			hide:function(e){
				var that=e?e.data.context:this;
				that.container&&that.container.hide();	
			},
			destroy:function(){
				delete this;	
			}	
		};
		return {
			defaults:{
				data:[
					[
						{
							icon:null,
							text:null,
							href:null,
							target:'_self',
							status:true,
							sub:[],
							callback:function(){}
						}
					]
				]
			},	
			init:function(ops){
				return new Menu(M.extend(true,{},this.defaults,ops),[].slice.call(arguments,1));
			}
		};
	});
})(window.jQuery||window.Zepto||window.xQuery,window);