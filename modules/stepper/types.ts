import { LicencePlateStep } from '@/modules/stepper/steps/LicencePlateStep'
import { OffenceDetailsStep } from '@/modules/stepper/steps/OffenceDetailsStep'
import { PhotosStep } from '@/modules/stepper/steps/PhotosStep'
import { VehicleStep } from '@/modules/stepper/steps/VehicleStep'
import { ZoneStep } from '@/modules/stepper/steps/ZoneStep'

export type OffenceStep<T extends string = string, P extends object = {}> = {
  path: T
  options?: P
}

export type AvailableSteps =
  | PhotosStep
  | VehicleStep
  | ZoneStep
  | LicencePlateStep
  | OffenceDetailsStep
