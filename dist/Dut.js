/**
 * by 暗影舞者 Copyright 2018-07-29
 */

function _classCallCheck(instance, Constructor) {
	if (!(instance instanceof Constructor)) {
		throw new TypeError("Cannot call a class as a function");
	}
}
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
				config.hasOwnProperty(name) && (props[name] = config[name]);
			}
		}
	}
	props.children = childLength === 1 ? children[0] : children;
	return new Vnode(type, props, key, ref);
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
var mapProps = function mapProps(domNode, props) {
	for (var propsName in props) {
		if (propsName === "children") continue;
		if (propsName === "style") {
			var _ret = (function() {
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
function render(Vnode, container) {
	if (!Vnode) return;
	var type = Vnode.type,
		props = Vnode.props;
	if (!type) return;
	var children = props.children;
	var domNode = void 0;
	var VnodeType = typeof type === "undefined" ? "undefined" : _typeof(type);
	if (VnodeType === "function") {
		domNode = renderComponent(Vnode, container);
	}
	if (VnodeType === "string") {
		domNode = document.createElement(type);
	}
	mapProps(domNode, props);
	mountChildren(children, domNode);
	Vnode._hostNode = domNode;
	container.appendChild(domNode);
	return domNode;
}
function mountChildren(children, parentNode) {
	if (children.length > 1) {
		children.forEach(function(child) {
			return render(child, parentNode);
		});
	} else {
		render(children, parentNode);
	}
}
function renderComponent(Vnode, container) {
	var ComponentClass = Vnode.type;
	var props = Vnode.props;
	var instance = new ComponentClass(props);
	var renderVnode = instance.render();
	instance.Vnode = renderVnode;
	return render(renderVnode, container);
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
var Component = (function() {
	function Component(props) {
		_classCallCheck$1(this, Component);
		this.props = props;
		this.state = this.state || {};
		this.nextState = null;
	}
	_createClass(Component, [
		{
			key: "setState",
			value: function setState(nState) {
				var preState = this.state;
				this.nextState = _extends({}, preState, nState);
				this.state = this.nextState;
				var oldVnode = this.Vnode;
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
