export type CsvParseResult = {
  headers: string[]
  rows: Record<string, string>[]
}

function pushRow(records: string[][], row: string[], cell: string) {
  const nextRow = [...row, cell]
  if (nextRow.every(value => value.trim() === '')) {
    return
  }
  records.push(nextRow)
}

export function parseCsvText(source: string): CsvParseResult {
  const normalizedSource = source.replace(/^\uFEFF/, '').replace(/\r\n/g, '\n').replace(/\r/g, '\n')

  if (!normalizedSource.trim()) {
    return { headers: [], rows: [] }
  }

  const records: string[][] = []
  let row: string[] = []
  let cell = ''
  let inQuotes = false

  for (let index = 0; index < normalizedSource.length; index += 1) {
    const char = normalizedSource[index]

    if (inQuotes) {
      if (char === '"') {
        if (normalizedSource[index + 1] === '"') {
          cell += '"'
          index += 1
        } else {
          inQuotes = false
        }
      } else {
        cell += char
      }
      continue
    }

    if (char === '"') {
      inQuotes = true
      continue
    }

    if (char === ',') {
      row.push(cell)
      cell = ''
      continue
    }

    if (char === '\n') {
      pushRow(records, row, cell)
      row = []
      cell = ''
      continue
    }

    cell += char
  }

  if (inQuotes) {
    throw new Error('CSV contains an unclosed quoted field.')
  }

  pushRow(records, row, cell)

  if (records.length === 0) {
    return { headers: [], rows: [] }
  }

  const [headerRow, ...dataRows] = records
  const headers = headerRow.map(header => header.trim())
  const rows = dataRows.map(columns => {
    const mappedRow: Record<string, string> = {}
    headers.forEach((header, headerIndex) => {
      if (!header) return
      mappedRow[header] = columns[headerIndex] ?? ''
    })
    return mappedRow
  })

  return { headers, rows }
}