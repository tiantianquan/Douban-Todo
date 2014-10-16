angular.module('DoubanTodoApp')

.controller('HomeCtrl', function($scope, $timeout, $ionicScrollDelegate, DoubanApi) {
  //标题栏阴影,下滑显示
  angular.element('ion-content').on('scroll', function() {
    $scope.$apply(function() {
      if ($ionicScrollDelegate.getScrollPosition().top != 0) {
        console.log($ionicScrollDelegate.getScrollPosition());
        $scope.$root.barShadow = 'bar-header-shadow';
      } else {
        $scope.$root.barShadow = '';
      }
    })
  })

  //刷新
  $scope.doRefresh = function() {
    $timeout(function() {
      $scope.$broadcast('scroll.refreshComplete');
    }, 1000)
  };

  DoubanApi.MusicSearch('sonic youth', 10, function(data) {
    $scope.toDoList = data.musics;
  })
})
