import React, { ReactDOM, Component } from "react";

class FirstChild extends Component {
	render() {
		return <div>{this.props.content ? 1111 : 2222}</div>;
	}
}

class Test extends Component {
	constructor(props) {
		super(props);
		setInterval(
			function() {
				const color = [
					"#eee",
					"black",
					"red",
					"green",
					"blue",
					"grey",
					"#133234",
					"#123213",
					"#222345",
					"#998232"
				];
				const rand = parseInt(Math.min(10, Math.random() * 10));
				this.setState({
					color: color[rand],
					isFirst: !this.state.isFirst
				});
			}.bind(this),
			5000
		);
	}
	state = {
		color: "red",
		isFirst: true
	};

	render() {
		return <FirstChild content={this.state.isFirst} />;
	}
}

ReactDOM.render(
	<div
		style={{ background: "#eee", width: "100px", height: "100px" }}
		className="fuck"
	>
		111
		<Test />
		<div style={{ width: "10px", height: "10px", background: "red" }} />
	</div>,
	document.getElementById("root")
);
