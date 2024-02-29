import ScreenView, { ScreenViewProps } from '@/components/screen-layout/ScreenView'

const ScreenViewCentered = ({ children, contentPosition = 'center', ...rest }: ScreenViewProps) => {
  return (
    <ScreenView contentPosition={contentPosition} {...rest}>
      {children}
    </ScreenView>
  )
}

export default ScreenViewCentered
