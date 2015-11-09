console.log(require('ipfs-api'))

var boards = angular.module('boards',['ui.router'])

boards.config(function($stateProvider,$urlRouterProvider,$locationProvider){
  $urlRouterProvider.otherwise('/')
  //$locationProvider.html5Mode({ enabled: true, requireBase: false })

  $stateProvider.state('home',{
    url: '/',
    templateUrl: 'home.html',
    controller: function($scope){
      
    }
  })

  $stateProvider.state('board',{
    url: '/board/:name',
    templateUrl: 'board.html',
    controller: function($scope,$stateParams){
      $scope.posts = [ "hey", "test", "something" ]
    }
  })
})
