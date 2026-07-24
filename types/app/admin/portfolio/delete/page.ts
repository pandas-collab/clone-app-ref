import type { Metadata } from 'next'

export interface PageProps {
  params: {
    id: string
  }
  searchParams: { [key: string]: string | string[] | undefined }
}

export interface GenerateMetadataProps {
  params: {
    id: string
  }
  searchParams: { [key: string]: string | string[] | undefined }
}

export type { Metadata }

export default interface Page {
  (props: PageProps): Promise<JSX.Element> | JSX.Element
}

export interface GenerateMetadata {
  (props: GenerateMetadataProps): Promise<Metadata> | Metadata
}