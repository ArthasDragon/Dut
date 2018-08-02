/**
 * by 暗影舞者 Copyright 2018-08-02
 */

let __type = Object.prototype.toString;
let numberMap = {
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
	let a = numberMap[__type.call(data)];
	return a || 8;
}

function _classCallCheck(instance, Constructor) {
	if (!(instance instanceof Constructor)) {
		throw new TypeError("Cannot call a class as a function");
	}
}
let RESERVED_PROPS = {
	ref: true,
	key: true,
	__self: true,
	__source: true
};
let Vnode = function Vnode(type, props, key, ref) {
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
	let props = {},
		key = null,
		ref = null,
		childLength = children.length;
	if (config != null) {
		key = config.key === undefined ? null : "" + config.key;
		ref = config.ref === undefined ? null : config.ref;
		for (let name in config) {
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
	let defaultProps = type.defaultProps;
	if (defaultProps) {
		for (let propName in defaultProps) {
			if (props[propName === undefined]) {
				props[propName] = defaultProps[propName];
			}
		}
	}
	return new Vnode(type, props, key, ref);
}

let mapProps = function mapProps(domNode, props, Vnode) {
	if (Vnode && typeof Vnode.type === "function") {
		return;
	}
	for (let propsName in props) {
		if (propsName === "children") continue;
		if (propsName === "style") {
			let _ret = (function() {
				let style = props["style"];
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

let _typeof =
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
let mountIndex = 0;
let containerMap = {};
function render(Vnode, container) {
	if (typeNumber(container) !== 8) {
		throw new Error("Target container is not a DOM element.");
	}
	let UniqueKey = container.UniqueKey;
	if (container.UniqueKey);
	else {
		Vnode.isTop = true;
		container.UniqueKey = mountIndex++;
		containerMap[container.UniqueKey] = Vnode;
		DuyRender(Vnode, container);
	}
}
function DuyRender(Vnode, container) {
	if (!Vnode) return;
	let type = Vnode.type,
		props = Vnode.props;
	if (!type) return;
	let children = props.children;
	let domNode = void 0;
	let VnodeType = typeof type === "undefined" ? "undefined" : _typeof(type);
	if (VnodeType === "function") {
		domNode = renderComponent(Vnode, container);
	}
	if (VnodeType === "string") {
		domNode = document.createElement(type);
	}
	mapProps(domNode, props);
	children && mountChildren(children, domNode);
	Vnode._hostNode = domNode;
	Vnode._instance = container.appendChild(domNode);
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
function renderComponent(Vnode, container) {
	let ComponentClass = Vnode.type;
	let props = Vnode.props;
	let instance = new ComponentClass(props);
	let renderVnode = instance.render();
	instance.Vnode = renderVnode;
	Vnode._instance = instance;
	return DuyRender(renderVnode, container);
}
let ReactDOM = {
	render: render
};

let _extends =
	Object.assign ||
	function(target) {
		for (let i = 1; i < arguments.length; i++) {
			let source = arguments[i];
			for (let key in source) {
				if (Object.prototype.hasOwnProperty.call(source, key)) {
					target[key] = source[key];
				}
			}
		}
		return target;
	};
let _createClass = (function() {
	function defineProperties(target, props) {
		for (let i = 0; i < props.length; i++) {
			let descriptor = props[i];
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
let ComStatue = {
	CREATE: 0,
	MOUNT: 1,
	UPDATING: 2,
	UPDATED: 3,
	MOUNTTING: 4
};
let uniqueId = 0;
let Component = (function() {
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
				let preState = this.state;
				let oldVnode = this.Vnode;
				this.nextState = _extends({}, preState, nState);
				this.state = this.nextState;
				let newVnode = this.render();
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

let React = {
	createElement: createElement,
	ReactDOM: ReactDOM,
	Component: Component
};

module.exports = React;
