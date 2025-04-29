// DataPulse.ai Service Worker
const CACHE_NAME = 'datapulse-cache-v1';
const OFFLINE_URL = '/offline.html';

// Resources to pre-cache
const PRECACHE_URLS = [
  '/',
  '/index.html',
  '/offline.html',
  '/manifest.json',
  '/static/css/main.chunk.css',
  '/static/js/bundle.js',
  '/static/js/main.chunk.js',
  '/static/js/0.chunk.js',
  '/static/media/logo.png',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png'
];

// Install event - pre-cache resources
self.addEventListener('install', event => {
  console.log('[Service Worker] Install');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[Service Worker] Pre-caching offline page');
        return cache.addAll(PRECACHE_URLS);
      })
      .then(() => {
        return self.skipWaiting();
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  console.log('[Service Worker] Activate');
  
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('[Service Worker] Clearing old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      return self.clients.claim();
    })
  );
});

// Fetch event - network-first strategy with fallback to cache
self.addEventListener('fetch', event => {
  // Skip cross-origin requests
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .catch(() => {
          return caches.open(CACHE_NAME)
            .then(cache => {
              return cache.match(OFFLINE_URL);
            });
        })
    );
    return;
  }
  
  // For other requests, try network first, falling back to cache
  event.respondWith(
    fetch(event.request)
      .then(response => {
        // Cache successful responses
        if (response && response.status === 200) {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, responseClone);
          });
        }
        return response;
      })
      .catch(() => {
        return caches.match(event.request)
          .then(response => {
            if (response) {
              return response;
            }
            // If both network and cache fail, and it's a navigation request,
            // show the offline page
            if (event.request.mode === 'navigate') {
              return caches.match(OFFLINE_URL);
            }
            // Otherwise, return an error response
            return new Response('Network error', {
              status: 408,
              headers: { 'Content-Type': 'text/plain' }
            });
          });
      })
  );
});

// Background sync for offline data
self.addEventListener('sync', event => {
  if (event.tag === 'sync-extractions') {
    event.waitUntil(syncExtractions());
  }
});

// Push notification handler
self.addEventListener('push', event => {
  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.body,
      icon: '/icons/icon-192x192.png',
      badge: '/icons/badge-96x96.png',
      data: {
        url: data.url || '/'
      }
    };
    
    event.waitUntil(
      self.registration.showNotification(data.title, options)
    );
  }
});

// Notification click handler
self.addEventListener('notificationclick', event => {
  event.notification.close();
  
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then(clientList => {
      const url = event.notification.data.url;
      
      // Check if there is already a window/tab open with the target URL
      for (let i = 0; i < clientList.length; i++) {
        const client = clientList[i];
        if (client.url === url && 'focus' in client) {
          return client.focus();
        }
      }
      
      // If no window/tab is already open, open a new one
      if (clients.openWindow) {
        return clients.openWindow(url);
      }
    })
  );
});

// Background sync function for extractions
async function syncExtractions() {
  try {
    const db = await openDB();
    const pendingExtractions = await db.getAll('pending-extractions');
    
    if (pendingExtractions.length === 0) {
      return;
    }
    
    // Process each pending extraction
    const successfulIds = [];
    
    for (const extraction of pendingExtractions) {
      try {
        const response = await fetch('/api/extractions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(extraction)
        });
        
        if (response.ok) {
          successfulIds.push(extraction.id);
        }
      } catch (err) {
        console.error('Failed to sync extraction:', err);
      }
    }
    
    // Remove successful syncs from IndexedDB
    const tx = db.transaction('pending-extractions', 'readwrite');
    for (const id of successfulIds) {
      tx.store.delete(id);
    }
    await tx.done;
    
    // Show notification
    if (successfulIds.length > 0) {
      self.registration.showNotification('DataPulse.ai', {
        body: `Successfully synced ${successfulIds.length} extractions.`,
        icon: '/icons/icon-192x192.png'
      });
    }
  } catch (err) {
    console.error('Error in syncExtractions:', err);
  }
}

// Helper function to open IndexedDB
async function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('datapulse-db', 1);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains('pending-extractions')) {
        db.createObjectStore('pending-extractions', { keyPath: 'id' });
      }
    };
  });
}
