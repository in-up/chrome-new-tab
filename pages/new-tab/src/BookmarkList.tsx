import React, { useState } from 'react';

interface BookmarkProps {
  bookmarks: chrome.bookmarks.BookmarkTreeNode[];
}

const BookmarkList: React.FC<BookmarkProps> = ({ bookmarks }) => {
  const [showAll, setShowAll] = useState<boolean>(false);

  const flattenBookmarks = (bookmarks: chrome.bookmarks.BookmarkTreeNode[]): chrome.bookmarks.BookmarkTreeNode[] => {
    let flatList: chrome.bookmarks.BookmarkTreeNode[] = [];
    bookmarks.forEach(bookmark => {
      if (bookmark.children) {
        flatList = flatList.concat(flattenBookmarks(bookmark.children));
      } else {
        flatList.push(bookmark);
      }
    });
    return flatList;
  };

  const flatBookmarks = flattenBookmarks(bookmarks);
  const visibleBookmarks = showAll ? flatBookmarks : flatBookmarks.slice(0, 10);
  const renderBookmarks = (bookmarks: chrome.bookmarks.BookmarkTreeNode[]): JSX.Element[] => {
    return bookmarks.map(bookmark => (
      <div key={bookmark.id} className="space-x-2">
        <a href={bookmark.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
          {bookmark.title}
        </a>
        <span className="max-w-xs truncate text-sm text-gray-500" title={bookmark.url}>
          {bookmark.url}
        </span>
      </div>
    ));
  };

  return (
    <div>
      {renderBookmarks(visibleBookmarks)}
      {!showAll && flatBookmarks.length > 10 && (
        <button onClick={() => setShowAll(true)} className="mt-4 text-blue-500 hover:underline">
          Show More
        </button>
      )}
    </div>
  );
};

export default BookmarkList;
