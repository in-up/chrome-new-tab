import '@src/Options.css';
import { useStorage, withErrorBoundary, withSuspense } from '@extension/shared';
import { exampleThemeStorage, bookmarkPathStorage } from '@extension/storage';
import { Button } from '@extension/ui';
import { t } from '@extension/i18n';

const Options = () => {
  const theme = useStorage(exampleThemeStorage);
  const bookmarkPath = useStorage(bookmarkPathStorage);
  const isLight = theme === 'light';
  const logo = isLight ? 'options/logo_horizontal.svg' : 'options/logo_horizontal_dark.svg';
  const goGithubSite = () =>
    chrome.tabs.create({ url: 'https://github.com/Jonghakseo/chrome-extension-boilerplate-react-vite' });

  return (
    <div className={`App ${isLight ? 'bg-slate-50 text-gray-900' : 'bg-gray-800 text-gray-100'}`}>
      <button onClick={goGithubSite}>
        <img src={chrome.runtime.getURL(logo)} className="App-logo" alt="logo" />
      </button>
      <div className="my-4 text-left">
        <label htmlFor="bookmark-path" className="mb-2 block text-sm">
          Bookmark search path
        </label>
        <input
          id="bookmark-path"
          value={bookmarkPath}
          onChange={e => bookmarkPathStorage.set(e.target.value)}
          placeholder={t('bookmarkSearchPathPlaceholder')}
          className="w-full rounded border px-2 py-1 text-black"
          type="text"
        />
      </div>
      <Button className="mt-4" onClick={exampleThemeStorage.toggle} theme={theme}>
        Toggle theme
      </Button>
    </div>
  );
};

export default withErrorBoundary(withSuspense(Options, <div> Loading ... </div>), <div> Error Occur </div>);
