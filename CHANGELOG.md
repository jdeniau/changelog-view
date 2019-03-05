# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [1.8.2] - 2019-03-05

Use ink and ink-tab 2

## [1.8.1] - 2018-05-17

No changes

## [1.8.0] - 2018-05-17

### Changed

* Upgrade lots of dependencies, but mainly ink-tab to 1.2 (and ink to 0.5)
* Fix an issue when no changelog was found
* Verbose mode is more verbose no help debbuging

## [1.7.0] - 2018-04-05

### Added

* added current version of changelog-view when calling cli with `--help` option

## [1.6.0] - 2018-04-05

### Added

* add `--verbose` option to display debug informations

## [1.5.1] - 2018-04-02

### Changed

* Update README.md file to match current version

## [1.5.0] - 2018-03-16

### Changed

* Use ink-tab 1.1.0, allow to navigate with tab and fixes an issue

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
