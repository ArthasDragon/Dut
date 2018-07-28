import React, { ReactDOM, Component } from "react";

class Test extends Component {
	render() {
		return <div>haha</div>;
	}
}

console.log(<Test />);

ReactDOM.render(
	<div
		style={{ background: "#eee", width: "100px", height: "100px" }}
		className="fuck"
	>
		<div style={{ width: "10px", height: "10px", background: "red" }} />
	</div>,
	document.getElementById("root")
);
console.log(2322232332332);
