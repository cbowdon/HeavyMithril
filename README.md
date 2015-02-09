# Work in progress - stricter type definitions for Mithril

The current .d.ts in the wonderful [mithril.js](https://lhorie.github.io/mithril) uses 'any' a lot, due to the highly dynamic nature of Mithril. But 'any' denies us most of the benefits of static-typing, so this is an effort to replace usages of 'any' with generics, rest args, overloads, union types, etc.

## Separate repo
The output of this will be just the mithril.d.ts file, but I'm doing the actual work in this separate repo so I can test and generally make a mess.

## Validation
To test whether the stricter definitions are correct, I've ported the test suite to TypeScript by adding annotations and other non-functional changes. (I ported the test suite rather than Mithril itself because the tests cover the external API, which is all I'm concerned with.) I've also ported the todo-app example to TS for a more end-to-end test.

## Licensing
Defer to mithril.js
