/** 
 * 3D球形文字
 * created by mr.x on 16/08/16.
 */

function _3DText(id){
	this.dtr=Math.PI/180;
	this.d=300;
	this.mcList=[];
	this.active=false;
	this.distr=true;
	this.tspeed=10;
	this.size=250;
	this.mouseX=0;
	this.mouseY=0;
	this.howElliptical=1;
	this.list=document.getElementById(id);
	this.box=this.list.children;
	this.radius=this.list.offsetWidth*0.5;
	this.init();
	return this;
};

_3DText.prototype.init=function(){
	for(i=0,that=this;i<this.box.length;i++){
		this.mcList.push({
			offsetWidth:this.box[i].offsetWidth,
			offsetHeight:this.box[i].offsetHeight	
		});
	};
	this.sineCosine(0,0,0);
	this.positionAll();
	this.list.onmouseover=function(){
		that.active=true;
	};
	this.list.onmouseout=function(){
		that.active=false;
	};
	this.list.onmousemove=function(ev){
		var oEvent=window.event||ev;
		that.mouseX=oEvent.clientX-(that.list.offsetLeft+that.list.offsetWidth/2);
		that.mouseY=oEvent.clientY-(that.list.offsetTop+that.list.offsetHeight/2);
		that.mouseX/=5;
		that.mouseY/=5;
	};
	setInterval(function(){
		that.update();	
	},30);
};

_3DText.prototype.update=function(){
	this.lasta=this.lastb=0.5;
	if(this.active){
		this.lasta=(-Math.min(Math.max(-this.mouseY,-this.size),this.size)/this.radius)*this.tspeed;
		this.lastb=(Math.min(Math.max(-this.mouseX,-this.size),this.size)/this.radius)*this.tspeed;
	}else{
		this.lasta=this.lasta*0.98;
		this.lastb=this.lastb*0.98;
	};
	if(Math.abs(this.lasta)<=0.01&& Math.abs(this.lastb)<=0.01) return;
	this.sineCosine(this.lasta,this.lastb,0);
	for(var j=0;j<this.mcList.length;j++){
		var rx1=this.mcList[j].cx,ry1=this.mcList[j].cy*this.ca-this.mcList[j].cz*this.sa,rz1=this.mcList[j].cy*this.sa+this.mcList[j].cz*this.ca;
		var rx2=rx1*this.cb+rz1*this.sb,ry2=ry1,rz2=rz1*this.cb-rx1*this.sb;
		var rx3=rx2*this.cc-ry2*this.sc,ry3=rx2*this.sc+ry2*this.cc,rz3=rz2;
		var per=this.d/(this.d+rz3);
		this.mcList[j].cx=rx3;
		this.mcList[j].cy=ry3;
		this.mcList[j].cz=rz3;
		this.mcList[j].x=(this.howElliptical*rx3*per)-(this.howElliptical*2);
		this.mcList[j].y=ry3*per;
		this.mcList[j].scale=per;
		this.mcList[j].alpha=per;
		this.mcList[j].alpha=(this.mcList[j].alpha-0.6)*(10/6);
	};
	this.doPosition();
	this.depthSort();		
};

_3DText.prototype.depthSort=function(){
	for(i=0,aTmp=[];i<this.box.length;i++){
		aTmp.push(this.box[i]);
	};
	aTmp.sort(function(vItem1,vItem2){
		if(vItem1.cz>vItem2.cz){
			return -1;
		}else if(vItem1.cz<vItem2.cz){
			return 1;
		}else{
			return 0;
		};
	});
	for(i=0;i<aTmp.length;i++){
		aTmp[i].style.zIndex=i;
	};
};

_3DText.prototype.positionAll=function(){
	var phi=0,theta=0,max=this.mcList.length,aTmp=[],oFragment=document.createDocumentFragment();
	for(i=0;i<this.box.length;i++){
		aTmp.push(this.box[i]);
	};
	aTmp.sort(function(){
		return Math.random()<0.5?1:-1;	
	});
	for(i=0;i<aTmp.length;i++){
		oFragment.appendChild(aTmp[i]);
	};
	this.list.appendChild(oFragment);
	for(var i=1;i<max+1;i++){
		if(this.distr){
			phi=Math.acos(-1+(2*i-1)/max);
			theta=Math.sqrt(max*Math.PI)*phi;
		}else{
			phi=Math.random()*(Math.PI);
			theta=Math.random()*(2*Math.PI);
		};
		this.mcList[i-1].cx=this.radius*Math.cos(theta)*Math.sin(phi);
		this.mcList[i-1].cy=this.radius*Math.sin(theta)*Math.sin(phi);
		this.mcList[i-1].cz=this.radius*Math.cos(phi);
		this.box[i-1].style.left=this.mcList[i-1].cx+this.list.offsetWidth/2-this.mcList[i-1].offsetWidth/2+'px';
		this.box[i-1].style.top=this.mcList[i-1].cy+this.list.offsetHeight/2-this.mcList[i-1].offsetHeight/2+'px';
		this.box[i-1].style.position='absolute';
	};
};

_3DText.prototype.doPosition=function(){
	var l=this.list.offsetWidth/2,t=this.list.offsetHeight/2;
	for(var i=0;i<this.mcList.length;i++){
		this.box[i].style.left=this.mcList[i].cx+l-this.mcList[i].offsetWidth/2+'px';
		this.box[i].style.top=this.mcList[i].cy+t-this.mcList[i].offsetHeight/2+'px';
		this.box[i].style.fontSize=Math.ceil(12*this.mcList[i].scale/2)+8+'px';
		this.box[i].style.filter='alpha(opacity='+100*this.mcList[i].alpha+')';
		this.box[i].style.opacity=this.mcList[i].alpha;
	};
};

_3DText.prototype.sineCosine=function(a,b,c){
	this.sa=Math.sin(a*this.dtr);
	this.ca=Math.cos(a*this.dtr);
	this.sb=Math.sin(b*this.dtr);
	this.cb=Math.cos(b*this.dtr);
	this.sc=Math.sin(c*this.dtr);
	this.cc=Math.cos(c*this.dtr);
};