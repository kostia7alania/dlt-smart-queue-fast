# 🚗 DLT PARSER & VISUALIZER `gecc.dlt.go.th`

> 🎯 **Цель:** найти свободные слоты DLT для прав в Тае, показать офисы на карте и календаре, не заставляя человека вручную тыкать этот квестовый UI.

---

## 🧨 КАКУЮ БОЛЬ ЗАКРЫВАЕМ

- получение прав в Тае для иностранца - квест.

### 💡 Что хотим получить

- 🗺️ карта DLT-офисов
- 📅 календарь свободных / занятых слотов
- 🔎 фильтры под тревел-маршрут
- 🔔 уведомления об освободившихся окошках

---

## 🧭 Как сейчас

- 🌐 открыть `https://gecc.dlt.go.th/dltsmartqueue/dlt-Smartqueue`
- 🛂 авторизоваться по загран-паспорту (для иностранца)
- 🔐 ui-часть сайта требует авторизации
- 🧪 api-endpoints `https://app-gecc.theassistech.co.th/*` - доступны без авторизации

---

## ⚠️ Важные наблюдения

- 🔐 UI требует логин, но часть API можно дергать без авторизации.
- 🧵 Сценарий линейный:

```txt
office
  ↓
service type
  ↓
license type
  ↓
new/renew
  ↓
vehicle type
  ↓
current license
  ↓
type of work
  ↓
calendar
  ↓
booking
```

- 🧨 В API и UI встречаются кривые строки. Их нельзя “исправлять” в коде/доках, если они пришли с сайта:
  - `Car and Motocycle`
  - `car`
  - `New thai driving license.`
  - `Renew thai driving license.`
  - `เต็ม`

> 🧷 Для парсера такие строки считаем частью внешнего контракта.

---

## 🧱 Общая схема API-flow

```txt
[STEP 1] getSite/2
   ↓ returns sit_id

[STEP 1 click office] checkEmptyWork
   ↓ returns tyg_id + kw: " NEW THAI" / " RENEW THAI"

[STEP 4 click new/renew] getVehicle
   ↓ returns ve_id + ve_name

[STEP 6 confirm] workfilter
   ↓ returns tyw_id

[STEP 7 click work type]
   ├─ holiday?tyw_id=...
   └─ siteroundopen?tyw_id=...&currentDate=...

[STEP 8 select day] getPersonalProfile
   ↓ RESPONSE: [empty]

[STEP 9] Confirm booking UI
```

---

# 🧩 FLOW

## 1️⃣ STEP 1: форма выбора Department office

**🖼️ Screen:**  
`/docs/assets/step-1.png`

**📌 UI / данные:**

- список из 217 DLT

---

### 📥 Получение списка DLT-офисов

**GET:**

```http
GET https://app-gecc.theassistech.co.th/dlt-api1/getSite/2
```

**RESPONSE:**

```json
[
  {
    "app_open": 1,
    "sit_id": 1,
    "sit_name": "Area Land Transport Office 1 (Bang Khun Thian)"
  }
]
```

**📎 Full response:**  
`/docs/assets/1-get-dlt-offices.json`

### 🧠 Что забрать из ответа

| field | зачем |
|---|---|
| `app_open` | открыт ли офис для приложения |
| `sit_id` | ID офиса для следующих запросов |
| `sit_name` | название офиса для UI / карты |

---

### 🖱️ Клик по конкретному офису

**POST:**

```http
POST https://app-gecc.theassistech.co.th/dlt-api1/checkEmptyWork
```

**PAYLOAD:**

```json
{
  "sit_id": 47
}
```

**RESPONSE:**

```json
[
  {
    "tyg_id": 4,
    "gotwork": true,
    "filter": [
      {
        "kw": " NEW THAI",
        "gotwork": true
      },
      {
        "kw": " RENEW THAI",
        "gotwork": true
      }
    ]
  }
]
```

**📎 Full response:**  
`/docs/assets/2-post-checkEmptyWork.json`

### 🧠 Что сохранить для дальнейших шагов

| field | зачем |
|---|---|
| `sit_id` | выбранный DLT-офис |
| `tyg_id` | group/work category |
| `filter[].kw` | тип записи: ` NEW THAI` / ` RENEW THAI` |
| `filter[].gotwork` | доступен ли этот тип работы |

---

## 2️⃣ STEP 2: форма выбора Service type

**🖼️ Screen:**  
`/docs/assets/step-2.png`

**📌 UI:**

- ток 1 опция: Driver's license.

**⚙️ Поведение:**

- клик по опции -> не шлет запросов

---

## 3️⃣ STEP 3: Driver's license type

**🖼️ Screen:**  
`/docs/assets/step-3.png`

**📌 UI:**

- ток 1 опция: Personal driving license

**⚙️ Поведение:**

- клик по опции -> не шлет запросов

---

## 4️⃣ STEP 4: Service type [new/renew] (не всегда доступны оба)

**🖼️ Screen:**  
`/docs/assets/step-4.png`

**📌 UI:**

- New thai driving license.
- Renew thai driving license.

> ⚠️ Важно: не всегда доступны оба варианта.

**⚙️ Поведение:**

- клик по опции -> GET `https://app-gecc.theassistech.co.th/dlt-api1/getVehicle?language=2&ve_type=1`
- параметры на оба варианта всегда одинаковые

---

### 📥 Получение vehicle types

**GET:**

```http
GET https://app-gecc.theassistech.co.th/dlt-api1/getVehicle?language=2&ve_type=1
```

**RESPONSE:**

```json
[
  {
    "ve_id": 1,
    "ve_name": "Motorcycle"
  },
  {
    "ve_id": 2,
    "ve_name": "car"
  },
  {
    "ve_id": 12,
    "ve_name": "Car and Motocycle"
  }
]
```

**📎 RAW response:**  
`/docs/assets/3-get-getVehicle.json`

### 🧠 Что сохранить для дальнейших шагов

| field | зачем |
|---|---|
| `ve_id` | ID vehicle type |
| `ve_name` | текст из API/UI, не исправлять |

---

## 5️⃣ STEP 5: Vehicle type [car/moto/car+moto]

**🖼️ Screen:**  
`./docs/assets/step-5.png`

**📌 UI:**

- Motorcycle
- car
- Car and Motocycle

**⚙️ Поведение:**

- клик по опции -> не шлет запросов

> 🧷 `Car and Motocycle` сохраняем именно так. Не `Motorcycle`.

---

## 6️⃣ STEP 6: Driving license [current]

**🖼️ Screen:**  
`/docs/assets/step-6.png`

**📌 UI / форма:**

- select: Driving license expiration date + select: Select vehicle type + checkbox: Lost driving license.
- select: Driving license expiration date + select: Select vehicle type + checkbox: Lost driving license
- button: Confirm [ты должен заполнить даты или чекнуть хотя бы 1 "Lost driving license"]

> 🧷 Дубль строки выше оставлен намеренно: в исходных заметках он был два раза. Возможно, это две одинаковые строки формы для разных vehicle types.

---

### ✅ Confirm

**POST:**

```http
POST https://app-gecc.theassistech.co.th/dlt-api1/workfilter
```

**PAYLOAD:**

```json
{
  "username": "U2FsdGVkX1/npFfvj/6RprR1ZgRrdQJDh2rCn4Ios3A=",
  "sit_id": 47,
  "group_id": 4,
  "kw": " NEW THAI"
}
```

**RESPONSE:**

```json
[
  {
    "tyw_name": "ชาวต่างชาติ: NEW THAI DRIVING LICENCE",
    "tyw_id": 111093,
    "tyw_status": 1,
    "tyw_datestart": "2022-05-04T00:00:00.000Z"
  }
]
```

**📎 Full response:**  
`/docs/assets/4-post-workfilter.json`

### 🧠 Что сохранить для дальнейших шагов

| field | зачем |
|---|---|
| `tyw_id` | ключевой ID для календаря и слотов |
| `tyw_name` | название work type |
| `tyw_status` | статус work type |
| `tyw_datestart` | дата старта / доступности |

---

## 7️⃣ STEP 7: Select the type of work

**🖼️ Screen:**  
`/docs/assets/step-7.png`

**📌 UI:**

- ชาวต่างชาติ: NEW THAI DRIVING LICENCE

**⚙️ Поведение:**

- клик по опции -> шлет 2 GET:
  - `holiday`
  - `siteroundopen`

```txt
click work type
   ├─ GET holiday
   └─ GET siteroundopen
```

---

### 🏖️ GET 1: holiday

**GET:**

```http
GET https://app-gecc.theassistech.co.th/dlt-api3/holiday?tyw_id=111093
```

**RESPONSE:**

```json
[
  {
    "hol_date": "2026-04-06"
  }
]
```

**📎 Full response:**  
`/docs/assets/5-holiday.json`

### 🧠 Что забрать

| field | зачем |
|---|---|
| `hol_date` | день public holiday / серый dot |

---

### 📅 GET 2: siteroundopen

**GET:**

```http
GET https://app-gecc.theassistech.co.th/dlt-api3/siteroundopen?tyw_id=111093&currentDate=2026-04-04
```

**RESPONSE:**

```json
[
  {
    "date": "2026-04-08",
    "message": "เต็ม",
    "color": "#FF0000",
    "siteopen": [
      {
        "round": "08:00 - 08:30 น.",
        "count": "เต็ม",
        "MaxCount": 2
      }
    ]
  }
]
```

**📎 Full response:**  
`/docs/assets/6-get-siteroundopen.json`

### 🧠 Что сохранить / распарсить

| field | зачем |
|---|---|
| `date` | дата в календаре |
| `message` | статус дня, например `เต็ม` |
| `color` | цвет dot/status |
| `siteopen[].round` | временной слот |
| `siteopen[].count` | статус/остаток, может быть строкой `เต็ม` |
| `siteopen[].MaxCount` | максимум мест |

---

## 8️⃣ STEP 8: Calendar [Select a date and time for service]

**🖼️ Screens:**

- `/docs/assets/step-8.1-default.png`
- `/docs/assets/step-8.2-checked-day.png`
- `/docs/assets/step-8.3-warning.png`

---

### 🎨 dots on calendar

| dot color | meaning |
|---|---|
| gray | Public holiday |
| red | The number of full booking to use the service |
| green | Number of empty booking in service |
| black | Not open for reservations for service |

### 🧭 Логика календаря

```txt
gray  → public holiday
red   → full booking
green → empty booking available
black → not open for reservations
```

---

### 🖱️ Выбор дня

**POST:**

```http
POST https://app-gecc.theassistech.co.th/dlt-api1/getPersonalProfile
```

**REQUEST BODY:**

```json
{
  "username": "U2FsdGVkX1/npFfvj/6RprR1ZgRrdQJDh2rCn4Ios3A="
}
```

**RESPONSE:**  
`[empty]`

---

## 9️⃣ STEP 9: Confirm booking

**🖼️ Screen:**  
`/docs/assets/step-9-confirm.png`

**📌 UI:**

- Seat left 4

**⚠️ Warning:**

> Only one booking for appointment can be made for each type of driving licence; for example, if the private vehicle driving licence renewal is booked, another appointment for a private vehicle driving licence cannot be booked simultaneously.

---

# 🧬 Data model draft

## DltOffice

```ts
type DltOffice = {
  app_open: number
  sit_id: number
  sit_name: string
}
```

## WorkAvailability

```ts
type WorkAvailability = {
  tyg_id: number
  gotwork: boolean
  filter: Array<{
    kw: string
    gotwork: boolean
  }>
}
```

## VehicleType

```ts
type VehicleType = {
  ve_id: number
  ve_name: string
}
```

## WorkType

```ts
type WorkType = {
  tyw_name: string
  tyw_id: number
  tyw_status: number
  tyw_datestart: string
}
```

## SiteRoundOpen

```ts
type SiteRoundOpen = {
  date: string
  message: string
  color: string
  siteopen: Array<{
    round: string
    count: string
    MaxCount: number
  }>
}
```

---

# 🏗️ РЕШЕНИЕ

- подбор ближайших DLT с удобными для нашего тревела свободными датами экзамена
- визуализация (календарь+карта)
- вывод в удобную форму поиска & визуальную карту

---

## 🧭 Основной UX

```txt
user location / travel route
   ↓
nearest DLT offices
   ↓
available service types
   ↓
vehicle types
   ↓
slot calendar
   ↓
map + filters
   ↓
alerts
```

1. Пользователь выбирает текущую точку / город / маршрут.
2. Сервис показывает ближайшие DLT-офисы.
3. Сервис подтягивает доступные типы работ и vehicle types.
4. Сервис показывает календарь свободных / занятых дней.
5. Сервис визуализирует офисы на карте.
6. Пользователь может включить уведомления об освободившихся окошках.

---

## 🔎 Фильтры

- office / province / distance
- New / Renew
- Motorcycle / car / Car and Motocycle
- даты
- свободные места
- ближайший слот
- удобство по маршруту

---

# 💰 ДЕНЬГИ

- платные фичи: уведомления в тг/емаил/смс об освободившихся окошках
- резюме (CV)
- донаты

## 🔔 Платные фичи

- Telegram alerts
- Email alerts
- SMS alerts
- мониторинг конкретного DLT
- мониторинг нескольких DLT
- мониторинг по маршруту
- instant alert при появлении зеленого слота
- история слотов / аналитика по офисам

---

# 🧰 Стек

## 🖼️ Frontend

- Vue / Nuxt или Next.js
- TypeScript
- `pigeon-maps`
- календарь слотов
- таблица офисов
- фильтры

## ⚙️ Backend

- Go / Node.js
- cron / queue для мониторинга
- retry / backoff
- rate-limit protection
- API normalization layer

## 🗄️ Storage

- Postgres
- Redis для очередей / кэша
- snapshots истории слотов

## 📣 Notifications

- Telegram
- Email
- SMS

---

# 🔌 API

--

## Known endpoints

| Step | Method | Endpoint | Purpose |
|---|---:|---|---|
| 1 | GET | `/dlt-api1/getSite/2` | список DLT-офисов |
| 1 | POST | `/dlt-api1/checkEmptyWork` | проверка доступных работ по офису |
| 4 | GET | `/dlt-api1/getVehicle?language=2&ve_type=1` | vehicle types |
| 6 | POST | `/dlt-api1/workfilter` | получение `tyw_id` |
| 7 | GET | `/dlt-api3/holiday?tyw_id=...` | holidays |
| 7 | GET | `/dlt-api3/siteroundopen?tyw_id=...&currentDate=...` | календарь / слоты |
| 8 | POST | `/dlt-api1/getPersonalProfile` | профиль пользователя, response empty |

## Base URLs

- UI: `https://gecc.dlt.go.th/dltsmartqueue/dlt-Smartqueue`
- API: `https://app-gecc.theassistech.co.th/*`

---

# 🥊 конкуренты

--

## Возможные конкуренты / альтернативы

- ручной поиск через официальный Smart Queue UI
- локальные агенты
- Telegram/FB-группы с подсказками по DLT
- тревел-чаты
- ручной мониторинг через браузер

---

# ❓ Open Questions

- Нужна ли авторизация для финального бронирования?
- Можно ли смотреть слоты без логина стабильно, или API начнет резать?
- Есть ли rate limit?
- Нужно ли подставлять реальный `username` для `workfilter`?
- `username` постоянный или меняется между сессиями?
- Можно ли получить все `tyw_id` заранее для всех офисов?
- Отличаются ли `tyw_id` для New / Renew / Motorcycle / car / Car and Motocycle?
- Как API ведёт себя для разных `sit_id`?
- Как часто обновляются слоты?
- Можно ли безопасно мониторить без риска блокировки?
- Что значит `MaxCount`, если `count` приходит строкой `เต็ม`?
- Есть ли офисы, где иностранцев не обслуживают по этому flow?
- Нужно ли хранить историю слотов для аналитики?

---

# ✅ Anti-loss checklist

Перед изменением доки / парсера проверить, что эти строки сохранены дословно:

- `Car and Motocycle`
- `car`
- `New thai driving license.`
- `Renew thai driving license.`
- `ток 1 опция: Driver's license.`
- `ток 1 опция: Personal driving license`
- `./docs/assets/step-5.png`
- `клик по опции -> не шлет запросов`
- `button: Confirm [ты должен заполнить даты или чекнуть хотя бы 1 "Lost driving license"]`
- `ชาวต่างชาติ: NEW THAI DRIVING LICENCE`
- `เต็ม`
- `[empty]`
- `Seat left 4`

---

## ...

## ...
