// Imports
import * as d3 from "d3";
import { useRef, useEffect } from "react";

const ForceDirectedGraphReusable = ({ data }) => {
    const containerRef = useRef(null);
    useEffect(() => {
        // Remove existing SVG element
        d3.select(containerRef.current).select("svg").remove();
        d3.select("body").select(".tooltip").remove();

        // Define the dimensions and margins of the graph
        const margin = { top: 10, right: 10, bottom: 10, left: 10 };
        const width = 800 - margin.left - margin.right;
        const height = 600 - margin.top - margin.bottom;

        // Create a SVG element
        const svg = d3
            .select(containerRef.current)
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .style("background-color", "white")
            .style("border-radius", "10px")
            .append("g");

        // Create the force simulation
        const simulation = d3
            .forceSimulation(data.nodes)
            .force(
                "link",
                d3
                    .forceLink(data.links)
                    .id((d) => d.id)
                    .distance(50)
            )
            .force("charge", d3.forceManyBody().strength(-100))
            .force("center", d3.forceCenter(width / 2, height / 2));

        // Create the links
        const link = svg
            .selectAll(".link")
            .data(data.links)
            .join("line")
            // Implement CSS on SVG (each line or 'links')
            .attr("stroke", "black")
            .attr("stroke-width", (d) => d.value)
            .attr("stroke-opacity", 0.8);

        // Create the tooltip element
        const tooltip = d3
            .select("body")
            .append("div")
            // Attach class for custom css styling
            .attr("class", "tooltip");

        // Create the nodes
        const node = svg
            .selectAll(".node")
            .data(data.nodes)
            .join("circle")
            // Implement CSS on SVG (each circle or 'nodes')
            .attr("stroke", "black")
            .attr("stroke-width", 3)
            .attr("r", 20)
            .attr("fill", (d) => (d.gender === "male" ? "#60a5fa" : "#f472b6")) // blue : pink
            // Implement event listeners
            // Mouseover Event -> Show Tooltip
            .on("mouseover", (event, d) => {
                tooltip.transition().duration(200).style("opacity", 0.8);
                tooltip
                    .html(
                        `<strong>ID:</strong> ${d.id}<br><strong>Label:</strong> ${d.label}<br><strong>Gender:</strong> ${d.gender}`
                    )
                    .style("left", event.pageX + 20 + "px")
                    .style("top", event.pageY + "px");
            })
            // Mouseout Event -> Hide Tooltip
            .on("mouseout", () => {
                tooltip.transition().duration(200).style("opacity", 0);
            });

        simulation.on("tick", () => {
            // Update + constrain node positions (Ensure nodes stay in the frame)
            node.attr("cx", (d) => {
                d.x = Math.max(25, Math.min(width - 5, d.x));
                return d.x;
            }).attr("cy", (d) => {
                d.y = Math.max(25, Math.min(height - 5, d.y));
                return d.y;
            });

            // Update link positions
            link.attr("x1", (d) => d.source.x)
                .attr("y1", (d) => d.source.y)
                .attr("x2", (d) => d.target.x)
                .attr("y2", (d) => d.target.y);
        });

        // Drag event functions
        const dragstarted = (event, d) => {
            if (!event.active) simulation.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
        };

        const dragged = (event, d) => {
            d.fx = event.x;
            d.fy = event.y;
        };

        const dragended = (event, d) => {
            if (!event.active) simulation.alphaTarget(0);
            d.fx = null;
            d.fy = null;
        };

        // Create the drag behavior
        const drag = d3
            .drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended);

        // Apply the drag behavior to the nodes
        node.call(drag);

        return () => {
            // Clean up simulation
            simulation.stop();
        };
    }, [data]);
    return <div ref={containerRef} className="flex relative"></div>;
};

export default ForceDirectedGraphReusable;
