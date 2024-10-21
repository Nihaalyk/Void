import Choose from "@/components/Choose"
import { getCurrentUser } from "@/app/actions/getCurrentUser"

const Visualize = async () => {
  const currentUser = await getCurrentUser()

  return <Choose currentUser={currentUser} />
}

export default Visualize
