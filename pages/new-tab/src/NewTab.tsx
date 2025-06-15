import '@src/NewTab.css';
import '@src/NewTab.scss';
import { useEffect, useRef, useState } from 'react';
import { t } from '@extension/i18n';
import { useStorage } from '@extension/shared';
import { bookmarkPathStorage } from '@extension/storage';

interface BookmarkItem {
  title: string;
  url: string;
}

const fetchBookmarkTree = () => {
  return new Promise<chrome.bookmarks.BookmarkTreeNode[]>((resolve, reject) => {
    if (chrome && chrome.bookmarks) {
      chrome.bookmarks.getTree(tree => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
        } else {
          resolve(tree);
        }
      });
    } else {
      reject(new Error('chrome.bookmarks API is not available.'));
    }
  });
};

const fetchHistory = () => {
  return new Promise<chrome.history.HistoryItem[]>(resolve => {
    if (chrome && chrome.history) {
      chrome.history.search({ text: '', maxResults: 100 }, items => {
        resolve(items);
      });
    } else {
      resolve([]);
    }
  });
};

function flattenBookmarks(nodes: chrome.bookmarks.BookmarkTreeNode[]): BookmarkItem[] {
  const flat: BookmarkItem[] = [];
  nodes.forEach(n => {
    if (n.url) {
      flat.push({ title: n.title, url: n.url });
    }
    if (n.children) {
      flat.push(...flattenBookmarks(n.children));
    }
  });
  return flat;
}

function findFolderByPath(tree: chrome.bookmarks.BookmarkTreeNode[], path: string): chrome.bookmarks.BookmarkTreeNode[] {
  if (!path) return tree;
  const segments = path.split('/').map(s => s.trim()).filter(Boolean);
  let nodes = tree;
  for (const seg of segments) {
    const found = nodes.flatMap(n => n.children ?? []).find(n => n.title === seg && n.children);
    if (found && found.children) {
      nodes = [found];
    } else {
      return [];
    }
  }
  return nodes[0].children ?? [];
}

const NewTab = () => {
  const searchInput = useRef<HTMLInputElement>(null);
  const bookmarkPath = useStorage(bookmarkPathStorage);
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>([]);
  const [history, setHistory] = useState<BookmarkItem[]>([]);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<BookmarkItem[]>([]);
  const [highlight, setHighlight] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    searchInput.current?.focus();
  }, []);

  useEffect(() => {
    Promise.all([fetchBookmarkTree(), fetchHistory()]).then(([tree, his]) => {
      const folderNodes = findFolderByPath(tree, bookmarkPath);
      setBookmarks(flattenBookmarks(folderNodes));
      setHistory(his.map(h => ({ title: h.title || h.url, url: h.url! })));
      setLoading(false);
    });
  }, [bookmarkPath]);

  useEffect(() => {
    const lower = query.toLowerCase();
    const items = [...history, ...bookmarks].filter(i =>
      `${i.title} ${i.url}`.toLowerCase().includes(lower),
    );
    setResults(items);
    setHighlight(0);
  }, [query, history, bookmarks]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlight(h => Math.min(h + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlight(h => Math.max(h - 1, 0));
    } else if (e.key === 'Enter') {
      const url = results[highlight]?.url;
      if (url) {
        window.location.href = url;
      }
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <div className="mb-6 flex w-full justify-center">
          <input
            ref={searchInput}
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="검색..."
            className="w-2/3 rounded-full bg-white p-3 text-gray-700 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 md:w-1/2 lg:w-1/3"
          />
        </div>
        {loading ? (
          <div>{t('loading')}</div>
        ) : (
          <div className="w-full max-w-xl mx-auto text-left">
            {results.map((r, idx) => (
              <div
                key={`${r.url}-${idx}`}
                className={`px-2 py-1 ${idx === highlight ? 'bg-blue-100' : ''}`}
              >
                <a href={r.url} className="text-blue-600 hover:underline" onClick={e => e.preventDefault()}>
                  {r.title}
                </a>
                <span className="ml-2 text-xs text-gray-500">{r.url}</span>
              </div>
            ))}
          </div>
        )}
      </header>
    </div>
  );
};

export default NewTab;
