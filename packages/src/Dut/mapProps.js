import { styleHelper, isEventName, noop, typeNumber } from "./utils";
import { registerdEvent, specialHook, addEvent } from "./event";

export const mapProps = function(domNode, props, Vnode) {
	if (Vnode && typeof Vnode.type === "function") {
		//如果是组件，则不要map他的props进来
		return;
	}

	for (let propName in props) {
		if (propName === "children") continue; //children单独处理

		if (isEventName(propName)) {
			const eventName = propName.slice(2).toLowerCase(); //取on后面事件名  小写
			mappingStrategy["event"](domNode, props[propName], eventName);
			continue;
		}

		if (typeNumber(mappingStrategy[propName]) === 5) {
			//mappingStrategy中存在对应function
			mappingStrategy[propName](domNode, props[propName]);
		}

		if (mappingStrategy[name] === void 2333) {
			//默认采用otherProps
			mappingStrategy["otherProps"](domNode, props[name], name);
		}
	}
};

//mapProps  策略对象
export const mappingStrategy = {
	event: function(domNode, cb, eventName) {
		let events = domNode.__events || {};
		events[eventName] = cb;
		domNode.__events = events;

		if (!registerdEvent[eventName]) {
			//所有事件只注册一次
			registerdEvent[eventName] = 1;

			if (specialHook[eventName]) {
				//特殊处理onChange
				specialHook[eventName](domNode);
			} else {
				addEvent(document, dispatchEvent, eventName);
			}
		}
	},
	clearEvents: function(domNode, eventCb, eventName) {
		let events = domNode.__events || {};
		events[eventName] = noop;
		domNode.__events = events; //用于triggerEventByPath中获取event
	},
	style: function(domNode, style) {
		//处理style
		if (style !== void 2333) {
			//style为对象
			Object.entries(style).forEach(name_value => {
				const styleName = name_value[0];
				const styleValue = name_value[1];
				domNode.style[styleName] = styleHelper(styleName, styleValue);
			});
		}
	},
	className: function(domNode, className) {
		if (className !== void 2333) {
			domNode.className = className;
		}
	},
	dangerouslySetInnerHTML: function(domNode, html) {
		const oldHtml = domNode.innerHTML;
		if (html.__html !== oldHtml) {
			domNode.innerHTML = html.__html;
		}
	},
	otherProps: function(domNode, prop, propName) {
		if (prop !== void 2333 || propName !== void 2333) {
			domNode[propName] = prop;
		}
	}
};

/**
 * 根据新老props更新DomNode
 * @param {Object} oldProps
 * @param {Object} newProps
 * @param {DomNode} hostNode
 */
export const updateProps = function(oldProps, newProps, hostNode) {
	//更新后props记录   除了children
	let restProps = {};

	for (let name in oldProps) {
		//修改原有属性
		if (name === "children") continue; //children单独处理

		if (oldProps[name] !== newProps[name]) {
			restProps[name] = newProps[name];
		}
	}

	//新增的原来没有的属性
	for (let newName in newProps) {
		if (oldProps[newName] === void 2333) {
			restProps[newName] = newProps[newName];
		}
	}
	mapProps(hostNode, restProps);
};
