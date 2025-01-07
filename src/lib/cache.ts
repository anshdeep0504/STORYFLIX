import { CACHE_CONFIG } from '../config/constants';

interface CacheItem<T> {
  data: T;
  timestamp: number;
}

class CacheManager<T> {
  private cache: Map<string, CacheItem<T>>;
  private maxItems: number;

  constructor(maxItems: number = CACHE_CONFIG.MAX_CACHED_STORIES) {
    this.cache = new Map();
    this.maxItems = maxItems;
  }

  set(key: string, value: T): void {
    if (this.cache.size >= this.maxItems) {
      const oldestKey = this.getOldestKey();
      if (oldestKey) this.cache.delete(oldestKey);
    }

    this.cache.set(key, {
      data: value,
      timestamp: Date.now(),
    });
  }

  get(key: string): T | null {
    const item = this.cache.get(key);
    if (!item) return null;

    const isExpired = Date.now() - item.timestamp > CACHE_CONFIG.STORY_CACHE_TIME;
    if (isExpired) {
      this.cache.delete(key);
      return null;
    }

    return item.data;
  }

  private getOldestKey(): string | null {
    let oldestKey: string | null = null;
    let oldestTimestamp = Infinity;

    for (const [key, item] of this.cache.entries()) {
      if (item.timestamp < oldestTimestamp) {
        oldestTimestamp = item.timestamp;
        oldestKey = key;
      }
    }

    return oldestKey;
  }
}

export const storyCache = new CacheManager<string>();