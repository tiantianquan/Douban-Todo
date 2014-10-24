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
          $('ion-nav-bar').addClass('bar-header-shadow-active');
        } else {
          $('ion-nav-bar').removeClass('bar-header-shadow-active');
        }
      })
    }
  }
})

// .directive('ionSearch', function() {
//   return {
//     restrict: 'E',
//     replace: true,
//     scope: {
//       getData: '&source',
//       model: '=?',
//       search: '=?filter'
//     },
//     link: function(scope, element, attrs) {
//       attrs.minLength = attrs.minLength || 0;
//       scope.placeholder = attrs.placeholder || '';
//       scope.search = {
//         value: ''
//       };

//       if (attrs.class)
//         element.addClass(attrs.class);

//       if (attrs.source) {
//         scope.$watch('search.value', function(newValue, oldValue) {
//           if (newValue.length > attrs.minLength) {
//             scope.getData({
//               str: newValue
//             }).then(function(results) {
//               scope.model = results;
//             });
//           } else {
//             scope.model = [];
//           }
//         });
//       }

//       scope.clearSearch = function() {
//         scope.search.value = '';
//       };
//     },
//     template: '<div class="item-input-wrapper">' +
//       '<i class="icon ion-android-search"></i>' +
//       '<input type="search" placeholder="{{placeholder}}" ng-model="search.value">' +
//       '<i ng-if="search.value.length > 0" ng-click="clearSearch()" class="icon ion-close"></i>' +
//       '</div>'
//   };
// })

.directive('searchNavBar', function() {
  return {
    restrict: 'A',
    link: function(scope, element, attr) {
      var ionNavBar = $('ion-nav-bar');
      if (ionNavBar.count = 0)
        return;
      ionNavBar.children('.title').hide();
      ionNavBar.append('<div class="item-input-inset search-item-input-inset">' +
        '<label class="item-input-wrapper">' +
        '<i class="icon ion-ios7-search placeholder-icon"></i>' +
        '<input type="search" placeholder="Search">' +
        '</label>' +
        '</div>');

      scope.$on('$destroy', function() {
        ionNavBar.children('.title').show();
        ionNavBar.children().remove('.item-input-inset')
      })
    }
  }
})

.directive('processBar', function($timeout, $rootScope) {
  return {
    restrict: 'A',
    link: function(scope, element, attr) {
      var processInterval;
      var headerBarEl = element;
      if (element[0].tagName !== 'ION-HEADER-BAR' && element[0].tagName !== 'ION-NAV-BAR')
        return;
      var processBarEl = angular.element('<div class="process-bar"><div>');
      processBarEl.css({
        'top': headerBarEl[0].offsetHeight + 'px'
      });
      headerBarEl.append(processBarEl);

      $rootScope.$on('processBar.start', function() {
        // var riseWidth = headerBarEl[0].offsetWidth / 20;
        // var processBarWidth = 0;
        // processInterval = setInterval(function() {
        //   processBarEl.css({
        //     'width': processBarWidth + 'px',
        //     'top': headerBarEl[0].offsetHeight + 'px'
        //   });
        //   processBarWidth += riseWidth;
        // }, 200)
        if(headerBarEl.children('.process-bar'))
          headerBarEl.children('.process-bar').remove();

        headerBarEl.append(processBarEl);
        processBarEl.addClass('process-bar-start');
        processBarEl.css({
          'width': headerBarEl[0].offsetWidth * 3 / 4 + 'px',
        });
      })

      $rootScope.$on('processBar.end', function() {
        // clearInterval(processInterval);
        processBarEl.removeClass('process-bar-start');
        processBarEl.addClass('process-bar-end');
        processBarEl.css({
          'width': headerBarEl[0].offsetWidth + 'px',
        });
        //bar消失
        $timeout(function() {
          processBarEl[0].style.width = 0;

          processBarEl.removeClass('process-bar-end');
          processBarEl.removeClass('process-bar-start');
          // processBarEl.css('opacity', 1);
          processBarEl.remove();
        }, 600)
      })
    }
  }
})