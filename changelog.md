# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Next improvements]

- Panel de eventos filtrado por asociación o usuario.
- Mejorar la visibilidad de la cabecera

## [Unreleased]

## [2.0.2] - After first release (without SSR because of performance issues at deploying)

### Add

- `feature` Add remove-forever functionallity for events dashboard.
- `feature` Add social event audit.
- `feature` Enable entity-favorite from event-views.
- `feature` Enable entity-favorite from entity-view.
- `feature` List events in entity-view.
- `feature` Improve events-fav view width entity-favs.
- `feature` Next and last events on entity-view.
- `feature` New color for deadline appointments.
- `feature` Add entities-own feature.
- `feature` Add fixed events for dashboard.
- `feature` Add link-items for post-events publications.
- `feature` Add memories in frontpage.
- `feature` Add service for supported events (TODO).

### Fix

- `feature` Fix problem loading place at schedule item.
- `feature` Show claps when user is not logged.
- `social` Fix name of variable for claps and favorites.
- `feature` Reset tags in home page.
- `feature` Lector Role has option to select fav entity.
- `security` CanConfig depends also on entityArray.

### Update

- `style` Add logo-image for mobile devices.
- `style` Change fav-logo in header.
- `style` Home view changes ext-panel-design by tab-design.
- `feature` EventLinks are converted into linkItems.
- `style` Enlarge size of images and space in frontpage.
- `social` Autor can comments its own events.
- `style` By default, next stories are shown in frontpage.

### Remove

- `arch` Remove angular universal.
- `feature` Remove EventLink component.

## [2.0.1] - Ready for release

### Add

- `settings` Enabled url https//www.agendarinconera.es.
- `settings` Update domain at Firebase Console.
- `feature` Comments can be done by users, entities, or Agenda.
- `admin` Let deletion forever of events.
- `code` Isolate component for social data.
- `feature` View of cards with search-filter pipe.
- `feature` View of cards can be filtered by status.
- `feature` Setting of favorite entities.
- `feature` Improve audit items.
- `feature` Add social audit in event-config view.
- `feature` Add `brave-rewards-verification` file.
- `feature` Add AngularFireAnalyticsModule.

### Fix

- `style` Improve social sharing with extra info.
- `style` Fix default-image path.
- `arch` Fix deploying (hosting + functions) to firebase.
- `feature` Solve problem with end dates.
- `feature` Alerted notice must be active+alerted+visible.
- `feature` Avoid comments to appear when there isn't.
- `feature` Fix resolver-problem with subevents.

### Update

- `arch` Update to angular 13.3.4.
- `arch` Executed `npx npm-check-updates`.
- `feature` Disable login by email.
- `style` Use badges for social sharing.
- `code` Refactor event-comment and notice-comment to simple comment.
- `style` Fav events shown with cards.

### Remove

- `feature` Remove deploying to Heroku.

## [0.3.0] - Enable url <https://agendarinconera.es/> and updgrade angular/fire 7

### Add

- `feature` Enable url <https://agendarinconera.es/>.
- `feature` Add meta tags about the image.
- `feature` Deployed to Heroku.
- `feature` Add resolver for eventView to update tags for seo.

### Fix

- `Style` Extract event default-image from assets.
- `Seo` Change OpenGraph meta tags.
- `Seo` Fix creating tags from description.
- `Style` Scape storage paths.
- `Social` Share longest images.
- `Seo` Reinstall Angular Universal.

### Update

- `feature` Reduce picture model.
- `arch` Update firebase-tools@10.0.1.
- `arch` Update @angular/fire@7 (from 6).
- `arch` Update firebase@9 (from 8).
- `arch` Update rxjs@7 (from 6).
- `arch` Update Dev firebase-admin@10 (from 8).
- `arch` Update Dev firebase-functions@3.16 (from 3.15).
- `arch` Update Dev firebase-tools@9 (from 8).

## [0.2.5] - Add comments feature

### Add

- `feature` Add comments feature to events and notices.
- `admin` Add angularFire guards to get auth access.
- `admin` Add admin guards to get admin access.
- `admin` Set control about who can delete comments.
- `style` Improve notice edition style.
- `style` Render medium-size image in event detail.

### Fix

- `style` Adapt toolbar based on bootstrap breakpoints.
- `style` Fix mobile visualization in event dialogs.
- `style` Improve admin-menu for mobile devices.
- `style` Improve login page for mobile devices.
- `style` Fix getResizedImage method, and use it for dashboards.
- `style` Limit access in entity and place module based on roles.

### Update

- `style` Delete config button into the top bar.
- `style` Improve alert-notice.
- `routing` Route to home page after login.
- `routing` Route to admin page when avatar is clicked.
- `feature` Only show stories expansion-panel if exists stories.

## [0.2.4] - Update to Angular 13

### Add

- `devops` Install `angular-css-shrink` to reduce css bundle.
- `feature` Home: add entity-button when someone is filtered.
- `feature` Add linkItems to event model.
- `feature` Add linkItems config panel to event view and config.
- `feature` Add event dashboard for own events, and usersArray to event model.

### Fix

- `code` Refactor main-item styles (events, links and notices).
- `code` Refactor dialog header styles.
- `style` Improve style in event-view.
- `audit` Hide audit logs in develop-environment.
- `code` Split image field into two fields (imageId and imagePath).
- `code` Avoid loading events in home component.
- `config` Add stories constant NDaysAhead to config.
- `routing` Fix problem with links from navbar.
- `admin` Improve canConfig function for events and notices.

### Update

- `architect` Update @nguniversal/builders@13.
- `architect` Update @angular-devkit/architect@0.1300.
- `architect` Update @angular/core@13 @angular/cli@13.
- `architect` Update @angular/cli@13 update @angular/material@13.
- `feature` Add story service, but only show events.
- `feature` Events and SchedulesItems are shown depending on ShowModes.
- `style` Place StatusBox and ViewButton in the top on event-config component.

## [0.2.3] - Changes after review with partners

### Add

- `feature` Create IPicture model, used for managing event images.
- `feature` Add component dialog for removing pictures.

### Update

- `style` Small sizes for social icons in mobile devices.

### Fix

- `feature` Fav icon enabled after login.

## [0.2.2] - Improvements in social features

### Add

- `feature` Add counter for favs and claps.
- `feature` Show counter for favs and claps in event panel.
- `feature` Add button to zoom-in image.
- `feature` Add `storage-resize-images` extension to get 200x200 thumbnails.
- `feature` Add button for updlading-pwa in faq section.
- `feature` Add thumbnail for notices.

### Update

- `style` Set logo-background as color2 instead of transparent.
- `style` Change image-config for events.
- `style` Improve selected base-item in event.
- `feature` Change news by links as item for stories.

### Fix

- `feature` Improve design for event-image dialog.
- `feature` Number of claps are showed even without logged user.
- `feature` Avoid clapping if a clap is in course.

## [0.2.1] - Improvements with betatesters

### Add

- `feature` Add event-panel for autor+ users in admin dashboard.
- `feature` Add event-mode logo in event-admin view.
- `feature` Add url-sanitized field for events, and evento/url view.
- `feature` Add config for selecting view-mode in calendar.
- `feature` Add footer-section below the calendar.
- `feature` Add filter-by-entity configuration in the calendar.

### Update

- `feature` Home accordion-panels are opened by default.
- `feature` Set month-view as calendar default at home.
- `feature` Update admin dashboard view.
- `business` Change event-admin by event-config.
- `business` Lector User can edit his name and image.
- `feature` Loaded events are limited to updated in the last year.

### Fix

- `code` Fix problem in user-entities with roles.
- `feature` Enable register with email.
- `feature` Fix problem overriden description with categories.

### Delete

- `feature` Remove extra avatars.

## [0.2.0] - Update to Angular 12

### Update

- `code` Update to Angular 12.
- `code` Update to AngularFire 6.1.5, compatible with Angular 12 and Firebase 7,8.

## [0.1.4] - Favourite events for logged users

### Add

- `feature` Add favourite events for logged users.
- `feature` Add applause support for events.

### Fix

- `code` Enable and fix tests.
- `code` Fix problem adding schedule without place.

## [0.1.3] - Improvements after users review

### Add

- `feature` Add event search dialog component.
- `feature` Add role-options for lector role.
- `style` Add Event status pipe for translation.

### Change

- `feature` Show 'loading event' message.
- `feature` Show monthly-calendar button for smaller screen.
- `feature` Show 'el evento se celebra' with dd-mm-yyyy format.

### Fixed

- `style` Start MatDatepicker on monday.
- `style` Center image at event-dialog.

### Remove

- `style` Remove @angular/flex-layout.

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
