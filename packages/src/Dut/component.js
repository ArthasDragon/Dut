import { mapProps } from "./mapProps";

//组件状态
export const ComStatue = {
	CREATE: 0, //创造节点
	MOUNT: 1, //节点已经挂载
	UPDATING: 2, //节点正在更新
	UPDATED: 3, //节点已经更新
	MOUNTTING: 4 //节点正在挂载,
	//   CATCHING: 5
};

let uniqueId = 0; //组件的id  不重复

export default class Component {
	constructor(props, context) {
		this.props = props;
		this.state = this.state || {};
		this.context = context;

		this.nextState = null; //用于更新
		this.lifeCycle = ComStatue.CREATE; //组件生命周期
		this.refs = {}; //组件对应dom节点
		this._uniqueId = uniqueId++; //组件唯一id
		this._penddingState = []; //状态存储   存储每一次setState  更新组件时一起合并触发
		this.stateMergeQueue = [];
	}

	setState(nState) {
		const preState = this.state; //保存更新之前的state
		const oldVnode = this.Vnode; //更新前的Vnode   用于diff

		this.nextState = { ...preState, ...nState }; //更新后的state
		this.state = this.nextState;
		const newVnode = this.render(); //state改变后的Vnode

		this.updateComponent(this, oldVnode, newVnode);
	}

	updateComponent(instance, oldVnode, newVnode) {
		if (oldVnode.type === newVnode.type) {
			mapProps(oldVnode._hostNode, newVnode.props);
		} else {
			//remove
		}
	}

	render() {}
}
