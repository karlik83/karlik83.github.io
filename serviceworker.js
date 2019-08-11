console.log('This is service worker talking');
var cacheName = 'MyWebApp';
var filesToCache = [
    './',
    //Html and css files
    './index.html',
    './css/site.css',
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
    event.respondWith(
        caches.match(event.request, { ignoreSearch: true }).then(response => {
            return response || fetch(event.request);
        })
    );
});
