(function(){

var number = nimei.number;
extend( number, {
	/**
	 * 是否某一范围的整数
	 * @param {int} n 数值
	 * @param {int} iMin 范围低值
	 * @param {int} iMax 范围高值
	 * @return {bool} 
	 */
	isInt : function(n, iMin, iMax){
		if(!isFinite(n)) {
			return false;
		}
		if(!/^[+-]?\d+$/.test(n)) {
			return false;   
		}
		if(iMin!=undefined && parseInt(n)<parseInt(iMin)) {
			return false;
		}
		if(iMax!=undefined && parseInt(n)>parseInt(iMax)) {
			return false;
		}    
		return true;
	},
	/**
	 * 是否某一范围浮点数
	 * @param {float} n 数值
	 * @param {float} fMin 范围低值
	 * @param {float} fMax 范围高值
	 * @return {bool} 
	 */
	isFloat : function(n, fMin, fMax){
		if(!isFinite(n)) {
			return false;
		}
		if(fMin!=undefined && parseFloat(n)<parseFloat(fMin)) {
			return false;
		}
		if(fMax!=undefined && parseFloat(n)>parseFloat(fMax)) {
			return false;
		}
		return true;
	},
	/**
	 * 是否QQ号码
	 * @param {int} qq qq号
	 * @return {bool} 
	 */
	isQQ : function(qq){
		return /^[1-9]{1}\d{4,11}$/.test(qq); 
		// /^[1-9]\d{4,11}$/.test(qq) && parseInt(qq)<=4294967294;   
	},
	/**
	 * 取随机整数
	 * @param {int} n 整数
	 * @return {int} 0~n间的随机整数
	 */
	randomInt : function(n){
		return Math.floor(Math.random() * n);
	}
});
})();