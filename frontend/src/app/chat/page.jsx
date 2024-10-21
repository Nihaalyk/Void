import ChatComp from "@/components/ChatComp"
import { getCurrentUser } from "@/app/actions/getCurrentUser"

const Chat = async () => {
  const currentUser = await getCurrentUser()

  return <ChatComp currentUser={currentUser} />
}

export default Chat
