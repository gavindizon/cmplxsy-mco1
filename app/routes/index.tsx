import GraphView from "~/shared/components/GraphView";

export default function Index() {
    return (
        <div style={{ fontFamily: "system-ui, sans-serif", width: "100vw", height: "100vh", lineHeight: "1.4" }}>
            <h1 style={{ textAlign: "center" }} className="mt-16 text-4xl font-semibold">
                Movie Atlas
            </h1>
            <GraphView />
        </div>
    );
}
