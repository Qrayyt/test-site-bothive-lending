# Galenite Bothive page

Открыть `index.html` в браузере.

## Assets
Положи свои файлы в папку `assets` с такими именами:

- `laptop.gif` — ноут на главном экране
- `clip.gif` — скрепка на экране настройки
- `briefcase.gif` — чемодан на дашборде
- `stars.gif` — звёзды после создания бота
- `id.svg` — иконка поля названия
- `key.svg` — иконка поля ключа

Можно использовать `.png` для laptop/clip/briefcase — fallback уже прописан.

## Логика
`EMPTY → SETUP → CREATING → BOT → DASHBOARD`

Дашборд не отдельная страница. Всё на одной странице через `body[data-state]`.
