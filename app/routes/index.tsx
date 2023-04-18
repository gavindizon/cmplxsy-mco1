import GraphView from "~/shared/components/GraphView";

export default function Index() {
    return (
        <div style={{ fontFamily: "system-ui, sans-serif", width: "100vw", height: "100vh", lineHeight: "1.4" }}>
            <h1 style={{ textAlign: "center" }} className="mt-16 text-4xl font-semibold">
                Actor Atlas
            </h1>
            <div className="flex flex-row space-x-4 absolute top-0 right-[5%] py-4">
                <a href="/" className="underline text-stone-200 font-weight-600 hover:text-stone-400">
                    Heuristic
                </a>
                <a href="/modularity" className="hover:text-stone-400">
                    Modularity
                </a>
                <a href="/statistics" className="hover:text-stone-400">
                    Statistical Inference
                </a>
            </div>
            <GraphView filename={"movies_net_1.gexf"} />
        </div>
    );
}
