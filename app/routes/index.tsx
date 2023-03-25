import GraphView from "components/GraphView";

export default function Index() {
    return (
        <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.4" }}>
            <h1 style={{ textAlign: "center" }}>Movie Atlas</h1>
            <GraphView />
        </div>
    );
}
