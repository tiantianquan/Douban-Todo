angular.module('DoubanTodoApp')

//页面滚动,标题栏下方设置阴影
  .directive('scrollShowBarShadow', function($ionicScrollDelegate) {
    return {
      restrict: 'A',
      // scope:{},
      link: function(scope, element, attr) {
        element.on('scroll', function() {
          var top = $ionicScrollDelegate.getScrollPosition().top;
          if (top != 0) {
            $('ion-nav-bar').addClass('bar-header-shadow');
          } else {
            $('ion-nav-bar').removeClass('bar-header-shadow');
          }
        })
      }
    }
  })