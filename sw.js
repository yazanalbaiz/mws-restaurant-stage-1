let cacheName = 'RestaurantGuide v1.0';

let toBeCached = [
    './',
    './index.html',
    'restaurant.html',
    './css/styles.css',
    './data/restaurants.json',
    './img',
    './js/dbhelper.js',
    './js/main.js',
    './js/restaurant_info.js'
    //I couldn't for the life of me cache the maps
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(cacheName)
            .then(cache => cache.addAll(toBeCached))
    );
});

self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys()
            .then(cacheKeys => Promise.all(
                cacheKeys.map(key => {
                    if(key !== cacheName) {
                        return caches.delete(key);
                    }
                })
            ))
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(res => res || fetch(event.request))
    )
});