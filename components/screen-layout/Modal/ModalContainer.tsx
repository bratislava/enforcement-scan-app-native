import { useTranslation } from 'react-i18next'
import { ModalProps, View, ViewProps } from 'react-native'

import IconButton from '@/components/shared/IconButton'
import { cn } from '@/utils/cn'

type ModalContainerProps = {
  onRequestClose: ModalProps['onRequestClose']
} & ViewProps

const ModalContainer = ({ className, onRequestClose, children, ...rest }: ModalContainerProps) => {
  const { t } = useTranslation()

  return (
    <View {...rest} className={cn('w-full overflow-hidden rounded bg-white', className)}>
      {children}
      <IconButton
        name="close"
        // TODO translation
        // TODO add option to hide this button
        accessibilityLabel={t('modal.close')}
        className="absolute right-4 top-4"
        onPress={onRequestClose}
      />
    </View>
  )
}

export default ModalContainer
