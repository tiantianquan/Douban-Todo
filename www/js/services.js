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
    },
    GetItemById: function(todoItem, fnSuccess, fnError) {
      var query = new AV.Query(AV_TodoItem);
      query.get(todoItem.objectId, {
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

//圆形进度条
.factory('CircleProcessBar', function() {
  return function() {
    var CircleProcessBar = function(el) {
      this._el = this._initEl(el);
    }

    CircleProcessBar.prototype._initEl = function(el) {
      var _el;
      if (typeof(el) === 'string') {
        _el = document.querySelector(el);
        return _el;
        //将jquery转换成node
      } else if (typeof(el) === 'object') {
        _el = el[0] || el;
        return _el;
      } else {
        return;
      }
    }

    CircleProcessBar.prototype._initBar = function() {
      if (this._midWidth == undefined || this._stratAngle == undefined || this._endAngle == undefined) {
        return;
      }
      var width = this._el.offsetWidth,
        height = this._el.offsetHeight,
        //内半径
        radii = width / 2,
        //外半径
        outerRadii = (width + 2 * this._midWidth) / 2,
        //360°角
        fullAng = 2 * Math.PI;

      var svg = this._svg = this._svg || d3.select(this._el).append('svg')
        .attr('width', outerRadii * 2)
        .attr('height', outerRadii * 2)
        //调整外边距 ,使两个div中心重合
        .attr('style', 'margin:' + (-this._midWidth) + 'px')
        .append('g')
        .attr('transform', 'translate(' + outerRadii + ',' + outerRadii + ')');

      //定义弧形
      var arc = this._arc = this._arc || d3.svg.arc()
        .innerRadius(radii)
        .outerRadius(outerRadii)
        .startAngle(0);
      //绘制弧形  
      var frontBar = this._frontBar = this._frontBar || svg.append('path')
        .datum({
          endAngle: this._stratAngle
        })
        .style('fill', '#4fbcf7')
        //设置attr datum会作为参数传入arc
        .attr('d', arc);
    }

    //宽度
    CircleProcessBar.prototype.midWidth = function() {
        if (arguments.length === 0)
          return this._midWidth;
        this._midWidth = arguments[0];
        this._initBar();
        return this;
      }
      //开始角度
    CircleProcessBar.prototype.startAngle = function() {
        if (arguments.length === 0)
          return this._stratAngle;
        this._stratAngle = arguments[0];
        this._initBar();
        return this;
      }
      //终止角度
    CircleProcessBar.prototype.endAngle = function() {
      if (arguments.length === 0)
        return this._endAngle;
      this._endAngle = arguments[0];
      this._initBar();
      return this;
    }

    CircleProcessBar.prototype.start = function() {
      this.boot(2000);
    }

    CircleProcessBar.prototype.end = function() {
      // this.boot(100, 0);
      this._frontBar
        .datum({
          endAngle: 0
        })
        .attr('d', this._arc);
    }

    CircleProcessBar.prototype.boot = function(dur) {
      var self = this;


      var callback = function(transition, newAngle) {
        transition.attrTween('d', function(d) {
          var interpolate = d3.interpolate(d.endAngle, newAngle);
          return function(t) {
            d.endAngle = interpolate(t);
            return self._arc(d);
          };
        })
      };

      // self._frontBar.transition().duration(dur).call(callback, self._endAngle);
      var frontbarTs = self._frontBar.transition().duration(dur)
      callback(frontbarTs, self._endAngle);
    }

    return CircleProcessBar;

    // var d3Fn = function() {
    //   var el = document.querySelector('.img-convert-full');
    //   //图片宽高
    //   var width = el.offsetWidth,
    //     height = el.offsetHeight,
    //     //内半径-外半径
    //     midWidth = 20,
    //     //内半径
    //     radii = width / 2,
    //     //外半径
    //     outerRadii = (width + 2 * midWidth) / 2,
    //     //360°角
    //     fullAng = 2 * Math.PI,
    //     //初始末尾角度
    //     startEndAngle = 0 * fullAng;

    //   var svg = d3.select('.img-convert-full').append('svg')
    //     .attr('width', outerRadii * 2)
    //     .attr('height', outerRadii * 2)
    //     //调整外边距 ,使两个div中心重合
    //     .attr('style', 'margin:' + (-midWidth) + 'px')
    //     .append('g')
    //     .attr('transform', 'translate(' + outerRadii + ',' + outerRadii + ')');

    //   //定义弧形
    //   var arc = d3.svg.arc()
    //     .innerRadius(radii)
    //     .outerRadius(outerRadii)
    //     .startAngle(0);
    //   //绘制弧形  
    //   var foreground = svg.append('path')
    //     .datum({
    //       endAngle: startEndAngle
    //     })
    //     .style('fill', '#4fbcf7')
    //     .attr('d', arc);


    //   setTimeout(function() {
    //     foreground.transition()
    //       .duration(2000)
    //       .call(function(transition, newAngle) {
    //         transition.attrTween('d', function(d) {
    //           var interpolate = d3.interpolate(d.endAngle, newAngle);
    //           return function(t) {
    //             d.endAngle = interpolate(t);
    //             return arc(d);
    //           };
    //         });
    //       }, fullAng);
    //   }, 2000);

    // }

  }();
})

function jsonpCallback(data) {
  JSON_DATA = data;
}