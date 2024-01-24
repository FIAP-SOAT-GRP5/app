/* v8 ignore start */
module.exports = {
	default: [
		"--require-module ts-node/register",
		"--require ./test/steps/**/*.ts",
		"test/features/**/*.feature"
	].join(" "),
};
/* v8 ignore stop */
