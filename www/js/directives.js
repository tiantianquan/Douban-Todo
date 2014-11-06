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
      if (ionNavBar.length === 0)
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


//进度条
.directive('processBar', function($timeout, $rootScope) {
  return {
    restrict: 'A',
    link: function(scope, element, attr) {
      var headerBarEl = element;
      if (element[0].tagName !== 'ION-HEADER-BAR' && element[0].tagName !== 'ION-NAV-BAR')
        return;
      var processBarEl = angular.element('<div class="process-bar"><div>');
      processBarEl.css({
        // 'top': headerBarEl[0].offsetHeight + 'px'
      });
      headerBarEl.append(processBarEl);

      $rootScope.$on('processBar.start', function() {
        if (headerBarEl.children('.process-bar'))
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

.directive('flashBar', function($rootScope, $timeout, FlashBarDelegate) {
  return {
    restrict: 'A',
    link: function(scope, element, attr) {
      var headerBarEl = element;
      if (element[0].tagName !== 'ION-HEADER-BAR' && element[0].tagName !== 'ION-NAV-BAR')
        return;

      var createEl = function() {
        var el = angular.element('<div class="flash-bar"><p></p></div>');
        el.startTop = parseInt(headerBarEl[0].offsetHeight) - 30;
        el.fannelTop = headerBarEl[0].offsetHeight;
        el.css({
          'top': el.startTop + 'px',
          'width': headerBarEl[0].offsetWidth + 'px'
        });
        return el;
      }

      //新建元素
      var flashBarEl = createEl();
      //注入
      headerBarEl.after(flashBarEl);
      //触发事件
      // $rootScope.$on('flashBar.show', function() {
      //   flashBarEl.children('p').text(FlashBarDelegate.barText);
      //   flashBarEl.css({
      //     'top': flashBarEl.fannelTop + 'px',
      //   });
      //   $timeout(function() {
      //     flashBarEl.css({
      //       'top': flashBarEl.startTop + 'px',
      //     });
      //   }, 2000);
      // })
      FlashBarDelegate.show = function() {
        flashBarEl.children('p').text(FlashBarDelegate.barText);
        flashBarEl.css({
          'top': flashBarEl.fannelTop + 'px',
        });
        $timeout(function() {
          flashBarEl.css({
            'top': flashBarEl.startTop + 'px',
          });
        }, 2000);
      }
    }
  }
})

.directive('convertDateString', function() {
  return {
    require: '?ngModel',
    link: function(scope, ele, attrs, ngModel) {
      if (!ngModel) return;
      ngModel.$parsers.unshift(function(viewValue) {
        var dateValue = new Date(viewValue);
        if (isNaN(dateValue.getTime())) {
          ngModel.$setValidity('stringToDate', false);
          return undefined;
        } else {
          ngModel.$setValidity('stringToDate', true);
          dateValue.setHours(0);
          return dateValue;
        }
      })
      ngModel.$formatters.unshift(function(modelValue) {
        if (angular.isDate(modelValue)) {
          var list = modelValue.toLocaleDateString().split('/');
          list.forEach(function(i,index) {
            if (i.length < 2) {
              list[index] = '0'+i;
            }
          })
          var stringValue = list.join('-');
          return stringValue;
        } else {
          return '';
        }
      })
    }
  }
})