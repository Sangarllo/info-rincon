# Event

## EventMode

### EventMode = SIMPLE (sencillo)

### EventMode = SPLITTED (desglosado)

- It has scheduleItems:
- EventConfig: show as sh-base-items-table.
- EventView: show as sh-base-items-list

### EventMode = SUPEREVENT (Superevento)

- It has eventsRef:
- EventConfig: show as sh-events-ref-list.
- EventView: show as sh-events-ref-list.

:: Work with EventsRef as ScheduleItems?

## FrontPage - Dashboard (Home Page)

### Calendar Displayed (getCalendarEventsByRange)

- Appointments => year - 1, year + 1, with slices.
- Events => Active, Dashboard, no fixed.

### Alerted Notice

### Next Stories

- Appointments => today, today + DAYS(7), no slices.
- Events => Active, Dashboard, no fixed.

### Fixed Stories

- Appointments => today - DAYS(3), today + DAYS(14), no slices.
- Events => Active, Dashboard, with fixed.

### Last Memories

- LinkItems => today - DAYS(7), tomorrow, Linktype.REPORT.

### Last Memories
