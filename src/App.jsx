import { useEffect, useState } from "react";
import ForceDirectedGraph from "./components/ForceDirectedGraph";
import { BsThreeDots } from "react-icons/bs";
import { FaLink, FaLinkSlash } from "react-icons/fa6";
import "./App.css";

function App() {
    const [nodeId, setNodeId] = useState("");
    const [nodeLabel, setNodeLabel] = useState("");
    const [nodeGender, setNodeGender] = useState("male");
    const [selectedNode, setSelectedNode] = useState({});
    const [linkNodeList, setLinkNodeList] = useState([]);
    const [linkStatus, setLinkStatus] = useState(null);
    const [data, setData] = useState({
        nodes: [
            { id: 1, label: "A", gender: "male" },
            { id: 2, label: "B", gender: "female" },
            { id: 3, label: "C", gender: "male" },
            { id: 4, label: "D", gender: "male" },
            { id: 5, label: "E", gender: "female" },
            { id: 6, label: "F", gender: "male" },
        ],
        links: [
            { source: 1, target: 2, value: 2 },
            { source: 2, target: 3, value: 3 },
            { source: 3, target: 4, value: 2 },
            { source: 4, target: 5, value: 4 },
            { source: 5, target: 6, value: 3 },
            { source: 6, target: 1, value: 2 },
        ],
    });

    useEffect(() => {
        if (linkNodeList.length !== 2) {
            setLinkStatus(null);
        } else {
            // Check if currently exists
            const hasMatch = data.links.some(
                ({ source, target }) =>
                    (source.id === linkNodeList[0] &&
                        target.id === linkNodeList[1]) ||
                    (source.id === linkNodeList[1] &&
                        target.id === linkNodeList[0])
            );
            hasMatch ? setLinkStatus(true) : setLinkStatus(false);
        }
    }, [linkNodeList]);

    // Function to add a new node to the graph
    const addNode = () => {
        // Turn nodeId to type Number
        const numericNodeId = Number(nodeId);

        // Check if nodeId is empty
        if (!numericNodeId) return alert("Please enter an ID");

        // Check if nodeLabel is empty
        if (!nodeLabel) return alert("Please enter a label");

        // Check if the id is already in use
        const existingIds = data.nodes.map((node) => node.id);
        if (existingIds.includes(numericNodeId))
            return alert("ID already in use");

        // Add the new node to the data
        setData({
            ...data,
            nodes: [
                ...data.nodes,
                { id: numericNodeId, label: nodeLabel, gender: nodeGender },
            ],
        });

        // Reset the input values
        setNodeId("");
        setNodeLabel("");
        setNodeGender("male"); // Default - "male"
    };

    // Function to link two nodes in the graph
    const linkNodes = () => {
        // Add a link between the first and second nodes in linkNodeList
        setData({
            ...data,
            links: [
                ...data.links,
                { source: linkNodeList[0], target: linkNodeList[1], value: 2 },
            ],
        });

        // Clear the linkNodeList
        setLinkNodeList([]);
    };

    // Function to unlink two nodes in the graph
    const unlinkNodes = () => {
        // Filter out links that have both source and target in linkNodeList
        const filteredLinks = data.links.filter((link) => {
            return !(
                linkNodeList.includes(link.source.id) &&
                linkNodeList.includes(link.target.id)
            );
        });

        // Update the state with the new links array
        setData({
            nodes: data.nodes,
            links: filteredLinks,
        });

        // Clear the linkNodeList
        setLinkNodeList([]);
    };

    // Function to delete a node from the graph
    const deleteNode = () => {
        // Remove the selected node from the nodes array
        const updatedNodes = data.nodes.filter(
            (node) => node.id !== selectedNode.id
        );

        // Remove any links that have the selected node as source or target
        const updatedLinks = data.links.filter((link) => {
            return (
                link.source.id !== selectedNode.id &&
                link.target.id !== selectedNode.id
            );
        });

        // Update the state with the new nodes and links arrays
        setData({
            nodes: updatedNodes,
            links: updatedLinks,
        });

        // Clear the selectedNode
        setSelectedNode({});
    };

    return (
        <div className="w-screen h-screen flex flex-col items-center justify-center bg-blue-400 gap-2">
            <ForceDirectedGraph
                data={data}
                selectedNode={selectedNode}
                setSelectedNode={setSelectedNode}
                linkNodeList={linkNodeList}
                setLinkNodeList={setLinkNodeList}
            />
            <div className="w-[800px] h-56 flex gap-2">
                <div className="w-52 bg-white flex flex-col justify-between p-4 rounded-md">
                    <p className="font-bold text-lg text-center">
                        Add New Node
                    </p>
                    <div className="flex justify-between">
                        <label htmlFor="nodeId">ID: </label>
                        <input
                            id="nodeId"
                            type="number"
                            onChange={(e) => setNodeId(e.target.value)}
                            value={nodeId}
                            className="w-28 border-2 border-neutral-400 rounded-md px-2"
                            placeholder="Enter ID"
                        />
                    </div>
                    <div className="flex justify-between">
                        <label htmlFor="nodeLabel">Label: </label>
                        <input
                            id="nodeLabel"
                            type="text"
                            onChange={(e) => setNodeLabel(e.target.value)}
                            value={nodeLabel}
                            className="w-28 border-2 border-neutral-400 rounded-md px-2"
                            placeholder="Enter Label"
                        />
                    </div>
                    <div className="flex justify-between">
                        <label htmlFor="dropdown">Gender:</label>
                        <select
                            id="dropdown"
                            value={nodeGender}
                            onChange={(e) => setNodeGender(e.target.value)}
                            className="w-28 border-2 border-neutral-400 rounded-md px-2"
                        >
                            <option value="male">male</option>
                            <option value="female">female</option>
                        </select>
                    </div>
                    <button
                        className="px-2 py-1 bg-green-500 text-white rounded-md hover:bg-green-600 duration-100 ease-in-out"
                        onClick={addNode}
                    >
                        Add Node
                    </button>
                </div>
                <div className="w-52 bg-white flex flex-col justify-between p-4 rounded-md">
                    <p className="font-bold text-lg text-center">
                        Node Details
                    </p>
                    <div className="flex justify-between">
                        <p>ID:</p>
                        <p>
                            {Object.keys(selectedNode).length !== 0
                                ? selectedNode.id
                                : "None"}
                        </p>
                    </div>
                    <div className="flex justify-between">
                        <p>Label:</p>
                        <p>
                            {Object.keys(selectedNode).length !== 0
                                ? selectedNode.label
                                : "None"}
                        </p>
                    </div>
                    <div className="flex justify-between">
                        <p>Gender:</p>
                        <p>
                            {Object.keys(selectedNode).length !== 0
                                ? selectedNode.gender
                                : "None"}
                        </p>
                    </div>
                    <button
                        className="px-2 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 duration-100 ease-in-out disabled:bg-slate-400"
                        onClick={deleteNode}
                        disabled={
                            Object.keys(selectedNode).length === 0
                                ? "disabled"
                                : undefined
                        }
                    >
                        Delete Node
                    </button>
                </div>
                <div className="bg-white flex flex-col flex-grow p-4 rounded-md gap-2">
                    <p className="font-bold text-lg text-center">Link Nodes</p>
                    <div className="flex flex-grow">
                        <div className="w-1/3 grid place-content-center">
                            <p>Source ID</p>
                            <p className="text-center font-bold">
                                {linkNodeList.length > 0
                                    ? linkNodeList[0]
                                    : "None"}
                            </p>
                        </div>
                        <div className="w-1/3 flex justify-center items-center">
                            <button
                                disabled={
                                    linkStatus === null ? "disabled" : undefined
                                }
                                className={`px-4 py-2 text-white rounded-md ${
                                    linkStatus === null
                                        ? "bg-slate-400"
                                        : linkStatus
                                        ? "bg-red-500"
                                        : "bg-green-500"
                                }`}
                                onClick={() => {
                                    linkStatus === null
                                        ? ""
                                        : linkStatus
                                        ? unlinkNodes()
                                        : linkNodes();
                                }}
                            >
                                {linkStatus === null ? (
                                    <BsThreeDots />
                                ) : linkStatus ? (
                                    <FaLinkSlash />
                                ) : (
                                    <FaLink />
                                )}
                            </button>
                        </div>
                        <div className="w-1/3 grid place-content-center">
                            <p>Target ID</p>
                            <p className="text-center font-bold">
                                {linkNodeList.length > 1
                                    ? linkNodeList[1]
                                    : "None"}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default App;
