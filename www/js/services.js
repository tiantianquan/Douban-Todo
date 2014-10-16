angular.module('DoubanTodoApp')

//TodoItem相关
.factory('TodoItem', function() {

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
        });
        callback(JSON_DATA);
      });
    },
    MusicGetById: function(doubanID, callback) {
      var apiUrl = 'https://api.douban.com/v2/music/'+doubanID;
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