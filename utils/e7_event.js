(function(){
var event = nimei.event;
extend( event, {
	/**
	 * 停止事件继续进行
	 * @param {event} e 事件
	 * @return {dom} 
	 */
	preventDefault : function(e){
		if (e.preventDefault){
			e.preventDefault();
		}
		else{
			e.returnValue = false;
		}
	},
	/**
	 * 阻止事件冒泡传递
	 * @param {event} e 事件
	 * @return {dom} 
	 */
	stopPropagation : function(e){
		if (e.stopPropagation){
			e.stopPropagation();			
		}
		else{
			e.cancelBubble = true;
		}
	},
	/**
	 * 为DOM对象增加事件
	 * @param {dom} element dom对象
	 * @param {string} type 事件名称
	 * @param {function} type 事件方法
	 * @return {undefined} 
	 */
	addEvent : function(el, type, fn){
		if (window.addEventListener){
			el['e'+type+fn] = fn;
			el[type+fn] = function(e){
				var _e = e || window.event,
					_r = el['e'+type+fn](_e);
				if (_r==false) {
					nimei.preventDefault(_e);
					nimei.stopPropagation(_e);
				}				
			}			
			el.addEventListener(type, el[type+fn], false);	
		}
		else if (window.attachEvent){
			el['e'+type+fn] = fn;
			el[type+fn] = function(e){
				var _r = el['e'+type+fn](window.event);
				if (_r==false) nimei.preventDefault(window.event);
			}
			el.attachEvent( 'on'+type, el[type+fn] );
			return;
		}
		else{
			el['on' + type] = fn;
		}
	},	
	/**
	 * 为DOM对象移除事件
	 * @param {dom} element dom对象
	 * @param {string} type 事件名称
	 * @param {function} type 事件方法
	 * @return {undefined} 
	 */
	removeEvent : function (el, type, fn){
		if (window.removeEventListener){
			el.removeEventListener(type, el[type+fn], false);
			el[type+fn] = null;	
		}
		else if (window.detachEvent){		
			el.detachEvent( 'on'+type, el[type+fn] );			
			el[type+fn] = null;			
			return;
		}
		else{
			el['on' + type] = null;
		}
	},
	isReady : false,
	readyFn : [],
	/**
	 * dom ready事件
	 * @param {dom} element dom对象
	 * @param {string} type 事件名称
	 * @param {function} type 事件方法
	 * @return {undefined} 
	 */
	ready : function (fn){	
		bindReadyEvent();	
		if ( nimei.isReady ){
			fn.call();
		}
		else {
			if (isFunction(fn)){
				nimei.readyFn.push(fn);
			}
		}
	}
});

function bindReadyEvent(){
	if(document.readyState === 'complete'){
		return ready();
	}
	if(document.addEventListener){
		document.addEventListener("DOMContentLoaded", function(){
			document.removeEventListener("DOMContentLoaded", arguments.callee, false);
			ready();
		},false);
		window.addEventListener("load", ready, false);
	}
	else if(document.attachEvent){
		document.attachEvent("onreadystatechange", function(){
			if (document.readyState === "complete"){
				document.detachEvent("onreadystatechange", arguments.callee);
				ready();
			}
		});
		window.attachEvent("onload",ready);
		if(document.documentElement.doScroll && window == window.top){
			if(nimei.isReady) return;
			try{
				document.documentElement.doScroll("left");
			}catch(e){
				setTimeout(arguments.callee, 0);
				return;
			}
			ready();
		}
	}
}

function ready(){
	if(!nimei.isReady){
		if(!document.body){
			return setTimeout(ready,13);
		}
		nimei.isReady = true;
		
		if(nimei.readyFn.length >0){
			var i=0,fn;
			while(fn = nimei.readyFn[i++])
				fn.call();
			nimei.readyFn.length = 0;
		}
			
	}
}

})();