# Автоматизация создания статей новостей

Новый скрипт `node scripts/create-news-article.js` избавляет от ручного копирования шаблонов и двойного редактирования `json`/`sitemap.xml`. Он:

- создает HTML-файл в `news/articles/` на основе `_template.html`;
- добавляет метаданные в `news/data/articles-metadata.json` с автоматической сортировкой по дате;
- пересобирает блок «Статьи новостей» в `sitemap.xml` на основании тех же метаданных.

## Workflow (English plan)

1. Prepare article metadata (title, excerpt, tags, hero image, slug base).
2. Run the generator command with the collected data.
3. Edit the generated HTML body if needed.
4. Preview locally and deploy.

## Команда запуска

```powershell
node scripts/create-news-article.js `
  --title "Кейс: дистанционный съем для бизнес-центра" `
  --excerpt "Как мы подключили 24 счетчика к платформе А1 всего за 10 дней." `
  --slug "business-center-remote-metering" `
  --tags "кейс, дистанционный съем, NB-IoT" `
  --image "images/comprehensive-services.webp"
```

Что важно помнить:

- `--slug` указывается **без** даты, скрипт сам добавит префикс `YYYY-MM-DD-`.
- Дата по умолчанию — сегодняшняя. Чтобы задать другую, добавьте `--date 2025-12-05`.
- Теги пишутся через запятую. Они попадают в мета-тег, карточки и алгоритм похожих статей.
- Если у вас уже подготовлен HTML-контент, укажите путь `--content path/to/file.html`. Без него в статье появится читаемый плейсхолдер.

## После генерации

1. Откройте созданный файл в `news/articles/*.html` и допишите текст.
2. Проверьте карточку на `/news/index.html` (она подхватит обновление автоматически).
3. Убедитесь, что `git diff` содержит изменения только нужных файлов (HTML статьи, `articles-metadata.json`, `sitemap.xml`).
4. Запустите деплой.

Чтобы увидеть справку по аргументам, выполните:

```powershell
node scripts/create-news-article.js --help
```

