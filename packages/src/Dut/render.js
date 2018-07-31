export const mapProps = function(domNode, props, Vnode) {
	if (Vnode && typeof Vnode.type === "function") {
		//如果是组件，则不要map他的props进来
		return;
	}

	for (let propsName in props) {
		if (propsName === "children") continue; //children单独处理

		//对style属性进行处理
		if (propsName === "style") {
			let style = props["style"];

			Object.keys(style).forEach(styleName => {
				domNode.style[styleName] = style[styleName];
			});
			continue;
		}
		domNode[propsName] = props[propsName];
	}
};

//将Vnode放进container中并返回Vnode对应的domNode
function render(Vnode, container) {
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
	mountChildren(children, domNode);

	//记录Vnode的domNode -----用于diff时改变自身dom
	Vnode._hostNode = domNode;

	//将处理后domNode加入html中
	container.appendChild(domNode);

	return domNode;
}

function mountChildren(children, parentNode) {
	if (children.length > 1) {
		children.forEach(child => render(child, parentNode));
	} else {
		render(children, parentNode);
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

	//返回renderVnode对应的domNode
	return render(renderVnode, container);
}

export const ReactDOM = {
	render
};
