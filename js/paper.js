/**
 * Created by Mine on 2016/9/22.
 * 这是一个关于试卷的模块
 */
angular.module("app.paper",["ng","app.subject"])
    //试卷查询控制器
    .controller("paperListController",["$scope",function ($scope) {
        
    }])
    //试卷添加控制器
    .controller("paperAddController",["$scope","commonService","$routeParams","paperModel","paperService",function ($scope,commonService,$routeParams,paperModel,paperService) {
        commonService.getData("http://172.16.0.5:7777/test/exam/manager/getAllDepartmentes.action",function (data) {
           $scope.dps = data;
        });
        var subjectId = $routeParams.id;
        if(subjectId!=0){
            paperModel.getSubjectId(subjectId);
            paperModel.addSubject(angular.copy($routeParams));   //把routeParams获取对象的拷贝当作参数传递
        }
        //双向绑定的模板
        $scope.pmodel = paperModel.model;
        $scope.savePaper = function () {
            paperService.SavePaper($scope.pmodel,function (data) {
                alert(data);
            });
        }
    }])
    .factory("paperModel",function () {
        return {
            //模板  单例
            model:{
                departmenteId:1,   //方向id
                title:"",           //试卷名称
                desc:"",            //试卷说明
                time:0,             //考试时间
                total:0,            //试卷总分
                scores:[],          //每个题目的分值
                subjectIds:[],       //每个题目的id
                subjects:[]         //添加过来题目的信息
            },
            getSubjectId:function (id) {
                this.model.subjectIds.push(id);
            },
            addSubject:function (subject) {
                this.model.subjects.push(subject);
            }
        }
    })
    .factory("paperService",function ($httpParamSerializer,$http) {
        return {
            SavePaper: function (param,handler) {
                var obj = {};
                for(var key in param){
                    var val = param[key];
                    switch (key){
                        case "departmenteId": paper.department.id = val;
                            break;
                        case "title": paper.title = val;
                            break;
                        case "desc": paper.description = val;
                            break;
                        case "time": paper.answerQuestionTime = val;
                            break;
                        case "total": paper.totalPoints = val;
                            break;
                        case "scores": scores = val;
                            break;
                        case "subjectIds": subjectIds = val;
                            break;
                    }
                }
                obj = $httpParamSerializer(obj);
                $http.post("http://172.16.0.5:7777/test/exam/manager/saveExamPaper.action",obj,{
                    headers:{
                        "Content-Type":"application/x-www-form-urlencoded"
                    }
                }).success(function (data) {
                    handler(data);
                });
            }
        }
    });