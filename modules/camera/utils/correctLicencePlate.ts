/**
 * Corrects a licence plate by replacing misread characters with their correct counterparts.
 * @param input not sanitized licence plate
 * @returns sanitized licence plate
 */
export const correctLicencePlate = (input: string) => {
  // Correction maps
  const toNumberMap: { [key: string]: string } = { O: '0', I: '1', T: '7' }
  const toLetterMap: { [key: string]: string } = { '0': 'O', '1': 'I', '7': 'T' }

  const ecvFormatRegex = /([\dA-Za-z]{2})[A-Za-z]*([\dIOT]{3})([\dA-Za-z]{2})[A-Za-z]*/

  // Function to correct a character if it's a misread letter (only when format matches CCNNNCC)
  const correctToNumber = (match: string) => {
    if (ecvFormatRegex.test(input)) {
      return toNumberMap[match] || match
    }

    return match
  }

  // Function to correct a character if it's a misread number
  const correctToLetter = (match: string) => {
    return toLetterMap[match] || match
  }

  // Format the ECV to remove any extra characters
  const formattedEcv = input.replace(ecvFormatRegex, '$1$2$3')

  // Correct the ECV
  return formattedEcv.replace(/^(.{2})(.{3})(.{2})$/, (_, g1, g2, g3) => {
    return `${g1.replaceAll(/[017]/g, correctToLetter)}${g2.replaceAll(/[IOT]/g, correctToNumber)}${g3.replaceAll(/[017]/g, correctToLetter)}`
  })
}
