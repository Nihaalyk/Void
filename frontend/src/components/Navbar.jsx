import Link from "next/link"

const Navbar = () => {
  return (
    <nav className="bg-accent flex justify-between p-4 ">
      <div className="flex justify-center items-center">
        <Link href="/">
          <h1 className="text-white text-4xl font-bold">OMNI</h1>
        </Link>
      </div>

      <div className="flex justify-center items-center">
        <Link
          href="/knowledge"
          className="bg-background px-4 py-2 rounded-full"
        >
          <span className="font-bold text-sm text-accent">My Graphs</span>
        </Link>
      </div>
    </nav>
  )
}

export default Navbar
