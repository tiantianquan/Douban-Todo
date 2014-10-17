angular.module('DoubanTodoApp')

.controller('HomeCtrl', function($scope, $ionicModal, DoubanApi) {
  //刷新
  $scope.doRefresh = function() {
    $scope.$on('initEnd', function() {
      $scope.$broadcast('scroll.refreshComplete');
    });
    $scope.init();
  };

  $scope.init = function() {
    DoubanApi.MusicSearch('sonic youth', 30, function(data) {
      $scope.toDoList = data.musics;
      $scope.$broadcast('initEnd');
    })
  }

  //从下方弹出页面
  $ionicModal.fromTemplateUrl('js/item/item.template.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modal = modal;
  });
  $scope.openModal = function(id) {
    $scope.toDoItem = $scope.toDoList.filter(function(toDoItem) {
      return toDoItem.id == id
    })[0];
    $scope.modal.show();
  };
})