import { StorageEnum } from '../base/enums';
import { createStorage } from '../base/base';
import type { BaseStorage } from '../base/types';

export type BookmarkPathStorage = BaseStorage<string>;

/**
 * Stores a path (e.g. "Bookmarks Bar/Folder") to search for bookmarks under.
 */
export const bookmarkPathStorage: BookmarkPathStorage = createStorage<string>(
  'bookmark-path',
  '',
  {
    storageEnum: StorageEnum.Local,
    liveUpdate: true,
  },
);
