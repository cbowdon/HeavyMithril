# Work in progress
## Stricter type definitions for Mithril

The current .d.ts uses 'any' a lot, due to the dynamic nature of Mithril. But 'any' denies us most of the benefits of static-typing, so I'm working to eliminate it. To test whether the stricter definitions are correct, I've ported the test suite to TypeScript by adding annotations and other non-functional changes.

## Licensing
This repository includes Mithril code (MIT license).
