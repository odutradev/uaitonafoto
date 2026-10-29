export const applyCPFMask = (value: string): string => {
  const numbers = value.replace(/\D/g, '').slice(0, 11)
  return numbers
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2')
}

export const applyRegistrationMask = (value: string): string => {
  const match = value.replace(/[^a-zA-Z0-9]/g, '').match(/^([a-zA-Z]?)([0-9]{0,7})/)
  if (!match) return ''
  const [, letter, digits] = match
  const lowerLetter = letter.toLowerCase()
  if (!lowerLetter && !digits) return ''
  if (!lowerLetter) return digits
  return digits ? `${lowerLetter}-${digits}` : lowerLetter
}