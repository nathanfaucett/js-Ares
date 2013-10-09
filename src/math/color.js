if (typeof define !== "function") {
    var define = require("amdefine")(module);
}
define([
        "math/mathf"
    ],
    function(Mathf) {
        "use strict";


        var sqrt = Math.sqrt,
            floor = Math.floor,
            clamp01 = Mathf.clamp01;

        /**
        * @class Color
        * @brief rgb color, values 0 - 1
        * @param Number r
        * @param Number g
        * @param Number b
        */

        function Color(r, g, b) {

            /**
            * @property Number r
            * @memberof Color
            */
            this.r = 0;

            /**
            * @property Number g
            * @memberof Color
            */
            this.g = 0;

            /**
            * @property Number b
            * @memberof Color
            */
            this.b = 0;

            this._r = 0;
            this._g = 0;
            this._b = 0;
            this._hex = "#000000";
            this._rgb = "rgb(0,0,0)";

            this.set(r, g, b);
        }

        /**
        * @method clone
        * @memberof Color
        * @brief returns new instance of this
        * @return Color
        */
        Color.prototype.clone = function() {

            return new Color(this.r, this.g, this.b);
        };

        /**
        * @method copy
        * @memberof Color
        * @brief copies other
        * @param Color other
        * @return this
        */
        Color.prototype.copy = function(other) {

            this.r = other.r;
            this.g = other.g;
            this.b = other.b;

            return this;
        };

        /**
        * @method set
        * @memberof Color
        * @brief sets values of this
        * @param Number r
        * @param Number g
        * @param Number b
        * @return this
        */
        Color.prototype.set = function(r, g, b) {
            var type = typeof(r);

            if (type === "number") {
                this.r = r;
                this.g = g;
                this.b = b;
            } else if (type === "string") {
                this.setStyle(r);
            } else if (r instanceof Color) {
                this.r = r.r;
                this.g = r.g;
                this.b = r.b;
            }

            return this;
        };

        /**
        * @method setRGB
        * @memberof Color
        * @brief sets rgb values of this
        * @param Number r
        * @param Number g
        * @param Number b
        * @return this
        */
        Color.prototype.setRGB = function(r, g, b) {

            this.r = r;
            this.g = g;
            this.b = b;

            return this;
        };

        /**
        * @method setStyle
        * @memberof Color
        * @brief sets values of this from string
        * @param String style
        * @return this
        */
        Color.prototype.setStyle = function() {
            var rgb0255 = /^rgb\((\d+),(\d+),(\d+)\)$/i,
                rgb0100 = /^rgb\((\d+)\%,(\d+)\%,(\d+)\%\)$/i,
                hex6 = /^\#([0-9a-f]{6})$/i,
                hex3 = /^\#([0-9a-f])([0-9a-f])([0-9a-f])$/i,
                hex3to6 = /#(.)(.)(.)/,
                hex3to6String = "#$1$1$2$2$3$3",
                colorName = /^(\w+)$/i,
                inv255 = 1 / 255,
                inv100 = 1 / 100;

            return function(style) {

                if (rgb0255.test(style)) {
                    var color = rgb0255.exec(style);

                    this.r = min(255, Number(color[1])) * inv255;
                    this.g = min(255, Number(color[2])) * inv255;
                    this.b = min(255, Number(color[3])) * inv255;

                    return this;
                }

                if (rgb0100.test(style)) {
                    var color = rgb0100.exec(style);

                    this.r = min(100, Number(color[1])) * inv100;
                    this.g = min(100, Number(color[2])) * inv100;
                    this.b = min(100, Number(color[3])) * inv100;

                    return this;
                }

                if (hex6.test(style)) {

                    this.r = parseInt(style.substr(1, 2), 16) * inv255;
                    this.g = parseInt(style.substr(3, 2), 16) * inv255;
                    this.b = parseInt(style.substr(5, 2), 16) * inv255;

                    return this;
                }

                if (hex3.test(style)) {
                    style = style.replace(hex3to6, hex3to6String);

                    this.r = parseInt(style.substr(1, 2), 16) * inv255;
                    this.g = parseInt(style.substr(3, 2), 16) * inv255;
                    this.b = parseInt(style.substr(5, 2), 16) * inv255;

                    return this;
                }

                if (colorName.test(style)) {
                    style = colorNames[style];

                    this.r = parseInt(style.substr(1, 2), 16) * inv255;
                    this.g = parseInt(style.substr(3, 2), 16) * inv255;
                    this.b = parseInt(style.substr(5, 2), 16) * inv255;

                    return this;
                }

                return this;
            };
        }();

        /**
        * @method toHEX
        * @memberof Color
        * @brief returns this color in HEX format
        * @return Color
        */
        Color.prototype.toHEX = function() {

            if (this.r !== this._r || this.g !== this._g || this.b !== this._b) {
                var hexR = singleToHEX(this.r),
                    hexG = singleToHEX(this.g),
                    hexB = singleToHEX(this.b);

                this._r = this.r;
                this._g = this.g;
                this._b = this.b;
                this._hex = "#" + hexR + hexG + hexB;
            }

            return this._hex;
        };

        /**
        * @method toRGB
        * @memberof Color
        * @brief returns this color in RGB format
        * @return Color
        */
        Color.prototype.toRGB = function() {

            if (this.r !== this._r || this.g !== this._g || this.b !== this._b) {
                var r = floor(clamp01(this.r) * 256),
                    g = floor(clamp01(this.g) * 256),
                    b = floor(clamp01(this.b) * 256);

                this._r = this.r;
                this._g = this.g;
                this._b = this.b;
                this._rgb = "rgb(" + r + "," + g + "," + b + ")";
            }

            return this._rgb;
        };

        /**
        * @method add
        * @memberof Color
        * @brief adds other's values to this
        * @param Color other
        * @return this
        */
        Color.prototype.add = function(other) {

            this.r += other.r;
            this.g += other.g;
            this.b += other.b;

            return this;
        };

        /**
        * @method cadd
        * @memberof Color
        * @brief adds a and b together saves it in this
        * @param Color a
        * @param Color b
        * @return this
        */
        Color.prototype.cadd = function(a, b) {

            this.r = a.r + b.r;
            this.g = a.g + b.g;
            this.b = a.b + b.b;

            return this;
        };

        /**
        * @method sadd
        * @memberof Color
        * @brief adds scalar value to this
        * @param Number s
        * @return this
        */
        Color.prototype.sadd = function(s) {

            this.r += s;
            this.g += s;
            this.b += s;

            return this;
        };

        /**
        * @method sub
        * @memberof Color
        * @brief subtracts other's values from this
        * @param Color other
        * @return this
        */
        Color.prototype.sub = function(other) {

            this.r -= other.r;
            this.g -= other.g;
            this.b -= other.b;

            return this;
        };

        /**
        * @method csub
        * @memberof Color
        * @brief subtracts b from a saves it in this
        * @param Color a
        * @param Color b
        * @return this
        */
        Color.prototype.csub = function(a, b) {

            this.r = a.r - b.r;
            this.g = a.g - b.g;
            this.b = a.b - b.b;

            return this;
        };

        /**
        * @method ssub
        * @memberof Color
        * @brief subtracts this by a scalar value
        * @param Number s
        * @return this
        */
        Color.prototype.ssub = function(s) {

            this.r -= s;
            this.g -= s;
            this.b -= s;

            return this;
        };

        /**
        * @method mul
        * @memberof Color
        * @brief muliples this's values by other's
        * @param Color other
        * @return this
        */
        Color.prototype.mul = function(other) {

            this.r *= other.r;
            this.g *= other.g;
            this.b *= other.b;

            return this;
        };

        /**
        * @method cmul
        * @memberof Color
        * @brief muliples a and b saves it in this
        * @param Color a
        * @param Color b
        * @return this
        */
        Color.prototype.cmul = function(a, b) {

            this.r = a.r * b.r;
            this.g = a.g * b.g;
            this.b = a.b * b.b;

            return this;
        };

        /**
        * @method smul
        * @memberof Color
        * @brief muliples this by a scalar value
        * @param Number s
        * @return this
        */
        Color.prototype.smul = function(s) {

            this.r *= s;
            this.g *= s;
            this.b *= s;

            return this;
        };

        /**
        * @method div
        * @memberof Color
        * @brief divides this's values by other's
        * @param Color other
        * @return this
        */
        Color.prototype.div = function(other) {
            var x = other.r,
                y = other.g,
                z = other.b,
                w = other.w;

            this.r *= x !== 0 ? 1 / x : 0;
            this.g *= y !== 0 ? 1 / y : 0;
            this.b *= z !== 0 ? 1 / z : 0;

            return this;
        };

        /**
        * @method cdiv
        * @memberof Color
        * @brief divides b from a saves it in this
        * @param Color a
        * @param Color b
        * @return this
        */
        Color.prototype.cdiv = function(a, b) {
            var x = b.r,
                y = b.g,
                z = b.b;

            this.r = x !== 0 ? a.r / x : 0;
            this.g = y !== 0 ? a.g / y : 0;
            this.b = z !== 0 ? a.b / z : 0;

            return this;
        };

        /**
        * @method sdiv
        * @memberof Color
        * @brief divides this by scalar value
        * @param Number s
        * @return this
        */
        Color.prototype.sdiv = function(s) {
            s = s === 0 ? 0 : 1 / s;

            this.r *= s;
            this.g *= s;
            this.b *= s;

            return this;
        };

        /**
        * @method length
        * @memberof Color
        * @brief returns length of this
        * @return this
        */
        Color.prototype.length = function() {
            var r = this.r,
                g = this.g,
                b = this.b,
                lsq = r * r + g * g + b * b;

            if (lsq === 1) return 1;

            return lsq === 0 ? 0 : sqrt(lsq);
        };

        /**
        * @method lengthSq
        * @memberof Color
        * @brief returns length squared of this
        * @return this
        */
        Color.prototype.lengthSq = function() {
            var r = this.r,
                g = this.g,
                b = this.b;

            return r * r + g * g + b * b;
        };

        /**
        * @method normalize
        * @memberof Color
        * @brief returns this with a length of 1
        * @return this
        */
        Color.prototype.normalize = function() {
            var r = this.r,
                g = this.g,
                b = this.b,
                l = r * r + g * g + b * b;

            if (l === 1) return this;

            l = l > 0 ? 1 / sqrt(l) : 0;

            this.r *= l;
            this.g *= l;
            this.b *= l;

            return this;
        };

        /**
        * @method lerp
        * @memberof Color
        * @brief linear interpolation between this and other by x
        * @param Color other
        * @param Number x
        * @return Color
        */
        Color.prototype.lerp = function(other, x) {

            this.r += (other.r - this.r) * x;
            this.g += (other.g - this.g) * x;
            this.b += (other.b - this.b) * x;

            return this;
        };

        /**
        * @method clerp
        * @memberof Color
        * @brief linear interpolation between a and b by x
        * @param Color a
        * @param Color b
        * @param Number x
        * @return Color
        */
        Color.prototype.clerp = function(a, b, x) {
            var ax = a.r,
                ay = a.g,
                az = a.b;

            this.r = ax + (b.r - ax) * x;
            this.g = ay + (b.g - ay) * x;
            this.b = az + (b.b - az) * x;

            return this;
        };

        /**
        * @method min
        * @memberof Color
        * @brief returns min values from this and other vector
        * @param Color other
        * @return Color
        */
        Color.prototype.min = function(other) {
            var ar = this.r,
                ag = this.g,
                ab = this.b,
                br = other.r,
                bg = other.g,
                bb = other.b;

            this.r = br < ar ? br : ar;
            this.g = bg < ag ? bg : ag;
            this.b = bb < ab ? bb : ab;

            return this;
        };

        /**
        * @method max
        * @memberof Color
        * @brief returns max values from this and other vector
        * @param Color other
        * @return Color
        */
        Color.prototype.max = function(other) {
            var ar = this.r,
                ag = this.g,
                ab = this.b,
                br = other.r,
                bg = other.g,
                bb = other.b;

            this.r = br > ar ? br : ar;
            this.g = bg > ag ? bg : ag;
            this.b = bb > ab ? bb : ab;

            return this;
        };

        /**
        * @method clamp
        * @memberof Color
        * @brief clamp values between min and max's values
        * @param Color min
        * @param Color max
        * @return this
        */
        Color.prototype.clamp = function(min, max) {
            var r = this.r,
                g = this.g,
                b = this.b,
                minr = min.r,
                ming = min.g,
                minb = min.b,
                maxr = max.r,
                maxg = max.g,
                maxb = max.b;

            this.r = r < minr ? minr : r > maxr ? maxr : r;
            this.g = g < ming ? ming : g > maxg ? maxg : g;
            this.b = b < minb ? minb : b > maxb ? maxb : b;

            return this;
        };

        /**
        * @method clamp01
        * @memberof Color
        * @brief clamp values between 0 and 1
        * @param Color min
        * @param Color max
        * @return this
        */
        Color.prototype.clamp01 = function() {
            var r = this.r,
                g = this.g,
                b = this.b;

            this.r = r < 0 ? 0 : r > 1 ? 1 : r;
            this.g = g < 0 ? 0 : g > 1 ? 1 : g;
            this.b = b < 0 ? 0 : b > 1 ? 1 : b;

            return this;
        };

        /**
        * @method fromVec2
        * @memberof Color
        * @brief sets values from Vec2
        * @param Vec2 v
        * @return this
        */
        Color.prototype.fromVec2 = function(v) {

            this.r = v.x;
            this.g = v.y;
            this.b = 0;

            return this;
        };

        /**
        * @method fromVec3
        * @memberof Color
        * @brief sets values from Vec3
        * @param Vec3 v
        * @return this
        */
        Color.prototype.fromVec3 = function(v) {

            this.r = v.x;
            this.g = v.y;
            this.b = v.z;

            return this;
        };

        /**
        * @method fromVec4
        * @memberof Color
        * @brief sets values from Vec4
        * @param Vec4 v
        * @return this
        */
        Color.prototype.fromVec4 = Color.prototype.fromVec3

        /**
        * @method fromArray
        * @memberof Color
        * @brief sets values from array
        * @param Array array
        * @return this
        */
        Color.prototype.fromArray = function(array) {

            this.r = array[0];
            this.g = array[1];
            this.b = array[2];

            return this;
        };

        /**
        * @method fromJSON
        * @memberof Color
        * @brief sets values from JSON object
        * @param Object json
        * @return this
        */
        Color.prototype.fromJSON = function(json) {

            this.r = json.r;
            this.g = json.g;
            this.b = json.b;

            return this;
        };

        /**
        * @method toArray
        * @memberof Color
        * @brief returns array of this
        * @return Object
        */
        Color.prototype.toArray = function() {

            return [this.r, this.g, this.b];
        };

        /**
        * @method toJSON
        * @memberof Color
        * @brief returns json object of this
        * @return Object
        */
        Color.prototype.toJSON = function() {

            return {
                r: this.r,
                g: this.g,
                b: this.b
            };
        };

        /**
        * @method toString
        * @memberof Color
        * @brief returns string of this
        * @return String
        */
        Color.prototype.toString = function() {

            return "Color( " + this.r + ", " + this.g + ", " + this.b + " )";
        };

        /**
        * @method equals
        * @memberof Color
        * @brief checks if this's values equal other's values
        * @param Color other
        * @return Boolean
        */
        Color.prototype.equals = function(other) {

            return !(this.r !== other.r || this.g !== other.g || this.b !== other.b);
        };

        /**
        * @method cequals
        * @memberof Color
        * @brief checks if a's values equal b's values, can be called as a static function Color.cequals( a, b )
        * @param Color a
        * @param Color b
        * @return Boolean
        */
        Color.cequals = Color.prototype.cequals = function(a, b) {

            return !(a.r !== b.r || a.g !== b.g || a.b !== b.b);
        };


        function singleToHEX(value) {
            var str = (~~(clamp01(value) * 255)).toString(16);
            return str.length === 1 ? "0" + str : str;
        }


        var colorNames = Color.colorNames = {
            aliceblue: "#f0f8ff",
            antiquewhite: "#faebd7",
            aqua: "#00ffff",
            aquamarine: "#7fffd4",
            azure: "#f0ffff",
            beige: "#f5f5dc",
            bisque: "#ffe4c4",
            black: "#000000",
            blanchedalmond: "#ffebcd",
            blue: "#0000ff",
            blueviolet: "#8a2be2",
            brown: "#a52a2a",
            burlywood: "#deb887",
            cadetblue: "#5f9ea0",
            chartreuse: "#7fff00",
            chocolate: "#d2691e",
            coral: "#ff7f50",
            cornflowerblue: "#6495ed",
            cornsilk: "#fff8dc",
            crimson: "#dc143c",
            cyan: "#00ffff",
            darkblue: "#00008b",
            darkcyan: "#008b8b",
            darkgoldenrod: "#b8860b",
            darkgray: "#a9a9a9",
            darkgreen: "#006400",
            darkkhaki: "#bdb76b",
            darkmagenta: "#8b008b",
            darkolivegreen: "#556b2f",
            darkorange: "#ff8c00",
            darkorchid: "#9932cc",
            darkred: "#8b0000",
            darksalmon: "#e9967a",
            darkseagreen: "#8fbc8f",
            darkslateblue: "#483d8b",
            darkslategray: "#2f4f4f",
            darkturquoise: "#00ced1",
            darkviolet: "#9400d3",
            deeppink: "#ff1493",
            deepskyblue: "#00bfff",
            dimgray: "#696969",
            dodgerblue: "#1e90ff",
            firebrick: "#b22222",
            floralwhite: "#fffaf0",
            forestgreen: "#228b22",
            fuchsia: "#ff00ff",
            gainsboro: "#dcdcdc",
            ghostwhite: "#f8f8ff",
            gold: "#ffd700",
            goldenrod: "#daa520",
            gray: "#808080",
            green: "#008000",
            greenyellow: "#adff2f",
            grey: "#808080",
            honeydew: "#f0fff0",
            hotpink: "#ff69b4",
            indianred: "#cd5c5c",
            indigo: "#4b0082",
            ivory: "#fffff0",
            khaki: "#f0e68c",
            lavender: "#e6e6fa",
            lavenderblush: "#fff0f5",
            lawngreen: "#7cfc00",
            lemonchiffon: "#fffacd",
            lightblue: "#add8e6",
            lightcoral: "#f08080",
            lightcyan: "#e0ffff",
            lightgoldenrodyellow: "#fafad2",
            lightgrey: "#d3d3d3",
            lightgreen: "#90ee90",
            lightpink: "#ffb6c1",
            lightsalmon: "#ffa07a",
            lightseagreen: "#20b2aa",
            lightskyblue: "#87cefa",
            lightslategray: "#778899",
            lightsteelblue: "#b0c4de",
            lightyellow: "#ffffe0",
            lime: "#00ff00",
            limegreen: "#32cd32",
            linen: "#faf0e6",
            magenta: "#ff00ff",
            maroon: "#800000",
            mediumaquamarine: "#66cdaa",
            mediumblue: "#0000cd",
            mediumorchid: "#ba55d3",
            mediumpurple: "#9370d8",
            mediumseagreen: "#3cb371",
            mediumslateblue: "#7b68ee",
            mediumspringgreen: "#00fa9a",
            mediumturquoise: "#48d1cc",
            mediumvioletred: "#c71585",
            midnightblue: "#191970",
            mintcream: "#f5fffa",
            mistyrose: "#ffe4e1",
            moccasin: "#ffe4b5",
            navajowhite: "#ffdead",
            navy: "#000080",
            oldlace: "#fdf5e6",
            olive: "#808000",
            olivedrab: "#6b8e23",
            orange: "#ffa500",
            orangered: "#ff4500",
            orchid: "#da70d6",
            palegoldenrod: "#eee8aa",
            palegreen: "#98fb98",
            paleturquoise: "#afeeee",
            palevioletred: "#d87093",
            papayawhip: "#ffefd5",
            peachpuff: "#ffdab9",
            peru: "#cd853f",
            pink: "#ffc0cb",
            plum: "#dda0dd",
            powderblue: "#b0e0e6",
            purple: "#800080",
            red: "#ff0000",
            rosybrown: "#bc8f8f",
            royalblue: "#4169e1",
            saddlebrown: "#8b4513",
            salmon: "#fa8072",
            sandybrown: "#f4a460",
            seagreen: "#2e8b57",
            seashell: "#fff5ee",
            sienna: "#a0522d",
            silver: "#c0c0c0",
            skyblue: "#87ceeb",
            slateblue: "#6a5acd",
            slategray: "#708090",
            snow: "#fffafa",
            springgreen: "#00ff7f",
            steelblue: "#4682b4",
            tan: "#d2b48c",
            teal: "#008080",
            thistle: "#d8bfd8",
            tomato: "#ff6347",
            turquoise: "#40e0d0",
            violet: "#ee82ee",
            wheat: "#f5deb3",
            white: "#ffffff",
            whitesmoke: "#f5f5f5",
            yellow: "#ffff00",
            yellowgreen: "#9acd32"
        };


        return Color;
    }
);
