angular.module('DoubanTodoApp')

.controller('HomeCtrl', function($scope, $ionicModal, $ionicPopup, ProcessBarDelegate, FlashBarDelegate, TodoItem, DoubanApi, CircleProcessBarDelegate) {
  $scope.$on('initEnd', function() {
    $scope.$broadcast('scroll.refreshComplete');
    FlashBarDelegate.show();
  });
  //刷新
  $scope.doRefresh = function() {
    $scope.init();
  };

  //初始化
  $scope.init = function() {
    // DoubanApi.MusicSearch('sonic youth', 30, function(data) {
    //   $scope.toDoList = data.musics;
    //   $scope.$broadcast('initEnd');
    // })
    TodoItem.GetCurrentUserItem(function(todoItems) {
      $scope.$apply(function() {
        $scope.todoList = todoItems.sort(function(a, b) {
          return Date.parse(a.createdAt) - Date.parse(b.createdAt);
        });
        $scope.todoList.forEach(function(data) {
          data.doubanData = data.get('doubanAPIData');
        })
        FlashBarDelegate.barText = '已加载' + $scope.todoList.length + '条';
        $scope.$broadcast('initEnd');
      });
    })
  }

  //从下方弹出item页面
  $ionicModal.fromTemplateUrl('js/item/item.template.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modal = modal;
  });
  $scope.openItemModal = function(id) {
    $scope.todoItem = $scope.todoList.filter(function(toDoItem) {
      return toDoItem.doubanData.id == id
    })[0];
    $scope.modal.show();

    $scope.circleProcessBar = $scope.circleProcessBar || new CircleProcessBarDelegate('.img-convert-full');
    $scope.circleProcessBar
      .midWidth(10)
      .startTime($scope.todoItem.get('startTime'))
      .endTime($scope.todoItem.get('endTime'))
      .initBar()
      .boot(100);
  };

  //popupMenu
  $ionicModal.fromTemplateUrl('js/home/homePopupMenu.template.html', {
    scope: $scope,
    animation: 'fade-in'
  }).then(function(modal) {
    $scope.popupMenu = modal;
  });
  $scope.openItemMenu = function(item) {
    $scope.popupMenu.item = item;
    $scope.popupMenu.show();
  };
})

.controller('HomePopupCtrl', function($scope, TodoItem) {

  $scope.closeItemMenu = function() {
    $scope.popupMenu.hide();
  };
  //Cleanup the modal when we're done with it!
  $scope.$on('$destroy', function() {
    $scope.popupMenu.remove();
  });

  $scope.init = function() {}

  //删除条目
  $scope.deleteItem = function() {
    TodoItem.DeleteItem($scope.popupMenu.item, function(data) {
      $scope.todoList.splice($scope.todoList.indexOf($scope.popupMenu.item), 1);
      $scope.popupMenu.hide();
    }, function(data, error) {
      alert(error);
    });
  }

})
