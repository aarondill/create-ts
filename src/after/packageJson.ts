export { setTypeModule };

// Types
import type { AfterHookOptions } from "create-create-app";
// Built-ins
import assert from "assert";
// Dependencies
import { execa } from "execa";

async function setTypeModule({
	answers: { typeModule },
	packageDir,
}: Readonly<Pick<AfterHookOptions, "answers" | "packageDir">>) {
	if (!typeModule) return;
	console.log("\nsetting type: module");

	try {
		await execa("npm", ["pkg", "set", "type=module"], {
			stdio: "inherit",
			cwd: packageDir,
		});
	} catch (e) {
		if (!(e instanceof Error)) e = Error(String(e));
		assert(e instanceof Error);
		console.error(
			"Oh No! Something went wrong setting type: module!\n" + e.message
		);
	}
}
