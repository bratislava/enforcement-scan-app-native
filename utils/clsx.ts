import cn from 'clsx'
import { twMerge } from 'tailwind-merge'

export const clsx = (...inputs: cn.ClassValue[]) => {
  return twMerge(cn(inputs))
}
