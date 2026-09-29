# Traceability Matrix

Матрица показывает цепочки `T-* -> SR-* -> D-* -> проверка`. Отдельный документ трассировки по EK1 не обязателен, но он помогает быстро показать согласованность материалов на защите.

## 1. Основная матрица

| Угроза | Требования | Решения | Текущая или будущая проверка |
| --- | --- | --- | --- |
| `T-01 Unauthorized Note Access` | `SR-01`, `SR-02`, `SR-09`, `SR-10` | `D-01`, `D-04` | `D-01-C1`, `D-01-C2`, `D-01-C3`, `D-04-C1` |
| `T-02 Token Guessing Or Omission` | `SR-01` | `D-01` | `D-01-C1`, `D-01-V1` |
| `T-03 Object Enumeration` | `SR-02`, `SR-05`, `SR-10` | `D-01`, `D-03`, `D-04` | `D-01-C3`, `D-03-C1`, `D-04-C1` |
| `T-04 Invalid Note Data` | `SR-03` | `D-02` | `D-02-C1`, `D-02-C2` |
| `T-05 Oversized JSON Body` | `SR-03`, `SR-04` | `D-02` | `D-02-V1` |
| `T-06 Diagnostic Data Exposure` | `SR-05` | `D-03` | `D-03-C1`, `D-03-V1` |
| `T-07 Content Sniffing` | `SR-06` | `D-03` | `D-03-C2` |
| `T-08 Unverifiable EK1 Version` | `SR-07` | `D-05` | `D-05-C1`, `D-05-C3`, commit hash |
| `T-09 Token Leakage Through Repository` | `SR-01`, `SR-08` | `D-05` | `D-05-C2`, `.gitignore` review |
| `T-10 Unauthorized Modification Or Deletion` | `SR-02`, `SR-09`, `SR-10` | `D-01`, `D-04` | `D-01-C2`, `D-01-C3`, `D-04-C1` |
| `T-11 Validation Bypass During Future Persistence` | `SR-03`, `SR-04`, `SR-10` | `D-02`, `D-04` | `D-02-V3`, `D-04-V1`, `D-04-V2` |

## 2. Приоритетные цепочки

### Chain A: доступ к чужим заметкам

```text
T-01 Unauthorized Note Access
  -> SR-01 Authentication Required
  -> SR-02 Note Ownership Isolation
  -> D-01 Token Gate And Owner-Scoped Store
  -> D-01-C1 / D-01-C2 / D-01-C3
```

Что показать:

- `src/http.ts`: проверка `Authorization`;
- `src/store.ts`: методы принимают `ownerId`;
- `test/run-tests.ts`: запрос без token дает `401`, чужой owner получает `404`.

### Chain B: перегрузка большим или некорректным JSON

```text
T-05 Oversized JSON Body
  -> SR-03 Input Validation
  -> SR-04 Request Body Limit
  -> D-02 Strict Input Boundary
  -> D-02-C1 / D-02-C2 / D-02-C3 / D-02-V1
```

Что показать:

- `src/http.ts`: `JSON_LIMIT_BYTES`;
- `src/store.ts`: валидаторы заметки;
- `test/run-tests.ts`: некорректный JSON и пустой title.

### Chain C: наблюдаемость сдаваемой версии

```text
T-08 Unverifiable EK1 Version
  -> SR-07 Version Observability
  -> D-05 Repository And Configuration Hygiene
  -> commit hash / tag / README commands
```

Что показать:

- отдельный репозиторий `HW1_RBPO`;
- `README.md` и `PROJECT.md`;
- `CONTRIBUTIONS.md`;
- `AI_USAGE.md`;
- текущий commit hash.

## 3. Что уже подтверждено тестами

| Проверка | Команда | Что подтверждает |
| --- | --- | --- |
| `pnpm test` | TypeScript compilation + Node test runner file | CRUD, `401`, `404`, валидацию, headers, owner isolation |
| `pnpm typecheck` | `tsc --noEmit` | статическую корректность TypeScript |
| `pnpm build` | `tsc -p tsconfig.json` | что проект собирается в `dist` |

## 4. Что является планом будущей проверки

К EK1 не требуется полностью закрыть все будущие проверки. Поэтому следующие пункты являются осознанным планом:

- `D-01-V2`: настоящие пользователи вместо `default-user`;
- `D-01-V3`: срок действия token и ротация секретов;
- `D-02-V1`: отдельный тест тела больше 32 KiB;
- `D-02-V3`: ограничения на уровне БД;
- `D-03-V1`: тест unexpected error без stack trace;
- `D-04-V1`: миграция с `owner_id`;
- `D-05-V3`: CI после EK1.

## 5. Согласованность требований

Все приоритетные угрозы имеют хотя бы одно требование и хотя бы одно решение. Все решения имеют текущую проверку или явно помеченную будущую проверку. Это соответствует ожидаемой форме EK1: не отдельный отчет трассировки ради отчета, а связанная цепочка внутри артефактов.
