import { mapProps } from "./render";

export default class Component {
	constructor(props) {
		this.props = props;
		this.state = this.state || {};

		this.nextState = null; //用于更新
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
