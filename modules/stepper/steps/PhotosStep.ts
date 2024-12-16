import { OffenceStep } from '@/modules/stepper/types'

export type PhotosStep = OffenceStep<'offence/photos', { numberOfPhotos: number }>

export const isPhotosStep = (step?: OffenceStep<string>): step is PhotosStep => {
  return !!(step && step.path === 'offence/photos')
}
