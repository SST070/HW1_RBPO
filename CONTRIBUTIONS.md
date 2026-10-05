# Contributions

Файл фиксирует наблюдаемый вклад участника для EK1. Проект выполнялся одним участником, поэтому используется только обозначение `M1`.

## M1

Конкретные результаты:

- Реализовал минимальный HTTP API сервиса заметок: `src/http.ts`, `src/main.ts`.
- Реализовал доменную модель, owner-scoped in-memory хранилище и валидацию заметок: `src/types.ts`, `src/store.ts`.
- Подготовил и расширил автоматические проверки авторизации, CRUD, owner isolation, invalid JSON, oversized body и security headers: `test/run-tests.ts`.
- Описал продукт, сценарии, активы, границу доверия, запуск и ограничения EK1: `README.md`, `PROJECT.md`.
- Подготовил требования безопасности `SR-01` - `SR-09`: `docs/ek1/security-requirements.md`.
- Подготовил модель угроз `T-01` - `T-07`, `T-09` - `T-11` без смешивания с процессом сдачи: `docs/ek1/threat-model.md`.
- Описал проектные решения `D-01` - `D-05`, проверки `D-XX-VY`, counterexample analysis и сравнение Bearer Token vs JWT/Session: `docs/ek1/security-decisions.md`.
- Составил матрицу трассировки `T-* -> SR-* -> D-* -> Verification`: `docs/ek1/traceability.md`.
- Подготовил сценарий устной защиты и ответы на адресные вопросы: `DEFENSE_GUIDE.md`.
- Подготовил порядок фиксации оцениваемой версии через commit hash / tag `ek1`: `SUBMISSION.md`.

Проверки, выполненные M1:

- Запустил `pnpm test` и проверил, что тесты подтверждают `401` без token, `401` с неверным token, CRUD с корректным token, `404` для отсутствующей заметки, owner isolation на уровне `NotesStore`, invalid JSON, oversized body и `nosniff`.
- Запустил `pnpm typecheck` и подтвердил отсутствие TypeScript-ошибок.
- Запустил `pnpm build` и подтвердил, что проект собирается в `dist`.
- Сверил, что процесс сдачи удален из модели угроз продукта, а commit/tag описаны отдельно в `SUBMISSION.md`.
- Сверил, что обозначения `T-*`, `SR-*`, `D-*`, `D-XX-VY` совпадают в `README.md`, `PROJECT.md`, `docs/ek1/*` и `DEFENSE_GUIDE.md`.

Зона понимания для защиты:

- объяснить границу доверия HTTP API;
- показать, где проверяется bearer token;
- объяснить различие между `T-01 Unauthorized Disclosure` и `T-10 Unauthorized Modification Or Deletion`;
- пройти цепочку `T-01 -> SR-01/SR-02 -> D-01 -> D-01-V1/D-01-V4/D-01-V5`;
- объяснить counterexample с `OWNER_ID = "default-user"`;
- объяснить, почему текущий Bearer Token подходит для EK1 и когда нужен переход на JWT/Session.
