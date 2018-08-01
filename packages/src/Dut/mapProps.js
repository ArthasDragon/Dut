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
