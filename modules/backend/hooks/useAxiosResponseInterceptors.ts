import { AxiosResponse, isAxiosError } from 'axios'
import { useEffect } from 'react'

import { useSnackbar } from '@/components/screen-layout/Snackbar/useSnackbar'
import { axiosInstance } from '@/modules/backend/axios-instance'

// https://dev.to/arianhamdi/react-hooks-in-axios-interceptors-3e1h

export const useAxiosResponseInterceptors = () => {
  const snackbar = useSnackbar()

  useEffect(() => {
    const errorInterceptor = (error: unknown) => {
      let snackbarMessage = null
      if (isAxiosError(error)) {
        const { status, data } = error.response ?? {}
        const { errorName, message }: { errorName?: string; message?: string } = data

        // eslint-disable-next-line sonarjs/no-small-switch
        switch (status) {
          case 422:
            // the 422 errors are handled localy
            break
          case 424:
            if (errorName || message) {
              snackbarMessage = errorName && message
            }
            break

          default:
            if (status) {
              snackbarMessage ??= status.toString()
            }

            snackbarMessage ??=
              'Pri spracovaní vašej požiadavky sa vyskytla chyba. Skúste to prosím neskôr.'
            break
        }
      } else snackbarMessage ??= 'Vyskytla sa chyba.'

      if (snackbarMessage) {
        snackbar.show(snackbarMessage, { variant: 'danger' })
      }

      return Promise.reject(error)
    }

    const successInterceptor = (response: AxiosResponse) => {
      return response
    }

    const interceptor = axiosInstance.interceptors.response.use(
      successInterceptor,
      errorInterceptor,
    )

    return () => axiosInstance.interceptors.response.eject(interceptor)
  }, [snackbar])
}
