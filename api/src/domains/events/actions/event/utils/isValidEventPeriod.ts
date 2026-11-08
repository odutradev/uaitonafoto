export const isValidEventPeriod = (startsAt: string, endsAt: string): boolean =>
  new Date(endsAt).getTime() > new Date(startsAt).getTime()

export default isValidEventPeriod
