export const isValidCPF = (cpf: string): boolean => {
  const cleanCPF = cpf.replace(/[^\d]+/g, '')
  if (cleanCPF.length !== 11 || !!cleanCPF.match(/(\d)\1{10}/)) return false
  const calcDigit = (factor: number, limit: number) => {
    const sum = cleanCPF.split('').slice(0, limit).reduce((acc, digit, index) => {
      return acc + Number(digit) * (factor - index)
    }, 0)
    const rest = (sum * 10) % 11
    return rest === 10 || rest === 11 ? 0 : rest
  }
  return calcDigit(10, 9) === Number(cleanCPF.charAt(9)) && calcDigit(11, 10) === Number(cleanCPF.charAt(10))
}

export const isValidRegistration = (registration: string): boolean => {
  return /^[a-zA-Z]-\d{7}$/.test(registration)
}