angular.module('DoubanTodoApp')

.controller('SearchCtrl', function($scope, $ionicNavBarDelegate,DoubanApi) {
  $scope.init=function(){
    $ionicNavBarDelegate.showBar(true);
  }
});
