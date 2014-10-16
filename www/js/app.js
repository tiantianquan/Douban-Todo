// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('DoubanTodoApp', ['ionic'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if (window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})

// //允许跨站
// .config(['$httpProvider',
//   function($httpProvider) {
//     // ...

//     // delete header from client:
//     // http://stackoverflow.com/questions/17289195/angularjs-post-data-to-external-rest-api
//     $httpProvider.defaults.useXDomain = true;
//     delete $httpProvider.defaults.headers.common['X-Requested-With'];
//   }
// ])

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider
    .state('home', {
      url: '/home',
      views: {
        'home': {
          templateUrl: 'js/home/home.template.html',
          controller: 'HomeCtrl'
        }
      }
    })
    .state('item',{
      url:'/item/:id',
      views:{
        'item':{
          templateUrl: 'js/item/item.template.html',
          controller:'ItemCtrl'
        }
      } 
    })

  $urlRouterProvider.otherwise('/home');

}).

config(function(){
  AV.initialize(AVOS_ID, AVOS_KEY);
})

AVOS_ID = 'bg80oxz6ls1pmcgs1nihpsnmdystfzsxlgynwq7fqtm4v405';
AVOS_KEY = 'wfgbeve1tfg2j2nuwkm2k5dmwsh8jsnnm2xijnkkqdqtx1ch';
