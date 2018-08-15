import { catchError } from "./ErrorUtil";
import { currentOwner } from "./render";
import { update } from "./update";
import { Vnode } from "./createElement";

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

		if (this.lifeCycle === ComStatue.CREATE) {
			//组件挂载期
		} else {
			//组件更新期
			if (this.lifeCycle === ComStatue.UPDATING) {
				return;
			}

			if (this.lifeCycle === ComStatue.MOUNTTING) {
				//componentDidMount的时候调用setState
				this.stateMergeQueue.push(1); //stateMergeQueue中存在值时updateComponent中会进行组件更新
				return;
			}

			if (this.lifeCycle === ComStatue.CATCHING) {
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
		//记录更新前state   vnode   context
		const preState = this.state;
		const oldVnode = this.Vnode;
		const oldContext = this.context;

		//初始化更新后state
		this.nextState = this.state;

		//将_penddingState中存的state合成为一个新的state
		this._penddingState.forEach(item => {
			if (typeof item.partialNewState === "function") {
				this.nextState = Object.assign(
					{},
					this.nextState,
					item.partialNewState(this.nextState, this.props)
				);
			} else {
				this.nextState = Object.assign({}, this.state, item.partialNewState);
			}
		});

		//更新state
		if (this.nextState !== preState) {
			this.state = this.nextState;
		}

		//   if (this.getChildContext) {
		// 	this.context = extend(extend({}, this.context), this.getChildContext())
		//   }

		//触发生命周期  componentWillUpdate
		if (this.componentWillUpdate) {
			catchError(this, "componentWillUpdate", [
				this.props,
				this.nextState,
				this.context
			]);
		}

		let lastOwner = currentOwner.cur; //记录当前父级实例
		currentOwner.cur = this; //将此实例记录为当前实例  生成render中Vnode时  父级实例为当前实例
		this.nextState = null; //制空
		let newVnode = this.render(); //初始化render生成Vnode
		newVnode = newVnode ? newVnode : new Vnode("#text", "", null, null); //如render返回空则为空字符Vnode
		currentOwner.cur = lastOwner; //还原

		this.Vnode = update(oldVnode, newVnode, this.Vnode._hostNode, this.context); //更新  这个函数返回一个更新后的Vnode

		//触发componentDidUpdate
		if (this.componentDidUpdate) {
			catchError(this, "componentDidUpdate", [
				this.props,
				preState,
				oldContext
			]);
		}

		//统一调用所有setState时的callback
		this._penddingState.forEach(item => {
			if (typeof item.callback === "function") {
				item.callback(this.state, this.props);
			}
		});

		//置空
		this._penddingState = [];
	}
	_updateInLifeCycle() {
		//state队列中有值才进行更新
		if (this.stateMergeQueue.length > 0) {
			this.stateMergeQueue = [];
			this.updateComponent();
		}
	}

	//预定义生命周期函数和render
	componentWillReceiveProps() {}
	componentWillMount() {}
	componentDidMount() {}
	componentWillUnmount() {}
	componentDidUnmount() {}
	render() {}
}
