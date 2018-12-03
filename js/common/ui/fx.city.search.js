/** 
 * 城市分首字母弹出选择控件
 * created by mr.x on 16/05/06.
 * @import common/fx.common.js     
 *
 * @target		               	object              (必须)事件源			     						默认 null
 * @callback               		function            (可选)选择成功完成回调
 */
;(function(M,window){
	M.ui.define('citySearch',function(){
		function citySearch(ops,args){
			this.ops=ops;
			this.init(args);
		};
		citySearch.prototype={
			constructor:citySearch,
			init:function(args){
				if(!this.ops.target.length) return;
				this.targetElement=this.ops.target;
				this.valueElement=M('input[name='+this.targetElement[0].getAttribute("for")+']');
				this.split='热门城市|ABC|DEFG|HJK|LMN|PQRS|TUWX|YZ'.split('|');
				delete this.ops.target;
				this.targetElement.bind('click',function(){
					M(document.getElementsByClassName('mt-pop-container')).hide();
					if(this.container){
						this.container.show();
						this.size();
					}else{
						this.exec(args);
					};
					return false;
				}.bind(this));
				return this;
			},
			exec:function(args){
				this.container=this.creatContainer();
				this.content=this.creatContent();
				this.main=this.creatMain();
				this.close=this.creatClose();
				this.loading=this.creatLoad();
				this.empty=this.creatNull(args);
				this.main.append(this.loading).append(this.empty);
				this.content.append(this.creatTab()).append(this.main).append(this.close);
				this.container.append(this.content);
				this.list=[];
				M(document.body).append(this.container);
				this.creat(args);
				delete this.content;
				this.size();
				M(window).bind('resize',function(e){
					this.size();	
				}.bind(this));
				M(document).bind('click',{context:this},this.hide);
				this.close.bind('click',{context:this},this.hide);
				this.container.stopPropagation();
				this.tabber=this.container.find(document.getElementsByClassName('mt-pop-li'));
			},
			size:function(){
				var o=M(window),
					width=this.targetElement.outerWidth(true),
					height=this.targetElement.outerHeight(true),
					offsetLeft=this.targetElement.offset().left,
					offsetTop=this.targetElement.offset().top,
					scrollLeft=o.scrollLeft(),
					scrollTop=o.scrollTop(),
					targetWidth=this.container.width(),
					targetHeight=this.container.height(),
					innerWidth=o.width(),
					innerHeight=o.height(),
					outerHeight=M(document.body).height(),
					name=['left-top','right-top','left-bottom','right-bottom'],
					index;	
				if(offsetTop+height+targetHeight<=outerHeight){
					index=offsetLeft-scrollLeft+width+targetWidth<=innerWidth?0:1;
				}else{
					index=offsetLeft-scrollLeft+width+targetWidth<=innerWidth?2:3;	
				};
				this.container[0].className='mt-pop-container'.concat(String.fromCharCode(32)).concat('mini').concat(String.fromCharCode(32)).concat(name[index]);
				this.container.css({
					0:{left:offsetLeft,top:offsetTop+height},
					1:{left:offsetLeft-targetWidth+width,top:offsetTop+height},
					2:{left:offsetLeft,top:offsetTop-targetHeight},
					3:{left:offsetLeft-targetWidth+width,top:offsetTop-targetHeight}	
				}[index]);
			},
			creat:function(args){
				this.get(function(data){
					var name=this.targetElement[0].value;
					this.show(data,args);
					if(name.length){
						for(var i=0;i<this.data.length;i++){
							if(this.data[i].n==M.trim(name)){
								this.current=this.data[i].s;
								this.name=this.data[i].n;
								this.value=this.data[i].c;
								break;	
							};
						};
						if(this.current){
							for(i=0;i<this.split.length;i++){
								if(this.split[i].indexOf(this.current.substr(0,1).toUpperCase())!=-1){
									break;	
								};
							};
							this.tabber.removeClass('current').eq(i).addClass('current');
							this.main.children().hide().eq(i).show();
							this.size();
							this.change();
							delete this.current;
						};
					};
					delete this.split;
				});
			},
			show:function(data,args){
				this.list[0]=this.creatItem(M.renderHTML({
					name:'ul',
					html:this.resolve(data.hot,1)
				}),'block');
				for(var i=0;i<data.list.length;i++){
					for(var j=0,str='';j<data.list[i].length;j++){
						for(var m in data.list[i][j]){
							str+=M.renderHTML({
								proto:{
									'class':'mt-pop-list'	
								},
								html:M.renderHTML({
									proto:{
										'class':'mt-pop-label orange'	
									},
									html:m
								})+M.renderHTML({
									name:'ul',
									html:this.resolve(data.list[i][j][m],0)
								})
							});	
						};
					};
					this.list[i+1]=this.creatItem(str,'hide');	
				};
				for(var str='',i=0;i<this.list.length;i++){
					str+=this.list[i][0].outerHTML;
				};
				this.main[0].innerHTML=str;
				this.size();
				delete this.list;
				this.addEvent(args);	
			},
			addEvent:function(args){
				this.container.find(document.getElementsByClassName('mt-pop-piel')).bind('click',{context:this,args:args},this.select);
				this.tabber.bind('click',{context:this,args:args},this.tab);
				if(M.ui.fuzzy&&!this.fuzzy){
					this.fuzzy=M.ui.fuzzy.init({
						data:this.data,
						tip:true,
						target:this.targetElement,
						callback:this.ops.callback
					});	
				};
			},
			select:function(e){
				var that=e.data.context,args=e.data.args;
				that.name=this.innerHTML;
				that.value=this.getAttribute('uid');
				that.change();
				that.hide();
				M.isFunction(that.ops.callback)&&that.ops.callback.apply(that,args);	
			},
			tab:function(e){
				var target=M(this),that=e.data.context,index=target.index(),args=e.data.args;
				if(!/current/g.test(this.className)){
					target.addClass('current').siblings().removeClass('current');
					that.main.children().hide().eq(index).show();
					that.size();
				};
				return false;
			},
			change:function(){
				this.targetElement.val(this.name);
				this.valueElement.val(this.value);
			},
			resolve:function(data,type){
				var str='',name=type?'mini':'';
				for(var i in data){
					str+=M.template.resolve(this.renderItem(),{name:data[i].n,value:data[i].c,className:name});
				};
				return str;
			},
			get:function(fn){
				M.ui.ajax.init({
					url:M.getNormalPath('citySearchData.json',4),
					isload:false,
					//delay:300,
					beforeSend:function(){
						this.empty.hide();
						this.loading.show();
					},
					success:function(data){
						this.data=data.list;
						for(var i=0,m=[],z={};i<data.list.length;i++){
							var c=data.list[i].s.substr(0,1);
							if(!z[c]){
								z[c]=[];
							};
							z[c].push(data.list[i]);
						};
						data.list=z;
						i=0;
						delete z;
						for(var j in data.list){
							if(this.split[i+1]&&j==this.split[i+1].substr(0,1).toLowerCase()){
								i++;
								if(!m[i]){
									m[i]=[];
								};	
							};
							m[i].push(M.creatObj(j.toUpperCase(),z[j]));
						};
						m.shift();
						this.loading.hide();
						delete this.loading;
						delete this.empty;
						fn.call(this,{hot:data.hot,list:m});
					},
					error:function(msg){
						this.empty.show();
						this.loading.hide();
					}
				},this);	
			},
			hide:function(e){
				(e?e.data.context:this).container.hide();	
			},
			renderItem:function(){
				return '<li class="{{className}}"><a href="javascript:;" title="{{name}}" uid="{{value}}" class="mt-pop-piel">{{name}}</a></li>';	
			},
			renderTab:function(){
				return M.renderHTML({
					name:'li',
					proto:{
						'class':'mt-pop-li{{name}}'
					},
					html:'{{value}}'
				});
			},
			creatContainer:function(){
				return M(M.creatlabel(),{
					'class':'mt-pop-container mini',
					id:'mt-pop-'+M.now(),
					css:{
						width:452,
						zIndex:M.now()	
					},
					html:M.renderHTML({
						proto:{
							'class':'mt-pop-shadow'
						}
					})
				});	
			},
			creatItem:function(str,name){
				return M(M.creatlabel(),{
					'class':'mt-pop-item '+name,
					html:str	
				});	
			},
			creatTab:function(){
				for(var i=0,str='';i<this.split.length;i++){
					str+=M.template.resolve(this.renderTab(),{value:this.split[i],name:i>0?'':String.fromCharCode(32).concat('current')});
				};
				return M(M.creatlabel(),{
					'class':'mt-pop-tab',
					html:M.renderHTML({
						name:'ul',
						proto:{
							'class':'mini'	
						},
						html:str
					})
				});	
			},
			creatMain:function(){
				return M(M.creatlabel(),{
					'class':'mt-pop-main'
				});	
			},
			creatContent:function(){
				return M(M.creatlabel(),{
					'class':'mt-pop-content pad-bottom-5 pad-top-5',
					html:M.renderHTML({
						name:'p',
						proto:{
							'class':'mt-pop-tip'
						},
						html:'热门城市(支持汉字/拼音/英文字母)'
					})
				});	
			},
			creatClose:function(){
				return M(M.creatlabel(),{
					'class':'iconfont mt-pop-close mini',
					html:M.Font.close_empty
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
			creatNull:function(args){
				var reload=M(M.creatlabel('a'),{
					'class':'red',
					href:'javascript:;',
					html:'点击重试',
					click:function(){
						this.creat(args);
					}.bind(this)
				}),
				txt=M(M.creatlabel('p'),{
					html:'加载失败,'
				}).append(reload);
				return M(M.creatlabel(),{
					'class':'mt-pop-load hide'
				}).append(txt);
			},
			destroy:function(){
				delete this;	
			}	
		};
		return {
			defaults:{
				target:null,
				src:{
					loading:'base/load.gif'
				},
				callback:function(){}
			},	
			init:function(ops){
				return new citySearch(M.extend(true,{},this.defaults,ops),[].slice.call(arguments,1));
			}
		};
	});
})(window.jQuery||window.Zepto||window.xQuery,window);