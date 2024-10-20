import { useRef, useState, useEffect } from "react"
import * as d3 from "d3"
import Container from "./Container"

const D3visual = ({ data }) => {
  const svgRef = useRef()

  useEffect(() => {
    if (!data) return

    const svg = d3.select(svgRef.current)
    svg.selectAll("*").remove()

    const width = 1920
    const height = 1080

    const root = d3.hierarchy(data)
    const treeLayout = d3
      .tree()
      .size([height, width])
      .nodeSize([40, 400])
      .separation((a, b) => (a.parent === b.parent ? 1 : 4))

    treeLayout(root)

    const zoom = d3
      .zoom()
      .scaleExtent([0.5, 2])
      .on("zoom", (event) => {
        g.attr("transform", event.transform)
      })

    svg.call(zoom)

    const g = svg.append("g").attr("transform", "translate(40,0)")

    const color = d3.scaleOrdinal(d3.schemeCategory10)

    const link = g
      .append("g")
      .selectAll("path")
      .data(root.links())
      .enter()
      .append("path")
      .attr(
        "d",
        d3
          .linkHorizontal()
          .x((d) => d.y)
          .y((d) => d.x)
      )
      .attr("fill", "none")
      .attr("stroke", (d) => color(d.source.depth))

    const node = g
      .append("g")
      .selectAll("g")
      .data(root.descendants())
      .enter()
      .append("g")
      .attr("transform", (d) => `translate(${d.y},${d.x})`)

    node
      .append("circle")
      .attr("r", 5)
      .attr("fill", (d) => color(d.depth))

    node
      .append("text")
      .attr("dy", 3)
      .attr("x", (d) => (d.children ? -8 : 8))
      .style("text-anchor", (d) => (d.children ? "end" : "start"))
      .style("fill", "#3e363f")
      .text((d) => d.data.name)
  }, [data])

  if (!data) {
    return (
      <Container>
        <div className="w-full h-full flex items-center justify-center border-2 border-accent rounded-md">
          <p className="text-2xl text-center text-foreground">
            No data to visualize
          </p>
        </div>
      </Container>
    )
  }

  return (
    <Container>
      <div className="w-full h-full border-2 border-accent rounded-md">
        <svg ref={svgRef} className="w-full h-full"></svg>
      </div>
    </Container>
  )
}

export default D3visual
