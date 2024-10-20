import crypto from "crypto"

export const generateVerificationToken = () => {
  const verificationToken = crypto.randomBytes(32).toString("hex")
  const verificationTokenExpiredAt = new Date(Date.now() + 1000 * 60 * 60 * 24)
  return { verificationToken, verificationTokenExpiredAt }
}
