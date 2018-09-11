import { typeNumber } from "./utils";

/**
 * 挂载组件实例或者原生对应domNode
 * Vnode.ref----function时执行ref   参数为实例或domNode
 * @param {Vnode} Vnode     //Vnode
 * @param {Component} instance  //Vnode._instance Vnode对应实例  或者Vnode.owner
 * @param {domNode} domNode
 */
export function setRef(Vnode, instance, domNode) {
	if (instance) {
		const refType = typeNumber(Vnode.ref);
		if (refStrategy[refType]) {
			refStrategy[refType](Vnode, Vnode.owner, domNode);
		}
	}
}

//ref处理策略  string or number时挂载domNode或者实例    function时执行ref  参数为实例或者domNode
const refStrategy = {
	3: function(Vnode, instance, domNode) {
		if (Vnode._instance) {
			//Vnode为组件  ref挂载对应实例
			instance.refs[Vnode.ref] = Vnode._instance;
		} else {
			//Vnode为原生   挂载对应domNode
			instance.refs[Vnode.ref] = domNode;
		}
	},
	4: function(Vnode, instance, domNode) {
		refStrategy[3](Vnode, instance, domNode);
	},
	5: function(Vnode, instance, domNode) {
		if (Vnode._instance) {
			Vnode.ref(Vnode._instance);
		} else {
			Vnode.ref(domNode);
		}
	}
};

export function clearRefs(refs) {
	if (typeof refs === "function") {
		refs(null);
	} else {
		for (let refName in refs) {
			refs[refName] = null;
		}
	}
}
