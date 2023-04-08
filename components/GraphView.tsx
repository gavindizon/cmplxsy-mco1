import React, { FC, useEffect, useState } from "react";
import Graph from "graphology";
// @ts-ignore
import { parse } from "graphology-gexf";
import { UndirectedGraph } from "graphology";
import { SigmaContainer } from "@react-sigma/core";

type Props = {};

const GraphView: FC<Props> = () => {
    const [graph, setGraph] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [sigmaSettings, setSigmaSettings] = useState<any>(null);

    const loadGexfToSigma = async () => {
        setLoading(true);
        const sigmaGraph = new UndirectedGraph();

        const rawGraph: any = await fetch("./resource/movies_net.gexf");
        const final = await rawGraph.text();

        const graphObj = parse(Graph, final);

        graphObj.forEachNode((key: any, attrs: any) => {
            console.log(attrs);
            sigmaGraph.addNode(key, {
                x: attrs.x,
                y: attrs.y,
                label: attrs.label,
                size: attrs.size / 10,
                color: attrs?.color,
            });
        });

        graphObj.forEachUndirectedEdge((key: any, attrs: any, source: any, target: any, sourceAttrs: any) => {
            // const colorVals = sourceAttrs.color.slice(4, -1);

            // const newCol = `rgba(${colorVals}, 0.1)`;

            sigmaGraph.addEdgeWithKey(key, source, target, {
                weight: attrs.weight / 10,
                size: 0.1,
                // color: newCol,
                width: 1,
            });
        });
        setLoading(false);
        return sigmaGraph;
    };

    useEffect(() => {
        async function fetchData() {
            let temp = await loadGexfToSigma();
            setGraph(temp);
            setSigmaSettings({
                autoRescale: false,
                minEdgeSize: 0.1,
                maxEdgeSize: 1,
                drawEdges: false,
            });
        }

        fetchData();
    }, []);

    return (
        <div>
            {loading ? (
                "Loading..."
            ) : (
                <SigmaContainer id="SigmaCanvas" style={{ height: "100vh", width: "100vw" }} graph={graph} />
            )}
        </div>
    );
};

export default GraphView;
