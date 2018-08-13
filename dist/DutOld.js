/**
 * by 暗影舞者 Copyright 2018-08-02
 */

var __type = Object.prototype.toString;
var numberMap = {
	"[object Boolean]": 2,
	"[object Number]": 3,
	"[object String]": 4,
	"[object Function]": 5,
	"[object Symbol]": 6,
	"[object Array]": 7
};
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

function _classCallCheck(instance, Constructor) {
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
	_classCallCheck(this, Vnode);
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

var mapProps = function mapProps(domNode, props, Vnode) {
	if (Vnode && typeof Vnode.type === "function") {
		return;
	}
	for (var propsName in props) {
		if (propsName === "children") continue;
		if (propsName === "style") {
			(function() {
				var style = props["style"];
				Object.keys(style).forEach(function(styleName) {
					domNode.style[styleName] = style[styleName];
				});
				return "continue";
			})();
			continue;
		}
		domNode[propsName] = props[propsName];
	}
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
function render(Vnode, container) {
	if (typeNumber(container) !== 8) {
		throw new Error("Target container is not a DOM element.");
	}
	var UniqueKey = container.UniqueKey;
	if (container.UniqueKey);
	else {
		Vnode.isTop = true;
		container.UniqueKey = mountIndex++;
		containerMap[container.UniqueKey] = Vnode;
		DuyRender(Vnode, container);
		return Vnode._instance;
	}
}
function DuyRender(Vnode, container, isUpdate) {
	var parentContext =
		arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
	if (!Vnode) return;
	var type = Vnode.type,
		_Vnode$props = Vnode.props,
		props = _Vnode$props === undefined ? {} : _Vnode$props;
	var children = props.children;
	var domNode = void 0;
	var VnodeType = typeof type === "undefined" ? "undefined" : _typeof(type);
	if (VnodeType === "function") {
		domNode = renderComponent(Vnode, container, parentContext);
	}
	if (VnodeType === "string") {
		domNode = document.createElement(type);
	}
	mapProps(domNode, props);
	children && mountChildren(children, domNode);
	Vnode._hostNode = domNode;
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
function renderComponent(Vnode, container, parentContext) {
	var ComponentClass = Vnode.type;
	var props = Vnode.props,
		key = Vnode.key,
		ref = Vnode.ref;
	var instance = new ComponentClass(props);
	Vnode._instance = instance;
	if (instance.componentWillMount) {
		var isCatched = catchError(instance, "componentWillMount", [Vnode]);
		if (isCatched) return;
	}
	var renderedVnode = catchError(instance, "render", [Vnode]);
	var renderedType = typeNumber(renderedVnode);
	instance.Vnode = renderedVnode;
	return DuyRender(renderedVnode, container);
}
var ReactDOM = {
	render: render
};

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
function _classCallCheck$1(instance, Constructor) {
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
		_classCallCheck$1(this, Component);
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
			value: function setState(nState) {
				var preState = this.state;
				var oldVnode = this.Vnode;
				this.nextState = _extends({}, preState, nState);
				this.state = this.nextState;
				var newVnode = this.render();
				this.updateComponent(this, oldVnode, newVnode);
			}
		},
		{
			key: "updateComponent",
			value: function updateComponent(instance, oldVnode, newVnode) {
				if (oldVnode.type === newVnode.type) {
					mapProps(oldVnode._hostNode, newVnode.props);
				}
			}
		},
		{
			key: "render",
			value: function render() {}
		}
	]);
	return Component;
})();

var React = {
	createElement: createElement,
	ReactDOM: ReactDOM,
	Component: Component
};

module.exports = React;
