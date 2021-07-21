# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.1.3] - Improvements after users review

### Change

- `feature` Show 'loading event' message.

## [0.1.2] - Restructuring app

### Add

- `feature` Add stories & alerted-notice panel to home.
- `feature` Default entity for users, and capacity to create events directly.
- `feature` Add place to base items (and event schedules).
- `feature` Add audition module for cheking login of users.
- `feature` Add event-creation audit at profile.
- `feature` Add faq module.
- `feature` Add social buttons.
- `style` Create new logo icon (developed by Edu).
- `style` Improve styles of event+notices at home page.
- `code` Create directive for roles.
- `security` Add audit by settings.

### Change

- Add page folder (for about, home, admin... pages).
- Add features folder (for events, places, entities...).
- Move interceptors, models and auth to core instead of shared.
- Change title: "Agenda Rinconera" instead of "info-rincon".
- Create login as isolated module.
- Create palette from [mycolor.space](https://mycolor.space/?hex=%23003A59&sub=1): Small Switch Palette.
    - #003A59
    - #DEEEEC
    - #3E8B82
- `business` Delete censor as role.

### Fixed

- Show side-menu just with logged user.
- `performance` Add unsubscription in onDestroy event.

## [0.1.1] - Alerted Notice

### Add

- Alerted notice will appeared as a modal at home component.
- Add links module, for using instead of news module.
- Add Calendar page for weeky and diary view.

### Fixed

- Improve views for small devices.
- Add views for medium devices.

### Change

- Refactor stylesheets and add one for dialogs.
- Add loading component with interceptor.
- Diary view shown as default at home page.
- Change buttons (mat-raised for mat-fab).

## [0.0.10] - 2021-03-11 Styling - Presentación al Ayuntamiento

### Add

- Add +Event at toolbar.

### Change

- Change icons in admin dashboard.

### Fix

- Fix problems with notices and news.

## [0.0.9] - 2021-02-27 Improving CI

### Add

- Add [Travis CI](https://medium.com/angular-chile/integraci%C3%B3n-continua-angular-github-firebase-travis-ci-a1a8946d471a).
- Add tabs in UserView and profile component for audit and entities.

### Changed

- Change user, entity and place views.

## [0.0.8] - 2021-02-21 Evolve Cloud Functions

### Fixed

- Add ssr-folder (dist/info-rincon) to git repository.

## [0.0.7] - 2021-02-17

### Added

- Create [Log Service](https://www.codemag.com/Article/1711021/Logging-in-Angular-Applications). Todo: publish in other place than console.

### Changed

- Change icons and add icon for IOS.

## [0.0.6] - 2021-02-16

### Added

- Changelog file [keepachangelog](https://keepachangelog.com/es-ES/1.0.0/).

### Changed

- Migrate from TSLint and Codelyzer to [ESLint](https://github.com/angular-eslint/angular-eslint#readme).

## [0.0.5] - 2021-02-12

### Added

- Create audit for login.
- Add error-404 page.
- Add seo to event page.

## [0.0.4] - 2021-02-10

### Fixed

- Improve entities-user relationship.
- Improve event services with firestore

## [0.0.3] - 2021-02-07

### Fixed

- Fix lazy-loading+firebase SSR problem (home module is not lazy-loading).
- Fix authorization issues with provider.

## [0.0.2] - 2021-02-06 Structure from previus project

### Added

- Divide style-sheets.
- Create feature modules (user, admin, entity, place, news and advices).
- Create shared modules (shared and material).
- Create layout components.
- Create models and services.
- Add [@mattlewis92 Angular Calendar](https://github.com/mattlewis92/angular-calendar).

### Fixed

- Fix problem with Angular 11 Universal + PWA + Deploy SSR as Cloud Function [Overflow](https://stackoverflow.com/questions/65978758/problem-with-angular-11-universal-ssr-pwa-deploying-ssr-as-cloud-function-fun).

## [0.0.1] - 2021-02-06 Creation and scaffolding with Angular 11

- Add [Angular Flex-Loyout](https://github.com/angular/flex-layout).
- Add [Bootstrap 4](https://devconquer.com/angular/how-to-install-jquery-popper-js-and-bootstrap-4-in-angular-8/).
- Add [PWA - ServiceWorker](https://angular.io/guide/service-worker-getting-started).
- Add [AngularFire](https://github.com/angular/angularfire).
- Add [Angular Material](https://material.angular.io/).
