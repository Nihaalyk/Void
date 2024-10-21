"use client"

import { useEffect, useState } from "react"
import Collections from "@/components/Collections"
import D3visual from "@/components/D3visual"

const MyGraphs = () => {
  const [selectedData, setSelectedData] = useState(null)
  return (
    <section className="flex flex-row pt-20">
      <Collections setSelectedData={setSelectedData} />
      <D3visual data={selectedData} />
    </section>
  )
}

export default MyGraphs
