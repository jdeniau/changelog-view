Changelog view
===================

Tool view changelog in console. 

It list only the changes between the specified version and the latest version.
You can see it as a `git diff` between version for changelogs.

## Installation
Yarn
```sh
yarn install --dev changelog-view
```
npm 
```sh
npm install (-g) changelog-view
```

or you can use `npx` to automatically run the program

## Usage
yarn / npm:
```sh
changelog-view <package@currentVersion> [<package@currentVersion> ...]

```
With npx:
```sh
npx changelog-view <package@currentVersion> [<package@currentVersion> ...]
```

Example
```sh
changelog-view howardabrams/node-mocks-http@1.5.4 mapado/rest-client-js-sdk@0.14.1
```

### Features
The package checks on github if a file named `CHANGELOG.md` or `HISTORY.md` is present.

If not, it tries to list the github releases.

It tries to parse the markdown files and filter only version greater than the specified version.

### To be done

  * [] read yarn / npm / composer lockfiles to guess the package url
  * [] read yarn / npm / composer lockfiles to guess the current version
