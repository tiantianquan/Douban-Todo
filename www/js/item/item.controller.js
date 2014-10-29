angular.module('DoubanTodoApp')

.controller('ItemCtrl', function($scope, DoubanApi) {

  $scope.closeModal = function() {
    $scope.modal.hide();
    $scope.svgEl = angular.element('svg');
    $scope.svgEl.remove();
  };
  //Cleanup the modal when we're done with it!
  $scope.$on('$destroy', function() {
    $scope.modal.remove();
  });
  // Execute action on hide modal
  $scope.$on('modal.hidden', function() {
    // Execute action
  });
  // Execute action on remove modal
  $scope.$on('modal.removed', function() {
    // Execute action
  });

  $scope.init = function() {
    // var doubanID = $stateParams.id;
    // DoubanApi.MusicGetById(doubanID, function(data) {
    //   $scope.toDoItem = data;
    //   $scope.$broadcast('initEnd');
    // })
  }
})