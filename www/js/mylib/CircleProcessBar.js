/**
 * CircleProcessBar Module
 *
 * Description 圆形进度条
 */
angular.module('CircleProcessBar', [])
  .factory('CircleProcessBarDelegate', function() {
    return function() {

      var toolFn = {
        getSetProp: function(arg, propStr) {
          if (arg.length === 0)
            return this[propStr];
          this[propStr] = arg[0];
          return this;
        },
        unpassTimePercent: function(startTime, endTime) {
          if ('getTime' in startTime && 'getTime' in endTime) {
            var allTimeNum = endTime.getTime() - startTime.getTime();
            var passTimeNum = Date.now() - startTime.getTime();
            var unpassTimeNum = allTimeNum - passTimeNum;
            if (allTimeNum === 0)
              return 0;
            if (allTimeNum < passTimeNum)
              return 0;
            return unpassTimeNum / allTimeNum;
          }
        }
      }

      var CircleProcessBar = function(el) {
        this._el = this._initEl(el);
        this._midWidth = 10;
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

      CircleProcessBar.prototype.initBar = function() {
        if (this._midWidth == undefined) {
          return;
        }
        if (this._startAngle == undefined) {
          return
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
        var frontBar = this._frontBar = this._frontBar === undefined ? svg.append('path') : this._frontBar;
        this._frontBar.datum({
            endAngle: this._startAngle
          })
          .style('fill', '#4fbcf7')
          //设置attr datum会作为参数传入arc
          .attr('d', arc);

          return this;
      }

      //宽度
      CircleProcessBar.prototype.midWidth = function() {
        return toolFn.getSetProp.call(this, arguments, '_midWidth');
      }

      //开始角度
      CircleProcessBar.prototype.startAngle = function() {
        return toolFn.getSetProp.call(this, arguments, '_startAngle');
      }

      //终止角度
      CircleProcessBar.prototype.endAngle = function() {
        return toolFn.getSetProp.call(this, arguments, '_endAngle')
      }

      //开始时间
      CircleProcessBar.prototype.startTime = function() {
        toolFn.getSetProp.call(this, arguments, '_startTime')
        if (this._startTime != undefined && this._endTime != undefined) {
          this.startAngle(toolFn.unpassTimePercent(this._startTime, this._endTime) * 2 * Math.PI);
        }
        return this;
      }

      //终止时间
      CircleProcessBar.prototype.endTime = function() {
        toolFn.getSetProp.call(this, arguments, '_endTime');
        if (this._startTime != undefined && this._endTime != undefined) {
          this.startAngle(toolFn.unpassTimePercent(this._startTime, this._endTime) * 2 * Math.PI);
        }
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
        clearInterval(this._interval);
        this.startAngle(0);
        this.endAngle(0);
      }

      CircleProcessBar.prototype.boot = function(dur) {
        var self = this;
        this._interval = setInterval(function() {
          self._endAngle = toolFn.unpassTimePercent(self._startTime, self._endTime) * 2 * Math.PI;
          if (self._endAngle == 0){
            clearInterval(self._interval);
          }
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
        }, 1000)
      }

      return CircleProcessBar;
    }();
  })