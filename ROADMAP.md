# HAI3 Roadmap

## v0.1.0
- [x] ~~Implement basic version of Layout~~
- [x] ~~Introduce basic structure of UI Kit~~
- [x] ~~Implement basic data flow and state management~~
- [x] ~~Move UI Core and UI Kit to separate packages~~
- [x] ~~Migrate to flux architecture~~
- [x] ~~Navigation (application routing)~~
- [x] ~~Basic interaction with API~~
- [x] ~~Remove dependency of UI Core on UI Kit. Abstract UI Kit components. Implement UI Kit components registry.~~
- [ ] Support updating data on backend events
- [x] ~~Localization, incl. multi-language dict examples~~
- [ ] Role based access control
- [ ] Define and document data types for interfaces - Tenant, User incl. UI Flags
- [ ] UI styles polishing
- [ ] Add all shadcn components to UI Kit
- [x] ~~Demo page with all UI Kit elements and Styles annotations (e.g. this is 'primary', this is 'secondary', etc)~~
- [ ] Tests
- [ ] Electron build
- [ ] Develop HAI3-Samples in separate repository
- [x] ~~Implement screens lazy loading~~
- [x] ~~Implement per-screen i18n dictionaries lazy loading~~
- [x] ~~Support SSE protocol in api services~~
- [x] ~~Implement studio as a separate dev dependency~~

# Checks in arch:check script (called in CI)
- [x] ~~Circular dependencies~~
- [x] ~~HAI3 packages dependencies violations~~
- [x] ~~Flux architecture violations~~
- [x] ~~Unused imports and variables~~
- [x] ~~Clean build~~
- [ ] Hardcoded colors violations
