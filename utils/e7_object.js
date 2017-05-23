(function(){

extend( nimei.object, {
	/**
	 * 序列化JSON对象
	 * 对object转化为url参数字符串，各属性间以&分隔，如a=1&b=2&c=3
	 * 对象属性为string 则进行encodeURIComponent编码
	 * 对象属性为bool 则以0代表false 1代表true
	 * 对象属性为对象，则会继续进行递归序列化
	 * 对象属性为function 则返回function.toString
	 * @param {object} jsonObj json对象
	 * @return {string}
	 */
	serialize : function(jsonObj){
		var newJsonObj = null;
		if (typeof(jsonObj) == 'undefined' || typeof(jsonObj) == 'function') 
			newJsonObj = '';
		if (typeof(jsonObj) == 'number') 
			newJsonObj = jsonObj.toString();			
		if (typeof(jsonObj) == 'boolean') 
			newJsonObj = (jsonObj) ? '1' : '0';
		if (typeof(jsonObj) == 'object') {
			if (!jsonObj) newJsonObj = '';
			if (jsonObj instanceof RegExp) newJsonObj = jsonObj.toString();
		}
		if (typeof(jsonObj) == 'string') 
			newJsonObj = jsonObj;		
		if (typeof(newJsonObj) == 'string') 
			return encodeURIComponent(newJsonObj);
			
		var ret = [];
		if (jsonObj instanceof Array) {
			for (var i = 0; i < jsonObj.length; i++) {
				if (typeof(jsonObj[i]) == 'undefined') 	continue;
				ret.push(typeof(jsonObj[i]) == 'object' ? '' : nimei.serialize(jsonObj[i]))
			}
			return ret.join('|')
		} 
		else {
			for (var i in jsonObj) {				
				if (typeof(jsonObj[i]) == 'undefined') 	continue;
				newJsonObj = null;
				if (typeof(jsonObj[i]) == 'object') {
					if (jsonObj[i] instanceof Array) {
						newJsonObj = jsonObj[i];
						ret.push(i + '=' + nimei.serialize(newJsonObj));
					} else {
						ret.push(i + '=')
					}
				} else {
					newJsonObj = jsonObj[i];
					ret.push(i + '=' + nimei.serialize(newJsonObj));
				}
			}
			return ret.join('&')
		}
	},
	/**
	 * 反序列化为JSON对象
	 * 对url参形形式的对象反序列化成为JSON对象
	 * 与serialize相对应
	 * @param {object} jsonObj json对象
	 * @return {string}
	 */
	unSerialize : function(jsonStr, de){
		de = de || 0;
		jsonStr = jsonStr.toString();
		if (!jsonStr) return {};
		var retObj = {}, 
			obj1Ret = jsonStr.split('&');
		if (obj1Ret.length == 0) return retObj
		for (var i = 0; i < obj1Ret.length; i++) {
			if (!obj1Ret[i]) continue;
			var ret2 = obj1Ret[i].split('=');
			if (ret2.length >= 2) {
				var ret0 = obj1Ret[i].substr(0, obj1Ret[i].indexOf('=')),
					ret1 = obj1Ret[i].substr(obj1Ret[i].indexOf('=') + 1);
				if (!ret1) ret1 = '';
				if (ret0) retObj[ret0] = de == 0? decodeURIComponent(ret1) : ret1;
			}
		}
		return retObj;
	},
	/**
	 * 对整个object进行utf8格式的url解码
	 * @param {object} newopt 解码对象
	 * @return {object} 已解码对象
	 */
	decode : function(newopt) {
		if (typeof(newopt) == 'string') {
			try {
				return decodeURIComponent(newopt)
			} catch(e) {}
			return newopt
		}
		if (typeof(newopt) == 'object') {
			if (newopt == null) {
				return null
			}
			if (newopt instanceof Array) {
				for (var i = 0; i < newopt.length; i++) {
					newopt[i] = nimei.decode(newopt[i])
				}
				return newopt
			} else if (newopt instanceof RegExp) {
				return newopt
			} else {
				for (var i in newopt) {
					newopt[i] = nimei.decode(newopt[i])
				}
				return newopt
			}
		}
		return newopt
	}
	
});
})();