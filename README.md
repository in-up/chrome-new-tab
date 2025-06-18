# Chrome New Tab Extension

A React + Vite browser extension that replaces the default new tab page. It provides instant search across your bookmarks and browsing history and includes example popup, side panel and devtools panels.

## Getting Started

Install dependencies using [pnpm](https://pnpm.io/):

```bash
pnpm install
```

### Development

To run the extension in watch mode for Chrome:

```bash
pnpm dev
```

For Firefox use:

```bash
pnpm dev:firefox
```

### Building

Generate a production build:

```bash
pnpm build
```

Or build for Firefox:

```bash
pnpm build:firefox
```

After building you can create a `.zip` file for submission to the extension store:

```bash
pnpm zip       # Chrome package
pnpm zip:firefox  # Firefox package
```

## Extension Features

- **New Tab Search** – the new tab page displays a search box that matches results from your browsing history and bookmarks.
  - Use the arrow keys to move through results and press <kbd>Enter</kbd> to open the highlighted link.
- **Options Page** – change the theme and set the bookmark search folder.
- **Popup, Side Panel and Devtools panel** – example UIs demonstrating how to build additional extension pages with React.

## Configuring the Bookmark Search Path

Open the extension's options page and fill in the **Bookmark search path** field. Enter a folder path such as `Bookmarks Bar/Work`. Only bookmarks inside this folder (and its sub folders) will be searched from the new tab page. The value is stored using `bookmarkPathStorage` so changes take effect immediately.
