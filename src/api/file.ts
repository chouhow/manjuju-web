import client from './client'
import type { UploadedFile } from '@/types/file'

export const fileApi = {
  upload: (file: File) => {
    const formData = new FormData()
    formData.append('file', file)
    return client
      .post<{
        code: number
        msg: string
        data: UploadedFile
      }>('/files/upload', formData)
      .then((res) => res.data.data)
  },
}
