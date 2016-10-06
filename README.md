# exam
使用AngularJS编写的一个考试管理系统
共有三个模块：1.题目列表 2.题目管理  3.手工组卷
页面的跳转使用的是angular的路由机制
CRUD的实现是利用angular路由中的一个$routeParams服务来获取地址上携带的参数 然后借助$http传递给后台来实现增删改查
