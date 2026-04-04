# DLT PARSER & VISUALIZER gecc.dlt.go.th

## КАКУЮ БОЛЬ ЗАКРЫВАЕМ

- получение прав в Тае для иностранца - квест.

## как сейчас

- открыть `https://gecc.dlt.go.th/dltsmartqueue/dlt-Smartqueue`
- авторизоваться по загран-паспорту (для иностранца)
- ui-часть сайта требует авторизации.
- api-endpoints [https://app-gecc.theassistech.co.th/*] - доступны без авторизации.

- STEP 1: форма выбора Department office
-- screen: `/docs/assets/step-1.png`
-- список из 217 DLT
-- GET: `https://app-gecc.theassistech.co.th/dlt-api1/getSite/2`
-- RESPONSE: `[{ app_open: 1, sit_id: 1, sit_name: "Area Land Transport Office 1 (Bang Khun Thian)" }, ... ]`
-- full response -> `/docs/assets/1-get-dlt-offices.json`
-- клик по конкретному офису:
--- POST: `https://app-gecc.theassistech.co.th/dlt-api1/checkEmptyWork` {sit_id: 47}
--- RESPONSE: `[ { "tyg_id": 4, "gotwork": true, "filter": [ { "kw": " NEW THAI", "gotwork": true },{"kw": " RENEW THAI","gotwork": true}]},...]`
--- full response -> `/docs/assets/2-post-checkEmptyWork.json`

- STEP 2: форма выбора Service type
-- screen: `/docs/assets/step-2.png`
-- ток 1 опция: Driver's license.
-- клик по опции -> не шлет запросов

- STEP 3: Driver's license type
-- screen: `/docs/assets/step-3.png`
-- ток 1 опция: Personal driving license
-- клик по опции -> не шлет запросов

- STEP 4: Service type [new/renew] (не всегда доступны оба)
-- screen: `/docs/assets/step-4.png`
-- New thai driving license.
-- Renew thai driving license.
-- клик по опции -> GET `https://app-gecc.theassistech.co.th/dlt-api1/getVehicle?language=2&ve_type=1` (параметры на оба варианта всегда одинаковые)
-- RESPONSE: `[{ ve_id: 1, ve_name: "Motorcycle" }, { ve_id: 2, ve_name: "car" }, { ve_id: 12, ve_name: "Car and Motocycle" }]`
-- full response -> `/docs/assets/3-get-getVehicle.json`

- STEP 5: Vehicle type [car/moto/car+moto]
-- screen: ./docs/assets/step-5.png
-- Motorcycle
-- car
-- Car and Motocycle
-- клик по опции -> не шлет запросов

- STEP 6: Driving license [current]
-- screen: `/docs/assets/step-6.png`
-- select: Driving license expiration date + select: Select vehicle type + checkbox: Lost driving license.
-- select: Driving license expiration date + select: Select vehicle type + checkbox: Lost driving license
-- button: Confirm [ты должен заполнить даты или чекнуть хотя бы 1 "Lost driving license"]
-- Confirm:
--- POST: `https://app-gecc.theassistech.co.th/dlt-api1/workfilter`
--- PAYLOAD: `{"username":"U2FsdGVkX1/npFfvj/6RprR1ZgRrdQJDh2rCn4Ios3A=","sit_id":47,"group_id":4,"kw":" NEW THAI"}`
--- RESPONSE: `[ { "tyw_name": "ชาวต่างชาติ: NEW THAI DRIVING LICENCE", "tyw_id": 111093, "tyw_status": 1, "tyw_datestart": "2022-05-04T00:00:00.000Z" }]`
--- full response -> `/docs/assets/4-post-workfilter.json`

- STEP 7: Select the type of work
-- screen: `/docs/assets/step-7.png`
-- ชาวต่างชาติ: NEW THAI DRIVING LICENCE
-- клик по опции -> шлет 2 GET:
--- GET: `https://app-gecc.theassistech.co.th/dlt-api3/holiday?tyw_id=111093`
--- RESPONSE: `[{hol_date: "2026-04-06"},...]`
--- full response: `/docs/assets/5-holiday.json`

--- GET: `https://app-gecc.theassistech.co.th/dlt-api3/siteroundopen?tyw_id=111093&currentDate=2026-04-04`
--- RESPONSE: `[{"date": "2026-04-08", "message": "เต็ม","color": "#FF0000","siteopen": [{"round":"08:00 - 08:30 น.","count": "เต็ม","MaxCount": 2}]}, ...]`
--- full response: `/docs/assets/6-get-siteroundopen.json`

- STEP 8: Calendar [Select a date and time for service]:
-- screens:
--- `/docs/assets/step-8.1-default.png`
--- `/docs/assets/step-8.2-checked-day.png`
--- `/docs/assets/step-8.3-warning.png`
-- dots on calendar:
--- gray - Public holiday
--- red - The number of full booking to use the service
--- green - Number of empty booking in service
--- black - Not open for reservations for service
-- выбор дня шлет POST: `https://app-gecc.theassistech.co.th/dlt-api1/getPersonalProfile`
--- REQUEST BODY: `{"username":"U2FsdGVkX1/npFfvj/6RprR1ZgRrdQJDh2rCn4Ios3A="}`
--- RESPONSE: [empty]

- STEP 9: Confirm booking
-- screen: `/docs/assets/step-9-confirm.png`
-- Seat left 4
-- Only one booking for appointment can be made for each type of driving licence; for example, if the private vehicle driving licence renewal is booked, another appointment for a private vehicle driving licence cannot be booked simultaneously.

## РЕШЕНИЕ

- подбор ближайших DLT с удобными для нашего тревела свободными датами экзамена
- визуализация (календарь+карта)
- вывод в удобную форму поиска & визуальную карту.

## ДЕНЬГИ

- платные фичи: уведомления в тг/емаил/смс об освободившихся окошках
- резюме (CV)
- донаты

## Стек

- pigeon-maps
- ...

## API

--

## конкуренты

--

## ...


## ...
