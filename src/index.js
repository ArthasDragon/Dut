import React, { ReactDOM, Component } from "react";

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
					color: color[rand]
				});
			}.bind(this),
			1000
		);
	}
	state = {
		color: "red"
	};

	render() {
		return (
			<div
				style={{
					height: "100px",
					width: "100px",
					background: this.state.color
				}}
				className="I am FuckApp component"
			/>
		);
	}
}
console.log(
	<div
		style={{ background: "#eee", width: "100px", height: "100px" }}
		className="fuck"
	>
		111
		{/* <Test />
		<div style={{ width: "10px", height: "10px", background: "red" }} /> */}
	</div>
);

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
