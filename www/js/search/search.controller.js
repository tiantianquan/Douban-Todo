angular.module('DoubanTodoApp')

.controller('SearchCtrl', function($scope, $timeout, $ionicNavBarDelegate, DoubanApi) {
  //设置搜索框焦点 bug:ios 下只有第一次找到焦点
  var searchInput;
  $scope.init = function() {
    $timeout(function() {
      searchInput = $('.search-item-input-inset input');
      searchInput.focus(function() {
        $('ion-nav-back-button').hide('fast');
        $('ion-content').addClass('search-blur');
      })
      searchInput.blur(function() {
        $('ion-nav-back-button').show('fast');
        $('ion-content').removeClass('search-blur');
        DoubanApi.MusicSearch(searchInput.val(), 30, function(data) {
          $scope.searchList = data.musics;
          $scope.$broadcast('initEnd');
        })
      })
      searchInput[0].focus();
    }, 500);
  }


});