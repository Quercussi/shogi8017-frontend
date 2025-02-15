export function shouldRefreshToken(
  expiryTime: Date,
  thresholdSeconds: number,
): boolean {
  const currentTime = new Date().getTime()
  const expiryTimeInMillis = expiryTime.getTime()
  const timeRemaining = expiryTimeInMillis - currentTime

  return timeRemaining < thresholdSeconds * 1000
}