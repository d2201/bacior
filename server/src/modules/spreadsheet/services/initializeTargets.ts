import { GoogleSpreadsheet, GoogleSpreadsheetRow } from 'google-spreadsheet'
import { DateTime } from 'luxon'
import { ProgressRow, Target } from '../types'
import createDebugger from 'debug'
import { Pointer } from '../../../utils'

const debug = createDebugger('bacior:initialize-targets')

class DateTimePointer extends Pointer<DateTime> {}

export const initializeTargets = async (spreadsheet: GoogleSpreadsheet) => {
  // there may be existing rows in the progress sheet
  const progressSheet = spreadsheet.sheetsByIndex[0]

  debug('loading progress sheet cells')
  await progressSheet.loadCells()
  debug('loaded cells')

  const progressRows = await progressSheet.getRows()
  debug('current amount of existing rows:', progressRows.length)

  const pointer = new DateTimePointer(calculateNextPossibleDate(progressRows))

  const existingTargetsCache = cacheExistingTargets(progressRows)

  const targetSheet = spreadsheet.sheetsByIndex[1]

  await targetSheet.loadCells()

  const targetRows = await targetSheet.getRows()

  const newTargets = resolveNewTargets(targetRows, existingTargetsCache)

  const rowsToAdd: ProgressRow[] = newTargets.flatMap((target) =>
    targetToProgressRows(target, pointer)
  )

  debug(`calculated everything... adding ${rowsToAdd.length} rows`)
  await progressSheet.addRows(rowsToAdd.map(progressRowToSpreadsheetRow))
}

const calculateNextPossibleDate = (
  progressRows: GoogleSpreadsheetRow[]
): DateTime => {
  for (const row of [...progressRows].reverse()) {
    if (row.due_date) {
      return DateTime.fromSQL(row.due_date).plus({ day: 1 })
    }
  }

  let localDate = DateTime.local()

  const hour = DateTime.local().get('hour')

  if (hour >= 20) {
    localDate = localDate.plus({ day: 1 })
  }

  return localDate
}

const cacheExistingTargets = (
  progressRows: GoogleSpreadsheetRow[]
): Set<string> => {
  return new Set(progressRows.map((row) => row.nazwa_celu))
}

const resolveNewTargets = (
  targetRows: GoogleSpreadsheetRow[],
  existingTargets: Set<string>
): Target[] => {
  return targetRows
    .map(rowToTarget)
    .filter((target) => !existingTargets.has(target.name))
}

const rowToTarget = (row: GoogleSpreadsheetRow): Target => ({
  maxCountPerDay: +row.max_liczba_stron_dziennie,
  count: +row.liczba,
  name: row.nazwa,
})

const targetToProgressRows = (
  target: Target,
  pointer: DateTimePointer
): ProgressRow[] => {
  const batchSize = target.maxCountPerDay
  const lastBatchSize = target.count % batchSize
  const estimatedDaysToComplete = Math.ceil(target.count / batchSize)

  const progressRows: ProgressRow[] = []

  let currentDate = pointer.resolve()
  let accumulatedSum = batchSize

  // we don't want to add the last row here, because it's a special case
  for (let day = 1; day < estimatedDaysToComplete; day++) {
    progressRows.push({
      targetName: target.name,
      count: batchSize,
      dueDate: currentDate.toSQLDate(),
      progress: accumulatedSum,
      totalCount: target.count,
      done: false,
    })

    currentDate = currentDate.plus({ day: 1 })
    accumulatedSum += batchSize
  }

  progressRows.push({
    targetName: target.name,
    count: lastBatchSize,
    dueDate: currentDate.toSQLDate(),
    progress: target.count,
    totalCount: target.count,
    done: false,
  })

  pointer.set(currentDate.plus({ day: 1 }))

  return progressRows
}

const progressRowToSpreadsheetRow = (row: ProgressRow): Record<string, any> => {
  return {
    nazwa_celu: row.targetName,
    liczba_jednostki: row.count,
    due_date: row.dueDate,
    progres: row.progress,
    cel: row.totalCount,
    zrobione: row.done ? 'tak' : 'nie',
  }
}
