import { useState, useEffect } from "react"
import axios from "axios"
import toast, { Toaster } from "react-hot-toast"

const Collections = ({ setSelectedData }) => {
  const [collections, setCollections] = useState([])

  const handleClick = (data) => {
    setSelectedData(JSON.parse(data))
  }

  useEffect(() => {
    const getCollections = async () => {
      await axios.get("/api/getcollections").then((res) => {
        setCollections(res.data?.collections)
      })
    }

    getCollections()
  }, [])

  const handleDelete = async (id) => {
    await axios
      .delete("/api/deletegraph", {
        data: {
          id,
        },
      })
      .then((res) => {
        toast.success(res.data?.message)
      })
      .catch((err) => {
        toast.error(err.response?.data?.message)
      })
  }

  return (
    <section className="h-[800px] w-96 m-4 rounded-md overflow-y-auto">
      <Toaster />
      <div className="flex flex-col gap-2 p-2">
        <h1 className="text-2xl font-bold mb-2 text-foreground">
          Graph Collections
        </h1>
        {collections.map((collection) => (
          <div
            key={collection.id}
            onClick={() => handleClick(collection.graph)}
            className="p-4 font-medium rounded-md bg-foreground text-background cursor-pointer"
          >
            {collection.name}
            <div className="flex gap-2 mt-2">
              {/* <button
                onClick={() => handleUpdate(collection)}
                className="bg-blue-500  text-white px-2 py-1 rounded"
              >
                Update
              </button> */}
              <button
                onClick={() => handleDelete(collection.id)}
                className="bg-rose-500 text-white px-2 py-1 rounded-md"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default Collections
