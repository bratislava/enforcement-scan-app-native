import React from 'react'
import { View } from 'react-native'

import Icon from '@/components/shared/Icon'

const AvatarCirclePerson = () => {
  return (
    <View className="flex items-center justify-center rounded-full bg-light p-6">
      <Icon name="person" className="text-black" size={40} />
    </View>
  )
}

export default AvatarCirclePerson
