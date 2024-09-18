export const sanitizeLicencePlate = (licencePlate: string) => {
  // Even though the input is auto-capitalized, we still want to be sure that it's upper case.
  return licencePlate.toUpperCase().replaceAll(/\s/g, '')
}
