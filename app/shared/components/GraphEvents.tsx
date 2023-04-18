import React, { FC, useEffect, useState } from "react";

import { ControlsContainer, SearchControl, useRegisterEvents, useSetSettings, useSigma } from "@react-sigma/core";

type GraphEventProps = {
    communities?: undefined | number;
};

const GraphEvents: FC<GraphEventProps> = ({ communities }) => {
    const [clickedNode, setClickedNode] = useState<string | null>(null);
    const [neighborNodes, setNeighborNodes] = useState<any | null>([]);
    const [clickedNodeAttribute, setClickedNodeAttribute] = useState<any | null>(null);

    const registerEvents = useRegisterEvents();
    const sigma = useSigma();
    const setSettings = useSetSettings();

    useEffect(() => {
        // Register the events
        registerEvents({
            enterNode: (event) => {},
            leaveNode: () => {},
            clickNode: (event) => {
                if (event.node === clickedNode) {
                    setClickedNode(null);
                    setClickedNodeAttribute(null);
                    setNeighborNodes([]);
                    return;
                }
                setClickedNode(event.node);
                setNeighborNodes(sigma.getGraph().neighbors(event.node));
                setClickedNodeAttribute(sigma.getGraph().getNodeAttributes(event.node));
                console.log(sigma.getGraph().getNodeAttributes(event.node));
            },
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
                        let currColor = newData.color.split(",");
                        currColor[3] = ".01)";
                        newData.color = currColor.join(", ");
                        newData.highlighted = false;
                    }
                }

                return newData;
            },
            edgeReducer: (edge, data) => {
                const graph = sigma.getGraph();
                const newData: any = { ...data, hidden: false };

                if (clickedNode) {
                    if (!graph.extremities(edge).includes(clickedNode)) {
                        newData.hidden = true;

                        let currColor = newData.color.split(",");
                        currColor[3] = "0)";
                        newData.color = currColor.join(", ");
                    } else {
                        let currColor = newData.color.split(",");
                        currColor[3] = "1)";
                        newData.color = currColor.join(", ");
                    }
                }
                return newData;
            },
        });
    }, [clickedNode]);

    return (
        <ControlsContainer className="absolute top-[5%] left-[5%] w-1/4">
            <SearchControl className="w-full" />
            <div className="w-full h-64 bg-slate-900 mt-2 px-2 py-2 overflow-y-scroll">
                <h6>
                    <strong>Selected Node:</strong>
                    <br />
                    {clickedNode ? clickedNode : "Click on a node"}
                </h6>

                {clickedNode && (
                    <>
                        <p className="mt-2 mb-1">
                            <strong>Connections [{neighborNodes.length}]:</strong>{" "}
                        </p>
                        <ul>
                            {neighborNodes.map((node: string, index: number) => (
                                <li key={index}>{node}</li>
                            ))}
                        </ul>
                    </>
                )}
            </div>
            <div className="w-full bg-slate-900 mt-2 px-2 py-2 overflow-y-scroll">
                <p className="mt-2 mb-1 text-center uppercase">
                    <strong>Communities Detected:</strong> {communities ? communities : 3}
                </p>
                <div className="flex items-center justify-center space-x-2">
                    <p>Netflix: {parseInt(clickedNodeAttribute?.netflix || 0)}</p>
                    <p>Amazon: {parseInt(clickedNodeAttribute?.amazon || 0)}</p>
                    <p>Disney: {parseInt(clickedNodeAttribute?.disney || 0)}</p>
                </div>
            </div>
        </ControlsContainer>
    );
};

export default GraphEvents;
