# HW1_RBPO: Notes Service

Проект для EK1 по РБПО: минимальный веб-API сервиса личных заметок с развернутой концепцией безопасности.

## Что это за продукт

Notes Service - это backend для хранения личных текстовых заметок. Пользователь может создать заметку, посмотреть список своих заметок, открыть конкретную заметку, обновить ее поля, архивировать или удалить запись.

На EK1 реализована минимальная техническая основа, а не полный production-продукт. API работает локально, хранит данные в памяти процесса и показывает ключевую границу доверия: недоверенный HTTP-запрос должен пройти авторизацию, проверку входных данных и owner-scoped доступ к заметкам.

Главная ценность продукта - содержимое личных заметок. Поэтому центральная линия безопасности: нельзя читать, изменять или удалять заметки без авторизации, а входные данные должны проверяться до попадания в хранилище.

## Быстрый старт

Требования:

- Node.js 22+;
- pnpm 10.x.

Установка и сборка:

```bash
pnpm install
pnpm build
```

Запуск в Linux/macOS:

```bash
NOTES_API_TOKEN=dev-token pnpm start
```

Запуск в PowerShell:

```powershell
$env:NOTES_API_TOKEN = "dev-token"
pnpm start
```

Проверка:

```bash
curl http://localhost:4300/health
curl -H "Authorization: Bearer dev-token" http://localhost:4300/notes
```

Ожидаемый результат:

- `GET /health` возвращает `{"status":"ok","service":"notes-service"}`;
- `GET /notes` с корректным token возвращает список заметок;
- `GET /notes` без token возвращает `401`.

## API

| Метод | Путь | Назначение | Авторизация |
| --- | --- | --- | --- |
| `GET` | `/health` | Проверка живости сервиса | Нет |
| `GET` | `/notes` | Список заметок текущего пользователя | Да |
| `POST` | `/notes` | Создание заметки | Да |
| `GET` | `/notes/:id` | Чтение одной заметки | Да |
| `PATCH` | `/notes/:id` | Обновление заметки | Да |
| `DELETE` | `/notes/:id` | Удаление заметки | Да |

Пример создания заметки:

```bash
curl -X POST http://localhost:4300/notes \
  -H "Authorization: Bearer dev-token" \
  -H "Content-Type: application/json" \
  -d "{\"title\":\"План защиты\",\"content\":\"Показать T-01 -> SR-01 -> D-01\",\"tags\":[\"ek1\"]}"
```

## Проверки

```bash
pnpm test
pnpm typecheck
pnpm build
```

Тесты проверяют:

- отказ без bearer token;
- создание, чтение, обновление и удаление заметки;
- нормализацию тегов;
- базовые правила валидации;
- наличие `X-Content-Type-Options: nosniff`;
- отказ на некорректный JSON;
- изоляцию заметок по `ownerId` на уровне хранилища.

## Структура

```text
src/
  http.ts      HTTP-маршрутизация, авторизация, JSON-ответы
  main.ts      точка запуска сервиса
  store.ts     in-memory хранилище, CRUD и валидация
  types.ts     типы домена и ошибок
test/
  run-tests.ts интеграционные и модульные проверки
docs/ek1/
  security-requirements.md требования SR-*
  threat-model.md          угрозы T-*
  security-decisions.md    решения D-* и будущие проверки
  traceability.md          матрица T -> SR -> D -> проверка
DEFENSE_GUIDE.md           сценарий защиты и ответы на вопросы
PROJECT.md                 описание продукта, границы и запуска
```

## Материалы EK1

- [PROJECT.md](PROJECT.md)
- [Требования безопасности](docs/ek1/security-requirements.md)
- [Модель угроз](docs/ek1/threat-model.md)
- [Проектные решения безопасности](docs/ek1/security-decisions.md)
- [Матрица трассировки](docs/ek1/traceability.md)
- [Гайд для защиты](DEFENSE_GUIDE.md)
- [CONTRIBUTIONS.md](CONTRIBUTIONS.md)
- [AI_USAGE.md](AI_USAGE.md)
- [SUBMISSION.md](SUBMISSION.md)

Основная цепочка для защиты:

```text
T-01 Unauthorized Disclosure
  -> SR-01 Authentication Required + SR-02 Note Ownership Isolation
  -> D-01 Token Gate And Owner-Scoped Store
  -> D-01-V1 / D-01-V4 / D-01-V5
```

Версия для сдачи фиксируется отдельно в `SUBMISSION.md`: преподавателю передается URL репозитория и финальный commit hash или tag `ek1`.
