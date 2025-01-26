import '@src/NewTab.css';
import '@src/NewTab.scss';
import { useState, useEffect } from 'react';
import { t } from '@extension/i18n';
import BookmarkList from './BookmarkList';

const fetchBookmarks = () => {
  return new Promise<chrome.bookmarks.BookmarkTreeNode[]>((resolve, reject) => {
    if (chrome && chrome.bookmarks) {
      chrome.bookmarks.getTree(bookmarkTree => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
        } else {
          resolve(bookmarkTree);
        }
      });
    } else {
      reject(new Error('chrome.bookmarks API is not available.'));
    }
  });
};

const NewTab = () => {
  const [bookmarks, setBookmarks] = useState<chrome.bookmarks.BookmarkTreeNode[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchBookmarks()
      .then(bookmarkTree => {
        setBookmarks(bookmarkTree);
        setLoading(false);
      })
      .catch(error => {
        console.error('북마크 로드 실패:', error);
        setLoading(false);
      });
  }, []);

  return (
    <div className={`App`}>
      <header className="App-header">
        <div className="mb-6 flex w-full justify-center">
          <input
            type="text"
            placeholder="검색..."
            className="w-2/3 rounded-full bg-white p-3 text-gray-700 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 md:w-1/2 lg:w-1/3"
          />
        </div>

        <h6>북마크 목록</h6>
        {loading ? <div>{t('loading')}</div> : <BookmarkList bookmarks={bookmarks} />}
      </header>
    </div>
  );
};

export default NewTab;
