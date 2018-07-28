/**
 * by 暗影舞者 Copyright 2018-07-28
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

function mapProps(domNode, props) {
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
}
function render(Vnode, container) {
	var type = Vnode.type,
		props = Vnode.props;
	if (!type) return;
	var domNode = void 0;
	domNode = document.createElement(type);
	mapProps(domNode, props);
	container.appendChild(domNode);
}
var ReactDOM = {
	render: render
};

var React = { createElement: createElement, ReactDOM: ReactDOM };

module.exports = React;
