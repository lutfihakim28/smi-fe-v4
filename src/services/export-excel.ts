import * as XLSX from 'xlsx-js-style'
import type { ExportPayrollOptions, Payroll } from '../types'

const HEADERS = [
  'Instructor',
  'Employment',
  'Grade',
  'Eligible meetings',
  'Rate per meeting',
  'Subtotal',
]

const CURRENCY_FORMAT = '#.##0'

const thinBorder = {
  top: { style: 'thin', color: { rgb: 'D1D5DB' } },
  bottom: { style: 'thin', color: { rgb: 'D1D5DB' } },
  left: { style: 'thin', color: { rgb: 'D1D5DB' } },
  right: { style: 'thin', color: { rgb: 'D1D5DB' } },
}

const headerStyle = {
  font: { name: 'Calibri', sz: 12, bold: true, color: { rgb: 'FFFFFF' } },
  fill: { patternType: 'solid', fgColor: { rgb: '1F2937' } },
  alignment: { horizontal: 'center', vertical: 'center', wrapText: true },
  border: thinBorder,
}

const dataStyle = {
  font: { name: 'Calibri', sz: 11, color: { rgb: '111827' } },
  alignment: { vertical: 'center' },
  border: thinBorder,
}

export function exportPayrollToExcel(
  rows: Payroll[],
  { fileName = 'payroll.xlsx', rates = {} }: ExportPayrollOptions = {},
) {
  const ws = XLSX.utils.aoa_to_sheet([HEADERS])

  HEADERS.forEach((_, c) => {
    const addr = XLSX.utils.encode_cell({ r: 0, c })
    ws[addr].s = headerStyle
  })

  rows.forEach((row, i) => {
    const r = i + 2

    ws[`A${r}`] = {
      t: 's',
      v: row.instructor ?? '—',
      s: { ...dataStyle, alignment: { ...dataStyle.alignment, horizontal: 'left' } },
    }
    ws[`B${r}`] = {
      t: 's',
      v: row.employmentLabel ?? row.employmentStatus ?? '—',
      s: { ...dataStyle, alignment: { ...dataStyle.alignment, horizontal: 'center' } },
    }
    ws[`C${r}`] = {
      t: 's',
      v: row.grade != null ? `Grade ${row.grade}` : '—',
      s: { ...dataStyle, alignment: { ...dataStyle.alignment, horizontal: 'center' } },
    }
    ws[`D${r}`] = {
      t: 'n',
      v: row.eligibleCount,
      s: { ...dataStyle, alignment: { ...dataStyle.alignment, horizontal: 'center' } },
    }

    const rate = rates[row.instructorId]
    ws[`E${r}`] = {
      t: rate != null ? 'n' : 's',
      v: rate ?? '',
      z: CURRENCY_FORMAT,
      s: {
        ...dataStyle,
        fill: { patternType: 'solid', fgColor: { rgb: 'FEF9C3' } },
        alignment: { ...dataStyle.alignment, horizontal: 'right' },
      },
    }

    ws[`F${r}`] = {
      t: 'n',
      f: `IF(E${r}="","—",D${r}*E${r})`,
      z: CURRENCY_FORMAT,
      s: {
        ...dataStyle,
        font: { ...dataStyle.font, bold: true },
        alignment: { ...dataStyle.alignment, horizontal: 'right' },
      },
    }
  })

  ws['!ref'] = XLSX.utils.encode_range({
    s: { r: 0, c: 0 },
    e: { r: rows.length, c: HEADERS.length - 1 },
  })

  ws['!cols'] = [
    { wch: 28 }, { wch: 16 }, { wch: 10 },
    { wch: 18 }, { wch: 18 }, { wch: 18 },
  ]
  ws['!rows'] = [{ hpt: 24 }]

  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'Payroll')
  XLSX.writeFile(wb, fileName)
}
