# Руководство по стилям (CSS)

В проекте используются **CSS Modules** и глобальные стили. Стек: Vite, Ant Design, TypeScript.

## CSS Modules

### Как работать с модулями

- Файл модуля: `ComponentName.module.css` рядом с компонентом.
- Имена классов — в **camelCase** (например, `.contentWrapper`, `.headerLight`).
- Импорт в компоненте:

```tsx
import styles from './ComponentName.module.css';

<div className={styles.contentWrapper}>...</div>;
```

### Условные классы с clsx

Для условных и комбинированных классов используйте `clsx`:

```tsx
import clsx from 'clsx';
import styles from './MyComponent.module.css';

<header className={clsx(styles.header, isDark && styles.headerDark)}>
```

Несколько классов:

```tsx
className={clsx(styles.card, styles.cardLarge, isActive && styles.active)}
```

### Структура по FSD

- **app** — стили layout, скелетона, глобальные токены в `src/app/styles/`.
- **widgets** — каждый виджет может иметь свой `WidgetName.module.css` в своей папке `ui/`.
- **features** — стили фичи в `FeatureName.module.css` в папке `ui/`.
- **entities** — при необходимости свой модуль рядом с UI-компонентом.

Модуль создаётся в той же папке, что и компонент (чаще всего `ui/`).

## Переменные и токены Ant Design

### Где они заданы

- **`src/app/styles/antd-tokens.css`** — в одном месте заданы:
  - **`--ant-*`** — токены Ant Design 5 с дефолтными значениями (light/dark в `[data-theme='dark']`). Нужны, чтобы переменные были определёнными в коде и при необходимости переопределялись при использовании ConfigProvider theme с `cssVar`.
  - **`--app-*`** — алиасы, привязанные к `var(--ant-*)`, для использования в модулях.

### Распознавание в IDE

Чтобы в любом `.css` / `.module.css` не было предупреждений вида «Cannot resolve custom property», в проекте включён **CSS Custom Data**:

- Файл **`.vscode/css-custom-data.json`** перечисляет все используемые `--ant-*` и `--app-*`.
- В **`.vscode/settings.json`** задано `"css.customData": [".vscode/css-custom-data.json"]`.

Тогда VS Code / Cursor считают эти свойства определёнными во всех стилях. При добавлении новых переменных их нужно дописать в `css-custom-data.json`.

### Использование в модулях

Можно использовать и **`--ant-*`**, и **`--app-*`**:

```css
.myClass {
  color: var(--app-error);
}

.another {
  background: var(--ant-primary-color);
}
```

Тема (light/dark) переключается через `[data-theme='dark']` на `html`; в `antd-tokens.css` для тёмной темы переопределены нужные токены.

## Переопределение компонентов Ant Design через :global

Чтобы стилизовать компоненты Ant Design (например, кнопки внутри своего блока), используйте **:global**:

```css
/* В ModuleName.module.css */
.container :global(.ant-btn) {
  border-radius: 8px;
}

.container :global(.ant-btn-primary) {
  background: var(--app-primary);
}
```

Так классы Ant Design не будут захешированы, и переопределения применятся только внутри `.container`.

Глобальное переопределение (без обёртки):

```css
:global(.ant-btn) {
  font-weight: 600;
}
```

Рекомендуется ограничивать область переопределения классом-обёрткой из модуля.

## Глобальные стили

- **`src/app/styles/index.css`** — сбросы (box-sizing, body, #root). Подключается в точке входа.
- **`src/app/styles/antd-tokens.css`** — токены темы. Подключается в точке входа перед `index.css` или после, в зависимости от приоритета.

В компонентах не используйте инлайн-стили (`style={{ ... }}`); выносите стили в CSS Modules или в глобальный CSS с осознанным использованием `:global`.
