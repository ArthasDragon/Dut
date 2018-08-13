/**
 * by 暗影舞者 Copyright 2018-08-13
 */

var __type = Object.prototype.toString;
var options = {
	async: false,
	dirtyComponent: {}
};
var numberMap = {
	"[object Boolean]": 2,
	"[object Number]": 3,
	"[object String]": 4,
	"[object Function]": 5,
	"[object Symbol]": 6,
	"[object Array]": 7
};
var specialStyle = {
	zIndex: 1
};
function styleHelper(styleName, styleNumber) {
	if (typeNumber(styleNumber) === 3) {
		var style = specialStyle[styleName] ? styleNumber : styleNumber + "px";
		return style;
	}
	return styleNumber;
}
function typeNumber(data) {
	if (data === null) {
		return 1;
	}
	if (data === undefined) {
		return 0;
	}
	var a = numberMap[__type.call(data)];
	return a || 8;
}
function isEventName(name) {
	return /^on[A-Z]/.test(name);
}
var noop = function noop() {};

function addEvent(domNode, fn, eventName) {
	if (domNode.addEventListener) {
		domNode.addEventListener(eventName, fn, false);
	} else if (domNode.attachEvent) {
		domNode.attachEvent("on" + eventName, fn);
	}
}
var registerdEvent = {};
var specialHook = {
	change: function change(dom) {
		if (/text|password/.test(dom.type)) {
			addEvent(document, createHandle, "input");
		}
	}
};
function createHandle(e) {
	dispatchEvent$1(e, "change");
}
function dispatchEvent$1(event, eventName, end) {
	var path = getEventPath(event, end);
	var E = new SyntheticEvent(event);
	options.async = true;
	if (eventName) {
		E.type = eventName;
	}
	triggerEventByPath(E, path);
	options.async = false;
	for (var dirty in options.dirtyComponent) {
		options.dirtyComponent[dirty].updateComponent();
	}
	options.dirtyComponent = {};
}
function triggerEventByPath(e, path) {
	var thisEvenType = e.type;
	for (var i = 0; i < path.length; i++) {
		var events = path[i].__events;
		for (var eventName in events) {
			var fn = events[eventName];
			e.currentTarget = path[i];
			if (typeof fn === "function" && thisEvenType === eventName) {
				fn.call(path[i], e);
			}
		}
	}
}
function getEventPath(event, end) {
	var path = [];
	var begin = event.target;
	while (1) {
		if (begin.__events) {
			path.push(begin);
		}
		begin = begin.parentNode;
		if (!begin) {
			break;
		}
	}
	return path;
}
function SyntheticEvent(event) {
	if (event.nativeEvent) {
		return event;
	}
	for (var i in event) {
		if (!eventProto[i]) {
			this[i] = event[i];
		}
	}
	if (!this.target) {
		this.target = event.srcElement;
	}
	this.fixEvent();
	this.timeStamp = new Date() - 0;
	this.nativeEvent = event;
}
var eventProto = (SyntheticEvent.prototype = {
	fixEvent: function fixEvent() {},
	preventDefault: function preventDefault() {
		var e = this.nativeEvent || {};
		e.returnValue = this.returnValue = false;
		if (e.preventDefault) {
			e.preventDefault();
		}
	},
	fixHooks: function fixHooks() {},
	stopPropagation: function stopPropagation() {
		var e = this.nativeEvent || {};
		e.cancelBubble = this._stopPropagation = true;
		if (e.stopPropagation) {
			e.stopPropagation();
		}
	},
	persist: function noop$$1() {},
	stopImmediatePropagation: function stopImmediatePropagation() {
		this.stopPropagation();
		this.stopImmediate = true;
	},
	toString: function toString() {
		return "[object Event]";
	}
});

var mapProps = function mapProps(domNode, props, Vnode) {
	if (Vnode && typeof Vnode.type === "function") {
		return;
	}
	for (var propName in props) {
		if (propName === "children") continue;
		if (isEventName(propName)) {
			var eventName = propName.slice(2).toLowerCase();
			mappingStrategy["event"](domNode, props[propName], eventName);
			continue;
		}
		if (typeNumber(mappingStrategy[propName]) === 5) {
			mappingStrategy[propName](domNode, props[propName]);
		}
		if (mappingStrategy[name] === void 2333) {
			mappingStrategy["otherProps"](domNode, props[name], name);
		}
	}
};
var mappingStrategy = {
	event: function event(domNode, cb, eventName) {
		var events = domNode.__events || {};
		events[eventName] = cb;
		domNode.__events = events;
		if (!registerdEvent[eventName]) {
			registerdEvent[eventName] = 1;
			if (specialHook[eventName]) {
				specialHook[eventName](domNode);
			} else {
				addEvent(document, dispatchEvent, eventName);
			}
		}
	},
	clearEvents: function clearEvents(domNode, eventCb, eventName) {
		var events = domNode.__events || {};
		events[eventName] = noop;
		domNode.__events = events;
	},
	style: function style(domNode, _style) {
		if (_style !== void 2333) {
			Object.entries(_style).forEach(function(name_value) {
				var styleName = name_value[0];
				var styleValue = name_value[1];
				domNode.style[styleName] = styleHelper(styleName, styleValue);
			});
		}
	},
	className: function className(domNode, _className) {
		if (_className !== void 2333) {
			domNode.className = _className;
		}
	},
	dangerouslySetInnerHTML: function dangerouslySetInnerHTML(domNode, html) {
		var oldHtml = domNode.innerHTML;
		if (html.__html !== oldHtml) {
			domNode.innerHTML = html.__html;
		}
	},
	otherProps: function otherProps(domNode, prop, propName) {
		if (prop !== void 2333 || propName !== void 2333) {
			domNode[propName] = prop;
		}
	}
};
var updateProps = function updateProps(oldProps, newProps, hostNode) {
	var restProps = {};
	for (var _name in oldProps) {
		if (_name === "children") continue;
		if (oldProps[_name] !== newProps[_name]) {
			restProps[_name] = newProps[_name];
		}
	}
	for (var newName in newProps) {
		if (oldProps[newName] === void 2333) {
			restProps[newName] = newProps[newName];
		}
	}
	mapProps(hostNode, restProps);
};

function catchError(Instance, hookname, args) {
	try {
		if (Instance[hookname]) {
			var result = void 2333;
			if (hookname === "render") {
				result = Instance[hookname].apply(Instance);
			} else {
				result = Instance[hookname].apply(Instance, args);
			}
			return result;
		}
	} catch (e) {
		var Vnode = void 0;
		Vnode = Instance.Vnode;
		if (hookname === "render" || hookname === "componentWillMount") {
			Vnode = args[0];
		}
	}
}

function setRef(Vnode, instance, domNode) {
	if (instance) {
		var refType = typeNumber(Vnode.ref);
		if (refStrategy[refType]) {
			refStrategy[refType](Vnode, Vnode.owner, domNode);
		}
	}
}
var refStrategy = {
	3: function _(Vnode, instance, domNode) {
		if (Vnode._instance) {
			instance.refs[Vnode.ref] = Vnode._instance;
		} else {
			instance.refs[Vnode.ref] = domNode;
		}
	},
	4: function _(Vnode, instance, domNode) {
		refStrategy[3](Vnode, instance, domNode);
	},
	5: function _(Vnode, instance, domNode) {
		if (Vnode._instance) {
			Vnode.ref(Vnode._instance);
		} else {
			Vnode.ref(domNode);
		}
	}
};

function update(oldVnode, newVnode, parentDomNode, parentContext) {
	newVnode._hostNode = oldVnode._hostNode;
	if (oldVnode.type === newVnode.type) {
		if (typeNumber(oldVnode.type) === 4) {
			updateProps(oldVnode.props, newVnode.props, newVnode._hostNode);
			return newVnode;
		}
	}
}

var _extends =
	Object.assign ||
	function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) {
				if (Object.prototype.hasOwnProperty.call(source, key)) {
					target[key] = source[key];
				}
			}
		}
		return target;
	};
var _createClass = (function() {
	function defineProperties(target, props) {
		for (var i = 0; i < props.length; i++) {
			var descriptor = props[i];
			descriptor.enumerable = descriptor.enumerable || false;
			descriptor.configurable = true;
			if ("value" in descriptor) descriptor.writable = true;
			Object.defineProperty(target, descriptor.key, descriptor);
		}
	}
	return function(Constructor, protoProps, staticProps) {
		if (protoProps) defineProperties(Constructor.prototype, protoProps);
		if (staticProps) defineProperties(Constructor, staticProps);
		return Constructor;
	};
})();
function _toConsumableArray(arr) {
	if (Array.isArray(arr)) {
		for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {
			arr2[i] = arr[i];
		}
		return arr2;
	} else {
		return Array.from(arr);
	}
}
function _classCallCheck(instance, Constructor) {
	if (!(instance instanceof Constructor)) {
		throw new TypeError("Cannot call a class as a function");
	}
}
var ComStatue = {
	CREATE: 0,
	MOUNT: 1,
	UPDATING: 2,
	UPDATED: 3,
	MOUNTTING: 4
};
var uniqueId = 0;
var Component = (function() {
	function Component(props, context) {
		_classCallCheck(this, Component);
		this.props = props;
		this.state = this.state || {};
		this.context = context;
		this.nextState = null;
		this.lifeCycle = ComStatue.CREATE;
		this.refs = {};
		this._uniqueId = uniqueId++;
		this._penddingState = [];
		this.stateMergeQueue = [];
	}
	_createClass(Component, [
		{
			key: "setState",
			value: function setState(partialNewState, callback) {
				this._penddingState.push({
					partialNewState: partialNewState,
					callback: callback
				});
				if (this.lifeCycle === ComStatue.CREATE);
				else {
					if (this.lifeCycle === ComStatue.UPDATING) {
						return;
					}
					if (this.lifeCycle === ComStatue.MOUNTTING) {
						this.stateMergeQueue.push(1);
						return;
					}
					if (this.lifeCycle === ComStatue.CATCHING) {
						this.stateMergeQueue.push(1);
						return;
					}
					this.updateComponent();
				}
			}
		},
		{
			key: "updateComponent",
			value: function updateComponent$$1() {
				var _this = this;
				var preState = this.state;
				var oldVnode = this.Vnode;
				var oldContext = this.context;
				this.nextState = this.state;
				this._penddingState.forEach(function(item) {
					if (typeof item.partialNewState === "function") {
						_this.nextState = Object.assign(
							{},
							_this.nextState,
							item.partialNewState(_this.nextState, _this.props)
						);
					} else {
						_this.nextState = Object.assign(
							{},
							_this.state,
							item.partialNewState
						);
					}
				});
				if (this.nextState !== preState) {
					this.state = this.nextState;
				}
				if (this.componentWillUpdate) {
					catchError(this, "componentWillUpdate", [
						this.props,
						this.nextState,
						this.context
					]);
				}
				var lastOwner = currentOwner.cur;
				currentOwner.cur = this;
				this.nextState = null;
				var newVnode = this.render();
				newVnode = newVnode ? newVnode : new Vnode("#text", "", null, null);
				currentOwner.cur = lastOwner;
				this.Vnode = update(
					oldVnode,
					newVnode,
					this.Vnode._hostNode,
					this.context
				);
				if (this.componentDidUpdate) {
					catchError(this, "componentDidUpdate", [
						this.props,
						preState,
						oldContext
					]);
				}
				this._penddingState.forEach(function(item) {
					if (typeof item.callback === "function") {
						item.callback(_this.state, _this.props);
					}
				});
				this._penddingState = [];
			}
		},
		{
			key: "_updateInLifeCycle",
			value: function _updateInLifeCycle() {
				if (this.stateMergeQueue.length > 0) {
					var tempState = this.state;
					this._penddingState.forEach(function(item) {
						tempState = Object.assign.apply(
							Object,
							[{}, tempState].concat(_toConsumableArray(item.partialNewState))
						);
					});
					this.nextState = _extends({}, tempState);
					this.stateMergeQueue = [];
					this.updateComponent();
				}
			}
		},
		{
			key: "componentWillReceiveProps",
			value: function componentWillReceiveProps() {}
		},
		{
			key: "componentWillMount",
			value: function componentWillMount() {}
		},
		{
			key: "componentDidMount",
			value: function componentDidMount() {}
		},
		{
			key: "componentWillUnmount",
			value: function componentWillUnmount() {}
		},
		{
			key: "componentDidUnmount",
			value: function componentDidUnmount() {}
		},
		{
			key: "render",
			value: function render() {}
		}
	]);
	return Component;
})();

var _typeof =
	typeof Symbol === "function" && typeof Symbol.iterator === "symbol"
		? function(obj) {
			return typeof obj;
		  }
		: function(obj) {
			return obj &&
					typeof Symbol === "function" &&
					obj.constructor === Symbol &&
					obj !== Symbol.prototype
				? "symbol"
				: typeof obj;
		  };
var mountIndex = 0;
var containerMap = {};
var currentOwner = {
	cur: null
};
function render(Vnode$$1, container) {
	if (typeNumber(container) !== 8) {
		throw new Error("Target container is not a DOM element.");
	}
	var UniqueKey = container.UniqueKey;
	if (container.UniqueKey);
	else {
		Vnode$$1.isTop = true;
		container.UniqueKey = mountIndex++;
		containerMap[container.UniqueKey] = Vnode$$1;
		DuyRender(Vnode$$1, container);
		return Vnode$$1._instance;
	}
}
function DuyRender(Vnode$$1, container, isUpdate) {
	var parentContext =
		arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
	if (!Vnode$$1) return;
	var type = Vnode$$1.type,
		_Vnode$props = Vnode$$1.props,
		props = _Vnode$props === undefined ? {} : _Vnode$props;
	var children = props.children;
	var domNode = void 0;
	var VnodeType = typeof type === "undefined" ? "undefined" : _typeof(type);
	if (VnodeType === "function") {
		domNode = renderComponent(Vnode$$1, container, parentContext);
	}
	if (VnodeType === "string") {
		domNode = document.createElement(type);
	}
	mapProps(domNode, props);
	children && mountChildren(children, domNode);
	Vnode$$1._hostNode = domNode;
	container.appendChild(domNode);
	return domNode;
}
function mountChildren(children, parentNode) {
	if (children.length > 1) {
		children.forEach(function(child) {
			return DuyRender(child, parentNode);
		});
	} else {
		DuyRender(children, parentNode);
	}
}
function renderComponent(Vnode$$1, parentDomNode, parentContext) {
	var ComponentClass = Vnode$$1.type;
	var props = Vnode$$1.props,
		key = Vnode$$1.key,
		ref = Vnode$$1.ref;
	var instance = new ComponentClass(props);
	Vnode$$1._instance = instance;
	if (instance.componentWillMount) {
		var isCatched = catchError(instance, "componentWillMount", [Vnode$$1]);
		if (isCatched) return;
	}
	var lastOwner = currentOwner.cur;
	currentOwner.cur = instance;
	var renderedVnode = catchError(instance, "render", [Vnode$$1]);
	var renderedType = typeNumber(renderedVnode);
	if (renderedType === 7) {
		renderedVnode = mountChildren(renderedVnode, parentDomNode);
	}
	if (renderedType === 3 || renderedType === 4) {
		renderedVnode = new Vnode$$1("#text", renderedVnode, null, null);
	}
	currentOwner.cur = lastOwner;
	if (renderedVnode === void 2333) {
		return;
	}
	renderedVnode.key = key || null;
	instance.Vnode = renderedVnode;
	instance.Vnode._mountIndex = mountIndex++;
	var domNode = null;
	domNode = DuyRender(
		renderedVnode,
		parentDomNode,
		false,
		instance.context,
		instance
	);
	setRef(Vnode$$1, instance, domNode);
	Vnode$$1._hostNode = domNode;
	instance.Vnode._hostNode = domNode;
	if (instance.componentDidMount) {
		instance.lifeCycle = ComStatue.MOUNTTING;
		catchError(instance, "componentDidMount", []);
		instance.componentDidMount = null;
		instance.lifeCycle = ComStatue.MOUNT;
	}
	instance._updateInLifeCycle();
	return domNode;
}
var ReactDOM = {
	render: render
};

function _classCallCheck$1(instance, Constructor) {
	if (!(instance instanceof Constructor)) {
		throw new TypeError("Cannot call a class as a function");
	}
}
var RESERVED_PROPS = {
	ref: true,
	key: true,
	__self: true,
	__source: true
};
var Vnode = function Vnode(type, props, key, ref) {
	_classCallCheck$1(this, Vnode);
	this.owner = currentOwner.cur;
	this.type = type;
	this.props = props;
	this.key = key;
	this.ref = ref;
};
function createElement(type, config) {
	for (
		var _len = arguments.length,
			children = Array(_len > 2 ? _len - 2 : 0),
			_key = 2;
		_key < _len;
		_key++
	) {
		children[_key - 2] = arguments[_key];
	}
	var props = {},
		key = null,
		ref = null,
		childLength = children.length;
	if (config != null) {
		key = config.key === undefined ? null : "" + config.key;
		ref = config.ref === undefined ? null : config.ref;
		for (var name in config) {
			if (name !== "key" && name !== "ref") {
				if (RESERVED_PROPS.hasOwnProperty(name)) {
					continue;
				}
				config.hasOwnProperty(name) && (props[name] = config[name]);
			}
		}
	}
	if (childLength === 1) {
		props.children = children[0];
	} else if (childLength > 1) {
		props.children = children;
	}
	var defaultProps = type.defaultProps;
	if (defaultProps) {
		for (var propName in defaultProps) {
			if (props[propName === undefined]) {
				props[propName] = defaultProps[propName];
			}
		}
	}
	return new Vnode(type, props, key, ref);
}

var React = {
	createElement: createElement,
	ReactDOM: ReactDOM,
	Component: Component
};

module.exports = React;
