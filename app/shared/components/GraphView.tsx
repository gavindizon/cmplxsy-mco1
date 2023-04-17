import React, { FC, useEffect, useState } from "react";
import Graph from "graphology";
// @ts-ignore
import { parse } from "graphology-gexf";
import { UndirectedGraph } from "graphology";
import {
    ControlsContainer,
    SearchControl,
    SigmaContainer,
    useRegisterEvents,
    useSetSettings,
    useSigma,
} from "@react-sigma/core";
import ForceSupervisor from "graphology-layout-force/worker";
import sleep from "../utils/sleep";

type Props = {};

const GraphView: FC<Props> = () => {
    const GraphEvents: React.FC = () => {
        const [clickedNode, setClickedNode] = useState<string | null>(null);
        const registerEvents = useRegisterEvents();
        const sigma = useSigma();
        const setSettings = useSetSettings();

        useEffect(() => {
            // Register the events
            registerEvents({
                enterNode: (event) => {},
                leaveNode: () => {},
                clickNode: (event) => setClickedNode(event.node),
            });
        }, [registerEvents]);

        useEffect(() => {
            setSettings({
                nodeReducer: (node, data) => {
                    const graph = sigma.getGraph();
                    const newData: any = { ...data, highlighted: data.highlighted || false };

                    if (clickedNode) {
                        if (node === clickedNode || graph.neighbors(clickedNode).includes(node)) {
                            newData.highlighted = true;
                        } else {
                            newData.color = "rgba(255,255,255,0.4)";
                            newData.highlighted = false;
                        }
                    }
                    return newData;
                },
                edgeReducer: (edge, data) => {
                    const graph = sigma.getGraph();
                    const newData = { ...data, hidden: false };

                    if (clickedNode && !graph.extremities(edge).includes(clickedNode)) {
                        newData.hidden = true;
                    }
                    return newData;
                },
            });
        }, [clickedNode]);

        return null;
    };

    const [graph, setGraph] = useState<any>(null);
    const [sigmaSettings, setSigmaSettings] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    const getColors = (r: number, g: number, b: number) => {
        let sum = r + g + b;

        return `rgb(${Math.round((r / sum) * 255)},${Math.round((g / sum) * 255)},${Math.round((b / sum) * 255)})`;
    };

    const getColorsForEdges = (r: number, g: number, b: number) => {
        let sum = r + g + b;
        return `rgba(${Math.round((r / sum) * 255)},${Math.round((g / sum) * 255)},${Math.round(
            (b / sum) * 255
        )}, 0.1)`;
    };

    const loadGexfToSigma = async () => {
        setLoading(true);
        const sigmaGraph = new UndirectedGraph();

        const rawGraph: any = await fetch("./resource/movies_net.gexf");
        const final = await rawGraph.text();

        const graphObj = parse(Graph, final);

        graphObj.forEachNode(async (key: string, attrs: any) => {
            let nodeColor = getColors(attrs?.netflix_count, attrs?.amazon_count, attrs?.disney_count);
            sigmaGraph.addNode(key, {
                x: attrs.x,
                y: attrs.y,
                label: attrs.label,
                size: parseInt(attrs?.netflix_count + attrs?.amazon_count + attrs?.disney_count),
                color: nodeColor,
            });
        });

        graphObj.forEachUndirectedEdge(async (key: any, attrs: any, source: any, target: any, sourceAttrs: any) => {
            //console.log(sourceAttrs);

            let newCol = getColorsForEdges(
                sourceAttrs?.netflix_count,
                sourceAttrs?.amazon_count,
                sourceAttrs?.disney_count
            );

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
                    <ControlsContainer className="absolute top-[5%] left-[5%]">
                        <SearchControl />
                    </ControlsContainer>
                    <GraphEvents />
                </SigmaContainer>
            )}
        </div>
    );
};

export default GraphView;
