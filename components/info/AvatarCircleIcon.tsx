import React from 'react'
import { View } from 'react-native'

import Icon, { IconName } from '@/components/shared/Icon'

// Figma: https://www.figma.com/file/3TppNabuUdnCChkHG9Vft7/paas-mpa?node-id=3196%3A14554&mode=dev

type Props = {
  name: IconName
}

const AvatarCircleIcon = ({ name }: Props) => {
  return (
    <View className="flex items-center justify-center rounded-full bg-light p-4">
      <Icon name={name} className="text-black" size={24} />
    </View>
  )
}

export default AvatarCircleIcon
