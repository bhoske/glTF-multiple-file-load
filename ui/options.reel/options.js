/* <copyright>
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
/*</copyright>

    @module "montage/ui/options.reel"
    @requires montage
    @requires montage/ui/component
*/
var Montage = require("montage").Montage,
    Component = require("montage/ui/component").Component,
	Color = require("ui/core/color").Color,
	ArrayController = require("montage/ui/controller/array-controller").ArrayController;
exports.Options = Montage.create(Component, /** @lends module:"montage/ui/stage.reel".Stage# */ {

    range: { value: null, writable:true },
    requests: { value: null, writable:true },
    progress: { value: null, writable:true },
    selectModel: { value: null, writable: true },
    enableReflection: { value: null, writable:true },
	Pick: { value: false, writable:true },
	pickType: { value: null, writable:true },
	showBBOX: { value: null, writable:true },
	bodyColorController: {value: null, writable:true },
	bodyColor: {value: null, writable:true },
	templateDidLoad:{
        value:function () {
          this.range = this.templateObjects.range;
          this.requests = this.templateObjects.requests;
          this.progress = this.templateObjects.progress;
          this.selectModel = this.templateObjects.selectModel;
          this.enableReflection = this.templateObjects.enableReflection;
          this.showBBOX = this.templateObjects.showBBOX;
		  this.pickType = this.templateObjects.pickType;
	 }
    },
	bodyColor_options: {
        distinct: true,
        value: [Color.create().initWithNameAndRGB("Cavern Grey",  48,56,64),
                Color.create().initWithNameAndRGB("Royal Burgundy", 0,28,123),
                Color.create().initWithNameAndRGB("Mint White",  227,227,225),
                Color.create().initWithNameAndRGB("Arctic Silver",  135,137,139),
                Color.create().initWithNameAndRGB("Infinity Black",  17,11,14),
				Color.create().initWithNameAndRGB("Sterling Gold",  107,102,94),
				Color.create().initWithNameAndRGB("Porcelain White",  239,232,218),
                Color.create().initWithNameAndRGB("Neo Orange", 0,42,154),
                Color.create().initWithNameAndRGB("Brilliant Blue",  0,62,103),
                Color.create().initWithNameAndRGB("Spice Red",  108,15,25),
                Color.create().initWithNameAndRGB("Summer Sparkle",  230,142,0),
				Color.create().initWithNameAndRGB("Apple Green",  126,126,33),
				Color.create().initWithNameAndRGB("After Glow",  144,142,135),
				Color.create().initWithNameAndRGB("Grey",  128,128,128)]
	},
	handleEnablePick1Action : {
		 value: function() {
		  this.Pick = true;
		}
	},
	handleDisablePick1Action : {
		 value: function() {
		  this.Pick = false;
		}
	},
	didCreate: {
        value: function() {
            this.bodyColorController = ArrayController.create();
            Object.defineBinding(this.bodyColorController, "content", {
                boundObject: this,
                boundObjectPropertyPath: "bodyColor_options",
                oneway: true
            });
			Object.defineBinding(this.bodyColorController, "selectedObjects.0", {
                boundObject: this,
                boundObjectPropertyPath: "bodyColor"
            });
		}
	},
    prepareForDraw: {
        value: function() {
		  this.bodyColorController.selectedObjects = [this.bodyColor];
		 }
    },

    willDraw: {
        value: function() {
        }
    },
    
    convert: {
        value:function(v) {
            return Number(Math.round(v)).toString()
        }
    },
    
    // TODO this is a lossy revert, which is not a good idea
    // but it gets this example working as expected
    revert: {
        value:function(v) {
            return Number(Math.round(v)).toString()
        }
    }


});
