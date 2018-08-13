import { flattenChildren } from "./createElement";
import { typeNumber } from "./utils";
import { updateProps } from "./mapProps";

/**
 * 更新文字节点
 * @param {Vnode} oldTextVnode
 * @param {Vnode} newTextVnode
 */
export function updateText(oldTextVnode, newTextVnode) {
	let dom = oldTextVnode._hostNode; //取到节点对应domNode
	if (oldTextVnode.props !== newTextVnode.props) {
		dom.nodeValue = newTextVnode.props; //改变dom中值
	}
}

/**
 * 更新children
 * @param {Array(Vnode)} oldChildren
 * @param {Array(Vnode)} newChildren
 * @param {DomNode} parentDomNode
 * @param {Object} parentContext
 */
export function updateChild(
	oldChildren = [],
	newChildren,
	parentDomNode,
	parentContext
) {
	newChildren = flattenChildren(newChildren); //扁平化newChild
	//非数组则转为数组
	if (!Array.isArray(oldChildren)) oldChildren = [oldChildren];
	if (!Array.isArray(newChildren)) newChildren = [newChildren];
	let oldLength = oldChildren.length,
		newLength = newChildren.length,
		oldStartIndex = 0;
}

export function updateComponent() {}

/**
 * 将oldVnode更新为newVnode
 * @param {Vnode} oldVnode
 * @param {Vnode} newVnode
 * @param {DomNode} parentDomNode
 * @param {Object} parentContext
 */
export function update(oldVnode, newVnode, parentDomNode, parentContext) {
	//newVnode没有render  还没有绑定_hostNode
	newVnode._hostNode = oldVnode._hostNode;

	if (oldVnode.type === newVnode.type) {
		if (typeNumber(oldVnode.type) === 4) {
			//string   原生节点   div,p ...
			updateProps(oldVnode.props, newVnode.props, newVnode._hostNode);
			return newVnode;
		}
	}
}
