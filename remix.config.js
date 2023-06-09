/** @type {import('@remix-run/dev').AppConfig} */
module.exports = {
    ignoredRouteFiles: ["**/.*"],
    // When running locally in development mode, we use the built-in remix
    // server. This does not understand the vercel lambda module format,
    // so we default back to the standard build output.
    future: {
        unstable_tailwind: true,
    },
    server: process.env.NODE_ENV === "development" ? undefined : "./server.js",
    serverBuildPath: "api/index.js",
    serverDependenciesToBundle: ["@react-sigma/core"],
    // appDirectory: "app",
    // assetsBuildDirectory: "public/build",
    // publicPath: "/build/",
};
