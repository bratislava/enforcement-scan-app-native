import { useRouter } from 'expo-router'
import { useTranslation } from 'react-i18next'

import AvatarCircleIcon from '@/components/info/AvatarCircleIcon'
import Modal from '@/components/screen-layout/Modal/Modal'
import ModalContentWithActions from '@/components/screen-layout/Modal/ModalContentWithActions'

type Props = {
  visible: boolean
  onCloseModal: () => void
}

export const ChangeZoneModal = ({ visible, onCloseModal }: Props) => {
  const { t } = useTranslation()
  const router = useRouter()

  const onContinue = () => {
    router.navigate('/zone')
  }

  return (
    <Modal visible={visible}>
      <ModalContentWithActions
        customAvatarComponent={<AvatarCircleIcon name="map" />}
        title={t('zone.changeModal.title')}
        text={t('zone.changeModal.text')}
        primaryActionLabel={t('zone.changeModal.button')}
        primaryActionOnPress={onContinue}
        secondaryActionLabel={t('zone.changeModal.close')}
        secondaryActionOnPress={onCloseModal}
      />
    </Modal>
  )
}
