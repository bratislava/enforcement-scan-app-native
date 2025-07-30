import { useRouter } from 'expo-router'
import { useTranslation } from 'react-i18next'

import AvatarCircleIcon from '@/components/info/AvatarCircleIcon'
import Modal from '@/components/screen-layout/Modal/Modal'
import ModalContentWithActions from '@/components/screen-layout/Modal/ModalContentWithActions'

type Props = {
  visible: boolean
  onContinue?: () => void
  onCloseModal: () => void
}

export const ChangeZoneModal = ({ visible, onContinue, onCloseModal }: Props) => {
  const { t } = useTranslation()
  const router = useRouter()

  const handleContinue = () => {
    onContinue?.()
    router.navigate('/zone')
  }

  return (
    <Modal visible={visible} onRequestClose={onCloseModal}>
      <ModalContentWithActions
        customAvatarComponent={<AvatarCircleIcon name="map" />}
        title={t('zone.changeModal.title')}
        text={t('zone.changeModal.text')}
        primaryActionLabel={t('zone.changeModal.button')}
        primaryActionOnPress={handleContinue}
        secondaryActionLabel={t('zone.changeModal.close')}
        secondaryActionOnPress={onCloseModal}
      />
    </Modal>
  )
}
