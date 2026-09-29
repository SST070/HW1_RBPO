# Notes Service

## Идея продукта

Notes Service - минимальный веб-API для личных заметок. Пользователь может создавать, читать, обновлять, архивировать и удалять короткие текстовые заметки с тегами.

Основные сценарии:

- сохранить личную заметку;
- найти заметку в своем списке;
- обновить содержание или теги;
- удалить заметку, которая больше не нужна.

## Граница доверия

К EK1 реализована минимальная запускаемая техническая основа: HTTP API в `src`.

Граница доверия проходит по входящему HTTP-запросу. Все данные за пределами процесса сервиса считаются недоверенными: заголовки авторизации, URL, JSON-тело запроса и поля заметки. Сервис доверяет только конфигурации процесса (`NOTES_API_TOKEN`, `PORT`) и собственному in-memory хранилищу на время запуска.

## Локальный запуск

Требования:

- Node.js 22+;
- pnpm 10.x.

Команды:

```bash
pnpm install
pnpm build
NOTES_API_TOKEN=dev-token pnpm start
```

PowerShell:

```powershell
$env:NOTES_API_TOKEN = "dev-token"
pnpm start
```

Проверка работоспособности:

```bash
curl http://localhost:4300/health
curl -H "Authorization: Bearer dev-token" http://localhost:4300/notes
```

Ожидаемый результат:

- `/health` возвращает JSON `{"status":"ok","service":"notes-service"}`;
- `/notes` с корректным токеном возвращает JSON со списком заметок;
- `/notes` без токена возвращает `401`.

Тесты:

```bash
pnpm test
```

## Артефакты EK1

- [Требования безопасности](docs/ek1/security-requirements.md)
- [Модель угроз](docs/ek1/threat-model.md)
- [Проектные решения безопасности](docs/ek1/security-decisions.md)
- [Вклад участников](CONTRIBUTIONS.md)
- [Использование ИИ](AI_USAGE.md)

Приоритетная цепочка для защиты:

`T-01 Unauthorized note access -> SR-01 Authentication required, SR-02 Note isolation -> D-01 Token gate and owner-scoped store -> будущая проверка D-01-V1`.
