import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import Modal from '@/components/screen-layout/Modal/Modal'
import ModalContent from '@/components/screen-layout/Modal/ModalContent'
import Button from '@/components/shared/Button'
import PressableStyled from '@/components/shared/PressableStyled'
import Typography from '@/components/shared/Typography'

export type SignChoice = {
  globalId: string
  title: string
  distanceText: string | null
}

type Props = {
  choices: SignChoice[]
  onSelect: (globalId: string) => void
  onClose: () => void
}

/**
 * Lets the inspector pick one sign when a single map tap hits several signs (e.g. two on one pole)
 */
const SignChooserModal = ({ choices, onSelect, onClose }: Props) => {
  const { t } = useTranslation()

  return (
    <Modal visible={choices.length > 0} onRequestClose={onClose}>
      <ModalContent>
        <Typography variant="h2">{t('zone.sign.chooser.title')}</Typography>

        <View className="g-2">
          {choices.map((choice) => (
            <PressableStyled
              key={choice.globalId}
              testID={`zoneSignChoice-${choice.globalId}`}
              accessibilityRole="button"
              className="min-h-[48px] justify-center rounded border border-divider px-4 py-3"
              onPress={() => onSelect(choice.globalId)}
            >
              <Typography variant="default-bold">{choice.title}</Typography>
              {choice.distanceText ? (
                <Typography variant="small">{choice.distanceText}</Typography>
              ) : null}
            </PressableStyled>
          ))}
        </View>

        <Button variant="secondary" onPress={onClose}>
          {t('zone.sign.chooser.close')}
        </Button>
      </ModalContent>
    </Modal>
  )
}

export default SignChooserModal
