import type { LinksFunction, MetaFunction } from "@remix-run/node";
import { Links, LiveReload, Meta, Outlet, Scripts, ScrollRestoration } from "@remix-run/react";
import styles from "~/styles/global.css";

export const meta: MetaFunction = () => ({
    charset: "utf-8",
    title: "Actor Atlas",
    viewport: "width=device-width,initial-scale=1",
});

export const links: LinksFunction = () => [
    {
        rel: "stylesheet",
        href: styles,
    },
];

export default function App() {
    return (
        <html lang="en">
            <head>
                <Meta />
                <Links />
            </head>
            <body style={{ backgroundColor: "#28231d", color: "#fff" }}>
                <Outlet />
                <ScrollRestoration />
                <Scripts />
                <LiveReload />
            </body>
        </html>
    );
}
