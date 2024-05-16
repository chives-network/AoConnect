// ** Types
import { Dispatch } from 'redux'
import { ReactElement, SyntheticEvent } from 'react'
import { TxRecordType } from 'src/types/apps/Chivesweave'

export type LabelType = 'personal' | 'company' | 'important' | 'private'

export type FolderType = 'inbox' | 'sent' | 'draft' | 'starred' | 'spam' | 'trash' | 'myfiles' | 'uploaded' | 'Root'

export type RouteParams = {
  label: string
  initFolder: string
  type: string
}

export type DriveLayoutType = RouteParams & {}

export type MailAttachmentType = {
  url: string
  size: string
  fileName: string
  thumbnail: string
}

export type FieldMenuItems = {
  src: string
  name: string
  value: string
}

export type FetchMailParamsType = { q: string; folder: FolderType; label: LabelType }

export type PaginateMailParamsType = { dir: 'next' | 'previous'; emailId: string }

export type UpdateMailParamsType = {
  emailIds: string[] | string | []
  dataToUpdate: { folder?: FolderType; isStarred?: boolean; isRead?: boolean; label?: LabelType }
}

export type UpdateLabelType = {
  label: LabelType
  emailIds: string[] | string | []
}

export type MailFromType = {
  name: string
  email: string
  avatar: string
}

export type MailToType = {
  name: string
  email: string
}

export type MailMetaType = {
  spam: number
  inbox: number
  draft: number
}

export type MailType = {
  id: number
  message: string
  subject: string
  isRead: boolean
  to: MailToType[]
  cc: string[] | []
  isStarred: boolean
  bcc: string[] | []
  from: MailFromType
  time: Date | string
  replies: MailType[]
  hasNextMail?: boolean
  folder: FolderType
  labels: LabelType[]
  hasPreviousMail?: boolean
  attachments: MailAttachmentType[]
}

export type MailFoldersArrType = {
  icon: ReactElement
  name: FolderType
}

export type MailFoldersObjType = {
  [key: string]: any[]
}

export type MailStore = {
  data: any[] | null
  files: MailType[] | null
  selectedFiles: number[]
  currentFile: null | MailType
  mailMeta: null | MailMetaType
  filter: {
    q: string
    label: string
    folder: string
  }
}

export type DriveLabelColors = {
  personal: string
  company: string
  private: string
  important: string
}

export type MailSidebarType = {
  hidden: boolean
  store: MailStore
  lgAbove: boolean
  dispatch: Dispatch<any>
  leftSidebarOpen: boolean
  leftSidebarWidth: number
  driveFileOpen: boolean
  toggleUploadFilesOpen: () => void
  handleLeftSidebarToggle: () => void
  setFileDetailOpen: (val: boolean) => void
  handleSelectAllFile: (val: boolean) => void
}

export type DriveListType = {
  query: string
  hidden: boolean
  store: any
  lgAbove: boolean
  dispatch: Dispatch<any>
  direction: 'ltr' | 'rtl'
  driveFileOpen: boolean
  routeParams: RouteParams
  labelColors: any
  folder: any
  setQuery: (val: string) => void
  handleLeftSidebarToggle: () => void
  setCurrentFile: (item: TxRecordType) => void
  handleSelectFile: (id: string) => void
  setFileDetailOpen: (val: boolean) => void
  handleSelectAllFile: (val: boolean) => void
  paginationModel: any
  handlePageChange: (event: any, page: number) => void
  handleFolderChange: (folder: string) => void  
  folderHeaderList: any[]
  handleFolderHeaderList: (folderHeader: any) => void  
}

export type FileDetailType = {
  currentFile: TxRecordType
  hidden: boolean
  dispatch: Dispatch<any>
  direction: 'ltr' | 'rtl'
  driveFileOpen: boolean
  routeParams: RouteParams
  labelColors: any
  folderColors: any
  folders: MailFoldersArrType[]
  foldersObj: MailFoldersObjType
  setFileDetailOpen: (val: boolean) => void
  handleStarDrive: (e: SyntheticEvent, id: string, value: boolean) => void
  handleLabelUpdate: (id: string | null, label: LabelType) => void
  handleFolderUpdate: (id: string | null, folder: FolderType) => void
  handleMoveToTrash: (id: string | null) => void
  handleMoveToSpam: (id: string | null) => void
}

export type MailComposeType = {
  mdAbove: boolean
  uploadFilesOpen: boolean
  toggleUploadFilesOpen: () => void
  composePopupWidth: string
}
