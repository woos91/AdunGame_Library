
// #Geometry
// #adun.Geom
/**
 * 기하학과 기하학적 도형의 충돌을 다루는 클래스다.
 *
 * @module Adun
 * @submodule Geom
 */
(function(adun) {
    'use strict';

    var Geom = adun.Geom = {};
})(adun || (adun = {}));

// #AABB
/**
 * AABB(Axis Aligned Bounding Box)
 * 축 정렬 경계 박스
 * 2D 기준으로 x, y축에 평행한 경계를 만들어 낸다.
 * 장점: 충돌처리에 연산속도가 빠르며 직관적이다.
 * 단점: 회전하는 물체에 적합 하지않다.
 *
 * @Class AABB
 * @namespace Adun.Geom
 * @constructor
 * @param [cx=0] {Number} 박스 x축의 중앙 위치
 * @param [cy=0] {Number} 박스 y축의 중앙 위치
 * @param [width=0] {number} 박스의 넓이
 * @param [height=0] {number} 박스의 높이
 * @return {adun.Geom.AABB} AABB object
 */
(function(adun) {
    'use strict';

    var AABB = adun.Geom.AABB = adun.Class({
        TYPE: 'AABB',

        init: function(cx, cy, width, height) {

            /**
             * 박스 x축의 중앙 위치
             *
             * @property cx
             * @type {Number}
             * @default 0
             * @public
             */
            this.cx = 0;

            /**
             * 박스 y축의 중앙 위치
             *
             * @property cy
             * @type {Number}
             * @default 0
             * @public
             */
            this.cy = 0;

            /**
             * 박스 넓이의 절반
             *
             * @property halfWidth
             * @type {Number}
             * @default 0
             * @public
             */
            this.halfWidth = 0;

            /**
             * 박스 높이의 절반
             *
             * @property halfHeight
             * @type {Number}
             * @default 0
             * @public
             */
            this.halfHeight = 0;


            this.cx = cx || 0;
            this.cy = cy || 0;
            this.halfWidth = width / 2 || 0;
            this.halfHeight = height / 2 || 0;
        },

        height: {
            /**
             * 박스의 높이
             *
             * @property height
             * @type {Number}
             * @readyOnly
             * @public
             */
            get: function() {
                return this.halfWidth * 2;
            }
        },

        width: {
            /**
             * 박스의 넓이
             *
             * @property height
             * @type {Number}
             * @readyOnly
             * @public
             */
            get: function() {
                return this.width * 2;
            }
        },

        /**
         * 캔버스에 객체를 그린다.
         *
         * @method draw
         * @para ctx {CanvasRenderingContext2D} 그리고 싶은 캔버스의 컨텍스트
         * @return {adun.Geom.AABB}
         * @public
         */
        draw: function(ctx) {
            ctx.beginPath();
            ctx.moveTo(this.cx - this.halfWidth, this.cy);
            ctx.lineTo(this.cx + this.halfWidth, this.cy);
            ctx.moveTo(this.cx, this.cy - this.halfHeight);
            ctx.lineTo(this.cx, this.cy + this.halfHeight);
            ctx.stroke();
            return this;
        },

        /**
         * 객체의 새로운 위치를 설정한다.
         *
         * @method setPosition
         * @param cx {Number} 박스 x축의 새로운 중앙 위치
         * @param cy {Number} 박스 y축의 새로운 중앙 위치
         * @return {adun.Geom.AABB}
         * @public
         */
        setPosition: function(cx, cy) {
            this.cx = cx || 0;
            this.cy = cy || 0;

            return this;
        },

        /**
         * 객체의 새로운 위치를 포인트 객체로부터 설정한다.
         *
         * @method setPositionPoint
         * @param pos {adun.Geom.Point}
         * @return {adun.Geom.AABB}
         * @public
         */
        setPositionPoint: function(pos) {
            this.cx = pos.x;
            this.cy = pos.y;

            return this;
        },

        /**
         * Rectangle 객체로 반환한다.
         *
         * @method toRect
         * @return {adun.Geom.Rectangle}
         * @public
         */
        toRect: function() {
            return new adun.Geom.Rectangle(this.cx - this.halfWidth, this.cy - this.halfHeight, this.halfWidth * 2, this.halfHeight * 2);
        },

        /**
         * Rectangle으로부터 AABB의 치수를 받는다.
         *
         * @method setPositionPoint
         * @param rect {adun.Geom.Rectangle}
         * @return {adun.Geom.AABB}
         * @public
         */
        fromRect: function(rect) {
            this.halfWidth = rect.width / 2;
            this.halfHeight = rect.height / 2;
            this.cx = rect.x + this.halfWidth;
            this.cy = rect.y + this.halfHeight;

            return this;
        }
    });

})(adun || (adun = {}));

// #Circle
/**
 * Circle
 * 원
 * Circle 객체는 position에 의해 정의된 중심점(x, y)과 지름을 가진다.
 *
 * @Class Circle
 * @namespace Adun.Geom
 * @constructor
 * @param [x=0] {Number} 원의 중앙 x좌표
 * @param [y=0] {Number} 원의 중앙 y좌표
 * @param [diameter=0]{Number} 원의 지름
 * @return {adun.Geom.Circle} Circle object
 */
(function() {
    'use strict';

    var Circle = adun.Geom.Circle = adun.Class({
        TYPE: 'Circle',

        init: function(x, y, diameter) {

            /**
             * 원의 지름
             *
             * @property _diameter
             * @type {Number}
             * @default 0
             * @private
             */
            this._diameter = 0;

            /**
             * 원의 반지름
             *
             * @property _radius
             * @type {Number}
             * @default 0
             * @private
             */
            this._radius = 0;

            /**
             * 원의 중앙 x좌표
             *
             * @property x
             * @type {Number}
             * @default 0
             * @public 0
             */
            this.x = 0;

            /**
             * 원의 중앙 y좌표
             *
             * @property y
             * @type {Number}
             * @default 0
             * @public 0
             */
            this.y = 0;

            this.setTo(x, y, diameter);
        },

        diameter: {
            get: function() {
                return this._diameter;
            },
            /**
             * 원의 지름(diameter)
             * 원안의 어떤 두점 사이의 가장 큰 거리이다.
             * 반지름(radius) * 2와 같다.
             *
             * @property diameter
             * @type {Number}
             * @public
             */
            set: function(valued) {
                if( value > 0 ) {
                    this._daimater = value;
                    this._radius = value * 0.5;
                }
            }
        },

        radius: {
            get: function() {
                return this._radius;
            },
            /**
             * 원의 반지름(radius)
             * 원의 중심으로부터 원의 어떤 선까지의 거리이다.
             *
             * @property radius
             * @type {Number}
             * @public
             */
            set: function(value) {
                if( value > 0 ) {
                    this._radius = value;
                    this._daimater = value * 2;
                }
            }
        },

        circumference: {
            /**
             * 원의 둘레(circumference)
             *
             * @property circumference
             * @type {Number}
             * @readOnly
             * @public
             */
            get: function() {
                return 2 * (Math.PI * this._radius);
            }
        },

        top: {
            get: function() {
                return this.y - this._radius;
            },
            /**
             * top
             * 원의 가장 위 y좌표 값이다.
             * 원의 y좌표 값과 반지름의 '차' 이다.
             * top 프로퍼티값을 바꾸는것은 원 객체의 지름을 바꾸며, 원 객체의 x,y 좌표값에는 아무런 영향을 끼치지 않는다.
             *
             * @property top
             * @type {Number}
             * @public
             */
            set: function(value) {
                if ( adun.isNumber(value) ) {
                    if( value > this.y ) {
                        this._radius = 0;
                        this._diameter = 0;
                    } else {
                        this.radius = this.y - value;
                    }
                }
            }
        },

        bottom: {
            get: function() {
                return this.y + this._radius;
            },
            /**
             * bottom
             * 원의 가장 아래 y좌표 값이다.
             * 원의 y좌표 값과 반지름의 '합' 이다.
             * bottom 프로퍼티값을 바꾸는것은 원 객체의 지름을 바꾸며, 원 객체의 x,y 좌표값에는 아무런 영향을 끼치지 않는다.
             *
             * @property bottom
             * @type {Number}
             * @public
             */
            set: function(value) {
                if ( adun.isNumber(value) ) {
                    if( value < this.y ) {
                        this._radius = 0;
                        this._diameter = 0;
                    } else {
                        this.radius = value - this.y;
                    }
                }
            }
        },

        left: {
            get: function() {
                return this.x - this._radius;
            },
            /**
             * left
             * 원의 가장 왼쪽 x좌표이다.
             * 원의 x좌표 값과 반지름의 '차' 이다.
             * left 프로퍼티값을 바꾸는것은 원 객체의 지름을 바꾸며, 원 객체의 x,y 좌표값에는 아무런 영향을 끼치지 않는다.
             *
             * @property left
             * @type {Number}
             * @public
             */
            set: function(value) {
                if ( adun.isNumber(value) ) {
                    if( value < this.x ) {
                        this.radius = this.x - value;
                    } else {
                        this._radius = 0;
                        this._diameter = 0;
                    }
                }
            }
        },

        right: {
            get: function() {
                return this.x + this._radius;
            },
            /**
             * right
             * 원의 가장 오른쪽 x좌표이다.
             * 원의 x좌표 값과 반지름의 '합' 이다.
             * right 프로퍼티값을 바꾸는것은 원 객체의 지름을 바꾸며, 원 객체의 x,y 좌표값에는 아무런 영향을 끼치지 않는다.
             *
             * @property right
             * @type {Number}
             * @public
             */
            set: function(value) {
                if ( adun.isNumber(value) ) {
                    if( value > this.x ) {
                        this.radius = value - this.x;
                    } else {
                        this._radius = 0;
                        this._diameter = 0;
                    }
                }
            }
        },

        area: {
            /**
             * 원의 넓이(area)
             *
             * @property area
             * @type {Number}
             * @readOnly
             * @public
             */
            get: function() {
                if( this._radius > 0 ) {
                    return Math.PI * this._radius * this._radius;
                }
            }
        },

        isEmpty: {
            /**
             * 원이 빈원인인지 아닌지 반환한다.
             * 원의 지름이 0과 같거나 작으면 true, 아니면 false
             *
             * @property isEmpty
             * @return {Boolean}
             * @public
             */
            get: function() {
                return this._daimater <= 0;
            }
        },

        /**
         * 원의 중앙 x, y좌표와 지름을 설정한다.
         *
         * @method setTo
         * @param x
         * @param y
         * @param diameter
         * @return {adun.Geom.Circle}
         * @public
         */
        setTo: function(x, y, diameter) {
            this.x = x || 0;
            this.y = y || 0;
            this._diameter = diameter || 0;
            this._radius = diameter * 0.5 || 0;

            return this;
        },

        /**
         * 같은 프로퍼티 x, y, 지름, 반지름 값을 가진 새로운 Circle 객체를 반환한다.
         *
         * @method clone
         * @param [output=adun.Circle] {adun.Geom.Circle}
         * @return {adun.Geom.Circle}
         * @public
         */
        clone: function(output) {
            if( adun.isUndefined(output) ) { output = new Circle(); }

            return output.setTo(this.x, this.y, this._daimater);
        },

        /**
         * 다른 Circle 객체로부터 프로퍼티 x, y, 지름, 반지름 값을 이 Circle 객체로 복사한다.
         *
         * @param source {adun.Geom.Circle}
         * @return {adun.Geom.Circle}
         * @public
         */
        copyFrom: function(source) {
            return this.setTo(source.x, source.y, source.diameter);
        },

        /**
         * 이 Circle 객체의 프로퍼티 값을 파라미터로 받은 Circle 객체에 복사하여 파라미터로 받은 Circle 객체를 반환한다.
         *
         * @param target {adun.Geom.Circle} this 객체를 복사하여 반환할 객체
         * @return {adun.Geom.Circle}
         * @public
         */
        copyTo: function(target) {
            return target.copyFrom(this);
        },

        /**
         * 이 Circle 객체의 중심과 파리미터로 받은 객체의 중심사이의 거리를 반환한다.
         * 파라미터로 받은 객체는 Circle, Point등 x, y값이 있으면 어느것도 가능하다.
         *
         * @param target {Any} Circle, Point등 x, y값이 있으면 어느것도 가능하다.
         * @param [round= false] {Boolean} 가장 가까운 정수로 반올림한다. (default false)
         * @return {Number}
         * @public
         */
        distanceTo: function(target, round) {
            if( adun.isUndefined(round) ) { round = false }

            var dx = this.x - target.x;
            var dy = this.y - target.y;

            if( round ) {
                return Math.round(Math.sqrt(dx * dx + dy * dy));
            } else {
                return Math.sqrt(dx * dx + dy * dy);
            }
        },

        /**
         * 파라미터로 받은 Circle 객체와 프로퍼티 x, y, diameter(지름) 값이 같은지 비교한다.
         *
         * @method equals
         * @param toCompare {adun.Geom.Circle}
         * @return {Boolean}
         * @public
         */
        equals: function(toCompare) {
            return this.x === toCompare.x && this.x === toCompare.y && this.diameter === toCompare.diameter;
        },

        /**
         * 두개의 Circle 객체가 충돌햇는지 검사한다.
         *
         * @method intersects
         * @param toIntersect {adun.Geom.Circle}
         * @return {Boolean}
         * @public
         */
        intersects: function(toIntersect) {
            return this.distanceTo(toIntersect, false) < (this._radius + toIntersect._radius);
        },

        /**
         * 주어진 각도에 기반하여 이 CIrcle 객체의 둘레에서 하나의 점 좌표를 반환한다..
         *
         * @method circumferencePoint
         * @param angle {Number} 다윈가 라디안 또는 도
         * @param [asDegrees=false] 주어진 angle의 단위가 도이면 true, 라디안이면 false (dafault=false)
         * @param [output=adun.Geom.Point]
         * @return {adun.Geom.Point}
         * @public
         */
        circumferencePoint: function(angle, asDegrees, output) {
            if( adun.isUndefined(asDegrees) ) { asDegrees = false }
            if( adun.isUndefined(output) ) { output = new adun.Geom.Point; }

            if( asDegrees ) {
                angle = angle * (Math.PI / 180);  // Radians -> Degree
            }

            output.x = this.x + this._radius * Math.cos(angle);
            output.y = this.x + this._radius * Math.sin(angle);

            return output;
        },

        /**
         * Circle 객체의 중심좌표(x, y)의 위치를 주어진 값만큼 조정한다.
         *
         * @method offset
         * @param dx {Number} Circle 객체의 x값을 이동한다.
         * @param dy {Number} Circle 객체의 y값을 이동한다.
         * @return {adun.Geom.Circle}
         * @public
         */
        offset: function(dx, dy) {
            if( adun.isNumber(dx) && adun.isNumber(dy) ) {
                this.x += dx;
                this.y += dy;
            }

            return this;
        },

        /**
         * Point 객체를 이용하여 Circle 객체의 중심좌표(x, y)의 위치를 주어진 값만큼 조정한다.
         *
         * @method offset
         * @param post {adun.Geom.Point}
         * @return {adun.Geom.Circle}
         * @public
         */
        offsetPoint: function(pos) {
            return this.offset(pos.x, pos.y);
        }
    });
})();

// #Line
/**
 * Line
 * 선
 * Line(선) 객체는 두가지 의미가 있는데 필요로 하는 상황에 따라 다르다.
 * 1. 무한한 선                    (직선)
 * 2. 두개의 지정한 위치 사이의 선 (선분)
 *
 * @Class Line
 * @namespace Adun.Geom
 * @constructor
 * @param [x1=0] {Number} 선의 시작 x 좌표
 * @param [y1=0] {Number} 선의 시작 y 좌표
 * @param [x2=0] {Number} 선의 끝 x 좌표
 * @param [y2=0] {Number} 선의 끝 y 좌표
 * @return {adun.Geom.Line} Line object
 */
(function() {
    'use strict';
    var Line = adun.Geom.Line = adun.Class({
        TYPE: 'Line',

        init: function(x1, y1, x2, y2) {

            /**
             * 선의 시작 x좌표
             *
             * @property x1
             * @type {Number}
             * @default 0
             * @public
             */
            this.x1 = 0;

            /**
             * 선의 시작 y좌표
             *
             * @property y1
             * @type {Number}
             * @default 0
             * @public
             */
            this.y1 = 0;

            /**
             * 선의 끝 x좌표
             *
             * @property x2
             * @type {Number}
             * @default 0
             * @public
             */
            this.x2 = 0;

            /**
             * 선의 끝 y좌표
             *
             * @property y2
             * @type {Number}
             * @default 0
             * @public
             */
            this.y2 = 0;

            this.setTo(x1, y1, x2, y2);
        },

        length: {
            /**
             * 선의 길이
             *
             * @property length
             * @type {Number}
             * @readyOnly
             * @public
             */
            get: function() {
                Math.sqrt((this.x2 - this.x1) * (this.x2 - this.x1) + (this.y2 - this.y1) *(this.y2 - this.y1));
            }
        },

        angle: {
            /**
             * 선의 각도(라디안)
             * Math.atan2(y, x)
             *
             * @property angle
             * @type {Number}
             * @readyOnly
             * @public
             */
            get: function() {
                return Math.atan2(this.y2 - this.y1, this.x2 - this.x1);
            }
        },

        slope: {
            /**
             * 선의 기울기
             * y의 증가량 / x의 증갈야 (y/x)
             *
             * @property angle
             * @type {Number}
             * @readyOnly
             * @public
             */
            get: function() {
                return (this.y2 - this.y1) / (this.x2 - this.x1);
            }
        },

        perpSlope: {
            /**
             * 선의 90도로 교차하는 기울기
             *
             * @property angle
             * @type {Number}
             * @readyOnly
             * @public
             */
            get: function() {
                return -((this.x2 - this.x1) / (this.y2 - this.y1));
            }
        },

        yIntercept: {
            /**
             * 선의 y 절편
             * y = ax + b 에서 b가 절편
             *
             * @property yIntercept
             * @type {Number}
             * @readOnly
             * @public
             */
            get: function() {
                return (this.y1 - this.slope * this.x1);
            }
        },

        /**
         * Line 객체의 좌표를 설정한다.
         *
         * @method setTo
         * @param x1 시작 x좌표
         * @param y1 시작 y좌표
         * @param x2 끝 x 좌표
         * @param y2 끝 y 좌표
         * @return {adun.Geom.Line}
         * @public
         */
        setTo: function(x1, y1, x2, y2) {
            this.x1 = x1 || 0;
            this.y1 = y1 || 0;
            this.x2 = x2 || 0;
            this.y2 = y2 || 0;

            return this;
        },

        /**
         * 같은 프로퍼티 값을 가진 새로운 Line 객체를 반환한다.
         *
         * @method clone
         * @param [output=adun.Geom.Line] {adun.Geom.Line}
         * @return {adun.Geom.LIne}
         * @public
         */
        clone: function(output) {
            if( adun.isUndefined(output) ) { output = new Line(); }

            return output.setTo(this.x1, this.y1, this.x2, this.y2);
        },

        /**
         * 다른 Line 객체의 프로퍼티 값을 이 Line 객체로 복사한다.
         *
         * @param source {adun.Geom.Line}
         * @return {adun.Geom.Line}
         * @public
         */
        copyFrom: function(source) {
            return this.setTo(source.x1, source.y1, source.x2, source.y2);
        },

        /**
         * 이 Line 객체의 프로퍼티 값을 파라미터로 받은 Line 객체에 복사하여 반환한다.
         *
         * @param target {adun.Geom.Line} this 객체를 복사하여 반환할 객체
         * @return {adun.Geom.Line}
         * @public
         */
        copyTo: function(target) {
            return target.copyFrom(this);
        },

        /**
         * 한 점이 무한한 선 위에있는지 체크한다.
         *
         * @method isPointOnLine
         * @param x {Number}
         * @param y {Number}
         * @return {Boolean}
         * @public
         */
        isPointOnLine: function(x, y) {
            // Gradient
            // 참고: http://www.teacherschoice.com.au/Maths_Library/Gradient/gradient_-_two_fixed_points.htm
            // (this.y2 - this.y1) / (this.x2 - this.x1) === (y - this.y1) / (x - this.x1); 에 대한 곱셈표현과 동치. (x,y) 에 대해서 대상 직선의 증분값이 적용되는지 비교하는 식
            // 나눗셈으로 할경우  precision로 인해 truncation 오류 발생 가능성
            return (x - this.x1) * (this.y2 - this.y1) === (this.x2 - this.x1) * (y - this.y1);
        },

        /**
         * 한 점이 두개의 지정한 위치 사이의 선 위에있는지 체크한다.
         *
         * @method isPointOnLineSegment
         * @param x {Number}
         * @param y {Number}
         * @return {Boolean}
         * @public
         */
        isPointOnLineSegment: function(x, y) {
            var xMin = Math.min(this.x1, this.x2);
            var xMax = Math.max(this.x1, this.x2);
            var yMin = Math.min(this.y1, this.y2);
            var yMax = Math.max(this.y1, this.y2);

            return this.isPointOnLine(x, y) && (x >= xMin && x <= xMax) && (y >= yMin && y <= yMax);
        },

        /**
         * 무한한 두 선이 충돌하는지 검사한다.
         *
         * @method intersectLineLine
         * @param line {adun.Geom.Line}
         * @return {adun.Geom.IntersectResult} IntersectResult는 충돌 정보를 포함한다.
         * @public
         */
        intersectLineLine: function(line) {
            return adun.Geom.Intersect.lineToLine(this, line);
        },

        /**
         * 선에서 주어진 한 지점을 통과하는 직선(perpendicular)을 반환한다.
         *
         * @param x
         * @param y
         * @param output
         * @returns {*}
         */
        perp: function(x, y, output) {
            if( adun.isUndefined(output) ) { output = new adun.Geom.Line(); }

            // 만약 현재 선이 수평선이라면 수직선을 반환한다.
            if( this.y1 === this.y2 ) {
                output.setTo(x, y, x, this.y1);
                return output;
            }

            // 만약 현재 선이 수직선이라며 수평선을 반환한다.
            if( this.x1 === this.x2 ) {
                output.setTo(x, y, this.x1, y);
                return output;
            }

            var pt, yInt = (y - this.perpSlope * x);       // y절편: y = ax + b -> b = y - ax

            if( x !== 0 ) {
                pt = this.intersectLineLine({x1: x, y1: y, x2: 0, y2: yInt});
            } else {
                pt = this.intersectLineLine({x1: x, y1: y, x2: 1, y2: yInt + this.perpSlope});
            }

            output.setTo(x, y, pt.x, pt.y);

            return output;
        },

        draw: function(ctx) {
            ctx.beginPath();
            ctx.moveTo(this.x1, this.y1);
            ctx.lineTo(this.x2, this.y2);
            ctx.stroke();
            return this;
        },
    });
})();

// #Ray
/**
 * Ray
 * 광선
 * Ray(광선) 객체는 시작지점으로부터 한 방향으로 무한히 뻗어나간다.
 *
 * @Class Ray
 * @namespace Adun.Geom
 * @constructor
 * @param [x1=0] {Number} 광선의 시작 x 좌표
 * @param [y1=0] {Number} 광선의 시작 y 좌표
 * @param [x2=0] {Number} 광선의 끝 x 좌표 -> 방향계산에 사용되므로, 진짜 끝을 의미하지는 않는다.
 * @param [y2=0] {Number} 광선의 끝 y 좌표 -> 방향계산에 사용되므로, 진짜 끝을 의미하지는 않는다.
 * @return {adun.Geom.Ray} Ray object
 */
(function() {
    'use strict';
    var Ray = adun.Geom.Ray = adun.Class({
        extend: adun.Geom.Line,
        TYPE: 'Ray',

        init: function(x1, y1, x2, y2) {
            this.super(x1, y1, x2, y2);
        },

        /**
         * 같은 프로퍼티 값을 가진 새로운 Ray 객체를 반환한다.
         *
         * @method clone
         * @param [output=adun.Geom.Ray] {adun.Geom.Ray}
         * @return {adun.Geom.Ray}
         * @public
         */
        clone: function(output) {
            if( adun.isUndefined(output) ) { output = new Ray(); }

            return output.setTo(this.x1, this.y1, this.x2, this.y2);
        },

        /**
         * 한 점이 광선 위에있는지 체크한다.
         *
         * @method isPointOnRay
         * @param x {Number}
         * @param y {Number}
         * @return {Boolean}
         * @public
         */
        isPointOnRay: function(x, y) {
            // Gradient
            // 참고: http://www.teacherschoice.com.au/Maths_Library/Gradient/gradient_-_two_fixed_points.htm
            // (this.y2 - this.y1) / (this.x2 - this.x1) === (y - this.y1) / (x - this.x1); 에 대한 곱셈표현과 동치. (x,y) 에 대해서 대상 직선의 증분값이 적용되는지 비교하는 식
            // 나눗셈으로 할경우  precision로 인해 truncation 오류 발생 가능성
            if( (x - this.x1) * (this.y2 - this.y1) === (this.x2 - this.x1) * (y - this.y1) ) {
                // 각도를 비교한다.
                if( Math.atan2(y - this.y1, x - this.x1) == Math.atan2(this.y2 - this.y1, this.x2 - this.x1)) {
                    return true;
                }
            }

            return false;
        }
    });
})();

// #Rectangle
/**
 * Rectangle
 * 사각형
 * Rectangle 객체는 top-left 위치(x, y)와 넓이, 높이를 가진다.
 *
 * @Class Rectangle
 * @namespace Adun.Geom
 * @constructor
 * @param [x=0] {Number} top-left의 x 좌표
 * @param [y=0] {Number} top-left의 y 좌표
 * @param [width=0]{Number} 사각형의 넓이
 * @param [height=0]{Number} 사각형의 높이
 * @return {adun.Geom.Rectangle} Rectangle object
 */
(function() {
    'use strict';

    var Rectangle = adun.Geom.Rectangle = adun.Class({
        TYPE: 'Rectangle',

        init: function(x, y, width, height) {

            /**
             * top-left의 x 좌표
             *
             * @property x
             * @type {Number}
             * @default 0
             * @public
             */
            this.x = 0;

            /**
             * top-left의 y 좌표
             *
             * @property y
             * @type {Number}
             * @default 0
             * @public
             */
            this.y = 0;

            /**
             * 사각형의 넓이
             *
             * @property width
             * @type {Number}
             * @default 0
             * @public
             */
            this.width = 0;

            /**
             * 사각형의 높이
             *
             * @property height
             * @type {Number}
             * @default 0
             * @public
             */
            this.height = 0;

            this.setTo(x, y, width, height);
        },

        bottom: {
            get: function() {
                return this.y + this.height;
            },
            /**
             * bottom
             * 사각형의 y좌표 값과 넓이의 '합' 이다.
             * bottom 프로퍼티값을 바꾸는것은 사각형 객체의 높이를 바꾸며, 사각형 객체의 x,y 좌표값에는 아무런 영향을 끼치지 않는다.
             *
             * @property bottom
             * @type {Number}
             * @public
             */
            set: function(height) {
                if( value ) {
                    if( value < this.y) {
                        this.height = 0
                    } else {
                        this.height = value;
                    }
                }
            }
        },

        bottomRight: {
            get: function() {
                var output = new adun.Geom.Point();
                return output.setTo(this.right, this.bottom);
            },
            /**
             * bottomRight
             * 사각형의 bottom-right 좌표
             * 매개변수의 x, y값에 의해 설정된다.
             *
             * @property bottomRIght
             * @type {adun.Geom.Point}
             * @public
             */
            set: function(value) {
                if( value ) {
                    this.right = value.x;
                    this.bottom = value.y;
                }
            }

        },

        center: {
            /**
             * center
             * 사각형의 중심 좌표값이다.
             *
             * @property center
             * @type {adun.Geom.Point}
             * @readOnly
             * @public
             */
            get: function() {
                var output = new adun.Geom.Point();
                return output.setTo(Math.round(this.width / 2), Math.round(this.height / 2));
            }
        },

        left: {
            get: function() {
                return this.x;
            },
            /**
             * left
             * 사각형의 top-left의 x 좌표
             * left값을 바꾸는 것은 y와 높이의 값는 영향을 끼치지 않으며,
             * 넓이에는 영향을 준다
             * 그러나 x좌표 값을 바꾸는 넓이에 영향을 끼치지 않는다.
             *
             * @property left
             * @type {Number}
             * @public
             */
            set: function(value) {
                if( value ) {
                    var diff = this.x - value;
                    if( this.width + diff < 0 ) {
                        this.width = 0;
                        this.x = value;
                    } else {
                        this.width += diff;
                        this.x = value;
                    }
                }
            }
        },

        right: {
            get: function() {
                return this.x + this.width;
            },
            /**
             * right
             * x좌표값와 넓이의 '합'
             * right값을 바꾸는 것은 x,y와 높이의 값는 영향을 끼치지 않으며,
             * 넓이에는 영향을 준다
             * 그러나 x좌표 값을 바꾸는 넓이에 영향을 끼치지 않는다.
             *
             * @property right
             * @type {Number}
             * @public
             */
            set: function(value) {
                if( value ) {
                    if( value < this.x ) {
                        this.width = 0;
                    } else {
                        this.width = value - this.x;
                    }
                }
            }
        },

        size: {
            /**
             * size
             * 사각형 객체의 사이즈다
             * 넓이와 높이를 가진 포인트 객체가 반환된다.
             *
             * @property size
             * @type {adun.Geom.Point}
             * @public
             */
            get: function() {
                var output = new adun.Geom.Point();
                return output.setTo(this.width, this.height);
            }
        },

        volume: {
            /**
             * volume
             * 사각형 객체의 부피
             * width * height
             *
             * @property volume
             * @type {Number}
             * @readOnly
             * @public
             */
            get: function() {
                return this.width * this.height;
            }
        },

        perimeter: {
            /**
             * perimeter
             * 사각형의 둘레
             * 4변 길이의 합
             *
             * @property volume
             * @type {Number}
             * @readOnly
             * @public
             */
            get: function() {
                return (this.width * 2) + (this.height * 2);
            }
        },

        top: {
            get: function() {
                return this.y;
            },
            /**
             * top
             * 사각형의 top-left의 y 좌표
             * top값을 바꾸는 것은 x와 넓이의 값는 영향을 끼치지 않으며,
             * 높이에는 영향을 준다
             * 그러나 y좌표 값을 바꾸는 것은 높이에 영향을 끼치지 않는다.
             *
             * @property top
             * @type {Number}
             * @public
             */
            set: function(value) {
                if( value ) {
                    var diff = this.y - value;
                    if( this.height + diff < 0 ) {
                        this.height = 0;
                        this.y = value;
                    } else {
                        this.height += diff;
                        this.y = value;
                    }
                }
            }
        },

        topLeft: {
            get: function() {
                var output = new adun.Geom.Point();
                return output.setTo(this.x, this.y);
            },
            /**
             * top
             * 사각형의 top-left의 x,y 좌표
             *
             * @property topLeft
             * @type {adun.Geom.Point}
             * @public
             */
            set: function(value) {
                if( value ) {
                    this.x = value.x;
                    this.y = value.y;
                }
            }
        },

        /**
         * Rectangle 객체의 좌표를 설정한다.
         *
         * @method setTo
         * @param [x=0] {Number} top-left의 x 좌표
         * @param [y=0] {Number} top-left의 y 좌표
         * @param [width=0]{Number} 사각형의 넓이
         * @param [height=0]{Number} 사각형의 높이
         * @return {adun.Geom.Rectangle}
         * @public
         */
        setTo: function(x, y, width, height) {
            if( !isNaN(x) && !isNaN(y) && !isNaN(width) && !isNaN(height) ) {
                this.x = x;
                this.y = y;
                if( width >= 0 ) {
                    this.width = width;
                }
                if( height >= 0 ) {
                    this.height = height;
                }
            }

            return this;
        },

        /**
         * 같은 프로퍼티 x, y, width, height 값을 가진 새로운 Rectangle 객체를 반환한다.
         *
         * @method clone
         * @param [output=adun.Geom.Rectangle] {adun.Geom.Rectangle}
         * @return {adun.Geom.Rectangle}
         * @public
         */
        clone: function(output) {
            if( adun.isUndefined(output) ) { output = new adun.Geom.Rectangle(); }

            return output.setTo(this.x, this.y, this._daimater);
        },

        /**
         * 이 Rectangle 객체의 프로퍼티 값을 파라미터로 받은 Rectangle 객체로부터 복사한다.
         *
         * @mthod copyFrom
         * @param source
         * @returns {*|adun.Geom.Rectangle}
         * @public
         */
        copyFrom: function(source) {
            return this.setTo(source,x, source.y, source.width, source.height);
        },

        /**
         * 이 Rectangle 객체의 프로퍼티 값을 파라미터로 받은 Rectangle 객체에 복사하여 파라미터로 받은 Rectangle 객체를 반환한다.
         *
         * @method copyTo
         * @param target {adun.Geom.Rectangle} this 객체를 복사하여 반환할 객체
         * @return {adun.Geom.Circle}
         * @public
         */
        copyTo: function(target) {
            if( adun.isUndefined(target) ) { target = new adun.Geom.Rectangle(); }
            return target.copyFrom(this);
        },

        /**
         * 지정한 좌표가 이 Rectangle 객체의 내에 포함되어 있는지 여부를 확인한다.
         *
         * @method contains
         * @param x {Number} 검사할 x좌표
         * @param y {Number} 검사할 y좌표
         * @reutn {Boolean}
         * @public
         */
        contains: function(x, y) {
            return x >= this.x && x <= this.right && y >= this.y && y<= this.bottom;
        },

        /**
         * 지정한 포인트가 이 Rectangle 객체의 내에 포함되어 있는지 여부를 확인한다.
         *
         * @method containsPoint
         * @param {adun.Geom.Point} 검사할 x좌표
         * @reutn {Boolean}
         * @public
         */
        containsPoint: function(point) {
            return this.contains(point.x, point.y);
        },

        /**
         * 지정한 한 Rectangle 객체가 이 Rectangle 객체의 내에 포함되어 잇는지 여부를 확인한다.
         *
         * @method containsRect
         * @param rect {adun.Geom.Rectangle}
         * @returns {boolean}
         * @publice
         */
        containsRect: function(rect) {
            if( rect.volume > this.volume ) {
                return false;
            }

            return rect.x >= this.x && rect.y >= this.y && rect.right <= this.right && rect.bottom <= this.bottom;
        },

        /**
         * 두 Rectanlge 객체의 프로퍼티 값이 같은지 비교한다.
         *
         * @method equals
         * @param toCompare {adun.Geom.Rectangle}
         * @returns {boolean}
         * @public
         */
        equals: function(toCompare) {
            return this.x == toCompare.x && this.y == toCompare.y && this.width == toCompare.width && this.height == toCompare.height;
        },

        /**
         * infalte(=부풀리다)
         * Rectangle 객체의 크기를 지정된 크기만큼 증감시킨다.
         *
         * Rectangle 객체의 center point는 변함없다.
         * dx값에 의해 left와 right 크기가 증감한다.
         * dy값에 의해 top과 bottom 크기가 증감한다.
         *
         * @method inflate
         * @param dx {Number}
         * @param dy {Number}
         * @return {adun.Geom.Rectangle}
         * @public
         */
        inflate: function(dx, dy) {
            if( !isNaN(dx) && !isNaN(dy) ) {
                this.x -= dx;
                this.width += 2 * dx;
                this.y -= dy;
                this.height += 2 * dy;
            }

            return this;
        },

        /**
         * inflte() 메서드에서 파라미터로 Point를 받는다.
         *
         * @method inflatePoint
         * @param point {adun.Geom.Point}
         * @return {adun.Geom.Rectangle}
         * @public
         */
        inflatePoint: function(point) {
            return this.inflate(point.x, point.y);
        },

        /**
         * 매개변수로 받은 toIntersect가이 Rectangle 객체와 교차(충돌)하는지 검사한다.
         * 이 메서드는 지정된 Rectangle 객체와 이 Rectangle 객체와 교차하는지 x, y, 너비, 높이 프로퍼티값을 비교한다.
         *
         * @method intersects
         * @param toIntersect {adun.Geom.Rectangle}
         * @return {Boolean{
         * @public
         */
        intersects: function(toIntersect) {
            if( toIntersect.x > this.right - 1 ) {
                return false;
            }
            if( toIntersect.right -1 < this.x ) {
                return false;
            }
            if( toIntersect.bottom - 1 < this.y ) {
                return false;
            }
            if( toIntersect.y > this.bottom - 1 ) {
                return false;
            }

            return true;
        },

        /**
         * 만약 매개변수로 받은 Rectangle 객체가 이 Rectangle 객체와 교차(충돌)한다면
         * 교차하는 영역의 새로운 Rectangle 객체를 반환한다.
         * 만약 교차하지 않는다면 프로퍼티값을 0으로 가진 빈 Rectangle 객체를 반환한다.
         *
         * @method intersection
         * @param toIntersect {adun.Geom.Rectangle}
         * @param [output] {adun.Geom.Rectangle}
         * @return {adun.Geom.Rectangle}
         * @public
         */
        intersection: function(toIntersect, output) {
            if( adun.isUndefined(output) ) { output = new adun.Geom.Rectangle(); }

            if( this.intersects(toIntersect) == true ) {
                output.x = Math.max(toIntersect.x, this.x);
                output.y = Math.max(toIntersect.y, this.y);
                output.width = Math.min(toIntersect.right, this.right) - output.x;
                output.height = Math.min(toIntersect.bottom, this.bottom) - output.y;
            }

            return output;
        },

        /**
         * 이 Rectangle 객체가 empty(비어있는지)인지 반환한다.
         *
         * @method isEmpty
         * @returns {Boolean}
         * @public
         */
        isEmpty: function() {
            return this.width < 1 || this.height < 1;
        },

        /**
         * 이 Rectangle 객체와 매개변수로 받은 Rectangle 사이의 중복을 검사하여 각각의 프로퍼티에 부울값을 가진 객체를 반환합니다.
         *
         * @method overlap
         * @param rect {adun.Geom.Recangle}
         * @return {{top: boolean, bottom: boolean, left: boolean, right: boolean, contains: boolean, contained: boolean}}
         * @public
         */
        overlap: function(rect) {
            var result = { top: false, bottom: false, left: false, right: false, contains: false, contained: false };
            var interRect = this.intersection(rect);

            if( interRect.isEmpty() ) {
                return result;
            }

            if( interRect.containsRect(rect) ) {
                result.contains = true;
            }

            if( rect.containsRect(this) ) {
                result.contained = true;
            }

            if( this.top < rect.top ) {
                result.top = true;
            }

            if( this.bottom < rect.bottom ) {
                result.bottom = true;
            }

            if( this.left < rect.left ) {
                result.left = true;
            }

            if( this.right > rect.right ) {
                result.right = true;
            }

            return result;
        },

        /**
         * 지정된 크기만큼 Rectangle 객체의 위치를 조정합니다.
         *
         * @method offset
         * @param dx {Number} Moves the x value of the Rectangle object by this amount
         * @param dy {Number} Moves the y value of the Rectangle object by this amount
         * @return {adun.Geom.Rectangle}
         * @public
         */
        offset: function(dx, dy) {
            if( !isNaN(dx) && !isNaN(dy) ) {
                this.x += dx;
                this.y += dy;
            }

            return this;
        },

        /**
         * 지정된 포인트의 크기만큼 Rectangle 객체의 위치를 조정합니다.
         *
         * @method offsetPoint
         * @param point {adun.Geom.Point}
         * @return {adun.Geom.Rectangle}
         * @public
         */
        offsetPoint: function(point) {
            return this.offset(point.x, point.y);
        },

        /**
         * Rencatngle 객체의 모든 프로퍼티 값을 0으로 설정합니다.
         *
         * @method setEmpty
         * @return {adun.Geom.Rectangle}
         * @public
         */
        setEmpty: function() {
            return this.setTo(0, 0, 0, 0);
        },

        /**
         * 매개변수로 받은 Rectangle 객체와 합집합으로 하여 새로운 Rectangle 객체를 반환합니다.
         * 두개의 사각형 사이의 수직 수평공간을 채움으로써 새로운 사각형 객체를 반환합니다.
         *
         * @param toUnion
         * @param output
         * @returns {*|adun.Geom.Circle|adun.Geom.Line|adun.Geom.Rectangle|Kiwi.Geom.Circle|Kiwi.Geom.Line}
         */
        union: function(toUnion, output) {
            if( adune.isUndefined(output) ) { output = new adun.Geom.Rectangle(); }

            return output.setTo(Math.min(toUnion.x, this.x), Math.min(toUnion.y, this.y), Math.max(toUnion.right, this.right), Math.max(toUnion.bottom, this.bottom));
        },

        scale: function() {
            // 트랜스폼
        }




    });
})();

// #Point
/**
 * Point
 * 포인트(요점)
 *
 * 수평축을 나타내는 x, 수직 축을 나타내는 y등 2차원 좌표계에서 위치를 나타낸다.
 *
 * @Class Point
 * @namespace Adun.Geom
 * @constructor
 * @param [x=0] {Number} x 좌표
 * @param [y=0] {Number} y 좌표
 * @return {adun.Geom.Point}
 */
(function() {
    'use strict';
    var Point = adun.Geom.Point = adun.Class({
        'TYPE': 'Point',

        init: function(x, y) {

            this.setTo(x, y);

        },

        /**
         * x값과 y값을 설정한다.
         *
         * @method setTo
         * @param x {Number}
         * @param y {Number}
         * @returns {adun.Geom.Point}
         */
        setTo: function(x, y) {
            this.x = x || 0;
            this.y = y || 0;

            return this;
        },

        /**
         * 극좌표의 한쌍을 데카르트 포인트 좌표계로 전환시킨다음 포인스인스턴스에 설정한다.
         * 극좌표: 평면상의 점을 원점으로부터의 거리 r과 시작선과의 이루는 각 θ로 나타내는 방법
         * 데크르트 좌표: 세 개의 축(일반적으로 X, Y, Z축)을 이용한 좌표계에서 공간상의 한 지점의 위치를 나타내는 좌표
         *
         * @mehtod polar
         * @param distance {Number}
         * @param angle {Number}
         * @return {adun.Geom.Point}
         * @public
         */
        polar: function(distance, angle) {
            this.x = distance * Math.cos(angle);
            this.y = distance * Math.sin(angle);

            return this;
        },

        /**
         * 매개변수로 받은 포인트 객체와 이 포인트 갭체를 '합'한 새로운 포인트 객체를 반환한다.
         *
         * @method add
         * @param toAdd {adun.Geom.Point}
         * @param output {adun.Geom.Point}
         * @return {adun.Geom.Point}
         * @public
         */
        add: function(toAdd, output) {
            if( adun.isUndefined(output) ) { output = new adun.Geom.Point(); }

            return output.setTo(this.x + toAdd.x, this.y + toAdd.y);
        },

        /**
         * 주어진 좌표를 더한다.
         *
         * @method addTo
         * @param x {Number}
         * @param y {Number}
         * @return {adun.Geom.Point}
         * @public
         */
        addTo: function(x, y) {
            if( adun.isUndefined(x) ) { x = 0; }
            if( adun.isUndefined(y) ) { y = 0; }

            return this.setTo(this.x + x, this.y + y);
        },

        /**
         * 매개변수로 받은 포인트 객체와 이 포인트 갭체를 '차'한 새로운 포인트 객체를 반환한다.
         *
         * @method subtract
         * @param point {adun.Geom.Point}
         * @param output {adun.Geom.Point}
         * @return {adun.Geom.Point}
         * @public
         */
        subtract: function(point, output) {
            if( adun.isUndefined(output) ) { output = new adun.Geom.Point(); }

            return output.setTo(this.x + point.x, this.y + point.y);
        },

        /**
         * 주어진 좌표를 뺀다.
         *
         * @method subtractFrom
         * @param x {Number}
         * @param y {Number}
         * @return {adun.Geom.Point}
         * @public
         */
        subtractFrom: function(x, y) {
            if( adun.isUndefined(x) ) { x = 0; }
            if( adun.isUndefined(y) ) { y = 0; }

            return this.setTo(this.x - x, this.y - y);
        },

        /**
         * invert(뒤집다)
         * x, y값을 뒤집는다.
         *
         * @mthod invert
         * @return {adun.Geom.Point}
         * @public
         */
        invert: function() {
            return this.setTo(this.y, this.x);
        },

        /**
         * 매개변수로 받은 min, max사이의 값으로 x,y 값을 고정시킨다.
         *
         * @method clamp
         * @param min {Number}
         * @param max {Number}
         * @return {adun.Geom.Point}
         * @public
         */
        clamp: function(min, max) {
            this.clampX(min, max);
            this.clampY(min, max);

            return this;
        },

        /**
         * 매개변수로 받은 min, max사이의 값으로 x값을 고정시킨다.
         *
         * @method clampX
         * @param min {Number}
         * @param max {Number}
         * @return {adun.Geom.Point}
         * @public
         */
        clampX: function(min, max) {
            this.x = Math.max(Math.min(this.x, max), min);

            return this;
        },

        /**
         * 매개변수로 받은 min, max사이의 값으로 y값을 고정시킨다.
         *
         * @method clampX
         * @param min {Number}
         * @param max {Number}
         * @return {adun.Geom.Point}
         * @public
         */
        clampY: function(min, max) {
            this.y = Math.max(Math.min(this.y, max), min);

            return this;
        },

        /**
         * 같은 프로퍼티 값을 가진 새로운 Point 객체를 반환한다.
         *
         * @method clone
         * @param [output=adun.Geom.Point] {adun.Geom.Point}
         * @return {adun.Geom.Point}
         * @public
         */
        clone: function(output) {
            if( adun.isUndefined(output) ) { output = new adun.Geom.Point(); }

            return output.setTo(this.x, this.y);
        },

        /**
         * 다른 Point 객체로부터 프로퍼티 x, y값을 이 Point 객체로 복사한다.
         *
         * @method copyFrom
         * @param source {adun.Geom.Point}
         * @return {adun.Geom.Point}
         * @public
         */
        copyFrom: function(source) {
            return this.setTo(source.x, source.y);
        },

        /**
         * 이 Point 객체의 프로퍼티 값을 파라미터로 받은 Point 객체에 복사하여 파라미터로 받은 Point 객체를 반환한다.
         *
         * @param target {adun.Geom.Point} this 객체를 복사하여 반환할 객체
         * @return {adun.Geom.Point}
         * @public
         */
        copyTo: function(target) {
            return target.copyFrom(this);
        },

        /**
         * 현재 Point 객체로부터 주어진 Point 객체의 각도를 반환한다.
         *
         * @method angleTo
         * @param target {adun.Geom.Point}
         * @return {number} angle to point
         */
        angleTo: function(target) {
            return Math.atan2(target.y - this.y, target.x - this.x);
        },

        /**
         * 현재 Point 객체로부터 주어진 X,Y좌표의 각도를 반환한다.
         *
         * @method angleTo
         * @param x {Number}
         * @param y {Number}
         * @return {number} angle to point
         */
        angleToXY: function(x, y) {
            return Math.atan2(y - this.y, x - this.x);
        },

        /**
         * 현재 Point 객체로부터 주어진 Point 객체 까지의 거리를 반환한다.
         *
         * @method distanceTo
         * @param target {adun.Geom.Point}
         * @param [round=false] {boolean} Round the distance to the nearest integer (default false)
         * @return {number} angle to point
         */
        distanceTo: function(target, round) {
            if( adun.isUndefined(round) ) { round = false; }

            var dx = this.x - target.x;
            var dy = this.y - target.y;

            if( round ) {
                return Math.round(Math.sqrt(dx * dx, dy * dy));
            }

            return Math.sqrt(dx * dx, dy * dy);
        },

        /**
         * 현재 Point 객체로부터 주어진 XY좌표 까지의 거리를 반환한다.
         *
         * @method distanceTo
         * @param x {Number}
         * @param y {Number}
         * @param [round=false] {boolean} Round the distance to the nearest integer (default false)
         * @return {number} angle to point
         */
        distanceToXY: function(x, y, round) {
            if( adun.isUndefined(round) ) { round = false; }

            var dx = this.x - x;
            var dy = this.y - y;

            if( round ) {
                return Math.round(Math.sqrt(dx * dx, dy * dy));
            }

            return Math.sqrt(dx * dx, dy * dy);
        },

        /**
         * 두 Point 객체사이의 거리가 두 번째 매개변수의 값보다 같거나 큰지 반환한다.
         *
         * @method distanceCompare
         * @param target {adun.Geom.Point}
         * @param distance {Number}
         * @return {Boolean}
         */
        distanceCompare: function(target, distance) {
            return this.distanceTo(target) >= distance;
        },

        /**
         * 파라미터로 받은 Point 객체와 프로퍼티 x, y값이 같은지 비교한다.
         *
         * @method equals
         * @param toCompare {adun.Geom.Point}
         * @return {Boolean}
         * @public
         */
        equals: function(toCompare) {
            return this.x === toCompare.x && this.y === toCompare.y;
        },

        /**
         * 주어진 값만큼 좌표를 조정한다.
         *
         * @method offset
         * @param dx {Number}
         * @param dy {Number}
         * @return {adun.Geom.Point}
         * @public
         */
        offset: function(dx, dy) {
            this.x += dx;
            this.y += dy;

            return this;
        },

        getCSS: function() {
            return this.x + 'px ' + this.y + 'px';
        }
    });

    /**
     * 두 Point 객체간의 거리를 반환한다.
     *
     * @method distanceBetween
     * @param pointA {adun.Geom.Point} The first Point object.
     * @param pointB {adun.Geom.Point} The second Point object.
     * @param [round=false] {boolean} Round the distance to the nearest integer (default false)
     * @return {Number} The distance between the two Point objects.
     * @static
     */
    Point.distanceBetween = function(pointA, pointB, round) {
        if( adun.isUndefined(round) ) { round = false; }

        var dx = pointA.x - pointB.x;
        var dy = pointA.y - pointB.y;

        if( round ) {
            return Math.round(Math.sqrt(dx * dx, dy * dy));
        }

        return Math.sqrt(dx * dx, dy * dy);
    };


    /**
     * 극좌표의 한쌍을 데카르트 포인트 좌표계로 전환시킨다음 t새로운 포인트 인스턴스에 설정한다음 반환한다.
     * 극좌표: 평면상의 점을 원점으로부터의 거리 r과 시작선과의 이루는 각 θ로 나타내는 방법
     * 데크르트 좌표: 세 개의 축(일반적으로 X, Y, Z축)을 이용한 좌표계에서 공간상의 한 지점의 위치를 나타내는 좌표
     *
     * @mehtod polar
     * @param distance {Number}
     * @param angle {Number}
     * @return {adun.Geom.Point}
     * @static
     */
    Point.polar = function(length, angle) {
        return new Point(length * Math.cos(angle), length * Math.sin(angle));
    };

    /**
     * interpolation(보간): 두 점을 연결하는 방법을 의미한다.
     * 선형 보간법(線形補間法, linear interpolation)은 끝점의 값이 주어졌을 때 그 사이에 위치한 값을 추정하기 위하여 직선 거리에 따라 선형적으로 계산하는 방법이다.
     * 선형 보간법은 1차원 직선상에서 이루어지는 보간법이다.
     *
     * 지정한 두 Point 객체 사이의 부분을 반환한다..
     * 매개변수 f는 pointA와 pointB로 지정된 위치에 상대적으로 어디에 위치잘히를 결정한다.
     *
     * 매개변수 f값은 0 ~ 1 이다.
     * 1에 가까울수록 pointA에 가깝다.
     * 0에 가까울수록 pointB에 가깝다.
     *
     *
     * @method interpolate
     * @param pointA {adun.Geom.Point}
     * @param pointB {adun.Geom.Point}
     * @param f {Number} 두점 사이의 보간 수준이다. 새로운지점과, pt1, pt2, 사이의 선을 따를것이다 만약 f=1이면 pointA가 반환되고 f=0이며 fointB가 반환된다.
     * @return {adun.Geom.Point}
     * @static
     */
    Point.interpolate = function(pointA, pointB, f) {
        var xDiff = pointB.x - pointA.x;
        var yDiff = pointB.y - pointA.y;

        return new adun.Geom.Point(pointB.x - xDiff * f, pointB.y - yDiff * f);
    }

})();

// #Vector2
/**
 * Vector2
 * 벡터2
 * 움직이고 조작할 수 있는 x와 y벡터 요소를 저장하기 위한 2차원 벡터 개체
 *
 * @Class Vector2
 * @namespace Adun.Geom
 * @constructor
 * @param [x=0] {Number} 벡터의 x 요소
 * @param [y=0] {Number} 벡터의 y 요소
 * @return {adun.Geom.Vector2}
 */
(function() {
    'use strict';
    var Vector2 = adun.Geom.Vector2 = adun.Class({
        'TYPE': 'Vector2',

        init: function() {

            this.setTo(x, y);
        },

        setTo: function(x, y) {
            this.x = x || 0;
            this.y = y || 0;

            return this;
        },

        /**
         * 매개변수로 받은 Vectro2객체의 요소를 이 Vector2 객체의 요소에 더한다.
         *
         * @method add
         * @param vector2 {adun.Geom.Vector2}
         * @return {adun.Geom.Vector2} A new Vector2 containing the product
         * @public
         */
        add: function(vector2) {
            return new Vector2(this.x + vector2.x, this.y + vector2.y);
        },

        /**
         * 매개변수로 받은 Vector2객체의 x요소를 이 Vector2 객체의 x요소에 더한다.
         *
         * @method addX
         * @param vector2 {adun.Geom.Vector2}
         * @return {adun.Geom.Vector2} A new Vector2 containing the product
         * @public
         */
        addX: function(vector2) {
            return new Vector2(this.x + vector2.x, this.y);
        },

        /**
         * 매개변수로 받은 Vector2객체의 y요소를 이 Vector2 객체의 y요소에 더한다.
         *
         * @method addY
         * @param vector2 {adun.Geom.Vector2}
         * @return {adun.Geom.Vector2} A new Vector2 containing the product
         * @public
         */
        addY: function(vector2) {
            return new Vector2(this.x, vector2.y + this.y);
        },

        /**
         * 매개변수로 받은 Vectro2객체의 요소를 이 Vector2 객체의 요소에서 뺀다.
         *
         * @method substract
         * @param vector2 {adun.Geom.Vector2}
         * @return {adun.Geom.Vector2} A new Vector2 containing the product
         * @public
         */
        substract: function(vector2) {
            return new Vector2(this.x - vector2.x, this.y - vector2.y);
        },

        /**
         * 매개변수로 받은 Vectro2객체의 요소를 이 Vector2 객체의 요소에 곱한다.
         *
         * @method multiply
         * @param vector2 {adun.Geom.multiply}
         * @return {adun.Geom.Vector2} A new Vector2 containing the product
         * @public
         */
        multiply: function(vector2) {
             return new Vector2(this.x * vector2.x, this.y * vector2.y);
        },

        /**
         * Vector2 객체의 각각요소에 스칼라양을 곱한다.
         *
         * @mtheod multiplyScalar
         * @param scalar {Number}
         * @return {adun.Geom.Vector2}
         * @public
         */
        multiplyScalar: function(scalar) {
            return new Vector2(this.x * scalar, this.y * scalar);
        },

        /**
         * 점을 계산한다.
         *
         * @method dot
         * @param vector2 {adun.Geom.Vector2}
         * @return {Number}
         * @public
         */
        dot: function(vector2) {
            return this.x + vector2.x + this.y + vector2.y;
        },

        /**
         * 이 Vector2 객체의 제곱길이를 계산한다. (Distance from the origin)
         *
         * @method lenSqr
         * @return {number}
         * @public
         */
        lenSqr: function() {
            return this.x * this.x + this.y * this.y;
        },

        /**
         * 이 Vector2 객체의 길이를 계산한다. (Distance from the origin);
         *
         * @method len
         * @return {number}
         * @public
         */
        len: function() {
            return Math.sqrt(this.x * this.x + this.y * this.y);
        },

        /**
         * 이 Vector2 객체의 정규화된 단위를 계산한다.
         *
         * @method unit
         * @return {adun.Geom.Vector2}
         * @public
         */
        unit: function() {
            var invLen = 1.0 / this.len();

            return this.multiplyScalar(invLen);
        },

        /**
         * Vector2객체의 각각의 요소를 가장 가까운 낮은 정수 값으로 만든다.(Math.floor)
         *
         * @mthod floor
         * @return {adun.Geom.Vector2} a rounded down Vector2
         * @public
         */
        floor: function() {
            return new Vector2(Math.floor(this.x), Math.floor(this.y));
        },

        /**
         * Vector2객체의 각각의 요소를 가장 가까운 높은 정수 값으로 만든다.(Math.ceil)
         *
         * @mthod floor
         * @return {adun.Geom.Vector2} a rounded up Vector2
         * @public
         */
        ceil: function() {
            return new Vector2(Math.ceil(this.x), Math.ceil(this.y));

        },

        /**
         * Vector2객체의 각각의 요소를 반올림한다.(Math.round)
         *
         * @mthod round
         * @return {adun.Geom.Vector2} a rounded up Vector2
         * @public
         */
        round: function() {
            return new Vector2(Math.round(this.x), Math.round(this.y));
        },

        /**
         * Clamp the vector between a maximum and minimum Vector2 range component-wise.
         *
         * @method clamp
         * @param min {adun.Geom.Vector2} Minimum values for Vector2.
         * @param max {adun.Geom.Vector2} Maximum values for Vector2.
         * @return {adun.Geom.Vector2} a clamped Vector2.
         * @public
         */
        clamp: function(min, max) {
            return new Vector2(Math.max(Math.min(this.x, max.x), min.x), Math.max(Math.min(this.y, max.y), min.y));
        },

        /**
         * 벡터의 직선 벡터를 반환한다.
         *
         * @method perp
         * @return {adun.Geom.Vector2}
         * @public
         */
        perp: function() {
            return new Vector2(-this.y, this.x);
        },

        /**
         * 이 벡터의 반대를 반환한다.
         *
         * @method neg
         * @return {adun.Geom.Vector2}
         * @public
         */
        neg: function() {
             return new Vector2(-this.x, -this.y);
        },

        /**
         * 파라미터로 받은 벡터 객체와 프로퍼티 x, y값이 같은지 비교한다.
         *
         * @method equals
         * @param toCompare {adun.Geom.Vector2}
         * @return {Boolean}
         * @public
         */
        equals: function(vector2) {
            return this.x === vector2.x && this.y === vector2.y;
        },

        /**
         * 똑같은 x,y프로퍼티를 가진 Point 객체를 반환한다.
         * @method point
         * @return {adun.Geom.Point} A new Point.
         * @public
         */
        point: function() {
            return new adun.Geom.Point(this.x, this.y);
        },

        /**
         * 두 요소를 0으로 설정한다.
         *
         * @method clear
         * @return {adun.Geom.Vector2} This object.
         * @public
         */
        clear: function() {
            this.x = 0;
            this.y = 0;

            return this;
        },

        /**
         * 같은 프로퍼티 새로운 Vecotr2 객체를 반환한다.
         *
         * @method clone
         * @param [output=adun.Geom.Vector2] {adun.Geom.Vector2}
         * @return {adun.Geom.Vector2}
         * @public
         */
        clone: function(output) {
            if( adun.isUndefined(output) ) { output = new Vector2(); }

            return output.setTo(this.x, this.y);
        },

        /**
         * 다른 Vector2 객체로부터 프로퍼티 x, y 값을 이 Vector2 객체로 복사한다.
         *
         * @param source {adun.Geom.Vector2}
         * @return {adun.Geom.Vector2}
         * @public
         */
        copyFrom: function(source) {
            return this.setTo(source.x, source.y);
        },

        /**
         * 이 Vector2 객체의 프로퍼티 값을 파라미터로 받은 Vector2 객체에 복사하여 파라미터로 받은 Vector2 객체를 반환한다.
         *
         * @param target {adun.Geom.Vector2} this 객체를 복사하여 반환할 객체
         * @return {adun.Geom.Vector2}
         * @public
         */
        copyTo: function(target) {
            return target.copyFrom(this);
        }
    });

    /**
     * 각도로부터 새로운 Vector2 객체를 반환한다.
     *
     * @method fromAnagle
     * @param angle {Number}
     * @return {adun.Geom.Vector2}
     * @static
     */
    Vector2.fromAngle = function(angle) {
        return new Vector2(Math.cos(angle), Math.sin(angle));
    };

    /**
     * 주어진 radius값 안에서 랜덤 프로퍼티를 가진 (새로운)Vector2 객체를 반환한다.
     * @method randomRadius
     * @param radius {Number}
     * @return {adun.Geom.Vector2}
     * @statice
     */
    Vector2.randomRadius = function(radius) {
        return new Vector2(Math.random() * 2 - 1, Math.random() * 2 - 1).multiplyScalar(radius);
    };

    /**
     * 포인트로부터 새로운 Vector2 객체를 반환한다.
     *
     * @method fromPoint
     * @param point {adun.Geom.Point}
     * @return {adun.Geom.Vector2}
     * @static
     */
    Vector2.fromPoint = function(point) {
        return new Vector2(point.x, point.y);
    }
})();





// #Matrix
/**
 * Matrix
 * 행렬
 * 2D 변환행렬을 나타낸다.
 * 다른 좌표 사이의 공간을 매핑 하는데 사용될 수 있다.
 * 매트릭스는 Transform에 의해 사용되어진다.
 * 행렬 객체는 물체가 세계의 어디나 또는 카메라의 어디에있는지 확인하기 위해 위치, 스케일및 회전 변화를 나타낸다.
 *
 * 참고: https://www.en.wikipedia.org/wiki/Transformation_matrix#
 * 참고: https://www.en.wikipedia.org/wiki/Transformation_matrix#/media/File:2D_affine_transformation_matrix.svg
 *
 * 2D 변환 행렬을 나타낸다.
 * HTML canvas transform() Method에 사용.
 * void ctx.transform(a, b, c, d, e, f)
 * [a   b]
 * [c   d]
 * [tx ty]
 * - basic -
 * [1  0]
 * [0  1]
 * [0  0]
 *
 *
 * a (m11) => Horizonatal scaling => y축 scale
 * b (m12) => Horizonatal skewing => y축 rotate
 * c (m21) => Vertical skewing => x축 rotate
 * d (m22) => Vertical scaling => x축 scale
 * tx (tx)  => Horizonatal moving => x축 이동
 * ty (ty)  => Vertical moving => y축 이동
 *
 * 번외 행렬 변환
 *
 * [x  x]
 * [y  y]
 *
 * [k  0] [x]    =>[kx]
 * [0  k] [y]    =>[ky]    k배 확대 닮은 변환 행렬
 *
 *
 * [1  0][x]     =>[x]
 * [0 -1][y]     =>[-y]   x축 대칭 행렬
 *
 *
 * [-1 0][x]     =>[-x]
 * [0  1][y]     =>[y]    y축 대칭 행렬
 *
 *
 * [-1 0][x]     => [-x]
 * [0 -1][y]     => [-y]  원점 대칭 행렬
 *
 *
 * [0  1][x]     => [y]
 * [1  0][y]     => [x]   y=x 대칭 변환 행렬
 *
 *
 * [0 -1][x]     => [-y]
 * [-1 0][y]     => [-x]   y=-x 대칭 변환 행렬
 *
 *
 * [cosΘ  -sinΘ] [x]    =>  [x']
 * [sinΘ   cosΘ] [y]    =>  [y']   Θ만틈 반시계 방향으로 회전한 회전변환 행렬
 *
 * [cosΘ  sinΘ] [x]    =>  [x']
 * [-sinΘ cosΘ] [y]    =>  [y']   Θ만틈 시계 방향으로 회전한 회전변환 행렬
 *
 *
 *
 * [a, c, tx]
 * [b, d, ty]
 *
 * [1, 0, 0]
 * [0, 1, 1]
 *
 *
 * @class Matrix
 * @namespace adun.Geom
 * @constructor
 * @param [a=1] {Number} Horizonatal scaling => y축 scale
 * @param [b=0] {Number} Horizonatal skewing => y축 rotate
 * @param [c=0] {Number} Vertical skewing => x축 rotate
 * @param [d=1] {Number} Vertical scaling => x축 scale
 * @param [tx=0] {Number} Horizonatal moving => x축 이동
 * @param [ty=0] {Number} Vertical moving => y축 이동
 * @reutn {adun.Geom.Matrix} This object
 */
(function() {
    'use strict';
    var Matrix = adun.Geom.Matrix = adun.Class({
        TYPE: 'Matrix',

        init: function(a, b, c, d, tx, ty) {
            this.a = 1;
            this.b = 0;
            this.c = 0;
            this.d = 1;
            this.tx = 0;
            this.ty = 0;

            this.setTo(a, b, c, d, tx, ty);
        },

        setTo: function(a, b, c, d, tx, ty) {
            this.a = a || 1;
            this.b = b || 0;
            this.c = c || 0;
            this.d = d || 1;
            this.tx = tx || 0;
            this.ty = ty || 0;
        },

        /**
         * transform 객체 값으로부터 행렬값을 세팅한다.
         *
         * @method setFromTransform
         * @param tx {Number}
         * @param ty {Number}
         * @param scaleX {Number}
         * @param scaleY {Number}
         * @param rotation {Number}
         * @return {adun.Geom.Matrix} This object
         * @public
         */
        setFromTransform: function(tx, ty, scaleX, scaleY, rotation) {
            this.identity();

            var cos = Math.cos(rotation);
            var sin = Math.sin(rotation);

            this.append(cos * scaleX, sin * scaleX, -sin * scaeY, cos * scaleY, tx, ty);

            return this;
        },

        /**
         * rotationPoint가 포함된 transform 객체 값으로부터 행렬값을 세팅한다.
         *
         * @method setFromTransform
         * @param tx {Number}
         * @param ty {Number}
         * @param scaleX {Number}
         * @param scaleY {Number}
         * @param rotation {Number}
         * @param rotPointX {Number}
         * @param rotPointY {Number}
         * @return {adun.Geom.Matrix} This object
         * @public
         */
        setFromOffsetTransform: function(tx, ty, scaleX, scaleY, rotate, rotPointX, rotPointY) {
            this.identity();

            var cos = Math.cos(rotation);
            var sin = Math.sin(rotation);

            this.append(cos * scaleX, sin * scaleX, -sin * scaeY, cos * scaleY, tx + rotPointX, ty + rotPointY);

            return this;
        },

        /**
         * 이 행렬을 독자적인 행렬로 만든다
         *
         * @method identity
         * @return {adun.Geom.Matrix}
         * @public
         */
        identity: function() {
            this.a = 1;
            this.b = 0;
            this.c = 0;
            this.d = 1;
            this.tx = 0;
            this.ty = 0;

            return this;
        },

        /**
         * 개별적인 매개변수들을 받아 이 행렬객체 값에 prepend한다.
         *
         * @method prepend
         * @param a {Number}
         * @param b {Number}
         * @param c {Number}
         * @param d {Number}
         * @param tx {Number}
         * @param ty {Number}
         * @return {adun.Geom.Matrix} This object
         * @public
         */
        prepend: function(a, b, c, d, tx, ty) {
            if( adun.isUndefined(a) ) { a = 1; }
            if( adun.isUndefined(b) ) { b = 0; }
            if( adun.isUndefined(c) ) { c = 0; }
            if( adun.isUndefined(d) ) { d = 1; }
            if( adun.isUndefined(tx) ) { tx = 0; }
            if( adun.isUndefined(ty) ) { ty = 0; }

            var a1 = this.a;
            var c1 = this.c;
            var tx1 = this.tx;


            /*  this               param
            [a1   b]             [a   b]
            [c1   d]      *      [c   d]
            [tx1 ty]             [tx ty]
             */

            this.a = a1 * a + this.b * c;         this.b = a1 * b + this.b * d;
            this.c = c1 * a + this.d * c;         this.d = c1 * b + this.d * d;
            this.tx = tx1 * a + this.ty * c + tx; this.ty = tx1 * b + this.ty * d + ty;

            return this;
        },

        /**
         * 매트릭스 매개변수들을 받아 이 행렬객체 값에 Prepend한다.
         *
         * @method prependMatrix
         * @param m {adun.Geom.Matrix}
         * @return {adun.Geom.Matrix} This object
         * @public
         */
        prependMatrix: function(m) {
            return this.prepend(m.a, m.b, m.c, m.d, m.tx, m.ty);
        },


        /**
         * 개별적인 매개변수들을 받아 이 행렬객체 값에 append한다.
         *
         * @method append
         * @param a {Number}
         * @param b {Number}
         * @param c {Number}
         * @param d {Number}
         * @param tx {Number}
         * @param ty {Number}
         * @return {adun.Geom.Matrix} This object
         * @public
         */
        append: function(a, b, c, d, tx, ty) {
            if( adun.isUndefined(a) ) { a = 1; }
            if( adun.isUndefined(b) ) { b = 0; }
            if( adun.isUndefined(c) ) { c = 0; }
            if( adun.isUndefined(d) ) { d = 1; }
            if( adun.isUndefined(tx) ) { tx = 0; }
            if( adun.isUndefined(ty) ) { ty = 0; }

            /* param                this
             [a   b]             [a1   b1]
             [c   d]      *      [c1   d1]
             [tx ty]             [tx ty]
             */

            var a1 = this.a; var b1 = this.b;
            var c1 = this.c; var d1 = this.d;

            this.a = a * a1 + b * c1;                  this.b = a * b1 + b * d1;
            this.c = c * a1 + d * c1;                  this.d = c * b1 + d * d1;
            this.tx = tx * a1 + ty * c1 + this.tx;     this.ty = tx * b1 + ty * d1 + this.ty;

            return this;
        },

        /**
         * 매트릭스 매개변수들을 받아 이 행렬객체 값에 append한다.
         *
         * @method appendMatrix
         * @param m {adun.Geom.Matrix}
         * @return {adun.Geom.Matrix} This object
         * @public
         */
        appendMatrix: function(m) {
            return this.append(m.a, m.b, m.c, m.d, m.tx, m.ty);
        },

        /**
         * 매트릭스 객체의 tx, ty를 설정한다.
         *
         * @method setPosition
         * @param x {Number}
         * @param y {Number}
         * @return {adun.Geom.Matrix} This object
         * @public
         */
        setPosition: function(x, y) {
            this.tx = x;
            this.ty = y;

            return this;
        },

        /**
         * 포인트로 부터 매트릭스 객체의 tx, ty를 설정한다.
         *
         * @method setPositionPoint
         * @param p {adun.Geom.Point}
         * @return {adun.Geom.Matrix} This object
         * @public
         */
        setPositionPoint: function(p) {
            this.tx = p.x;
            this.ty = p.y;

            return this;
        },

        /**
         * 행렬의 x, y 포지션을 가진 포인트 객체를 반환한다.
         *
         * @method getPosition
         * @param [output=adun.Geom.Point] {adun.Geom.Point}
         * @return {adun.Geom.Point}
         * @public
         */
        getPosition: function(output) {
            if( adun.isUndefined(output) ) { output = new adun.Geom.Point(); }

            return output.setTo(this.tx, this.ty);
        },

        /**
         * 주어진 각도(라디언)만큼 행렬을 회전변환한다.
         *
         * @method rotate
         * @param radians {Number}
         * @return {adun.Geom.Matrix}
         * @public
         */
        rotate: function(radians) {
            var cos = Math.cos(radians);
            var sin = Math.sin(radians);

            var a1 = this.a;
            var c1 = this.c;
            var tx1 = this.tx;

            /**
             * [cosΘ  -sinΘ] [x]    =>  [x']
             * [sinΘ   cosΘ] [y]    =>  [y']  Θ만큼 반시계 방향으로 회전한 회전변환 행렬
             *
             * [cosΘ  sinΘ] [x]    =>  [x']
             * [-sinΘ cosΘ] [y]    =>  [y']   Θ만큼   시계 방향으로 회전한 회전변환 행렬
             *
             */
            /**
                this                 param
             [a1   b]             [cos   sin]
             [c1   d]      *      [-sin   cos]
             [tx1 ty]

             **/

            this.a  = a1 * cos - this.b * sin;       this.b = a1 * sin + this.b * cos;
            this.c  = c1 * cos - this.d * sin;       this.d = c1 * sin + this.b * cos;
            this.tx = tx1 * cos - this.ty * sin;     this.tx = tx1 * sin + this.ty * cos;

            return this;
        },

        /**
         * 매개변수만큼 행렬을 이동시킨다.
         *
         * @method translate
         * @param tx {Number}
         * @param ty {Number}
         * @return {adun.Geom.Matrix}
         * @public
         */
        translate: function(tx, ty) {
            this.tx += tx;
            this.ty += ty;

            return this;
        },

        /**
         * 매개변수 만큼 행렬의 scale을 바꾼다.
         *
         * @method scale
         * @param scaleX {Number}
         * @param scaleY {Number}
         * @return {adun.Geom.Matrix}
         * @public
         */
        scale: function(scaleX, scaleY) {
            this.a *= scaleX;
            this.d *= scaleX;

            return this;
        },

        /**
         * 포인트의 x,y와 행렬을 적용시킨뒤 반환한다.
         *
         * @method transformPoint
         * @param p {adun.Geom.Point}
         * @return {adun.Geom.Point}
         * @public
         */
        transformPoint: function(p) {
            var x = p.x;
            var y = p.y;

            p.x = this.a * x + this.c * y + tx;
            p.y = this.b * x + this.d * y + ty;

            return p;
        },

        /**
         * 행렬을 뒤집는다.
         *
         * @method invert
         * @return {adun.Geom.Matrix}
         * @public
         */
        invert: function() {
            var a1 = this.a;    var b1 = this.b;
            var c1 = this.c;    var d1 = this.d;
            var tx1 = this.tx;  var ty1 = this.ty;

            var n = a1 * d1 - b1 * c1;

            this.a = d1 / n;    this.b = -b1 / n;
            this.c = -c1 / n;   this.d = a1 / n;
            this.tx = (c1 * this.ty - d1 * tx1) / n;
            this.ty = -(a1 * this.ty - b1 * tx1) / n;

            return this;
        },

        /**
         * 다른 Matrix 객체로부터 프로퍼티 값을 이 Matrix 객체로 복사한다.
         *
         * @method copyFrom
         * @param m {adun.Geom.Matrix}
         * @return {adun.Geom.Matrix} this Object
         * @public
         */
        copyFrom: function(m) {
            this.a = m.a;
            this.b = m.b;
            this.c = m.c;
            this.d = m.d;
            this.tx = m.tx;
            this.ty = m.ty;

            return this;
        },

        /**
         * 이 Matrix 객체의 프로퍼티 값을 파라미터로 받은 Matrix 객체에 복사한다.
         *
         * @method copyTo
         * @param m {adun.Geom.Matrx}
         * @return {adun.Geom.matrix} This object
         * @public
         */
        copyTo: function(m) {
            m.a = this.a;
            m.b = this.b;
            m.c = this.c;
            m.d = this.d;
            m.tx = this.tx;
            m.ty = this.ty;

            return this;
        },


        /**
         * 같은 프로퍼티 새로운 Matrix 객체를 반환한다.
         *
         * @method clone
         * @return {adun.Geom.Matrix}
         * @public
         */
        clone: function() {
            return new Matrix(this.a, this.b, this.c, this.d, this.tx, this.ty);
        },

        /**
         * 매개변수로 받은 Matrix와 프로퍼티 값이 같은지 비교한다.
         *
         * @param m {adun.Geom.Matrix}
         * @returns {boolean}
         */
        equals: function(m) {
            return this.a === m.a && this.b === m.b && this.c === m.c && this.d === m.d && this.tx === m.tx && this.ty === m.ty;
        }
    });
})();



// #Transform
/**
 * Transform (변화(형)시키다)
 * 한 Entity의 position(위치), scale(규모), 회전(rotation), 그리고 rotaionPoint(회전포인트)를 나타낸다.
 * Value는 Transform에 할당된 3*3 변환 매트릭스에 의해 변화된다.
 * Transform은 부모에 할당되어질수있고
 * 연결된 변환 행렬에
 *
 * @class Transform
 * @namespace adun.Geom
 * @constructor
 * @param [x=0] {Number} x좌표
 * @param [y=0] {Number} y좌표
 * @param [scaleX=1] {Number} x 스케일
 * @param [scaleY=1] {Number} y 스케일
 * @param [rotation=0] {Number} 회전(라디언)
 * @param [rotX=0] {Number} x축에서의 회전offset
 * @param [rotY=0] {Number} y축에서의 회전offset
 * @return {adun.Geom.Transform} This object.
 */
(function() {
    'use strict';
    var Transform = adun.Geom.Transform = adun.Class({
        TYPE: 'Transform',

        init: function(x, y, scaleX, scaleY, rotation, rotPointX, rotPointY) {

            /**
             * x좌표
             *
             * @property _x
             * @type {Number}
             * @default 0
             * @private
             */
            this._x = 0;

            /**
             * y좌표
             *
             * @property _y
             * @type {Number}
             * @default 0
             * @private
             */
            this._y = 0;

            /**
             * x 스케일
             *
             * @property _scaleX
             * @type {Number}
             * @default 1
             * @private
             */
            this._scaleX = 1;

            /**
             * y 스케일
             *
             * @property _scaleY
             * @type {Number}
             * @default 1
             * @private
             */
            this._scaleY = 1;

            /**
             * 회전(라디언)
             *
             * @property _rotation
             * @type {Number}
             * @default 0
             * @private
             */
            this._rotation = 0;

            /**
             * x축에서의 회전포인트
             *
             * @property _rotPointX
             * @type {Number}
             * @default 0
             * @private
             */
            this._rotPointX = 0;

            /**
             * y축에서의 회전포인트
             *
             * @property _rotPointY
             * @type {Number}
             * @default 0
             * @private
             */
            this._rotPointY = 0;


            /**
             * 부모 Transform
             * null 이면 부모가 없다,
             * getConcatenatedMatirx 메서드에 의해 현재 변환을 다른 행렬에의해 상쇄하기 위해 사용되어진다.
             *
             * @property _parent
             * @type {adun.Geom.Transform}
             * @default null
             * @private
             */
            this._parent = null;


            /**
             * 락 모드에서는 이 Transform은 계산을 절감하기위해 자신의 행렬을 업데이트하지않는다
             * 하지만, 여전히 부모는 따른다.
             *
             * @property _locked
             * @type {boolean}
             * @default false
             * @private
             */
            this._locked = false;


            /**
             * 행렬을 연결할때 부모를 무시할것인지 말것이지
             * true => 부모의 행렬을 계산하지 않는다.
             *
             * @property _ignoreParent
             * @type {boolean}
             * @default false
             * @private
             */
            this._ignoreParent = false;


            /**
             * 자식을 무시할것인가
             *
             * @property _ingoreChild
             * @type {boolean}
             * @default false
             * @private
             */
            this._ignoreChild = false;


            /**
             * 최근 이래로 Transform이 바뀌었는지 나타낸다.
             *
             * @property _dirty
             * @type {boolean}
             * @default true
             * @private
             */
            this._drity = true;

            this.setTransform(x, y, scaleX, scaleY, rotation, rotPointY, rotPointY);

            this._matrix = new adun.Geom.Matrix();

            this._cachedConcatenatedMatrix = new adun.Geom.Matrix();

            this._matrix.setFromOffsetTransform(this.x, this.y, this.scaleX, this.scaleY, this.rotation, this.rotPointX, this.rotPointY);
        },

        x: {
            get: function() {
                return this._x;
            },
            /**
             * x 좌표
             *
             * @property x
             * @type {Number}
             * @public
             */
            set: function(value) {
                this._x = value;
                this._dirty = true;
            }
        },

        y: {
            get: function() {
                return this._y;
            },
            /**
             * y 좌표
             *
             * @property y
             * @type {Number}
             * @public
             */
            set: function(value) {
                this._y = value;
                this._dirty = true;
            }
        },

        scaleX: {
            get: function() {
                return this._scaleX;
            },
            /**
             * x 스케일
             *
             * @property scaleX
             * @type {Number}
             * @public
             */
            set: function(value) {
                this._scaleX = value;
                this._dirty = true;
            }
        },

        scale: {
            /**
             * x, y 스케일 설정한다(set only)
             *
             * @property scale
             * @type {Number}
             * @public
             */
            set: function(value) {
                this._scaleX = value;
                this._scaleY = value;
                this._dirty = true;
            }
        },

        scaleY: {
            get: function() {
                return this._scaleY;
            },
            /**
             * y 스케일
             *
             * @property scaleY
             * @type {Number}
             * @public
             */
            set: function(value) {
                this._scaleY = value;
                this._dirty = true;
            }
        },

        rotation: {
            get: function() {
                return this._rotation;
            },
            /**
             * 회전(radians)
             *
             * @property rotation
             * @type {Number}
             * @public
             */
            set: function(value) {
                this._rotation = value;
                this._dirty = true;
            }
        },

        rotPointX: {
            get: function() {
                return this.rotPointX;
            },
            /**
             * x회전 offset
             *
             * @property rotPointX
             * @type {Number}
             * @public
             */
            set: function(value) {
                this._rotPointX = value;
                this._dirty = true;
            }
        },

        rotPointY: {
            get: function() {
                return this.rotPointT;
            },
            /**
             * y회전 offset
             *
             * @property rotPointY
             * @type {Number}
             * @public
             */
            set: function(value) {
                this._rotPointY = value;
                this._dirty = true;
            }
        },

        anchorPointX: {
            get: function() {
                return (this.rotPointX);
            },
            /**
             * x축 고정적 값(=rotPointX)
             *
             * @property anchorPointX
             * @type {Number}
             * @public
             */
            set: function(value) {
                this.rotPointX = value;
            }
        },

        anchorPointY: {
            get: function() {
                return (this.rotPointY);
            },
            /**
             * y축 고정적 값(=rotPointY)
             *
             * @property anchorPointY
             * @type {Number}
             * @public
             */
            set: function(value) {
                this.rotPointY = value;
            }
        },

        matrix: {
            /**
             * 사용하고있는 행렬
             *
             * @property matrix
             * @type {adun.Geom.Matrix}
             * @readOnly
             * @public
             */
            get: function() {
                return this._matrix;
            }
        },

        worldX: {
            /**
             * 세계에서의 X
             *
             * @property worldX
             * @type {Number}
             * @readOnly
             * @public
             */
            get: function() {
                return this.getConcatenatedMatrix().tx - this._rotPointX;
            }
        },

        worldY: {
            /**
             * 세계에서의 y
             *
             * @property worldY
             * @type {Number}
             * @readOnly
             * @public
             */
            get: function() {
                return this.getConcatenatedMatrix().ty - this._rotPointY;
            }
        },

        parent: {
            get: function() {
                return this._parent;
            },
            /**
             * 부모
             *
             * @property parent
             * @type {adun.Geom.Transform}
             * @default null
             * @public
             */
            set: function(value) {
                if( !this.checkAncestor(value) ) {
                    this._parent = value;
                    this._dirty = true;
                }
            }
        },

        locked: {
            get: function() {
                return this._locked;
            },
            /**
             * transform이 락이 될지를 결정한다
             * 락 모드에서는 행렬을 업데이트하지않는다
             * 그러나 여전히 부모는 따른다.
             * 락모드가 되는경우 현재 프로퍼티값에 의해 행렬리 세팅된다.
             *
             * @property locked
             * @type {Boolean}
             * @default false
             * @public
             */
            set: function(value) {
                this._locked = value;
                if( this._locked ) {
                    this._matrix.setFromOffsetTransform(this.x, this.y, this.scaleX, this.scaleY, this.rotation, this.anchorPointX, this.anchorPointY);
                }
            }
        },

        ignoreParent: {
            get: function() {
                return this._ignoreParent;
            },
            /**
             *행렬을 연결할 때 부모를 무시할지 결정한다.
             *
             * @property ignoreParent
             * @type {Boolean}
             * @default false
             * @public
             */
            set: function(value) {
                this._ignoreParent = value;
            }
        },

        ignoreChild: {
            get: function() {
                return this._ignoreChild;
            },
            /**
             * child가 행렬 계산을 수행할때 부모를 따를지 결정한다.
             *
             * @property ignoreChild
             * @type {Boolean}
             * @default false
             * @public
             */
            set: function(value) {
                this._ignoreChild = value;
            }
        },

        /**
         * x, y 좌표를 설정한다.
         *
         * @method setPosition
         * @param x {Number}
         * @param y {Number}
         * @return {adun.Geom.Transform} This object
         * @public
         */
        setPosition: function(x, y) {
            this._x = x;
            this._y = y;
            this._dirty = true;

            return this;
        },

        /**
         * 포인트로부터 x, y 좌표를 설정한다.
         *
         * @method setPositionFromPoint
         * @param p {adun.Geom.Point}
         * @return {adun.Geom.Transform} This object
         * @public
         */
        setPositionFromPoint: function(p) {
            this._x = p.x;
            this._y = p.y;
            this._dirty = true;

            return this;
        },

        /**
         * 포인트로부터 x, y 좌표를 움직인다.
         *
         * @method translatePositionFromPoint
         * @param p {adun.Geom.Point}
         * @return {adun.Geom.Transform} This object
         * @public
         */
        translatePositionFromPoint: function(p) {
            this._x += p.x;
            this._y += p.y;
            this._dirty = true;

            return this;
        },

        /**
         * transform 객체의 x,y 값을 가진 포인트를 반환한다.
         *
         * @method getPositionPoint
         * @param [output=adun.Geom.Point] {adun.Geom.Point}
         * @return {adun.Geom.Point}
         * @public
         */
        getPositionPoint: function(output) {
            if( adun.isUndefined(output) ) { output = new adun.Geom.Point(); }

            return outpuy.setTo(this._x, this._y);
        },

        /**
         * transform의 프로퍼티를 설정한다.
         *
         * @method
         * @param [x=0] {Number}
         * @param [y=0] {Number}
         * @param [scaleX=1] {Number}
         * @param [scaleY=1] {Number}
         * @param [rotation=0] {Number}
         * @param [rotPointX=0] {Number}
         * @param [rotPointY=0] {Number}
         * @return {adun.Geom.Transform}
         * @public
         */
        setTransform: function(x, y, scaleX, scaleY, rotation, rotPointX, rotPointY) {
            this._x = x || 0;
            this._y = y || 0;
            this._scaleX = scaleX || 1;
            this._scaleY = scaleY || 1;
            this._rotation = rotationa || 0;
            this._rotPointX = rotPointX || 0;
            this._rotPointy = rotPointy || 0;

            this.drity = true;

            return this;
        },

        /**
         * 만약 parent가 있다면 parent의 행렬을 반환한다.
         *
         * @method getParentMatrix
         * @return {adun.Geom.Matrix} Parent transform matrix
         * @public
         */
        getParentMatrix: function() {
            if( this._parent ) {
                return this._parent.getConcatenatedMatrix();
            }

            return null;
        },

        /**
         * 모든 조상과 연결된 행렬을 반환한다.
         * 조상(부모)가 없을경우 리턴된 행렬은 이것의 기본 행렬과 같다.
         * @method getConcatenatedMatrix
         * @return {adun.Geom.Matrix}
         * @public
         */
        getConcatenatedMatrix: function() {
            /*
            CASE:
            - This dirty, parent dirty : Update Matrix, build concat
            - This dirty, parent clean : Update Matrix, build concat
            - This dirty, no parent    : Update Matrix
            - This clean, parent dirty : build concat
            - This clean, parent clean : Use cachedConcatenated Matrix
            - This clean, no parent    : Use cachedConcatenated Matrix

            SIMPLE 4CASE
            - This dirty, has parent : Update Matrix, build concat
            - This dirty, no parent  : Update Matrix
            - This clean, no parent  : Build concat
            - Otherwise              : Use cachedConcatenated Matrix

            ㄴ USE
            */


            if( this._dirty && !this.locked ) {
                this._matrix.setFromOffsetTransform(this.x, this.y, this.scaleX, this.scaleY, this.rotation, this.anchorPointX, this.anchorPointY);
            }

            this._cachedConcatenatedMatrix.copyFrom(this._matrix);

            if( this._parent && !this._parent.ignoreChild && !this.ignoreParent ) {
                this._cachedConcatenatedMatrix.tx -= this._parent.anchorPointX;
                this._cachedConcatenatedMatrix.ty -= this._parent.anchorPointY;

                this._cachedConcatenatedMatrix.prependMatrix(this.getParentMatrix());
            }

            this._drity = false;

            return this._cachedConcatenatedMatrix;
        },

        /**
         * 포인트로부터 transform 객체의 행렬을 변환시킨다.
         *
         * @method transformPoint
         * @param p {adun.Geom.Point}
         * @return {adun.Geom.Point}
         * @public
         */
        transformPint: function(p) {
            var mat = this.getConcatenatedMatrix();

            return mat.transformPoint(p);
        },

        /**
         * 매개변수 값이 조상중에 있는지 체크한다.
         *
         * @mathod checkAncestor
         * @param transform {adun.Geom.Transform}
         * @return {Boolean}
         */
        checkAncestor: function(transform) {
            // ready...

            return false;
        },


        /**
         * 같은 프로퍼티 값을 가진 새로운 Transform 객체를 반환한다.
         *
         * @method clone
         * @param [output=adun.Geom.Transform] {adun.Geom.Transform}
         * @return {adun.Geom.Transform}
         * @public
         */
        clone: function(output) {
            if( adun.isUndefined(output) ) { output = new Transform(); }

            output.copyFrom(this);

            return output;
        },

        /**
         * 다른 Transform 객체로부터 프로퍼티 값을 이 Transform 객체로 복사한다.
         *
         * @param source {adun.Geom.Transform}
         * @return {adun.Geom.Transform}
         * @public
         */
        copyFrom: function(source) {
            this.setTransform(source.x, source.y, source.scaleX, source.scaleY, source.rotation, source.rotPointX, source.rotPointY);
            this.parent = source.parent;
            this._matrix = source.matrix.clone();

            return this;
        },


        /**
         * 이 Transform 객체의 프로퍼티 값을 파라미터로 받은 Transform 객체에 복사한다.
         *
         * @param target {adun.Geom.Transform}
         * @return {adun.Geom.Transform} This object
         * @public
         */
        copyTo: function(target) {
            target.copyFrom(this);

            return this;
        }
    });
})();

// #Intersect
/**
 * Intersect
 * 교차하다: 충돌
 * 기하학 객체사이의 교차(충돌)를 판정하는 스태틱 메서드 컬레션들을 포함한다.
 *
 * @Class Intersect
 * @namespace adun.Geom
 * @static
 */
(function() {
    'use strict';

    var Intersect = adun.Class({
        'TYPE': 'Intersect',


        /**
         * -------------------------------------------------------------------------------------------------------------
         * Distance (길이)
         * -------------------------------------------------------------------------------------------------------------
         */

        /**
         * 지정한 두 좌표 사이 거리를 반환한다.
         *
         * @method distance
         * @param x1 첫번째 좌표의 x 위치
         * @param y1 첫번째 좌표의 y 위치
         * @param x2 두번째 좌표의 x 위치
         * @param y2 두번째 좌표의 y 위치
         * @return {number}
         * @public
         * @static
         */
        distance: function(x1, y1, x2, y2) {
            return Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
        },

        /**
         * 지정한 두 좌표 사이 거리의 제곱을 반환한다.
         *
         * @method distance
         * @param x1 첫번째 좌표의 x 위치
         * @param y1 첫번째 좌표의 y 위치
         * @param x2 두번째 좌표의 x 위치
         * @param y2 두번째 좌표의 y 위치
         * @return {number}
         * @public
         * @static
         */
        distanceSquared: function(x1, y1, x2, y2) {
            return (x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1);
        },


        /**
         * -------------------------------------------------------------------------------------------------------------
         * Lines (직선)
         * -------------------------------------------------------------------------------------------------------------
         */

        /**
         * 어떠한 두 직선이 한 지점에서 교차(충돌)했는지 검사한다.
         * 두선 모두 무한히 뻗어나가는 선이라 가정한다.
         *
         * @method lineToLine
         * @param line1 {adun.Geom.Line} 첫번째 직선
         * @param line2 {adun.Geom.Line] 두번째 직선
         * @param [output] {adun.Geom.IntersectResult} 교차점에 대한 정보를 저장한다. [옵션]
         * @return {adun.Geom.IntersectResult}
         * @public
         * @static
         */
        lineToLine: function(line1, line2, output) {
            if( adun.isUndefined(output) ) { output = new adun.Geom.IntersectResult(); }

            output.result = false;

            /*
             http://blog.naver.com/PostView.nhn?blogId=tobsysco&logNo=90189606643&beginTime=0&jumpingVid=&from=search&redirect=Log&widgetTypeCall=true
             */

            // 직선 A는 서로 다른 두 점 (line1.x1, line1.y1)(line1.x2, line1.y2)을 지나고, 직선 B는 서로 다른 두 점(line2.x1, line2.y1)(line2.x2, line2.y2)를 지날 때,
            // (line1.y2 - line1.y1) / (line1.x2 - line1.x1) === (line2.y2 - line2.y1) / (line2.x2 - line2.x1) 이면 '기울기'가 같으므로 '평행' 또는 '일치'이다.
            // 위는 (line2.x2 - line2.x1) * (line1.y2 - line1.y1) === (line1.x2 - line1.x1) *(line2.y2 - line2.y1) 로 표현할 수 있다.
            // => (line2.x2 - line2.x1) * (line1.y2 - line1.y1) - (line1.x2 - line1.x1) *(line2.y2 - line2.y1) == 0
            // => denominator(분모) = (line2.x2 - line2.x1) * (line1.y2 - line1.y1) - (line1.x2 - line1.x1) *(line2.y2 - line2.y1)

            // => 다음 사이트의 공식으로 교차점을 구할 수 있다. http://zetawiki.com/wiki/%EB%91%90_%EC%A7%81%EC%84%A0%EC%9D%98_%EA%B5%90%EC%B0%A8%EC%A0%90#cite_note-same_m-1

            //
            // 분모
            var denom = (line1.x1 - line1.x2) * (line2.y1 - line2.y2) - (line1.y1 - line1.y2) * (line2.x1 - line2.x2);

            // den == 0 일 경우 평행선이므로 교차하지 않는다.
            if( denom !== 0 ) {
                output.result = true;
                output.x = ((line1.x1 * line1.y2 - line1.y1 * line1.x2) * (line2.x1 - line2.x2) - (line1.x1 - line1.x2) * (line2.x1 * line2.y2 - line2.y1 * line2.x2)) / denom;
                output.y = ((line1.x1 * line1.y2 - line1.y1 * line1.x2) * (line2.y1 - line2.y2) - (line1.y1 - line1.y2) * (line2.x1 * line2.y2 - line2.y1 * line2.x2)) / denom;
            }

            return output;
        },

        /**
         * 직선과 선분이 한 지점에서 교차(충돌)했는지 검사한다.
         *
         * @method lineToLineSegment
         * @param line1 {adun.Geom.Line} 첫번째 선(직선)
         * @param seg {adun.Geom.Line] 두번째 선(선분)
         * @param [output] {adun.Geom.IntersectResult} 교차점에 대한 정보를 저장한다. [옵션]
         * @return {adun.Geom.IntersectResult}
         * @public
         * @static
         */
        lineToLineSegment: function(line1, seg, output) {
            if( adun.isUndefined(output) ) { output = new adun.Geom.IntersectResult(); }

            output.result = false;

            var denom = (line1.x1 - line1.x2) * (seg.y1 - seg.y2) - (line1.y1 - line1.y2) * (seg.x1 - seg.x2);

            if( denom !== 0 ) {
                output.x = ((line1.x1 * line1.y2 - line1.y1 * line1.x2) * (seg.x1 - seg.x2) - (line1.x1 - line1.x2) * (seg.x1 * seg.y2 - seg.y1 * seg.x2)) / denom;
                output.y = ((line1.x1 * line1.y2 - line1.y1 * line1.x2) * (seg.y1 - seg.y2) - (line1.y1 - line1.y2) * (seg.x1 * seg.y2 - seg.y1 * seg.x2)) / denom;

                var maxX = Math.max(seg.x1, seg.x2);
                var minX = Math.min(seg.x1, seg.x2);
                var maxY = Math.max(seg.y1, seg.y2);
                var minY = Math.min(seg.y1, seg.y2);

                if( output.x <= maxX && output.x >= minX && output.y <= maxY && output.y >= minY ) {
                    output.result = true;
                }
            }

            return output;
        },

        /**
         * 직선과 지정한 좌표의 선분이 한 지점에서 교차(충돌)했는지 검사한다.
         *
         * @method lineToRawSegment
         * @param line {adun.Geom.Line} 첫번째 선(직선)
         * @param x1 {adun.Geom.Line] 선분의 시작 x좌표
         * @param y1 {adun.Geom.Line] 선분의 시작 y좌표
         * @param x2 {adun.Geom.Line] 선분의 끝 x좌표
         * @param y2 {adun.Geom.Line] 선분의 끝 y좌표
         * @param [output] {adun.Geom.IntersectResult} 교차점에 대한 정보를 저장한다. [옵션]
         * @return {adun.Geom.IntersectResult}
         * @public
         * @static
         */
        lineToRawSegment: function(line1, x1, y1, x2, y2, output) {
            if( adun.isUndefined(output) ) { output = new adun.Geom.IntersectResult(); }

            output.result = false;

            var denom = (line1.x1 - line1.x2) * (y1 - y2) - (line1.y1 - line1.y2) * (x1 - x2);

            if( denom !== 0 ) {
                output.x = ((line1.x1 * line1.y2 - line1.y1 * line1.x2) * (x1 - x2) - (line1.x1 - line1.x2) * (x1 * y2 - y1 * x2)) / denom;
                output.y = ((line1.x1 * line1.y2 - line1.y1 * line1.x2) * (y1 - y2) - (line1.y1 - line1.y2) * (x1 * y2 - y1 * x2)) / denom;

                var maxX = Math.max(x1, x2);
                var minX = Math.min(x1, x2);
                var maxY = Math.max(y1, y2);
                var minY = Math.min(y1, y2);

                if( output.x <= maxX && output.x >= minX && output.y <= maxY && output.y >= minY ) {
                    output.result = true;
                }
            }

            return output;
        },

        /**
         * 선분과 지정한 좌표의 선분이 한 지점에서 교차(충돌)했는지 검사한다.
         *
         * @method lineSegmentToRawSegment
         * @param line {adun.Geom.Line} 첫번째 선(선분)
         * @param x1 {adun.Geom.Line] 선분의 시작 x좌표
         * @param y1 {adun.Geom.Line] 선분의 시작 y좌표
         * @param x2 {adun.Geom.Line] 선분의 끝 x좌표
         * @param y2 {adun.Geom.Line] 선분의 끝 y좌표
         * @param [output] {adun.Geom.IntersectResult} 교차점에 대한 정보를 저장한다. [옵션]
         * @return {adun.Geom.IntersectResult}
         * @public
         * @static
         */
        lineSegmentToRawSegment: function(line, x1, y1, x2, y2, output) {
            if( adun.isUndefined(output) ) { output = new adun.Geom.IntersectResult(); }

            output = adun.Geom.Intersect.lineToRawSegment(line, x1, y1, x2, y2, output);

            var maxX = Math.max(line.x1, line.x2);
            var minX = Math.min(line.x1, line.x2);
            var maxY = Math.max(line.y1, line.y2);
            var minY = Math.min(line.y1, line.y2);

            if( output.x <= maxX && output.x >= minX && output.y <= maxY && output.y >= minY ) {
                output.result = true;
                return output;
            }

            output.result = false;
            return output;
        },

        /**
         * 직선과 광선이 한 지점에서 교차(충돌)했는지 검사한다.
         *
         * @method lineSegmentToRawSegment
         * @param line {adun.Geom.Line} 직선
         * @param ray {adun.Geom.Ray] 광선
         * @param [output] {adun.Geom.IntersectResult} 교차점에 대한 정보를 저장한다. [옵션]
         * @return {adun.Geom.IntersectResult}
         * @public
         * @static
         */
        lineToRay: function(line1, ray, output) {
            if( adun.isUndefined(output) ) { output = new adun.Geom.IntersectResult(); }

            output.result = false;

            var denom = (line1.x1 - line1.x2) * (ray.y1 - ray.y2) - (line1.y1 - line1.y2) * (ray.x1 - ray.x2);

            if (denom !== 0) {
                output.x = ((line1.x1 * line1.y2 - line1.y1 * line1.x2) * (ray.x1 - ray.x2) - (line1.x1 - line1.x2) * (ray.x1 * ray.y2 - ray.y1 * ray.x2)) / denom;
                output.y = ((line1.x1 * line1.y2 - line1.y1 * line1.x2) * (ray.y1 - ray.y2) - (line1.y1 - line1.y2) * (ray.x1 * ray.y2 - ray.y1 * ray.x2)) / denom;
                output.result = true; // true unless either of the 2 following conditions are met

                if (!(ray.x1 >= ray.x2) && output.x < ray.x1) {
                    // 교차지점 x가 광선의 시작 x보다 작다면
                    output.result = false;
                }
                if (!(ray.y1 >= ray.y2) && output.y < ray.y1) {
                    // 교차지점 x가 광선의 시작 y보다 작다면
                    output.result = false;
                }
            }
            return output;
        },

        /**
         * 직선과 원이 교차(충돌)했는지 검사한다.
         *
         * @method lineToCircle
         * @param line {adun.Geom.Line} 직선
         * @param circle {adun.Geom.Circle] 원
         * @param [output] {adun.Geom.IntersectResult} 교차점에 대한 정보를 저장한다. [옵션]
         * @return {adun.Geom.IntersectResult}
         * @public
         * @static
         */
        lineToCircle: function(line, circle, output) {
            if( adun.isUndefined(output) ) { output = new adun.Geom.IntersectResult(); }

            output.result = false;

            if( line.perp(circle.x, circle.y).length <= circle.radius ) {
                output.result = true;
            }

            return output;
        },

        /**
         * 직선과 사각형이 교차(충돌)했는지 검사한다.
         *
         * @method lineToRctangle
         * @param line {adun.Geom.Line} 직선
         * @param rectangle {adun.Geom.Rectangle] 사각형
         * @param [output] {adun.Geom.IntersectResult} 교차점에 대한 정보를 저장한다. [옵션]
         * @return {adun.Geom.IntersectResult}
         * @public
         * @static
         */
        lineToRectangle: function(line, rect, output) {
            if( adun.isUndefined(output) ) { output = new adun.Geom.IntersectResult(); }

            output.result = false;

            // Top of the Rectangle VS the Line
            adun.Geom.Intersect.lineToRawSegment(line, rect.x, rect.y, rect.right, rect.y, output);
            if( output.result == true ) {
                return output;
            }

            // Left of the Rectangle VS the Line
            adun.Geom.Intersect.lineToRawSegment(line, rect.x, rect.y, rect.x, rect.bottom, output);
            if( output.result == true ) {
                return output;
            }

            // Bottom of the Rectangle VS the Line
            adun.Geom.Intersect.lineToRawSegment(line, rect.x, rect.bottom, rect.right, rect.bottom, output);
            if( output.result == true ) {
                return output;
            }

            // Right of the Rectangle VS the Line
            adun.Geom.Intersect.lineToRawSegment(line, rect.right, rect.y, rect.right, rect.bottom, output);

            return output;
        },


        /**
         * -------------------------------------------------------------------------------------------------------------
         * Segment (선분)
         * -------------------------------------------------------------------------------------------------------------
         */


        /**
         * 선분과 선분이 한 지점에서 교차(충돌)했는지 검사한다.
         *
         * @method lineSegmentToLineSegment
         * @param seg1 {adun.Geom.Line} 첫번째 선(선분)
         * @param seg2 {adun.Geom.Line] 두번째 선(선분)
         * @param [output] {adun.Geom.IntersectResult} 교차점에 대한 정보를 저장한다. [옵션]
         * @return {adun.Geom.IntersectResult}
         * @public
         * @static
         */
        lineSegmentToLineSegment: function(line1, line2, output) {
            if( adun.isUndefined(output) ) { output = new adun.Geom.IntersectResult(); }

            output.result = false;

            adun.Geom.Intersect.lineToLineSegment(line1, line2, output);

            if( output.result === true ) {
                if (!(output.x >= Math.min(line1.x1, line1.x2) && output.x <= Math.max(line1.x1, line1.x2) && output.y >= Math.min(line1.y1, line1.y2) && output.y <= Math.max(line1.y1, line1.y2))) {
                    output.result = false;
                }
            }

            return output;
        },

        /**
         * 선분과 광선이 한 지점에서 교차(충돌)했는지 검사한다.
         *
         * @method lineSegmentToRay
         * @param seg {adun.Geom.Line} 선분
         * @param ray {adun.Geom.Ray] 광선
         * @param [output] {adun.Geom.IntersectResult} 교차점에 대한 정보를 저장한다. [옵션]
         * @return {adun.Geom.IntersectResult}
         * @public
         * @static
         */
        lineSegmentToRay: function(line1, ray, output) {
            if( adun.isUndefined(output) ) { output = new adun.Geom.IntersectResult(); }

            output.result = false;

            adun.Geom.Intersect.lineToRay(line1, ray, output);

            if( output.result === true ) {
                if (!(output.x >= Math.min(line1.x1, line1.x2) && output.x <= Math.max(line1.x1, line1.x2) && output.y >= Math.min(line1.y1, line1.y2) && output.y <= Math.max(line1.y1, line1.y2))) {
                    output.result = false;
                }
            }

            return output;
        },


        /**
         * 선분과 원이 교차(충돌)했는지 검사한다.
         *
         * @method lineSegmentToCircle
         * @param seg {adun.Geom.Line} 선분
         * @param circle {adun.Geom.Circle] 원
         * @param [output] {adun.Geom.IntersectResult} 교차점에 대한 정보를 저장한다. [옵션]
         * @return {adun.Geom.IntersectResult}
         * @public
         * @static
         */
        lineSegmentToCircle: function(seg, circle, output) {
            if( adun.isUndefined(output) ) { output = new adun.Geom.IntersectResult(); }

            output.result = false;

            var perp = seg.perp(circle.x, circle.y);

            if(perp.length <= circle.radius) {
                var maxX = Math.max(seg.x1, seg.x2);
                var minX = Math.min(seg.x1, seg.x2);
                var maxY = Math.max(seg.y1, seg.y2);
                var minY = Math.min(seg.y1, seg.y2);

                if( (perp.x2 <= maxX && perp.x2 >= minX) && (perp.y2 <= maxY && perp.y2 >= minY) ) {
                    output.result = true;
                } else {
                    if (adun.Geom.Intersect.circleContainsPoint(circle, { x: seg.x1, y: seg.y1 }).result || adun.Geom.Intersect.circleContainsPoint(circle, { x: seg.x2, y: seg.y2 }).result) {
                        output.result = true;
                    }
                }
            }

            return output;
        },

        /**
         * 선분과 사각형이 교차(충돌)했는지 검사한다.
         *
         * @method lineSegmentToRctangle
         * @param seg {adun.Geom.Line} 선분
         * @param rectangle {adun.Geom.Rectangle] 사각형
         * @param [output] {adun.Geom.IntersectResult} 교차점에 대한 정보를 저장한다. [옵션]
         * @return {adun.Geom.IntersectResult}
         * @public
         * @static
         */
        lineSegmentToRectangle: function(seg, rect, output) {
            if (adun.isUndefined(output)) {
                output = new adun.Geom.IntersectResult();
            }

            output.result = false;

            if (rect.contains(seg.x1, seg.y1) && rect.contains(seg.x2, seg.y2)) {
                output.x = (seg.x1 + seg.x2) / 2;
                output.y = (seg.y1 + seg.y2) / 2;
                output.result = true;
            } else {

                // Top of the Rectangle VS the Line
                adun.Geom.Intersect.lineToRawSegment(seg, rect.x, rect.y, rect.right, rect.y, output);
                if (output.result == true) {
                    return output;
                }

                // Left of the Rectangle VS the Line
                adun.Geom.Intersect.lineToRawSegment(seg, rect.x, rect.y, rect.x, rect.bottom, output);
                if (output.result == true) {
                    return output;
                }

                // Bottom of the Rectangle VS the Line
                adun.Geom.Intersect.lineToRawSegment(seg, rect.x, rect.bottom, rect.right, rect.bottom, output);
                if (output.result == true) {
                    return output;
                }

                // Right of the Rectangle VS the Line
                adun.Geom.Intersect.lineToRawSegment(seg, rect.right, rect.y, rect.right, rect.bottom, output);
            }

            return output;
        },


        /**
         * -------------------------------------------------------------------------------------------------------------
         * Ray (광선)
         * -------------------------------------------------------------------------------------------------------------
         */


        /**
         * 광선과 원이 교차(충돌)했는지 검사한다.
         *
         * @method rayToCircle
         * @param ray {adun.Geom.Ray} 광선
         * @param circle {adun.Geom.Circle] 원
         * @param [output] {adun.Geom.IntersectResult} 교차점에 대한 정보를 저장한다. [옵션]
         * @return {adun.Geom.IntersectResult}
         * @public
         * @static
         */
        rayToCircle: function(ray, circle, output) {
            if (adun.isUndefined(output)) {
                output = new adun.Geom.IntersectResult();
            }

            output.result = false;  

            var dx = circle.x - ray.x1;
            var dy = circle.y - ray.y1;

            if( Math.sqrt(dx * dx + dy * dy) <= circle.radius ) {
                output.result = true;
                return output;
            }

            // ???

            adun.Geom.Intersect.lineToCircle(ray, circle, output);

            return output;
        },

        /**
         * 광선과 사각형이 교차(충돌)했는지 검사한다.
         *
         * @method rayToRctangle
         * @param ray {adun.Geom.Ray} 광선
         * @param rectangle {adun.Geom.Rectangle] 사각형
         * @param [output] {adun.Geom.IntersectResult} 교차점에 대한 정보를 저장한다. [옵션]
         * @return {adun.Geom.IntersectResult}
         * @public
         * @static
         */
        rayToRectangle: function(ray, rect, output) {
            if (adun.isUndefined(output)) {
                output = new adun.Geom.IntersectResult();
            }

            output.result = false;

            adun.Geom.Intersect.lineToRectangle(ray, rect, output);

            return output;
        },

        /**
         * 광선과 선분이 한 지점에서 교차(충돌)했는지 검사한다.
         *
         * @param rayx1
         * @param rayy1
         * @param rayx2
         * @param rayy2
         * @param linex1
         * @param liney1
         * @param linex2
         * @param liney2
         * @param output
         * @return {adun.Geom.IntersectResult}
         * @public
         * @static
         */
        rayToLineSegment: function(rayx1, rayy1, rayx2, rayy2, linex1, liney1, linex2, liney2, output) {
            if (adun.isUndefined(output)) {
                output = new adun.Geom.IntersectResult();
            }

            output.result = false;

            var r, s, d;
            // Check lines are not parallel
            if ((rayy2 - rayy1) / (rayx2 - rayx1) != (liney2 - liney1) / (linex2 - linex1)) {
                d = (((rayx2 - rayx1) * (liney2 - liney1)) - (rayy2 - rayy1) * (linex2 - linex1));
                if (d != 0) {
                    r = (((rayy1 - liney1) * (linex2 - linex1)) - (rayx1 - linex1) * (liney2 - liney1)) / d;
                    s = (((rayy1 - liney1) * (rayx2 - rayx1)) - (rayx1 - linex1) * (rayy2 - rayy1)) / d;
                    if (r >= 0) {
                        if (s >= 0 && s <= 1) {
                            output.result = true;
                            output.x = rayx1 + r * (rayx2 - rayx1), rayy1 + r * (rayy2 - rayy1);
                        }
                    }
                }
            }
            return output;
        },


        /**
         * -------------------------------------------------------------------------------------------------------------
         * Circle (원)
         * -------------------------------------------------------------------------------------------------------------
         */

        /**
         * 원과 원이 교차(충돌)했는지 검사한다.
         *
         * @method circleToCircle
         * @param circle1 {adun.Geom.Circle}
         * @param circle2 {adun.Geom.Circle}
         * @return {adun.Geom.IntersectResult}
         * @public
         * @static
         */
        circleToCircle: function(circle1, circle2) {
            if (adun.isUndefined(output)) {
                output = new adun.Geom.IntersectResult();
            }

            output.result = false;

            output.result = ( (circle1.radius + circle2.radius) * (circle1.radius + circle2.radius) >= adun.Geom.Intersect.distanceSquared(circle1.x, circle1.y, circle2.x, circle2.y) );

            return output;
        },

        /**
         * 원과 사각형이 교차(충돌)했는지 검사한다.
         *
         * @method circleToRectangle
         * @param circle {adun.Geom.Circle}
         * @param rect {adun.Geom.Rectangle}
         * @return {adun.Geom.IntersectResult}
         * @public
         * @static
         */
        circleToRectangle: function(circle, rect, output) {
            if (adun.isUndefined(output)) {
                output = new adun.Geom.IntersectResult();
            }

            output.result = false;

            var cornerDistX, cornerDistY, circleRelativeX, circleRelativeY, halfRectWidth, halfRectHeight, rectRangeX, rectRangeY;

            halfRectWidth = rect.width / 2;
            circleRelativeX = Math.abs(circle.x - rect.x - halfRectWidth);
            rectRangeX = circle.radius + halfRectWidth;

            // 만약 원이 사각형 x 범위안에 없다면 교차하지 않는다.
            if( circleRelativeX > rectRangeX ) {
                output.result = false;
                return output;
            }

            halfRectHeight = rect.height / 2;
            circleRelativeY = Math.abs(circle.y - rect.y - halfRectHeight);
            rectRangeY = circle.radius + halfRectHeight;

            // 만약 원이 사각형 y 범위안에 없다면 교차하지 않는다.
            if (circleRelativeY > rectRangeY) {
                output.result = false;
                return output;
            }


            if( circleRelativeX <= halfRectWidth || circleRelativeY <= halfRectHeight ) {
                output.result = true;
                return result;
            }


            cornerDistX = circleRelativeX - halfRectWidth;
            cornerDistY = circleRelativeY - halfRectHeight;
            output.result = cornerDistX * cornerDistX + cornerDistY * cornerDistY <= circle.radius * circle.radius;

            return output;
        },

        /**
         * 주어진 포인트가 원 안에있는지 검사한다.
         *
         * @method circleContainsPoint
         * @param circle {adun.Geom.Circle}
         * @param point {adun.Geom.Point}
         * @return {adun.Geom.IntersectResult}
         * @public
         * @static
         */
        circleContainsPoint: function(circle, point, output) {
            if (adun.isUndefined(output)) {
                output = new adun.Geom.IntersectResult();
            }

            output.result = false;

            output.result = circle.radius * circle.radius >= adun.Geom.Intersect.distanceSquared(circle.x, circle.y, point.x, point.y);

            return output;
        },

        /**
         * -------------------------------------------------------------------------------------------------------------
         * Rectangle (사각형)
         * -------------------------------------------------------------------------------------------------------------
         */

        /**
         * 주어진 포인트가 사각형 안에있는지 검사한다.
         *
         * @method pointToRectangle
         * @param point {adun.Geom.Point}
         * @param rect {adun.Geom.Rectangle}
         * @return {adun.Geom.IntersectResult}
         * @public
         * @static
         */
        pointToRectangle: function(point, rect, output) {
            if (adun.isUndefined(output)) {
                output = new adun.Geom.IntersectResult();
            }

            output.result = false;

            output.setTo(point.x, point,y);
            ouput.result = rect.containsPoint(point);

            return output;
        },

        /**
         * 사각형과 사각형이 교차(충돌)했는지 검사한다.
         *
         * @method rectangleToRectangle
         * @param rect1 {adun.Geom.Rectangle}
         * @param rect2 {adun.Geom.Rectangle}
         * @return {adun.Geom.IntersectResult}
         * @public
         * @static
         */
        rectangleToRectangle: function(rect1, rect2, output) {
            if (adun.isUndefined(output)) {
                output = new adun.Geom.IntersectResult();
            }

            output.result = false;

            var leftX   = Math.max(rect1.x, rect2.x);
            var rightX  = Math.min(rect1.right, rect2.right);
            var topY    = Math.max(rect1.y, rect2.y);
            var bottomY = Math.min(rect1.bottom, rect2.bottom);

            output.setTo(leftX, topY, rightX - leftX, bottomY - topY, rightX - leftX, bottomY - topY);

            var cx = output.x + output.width * 0.5;
            var cy = output.y + output.height * 0.5;

            if( (cx > rect1.x && cx < rect1.right) && (cy > rect1.y && cy < rect1.bottom) ) {
                output.result = true;
            }

            return output;
        }
    });

    adun.Geom.Intersect = new Intersect();
})();

// #IntersectResult
/**
 * IntersectResult
 * 교차점(충돌 결과)를 저장할 간단한 클래스다.
 * Intersect 클래스의 STATIC 메서드와 함께 사용된다.
 *
 *
 * @Class IntersectResult
 * @namespace Adun.Geom
 * @constructor
 *
 */
(function() {
    'use strict';

    var IntersectResult = adun.Geom.IntersectResult = adun.Class({
        TYPE: 'IntersectResult',

        init: function() {
            this.result = false;
        },

        /**
         * 매개변수에 근거하여 좌표를 설정한다.
         *
         * @method setTo
         * @param [x1=0]
         * @param [y1=0]
         * @param [x2=0]
         * @param [y2=0]
         * @param [width=0]
         * @param [height=0]
         * @public
         */
        setTo: function(x1, y1, x2, y2, width, height) {

            this.x1 = x1 || 0;
            this.y1 = y1 || 0;
            this.x2 = x2 || 0;
            this.y2 = y2 || 0;
            this.width = width || 0;
            this.height = height || 0;
        }

    });


})();


