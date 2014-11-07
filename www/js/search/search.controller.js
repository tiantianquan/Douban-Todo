angular.module('DoubanTodoApp')

.controller('SearchCtrl', function($scope, $timeout, $state, ProcessBarDelegate, TodoItem, DoubanApi, SearchPageCache) {
  //设置搜索框焦点 bug:ios 下只有第一次找到焦点
  var searchInput;
  $scope.searchList;

  $scope.init = function() {
    if (SearchPageCache.get()){
      $scope.searchList = SearchPageCache.get().content;
    }

    $timeout(function() {
      searchInput = $('.search-item-input-inset input');
      searchInput.focus(function() {
        $('ion-nav-back-button').hide('fast');
        $('ion-content').addClass('search-blur');
      })
      searchInput.blur(function() {

        $('ion-nav-back-button').show('fast');
        $('ion-content').removeClass('search-blur');
        //如果搜索框有值则不进行搜素
        if (!!searchInput.val()) {
          DoubanApi.MusicSearch(searchInput.val(), 30, function(data) {
            $scope.searchList = data.musics;
          })
        }
      })

      if (!SearchPageCache.get())
        searchInput[0].focus();
      else 
        searchInput.val(SearchPageCache.get().searchtext);
    }, 500);
  }

  $scope.addToTodoList = function(searchItem) {
    SearchPageCache.set({
      searchtext:searchInput.val(),
      content:$scope.searchList
    });
    TodoItem.CurrentEditItem(searchItem);
    $state.go('itemEdit');
  }

  $scope.isZero = function() {
    if ($scope.searchList != undefined)
      return !!$scope.searchList.length;
    return true;
  }

});