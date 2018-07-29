class Vnode {
	constructor(type, props, key, ref) {
		this.type = type; //节点类型
		this.props = props; //各种属性
		this.key = key; //key
		this.ref = ref;
	}
}

/**
 *
 * @param {String,Function} type
 * @param {Object} config   (key, ref, props)
 * @param {Array} children
 */
function createElement(type, config, ...children) {
	let props = {},
		key = null,
		ref = null,
		childLength = children.length;

	if (config != null) {
		key = config.key === undefined ? null : "" + config.key;
		ref = config.ref === undefined ? null : config.ref;

		for (let name in config) {
			if (name !== "key" && name !== "ref") {
				config.hasOwnProperty(name) && (props[name] = config[name]);
			}
		}
	}

	//children放到props中
	props.children = childLength === 1 ? children[0] : children;

	//defaultProps
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
export default createElement;
