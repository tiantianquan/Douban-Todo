angular.module('DoubanTodoApp')

.controller('ItemEditCtrl', function($scope, TodoItem, $state) {
  $scope.init = function() {
    $scope.addItem = {
      doubanAPIData: TodoItem.CurrentEditItem(),
      startTime: new Date(),
      endTime: new Date(),
      summary: ''
    }
  }

  $scope.signupForm = function() {
    TodoItem.Add($scope.addItem, function() {
      $state.go('home');
    }, function(error) {
      console.log(error);
    })
  }

});