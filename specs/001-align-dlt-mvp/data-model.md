# Data Model: DLT Read-Only Discovery MVP

## DltOffice

- `app_open`: upstream integer flag
- `sit_id`: upstream office ID
- `sit_name`: upstream office name

## WorkAvailability

- `tyg_id`: upstream work group ID
- `gotwork`: whether the group has available work
- `filter`: list of `WorkFilter`

## WorkFilter

- `kw`: upstream work keyword such as ` NEW THAI` or ` RENEW THAI`
- `gotwork`: whether this keyword is available

## VehicleType

- `ve_id`: upstream vehicle ID
- `ve_name`: upstream vehicle label such as `Motorcycle`, `car`, or `Car and Motocycle`

## WorkType

- `tyw_name`: upstream work type name
- `tyw_id`: key used for calendar endpoints
- `tyw_status`: upstream status
- `tyw_datestart`: upstream start date timestamp

## Holiday

- `hol_date`: holiday date

## SlotDay

- `date`: calendar date
- `message`: upstream status message such as `เต็ม`
- `color`: upstream color value
- `siteopen`: list of `SlotRound`

## SlotRound

- `round`: time range label
- `count`: remaining/full status; may be a string such as `เต็ม`
- `MaxCount`: maximum seats

## Validation Rules

- Preserve all upstream field names and string values in raw DTOs.
- Local response wrappers may add metadata, but must not mutate upstream values.
- Treat `count` as a string-compatible value, not as a guaranteed number.
- Treat empty upstream responses as valid data, not always as errors.
