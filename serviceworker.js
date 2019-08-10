console.log('This is service worker talking');
var cacheName = 'MyWebApp';
var filesToCache = [
    '/',
    //Html and css files
    '/index.html',
    '/css/site.css',
    '/css/bootstrap/bootstrap.min.css',
    '/css/open-iconic/font/css/open-iconic-bootstrap.min.css',
//    '/open-iconic',
    '/css/open-iconic/font/fonts/open-iconic.woff',
//    '/css/loading.css',
    //Blazor framework
    '/framework/blazor.webassembly.js',
    '/framework/blazor.boot.json',
    //Our additional files
    '/manifest.json',
    '/serviceworker.js',
    '/icons/icon-192x192.png',
    '/icons/icon-512x512.png',
    '/images/logo.PNG',
    '/exampleJsInterop.js',
   '/jspdf.min.js',
    '/signatur.js',
    //The web assembly/.net dll's
    '/framework/wasm/mono.js',
    '/framework/wasm/mono.wasm',
    '/framework/bin/Microsoft.AspNetCore.Authorization.dll',
    //'/framework/bin/Microsoft.AspNetCore.Blazor.Browser.dll',
    '/framework/bin/Microsoft.AspNetCore.Blazor.dll',
    '/framework/bin/Microsoft.AspNetCore.Components.Browser.dll',
    '/framework/bin/Microsoft.AspNetCore.Components.dll',
    '/framework/bin/Microsoft.AspNetCore.Metadata.dll',
    '/framework/bin/Microsoft.Bcl.AsyncInterfaces.dll',
   '/framework/bin/Microsoft.Extensions.DependencyInjection.Abstractions.dll',
    '/framework/bin/Microsoft.Extensions.DependencyInjection.dll',
    '/framework/bin/Microsoft.Extensions.Logging.Abstractions.dll',
    '/framework/bin/Microsoft.Extensions.Options.dll',
    '/framework/bin/Microsoft.Extensions.Primitives.dll',
    '/framework/bin/Microsoft.JSInterop.dll',
    '/framework/bin/Mono.Security.dll',
    '/framework/bin/Mono.WebAssembly.Interop.dll',
    '/framework/bin/mscorlib.dll',
    '/framework/bin/System.Buffers.dll',
    '/framework/bin/System.ComponentModel.Annotations.dll',
    '/framework/bin/System.Memory.dll',
    '/framework/bin/System.Net.Http.dll',
    '/framework/bin/System.Numerics.Vectors.dll',
    '/framework/bin/System.Runtime.CompilerServices.Unsafe.dll',
    '/framework/bin/System.Text.Json.dll',
    '/framework/bin/System.dll',
    '/framework/bin/System.Core.dll',
    '/framework/bin/System.Threading.Tasks.Extensions.dll',
    //Pages
//    '/counter',
    //The compiled project .dll's
    '/framework/bin/MyWebApp.dll'
];

self.addEventListener('install', function (e) {
    console.log('[ServiceWorker] Install');
    e.waitUntil(
        caches.open(cacheName).then(function (cache) {
            console.log('[ServiceWorker] Caching app shell');
            return cache.addAll(filesToCache);
        })
    );
});

self.addEventListener('activate', event => {
    event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', event => {
    const requestUrl = new URL(event.request.url);

    // First, handle requests for the root path - server up index.html
    if (requestUrl.origin === location.origin) {
        if (requestUrl.pathname === '/') {
            event.respondWith(caches.match('/index.html'));
            return;
        }
    }
    // Anything else
    event.respondWith(
        // Check the cache
        caches.match(event.request)
            .then(response => {
                // anything found in the cache can be returned from there
                // without passing it on to the network
                if (response) {
                    console.log('Found ', event.request.url, ' in cache');
                    return response;
                }
                // otherwise make a network request
                return fetch(event.request)
                    .then(response => {
                        // if we got a valid response 
                        if (response.ok) {
                            // and the request was for something rfom our own app url
                            // we should add it to the cache
                            if (requestUrl.origin === location.origin) {

                                const pathname = requestUrl.pathname;
                                console.log("CACHE: Adding " + pathname);
                                return caches.open(staticCacheName).then(cache => {
                                    // you can only "read" a response once, 
                                    // but you can clone it and use that for the cache
                                    cache.put(event.request.url, response.clone());
                                });
                            }
                        }
                        return response;
                    });
            }).catch(error => {
                // handle this error - for now just log it
                console.log(error);
            })
    );
});
