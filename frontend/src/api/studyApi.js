import { requestJson } from './httpClient'

export function trackStudyRow(tableName, rowData) {
  return requestJson('/api/study/events', {
    method: 'POST',
    body: JSON.stringify({ tableName, rowData }),
  })
}
