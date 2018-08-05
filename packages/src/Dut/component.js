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
		this.stateMergeQueue = []; //存储是否应该更新state的信息
	}

	/**
	 * setState时不进行更新   事件之后一起更新  先缓存到_peddingState中
	 * @param {Function | Object} partialNewState    部分新state
	 * @param {Function} callback     回调
	 */
	setState(partialNewState, callback) {
		this._penddingState.push({ partialNewState, callback });

		//生命周期判断组件是否需要更新
		// if (this.shouldComponentUpdate) {
		// 	let shouldUpdate = this.shouldComponentUpdate(this.props, this.nextState, this.context)
		// 	if (!shouldUpdate) {
		// 	  return
		// 	}
		//   }

		if (this.lifeCycle === Com.CREATE) {
			//组件挂载期
		} else {
			//组件更新期
			if (this.lifeCycle === Com.UPDATING) {
				return;
			}

			if (this.lifeCycle === Com.MOUNTTING) {
				//componentDidMount的时候调用setState
				this.stateMergeQueue.push(1); //stateMergeQueue中存在值时updateComponent中会进行组件更新
				return;
			}

			if (this.lifeCycle === Com.CATCHING) {
				//componentDidMount的时候调用setState
				this.stateMergeQueue.push(1);
				return;
			}

			//   if (options.async === true) {
			//     //事件中调用
			//     let dirty = options.dirtyComponent[this._uniqueId];
			//     if (!dirty) {
			//       options.dirtyComponent[this._uniqueId] = this;
			//     }
			//     return;
			//   }

			//不在生命周期中调用，有可能是异步调用
			this.updateComponent();
		}
	}

	updateComponent() {
		const preState = this.state;
		const oldVnode = this.Vnode;
		const oldContext = this.context;

		this.nextState = this.state;
	}
	_updateInLifeCycle() {}

	//预定义生命周期函数和render
	componentWillReceiveProps() {}
	componentWillMount() {}
	componentDidMount() {}
	componentWillUnmount() {}
	componentDidUnmount() {}
	render() {}
}
