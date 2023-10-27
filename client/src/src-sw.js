const { offlineFallback, warmStrategyCache } = require("workbox-recipes");
const { CacheFirst } = require("workbox-strategies");
const { registerRoute } = require("workbox-routing");
const { CacheableResponsePlugin } = require("workbox-cacheable-response");
const { ExpirationPlugin } = require("workbox-expiration");
const { precacheAndRoute } = require("workbox-precaching/precacheAndRoute");

precacheAndRoute(self.__WB_MANIFEST);

const pageCache = new CacheFirst({
  cacheName: "page-cache",
  plugins: [
    new CacheableResponsePlugin({
      statuses: [0, 200],
    }),
    new ExpirationPlugin({
      maxAgeSeconds: 30 * 24 * 60 * 60,
    }),
  ],
});

warmStrategyCache({
  urls: ["/index.html", "/"],
  strategy: pageCache,
});

registerRoute(({ request }) => request.mode === "navigate", pageCache);

// TODO: Implement asset caching
registerRoute(
  // Match JavaScript files
  ({ url }) => url.pathname.endsWith(".js"),
  // Use the StaleWhileRevalidate strategy
  new StaleWhileRevalidate()
);

registerRoute(
  // Match CSS files
  ({ url }) => url.pathname.endsWith(".css"),
  // Use the StaleWhileRevalidate strategy
  new StaleWhileRevalidate()
);

registerRoute(
  // Match image files
  ({ url }) => url.pathname.match(/\.(png|jpg|jpeg|gif|svg)$/),
  // Use the CacheFirst strategy
  new CacheFirst()
);
