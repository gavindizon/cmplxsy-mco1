import React, { FC, useEffect, useState } from "react";
import Graph from "graphology";
import GraphEvents from "./GraphEvents";
// @ts-ignore
import { parse } from "graphology-gexf";
import { UndirectedGraph } from "graphology";
import { SigmaContainer } from "@react-sigma/core";
import deterministicRandomness from "../utils/deterministicRandomness";

type Props = { filename: string; customClass: string };

const colors: any = {};

const CustomGraphView: FC<Props> = ({ filename = "movies_net.gexf", customClass = "modularity_class" }) => {
    const [graph, setGraph] = useState<any>(null);
    const [sigmaSettings, setSigmaSettings] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    const getColors = (attrs: any, customClass: string, isEdge = false) => {
        if (attrs[customClass] in colors) {
            let obtainedColor = colors[attrs[customClass]].split(",");
            obtainedColor[3] = `${isEdge ? 0 : 1})`;
            return obtainedColor.join(",");
        }

        let r = Math.random();
        let g = Math.random();
        let b = Math.random();

        let newColor = `rgba(${Math.round(r * 255)},${Math.round(g * 255)},${Math.round(b * 255)}, ${isEdge ? 0 : 1})`;

        colors[attrs[customClass]] = newColor;
        return newColor;
    };

    const loadGexfToSigma = async () => {
        setLoading(true);
        const sigmaGraph = new UndirectedGraph();

        const rawGraph: any = await fetch(`./resource/${filename}`);
        const final = await rawGraph.text();

        const graphObj = parse(Graph, final);
        graphObj.forEachNode(async (key: string, attrs: any) => {
            let nodeColor = getColors(attrs, customClass);
            sigmaGraph.addNode(key, {
                x: attrs.x,
                y: attrs.y,
                label: attrs.label,
                size: parseInt(attrs?.netflix_count + attrs?.amazon_count + attrs?.disney_count),
                color: nodeColor,
                netflix: attrs?.netflix_count,
                amazon: attrs?.amazon_count,
                disney: attrs?.disney_count,
            });
        });

        graphObj.forEachUndirectedEdge(async (key: any, attrs: any, source: any, target: any, sourceAttrs: any) => {
            let newCol = getColors(sourceAttrs, customClass, true);

            sigmaGraph.addEdgeWithKey(key, source, target, {
                weight: attrs.weight / 10,
                size: 0.1,
                color: newCol,
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
                defaultLabelColor: "#FFFFFF",
                autoRescale: false,
                minEdgeSize: 0.1,
                maxEdgeSize: 1,
                drawEdges: true,
            });
        }

        fetchData();
    }, []);

    return (
        <div className="relative h-screen">
            {loading ? (
                <div className="relative flex justify-center items-center">
                    <svg
                        className="animate-spin -ml-1 mr-3 h-32 w-32 mt-32 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                    >
                        <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                        ></circle>
                        <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                    </svg>
                </div>
            ) : (
                <SigmaContainer id="SigmaCanvas" style={{ height: "100vh", width: "100vw" }} graph={graph}>
                    <GraphEvents communities={Object.keys(colors).length} />
                </SigmaContainer>
            )}
        </div>
    );
};

export default CustomGraphView;
