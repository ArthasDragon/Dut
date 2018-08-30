import { flattenChildren } from "./createElement";
import { typeNumber } from "./utils";
import { updateProps } from "./mapProps";
import { setRef } from "./refs";

/**
 * 获取Vnode对应实例的信息
 * @param {Vnode} componentVnode
 */
function instanceProps(componentVnode) {
	return {
		oldState: componentVnode._instance.state,
		oldProps: componentVnode._instance.props,
		oldContext: componentVnode._instance.context,
		oldVnode: componentVnode._instance.Vnode
	};
}

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

/**
 *
 * @param {Vnode} oldVnode
 * @param {Vnode} newVnode
 * @param {Object} parentContext
 */
export function updateComponent(oldVnode, newVnode, parentContext) {
	const { oldState, oldProps, oldContext, oldVnode } = instanceProps(oldVnode);

	const newProps = newVnode.props;
	let newContext = parentContext;
	const instance = oldVnode._instance;
}

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
		//新老Vnode类型相同

		//text节点单独处理
		if (oldVnode.type === "#text") {
			newVnode._hostNode = oldVnode._hostNode; //更新一个dom节点
			updateText(oldVnode, newVnode);

			return newVnode;
		}

		//string   原生节点   div,p ...
		if (typeNumber(oldVnode.type) === 4) {
			updateProps(oldVnode.props, newVnode.props, newVnode._hostNode);

			//ref改变则重新将新ref置入owner
			if (oldVnode.ref !== newVnode.ref) {
				setRef(newVnode, oldVnode.owner, newVnode._hostNode);
			}

			//更新后的child，返回给组件
			// newVnode.props.children = updateChild(
			// 	oldVnode.props.children,
			// 	newVnode.props.children,
			// 	oldVnode._hostNode,
			// 	parentContext
			// );
		}

		//function   class
		if (typeNumber(oldVnode.type) === 5) {
			if (!oldVnode._instance.render) {
				//老的class  render中没有内容
				const { props } = newVnode;
				const newStateLessInstance = new newVnode.type(props, parentContext);
				//oldVnode instance的关联关系赋值给newVnode instance
				newStateLessInstance.owner = oldVnode._instance.owner;
				newStateLessInstance.ref = oldVnode._instance.ref;
				newStateLessInstance.key = oldVnode._instance.key;
				newVnode._instance = newStateLessInstance;
				return newVnode;
			}
		}
	}

	return newVnode;
}
