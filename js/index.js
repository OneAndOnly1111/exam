/**
 * Created by Mine on 2016/9/22.
 * 首页核心js文件
 */
$(function () {
    //左侧导航动画效果
    $(".baseUI>li>a").off("click");
    $(".baseUI>li>a").on("click",function () {
        $(".baseUI>li>ul").slideUp();  //默认收起全部
        $(this).next().slideDown(300);
    });
    //默认收起全部    默认点击第一个
    $(".baseUI>li>ul").slideUp();
    $(".baseUI>li>a").eq(0).trigger("click");

    //点击添加背景颜色
    $(".baseUI>li>ul>li").on("click",function () {
        $(".baseUI>li>ul>li").removeClass("current");
        $(this).addClass("current");
    });
    //默认点击
    $(".baseUI>li>ul>li>a").eq(0).trigger("click");
});

//核心模块
angular.module("app",["ng","ngRoute","app.subject","app.paper"])
    //核心模块控制器
    .controller("mainCtrl",["$scope",function ($scope) {

    }])
    //路由配置
    .config(["$routeProvider",function ($routeProvider) {
        /**
         * a 类型id
         * b 难度id
         * c 方向id
         * d 知识点id
         */
        $routeProvider.when("/AllSubject/a/:a/b/:b/c/:c/d/:d",{
            templateUrl:"tpl/subject/subjectList.html",
            controller:"subjectController"
        }).when("/subjectAdd",{
            templateUrl:"tpl/subject/subjectAdd.html",
            controller:"subjectController"
        }).when("/SubjectDel/id/:id",{
            templateUrl:"tpl/subject/subjectList.html",
            controller:"subjectDelController"
        }).when("/SubjectCheck/id/:id/checkState/:checkState",{
            templateUrl:"tpl/subject/subjectList.html",
            controller:"subjectCheckController"
        }).when("/PaperList",{
            templateUrl:"tpl/paper/paperManager.html",
            controller:"paperListController"
        }).when("/PaperAdd/id/:id/stem/:stem/type/:type/topic/:topic/level/:level",{
            templateUrl:"tpl/paper/paperAdd.html",
            controller:"paperAddController"
        }).when("/PaperSubjectList",{
            templateUrl:"tpl/paper/subjectList.html",
            controller:"subjectController"
        })
    }]);















