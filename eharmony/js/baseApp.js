var app = angular.module('baseApp',[]);


$.ajaxSetup({
    type: 'POST',
    complete: function(xhr,status) {
        var sessionStatus = xhr.getResponseHeader('sessionState');
        if(sessionStatus == 'SO100-001') {
            var top = getTopWinow();
            top.location.href = '/login.html';            
        }
    }
});
//获取根节点
function getTopWinow(){
    var p = window;
    while(p != p.parent){
        p = p.parent;
    }
    return p;
}

/*app.directive('showContent',function($http){
	return {
		restrict:'E',
		scope :true ,
		link:function(scope, element, attrs) {
			debugger
	         var data = {
					 'id':attrs.itemId
			};
	         $http.post('/datadicItem/getItemById',data,postCfg)
	              .success(function(resp){
	            	  scope.content= resp.itemName;
	             });
	        },
		template:'<p ng-bind="content"></p>',
		replace:true
	};
});*/


app.directive('token', function() {
    return {
        restrict: 'E',
//        template: '<input type="hidden" name="token" value="'+getUuid()+'"   />',
        template: function(tElement,tAttrs){ 
            var _html = ''; 
            _html += '<input type="hidden" name="token" value="'+getUuid()+'"/>'; 
            return _html; 
            },
        replace: true
    };
});

function getUuid(){
	  var len=32;//32长度
	  var radix=16;//16进制
	  var chars='0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');var uuid=[],i;radix=radix||chars.length;if(len){for(i=0;i<len;i++)uuid[i]=chars[0|Math.random()*radix];}else{var r;uuid[8]=uuid[13]=uuid[18]=uuid[23]='-';uuid[14]='4';for(i=0;i<36;i++){if(!uuid[i]){r=0|Math.random()*16;uuid[i]=chars[(i==19)?(r&0x3)|0x8:r];}}}
	  return uuid.join('');
}  

app.directive('tmPagination',function(){
    return {
        restrict: 'E',
        template: '<div style="text-align:center;height:30px;margin-top:15px">'+
		'<ul class="pagination" style="margin: 0px;">'+
			'<li ng-class="{disabled:pageInfo.currentPage==1}">'+
				'<a ng-click="load_page(1)">首页</a>'+
			'</li>'+
			'<li ng-class="{disabled:pageInfo.currentPage==1}">'+
				'<a ng-disabled="pageInfo.currentPage==1" ng-click="pageInfo.currentPage==1||load_page(pageInfo.currentPage - 1)">&lt;</a>'+
			'</li>'+
			'<li ng-class="{active:pageInfo.currentPage==page}"	ng-repeat="page in pageInfo.pages">'+
				'<a ng-click="load_page(page)">{{ page }}</a>'+
			'</li>'+
			'<li ng-class="{disabled:pageInfo.currentPage==pageInfo.countPage}">'+
				'<a ng-disabled="pageInfo.currentPage==pageInfo.countPage" ng-click="pageInfo.currentPage==pageInfo.countPage||load_page(pageInfo.currentPage + 1)">&gt;</a>'+
			'</li>'+
			'<li ng-class="{disabled:pageInfo.currentPage==pageInfo.countPage}">'+
				'<a ng-click="load_page(pageInfo.countPage)">尾页</a>'+
			'</li>'+
		'</ul>'+
		'<span style="vertical-align: 12px;margin-left:20px">&nbsp;'+
		 '第<input type="text" style="max-width:30px;height: 20px;border-style:groove" ng-model="pageInfo.currentPage"  ng-blur="load_page(pageInfo.currentPage)"/>页 ' +
		'&nbsp;共有：{{pageInfo.total}}&nbsp&nbsp条数据</span>'+
		'<span class="r" style="margin-top:4px;width:120px;"> '+
			'<span style="vertical-align: 12px;">&nbsp;&nbsp;每页'+
				'<select style="margin-left:5px;"'+
					'ng-model="pageInfo.pageSize"'+
					'ng-change="load_page(1,pageInfo.pageSize)" '+
					'ng-options="act for act in pageInfo.currentNumbers">'+
				'</select>&nbsp&nbsp条'+
			'</span>'+
		'</span>'+
	'</div>',
        replace: true
    };
});
var transform = function(data) {
	return $.param(data);
}, postCfg = {
	headers : {
		'Content-Type' : 'application/x-www-form-urlencoded; charset=UTF-8'
	},
	transformRequest : transform
};

//业务类
app.factory('pageService', ['$http', function ($http) {
    var load_page = function (url,postData) {
    	var index = layer.load(1,
				{shade: [0.1,'#fff'] //0.1透明度的白色背景
				});
        $http.post(url, postData,postCfg).success(function(resp){
        	pageInfo.total=resp.total;
        	pageInfo.list=resp.list;
        	pageInfo.currentPage = resp.pageNum;
        	pageInfo.countPage =Math.ceil(pageInfo.total/postData.rows);
        	pageInfo.pages = reloadPno(pageInfo.currentPage,pageInfo.countPage);
        	layer.close(index);
        }); 
        return pageInfo;
    }
    var pageInfo = {
			currentPage : 1,//当前页
			pageSize : 10,//每页显示数
			pages : [],//可扩展几页
			countPage : 1,//总页数
			total : 1,//总条数
			currentNumbers : [10,20,50,100],
			list : [] //列表
	};
    var reloadPno = function(currentPage,allPage){
    	var pages = [];
        //分页算法
       for(var i = 1; i <= allPage; i++) {
            if(i == 2 && currentPage - 6 > 1) {
                i = currentPage - 6;
            }else if(i == currentPage + 6 && currentPage + 6 < allPage) {
                i = allPage - 1;
            }else{
            	pages.push(i);
            }
       }
       return pages;
    };
    
    return {
    	pageInfo : pageInfo,
    	load_page: function (url,postData) {
            return load_page(url,postData);
        }
    }
}]);

Array.prototype.indexOf = function(val) { for (var i = 0; i < this.length; i++) { if (this[i] == val) return i; } return -1; };

Array.prototype.remove = function(val) { var index = this.indexOf(val); if (index > -1) { this.splice(index, 1); } };

function validateSuccessData(data){
	if((typeof(data) == 'string') && (data == 'true')){
		return true;
	}
	if((typeof(data) == 'boolean') && (data == true)){
		return true;
	}
	if(data.id){
		return true;
	}
	return false;
}

function stitchingParameter(objectParam,listParam,listName){
	if(listName==undefined){
		listName = '';
	}
	for(var i = 0;i<listParam.length;i++){
		for(var object in listParam[i]){
			objectParam[listName+'['+i+'].'+object] = listParam[i][object];
		}
	}
	return objectParam;
}
	
