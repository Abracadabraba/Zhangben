import * as XLSX from 'xlsx'
import { Capacitor } from '@capacitor/core'
import { Filesystem, Directory } from '@capacitor/filesystem'
import { Share } from '@capacitor/share'
import { getExpensesByProject } from './storage'

function formatDateTime(iso) {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  const pad = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`
}

function safeSheetName(name) {
  // Excel sheet names: max 31 chars, no \ / ? * [ ] :
  const cleaned = name.replace(/[\\/?*[\]:]/g, ' ').trim()
  return (cleaned || '项目').slice(0, 31)
}

/**
 * Build and download/share an .xlsx workbook for a single project.
 * Sheet 1 "明细": every expense row.
 * Sheet 2 "汇总": totals + breakdown by 用途.
 *
 * On the web this triggers a normal browser download.
 * Inside the Android app (Capacitor) it writes the file to the app's
 * cache folder and opens the native share sheet, since a WebView can't
 * trigger a browser-style download.
 */
export async function exportProjectToExcel(project) {
  const expenses = getExpensesByProject(project.id) // newest first
  const chronological = [...expenses].sort((a, b) => new Date(a.datetime) - new Date(b.datetime))

  // ---------- 明细 sheet ----------
  const detailRows = chronological.map((e, idx) => ({
    序号: idx + 1,
    时间: formatDateTime(e.datetime),
    用途: e.purpose,
    金额: Number(e.amount) || 0,
    备注: e.note || '',
  }))

  const total = chronological.reduce((sum, e) => sum + (Number(e.amount) || 0), 0)

  detailRows.push({ 序号: '', 时间: '', 用途: '总计', 金额: total, 备注: '' })

  const detailSheet = XLSX.utils.json_to_sheet(detailRows)
  detailSheet['!cols'] = [
    { wch: 6 },  // 序号
    { wch: 18 }, // 时间
    { wch: 20 }, // 用途
    { wch: 12 }, // 金额
    { wch: 30 }, // 备注
  ]

  // ---------- 汇总 sheet ----------
  const byPurpose = new Map()
  for (const e of chronological) {
    const key = e.purpose || '（未填写用途）'
    const prev = byPurpose.get(key) || { count: 0, amount: 0 }
    prev.count += 1
    prev.amount += Number(e.amount) || 0
    byPurpose.set(key, prev)
  }
  const purposeRows = [...byPurpose.entries()]
    .sort((a, b) => b[1].amount - a[1].amount)
    .map(([purpose, v]) => ({ 用途: purpose, 笔数: v.count, 金额合计: v.amount }))

  const firstDate = chronological[0] ? formatDateTime(chronological[0].datetime) : '-'
  const lastDate = chronological.length
    ? formatDateTime(chronological[chronological.length - 1].datetime)
    : '-'

  const summaryTop = [
    ['项目名称', project.name],
    ['项目备注', project.note || ''],
    ['导出时间', formatDateTime(new Date().toISOString())],
    ['记账笔数', chronological.length],
    ['支出总计', total],
    ['最早一笔', firstDate],
    ['最近一笔', lastDate],
    [],
    ['按用途汇总'],
  ]

  const summarySheet = XLSX.utils.aoa_to_sheet(summaryTop)
  XLSX.utils.sheet_add_json(summarySheet, purposeRows, {
    origin: -1, // append after existing rows
    skipHeader: false,
  })
  summarySheet['!cols'] = [{ wch: 20 }, { wch: 24 }, { wch: 14 }]

  // ---------- workbook ----------
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, summarySheet, safeSheetName('汇总'))
  XLSX.utils.book_append_sheet(wb, detailSheet, safeSheetName('明细'))

  const fileNameSafe = project.name.replace(/[\\/:*?"<>|]/g, '_')
  const dateStamp = new Date().toISOString().slice(0, 10)
  const fileName = `来钱_${fileNameSafe}_${dateStamp}.xlsx`

  if (Capacitor.isNativePlatform()) {
    const base64 = XLSX.write(wb, { bookType: 'xlsx', type: 'base64' })
    const written = await Filesystem.writeFile({
      path: fileName,
      data: base64,
      directory: Directory.Cache,
    })
    await Share.share({
      title: fileName,
      text: `${project.name} 账目导出`,
      url: written.uri,
      dialogTitle: '保存或分享 Excel 文件',
    })
  } else {
    XLSX.writeFile(wb, fileName)
  }
}
