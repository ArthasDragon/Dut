import { flattenChildren, Vnode } from "./createElement";
import { typeNumber, extend, options } from "./utils";
import { updateProps } from "./mapProps";
import { setRef } from "./refs";
import { ComStatus } from "./component";
import { catchError } from "./ErrorUtil";
import { currentOwner, DuyRender } from "./render";
import { disposeVnode } from "./dispose";

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
	oldChildren = oldChildren || [];
	newChildren = flattenChildren(newChildren); //扁平化newChild
	//非数组则转为数组
	if (!Array.isArray(oldChildren)) oldChildren = [oldChildren];
	if (!Array.isArray(newChildren)) newChildren = [newChildren];
	let oldLength = oldChildren.length,
		newLength = newChildren.length,
		oldStartIndex = 0,
		newStartIndex = 0,
		oldEndIndex = oldLength - 1,
		newEndIndex = newLength - 1,
		oldStartVnode = oldChildren[0],
		newStartVnode = newChildren[0],
		oldEndVnode = oldChildren[oldEndIndex],
		newEndVnode = newChildren[newEndIndex],
		hascode;

	//while oldChildren is empty, update every newChildren's item. return updated newChildren
	if (newLength >= 0 && !oldLength) {
		newChildren.forEach((newVnode, index) => {
			DuyRender(newVnode, parentDomNode, false, parentContext);
			//重新赋值更新后的Vnode
			newChildren[index] = newVnode;
		});
		return newChildren;
	}

	if (!newLength && oldLength >= 0) {
		oldChildren.forEach(oldVnode => {
			disposeVnode(oldVnode);
		});
		return newChildren[0];
	}

	oldChildren.forEach(oldVnode => {
		disposeVnode(oldVnode);
	});
	newChildren.forEach((newVnode, index) => {
		DuyRender(newVnode, parentDomNode, false, parentContext);
		//重新赋值更新后的Vnode
		newChildren[index] = newVnode;
	});
	return newChildren;
}

/**
 * 当我们更新组件的时候，并不需要重新创建一个组件，而是拿到旧的组件的props,state,context就可以进行重新render
 * 而且要注意的是，组件的更新并不需要比对或者交换state,因为组件的更新完全依靠外部的context和props
 * @param {Vnode} oldComponentVnode  老的孩子组件，_instance里面有着这个组件的实例
 * @param {Vnode} newComponentVnode  新的组件
 * @param {Object} parentContext  父亲context
 */
export function updateComponent(
	oldComponentVnode,
	newComponentVnode,
	parentContext
) {
	const { oldState, oldProps, oldContext, oldVnode } = instanceProps(
		oldComponentVnode
	);

	const newProps = newComponentVnode.props;
	let newContext = parentContext;
	let oldInstance = oldComponentVnode._instance;

	//更新props
	oldInstance.props = newProps;

	//Context
	if (oldInstance.getChildContext) {
		oldInstance.context = extend(
			extend({}, newContext),
			oldInstance.getChildContext()
		);
	} else {
		oldInstance.context = extend({}, newContext);
	}

	//更新生命周期   updating
	oldInstance.lifeCycle = ComStatus.UPDATING;

	if (oldInstance.componentWillReceiveProps) {
		catchError(oldInstance, "componentWillReceiveProps", [
			newProps,
			newContext
		]);
		let mergedState = oldInstance.state; //获取执行生命周期函数后的state

		//将instance中改变视图未更新的state合并到mergedState上
		oldInstance._penddingState.forEach(partialState => {
			mergedState = extend(
				extend({}, mergedState),
				partialState.partialNewState
			);
		});

		//更新state
		oldInstance.state = mergedState;
	}

	//shouldComponentUpdate
	if (oldInstance.shouldComponentUpdate) {
		let shouldUpdate = catchError(oldInstance, "shouldComponentUpdate", [
			newProps,
			oldState,
			newContext
		]);
		//shouldUpdate为false则不更新视图   数据已经更新
		if (!shouldUpdate) {
			return;
		}
	}

	//componentWillUpdate
	if (oldInstance.componentWillUpdate) {
		catchError(oldInstance, "componentWillUpdate", [
			newProps,
			oldState,
			newContext
		]);
	}

	//开始更新Vnode操作  记录当前owner
	let lastOwner = currentOwner.cur;
	currentOwner.cur = oldComponentVnode._instance;

	//取得更新props,context之后oldInstance 的render结果  不存在则取newVnode对应的新instance
	let newVnode = oldInstance.render
		? catchError(oldInstance, "render", [])
		: new newComponentVnode.type(newProps, newContext);

	//newVnode不存在则空字符Vnode
	newVnode = newVnode ? newVnode : new Vnode("#text", "", null, null); //用户有可能返回null，当返回null的时候使用一个空白dom代替

	//取得更新前内容Vnode
	let fixedOldVnode = oldVnode ? oldVnode : oldInstance;
	currentOwner.cur = lastOwner;

	//don't understand
	const willUpdate = options.dirtyComponent[oldInstance._uniqueId]; //因为用react-redux更新的时候，不然会重复更新.
	if (willUpdate) {
		//如果这个component正好是需要更新的component，那么则更新，然后就将他从map中删除
		//不然会重复更新
		delete options.dirtyComponent[oldInstance._uniqueId];
	}

	//更新dom,保存新的节点
	update(
		fixedOldVnode,
		newVnode,
		oldComponentVnode._hostNode,
		oldInstance.context
	);

	//更新_hostNode
	oldComponentVnode._hostNode = newVnode._hostNode;
	if (oldComponentVnode._instance.Vnode) {
		//更新React component的时候需要用新的完全更新旧的component，不然无法更新
		oldComponentVnode._instance.Vnode = newVnode;
	} else {
		oldComponentVnode._instance = newVnode;
	}

	//componentDidUpdate
	if (oldComponentVnode._instance) {
		if (oldComponentVnode._instance.componentDidUpdate) {
			catchError(oldComponentVnode._instance, "componentDidUpdate", [
				oldProps,
				oldState,
				oldContext
			]);
		}
		oldComponentVnode._instance.lifeCycle = ComStatus.UPDATED;
	}
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
			newVnode.props.children = updateChild(
				oldVnode.props.children,
				newVnode.props.children,
				oldVnode._hostNode,
				parentContext
			);
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

			updateComponent(oldVnode, newVnode, parentContext);

			newVnode.owner = oldVnode.owner;
			newVnode.ref = oldVnode.ref;
			newVnode.key = oldVnode.key;
			newVnode._instance = oldVnode._instance;
			newVnode._PortalHostNode = oldVnode._PortalHostNode
				? oldVnode._PortalHostNode
				: void 666;
		}
	}

	return newVnode;
}
