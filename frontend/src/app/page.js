import Choose from "@/components/Choose"
import { getCurrentUser } from "@/app/actions/getCurrentUser"
import Hero from "@/components/Hero"

const page = async () => {
  const currentUser = await getCurrentUser()
  return (
    <>
      <Hero currentUser={currentUser} />
    </>
  )
}

export default page
