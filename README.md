# DMAIC Platform — КазМунайГаз

Внутренняя платформа геймификации для программы непрерывного совершенствования КМГ на основе методологии Six Sigma DMAIC. Участники проходят 4 этапа, получают баррели за каждый шаг и соревнуются в публичном рейтинге.

---

## Содержание

- [Обзор проекта](#обзор-проекта)
- [Технологический стек](#технологический-стек)
- [Архитектура](#архитектура)
- [Дизайн-система](#дизайн-система)
- [Страницы и маршруты](#страницы-и-маршруты)
- [Система ролей и безопасность](#система-ролей-и-безопасность)
- [Логика начисления баррелей](#логика-начисления-баррелей)
- [Этапы DMAIC и дедлайны](#этапы-dmaic-и-дедлайны)
- [Запуск проекта](#запуск-проекта)
- [Переменные окружения](#переменные-окружения)
- [Структура файлов](#структура-файлов)

---

## Обзор проекта

DMAIC Platform — корпоративный веб-сервис, где сотрудники КМГ:

- Регистрируют прогресс по каждому из 4 этапов DMAIC
- Загружают материалы и получают оценки от администраторов
- Зарабатывают **баррели** (от 0 до 5 за этап, максимум 20 за всю программу)
- Видят своё место в **публичном рейтинге**
- Получают награды: стажировка в Японии, награждение от руководства, брендированная продукция или значок проекта

---

## Технологический стек

### Фронтенд

| Технология | Версия | Назначение |
|---|---|---|
| **React** | 18 | UI-фреймворк |
| **TypeScript** | 5 | Статическая типизация |
| **Vite** | 5 | Сборщик и dev-сервер |
| **Tailwind CSS** | 3 | Утилитарные стили |
| **motion/react** (Framer Motion) | 12 | Анимации и переходы |
| **GSAP + ScrollTrigger** | 3 | Scroll-driven анимации |
| **Three.js** | 0.184 | WebGL — hero-canvas с icosahedron |
| **React Router** | v6 | Маршрутизация SPA |
| **Zustand** | 4 | Глобальное состояние (auth, theme) |
| **Axios** | 1.7 | HTTP-клиент с JWT-интерсепторами |
| **react-i18next** | 14 | Двуязычность (RU / KZ) |
| **Phosphor Icons** | 2 | Основные иконки |
| **Lucide React** | latest | Дополнительные иконки |
| **Radix UI** | — | Примитивы: Avatar, Dialog, Dropdown, Tabs, Checkbox, Label, Slot |
| **class-variance-authority** | 0.7 | Варианты компонентов (CVA) |
| **clsx + tailwind-merge** | — | Условные классы |
| **Geist** | 1.7 | Системный шрифт (sans + mono) |

### Бэкенд

| Технология | Версия | Назначение |
|---|---|---|
| **Java** | 21 | Язык бэкенда |
| **Spring Boot** | 3 | Фреймворк |
| **Spring Security** | — | Аутентификация и авторизация |
| **JWT (JJWT)** | — | Stateless-токены |
| **Spring Data JPA** | — | ORM |
| **PostgreSQL** | — | Основная база данных |
| **Flyway** | — | Миграции БД |
| **MinIO** | — | S3-совместимое хранилище для аватаров |

### Инфраструктура

| Инструмент | Назначение |
|---|---|
| **Docker + docker-compose** | PostgreSQL + MinIO локально |
| **.env** | Секреты: JWT, DB, Admin credentials |

---

## Архитектура

```
dmaic-platform/
├── backend/                        # Spring Boot приложение
│   └── src/main/java/kz/kmg/dmaic/
│       ├── entity/                 # JPA-сущности: User, Project, DmaicStage, Barrel
│       ├── repository/             # Spring Data репозитории
│       ├── service/                # Бизнес-логика (BarrelService, StorageService…)
│       ├── controller/             # REST-контроллеры
│       ├── security/               # JWT-фильтр, SecurityConfig
│       ├── dto/                    # Request/Response DTO
│       └── config/                 # CORS, Storage, i18n
│
└── frontend/                       # React + Vite приложение
    └── src/
        ├── api/                    # Axios-клиент с JWT-интерсепторами
        ├── components/             # Общие компоненты
        │   ├── ui/                 # Базовые UI: Button, Card, Table, Badge…
        │   ├── Layout.tsx          # Обёртка с навбаром
        │   ├── Leaderboard.tsx     # Таблица рейтинга
        │   ├── DMAICTimeline.tsx   # Орбитальная таймлайн-схема
        │   ├── ThemeToggle.tsx     # Переключатель темы
        │   └── BarrelIcon.tsx      # SVG-иконка барреля
        ├── pages/                  # Страницы по роутам
        ├── store/                  # Zustand: authStore, themeStore
        ├── i18n/                   # ru.json, kz.json
        └── types/                  # TypeScript-типы
```

Фронтенд и бэкенд — два независимых сервера. Vite проксирует `/api` → `:8080` в режиме разработки.

---

## Дизайн-система

### Философия

Дизайн построен на принципе **«тёмный, минималистичный, премиальный»** — почти чёрный фон с белым текстом и едва заметными синими акцентами. Вдохновение: Linear, Vercel, Apple. Корпоративная идентичность КМГ сохраняется через структуру и пространство, а не через агрессивное использование фирменных цветов.

---

### Цветовая палитра

#### Тёмная тема (по умолчанию)

| Переменная | HEX | Назначение |
|---|---|---|
| `--canvas` | `#010102` | Фон всей страницы |
| `--s1` | `#0f1011` | Поверхность 1-го уровня (карточки) |
| `--s2` | `#141516` | Поверхность 2-го уровня |
| `--s3` | `#18191a` | Поверхность 3-го уровня |
| `--hl` | `#23252a` | Разделители, бордеры |
| `--hl-strong` | `#34343a` | Акцентные бордеры |
| `--accent` | `#5b8dee` | Основной синий акцент |
| `--accent-hover` | `#7aa3f5` | Hover акцента |
| `--accent-focus` | `#4a7de0` | Нажатое состояние |
| `--barrel` | `#D4A017` | Золото — цвет баррелей |
| `--ink` | `#f7f8f8` | Основной текст |
| `--ink-muted` | `#d0d6e0` | Приглушённый текст |
| `--ink-subtle` | `#8a8f98` | Вторичный текст |
| `--ink-tertiary` | `#62666d` | Третичный текст |
| `--success` | `#27a644` | Зелёный — одобрено |
| `--danger` | `#e54d2e` | Красный — отклонено |
| `--warning` | `#D4A017` | Предупреждение |

#### Светлая тема

Переменные инвертируются: `--canvas` → `#ffffff`, поверхности светлеют, `--ink` темнеет до `#0f1011`. Переключение через `document.documentElement.classList` и `data-theme` атрибут. Плавный переход всех CSS-переменных — 200ms.

---

### Типографика

**Шрифт**: Geist Sans (Vercel) — современный системный шрифт с поддержкой кириллицы. Fallback: `ui-sans-serif, system-ui`.

| Класс | Размер | Вес | Трекинг | Применение |
|---|---|---|---|---|
| `.text-display` | 40px | 600 | −1.0px | Главные заголовки страниц |
| `.text-headline` | 28px | 600 | −0.6px | Заголовки секций |
| `.text-card-title` | 20px | 500 | −0.3px | Заголовки карточек |
| `.text-body-lg` | 16px | 400 | −0.1px | Крупный основной текст |
| `.text-body` | 14px | 400 | −0.1px | Основной текст |
| `.text-caption` | 12px | 400 | 0px | Подписи, метки |
| `.eyebrow` | 11px | 700 | +0.08em | Рубрики (UPPERCASE) |
| `.barrel` | 13px | 700 | −0.02em | Числа баррелей |

---

### Компоненты UI

#### Навбар — `MiniNavbar`

Плавающий pill-навбар, `position: fixed, top: 20px, left: 50%`. Структура — CSS Grid `1fr auto 1fr`:

- **Левая колонка**: логотип `favicon.svg`, белый в тёмной теме
- **Центр**: навлинки. Ссылка «Главная» — без анимации. Остальные — slide-up hover: текст дублируется в `flex-col`, на hover сдвигается `-50%` по Y
- **Правая колонка**: ThemeToggle (42×42px) + языковой переключатель (height 42px) + кнопка «Войти»/«Выйти»
- **Мобильная версия**: бургер-кнопка, меню раскрывается с `max-height: 0 → 384px`. Форма navbar меняется с `rounded-full` на `rounded-2xl` при открытии

#### ThemeToggle

Круглая кнопка 42×42px. При клике иконка делает оборот 360° через `motion.div`. Без focus-ring и box-shadow.

#### HeroCanvas — WebGL

Three.js сцена в `position: absolute`, выходит за пределы layout-контейнера через `left: 50%; transform: translateX(-50%); width: 100vw`:

- **Геометрия**: `IcosahedronGeometry(1.5, 72)` — икосаэдр с высоким subdivision, позиция сдвинута вправо `x: 2.6`
- **Шейдер вершин**: Perlin noise displacement — вершины смещаются по нормалям: `snoise(position * 2.0 + time * 0.45) * 0.22`
- **Шейдер фрагментов**: диффузное освещение + Fresnel-эффект, интерполяция цвета `#5b8dee → #7c6ef5`
- **Интерактивность**: точечный источник света следует за курсором через `mousemove → unproject`
- **Вторая сфера**: `IcosahedronGeometry(0.9, 4)` вращается в обратную сторону, wireframe, opacity 0.08
- **Частицы**: 140 точек в случайных позициях, синий `PointsMaterial`, opacity 0.45
- **Сетка**: 3 горизонтальные + 3 вертикальные линии анимируются `scaleX/scaleY 0 → 1` через CSS `@keyframes`

#### RadialOrbitalTimeline

Орбитальная схема DMAIC из 21st.dev:

- Центральный орб с градиентом `purple→blue→teal`, двойной ping-эффект
- 4 узла на орбите радиуса 200px, авто-вращение 0.3° каждые 50ms
- Клик на узел: пауза вращения, карточка с описанием этапа, дедлайном, прогресс-баром и связями
- Связанные этапы подсвечиваются и пульсируют
- Клик на фон → возобновление вращения

#### ContainerScroll

Scroll-driven анимация вокруг таблицы рейтинга: карточка «встаёт» из наклонного положения в прямое при скролле. `rotateX: 20→0`, `scale: 0.92→1`, `y: 80→0`. Реализовано через `useScroll + useTransform` из Framer Motion.

#### Leaderboard

Таблица участников:

- Полосатые строки: нечётные — `rgba(91,141,238,0.025)`
- Топ-3: золотой/серебряный/бронзовый круглый бейдж вместо числа
- Аватар с fallback-инициалами
- Прогресс-бар баррелей анимируется `motion.div width: 0 → X%` с задержкой `i * 0.04s`
- Колонка «Награда» с иконкой и названием приза

---

### Анимации

| Эффект | Реализация | Длительность |
|---|---|---|
| Появление hero | `motion.div` initial `opacity:0, y:24, blur:8px` | 750ms |
| Hover CTA-кнопки | `motion.span` width `0 → 18px` | 280ms |
| Строки таблицы | `motion.tr` stagger 40ms, `x: -8 → 0` | 350ms |
| Прогресс-бар барреля | `motion.div` width | 600ms |
| Орбита DMAIC | setInterval + translateX/Y | 50ms/кадр |
| Смена темы | CSS transition на переменных | 200ms |
| Навбар мобильный | `max-height` transition | 300ms |
| Иконка ThemeToggle | `motion.div` rotate 360° | 420ms |

**Кривая**: `[0.32, 0.72, 0, 1]` — кастомный cubic-bezier, схожий с Apple spring easing.

---

## Страницы и маршруты

| Роут | Компонент | Доступ | Описание |
|---|---|---|---|
| `/` | `HomePage` | Публичный | Hero с WebGL, рейтинг, DMAIC-орбита |
| `/login` | `LoginPage` | Публичный | Форма входа с JWT |
| `/dashboard` | `DashboardPage` | PARTICIPANT | Обзор проекта, прогресс по этапам |
| `/dashboard/stage/:stage` | `StagePage` | PARTICIPANT | Работа с этапом (d / ma / i / c) |
| `/admin` | `AdminPage` | ADMIN | Список участников и их прогресс |
| `/admin/review/:userId` | `AdminReviewPage` | ADMIN | Проверка и оценка этапа участника |

---

## Система ролей и безопасность

**Роли**: `ROLE_PARTICIPANT` и `ROLE_ADMIN`.

Аутентификация — stateless JWT (HMAC-SHA). Токен хранится в Zustand + localStorage. Axios-интерсептор добавляет `Authorization: Bearer <token>` к каждому запросу автоматически.

Защищённые роуты на фронтенде: `authStore.role` проверяется в React Router. Неавторизованный пользователь редиректится на `/login`.

На бэкенде:
- `/api/admin/**` — только ADMIN
- `/api/leaderboard` — публичный (без токена)
- Остальные `/api/**` — требуют валидный токен

Аккаунт администратора создаётся автоматически при старте через `AdminInitializer` если username ещё не существует. Никаких hardcoded-паролей в коде нет — всё через `.env`.

---

## Логика начисления баррелей

Администратор выставляет оценку от 0 до 100 за каждый этап. Система конвертирует:

| Оценка | Баррели |
|---|---|
| ≥ 100 | 5 баррелей |
| ≥ 80 | 4 барреля |
| ≥ 50 | 2 барреля |
| ≥ 40 | 1 баррель |
| < 40 | 0 баррелей |

**Максимум**: 20 баррелей (4 × 5). Итог вычисляется в `BarrelService.computeReward()`.

---

## Этапы DMAIC и дедлайны

| Этап | Расшифровка | Дедлайн |
|---|---|---|
| **D** — Define | Определение проблемы, устав проекта, VOC | 30.06.2026 |
| **M/A** — Measure + Analyze | Сбор данных, измерение, анализ причин | 30.08.2026 |
| **I** — Improve | Разработка решений, пилотное тестирование | 30.11.2026 |
| **C** — Control | Контроль, план управления, документирование | 20.12.2026 |

Статусы: `DRAFT` → `SUBMITTED` → `APPROVED` / `REJECTED`.

---

## Запуск проекта

### Требования

- Java 21+
- Node.js 18+
- Docker + Docker Compose

### 1. Инфраструктура

```bash
cp .env.example .env
# Заполнить переменные в .env
docker-compose up -d
```

### 2. Бэкенд

```bash
cd backend
./mvnw spring-boot:run
# http://localhost:8080
```

### 3. Фронтенд

```bash
cd frontend
npm install
npm run dev
# http://localhost:5173
# /api/* → :8080 проксируется автоматически
```

### Продакшен-сборка

```bash
cd backend && ./mvnw clean package -DskipTests
cd frontend && npm run build   # → frontend/dist/
```

---

## Переменные окружения

| Переменная | Описание |
|---|---|
| `JWT_SECRET` | Секрет подписи токенов, минимум 32 символа. **Обязательно**, без него приложение не запускается |
| `DB_PASSWORD` | Пароль PostgreSQL |
| `ADMIN_USERNAME` | Логин администратора (создаётся при первом старте) |
| `ADMIN_PASSWORD` | Пароль администратора |

---

## Структура файлов

```
frontend/src/
├── api/
│   ├── auth.ts              # login/logout
│   ├── leaderboard.ts       # GET /api/leaderboard
│   ├── projects.ts          # CRUD проектов
│   └── admin.ts             # Админские эндпоинты
├── components/
│   ├── ui/
│   │   ├── avatar.tsx
│   │   ├── badge.tsx
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── container-scroll-animation.tsx
│   │   ├── dmaic-canvas.tsx              # WebGL aurora
│   │   ├── hero-canvas.tsx               # WebGL icosahedron
│   │   ├── mini-navbar.tsx               # Floating pill navbar
│   │   ├── radial-orbital-timeline.tsx   # DMAIC орбита
│   │   └── table.tsx
│   ├── BarrelIcon.tsx
│   ├── DMAICTimeline.tsx
│   ├── Layout.tsx
│   ├── Leaderboard.tsx
│   └── ThemeToggle.tsx
├── i18n/
│   ├── ru.json
│   └── kz.json
├── pages/
│   ├── HomePage.tsx
│   ├── LoginPage.tsx
│   ├── DashboardPage.tsx
│   ├── StagePage.tsx
│   └── admin/
│       ├── AdminPage.tsx
│       └── AdminReviewPage.tsx
├── store/
│   ├── authStore.ts         # JWT токен, роль
│   └── themeStore.ts        # dark / light
└── types/
    └── index.ts
```

---

*Внутренний проект КазМунайГаз — все права защищены.*
