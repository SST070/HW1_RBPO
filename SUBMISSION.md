# Submission

Этот файл фиксирует порядок сдачи EK1. Он относится к процессу проверки проекта, а не к модели угроз Notes Service.

## Репозиторий

URL:

```text
https://github.com/SST070/HW1_RBPO
```

## Оцениваемая версия

Перед финальной сдачей нужно передать преподавателю:

- URL репозитория;
- commit hash оцениваемой версии или tag `ek1`.

Финальная версия должна быть зафиксирована так:

```bash
git status --short
git rev-parse HEAD
git tag ek1
git push origin main
git push origin ek1
```

Tag `ek1` создаётся только после финальной проверки проекта.
После передачи версии преподавателю tag не передвигается без согласования.

## Проверки перед отправкой

```bash
pnpm test
pnpm typecheck
pnpm build
git status --short
```

Ожидаемый результат:

- тесты проходят;
- TypeScript typecheck проходит;
- сборка проходит;
- рабочее дерево чистое;
- `ek1` указывает на финальный commit, если в качестве версии передается tag.

## Что передать преподавателю

```text
Repository: https://github.com/SST070/HW1_RBPO
Version: tag ek1
Commit: resolve by `git rev-parse ek1` after creating the final tag
```
