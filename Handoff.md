# Handoff.md — DMAIC Platform (КазМунайГаз)

Документ для передачи контекста между сессиями разработки.  
Последнее обновление: 28 мая 2026.

---

## 1. Что это за проект

**DMAIC Platform** — внутренняя геймификационная платформа для КазМунайГаз (КМГ).  
Участники (сотрудники) проходят 4 этапа методологии Six Sigma DMAIC, получают баррели нефти как награду за каждый этап, соревнуются в рейтинге.

**Аудитория:**
- Участники — сотрудники КМГ, заполняют этапы, видят свой прогресс
- Администратор — проверяет этапы, выставляет % оценку, начисляет баррели

**Язык интерфейса:** Русский + Казахский (двуязычный, переключатель в шапке)

**Репозиторий:** https://github.com/uapovvs/Aliya.git  
**Рабочая папка:** `C:\Users\NewAdmin\Documents\A`

---

## 2. Архитектура

```
C:\Users\NewAdmin\Documents\A\
├── backend/          Java 21, Spring Boot 3.3, Spring Security (JWT), PostgreSQL 16
├── frontend/         React 18, TypeScript, Vite, Tailwind CSS 3
├── DESIGN.md         Дизайн-система (Linear-style, токены цветов и типографики)
├── CLAUDE.md         Инструкции для AI-агента
├── docker-compose.yml  PostgreSQL + MinIO (если будет Docker)
└── .env.example      Шаблон переменных окружения
```

---

## 3. Стек технологий

### Backend
| Технология | Версия | Зачем |
|---|---|---|
| Java | 21 | Язык |
| Spring Boot | 3.3.0 | Фреймворк |
| Spring Security | 6.x | JWT аутентификация |
| Flyway | — | Миграции БД |
| Hibernate / JPA | 6.5 | ORM |
| PostgreSQL | 16 | База данных |
| MinIO SDK | 8.5 | Хранилище аватаров (пока не настроено полностью) |
| Lombok | — | Меньше boilerplate |
| Maven | 3.9.9 | Сборка |

### Frontend
| Технология | Версия | Зачем |
|---|---|---|
| React | 18 | UI фреймворк |
| TypeScript | 5.4 | Типизация |
| Vite | 5.4 | Dev-сервер и бандлер |
| Tailwind CSS | 3.4 | Стили |
| Motion (motion/react) | latest | Анимации (motiondivision) |
| @phosphor-icons/react | latest | Иконки (Phosphor Bold) |
| Zustand | 4.5 | Стейт-менеджмент (authStore) |
| React Router | v6 | Маршрутизация |
| Axios | 1.7 | HTTP-клиент с JWT интерцептором |
| react-i18next | 14.x | Двуязычность RU/KZ |

---

## 4. Как запустить локально

### Требования
- Java 21 (установлен: `C:\Program Files\Eclipse Adoptium\jdk-21.0.11.10-hotspot`)
- Maven 3.9.9 (установлен: `C:\Users\NewAdmin\Documents\apache-maven-3.9.9`)
- Node.js 20+ (установлен)
- PostgreSQL 16 (установлен локально, БД: `Aliya`, пользователь: `dmaic_user`)

### Backend (PowerShell)
```powershell
$env:JAVA_HOME = "C:\Program Files\Eclipse Adoptium\jdk-21.0.11.10-hotspot"
$env:PATH = "$env:JAVA_HOME\bin;C:\Users\NewAdmin\Documents\apache-maven-3.9.9\bin;$env:PATH"
$env:DB_NAME = "Aliya"
$env:DB_USER = "dmaic_user"
$env:DB_PASSWORD = "dmaic_pass"
$env:JWT_SECRET = "dmaic-super-secret-key-minimum-32-chars-long"
$env:ADMIN_USERNAME = "admin"
$env:ADMIN_PASSWORD = "Admin123!"

cd "C:\Users\NewAdmin\Documents\A\backend"
mvn spring-boot:run
```
Запускается на **http://localhost:8080**

### Frontend (второй PowerShell)
```powershell
cd "C:\Users\NewAdmin\Documents\A\frontend"
npm run dev
```
Запускается на **http://localhost:5173** (проксирует `/api` → `:8080`)

### Учётные данные по умолчанию
- Логин: `admin` / Пароль: `Admin123!`
- База данных: `Aliya` на `localhost:5432`

---

## 5. Что уже сделано

### 5.1 Backend — полный скелет

**Сущности (entities):**
- `User` — участник или администратор (роль: `ROLE_ADMIN` / `ROLE_PARTICIPANT`)
- `Project` — проект участника (1:1 с User)
- `DmaicStage` — этап D/M_A/I/C с контентом в JSONB, статусом, оценкой администратора
- `Barrel` — начисленные баррели (рассчитываются из adminScore)

**Репозитории:** UserRepository, ProjectRepository, DmaicStageRepository

**Сервисы:**
- `AuthService` — login → JWT токен
- `UserService` — создание участников, профиль, аватар, findIdByUsername
- `StageService` — сохранение черновика, отправка на проверку, проверка администратором
- `BarrelService` — логика начисления баррелей по шкале (100%→5, 80%→4, 50%→2, 40%→1, <40%→0)
- `LeaderboardService` — рейтинг участников по баррелям
- `StorageService` — загрузка аватаров в MinIO (валидация типа файла, лимит 5MB)

**Контроллеры:**
- `POST /api/auth/login` — вход
- `GET /api/users/me` — мой профиль
- `POST /api/users/me/avatar` — загрузить аватар
- `GET /api/stages/my` — мои этапы
- `PUT /api/stages/{stage}` — сохранить черновик
- `POST /api/stages/{stage}/submit` — отправить на проверку
- `POST /api/admin/users` — создать участника (только ADMIN)
- `GET /api/admin/users` — список участников
- `GET /api/admin/stages/submitted` — этапы на проверке
- `PUT /api/admin/stages/{id}/review` — оценить этап
- `GET /api/leaderboard` — публичный рейтинг

**Безопасность:**
- JWT stateless (jjwt 0.12.6)
- Spring Security 6, `AntPathRequestMatcher` (фикс для Spring Boot 3)
- `SecurityConfig` — CORS, CSRF отключён, правила доступа
- `AdminInitializer` — создаёт admin из `ADMIN_USERNAME`/`ADMIN_PASSWORD` env при первом старте
- Секреты только через переменные окружения (нет дефолтного JWT_SECRET)

**БД:**
- Flyway миграция `V1__init.sql` — создаёт таблицы `users`, `projects`, `dmaic_stages`
- Нет хардкоженных паролей в миграциях

### 5.2 Frontend — полный скелет

**Страницы:**
- `/` — HomePage (публичный рейтинг, карточки этапов DMAIC)
- `/login` — LoginPage (форма входа)
- `/dashboard` — DashboardPage (кабинет участника, этапы, прогресс баррелей)
- `/dashboard/stage/:slug` — StagePage (заполнение/просмотр этапа)
- `/admin` — AdminPage (список участников, создание)
- `/admin/review/:userId` — AdminReviewPage (проверка этапов)

**Компоненты:**
- `Layout` — шапка с навигацией, переключатель языка, выход
- `BarrelProgress` — прогресс-бар баррелей с уровнями наград
- `StageCard` — карточка этапа со статусом и оценкой
- `Leaderboard` — таблица рейтинга

**API клиент:** Axios с JWT-интерцептором, автологаут при 401

**i18n:** `ru.json` + `kz.json`, все строки переведены

### 5.3 Дизайн-система

Применены все установленные AI-скиллы:

| Скилл | Результат |
|---|---|
| `awesome-design-md` → Linear DESIGN.md | Canvas `#010102`, surface ladder s1-s3, hairline borders `#23252a`, lavender accent `#5e6ad2` |
| `google-fonts-skill` | Inter + major-second scale (1.125), negative tracking на заголовках |
| `taste-skill` → minimalist-skill | Нет теней, нет градиентов, Phosphor Bold иконки, motion правила |
| `motiondivision/motion` | Stagger анимации, whileHover/whileTap, AnimatePresence, spring для баррелей |
| `@phosphor-icons/react` | Единая иконочная библиотека (taste-skill запрещает Lucide) |
| `ui-ux-pro-max` | Minimalism+Swiss style для enterprise dashboard |
| `security-review` skill | Найдены и исправлены 3 уязвимости |
| `code-review --fix` skill | 2 улучшения применены |

**Файл `DESIGN.md`** в корне репо — все AI-агенты читают токены дизайна.

### 5.4 Исправленные уязвимости (security-review)
1. `StorageService` — добавлена валидация типа файла (только JPEG/PNG/WebP ≤5MB), UUID имена
2. `application.yml` — убран дефолтный JWT_SECRET (нет fallback, fail-fast при старте)
3. `V1__init.sql` — убраны хардкоженные admin credentials, заменены на `AdminInitializer`

---

## 6. На чём остановились

**Последнее состояние (28 мая 2026):**
- ✅ Backend запущен и работает на :8080
- ✅ Frontend запущен на :5173
- ✅ Вход под admin/Admin123! работает (проверено)
- ✅ Все анимации Motion загружаются
- ✅ Иконки Phosphor отображаются
- ⏳ Функционал участника **не тестировался** — создание участника и заполнение этапов через UI не проверено
- ⏳ MinIO для аватаров **не настроен** (нет Docker, нет MinIO сервера)
- ⏳ AdminReviewPage — показывает все submitted этапы, **не фильтрует по userId** (TODO в коде)

---

## 7. Что нужно сделать дальше

### Приоритет 1 — Доделать основной функционал

**7.1 Тестирование флоу участника**
- [ ] Создать тестового участника через /admin
- [ ] Войти под участником
- [ ] Заполнить этап D, сохранить, отправить на проверку
- [ ] Зайти под admin, поставить оценку
- [ ] Проверить что баррели начислились в рейтинге

**7.2 Фикс AdminReviewPage**
- [ ] Фильтровать этапы по `userId` из URL параметра
- [ ] Сейчас показывает все submitted этапы всех пользователей

**7.3 Загрузка аватаров**
- [ ] Настроить MinIO (установить Docker Desktop или использовать локальный MinIO)
- [ ] Или заменить MinIO на локальное хранилище файлов (проще для dev)
- [ ] Страница `/dashboard/avatar` не реализована — добавить `AvatarUpload` компонент

**7.4 Проект участника**
- [ ] `StageService.getOrCreateProject` использует `new User()` без реального userId — баг при первом создании проекта
- [ ] Нужно передавать реальный User объект из UserRepository

### Приоритет 2 — Недостающие страницы и компоненты

**7.5 Профиль участника**
- [ ] Страница редактирования профиля (имя, должность)
- [ ] Загрузка и отображение аватара

**7.6 Дата финиша (Control этап)**
- [ ] Участник должен иметь возможность установить свою дату финиша для этапа C
- [ ] В форме StagePage для этапа C добавить date picker

**7.7 Результат проекта**
- [ ] На Dashboard добавить выбор типа результата:
  - Снижение затрат
  - Увеличение производительности
  - Улучшение качества услуг
  - Оптимизация процессов
  - Автоматизация процессов

**7.8 Дедлайны**
- [ ] Визуальное предупреждение когда дедлайн этапа истекает (красный цвет, иконка)
- [ ] Блокировка отправки после дедлайна (опционально)

### Приоритет 3 — Улучшения UI/UX

**7.9 shadcn-ui-blocks** (установлен скилл, не использован)
- [ ] Добавить Hero-секцию на HomePage с shadcnblocks компонентами
- [ ] Добавить Stats-блок: общее кол-во участников, баррелей, дедлайны

**7.10 Анимации прогресса**
- [ ] Использовать `useScroll` из Motion для parallax в шапке HomePage
- [ ] Добавить `useMotionValue` для barrel counter (анимированный счётчик)

**7.11 Нотификации**
- [ ] Toast уведомления (успех/ошибка) при сохранении, отправке, оценке
- [ ] Можно использовать `AnimatePresence` + собственный toast

**7.12 Таблица лидеров — улучшения**
- [ ] Показывать прогресс каждого участника по этапам (мини-индикаторы D/M/I/C)
- [ ] Фото аватаров

### Приоритет 4 — Prod-готовность

**7.13 Docker**
- [ ] Установить Docker Desktop
- [ ] `docker compose up -d` поднимает PostgreSQL + MinIO
- [ ] Убрать ручную установку PostgreSQL

**7.14 Production сборка**
- [ ] Настроить nginx для раздачи frontend
- [ ] Задать production env vars
- [ ] Настроить HTTPS

**7.15 Code splitting**
- [ ] Motion добавил 506KB бандл — настроить `manualChunks` в vite.config.ts
- [ ] Lazy loading для страниц admin

**7.16 Тесты**
- [ ] Backend: JUnit тесты для BarrelService (логика начисления)
- [ ] Frontend: Vitest тесты для утилит

---

## 8. Известные баги и технический долг

| # | Файл | Описание | Приоритет |
|---|---|---|---|
| 1 | `StageService.java:85` | `new User()` без ID при создании проекта — падает с FK constraint | 🔴 Высокий |
| 2 | `AdminReviewPage.tsx` | Показывает все submitted этапы, не фильтрует по userId | 🟡 Средний |
| 3 | `frontend/` | Нет страницы загрузки аватара `/dashboard/avatar` | 🟡 Средний |
| 4 | `vite.config.ts` | Нет code splitting — бандл 506KB из-за Motion | 🟢 Низкий |
| 5 | `application.yml` | MinIO configured but no MinIO server running | 🟢 Низкий |
| 6 | `frontend/` | React Router v6 future flag warnings в консоли | 🟢 Низкий |

---

## 9. Структура файлов (ключевые)

```
backend/src/main/java/kz/kmg/dmaic/
├── config/
│   ├── SecurityConfig.java       ← JWT, CORS, правила доступа
│   ├── AdminInitializer.java     ← создаёт admin при старте
│   └── MinioConfig.java          ← MinIO bean
├── controller/
│   ├── AuthController.java       ← POST /api/auth/login
│   ├── UserController.java       ← GET/POST /api/users/me
│   ├── StageController.java      ← GET/PUT/POST /api/stages/**
│   ├── AdminController.java      ← /api/admin/**
│   └── LeaderboardController.java ← GET /api/leaderboard
├── service/
│   ├── BarrelService.java        ← логика баррелей (editировать сюда при изменении шкалы)
│   ├── StageService.java         ← основная бизнес-логика этапов
│   └── ...
├── entity/                       ← JPA сущности
├── dto/                          ← request/response объекты
└── security/
    ├── JwtService.java           ← генерация/валидация токенов
    └── JwtAuthFilter.java        ← Spring Security фильтр

frontend/src/
├── api/                          ← Axios вызовы (auth, stages, admin, leaderboard)
├── components/
│   ├── Layout.tsx                ← шапка, навигация
│   ├── BarrelProgress.tsx        ← прогресс-бар с уровнями наград
│   ├── StageCard.tsx             ← карточка этапа
│   └── Leaderboard.tsx           ← таблица рейтинга
├── pages/
│   ├── HomePage.tsx              ← публичный лидерборд
│   ├── LoginPage.tsx             ← форма входа
│   ├── DashboardPage.tsx         ← кабинет участника
│   ├── StagePage.tsx             ← заполнение этапа
│   └── admin/
│       ├── AdminPage.tsx         ← список участников
│       └── AdminReviewPage.tsx   ← проверка этапов
├── store/authStore.ts            ← Zustand: token, role, userId
├── i18n/ru.json + kz.json       ← переводы
└── types/index.ts                ← TypeScript типы
```

---

## 10. Логика баррелей (BarrelService.java)

```
adminScore >= 100  →  5 баррелей
adminScore >= 80   →  4 барреля
adminScore >= 50   →  2 барреля
adminScore >= 40   →  1 баррель
adminScore < 40    →  0 баррелей

Итого max: 20 баррелей (4 этапа × 5)

Награды:
16-20 баррелей → JAPAN_TRIP        (стажировка/Япония + награда от Председателя)
12-15 баррелей → LEADERSHIP_AWARD  (награда от руководителя + Председателя)
8-14  баррелей → BRANDED_MERCH     (рюкзак+кепка+бомбер/термос/блокнот)
0-7   баррелей → PROJECT_BADGE     (значок проекта)
```

---

## 11. Дизайн-токены (DESIGN.md)

```
Canvas:     #010102  (почти чёрный с синим оттенком — не #000000!)
Surface-1:  #0f1011
Surface-2:  #141516
Surface-3:  #18191a
Hairline:   #23252a
Accent:     #5e6ad2  (lavender-blue — только на CTA и focus)
Barrel:     #D4A017  (золотой — геймификация)
Text:       #f7f8f8 / #d0d6e0 / #8a8f98 / #62666d
Success:    #27a644
Danger:     #e54d2e

Font:       Inter (major-second scale, negative tracking)
Icons:      @phosphor-icons/react (Phosphor Bold weight)
Animation:  motion/react, ease [0.16, 1, 0.3, 1], stagger 40-70ms
```

---

## 12. Установленные AI-скиллы

Все скиллы в `C:\Users\NewAdmin\.claude\skills\`:

| Скилл | Когда использовать |
|---|---|
| `awesome-design-md` | Когда нужен новый дизайн — взять DESIGN.md из папки (Linear, Notion, Stripe и др.) |
| `ui-ux-pro-max-skill` | Поиск UI стилей, цветовых палитр, chart types по домену |
| `taste-skill` | Правила anti-slop дизайна, motion, иконки, анимации |
| `google-fonts-skill` | Выбор шрифтов и типографических систем |
| `playwright-cli` | Скриншоты и тестирование UI через браузер |
| `shadcn-ui-blocks` | Готовые UI-блоки (hero, features, pricing, stats) |
| `security-review` | Проверка безопасности перед деплоем |
| `code-review --fix` | Ревью кода и автоматическое исправление |
| `verify` / `run` | Запуск и проверка что всё работает |
