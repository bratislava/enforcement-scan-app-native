import { useQuery } from '@tanstack/react-query'
import * as Application from 'expo-application'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Linking } from 'react-native'

import AvatarCircle from '@/components/info/AvatarCircle'
import Modal from '@/components/screen-layout/Modal/Modal'
import ModalContentWithActions from '@/components/screen-layout/Modal/ModalContentWithActions'
import { environment } from '@/environment'
import { getMobileAppVersionOptions } from '@/modules/backend/constants/queryOptions'

const goToStore = () => {
  // TODO: change when link changes to different one (this is for internal testing)
  Linking.openURL('https://play.google.com/apps/internaltest/4699826095220029590')
}

const StoreVersionControl = () => {
  const { t } = useTranslation()
  const [showModal, setShowModal] = useState(false)

  const appVersionQuery = useQuery(getMobileAppVersionOptions())

  useEffect(() => {
    if (
      environment.deployment === 'production' &&
      appVersionQuery.data &&
      Application.nativeApplicationVersion &&
      // compare version numbers and if api has greater than the current one, show the modal
      appVersionQuery.data.localeCompare(Application.nativeApplicationVersion, undefined, {
        numeric: true,
        sensitivity: 'base',
      }) === 1
    ) {
      setShowModal(true)
    }
  }, [appVersionQuery.data])

  const closeModal = () => {
    setShowModal(false)
  }

  return (
    <Modal visible={showModal}>
      <ModalContentWithActions
        customAvatarComponent={<AvatarCircle />}
        title={t('StoreVersionControl.title')}
        text={t('StoreVersionControl.text')}
        primaryActionLabel={t('StoreVersionControl.primaryActionLabel')}
        primaryActionOnPress={goToStore}
        secondaryActionLabel={t('StoreVersionControl.secondaryActionLabel')}
        secondaryActionOnPress={closeModal}
      />
    </Modal>
  )
}

export default StoreVersionControl
