# Contributions

Файл фиксирует наблюдаемый вклад команды для EK1. Проект выполнялся тремя участниками, поэтому используются обозначения `M1`, `M2`, `M3`.

Если преподавателю нужны реальные ФИО, эти обозначения можно заменить на имена участников без изменения структуры вклада.

## M1: техническая реализация и автоматические проверки

- Реализовал минимальный HTTP API сервиса заметок: `src/http.ts`, `src/main.ts`.
- Реализовал доменную модель, owner-scoped in-memory хранилище и валидацию заметок: `src/types.ts`, `src/store.ts`.
- Подготовил и расширил автоматические проверки авторизации, CRUD, owner isolation, invalid JSON, oversized body и security headers: `test/run-tests.ts`.
- Проверил, что `pnpm test` подтверждает `401` без token, `401` с неверным token, CRUD с корректным token, `404` для отсутствующей заметки, owner isolation на уровне `NotesStore`, invalid JSON, oversized body и `nosniff`.
- Запустил `pnpm typecheck` и подтвердил отсутствие TypeScript-ошибок.
- Запустил `pnpm build` и подтвердил, что проект собирается в `dist`.

Зона понимания для защиты:

- объяснить структуру `src/http.ts`, `src/store.ts`, `src/types.ts`, `src/main.ts`;
- показать, где проверяется bearer token;
- показать, где реализованы CRUD-операции;
- объяснить, как тесты подтверждают основное поведение API.

## M2: модель угроз, требования и security decisions

- Подготовил требования безопасности `SR-01` - `SR-09`: `docs/ek1/security-requirements.md`.
- Подготовил модель угроз `T-01` - `T-07`, `T-09` - `T-11` без смешивания с процессом сдачи: `docs/ek1/threat-model.md`.
- Описал проектные решения `D-01` - `D-05`, проверки `D-XX-VY`, counterexample analysis и сравнение Bearer Token vs JWT/Session: `docs/ek1/security-decisions.md`.
- Составил матрицу трассировки `T-* -> SR-* -> D-* -> Verification`: `docs/ek1/traceability.md`.
- Сверил различие между `T-01 Unauthorized Disclosure` и `T-10 Unauthorized Modification Or Deletion`.
- Сверил, что `D-01-V5` связан с cross-user access isolation и отражен в цепочках для `T-01` и `T-10`.

Зона понимания для защиты:

- объяснить границу доверия HTTP API;
- объяснить активы Notes Service;
- пройти цепочку `T-01 -> SR-01/SR-02 -> D-01 -> D-01-V1/D-01-V4/D-01-V5`;
- объяснить counterexample с `OWNER_ID = "default-user"`;
- объяснить, почему текущий Bearer Token подходит для EK1 и когда нужен переход на JWT/Session.

## M3: продуктовые материалы, защита и сдача

- Описал продукт, сценарии, активы, границу доверия, запуск и ограничения EK1: `README.md`, `PROJECT.md`.
- Подготовил сценарий устной защиты и ответы на адресные вопросы: `DEFENSE_GUIDE.md`.
- Подготовил порядок фиксации оцениваемой версии через commit hash / tag `ek1`: `SUBMISSION.md`.
- Описал использование ИИ и проверку результатов командой: `AI_USAGE.md`.
- Сверил, что процесс сдачи удален из модели угроз продукта, а commit/tag описаны отдельно в `SUBMISSION.md`.
- Сверил, что обозначения `T-*`, `SR-*`, `D-*`, `D-XX-VY` совпадают в `README.md`, `PROJECT.md`, `docs/ek1/*` и `DEFENSE_GUIDE.md`.

Зона понимания для защиты:

- объяснить, что представляет собой Notes Service как продукт;
- показать материалы EK1 и где находится каждый артефакт;
- объяснить, почему commit/tag относятся к процессу сдачи, а не к security assets продукта;
- рассказать финальный порядок проверки и сдачи проекта.

## Совместная ответственность команды

Все участники должны понимать основную линию защиты проекта:

```text
T-01 Unauthorized Disclosure
  -> SR-01 Authentication Required + SR-02 Note Ownership Isolation
  -> D-01 Token Gate And Owner-Scoped Store
  -> D-01-V1 / D-01-V4 / D-01-V5
```

Команда также должна уметь объяснить ограничения EK1: отсутствие полноценной регистрации, постоянной БД, frontend, rate limiting, аудита и production-ready authentication.
