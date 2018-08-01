import { typeNumber } from "./utils";

const RESERVED_PROPS = {
	ref: true,
	key: true,
	__self: true,
	__source: true
};

export class Vnode {
	constructor(type, props, key, ref) {
		this.type = type; //节点类型
		this.props = props; //各种属性
		this.key = key; //key
		this.ref = ref;
	}
}

/**
 *
 * @param {String | Function} type
 * @param {Object} config   (key, ref, props)
 * @param {Array} children
 */
export function createElement(type, config, ...children) {
	let props = {},
		key = null,
		ref = null,
		childLength = children.length;

	if (config != null) {
		key = config.key === undefined ? null : "" + config.key;
		ref = config.ref === undefined ? null : config.ref;

		for (let name in config) {
			if (name !== "key" && name !== "ref") {
				//过滤一些不需要的props
				if (RESERVED_PROPS.hasOwnProperty(name)) {
					continue;
				}

				//确保不是undefined
				config.hasOwnProperty(name) && (props[name] = config[name]);
			}
		}
	}

	//children放到props中
	if (childLength === 1) {
		props.children = children[0];
	} else if (childLength > 1) {
		props.children = children;
	}

	//defaultProps  当type为Function---即为组件时
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

/**
 * 将children中的文本节点转换为Vnode对象
 * @param {Vnode | String | Number} children
 * @param {Vnode} parentVnode
 */
export function flattenChildren(children, parentVnode) {
	//undefined 转化为空字符串
	if (children === undefined) return new Vnode("#text", "", null, null);

	let length = children.length;
	let arr = [],
		isLastSimple = false, //判断上一个元素是不是string或number
		lastString = "",
		childType = typeNumber(children);

	//childType类型为number or string
	if (childType === 4 || childType === 3) {
		return new Vnode("#text", children, null, null);
	}

	//不是数组
	if (childType !== 7) {
		return children;
	}

	//数组情况下处理
	children.forEach((item, index) => {
		let itemType = typeNumber(item);
		if (itemType === 7) {
			//item为数组
			if (isLastSimple) {
				arr.push(lastString);
			}
			item.forEach(it => {
				arr.push(it);
			});
			lastString = "";
			isLastSimple = false;
		} else if (itemType === 3 || itemType === 4) {
			//number or string   连续的text合并在一起
			lastString += item;
			isLastSimple = true;
		} else {
			if (isLastSimple) {
				arr.push(lastString);
				arr.push(item);
				lastString = "";
				isLastSimple = false;
			} else {
				arr.push(item);
			}
		}

		//最后一项为number or string
		if (length - 1 === index) {
			if (lastString) arr.push(lastString);
		}
	});

	arr = arr.map(item => {
		if (typeNumber(item) === 4) {
			item = new Vnode("#text", item, null, null);
		} else {
			if (item) {
				//首先判断是否存在
				if (typeNumber(item) !== 3 && typeNumber(item) !== 4) {
					//再判断是不是字符串，或者数字
					//不是就加上return
					if (parentVnode) item.return = parentVnode;
				}
			}
		}
		return item;
	});

	return arr;
}
