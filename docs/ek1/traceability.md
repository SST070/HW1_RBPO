# Traceability Matrix

Матрица показывает цепочки `T-* -> SR-* -> D-* -> проверка`. Отдельный документ трассировки по EK1 не обязателен, но он помогает быстро показать согласованность материалов на защите.

## 1. Основная матрица

| Угроза | Требования | Решения | Verification |
| --- | --- | --- | --- |
| `T-01 Unauthorized Disclosure` | `SR-01`, `SR-02`, `SR-09` | `D-01`, `D-04` | `D-01-V1`, `D-01-V4`, `D-04-V1` |
| `T-02 Token Guessing Or Omission` | `SR-01` | `D-01` | `D-01-V1`, `D-01-V2`, `D-01-V3` |
| `T-03 Object Enumeration` | `SR-02`, `SR-05`, `SR-09` | `D-01`, `D-03`, `D-04` | `D-01-V4`, `D-03-V1`, `D-04-V1` |
| `T-04 Invalid Note Data` | `SR-03` | `D-02` | `D-02-V1`, `D-02-V4` |
| `T-05 Oversized JSON Body` | `SR-03`, `SR-04` | `D-02` | `D-02-V3` |
| `T-06 Diagnostic Data Exposure` | `SR-05` | `D-03` | `D-03-V1`, `D-03-V3` |
| `T-07 Content Sniffing` | `SR-06` | `D-03` | `D-03-V2` |
| `T-09 Token Leakage Through Repository` | `SR-01`, `SR-07` | `D-05` | `D-05-V1`, `D-05-V2`, `D-05-V3` |
| `T-10 Unauthorized Modification Or Deletion` | `SR-02`, `SR-08`, `SR-09` | `D-01`, `D-04` | `D-01-V4`, `D-04-V2`, `D-04-V3` |
| `T-11 Validation Bypass During Future Persistence` | `SR-03`, `SR-04`, `SR-09` | `D-02`, `D-04` | `D-02-V5`, `D-04-V4` |

## 2. Приоритетные цепочки

### Chain A: раскрытие чужой заметки

```text
T-01 Unauthorized Disclosure
  -> SR-01 Authentication Required
  -> SR-02 Note Ownership Isolation
  -> D-01 Token Gate And Owner-Scoped Store
  -> D-01-V1 / D-01-V4
```

Что показать:

- `src/http.ts`: проверка `Authorization`;
- `src/store.ts`: методы принимают `ownerId`;
- `test/run-tests.ts`: запрос без token дает `401`, чужой owner получает `404` на уровне store.

### Chain B: изменение или удаление чужой заметки

```text
T-10 Unauthorized Modification Or Deletion
  -> SR-02 Note Ownership Isolation
  -> SR-08 Safe Deletion Semantics
  -> D-01 Token Gate And Owner-Scoped Store
  -> D-01-V4 / D-04-V2 / D-04-V3
```

Что показать:

- `src/store.ts`: `update` и `delete` сначала вызывают owner-scoped `get`;
- `test/run-tests.ts`: чужой owner не может получить объект.

### Chain C: перегрузка большим или некорректным JSON

```text
T-05 Oversized JSON Body
  -> SR-03 Input Validation
  -> SR-04 Request Body Limit
  -> D-02 Strict Input Boundary
  -> D-02-V1 / D-02-V2 / D-02-V3
```

Что показать:

- `src/http.ts`: `JSON_LIMIT_BYTES`;
- `src/store.ts`: валидаторы заметки;
- `test/run-tests.ts`: некорректный JSON и пустой title.

## 3. Что уже подтверждено тестами

| Проверка | Команда | Что подтверждает |
| --- | --- | --- |
| `pnpm test` | TypeScript compilation + Node test runner file | CRUD, `401`, `404`, валидацию, headers, owner isolation |
| `pnpm typecheck` | `tsc --noEmit` | статическую корректность TypeScript |
| `pnpm build` | `tsc -p tsconfig.json` | что проект собирается в `dist` |

## 4. Что является планом будущей проверки

К EK1 не требуется полностью закрыть все будущие проверки. Поэтому следующие пункты являются осознанным планом:

- `D-02-V5`: ограничения на уровне БД;
- `D-03-V1`: тест unexpected error без stack trace;
- `D-04-V4`: SQL `UPDATE`/`DELETE` с условием по `owner_id`.

## 5. Согласованность требований

Все приоритетные угрозы имеют хотя бы одно требование и хотя бы одно решение. Все решения имеют текущую проверку или явно помеченную будущую проверку. Это соответствует ожидаемой форме EK1: не отдельный отчет трассировки ради отчета, а связанная цепочка внутри артефактов.
