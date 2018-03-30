Changelog view [![Build Status](https://travis-ci.org/jdeniau/changelog-view.svg?branch=master)](https://travis-ci.org/jdeniau/changelog-view)
===================

Tool view changelog in console. 

It list only the changes between the specified version and the latest version.
You can see it as a `git diff` between version for changelogs.

![demo](demo/demo.svg)

## Usage
With npx (require `npm >= 5.2`):
```sh
npx changelog-view <package@currentVersion> [<package@currentVersion> ...]
```

Example
```sh
npx changelog-view howardabrams/node-mocks-http@1.5.4 mapado/rest-client-js-sdk@2.0.0
```

If you don't have `npm >= 5.2` or if you prefer installing the package, you can install it with npm/yarn :
```sh
yarn install --dev changelog-view # yarn
# or
npm install (-g) changelog-view # npm
```
And then the binary will be located in `node_modules/.bin/changelog-view`

### In a JavaScript / PHP project ?
`changelog-view` tries to detect automatically the current version of your currently installed dependencies.

It works fine with `npm` / `yarn` for JavaScript projects, and with `composer` for PHP projects.

Imagine you have this package.json:
```json
{
  "dependencies": {
    "rest-client-sdk": "^1.0.0"
  }
}
```

The following command:
```sh
npx changelog-view rest-client-sdk
```

Will ouput:
```md
... other version
## [1.0.1] - 2017-07-03 - [YANKED]

### Changed

    * Make urijs implementation work again but might be breaking
    * Url constructor passed with noTransform = true for better perf and avoid potential bugs
```

Same for PHP if you do 
```sh
npx changelog-view behat/transliterator
```

Will output:
```md
# CHANGELOG for "Behat/Transliterator"


# 1.2.0 / 2017-04-04

    * Stop Transliterator::postProcessText() breaking words containing apostrophes
```

## Features
The package checks on github if a file named `CHANGELOG.md` or `HISTORY.md` is present.

If not, it tries to list the github releases.

It tries to parse the markdown files and filter only version greater than the specified version.

## Automatic langage / dependency management package detection

  * [x] [JavaScript] Automatically guess package informations from JavaScript projects
  * [x] [PHP] Automatically guess package informations from composer.lock
  * [ ] [Python] Automatically guess package informations from Pipfile.lock (help wanted, does not seems easy to gets the github url as it relies on pypi). Can eventually rely on `pip freeze` command but seems to be "the old way"
  * [ ] [Go] Automatically guess package informations from Gopkg.lock (help wanted, but maybe easy because dependencies seems to be only github links in Go)
  * [ ] [Ruby] Automatically guess package informations from Gemfile.lock (help wanted, I did not really understand the Gemfile.lock principle)
  * [ ] Other languages: feel free to contribute, I just listed languages that came to my mind :)
