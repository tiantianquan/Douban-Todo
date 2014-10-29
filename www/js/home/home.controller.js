angular.module('DoubanTodoApp')

.controller('HomeCtrl', function($scope, $ionicModal, $ionicPopup, ProcessBarDelegate, FlashBarDelegate, TodoItem, DoubanApi) {
  $scope.$on('initEnd', function() {
    $scope.$broadcast('scroll.refreshComplete');
    ProcessBarDelegate.end();
    FlashBarDelegate.show();

  });
  //刷新
  $scope.doRefresh = function() {
    ProcessBarDelegate.start();
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

    $scope.svgEl = angular.element('svg');
    if ($scope.svgEl.length === 0) {
      d3Fn();
    }
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


//d3
var d3Fn = function() {
  var el = document.querySelector('.img-convert-full');
  //图片宽高
  var width = el.offsetWidth,
    height = el.offsetHeight,
    //内半径-外半径
    midWidth = 20,
    //内半径
    radii = width / 2,
    //外半径
    outerRadii = (width + 2 * midWidth) / 2,
    //360°角
    fullAng = 2 * Math.PI,
    startEndAngle = 0 * fullAng;

  var _el = d3.select('.img-convert-full');
  var svg = _el.append('svg')
    .attr('width', outerRadii * 2)
    .attr('height', outerRadii * 2)
    //调整外边距 ,使两个div中心重合
    .attr('style', 'margin:' + (-midWidth) + 'px')
    .append('g')
    .attr('transform', 'translate(' + outerRadii + ',' + outerRadii + ')');


  var arc = d3.svg.arc()
    .innerRadius(radii)
    .outerRadius(outerRadii)
    .startAngle(0);

  // Add the background arc, from 0 to 100% (τ).
  // var background = svg.append('path')
  //   .datum({
  //     endAngle: τ
  //   })
  //   .style('fill', '#fff')
  //   .attr('d', arc);

  // Add the foreground arc in orange, currently showing 12.7%.
  var foreground = svg.append('path')
    .datum({
      endAngle: startEndAngle
    })
    .style('fill', '#4fbcf7')
    .attr('d', arc);

  // setInterval(function() {
  //   foreground.transition()
  //     .duration(750)
  //     .call(arcTween, Math.random() * τ);
  // }, 1500);

  // function arcTween(transition, newAngle) {
  //   transition.attrTween('d', function(d) {
  //     var interpolate = d3.interpolate(d.endAngle, newAngle);
  //     return function(t) {
  //       d.endAngle = interpolate(t);
  //       return arc(d);
  //     };
  //   });
  // }

  setTimeout(function() {
    foreground.transition()
      .duration(2000)
      .call(function(transition, newAngle) {
        transition.attrTween('d', function(d) {
          var interpolate = d3.interpolate(d.endAngle, newAngle);
          return function(t) {
            d.endAngle = interpolate(t);
            return arc(d);
          };
        });
      }, fullAng);
  }, 2000);

}