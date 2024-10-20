import Choose from "@/components/Choose"
import { getCurrentUser } from "@/app/actions/getCurrentUser"

const page = async () => {
  const currentUser = await getCurrentUser()
  return (
    <section className="h-full flex flex-col justify-center">
      <Choose currentUser={currentUser} />
    </section>
  )
}

export default page
