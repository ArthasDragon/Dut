import babel from "rollup-plugin-babel";
import filesize from "rollup-plugin-filesize";
import cleanup from "rollup-plugin-cleanup";
import license from "rollup-plugin-license";

export default {
	input: "./packages/src/Dut/index.js",
	output: {
		strict: false,
		format: "cjs",
		exports: "default",
		file: "./dist/Dut.js",
		name: "Dut"
	},
	plugins: [
		babel(),

		license({
			banner: `by 暗影舞者 Copyright ${JSON.stringify(new Date()).replace(
				/T.*|"/g,
				""
			)}
      `
		}),
		cleanup(),

		filesize()
	]
};
