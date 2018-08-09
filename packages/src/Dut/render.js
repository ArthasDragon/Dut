import { mapProps } from "./mapProps";
import { typeNumber } from "./utils";
import { catchError } from "./ErrorUtil";
import { Vnode } from "./createElement";
import { setRef } from "./refs";

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
 * @param {} instance  实现refs机制
 */
function DuyRender(Vnode, container, isUpdate, parentContext = {}, instance) {
	if (!Vnode) return;

	const { type, props = {} } = Vnode;

	const { children } = props;
	let domNode;
	const VnodeType = typeof type;

	//初始化react dom树节点
	if (VnodeType === "function") {
		domNode = renderComponent(Vnode, container, parentContext);
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
function renderComponent(Vnode, parentDomNode, parentContext) {
	const ComponentClass = Vnode.type;
	const { props, key, ref } = Vnode;

	const instance = new ComponentClass(props); //生成子类实例
	Vnode._instance = instance; //记录Vnode对应的实例

	//执行生命周期componentWillMount   出错则返回
	if (instance.componentWillMount) {
		const isCatched = catchError(instance, "componentWillMount", [Vnode]);
		if (isCatched) return;
	}

	let lastOwner = currentOwner.cur; //记录上个实例
	currentOwner.cur = instance; //存储当前实例  下面new Vnode操作时会自动当前实例为生成Vnode父实例

	let renderedVnode = catchError(instance, "render", [Vnode]); //执行render并记录生成的Vnode  有错误则提示
	const renderedType = typeNumber(renderedVnode);

	if (renderedType === 7) {
		//数组
		renderedVnode = mountChildren(renderedVnode, parentDomNode);
	}
	if (renderedType === 3 || renderedType === 4) {
		//string or number
		renderedVnode = new Vnode("#text", renderedVnode, null, null);
	}
	currentOwner.cur = lastOwner; //还原为当前Vnode父实例

	if (renderedVnode === void 2333) {
		return;
	}

	//renderedVnode  Vnode或者Vnode数组
	renderedVnode.key = key || null;
	instance.Vnode = renderedVnode; //Vnode-->_instance-->renderedVnode
	instance.Vnode._mountIndex = mountIndex++;

	//   Vnode.displayName = Component.name //以下这两行用于componentDidcatch
	//   instance.Vnode.return = Vnode //必须要在插入前设置return(父Vnode)给所有的Vnode.

	let domNode = null;
	//   if (renderedType !== 7) {
	domNode = DuyRender(
		renderedVnode,
		parentDomNode,
		false,
		instance.context,
		instance
	);
	// renderedVnode.displayName = Component.name;//记录名字
	//   } else {
	//     domNode = renderedVnode[0]._hostNode
	//   }

	// 挂载组件实例或者原生对应domNode
	setRef(Vnode, instance, domNode);

	Vnode._hostNode = domNode; //记录Vnode对应domNode
	instance.Vnode._hostNode = domNode; //用于在更新时期oldVnode的时候获取_hostNode

	// if (renderedVnode._PortalHostNode) {
	// 	//支持react createPortal
	// 	Vnode._PortalHostNode = renderedVnode._PortalHostNode
	// 	renderedVnode._PortalHostNode._PortalHostNode = domNode
	//   }

	instance._updateInLifeCycle(); // componentDidMount之后一次性更新
	return domNode;
}

export const ReactDOM = {
	render
};
