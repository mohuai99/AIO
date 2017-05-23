var e7come = {
    getId:function(id){
        return document.getElementById(id);       
    },
    getsclass:function(parent,sclass){
        var aChild = parent.getElementsByTagName('*');
        var re = new RegExp('\\b'+sclass+'\\b','g');
        var atr = [];
        for(var i=0;i<aChild.length;i++){
            if(re.test(aChild.className)){
                atr.push(aChild);
            }
        }
        return atr;
    },
    e7_startmove:function(obj,json,fn){
        var This = this;
        clearInterval(obj.time);
        var icur = 0;
        var ispeed = 0;
        obj.time=setInterval(function(){
            var btn = true;
            for(var str in json){
                if(str=='opacity'){
                    icur = Math.round(parseFloat(This.getStyle(obj,'opacity'))*100);
                }else{
                    icur = parseInt(This.getStyle(obj,str));
                }
                ispeed = (json[str]-icur)/8;
                ispeed = ispeed >0 ? Math.ceil(ispeed):Math.floor(ispeed);
                if(icur != json[str]){
                    btn = false;
                }
                if(icur=='opacity'){
                    obj.style.filter='alpha(opacity='+(icur+ispeed)+')';
                    obj.style.opacity=(icur+ispeed)/100;
                }else{
                    obj.style[str]=icur+ispeed+'px';
                }
                if(btn){
                    clearInterval(obj.time);
                    if(fn){
                        fn.call(obj);
                    }
                }
            }
        },30);
    },
    getStyle:function(obj,str){
        if(obj.currentStyle){
            return obj.currentStyle[str];
        }else{
            return getComputedStyle(obj,false)[str];
        }
    },
    type:function(){
        var typeIE = window.navigator.userAgent;
        if(typeIE.search('MSIE 6.0')==25 || typeIE.search('MSIE 7.0')==25){
            return false;
        }else{
            return true;
        }
    },
    getXY:function (obj){
        var x = 0, y = 0;
        if (obj.getBoundingClientRect) {
                var box = obj.getBoundingClientRect();
                var D = document.documentElement;
                x = box.left + Math.max(D.scrollLeft, document.body.scrollLeft) - D.clientLeft;
                y = box.top + Math.max(D.scrollTop, document.body.scrollTop) - D.clientTop;
        } else {
                for (; obj != document.body; x += obj.offsetLeft, y += obj.offsetTop, obj = obj.offsetParent) {  }
        };
        return {x:x,y:y};
    },
    check_mail:function(value){   //检测邮箱
        var re = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;    //定义邮箱格式
        if(re.test(value)){
                return true;       
        }
    }
};
