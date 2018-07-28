export default class Component {
	constructor(props) {
		this.props = props;
		this.state = this.state || {};

		this.nextState = null; //用于更新
	}

	setState(nState) {}

	render() {}
}
