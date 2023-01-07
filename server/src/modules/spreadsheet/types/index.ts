export type Target = {
  maxCountPerDay: number
  count: number
  name: string
}

export type ProgressRow = {
  targetName: string
  count: number
  dueDate: string
  progress: number
  totalCount: number
  done: boolean
}

export type Spreadsheet = {
  sheetId: string
  userId: string
}
