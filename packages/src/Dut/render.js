function mapProps(domNode, props) {
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
}

function render(Vnode, container) {
	if (!Vnode) return;

	const { type, props } = Vnode;

	if (!type) return;

	const { children } = props;

	//初始化react dom树节点
	let domNode = document.createElement(type);

	//将props处理后加入domNode中
	mapProps(domNode, props);

	//将children挂载到domNode上
	mountChildren(children, domNode);

	//将处理后domNode加入html中
	container.appendChild(domNode);
}

function mountChildren(children, domNode) {
	render(children, domNode);
}

export const ReactDOM = {
	render
};
