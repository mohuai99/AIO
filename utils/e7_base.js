namespace = function(){
    var argus = arguments;
    for(var i = 0; i < argus.length; i++){
        var objs = argus[i].split(".");
		var obj = window;
        for(var j = 0; j < objs.length; j++){
            obj[objs[j]] = obj[objs[j]] || {};
            obj = obj[objs[j]];
        }
    }
    return obj;
};

(function(){
	/**
	 * 为对象进行扩展属性和方法
	 * @param {object} object 对象
	 * @return {bool} 是/否
	 */	 
	nimei.base.extend = function(destination, source) {
		if (destination == null) {
			destination = source
		}
		else {
			for (var property in source){		
				if ( getParamType(source[property]).toLowerCase() === "object" && 
					getParamType(destination[property]).toLowerCase() === "object" )
						extend(destination[property], source[property])
				else
					destination[property] = source[property];
			}
		}
		return destination;
	}
	
	nimei.base.extendLess = function(destination, source) {
		var newopt = source;
		for (var i in destination) {
			if (isObject(source) && typeof(source[i]) != 'undefined') {
				destination[i] = newopt[i]
			}
		}
		return destination
	}
	
	/**
	 * 类式继承类
	 * @param {object} subClass 子类
	 * @param {object} superClass 基础类
	 * @return {undefined} 
	 */	
	nimei.base.extendClass = function(subClass,superClass){
		var F = function(){};
		F.prototype = superClass.prototype;
		subClass.prototype = new F();
		subClass.prototype.constructor = subClass;
		subClass.superclass = superClass.prototype;
		if (superClass.prototype.constructor == Object.prototype.constructor){
			superClass.prototype.constructor = superClass
		}
	}
	
	/**
	 * 原型继承类
	 * @param {object} object 基类
	 * @return {object} 生成的子类
	 */	 
	nimei.base.cloneClass = function(object){		
		if(!isObject(object)) return object;
		if(object == null) return object;
		var F = new Object();
		for(var i in object)
			F[i] = cloneClass(object[i]);
		return F; 		
	}

	nimei.base.extend( nimei.base, {
		/**
		 * 判断对象是否定义
		 * 其实只对对象中的元素判断有效，如是纯变量，此方法会无法调用，需要外面加try
		 * @param {object} object 对象
		 * @return {bool} 是/否
		 */
		isUndefined : function(o){ 
    		 	return o === undefined && typeof o == "undefined";
    	},
		/**
		 * 判断对象是否数组
		 * @param {object} object 对象
		 * @return {bool} 是/否
		 */
		isArray : function(obj) {
			return getParamType(obj).toLowerCase() === "array";
		},		
		/**
		 * 判断对象是否函数
		 * @param {object} object 对象
		 * @return {bool} 是/否
		 */
		isFunction : function(obj){
			return getParamType(obj).toLowerCase() === "function";
		},		
		/**
		 * 判断对象是否对象
		 * @param {object} object 对象
		 * @return {bool} 是/否
		 */
		isObject : function(obj) {
			return getParamType(obj).toLowerCase() === "object";
		},
		/**
		 * 判断对象是否数值
		 * @param {object} object 对象
		 * @return {bool} 是/否
		 */
		isNumber : function(obj) {
			return getParamType(obj).toLowerCase() === "number";
		},
		/**
		 * 判断对象是否字符串
		 * @param {object} object 对象
		 * @return {bool} 是/否
		 */
		isString : function(obj) {
			return getParamType(obj).toLowerCase() === "string";
		},
		/**
		 * 判断是否布尔值
		 * @param {object} object 对象
		 * @return {bool} 是/否
		 */
		isBoolean : function(obj) {
			return getParamType(obj).toLowerCase() === "boolean";
		},
		/**
		 * 判断对象是否日期
		 * @param {object} object 对象
		 * @return {bool} 是/否
		 */
		isDate : function(obj){
			return getParamType(obj).toLowerCase() === "date";
		},
		
		/**
		 * 判断对象是否DOM元素
		 * @param {object} obj DOM对象
		 * @return {bool} 是/否
		 */
		isDom : function(obj){
    		try{
    			return obj && typeof obj === "object" && !isUndefined(obj.nodeType) && obj.nodeType==1 && !isUndefined(obj.nodeName) && typeof obj.nodeName == "string";
    		}
    		catch(e){
    			//console.log(e)
    			return false;
    		}
    	},
    	
		/**
		 * 获取DOM对象的值
		 * @param {object} obj DOM对象
		 * @return {string} 取value或innerHTML
		 */
    	getDomVal : function(obj){
    		return obj.value || obj.innerHTML;
    	},
    	
    	/**
		 * 获取dom对象
		 * @param {string|dom} dom的id或对象
		 * @return {dom} 
		 */
		g : function(obj){
			return (typeof obj=='object')?obj:document.getElementById(obj);
		}
	});
	
	/**
	 * 获取对象类型
	 * @private
	 * @param {object} object 对象
	 * @return {string} 类型
	 * 可判断类型：Boolean Number String Function Array Date RegExp Object
	 */	
	function getParamType(obj){
		return obj == null ? String(obj) : 
			Object.prototype.toString.call(obj).replace(/\[object\s+(\w+)\]/i,"$1") || "object";
	}	
})();