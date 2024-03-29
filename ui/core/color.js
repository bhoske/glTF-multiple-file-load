/*<copyright>
Copyright (c) 2012, Motorola Mobility LLC.
All Rights Reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:

* Redistributions of source code must retain the above copyright notice,
  this list of conditions and the following disclaimer.

* Redistributions in binary form must reproduce the above copyright notice,
  this list of conditions and the following disclaimer in the documentation
  and/or other materials provided with the distribution.

* Neither the name of Motorola Mobility LLC nor the names of its
  contributors may be used to endorse or promote products derived from this
  software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE
LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
POSSIBILITY OF SUCH DAMAGE.
</copyright>*/
var Montage = require("montage").Montage;
var ConfigurationOption = require("ui/core/configuration-option").ConfigurationOption;

exports.Color = Montage.create(ConfigurationOption, {

    initWithNameAndRGB: {
        value: function(name, r, g, b) {
            this.name = name;
            this.red = r;
            this.green = g;
            this.blue = b;
            return this;
        }
    },

    red: {
        value: null
    },

    green: {
        value: null
    },

    blue: {
        value: null
    },

    hex: {
        get: function() {
            return "#" + this.toHex(this.red) + this.toHex(this.green) + this.toHex(this.blue);
        },
        set: function(value) {
            value = value.replace("#", "");

            this.red = parseInt(value.substring(0,2),16);
            this.green = parseInt(value.substring(2,4),16);
            this.blue = parseInt(value.substring(4,6),16);
        }
    },

    toHex: {
        value: function(n) {
            n = n > 255 ? 255: n;
            n = n < 0 ? 0 : n;
            return "0123456789ABCDEF".charAt((n - n % 16) / 16) + "0123456789ABCDEF".charAt(n % 16);
        }
    }

});
