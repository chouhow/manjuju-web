import { get, del } from './client'
import client from './client'
import type { Style, StyleExample } from '@/types/style'

export interface StyleListResponse {
  styles: Style[]
}

export interface StyleCategoryResponse {
  categories: string[]
}

export interface StyleExamplesResponse {
  examples: StyleExample[]
}

export const styleApi = {
  list: (params?: { style_type?: string; category?: string }) =>
    get<StyleListResponse>('/styles', params),

  getCategories: () => get<StyleCategoryResponse>('/style/categories'),

  getById: (uid: string) => get<Style>(`/styles/${uid}`),

  create: (data: {
    name: string
    category?: string
    description?: string
    style_type?: string
    reference_style_uid?: string
    example_image?: File
  }) => {
    const formData = new FormData()
    formData.append('name', data.name)
    if (data.category) formData.append('category', data.category)
    if (data.description) formData.append('description', data.description)
    if (data.style_type) formData.append('style_type', data.style_type)
    if (data.reference_style_uid)
      formData.append('reference_style_uid', data.reference_style_uid)
    if (data.example_image) formData.append('example_image', data.example_image)

    return client.post<{
      code: number
      msg: string
      data: Style
    }>('/styles', formData).then((res) => res.data.data)
  },

  update: (
    uid: string,
    data: {
      name?: string
      category?: string
      description?: string
      example_image?: File
    }
  ) => {
    const formData = new FormData()
    if (data.name) formData.append('name', data.name)
    if (data.category) formData.append('category', data.category)
    if (data.description) formData.append('description', data.description)
    if (data.example_image) formData.append('example_image', data.example_image)

    return client.put<{
      code: number
      msg: string
      data: Style
    }>(`/styles/${uid}`, formData).then((res) => res.data.data)
  },

  delete: (uid: string) => del<{ deleted: boolean }>(`/styles/${uid}`),

  // ===== 风格示例 =====

  getExamples: (styleUid: string, exampleType?: string) =>
    get<StyleExamplesResponse>(`/styles/${styleUid}/examples`,
      exampleType ? { example_type: exampleType } : undefined
    ),

  addExample: (
    styleUid: string,
    data: {
      example_type: string
      prompt_example?: string
      example_image?: File
      priority?: number
    }
  ) => {
    const formData = new FormData()
    formData.append('example_type', data.example_type)
    if (data.prompt_example) formData.append('prompt_example', data.prompt_example)
    if (data.example_image) formData.append('example_image', data.example_image)
    if (data.priority !== undefined)
      formData.append('priority', String(data.priority))

    return client.post<{
      code: number
      msg: string
      data: StyleExample
    }>(`/styles/${styleUid}/examples`, formData).then((res) => res.data.data)
  },

  deleteExample: (styleUid: string, exampleId: string) =>
    del<{ deleted: boolean }>(`/styles/${styleUid}/examples/${exampleId}`),
}
