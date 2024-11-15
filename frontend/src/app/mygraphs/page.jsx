"use client"

import { useEffect, useState } from "react"
import Collections from "@/components/Collections"
import D3visual from "@/components/D3visual"
import Extra from "@/components/Extra"

const MyGraphs = () => {
  const [selectedData, setSelectedData] = useState(null)
  return (
    <section className="flex flex-row pt-20">
      <Collections setSelectedData={setSelectedData} />
      <div className="flex flex-col gap-10">
        <D3visual data={selectedData} />
        <Extra />
      </div>
    </section>
  )
}

export default MyGraphs
