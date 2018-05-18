/*Steps from https://www.youtube.com/watch?v=BfL3pprhnms */

//Cache name in case we implement versioning
let cacheName = 'RestaurantGuide v1.0';
//Files to be cached
let toBeCached = [
    './',
    './index.html',
    './restaurant.html',
    './css/styles.css',
    './data/restaurants.json',
    './img',
    './js/dbhelper.js',
    './js/main.js',
    './js/restaurant_info.js',
    './img/1.jpg',
    './img/2.jpg',
    './img/3.jpg',
    './img/4.jpg',
    './img/5.jpg',
    './img/6.jpg',
    './img/7.jpg',
    './img/8.jpg',
    './img/9.jpg',
    './img/10.jpg'
    //I couldn't for the life of me cache the maps
];

//Add the files when sw is installed
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(cacheName)
            .then(cache => cache.addAll(toBeCached))
    );
});

//When sw is activated, check and delete previous caches
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

//Fetch the cache
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(res => {
                if (res) return res;
                //Clone the cache so it becomes stable
                const reqClone = event.request.clone();

                fetch(reqClone)
                    .then(res => {
                        if(!res) return res;
                        //Clone the response cache to pass to the promise
                        const resClone = res.clone();

                        caches.open(cacheName)
                            .then(cache => {
                                cache.put(event.request, resClone);
                                return res;
                            })
                    })
            })
    )
});