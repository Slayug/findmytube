# Node.js TypeScript Template

[![Package Version][package-image]][package-url]
[![Open Issues][issues-image]][issues-url]
[![Build Status][build-image]][build-url]
[![Coverage Status][coverage-image]][coverage-url]
[![Dependencies Status][dependencies-image]][dependencies-url]
[![Dev Dependencies Status][dev-dependencies-image]][dev-dependencies-url]
[![Commitizen Friendly][commitizen-image]][commitizen-url]

A complete Node.js project template using TypeScript and following general best practices.  It allows you to skip the tedious details for the following:

* Adding and configuring TypeScript support.
* Enabling TypeScript linting.
* Setting up unit tests and code coverage reports.
* Creating an NPM package for your project.
* Managing ignored files for Git and NPM.

Once you've enabled CI, test coverage, and dependency reports for your project, this README.md file shows how to add the badges shown above.  This project template even enables automated changelog generation as long as you follow [Conventional Commits](https://conventionalcommits.org), which is made simple through the included [Commitizen CLI](http://commitizen.github.io/cz-cli/).

## Contents

* [Project Creation](#project-creation)
* [Rebranding](#rebranding)
* [Managing Your Project](#managing-your-project)
    * [Initial Publish](#initial-publish)
    * [Recommended Development Workflow](#recommended-development-workflow)
    * [Publishing to NPMJS](#publishing-to-npmjs)
* [Contributing](#contributing)

## Project Creation

Clone this repo into the directory you want to use for your new project, delete the Git history, and then reinit as a fresh Git repo:

```bash
$ git clone https://github.com/chriswells0/node-typescript-template.git <your project directory>
$ cd <your project directory>
$ rm -rf ./.git/
$ git init
$ npm install
```

## Rebranding

It's a common practice to prefix the source code project name with `node-` to make it clear on GitHub that it's a Node.js project while omitting that prefix in the NPM project since it's understood on npmjs.com.  Thus, the order of these replacements matter.

Be sure to check both [GitHub](https://github.com) and [NPMJS](https://www.npmjs.com) to be sure your project name isn't taken before starting!

Use exact searches to perform the following replacements throughout this project for the most efficient rebranding process:

1. Replace my name with yours: `Chris Wells`
2. Replace my website URL with yours: `https://chriswells.io`
3. Replace my *GitHub* username and project name with yours: `chriswells0/node-typescript-template`
4. Replace my *NPM* project name with yours: `typescript-template`
5. Update [package.json](package.json):
	* Change `description` to suit your project.
	* Update the `keywords` list.
	* In the `author` section, add `email` if you want to include yours.
6. If you prefer something other than the [BSD 3-Clause License](https://opensource.org/licenses/BSD-3-Clause), replace the entire contents of [LICENSE](LICENSE) as appropriate.
7. Update this README.md file to describe your project.

## Managing Your Project

Before committing to a project based on this template, it's recommended that you read about [Conventional Commits](https://conventionalcommits.org) and install [Commitizen CLI](http://commitizen.github.io/cz-cli/) globally.

### Initial Publish

Some additional steps need to be performed for a new project.  Specifically, you'll need to:

1. Create your project on GitHub (do not add a README, .gitignore, or license).
2. Add the initial files to the repo:
```bash
$ git add .
$ git cz
$ git remote add origin git@github.com:<your GitHub username>/<your project name>
$ git push -u origin master
```
3. Create accounts on the following sites and add your new GitHub project to them.  The project is preconfigured, so it should "just work" with these tools.
	* [Travis CI](https://travis-ci.org) for continuous integration.
	* [Coveralls](https://coveralls.io) for unit test coverage verification.
4. Manually trigger a Travis CI build and wait for it to complete.
5. Publish your package to NPMJS: `npm publish`

### Development Workflow

These steps need to be performed whenever you make changes:

0. Write awesome code in the `src` directory.
1. Build (clean, lint, and transpile): `npm run build`
2. Create unit tests in the `test` directory.  If your code is not awesome, you may have to fix some things here.
3. Verify code coverage: `npm run cover:check`
4. Commit your changes using `git add` and `git cz`
5. Push to GitHub using `git push` and wait for the CI builds to complete.  Again, success depends upon the awesomeness of your code.

### NPMJS Updates

Follow these steps to update your NPM package:

0. Perform all development workflow steps including pushing to GitHub in order to verify the CI builds.  You don't want to publish a broken package!
1. Check to see if this qualifies as a major, minor, or patch release: `npm run changelog:unreleased`
2. Bump the NPM version following [Semantic Versioning](https://semver.org) by using **one** of these approaches:
	* Specify major, minor, or patch and let NPM bump it: `npm version [major | minor | patch] -m "chore(release): Bump version to %s."`
	* Explicitly provide the version number such as 1.0.0: `npm version 1.0.0 -m "chore(release): Bump version to %s."`
3. The push to GitHub is automated, so wait for the CI builds to finish.
4. Publish the new version to NPMJS: `npm publish`

## Contributing

This section is here as a reminder for you to explain to your users how to contribute to the projects you create from this template.

[project-url]: https://github.com/chriswells0/node-typescript-template
[package-image]: https://badge.fury.io/js/typescript-template.svg
[package-url]: https://badge.fury.io/js/typescript-template
[issues-image]: https://img.shields.io/github/issues/chriswells0/node-typescript-template.svg?style=popout
[issues-url]: https://github.com/chriswells0/node-typescript-template/issues
[build-image]: https://travis-ci.org/chriswells0/node-typescript-template.svg?branch=master
[build-url]: https://travis-ci.org/chriswells0/node-typescript-template
[coverage-image]: https://coveralls.io/repos/github/chriswells0/node-typescript-template/badge.svg?branch=master
[coverage-url]: https://coveralls.io/github/chriswells0/node-typescript-template?branch=master
[dependencies-image]: https://david-dm.org/chriswells0/node-typescript-template/status.svg
[dependencies-url]: https://david-dm.org/chriswells0/node-typescript-template
[dev-dependencies-image]: https://david-dm.org/chriswells0/node-typescript-template/dev-status.svg
[dev-dependencies-url]: https://david-dm.org/chriswells0/node-typescript-template?type=dev
[commitizen-image]: https://img.shields.io/badge/commitizen-friendly-brightgreen.svg
[commitizen-url]: http://commitizen.github.io/cz-cli
