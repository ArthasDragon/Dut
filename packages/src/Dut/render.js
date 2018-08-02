import { mapProps } from "./mapProps";
import { typeNumber } from "./utils";

let mountIndex = 0; //全局变量
let containerMap = {};

//记录父级组件
export let currentOwner = {
	cur: null
};

//将Vnode放进container中并返回Vnode对应的domNode
function render(Vnode, container) {
	if (typeNumber(container) !== 8) {
		throw new Error(`Target container is not a DOM element.`);
	}

	const UniqueKey = container.UniqueKey;
	if (container.UniqueKey) {
		//已经渲染过
	} else {
		//第一次渲染
		Vnode.isTop = true;
		container.UniqueKey = mountIndex++;
		containerMap[container.UniqueKey] = Vnode; //更新时Vnode记录
		DuyRender(Vnode, container); //将Vnode挂载到container上
		return Vnode._instance; //返回Vnode的实例
	}
}

/**
 *
 * @param {*} Vnode
 * @param {Element} container 要挂载到的dom节点
 * @param {Boolean} isUpdate  是否在更新中   在更新中则不进行挂载操作
 * @param {Boolean} instance  实现refs机制
 */
function DuyRender(Vnode, container, isUpdate, parentContext, instance) {
	if (!Vnode) return;

	const { type, props } = Vnode;

	if (!type) return;

	const { children } = props;
	let domNode;
	const VnodeType = typeof type;

	//初始化react dom树节点
	if (VnodeType === "function") {
		domNode = renderComponent(Vnode, container);
	}
	if (VnodeType === "string") {
		domNode = document.createElement(type);
	}

	//将props处理后加入domNode中
	mapProps(domNode, props);

	//将children挂载到domNode上
	children && mountChildren(children, domNode);

	//记录Vnode的domNode -----用于diff时改变自身dom
	Vnode._hostNode = domNode;

	//将处理后domNode加入html中
	container.appendChild(domNode);

	return domNode;
}

function mountChildren(children, parentNode) {
	if (children.length > 1) {
		children.forEach(child => DuyRender(child, parentNode));
	} else {
		DuyRender(children, parentNode);
	}
}

//将Component中renderVnode的domNode返回  并将renderVnode记录在Vnode节点下
function renderComponent(Vnode, container) {
	const ComponentClass = Vnode.type;
	const { props } = Vnode;

	//生成子类实例
	const instance = new ComponentClass(props);

	const renderVnode = instance.render();

	//记录实例的renderVnode
	instance.Vnode = renderVnode;

	//记录Vnode对应的实例
	Vnode._instance = instance;

	//返回renderVnode对应的domNode
	return DuyRender(renderVnode, container);
}

export const ReactDOM = {
	render
};
