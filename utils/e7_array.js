(function(){
var array = nimei.array;
extend( array, {
        
/**
* 判断数组内容个数
* @param {array} array 对象
* @return {int} 长度
 */
    getLength : function(arr){
        var l = 0;
        for(var key in arr){
            l ++;
        }       
        return l;
    },
        
/**
 * 复制数组
 * @param {array} array 对象
 * @return {array} 新数组对象
 */
    clone : function (arr){
        var a = [];
        for(var i=0; i<arr.length; ++i) {
            a.push(arr[i]);
        }
        return a;
    } 

/**
 * 判断数组中是否存在这个值
 * @param {array} arr 数组对象
 * @param {object} value 对象
 * @return {bool} 是/否
 */
    hasValue : function(arr, value){
        var find = false;
        if (isArray(arr) || isObject(arr))
                for(var key in arr){
                        if (arr[key] == value) find = true;
                }
        return find;
    },
        
/**
 * 根据值获得数组中的key
 * @param {array} arr 数组对象
 * @param {object} value 对象
 * @return {string} key
 */
    getArrayKey : function(arr, value){
            var findKey = -1;
            if (isArray(arr) || isObject(arr))
                    for(var key in arr){
                            if (arr[key] == value) findKey = key;
                    }
            return findKey;
    },
        
/**
 * 返回a1数组有a2没有的值
 * @param {array} a1 数组对象
 * @param {array} a2 数组对象
 * @return {array} key
 */
    filter : function (a1, a2) {
        var res = [];
        for(var i=0;i<a1.length;i++) {
            if(!nimei.hasValue(a2, a1[i]))
                res.push(a1[i]);
        }
        return res;
    } 
/**
 * 两个数组的值的交集
 * @param {array} arr 数组
 * @param {array} arr 数组
 * @return {array} key
 */
    unique : function (a1, a2) {
        return nimei.filter(a1,a2).concat(nimei.filter(a2,a1))
    }
});
})();