# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [0.4.0](https://github.com/GlCap/week-ranger/compare/v0.3.1...v0.4.0) (2021-04-27)

### Features

- addd Time.sub method ([bfc465a](https://github.com/GlCap/week-ranger/commit/bfc465ac3fa626f6de7338b487f612b884a46613))
- reworked Time ([847007a](https://github.com/GlCap/week-ranger/commit/847007abb0f92d53ca58d95bff7c405a0423c7d2))

### [0.3.1](https://github.com/GlCap/week-ranger/compare/v0.3.0...v0.3.1) (2021-04-26)

### Bug Fixes

- missing module exports ([ff988cd](https://github.com/GlCap/week-ranger/commit/ff988cd8a3bdf18f459293a6d4ac17ab265363d5))

## [0.3.0](https://github.com/GlCap/week-ranger/compare/v0.2.6...v0.3.0) (2021-04-26)

### Features

- add TimeRangeChain, rename Range to TimeRangeChain, rework Day ([de2ff2b](https://github.com/GlCap/week-ranger/commit/de2ff2bf120d526e8e6c4db90e6c4c56a5637c3e))
- split Day, implemented DatedDay, renamed TimeRangeChain to RangeSerie ([27c6613](https://github.com/GlCap/week-ranger/commit/27c66138fc8eb9a77c1450512c740c0003c2dccf))

### [0.2.6](https://github.com/GlCap/week-ranger/compare/v0.2.5...v0.2.6) (2021-04-23)

### [0.2.5](https://github.com/GlCap/week-ranger/compare/v0.2.4...v0.2.5) (2021-04-15)

### Features

- add browser compatibilty ([8c4f622](https://github.com/GlCap/week-ranger/commit/8c4f6222152bfe0a9b1214a4c7c5d26141604872))

### [0.2.4](https://github.com/GlCap/week-ranger/compare/v0.2.3...v0.2.4) (2021-04-14)

### Features

- add WeekParsable and DayParsable to allow parsing partial objects ([18c37f1](https://github.com/GlCap/week-ranger/commit/18c37f19dd527b98614787c7a242e95538ab6798))

### [0.2.3](https://github.com/GlCap/week-ranger/compare/v0.2.2...v0.2.3) (2021-04-13)

### Features

- add getDayStartDate and getDayEndDate methods to Day ([143e411](https://github.com/GlCap/week-ranger/commit/143e411a5abd2ba003968bb8f8000c1a8e73c13a))

### [0.2.2](https://github.com/GlCap/week-ranger/compare/v0.2.1...v0.2.2) (2021-04-13)

### Features

- add Date reference to Day ([e0ac684](https://github.com/GlCap/week-ranger/commit/e0ac6849066f5219058e5b947a9d42c90c2532e1))
- improved error handling ([5a174d4](https://github.com/GlCap/week-ranger/commit/5a174d47e0f1069742b0117a1fb10fd90d8ffc6d))

### Bug Fixes

- imroved Day.contains overload type ([a07b2d4](https://github.com/GlCap/week-ranger/commit/a07b2d4a8076b4da1601ccf0ac4093bfadebacc9))

### [0.2.1](https://github.com/GlCap/week-ranger/compare/v0.2.0...v0.2.1) (2021-04-12)

### Features

- add Range.contains overload, return the Range if extract is set to true ([0b7ae76](https://github.com/GlCap/week-ranger/commit/0b7ae76659974ad35a5de0bff80c9ba27532f892))

## [0.2.0](https://github.com/GlCap/week-ranger/compare/v0.1.0...v0.2.0) (2021-04-08)

### ⚠ BREAKING CHANGES

- converted Week.today() to getter
- renamed Range.isWithin no Range.contains

### Features

- add Day first and last getters ([51268b7](https://github.com/GlCap/week-ranger/commit/51268b7c5af29e0328cb4ed0dbc99aee2d3499d1))
- add Day.contains ([85253aa](https://github.com/GlCap/week-ranger/commit/85253aa6c72c96d0708970c446337f92712969fe))
- add Day.size getter ([ecebdf4](https://github.com/GlCap/week-ranger/commit/ecebdf4c05cd8d072234902b868ad3d44c400338))
- add Day.toDate ([98e3df4](https://github.com/GlCap/week-ranger/commit/98e3df45c18f8aa6d24655c9852c0e5f9dbd7b75))
- add Week.toTuple method ([0e52aad](https://github.com/GlCap/week-ranger/commit/0e52aad9c5bf3552cdb3d35a8b7a5f6ae1053b82))
- removed Range.isWithin overload ([dae1f14](https://github.com/GlCap/week-ranger/commit/dae1f14571d3b71993eaa9da1bc5db52f200bab3))
- renamed Range.isWithin no Range.contains ([b7afbf0](https://github.com/GlCap/week-ranger/commit/b7afbf013262733e389ad5dfa08a01ae7942bfdd))

- converted Week.today() to getter ([e8e3b0f](https://github.com/GlCap/week-ranger/commit/e8e3b0f04ce56b4a71b04afaa56fc31dddff73c3))

## [0.1.0](https://github.com/GlCap/week-ranger/compare/v0.1.0-alpha.4-1...v0.1.0) (2021-04-08)

### Features

- added Range.isWithin ([5119d42](https://github.com/GlCap/week-ranger/commit/5119d429ff28e34f53edf8591ac008dd2bfa8003))
- use same Date day week numbers, allow skipping days by passing empty line ([b3cf8e5](https://github.com/GlCap/week-ranger/commit/b3cf8e5bf3050e2a81f4f6ed4393cb1832c1e82b))

## [0.1.0-alpha.4-1](https://github.com/GlCap/week-ranger/compare/v0.1.0-alpha.4...v0.1.0-alpha.4-1) (2021-04-07)

## [0.1.0-alpha.4](https://github.com/GlCap/week-ranger/compare/v0.1.0-alpha.3...v0.1.0-alpha.4) (2021-04-07)

### Features

- add Day.slottable static method ([7d3c27d](https://github.com/GlCap/week-ranger/commit/7d3c27da7da93cdf92991cc412c6e3bca51f39dd))
- add Range duration method ([09a90ab](https://github.com/GlCap/week-ranger/commit/09a90ab6a4d1abf97c999dd0abb4ad5ea7f9e346))
- add Time.now static method ([9cb0563](https://github.com/GlCap/week-ranger/commit/9cb0563c4ea48751e5c8080330d6ab559ded904b))
- added Time.add method ([cb93f36](https://github.com/GlCap/week-ranger/commit/cb93f36308708e1b6b8a8700525fe4660c7f7725))
- added Week and Day overloads ([e0e6764](https://github.com/GlCap/week-ranger/commit/e0e67646bb2a1b3ffee59b63576f9cf7d9cc9a7d))
- converted Range.duration to get method, added Range constructor overloads ([9943d83](https://github.com/GlCap/week-ranger/commit/9943d838d4b2bd3fa01d4c0bf3dd6ecce66db007))
- create Day from a mixed Range array ([0420dcc](https://github.com/GlCap/week-ranger/commit/0420dcc3580282701198a667b762906ab2064775))
- create Day from Range array ([b63ba9f](https://github.com/GlCap/week-ranger/commit/b63ba9f230de21f50dc81f31a4b4d60f679be3dc))
- improved Day set and delete, add has and replace ([3b5014d](https://github.com/GlCap/week-ranger/commit/3b5014db2e808e03878b2900dfdabf3522dd0059))

### Bug Fixes

- missign tslib in dependencies ([58a1c22](https://github.com/GlCap/week-ranger/commit/58a1c226222193d0f2796741cf7ddc3a4b17a66c))
- use same sort function for parsing and serializing to json ([db616f4](https://github.com/GlCap/week-ranger/commit/db616f4933b415faafbe9ae0427d3a4351ace423))

## [0.1.0-alpha.3](https://github.com/GlCap/week-ranger/compare/v0.1.0-alpha.2...v0.1.0-alpha.3) (2021-04-06)

### Features

- check time numeric values ([7bf9476](https://github.com/GlCap/week-ranger/commit/7bf94762f565ae12143bdcbed95137a82fdcb9e2))
- reworked Day class ([7971f2a](https://github.com/GlCap/week-ranger/commit/7971f2a3c305b78b51fabde28ae9c1b0ae52262e))

### Bug Fixes

- time toString and toDate method fixes ([9f88e5d](https://github.com/GlCap/week-ranger/commit/9f88e5db067184cc8de425f18912d474406ded7f))

## [0.1.0-alpha.2](https://github.com/GlCap/week-ranger/compare/v0.1.0-alpha.1...v0.1.0-alpha.2) (2021-04-06)

## 0.1.0-alpha.1 (2021-04-02)

### Features

- base implementation ([dae4542](https://github.com/GlCap/week-ranger/commit/dae454231ba2a7a0f4d027e8eadf12b7d718551a))
- class rework, errors, compare methods ([409d782](https://github.com/GlCap/week-ranger/commit/409d78295f7910eb9128e919a23fed0f7d37e656))
