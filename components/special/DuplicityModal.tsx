import { useRouter } from 'expo-router'
import { useTranslation } from 'react-i18next'

import AvatarCircle from '@/components/info/AvatarCircle'
import Modal from '@/components/screen-layout/Modal/Modal'
import ModalContentWithActions from '@/components/screen-layout/Modal/ModalContentWithActions'

type Props = {
  visible: boolean
  onCloseModal: () => void
}

export const DuplicityModal = ({ visible, onCloseModal }: Props) => {
  const { t } = useTranslation()
  const router = useRouter()

  const onContinue = () => {
    router.navigate('/offence/vehicle')
  }

  return (
    <Modal onRequestClose={onCloseModal} visible={visible}>
      <ModalContentWithActions
        customAvatarComponent={<AvatarCircle variant="warning" />}
        title={t('offence.duplicity.title')}
        text={t('offence.duplicity.text')}
        primaryActionLabel={t('offence.duplicity.button')}
        primaryActionOnPress={onContinue}
        secondaryActionLabel={t('offence.duplicity.close')}
        secondaryActionOnPress={onCloseModal}
      />
    </Modal>
  )
}
