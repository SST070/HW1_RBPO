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
git tag -f ek1
git push origin main
git push -f origin ek1
```

Важно: если tag `ek1` уже был передан преподавателю как оцениваемая версия, перемещать его без согласования нельзя. До передачи преподавателю tag можно обновить на финальный commit.

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
Commit: resolve by `git rev-parse ek1` after the final tag update
```
