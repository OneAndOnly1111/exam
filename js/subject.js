/**
 * Created by Mine on 2016/9/22.
 * 这是一个关于题目的js模块
 */
angular.module("app.subject",["ng"])
    .controller("subjectController",["$scope","$location","commonService","subjectService","$routeParams",function ($scope,$location,commonService,subjectService,$routeParams) {
        //为添加题目页面发生跳转
        $scope.add = function () {
            $location.path("/subjectAdd");
        };
        //添加信息页面绑定的对象
        $scope.subject = {
            typeId:1,
            departmentId:1,
            levelId:1,
            topicsId:1,
            stem:"",
            answer:"",    //简答题答案
            analysis:"",     //答案解析
            choiceContent:[],
            choiceCorrect:[false,false,false,false]
        };
        //为保存并继续按钮绑定事件
        $scope.submit = function () {
            subjectService.saveSubject($scope.subject,function (data) {
                alert(data);
            });
            var subject = {
                typeId:1,
                departmentId:1,
                levelId:1,
                topicsId:1,
                stem:"",
                answer:"",    //简答题答案
                analysis:"",     //答案解析
                choiceContent:[],
                choiceCorrect:[false,false,false,false]
            };
            angular.copy("subject",$scope.subject);
        };
        //为保存并关闭按钮绑定事件
        $scope.submitAndClose = function () {
            subjectService.saveSubject($scope.subject,function (data) {
                alert(data);
            });
            $location.path("/AllSubject/a/0/b/0/c/0/d/0");
        };
        //获取所有题目类型、难度级别、所属方向、知识点
        commonService.getData("http://172.16.0.5:7777/test/exam/manager/getAllSubjectType.action",function (data) {
           $scope.types = data;
       });
        commonService.getData("http://172.16.0.5:7777/test/exam/manager/getAllSubjectLevel.action",function (data) {
            $scope.levels = data;
        });
        commonService.getData("http://172.16.0.5:7777/test/exam/manager/getAllDepartmentes.action",function (data) {
            $scope.departmentes = data;
        });
        commonService.getData("http://172.16.0.5:7777/test/exam/manager/getAllTopics.action",function (data) {
            $scope.topics = data;
        });
        //获取路由参数 传递给后台
        $scope.params = $routeParams;
        //获取所有的题目信息
        subjectService.getAllSubjects( $scope.params,function (data) {
            $scope.subjects = data;
            data.forEach(function (subject,index) {
                if(subject.subjectType){
                    //给choice添加一个no属性 并把index转换成A,B,C,D 后赋值给choice.no
                    subject.choices.forEach(function (choice,index) {
                        choice.no =  commonService.convertIndexToNo(index);
                    });
                    //当题目类型不为简答题时，把choice.correct为true的对象的choice.no的值赋值给subject.answer(答案)
                    if(subject.subjectType.id!=3){
                        var answer = [];
                        subject.choices.forEach(function (choice,index) {
                            if(choice.correct == true){
                                answer.push(choice.no);
                            }
                        });
                        subject.answer = answer.toString();
                    }
                }
            });
        });
    }])
    //删除控制器
    .controller("subjectDelController",["$scope","$location","subjectService","$routeParams",function ($scope,$location,subjectService,$routeParams) {
       var flag = confirm("确认删除吗？");
        if(flag){
            var id = $routeParams.id;
            subjectService.delSubject(id,function (data) {
                alert(data);
                //删除题目之后 页面加载到之前的页面
                $location.path("/AllSubject/a/0/b/0/c/0/d/0");
            });
        }else{
            $location.path("/AllSubject/a/0/b/0/c/0/d/0");
        }
    }])
    //审核控制器
    .controller("subjectCheckController",["$scope","$location","subjectService","$routeParams",function ($scope,$location,subjectService,$routeParams) {
       console.log($routeParams);
        var id = $routeParams.id;
        var checkState = $routeParams.checkState;
        subjectService.checkSubejct(id,checkState,function (data) {
            alert(data);
            $location.path("/AllSubject/a/0/b/0/c/0/d/0");
        });
    }])
    //公共服务
   .factory("commonService",["$http",function ($http) {
       return {
           //获取数据的方法
           getData: function (url,handler) {
               $http.get(url).success(function (data) {
                   handler(data);
               });
           },
           //转换方法
           convertIndexToNo:function (index) {
               return index==0?'A':(index==1?'B':(index==2?'C':(index==3?'D':'E')));
           }
       }
   }])
    .service("subjectService",["$http","$httpParamSerializer",function ($http,$httpParamSerializer) {
        //保存题目的方法
        this.saveSubject = function(params,handler){
            var obj = {};
            for (var key in params){
                var val = params[key];
                switch(key){
                    case "typeId": obj['subject.subjectType.id']=val;
                        break;
                    case "departmentId": obj['subject.department.id']=val;
                        break;
                    case "levelId": obj['subject.subjectLevel.id']=val;
                        break;
                    case "stem": obj['subject.stem']=val;
                        break;
                    case "answer": obj['subject.answer']=val;
                        break;
                    case "analysis": obj['subject.analysis']=val;
                        break;
                    case "choiceContent": obj['choiceContent']=val;
                        break;
                    case "choiceCorrect": obj['choiceCorrect']=val;
                        break;
                }
            }
            //对obj对象进行表单格式的序列化操作(默认是json格式)
            obj = $httpParamSerializer(obj);
            $http.post("http://172.16.0.5:7777/test/exam/manager/saveSubject.action",obj,{
                headers:{
                    "Content-Type":"application/x-www-form-urlencoded"
                }
            }).success(function (data) {
                handler(data);
            });
        };
        //获取所有的题目的方法
        this.getAllSubjects = function (params,handler) {
            var data = {};
            for(var key in params){
                var val = params[key];
                   if(val!=0){
                       switch(key){
                           case 'a': data['subject.subjectType.id']=val;
                               break;
                           case 'b': data['subject.subjectLevel.id']=val;
                               break;
                           case 'c': data['subject.department.id']=val;
                               break;
                           case 'd': data['subject.topic.id']=val;
                               break;
                       }
                   }
            }
            $http.get(" http://172.16.0.5:7777/test/exam/manager/getAllSubjects.action",{
                params:data
            }).success(function (data) {
                handler(data);
            });
        };
        //删除题目的方法
        this.delSubject = function (id,handler) {
            $http.get("http://172.16.0.5:7777/test/exam/manager/delSubject.action",{
                params:{
                    'subject.id':id
                }
            }).success(function (data) {
                handler(data);
            });
        };
        //审核通过的方法
        this.checkSubejct = function (id,checkState,handler) {
            $http.get("http://172.16.0.5:7777/test/exam/manager/checkSubject.action",{
                params:{
                    'subject.id':id,
                    'subject.checkState':checkState
                }
            }).success(function (data) {
                handler(data);
            })
        };
    }])
    //为添加页面的知识点添加过滤
    .filter("selectTopics",function () {
        //input为要过滤的内容  id为方向id
        return function (input,id) {
           if(input){
               var result = input.filter(function (item) {
                   return item.department.id == id;
               });
               return result;
           }
        }
    })
    //获取选项正确答案的指令
    .directive("selectOption",function () {
        return {
            restrict:"A",
            //链接
            link:function (scope,element,attribute) {
               element.on("change",function () {
                    var type = $(this).attr("type");
                    var val = $(this).val();
                    if(type=="radio"){
                        //重置
                        scope.subject.choiceCorrect=[false,false,false,false];
                        for(var i=0 ; i<4; i++){
                            if(i==val){
                                scope.subject.choiceCorrect[i]=true;
                            }
                        }
                    }else if(type == "checkbox"){
                        for(var i = 0; i<4;i++){
                            if(i==val){
                                scope.subject.choiceCorrect[i] = true;
                            }
                        }
                    }
                    //强制消化scope
                    scope.$digest();
               });
            }
        }
    });
