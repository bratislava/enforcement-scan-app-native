import { Arcgis } from '@/modules/arcgis/types'

/**
 * Sign type that belongs to a street segment
 *
 * Resident segments (UDR ID "0") are marked by resident signs, all other segments by zone signs.
 *
 * @param udrId UDR ID of the selected segment
 * @returns the sign type expected for the segment
 */
export const getExpectedSignType = (udrId?: string): Arcgis.SignPoint['typ_znacky'] =>
  udrId === '0' ? 'rezidenti' : 'zona'
