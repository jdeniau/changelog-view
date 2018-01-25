# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [1.4.2] - 2018-01-25
### Changed
  * Fix issue when using npx changelog-view and postinstall script

## [1.4.1] - 2018-01-23
### Changed
  * Fix issue when bundling

## [1.4.0] - 2018-01-23 - YANKED
### Changed
  * Changed the output format, it now uses [ink](https://github.com/vadimdemedes/ink) for rendering and [ink-tab](https://github.com/jdeniau/ink-tab) for browsing.

## [1.3.2] - 2017-09-20
### Added
  * Assume that repository like "foo/bar" is "https://github.com/foo/bar.git"

## [1.3.1] - 2017-09-20
### Added
  * If README.md / HISTORY.md is empty, check the next solutions
  * Better output if no changelog found since version


## [1.3.0] - 2017-09-20
### Added
  * Search in development package for PHP/Composer projects


## [1.2.0] - 2017-09-15
### Added
  * Detect package informations from `composer.lock` file (for PHP projects).


## [1.1.0] - 2017-09-15
### Added
  * Detect package informations from node_modules `package.json` file.

## [1.0.0] - 2017-09-15
### Added
  * First official version of `changelog-view`
