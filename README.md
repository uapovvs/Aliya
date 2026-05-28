<div align="center">

<img src="frontend/public/KazMunayGas_logo.svg" alt="KazMunayGas" height="80" style="filter: brightness(0) invert(1);" />

# DMAIC Platform

### Внутренняя платформа геймификации КазМунайГаз — на основе методологии Six Sigma

[![React](https://img.shields.io/badge/React_18-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://typescriptlang.org)
[![Spring Boot](https://img.shields.io/badge/Spring_Boot_3-6DB33F?style=flat-square&logo=springboot&logoColor=white)](https://spring.io/projects/spring-boot)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=flat-square&logo=postgresql&logoColor=white)](https://postgresql.org)
[![Three.js](https://img.shields.io/badge/Three.js-000000?style=flat-square&logo=threedotjs&logoColor=white)](https://threejs.org)
[![JWT](https://img.shields.io/badge/JWT-000000?style=flat-square&logo=jsonwebtokens&logoColor=white)](https://jwt.io)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev)
[![Tailwind](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)

<br/>

> Тёмный. Минималистичный. Премиальный.  
> Полнофункциональная платформа с WebGL-анимациями, ролевой системой и публичным рейтингом участников.

<br/>

</div>

---

## ✦ Что это такое?

DMAIC Platform — корпоративный веб-сервис, где сотрудники КМГ проходят 4 этапа программы непрерывного совершенствования (D → M/A → I → C), получают **баррели** за каждый шаг и соревнуются в публичном рейтинге. Администраторы оценивают работы и назначают награды — вплоть до стажировки в Японии.

---

## ✦ Архитектура

```
  Участник / Администратор
           │
           ▼
   React SPA (Vite)          ← порт 5173
  /  /login  /dashboard
  /dashboard/stage/:stage
  /admin  /admin/review/:id
           │
     Axios + JWT Bearer
           │
           ▼
   Spring Boot REST API       ← порт 8080
           │
    ┌──────┴──────┐
    │             │
 PostgreSQL     MinIO
 (Flyway)    (аватары)
```

Фронтенд и бэкенд — два независимых сервера. В dev-режиме Vite проксирует `/api` → `:8080` автоматически.

---

## ✦ Технологический стек

### Фронтенд

| Технология | Назначение |
|---|---|
| **React 18 + TypeScript** | UI-фреймворк со статической типизацией |
| **Vite 5** | Сборщик и dev-сервер |
| **Tailwind CSS 3** | Утилитарные стили |
| **Framer Motion 12** | Анимации, переходы, scroll-driven эффекты |
| **GSAP + ScrollTrigger** | Сложные scroll-анимации |
| **Three.js 0.184** | WebGL — анимированный icosahedron в hero-секции |
| **React Router v6** | Маршрутизация SPA с защищёнными роутами |
| **Zustand 4** | Глобальное состояние: auth, theme |
| **Axios 1.7** | HTTP-клиент с JWT-интерсепторами |
| **react-i18next** | Двуязычность: русский / казахский |
| **Radix UI** | Примитивы: Avatar, Dialog, Dropdown, Tabs |
| **Geist** | Системный шрифт (Vercel) |

### Бэкенд

| Технология | Назначение |
|---|---|
| **Java 21 + Spring Boot 3** | Основной фреймворк |
| **Spring Security + JWT** | Stateless-аутентификация |
| **Spring Data JPA** | ORM |
| **PostgreSQL** | Основная база данных |
| **Flyway** | Версионные миграции БД |
| **MinIO** | S3-совместимое хранилище аватаров |

---

## ✦ Возможности

### 🏆 Публичный рейтинг
- Таблица участников отсортированная по количеству баррелей
- Scroll-driven анимация: карточка «встаёт» из наклонного положения при скролле
- Топ-3 — золотой/серебряный/бронзовый бейдж
- Прогресс-бар баррелей с анимацией

### 🌐 Hero-секция с WebGL
- Three.js icosahedron с 72 subdivisions
- Кастомный GLSL шейдер: Perlin noise displacement вершин
- Fresnel-эффект: интерполяция `#5b8dee → #7c6ef5`
- Точечный источник света следует за курсором мыши
- 140 плавающих частиц + анимированная сетка

### 🎯 Орбитальная схема DMAIC
- 4 узла на орбите радиуса 200px, авто-вращение
- Клик → карточка с описанием этапа, дедлайном, прогрессом
- Связанные этапы подсвечиваются и пульсируют

### 👤 Личный кабинет участника
- Обзор прогресса по всем 4 этапам
- Загрузка материалов для каждого этапа
- Просмотр статуса и комментария администратора

### 🛡️ Панель администратора
- Список всех участников и их прогресс
- Просмотр загруженных материалов
- Выставление оценки (0–100) и комментария
- Автоматическое начисление баррелей

### 🌓 Двойная тема
- Тёмная (по умолчанию) и светлая тема
- Переключение без перезагрузки, плавный transition 200ms
- Лого КМГ адаптируется: белый в тёмной, оригинал в светлой

---

## ✦ Система баррелей

Администратор выставляет оценку от 0 до 100 за каждый этап:

| Оценка | Баррели |
|---|---|
| ≥ 100 | ◆◆◆◆◆ 5 баррелей |
| ≥ 80 | ◆◆◆◆ 4 барреля |
| ≥ 50 | ◆◆ 2 барреля |
| ≥ 40 | ◆ 1 баррель |
| < 40 | 0 баррелей |

**Максимум**: 20 баррелей (4 этапа × 5)

### Награды

| Баррели | Награда |
|---|---|
| 20 | ✈️ Стажировка в Японии |
| 16–19 | 🏆 Награждение от руководства |
| 10–15 | 🎁 Брендированная продукция КМГ |
| 1–9 | 🔖 Значок проекта |

---

## ✦ Этапы DMAIC

| # | Этап | Описание | Дедлайн |
|---|---|---|---|
| 01 | **D** — Define | Определение проблемы, устав проекта, голос клиента (VOC) | 30.06.2026 |
| 02 | **M/A** — Measure + Analyze | Сбор данных, измерение процесса, анализ корневых причин | 30.08.2026 |
| 03 | **I** — Improve | Разработка решений, пилотное тестирование, оптимизация | 30.11.2026 |
| 04 | **C** — Control | Контроль результатов, план управления, документирование | 20.12.2026 |

Статусы этапа: `DRAFT` → `SUBMITTED` → `APPROVED` / `REJECTED`

---

## ✦ Роли и доступ

| Роль | Доступ | Описание |
|---|---|---|
| 👤 **Участник** | `/dashboard`, `/dashboard/stage/:stage` | Работа с этапами, просмотр прогресса |
| 🛡️ **Администратор** | `/admin`, `/admin/review/:userId` | Оценка работ, управление участниками |
| 🌐 **Гость** | `/`, `/login` | Просмотр публичного рейтинга |

Токен хранится в Zustand + localStorage. Axios-интерсептор добавляет `Authorization: Bearer` к каждому запросу. Неавторизованный пользователь редиректится на `/login`.

---

## ✦ REST API

### Auth
| Метод | Endpoint | Доступ | Описание |
|---|---|---|---|
| `POST` | `/api/auth/login` | — | Вход, возвращает JWT |
| `GET` | `/api/auth/me` | ✓ | Текущий пользователь |

### Leaderboard
| Метод | Endpoint | Доступ | Описание |
|---|---|---|---|
| `GET` | `/api/leaderboard` | Публичный | Рейтинг участников |

### Stages
| Метод | Endpoint | Доступ | Описание |
|---|---|---|---|
| `GET` | `/api/stages/:stage` | PARTICIPANT | Данные этапа |
| `POST` | `/api/stages/:stage/submit` | PARTICIPANT | Отправить на проверку |

### Admin
| Метод | Endpoint | Доступ | Описание |
|---|---|---|---|
| `GET` | `/api/admin/users` | ADMIN | Все участники |
| `GET` | `/api/admin/review/:userId` | ADMIN | Работы участника |
| `POST` | `/api/admin/review/:userId/score` | ADMIN | Выставить оценку |

---

## ✦ Дизайн-система

### Цвета

```
--canvas:       #010102   ← Фон страницы
--s1:           #0f1011   ← Карточки
--s2:           #141516   ← Вложенные элементы
--accent:       #5b8dee   ← Синий акцент
--barrel:       #D4A017   ← Золото баррелей
--ink:          #f7f8f8   ← Основной текст
--ink-subtle:   #8a8f98   ← Вторичный текст
--success:      #27a644   ← Одобрено
--danger:       #e54d2e   ← Отклонено
```

### Типографика

Шрифт: **Geist Sans** — современный системный шрифт Vercel с поддержкой кириллицы.

```
display     40px / 600 / −1.0px   ← Главные заголовки
headline    28px / 600 / −0.6px   ← Заголовки секций
body-lg     16px / 400 / −0.1px   ← Основной текст
body        14px / 400 / −0.1px   ← Интерфейсный текст
caption     12px / 400 /  0px     ← Подписи
eyebrow     11px / 700 / +0.08em  ← Рубрики (UPPERCASE)
```

### Анимации

```
Кривая:     cubic-bezier(0.32, 0.72, 0, 1)   ← Apple-like spring
Hero:       opacity 0→1, y 24→0, blur 8→0px  750ms
Строки:     stagger 40ms, x −8→0px           350ms
Баррели:    width 0→X% анимация              600ms
Орбита:     0.3°/50ms, авто-вращение
Тема:       CSS variables transition          200ms
```

---

## ✦ Запуск

### Требования

- Java 21+
- Node.js 18+
- Docker + Docker Compose

### 1. Инфраструктура

```bash
cp .env.example .env
# Заполнить .env
docker-compose up -d
```

### 2. Бэкенд

```bash
cd backend
./mvnw spring-boot:run
# → http://localhost:8080
```

### 3. Фронтенд

```bash
cd frontend
npm install
npm run dev
# → http://localhost:5173
```

---

## ✦ Переменные окружения

```env
JWT_SECRET=your-secret-key-minimum-32-characters   # обязательно
DB_PASSWORD=your_db_password
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin_password
```

> `JWT_SECRET` не имеет дефолтного значения — приложение не запустится без него.

---

## ✦ Структура проекта

```
dmaic-platform/
├── backend/                    # Spring Boot
│   └── src/main/java/kz/kmg/dmaic/
│       ├── entity/             # User, Project, DmaicStage, Barrel
│       ├── service/            # BarrelService, StorageService
│       ├── controller/         # REST-контроллеры
│       └── security/           # JWT, SecurityConfig
│
└── frontend/                   # React + Vite
    └── src/
        ├── components/
        │   ├── ui/
        │   │   ├── hero-canvas.tsx           # WebGL icosahedron
        │   │   ├── radial-orbital-timeline   # DMAIC орбита
        │   │   ├── mini-navbar.tsx           # Floating pill nav
        │   │   └── container-scroll-animation
        │   ├── Leaderboard.tsx
        │   ├── DMAICTimeline.tsx
        │   └── ThemeToggle.tsx
        ├── pages/
        │   ├── HomePage.tsx
        │   ├── DashboardPage.tsx
        │   ├── StagePage.tsx
        │   └── admin/
        ├── store/              # authStore, themeStore
        └── i18n/               # ru.json, kz.json
```

---

<div align="center">

**DMAIC Platform** — КазМунайГаз · 2026

</div>
