import type { Option } from "create-create-app";
import { eslintEnvironments, eslintOpinionated, eslintRoot } from "./eslint.js";
import { githubVisibility } from "./github.js";
import { typeModule } from "./packageJson.js";

const questions: Option = {
	eslintOpinionated,
	eslintRoot,
	eslintEnvironments,
	typeModule,
	// GH Repo if installed
	githubVisibility,
};

export { questions };
