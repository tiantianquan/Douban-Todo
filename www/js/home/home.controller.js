angular.module('DoubanTodoApp')

.controller('HomeCtrl', function($scope, $ionicModal, $ionicPopup, TodoItem, DoubanApi) {
  //刷新
  $scope.doRefresh = function() {
    $scope.$on('initEnd', function() {
      $scope.$broadcast('scroll.refreshComplete');
    });
    $scope.init();
  };

  $scope.init = function() {
    // DoubanApi.MusicSearch('sonic youth', 30, function(data) {
    //   $scope.toDoList = data.musics;
    //   $scope.$broadcast('initEnd');
    // })
    TodoItem.GetCurrentUserItem(function(todoItems) {
      $scope.$apply(function() {
        $scope.todoList = todoItems;
        $scope.todoList.forEach(function(data) {
          data.doubanData = data.get('doubanAPIData');
        })
        $scope.$broadcast('initEnd');
      });
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
    $scope.todoItem = $scope.todoList.filter(function(toDoItem) {
      return toDoItem.doubanData.id == id
    })[0];
    $scope.modal.show();
  };

  //popup window
  $scope.showItemMenu = function(item) {
    $scope.popupMenu = $ionicPopup.show({
      templateUrl: 'js/home/homePopupMenu.template.html',
      scope: $scope,
    });
    $scope.popupMenu.item = item;
  };
})

.controller('HomePopupCtrl', function($scope) {
  angular.element('.popup-head').remove();
  angular.element('.popup-buttons').remove();

  $scope.deleteItem = function(){
    $scope.todoList.splice($scope.todoList.indexOf($scope.popupMenu.item),1);
    $scope.popupMenu.close();
  }
})