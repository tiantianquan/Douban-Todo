angular.module('DoubanTodoApp')

.controller('ItemCtrl', function($scope, DoubanApi) {

  $scope.closeModal = function() {
    $scope.modal.hide();
    d3Fn(); 
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

  var d3Fn = function() {
    var el = document.querySelector('.img-convert-full');
    var width = el.offsetWidth,
    height = el.offsetHeight,
    radius = Math.min(width, height);
    var radii =  width/2;

    var circleBar = d3.select('.svg-wraper');
    var svg = circleBar.append('svg')
      .attr('width', width)
      .attr('height', height)
      .attr('top',0)
      .append('g')
      .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')');

    // Sun
    svg.append('circle')
      .attr('class', 'sun')
      .attr('r', radii)
      .style('fill','none')
      .style('stroke', 'yellow')
      .style('stroke-width',5)
  }
})