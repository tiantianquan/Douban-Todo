angular.module('DoubanTodoApp')

//TodoItem相关
.factory('TodoItem', function() {
  // 创建AV.Object子类.
  var AV_TodoItem = AV.Object.extend('TodoItem');

  return {
    Add: function(doubanItem, fnSuccess, fnError) {
      var todoItem = new AV_TodoItem();
      todoItem.set('doubanItemID', parseInt(doubanItem.id));
      todoItem.set('doubanAPIData', doubanItem);
      todoItem.set('user', AV.User.current());
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
    }
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

function jsonpCallback(data) {
  JSON_DATA = data;
}