angular.module('DoubanTodoApp')

//TodoItem相关
.factory('TodoItem', function() {
  // 创建AV.Object子类.
  var AV_TodoItem = AV.Object.extend('TodoItem');
  var _currentEditItem;

  return {
    Add: function(item, fnSuccess, fnError) {
      var todoItem = new AV_TodoItem();
      todoItem.set('doubanItemID', parseInt(item.doubanAPIData.id));
      //avos 不允许$打头的属性
      delete item.doubanAPIData['$$hashKey'];
      todoItem.set('doubanAPIData', item.doubanAPIData);
      todoItem.set('user', AV.User.current());
      todoItem.set('startTime', item.startTime);
      todoItem.set('endTime',item.endTime);
      todoItem.set('summary',item.summary);
      todoItem.save(null, {
        success: fnSuccess,
        error: fnError
      });
    },
    GetCurrentUserItem: function(callback) {
      var query = new AV.Query(AV_TodoItem);
      query.equalTo('user', AV.User.current());
      query.find({
        success: callback
      })
    },
    GetItemById: function(todoItem, fnSuccess, fnError) {
      var query = new AV.Query(AV_TodoItem);
      query.get(todoItem.id, {
        success: fnSuccess,
        error: fnError
      });
    },
    DeleteItem: function(todoItem, fnSuccess, fnError) {
      this.GetItemById(todoItem, function(data) {
        var deleteItem = data;

        deleteItem.destroy({
          success: fnSuccess,
          error: fnError,
        }, function(data, error) {
          alert(error);
        });
      })
    },
    CurrentEditItem: function() {
      if (arguments.length === 0)
        return _currentEditItem;
      _currentEditItem = arguments[0];
    },
  }
})

//doubanAPI测试
.factory('DoubanApi', function($http) {
  return {
    MusicSearch: function(searchStr, count, callback) {
      var apiUrl = 'https://api.douban.com/v2/music/search';
      // $http({
      //   url: apiUrl,
      //   method: 'JSONP',
      //   // responseType :'JSONP',
      //   params: {
      //     callback: 'JSON_CALLBACK',
      //     // callback: 'jsonpCallback',
      //     q: searchStr,
      //     count: count
      //   }
      // }).success(function(data) {
      //   console.log(data);
      //   // callback(data, status);
      // }).error(function(data) {
      //   console.log(data);
      // });

      $http.jsonp(apiUrl, {
        // responseType :'JSONP',
        params: {
          // callback: 'JSON_CALLBACK',
          callback: 'jsonpCallback',
          q: searchStr,
          count: count
        }
      }).error(function(data) {
        JSON_DATA.musics.forEach(function(music) {
          music.image = music.image.replace('spic', 'lpic');
          music.addSuccess = false;
        });
        callback(JSON_DATA);
      });
    },
    MusicGetById: function(doubanID, callback) {
      var apiUrl = 'https://api.douban.com/v2/music/' + doubanID;
      $http.jsonp(apiUrl, {
        params: {
          callback: 'jsonpCallback',
        }
      }).error(function(data) {
        var musicItem = JSON_DATA;
        musicItem.image = musicItem.image.replace('spic', 'lpic');
        callback(musicItem);
      });
    }


  }
})

.factory('ProcessBarDelegate', function($rootScope, $timeout) {
  return {
    start: function() {
      $timeout(function() {
        $rootScope.$broadcast('processBar.start');
      }, 1);
    },
    end: function() {
      $rootScope.$broadcast('processBar.end');
    }
  }
})

.factory('FlashBarDelegate', function($rootScope, $timeout) {
  return {
    show: function() {
      $timeout(function() {
        $rootScope.$broadcast('flashBar.show');
      }, 1);
    },
    barText: ''
  }
})

.factory('Helper',function(){
  return{
  }
})

.factory('SearchPageCache', function(){
  var _pageContent;
  return{
    set:function(pageContent){
      _pageContent = pageContent;
    },
    get:function(){
      return _pageContent;
    },
    clean:function(){
      _pageContent = null;
    }
  }
})



function jsonpCallback(data) {
  JSON_DATA = data;
}