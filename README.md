# Work in progress
## Stricter type definitions for Mithril

The current .d.ts uses 'any' a lot, due to the dynamic nature of Mithril. But 'any' denies us most of the benefits of static-typing, so I'm working to eliminate it. To test whether the stricter definitions are correct, I've ported the test suite to TypeScript by adding annotations and other non-functional changes. (I ported the test suite rather than Mithril itself because the tests cover the external API, which is all I'm concerned with.)

## Licensing
This repository includes Mithril code (MIT license).
