/** 
 * 三级城市下拉选择控件
 * created by mr.x on 16/05/04.
 * @import common/fx.common.js     common/ui/fx.select.js 
 *
 * @container	               	object              (必须)内容块			     						默认 null
 * @data        		               								
 * ''provice''   			  	string      		(可选)省份										默认 null 
 * ''city''   			  	  	string      		(可选)城市										默认 null
 * ''area''   			  	  	string      		(可选)区域										默认 null
 * @callback               		function            (可选)选择成功完成回调
 */
;(function(M,window){
	M.ui.define('citySelect',function(){
		function citySelect(ops,args){
			this.ops=ops;
			this.init(args);
		};
		citySelect.prototype={
			constructor:citySelect,
			init:function(args){
				if(this.ops.container==null) return;
				for(var i=0,o={};i<this.ops.container.children.length;i++){
					o[this.ops.container.children[i].getAttribute('for')]=M(this.ops.container.children[i]);
				};
				this.ops.provice=o.provice;
				this.ops.city=o.city;
				this.ops.area=o.area;
				delete o;
				this.creat(args);
				return this;
			},
			creat:function(args){
				this.get(function(data){
					this._provice(data,args);
				});
			},
			_provice:function(data,args){
				this.provice=M.ui.select.init({
					title:'请选择省份',
					container:this.ops.provice,
					callback:function(that){
						that._city(data[this.value].l,args);
						M.isFunction(that.ops.callback)&&that.ops.callback.apply(that,['provice'].concat(args));
					}
				},this);
				this.resolve(this.provice,data);
				this.provice.on();
				this.auto(data);
			},
			auto:function(data){
				if(this.ops.data.provice){
					this.provice.set(data[this.ops.data.provice].n,this.ops.data.provice);
					if(data[this.ops.data.provice].l&&this.ops.city.length){
						this._city(data[this.ops.data.provice].l);
						if(this.ops.data.city){
							this.city.set(data[this.ops.data.provice].l[this.ops.data.city].n,this.ops.data.city);
							if(data[this.ops.data.provice].l[this.ops.data.city].l&&this.ops.area.length){
								this._area(data[this.ops.data.provice].l[this.ops.data.city].l);
								if(this.ops.data.area){
									this.area.set(data[this.ops.data.provice].l[this.ops.data.city].l[this.ops.data.area].n,this.ops.data.area);
								};
							};
						};
					};
				};	
			},
			_city:function(data,args){
				if(!this.city){
					this.city=M.ui.select.init({
						title:'请选择城市',
						container:this.ops.city,
						callback:function(city,that){
							if(that.ops.area.length){
								if(city[this.value].l){
									that._area(city[this.value].l,args);
								}else{
									if(that.area){
										that.area.off();
										that.area.forbid();		
										that.area&&delete that.area;	
									};
								};
							};
							M.isFunction(that.ops.callback)&&that.ops.callback.apply(that,['city'].concat(args));
						}
					},data,this);
				};
				if(this.city){
					this.city.args[0]=data;
					this.resolve(this.city,data);
					this.city.on();
				};
				if(this.area){
					this.resolve(this.area,[]);
					this.area.forbid();	
					this.area.off();
					delete this.area;	
				};		
			},
			_area:function(data,args){
				if(!this.area){
					this.area=M.ui.select.init({
						title:'请选择区域',
						container:this.ops.area,
						callback:function(that){
							M.isFunction(that.ops.callback)&&that.ops.callback.apply(that,['area'].concat(args));
						}
					},this);
				};
				if(this.area){
					this.resolve(this.area,data);
					this.area.on();
					this.area.forbid();	
					this.area.addEvent(this.area.args);
				};
			},
			resolve:function(target,data){
				var str='';
				for(var i in data){
					str+=M.template.resolve(this.render(),{name:data[i].n,value:i});
				};
				target.refresh(str);
			},
			get:function(fn){
				M.ui.ajax.init({
					url:M.getNormalPath('cityQueryData.json',4),
					isload:false,
					success:function(data){
						fn.call(this,data);
					},
					error:function(msg){
						M.ui.waiting.creat({status:false,time:500,text:msg});
						
					}
				},this);	
			},
			render:function(){
				return '<div class="mt-select-list" uid="{{value}}" title="{{name}}">{{name}}</div>';	
			},
			destroy:function(){
				delete this;	
			}	
		};
		return {
			defaults:{
				data:{
					provice:null,
					city:null,
					area:null	
				},
				container:null,
				callback:function(){}
			},	
			init:function(ops){
				return new citySelect(M.extend(true,{},this.defaults,ops),[].slice.call(arguments,1));
			}
		};
	});
})(window.jQuery||window.Zepto||window.xQuery,window);