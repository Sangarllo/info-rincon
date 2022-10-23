# Event

## EventType

### EventType = SIMPLE (sencillo)

### EventType = SPLITTED (desglosado)

- It has scheduleItems:
- EventConfig: show as sh-base-items-table.
- EventView: show as sh-base-items-list

### EventType = SUPEREVENT (Superevento)

- It has eventsRef:
- EventConfig: show as sh-events-ref-list.
- EventView: show as sh-events-ref-list.

:: Work with EventsRef as ScheduleItems?

## FrontPage (Home Page)

### Alerted Notice

### Next Stories

- Appointments => today, today + N_DAYS_AHEAD, no slices.
- Events => Active, Dashboard, no fixed.

### Fixed Stories

- Appointments => ON, today - N_DAYS_AHEAD, no slices.
- Events => Active, Dashboard, no fixed.


    const appointments$ = this.appointmentSrv.getAppointmentsByRange(DATE_MIN, DATE_MAX, false);
    const events$ = this.eventSrv.getAllEvents(true, true, true);


### Last Memories
