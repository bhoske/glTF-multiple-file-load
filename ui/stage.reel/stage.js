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
</copyright> */
/**
    @module "montage/ui/stage.reel"
    @requires montage
    @requires montage/ui/component
*/
var Montage = require("montage").Montage,
    Component = require("montage/ui/component").Component,
    SimpleAnimation = Montage.create(Montage, {
       _startValue: {
            value: null,
            writable: !0
        },
        _savedStart: {
            value: null,
            writable: !0
        },
        _endValue: {
            value: null,
            writable: !0
        },
        _duration: {
            value: 0,
            writable: !0
        },
        _startTime: {
            value: 0,
            writable: !0
        },
        _intervalRequest: {
            value: 0,
            writable: !0
        },
      	 _delegate: {
            value: null,
            writable: !0
        },
		 _view: {
            value: null,
            writable: !0
        },
		 init: {
            value: function ( n, r, i, material,view) { //start,end,time,material
              this._startValue = n, this._endValue = r, this._duration = i, this._savedStart = [n[0], n[1], n[2]],this._delegate = material,this._view =view;
            }
        },
        handleUpdate: {
            value: function () {
                var e = new Date,
                    t = e.getTime() / 1e3,
                    n = (t - this._startTime) / this._duration;
                if (this._delegate) {
                    var r = [];
                   r[0] = (1 - n) * this._savedStart[0] + n * this._endValue[0], r[1] = (1 - n) * this._savedStart[1] + n * this._endValue[1], r[2] = (1 - n) * this._savedStart[2] + n * this._endValue[2];
                    if (n < 1) {
                        var i = this;
                        requestAnimationFrame(function () {
                            i.handleUpdate.call(i)
                        })
                    }
					this._delegate._parameters.diffuse = r;
					this._view.needsDraw = true;
               }
            }
        },
        stopAnimation: {
            value: function () {}
        },
        run: {
            value: function () {
                window.requestAnimationFrame = function () {
                    return window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function (e) {
                        window.setTimeout(e, 1e3 / 60, new Date)
                    }
                }();
                var e = new Date,
                    t = e.getTime() / 1e3,
                    n = this;
                this._startTime = t, this.handleUpdate()
            }
        }
    });
var Utilities = require("runtime/utilities").Utilities;
var Node = require("runtime/node").Node;
var Camera = require("runtime/camera").Camera;
var GLSLProgram = require("runtime/glsl-program").GLSLProgram;
var glMatrix = require("runtime/dependencies/gl-matrix").glMatrix;

/**
    Description TODO
    @class module:"montage/ui/stage.reel".Stage
    @extends module:montage/ui/component.Component
*/
exports.Stage = Montage.create(Component, /** @lends module:"montage/ui/stage.reel".Stage# */ {

    view: {
        get: function() {
            return this.templateObjects.view;
        }
    },

    progress: {
        get: function() {
            var options = this.templateObjects.options;
            return options ? options.progress : null;
        }
    },

    selectModel: {
        get: function() {
            var options = this.templateObjects.options;
            return options ? options.selectModel : null;
        }
    },
	searchNode: {
        value: function(node_) {
          var return_value = null;
		  if(node_.name =="Body")
		  {
			return_value = node_;
		  }
		  else
		  {
			 for(var i =0 ;i<node_.children.length;i++)
			 {
				return_value = this.searchNode(node_.children[i]);
				if(return_value != null)
					break;
			 }
		  }
		  return return_value;
        }
    },
	searchMaterialNode: {
        value: function(node_) {
          var return_value = null;
		  if(node_.children.length ==0)
		  {
			return_value = node_;
		  }
		  else
		  {
			 for(var i =0 ;i<node_.children.length;i++)
			 {
				return_value = this.searchMaterialNode(node_.children[i]);
				if(return_value != null)
					break;
			 }
		  }
		  return return_value;
        }
    },
	setBodyColor: {
        value: function(color_) {
			if(this.view.scene.rootNode)
			{
				var rootnode= this.view.scene.rootNode;
				var mynode_ = this.searchNode(rootnode);
				if(mynode_)
				{
					var mynode1_ = this.searchMaterialNode(mynode_);
					if(mynode1_)
					{
						/*var mat_name_array = [];
						for(var m =0 ;m<mynode_.children.length;m++)
						{
							var mynode1_ = mynode_.children[m];
							for(var i = 0;i<mynode1_._properties.meshes.length;i++)
							{
								var mesh = mynode1_._properties.meshes[i];
								for(j =0;j<mesh.primitives.length;j++)
								{
									var mat = mesh.primitives[j]._material;
									var count = 0;
									for(var k =0 ;k<mat_name_array.length;k++)
									{
										if(mat_name_array[k] == mat.name)
										{
										count++;
										break;
										}
									}
									if(count == 0)
									{
										mat_name_array.push(mat.name);
										//mat._parameters.diffuse = color_;
										var l = Montage.create(SimpleAnimation);
										l.init(mat._parameters.diffuse, color_, 1.2, mat);  // old color, new color, time,material
										l.run();
									}
								}
							}
						}*/
						if(mynode1_._properties.meshes[0].primitives[0]._material)
						{
							var mat = mynode1_._properties.meshes[0].primitives[0]._material;
							//mat._parameters.diffuse = color_;
							var l = Montage.create(SimpleAnimation);
							l.init(mat._parameters.diffuse, color_, 1.2, mat,this.view);  // old color, new color, time,material
							l.run();
						}
					}
				}
			}
        }
    },
	setVisiblityOfNode : {

		value: function(node_, flag_){
			if(node_._properties.meshes.length !== 0)
			{
				for(var k=0; k<node_._properties.meshes.length; k++)
					for(var j=0; j<node_._properties.meshes[k].primitives.length; j++)
						node_._properties.meshes[k].primitives[j].visible = flag_;
			}
			else{
				for(var i =0 ;i<node_.children.length;i++)
				{
					this.setVisiblityOfNode(node_.children[i], flag_);
				}
			}
		}
	},
	searchNodebyName: {
        value: function(node_, name_, flag_) {
			if(node_.name == name_)
			{
				this.setVisiblityOfNode(node_, flag_);
			}
			else
			{
				for(var i =0 ;i<node_.children.length;i++)
				{
					this.searchNodebyName(node_.children[i], name_, flag_);
				}
			}
        }
    },
	_bodyColor: {
        value: null
    },
    bodyColor: {
        get: function() {
            return this._bodyColor;
        },
        set: function(value) {
			if(value != null)
			{
				if (value === this._bodyColor) {
					return;
				}
				this._bodyColor = value;
				this.setBodyColor([value.red/255,value.green/255,value.blue/255]);
			}
		}
    },
	restart: {
        value: function() {
            /*
            if (this.selectModel) {
                this.selectModel.content.push( { "name": "car", "path":"model/output.json"} );
                this.selectModel.needsDraw = true;
            }
            */

            //that's really for the demo.. 
            var self = this;
            if (this.view.engine) 
            this.view.engine.technique.rootPass.scene.rootNode.apply( function(node, parent) {
                if (node.meshes) {
                    if (node.meshes.length) {
                        node.meshes.forEach( function(mesh) {
                          mesh.loadedPrimitivesCount = 0;
                          mesh.step = 0;
                        }, self);
                    }
                }
                return null;
            } , true, null);

            var resourceManager = this.view.getResourceManager();
            if (resourceManager) {
                resourceManager.maxConcurrentRequests = this.concurrentRequests;
                resourceManager.bytesLimit = this.bytesLimit * 1000;
                resourceManager.reset();
            }
            var progress = this.progress;
            if (progress) {
                progress.value = 0;
                progress.element.style.opacity = 1;
            }
        }
    },
	fitall : {
		 value: function() {
		 	this.view.camera.setDistance(1.3);
			this.view.camera.orbitX = 0.6750000000000003; //values taken out the camera while manipulating the model...
            this.view.camera.orbitY = -0.5836293856408279;

		 }
	},
	turn : {

		 value: function() {
			if(this.view.cameraAnimating == true){
					this.view._modelTurn = false;
					this.view.cameraAnimating = false;
				}
			else{
					this.view.cameraAnimating = true;
					this.view._modelTurn = true;
				}
		 }
	},
	cabin : {
		value: function() {
			var rootnode= this.view.scene.rootNode;
			this.searchNodebyName(rootnode, "PiaggioAircraft", false);
			this.searchNodebyName(rootnode, "Cabin", true);
		}
	},
	cockpit : {
		value: function() {
			var rootnode= this.view.scene.rootNode;
			this.searchNodebyName(rootnode, "PiaggioAircraft", false);
			this.searchNodebyName(rootnode, "Cockpit", true);
		}
	},
	engine : {
		value: function() {
			var rootnode= this.view.scene.rootNode;
			this.searchNodebyName(rootnode, "PiaggioAircraft", false);
			this.searchNodebyName(rootnode, "Engine", true);
		}
	},
	fuselage : {
		value: function() {
			var rootnode= this.view.scene.rootNode;
			this.searchNodebyName(rootnode, "PiaggioAircraft", false);
			this.searchNodebyName(rootnode, "Fuselage", true);
		}
	},
	tail : {
		value: function() {
			var rootnode= this.view.scene.rootNode;
			this.searchNodebyName(rootnode, "PiaggioAircraft", false);
			this.searchNodebyName(rootnode, "Tail", true);
		}
	},
	wheel : {
		value: function() {
			var rootnode= this.view.scene.rootNode;
			this.searchNodebyName(rootnode, "PiaggioAircraft", false);
			this.searchNodebyName(rootnode, "Wheel", true);
		}
	},
	wing : {
		value: function() {
			var rootnode= this.view.scene.rootNode;
			this.searchNodebyName(rootnode, "PiaggioAircraft", false);
			this.searchNodebyName(rootnode, "Wing", true);
		}
	},
	aircraft : {
		value: function() {
			var rootnode= this.view.scene.rootNode;
			this.searchNodebyName(rootnode, "PiaggioAircraft", true);
		}
	},
	defaultProperties: {
		 value: function() {
		 	this.view.defaultProperties();

		 }
	},
    /**
     @param
         @returns
     */
    templateDidLoad:{
        value:function () {
            var listenerObj = {};
            var self = this;
            listenerObj.handleRestartAction = function(event) {
                self.restart.call(self);
            }
			listenerObj.handleFitallAction = function(event) {
                self.fitall.call(self);
            }
			listenerObj.handleSetdefaultpropertiesAction = function(event) {
                self.defaultProperties.call(self);
            }
			listenerObj.handleTurnAction = function(event) {
                self.turn.call(self);
            }
			listenerObj.handleCabinAction = function(event) {
                self.cabin.call(self);
            }
			listenerObj.handleCockpitAction = function(event) {
                self.cockpit.call(self);
            }
			listenerObj.handleEngineAction = function(event) {
                self.engine.call(self);
            }
			listenerObj.handleFuselageAction = function(event) {
                self.fuselage.call(self);
            }
			listenerObj.handleTailAction = function(event) {
                self.tail.call(self);
            }
			listenerObj.handleWheelAction = function(event) {
                self.wheel.call(self);
            }
			listenerObj.handleWingAction = function(event) {
                self.wing.call(self);
            }
			listenerObj.handleAircraftAction = function(event) {
                self.aircraft.call(self);
            }
			this.templateObjects.options.addEventListener("action", listenerObj, false);
            this.view.delegate = this;
        }
    },

    _model: {value: null, writable:true},

    model: {
        get: function() {
            return this._model;
        },
        set: function(value) {
            if (value !== this._model) {
                this._model = value;
                this.run(this.model);
            }
        }
    },

    location: {value: null, writable: true},

    _fillViewport: {
        value: true
    },

    fillViewport: {
        get: function() {
            return this._fillViewport;
        },
        set: function(value) {
            if (value === this._fillViewport) {
                return;
            }

            this._fillViewport = value;

            if (this._isComponentExpanded) {
                if (this._fillViewport) {
                    window.addEventListener("resize", this, true);
                } else {
                    window.removeEventListener("resize", this, true);
                }
            }
        }
    },

    height: {value: null, writable:true},
    width: {value: null, writable:true},

    prepareForDraw: {
        value: function() {
            if (this.selectModel) {
                this.selectModel.content.push( { "name": "Model", "path":model_path} );
				this.selectModel.needsDraw = true;
                this.model = this.selectModel.content[0].path;
            }
			if (this.fillViewport) {
                window.addEventListener("resize", this, true);
            }
        }
    },

    captureResize: {
        value: function(evt) {
			this.needsDraw = true;
			this.view.updatePickVariables();
        }
    },

    willDraw: {
        value: function() {
			 this.view.width = this.width = window.innerWidth ;
            this.view.height = this.height = window.innerHeight;
        }
    },


    _bytesLimit: { value: 0, writable: true },

    bytesLimit: {
        set: function(value) {
            if (this._bytesLimit !== value) {
                this._bytesLimit = value ;
            }
        }, 
        get: function(value) {
            return this._bytesLimit;
        }
    },

    _concurrentRequests: { value: 6, writable: true },

    concurrentRequests: {
        set: function(value) {
            this._concurrentRequests = Math.floor(parseInt(value));
        }, 
        get: function(value) {
            return this._concurrentRequests;
        }
    },

    run: {
        value: function(scenePath) {
            this.restart();
            this.view.scenePath = scenePath;
            this.view.needsDraw = true;
        }
    },

    sceneDidChange: {
        value: function() {
            var progress = this.progress;
            if (progress) {
                progress.element.style["-webkit-transition-duration"] = "1s";
                progress.element.style.opacity = 1;
                progress.max = this.view.totalBufferSize;
                progress.value = 0;
                this.restart();
                var resourceManager = this.view.getResourceManager();
                if (resourceManager) {
                    if (resourceManager.observers.length === 1) { //FIXME:...
                        resourceManager.observers.push(this);
                    }
                }
            }
        }
    },

    resourceAvailable: {
        value: function(resource) {
            var progress = this.progress;
            if (progress) {
                if (resource.range) {
                    progress.value += resource.range[1] - resource.range[0];
                    if (progress.value >= progress.max) {
                        progress.element.style.opacity = 0;
                        setTimeout(function() { 
                            progress.value = 0;
                        },1000);

                    }
                }
            }
        }
    },


});
