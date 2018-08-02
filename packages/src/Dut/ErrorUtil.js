export function catchError(Instance, hookname, args) {
	try {
		if (Instance[hookname]) {
			let result = void 2333;
			if (hookname === "render") {
				result = Instance[hookname].apply(Instance); //render则不传入参数
			} else {
				result = Instance[hookname].apply(Instance, args);
			}
			return result;
		}
	} catch (e) {
		let Vnode;
		Vnode = Instance.Vnode;
		if (hookname === "render" || hookname === "componentWillMount") {
			//对render和componentWillMount进行特殊处理
			Vnode = args[0];
		}

		// if (hookname !== 'render') return true
	}
}
