import { options } from "./utils";

/**
 *绑定事件
 * @param {Element} domNode   dom节点
 * @param {Function} fn  回调函数
 * @param {String} eventName  事件名
 */
export function addEvent(domNode, fn, eventName) {
	if (domNode.addEventListener) {
		domNode.addEventListener(eventName, fn, false);
	} else if (domNode.attachEvent) {
		domNode.attachEvent("on" + eventName, fn);
	}
}
export let registerdEvent = {}; //已注册事件

//特殊处理onChange
export const specialHook = {
	//react将text,textarea,password元素中的onChange事件当成onInput事件
	change: function(dom) {
		if (/text|password/.test(dom.type)) {
			addEvent(document, createHandle, "input");
		}
	}
};

export function createHandle(e) {
	dispatchEvent(e, "change");
}

/**
 * 事件调度
 * @param {event} event
 * @param {String} eventName
 * @param {domNode} end
 */
export function dispatchEvent(event, eventName, end) {
	const path = getEventPath(event, end);
	let E = new SyntheticEvent(event);
	options.async = true;
	if (eventName) {
		//自定义事件名才需要
		E.type = eventName;
	}

	triggerEventByPath(E, path); //触发event默认以冒泡形式
	options.async = false;
	for (let dirty in options.dirtyComponent) {
		options.dirtyComponent[dirty].updateComponent();
	}
	options.dirtyComponent = {}; //清空
}

/**
 * 触发event默认以冒泡形式
 * 冒泡：从里到外
 * 捕获：从外到里
 * @param {array} path
 */
function triggerEventByPath(e, path) {
	//记录事件类型
	const thisEvenType = e.type;

	//遍历所有注册过事件的domNode  判断注册事件中有和触发事件类型相同的  且回调为函数的触发
	for (let i = 0; i < path.length; i++) {
		const events = path[i].__events;
		for (let eventName in events) {
			let fn = events[eventName];
			e.currentTarget = path[i];
			if (typeof fn === "function" && thisEvenType === eventName) {
				fn.call(path[i], e); //触发回调函数默认以冒泡形式
			}
		}
	}
}

/**
 * 当触发event的时候，我们利用这个函数
 * 去寻找触发路径上有函数回调的路径
 * @param {event} event
 */
export function getEventPath(event, end) {
	let path = [];
	let pathEnd = end || document;
	let begin = event.target;

	//依次向上遍历父级dom  存在__events即绑定过事件则加入path
	while (1) {
		if (begin.__events) {
			path.push(begin);
		}
		begin = begin.parentNode; //迭代
		// if (begin && begin._PortalHostNode) {
		//   begin = begin._PortalHostNode
		// }
		if (!begin || begin === pathEnd) {
			break;
		}
	}
	return path;
}

/**事件合成，暂时这么写 */
export function SyntheticEvent(event) {
	if (event.nativeEvent) {
		//是否为原生事件
		return event;
	}

	//事件的属性赋值到该对象上
	for (var i in event) {
		if (!eventProto[i]) {
			this[i] = event[i];
		}
	}
	if (!this.target) {
		//兼容ie
		this.target = event.srcElement;
	}
	this.fixEvent();
	//记录时间戳
	this.timeStamp = new Date() - 0;
	this.nativeEvent = event;
}

let eventProto = (SyntheticEvent.prototype = {
	fixEvent: function fixEvent() {}, //留给以后扩展用
	preventDefault: function preventDefault() {
		var e = this.nativeEvent || {};
		e.returnValue = this.returnValue = false;
		if (e.preventDefault) {
			e.preventDefault();
		}
	},
	fixHooks: function fixHooks() {},
	stopPropagation: function stopPropagation() {
		//阻止冒泡
		var e = this.nativeEvent || {};
		e.cancelBubble = this._stopPropagation = true;
		if (e.stopPropagation) {
			e.stopPropagation();
		}
	},
	persist: function noop() {},
	stopImmediatePropagation: function stopImmediatePropagation() {
		this.stopPropagation();
		this.stopImmediate = true;
	},
	toString: function toString() {
		return "[object Event]";
	}
});
