# HW1_RBPO: Notes Service

Минимальный веб-API сервиса личных заметок для EK1 по РБПО.

## Возможности

- healthcheck сервиса;
- создание заметки с заголовком, текстом и тегами;
- получение списка заметок;
- получение, обновление и удаление заметки по `id`;
- bearer-token авторизация для всех операций с заметками;
- валидация входных данных и единый JSON-формат ошибок.

## Быстрый старт

Требования:

- Node.js 22+;
- pnpm 10.x.

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

Проверка:

```bash
curl http://localhost:4300/health
curl -H "Authorization: Bearer dev-token" http://localhost:4300/notes
```

## API

- `GET /health` - статус сервиса.
- `GET /notes` - список заметок текущего пользователя.
- `POST /notes` - создать заметку, JSON `{ "title": "...", "content": "...", "tags": ["..."] }`.
- `GET /notes/:id` - получить заметку.
- `PATCH /notes/:id` - обновить поля `title`, `content`, `tags`, `archived`.
- `DELETE /notes/:id` - удалить заметку.

Все операции с заметками требуют заголовок `Authorization: Bearer <NOTES_API_TOKEN>`.

## Проверка

```bash
pnpm test
pnpm typecheck
```

## Материалы EK1

- [PROJECT.md](PROJECT.md)
- [Требования безопасности](docs/ek1/security-requirements.md)
- [Модель угроз](docs/ek1/threat-model.md)
- [Проектные решения безопасности](docs/ek1/security-decisions.md)
- [CONTRIBUTIONS.md](CONTRIBUTIONS.md)
- [AI_USAGE.md](AI_USAGE.md)
