# Create Ts

Create a new TypeScript project in one easy step! No more installing packages and setting up boilerplate just to write some code!

> created by [create-create-app](https://github.com/uetchy/create-create-app).

## Usage

```bash
npm init @aarond309/create-ts <name>
# OR
npx @aarond309/ts <name>
```

Simply answer the quick questions, let it install DevDependencies and enjoy!

## Features included:

- Automatically create local git repo
- Optionally create Github repository (**Requires `gh` CLI**)
- Support for Jest, with built-in config
- Config file for eslint with TypeScript (optional root property)
- .gitignore with many popular files already listed. **Please Check Contents Before Committing!**
- .vscodeignore for easy configuration if creating vscode extensions. Feel free to remove in other cases.
- User-chosen License already included
- .tsconfig with strict mode activated
- Tsc outputs to ./dist from ./src
- Package.json with useful scripts already created
- File system setup with organized folders, along with index.ts and index.test.ts files
- Release-it included to allow easy releasing, with config file included. Run `npm run release` in your new project to create a release.
- No (regular) dependencies will be added to your project

## Notes:

- To allow Release-it to automatically create Github Releases, instead of _just_ tags, set the environment variable `RELEASE_IT_GITHUB_KEY` to a Github Token with proper authentication. [See more here](<https://github.com/release-it/release-it/blob/master/docs/github-releases.md#automated:~:text=Obtain%20a%20personal%20access%20token%20(release%2Dit%20only%20needs%20%22repo%22%20access%3B%20no%20%22admin%22%20or%20other%20scopes).>). Without this token, Release-it will fallback to a web browser with defaults filled in.
