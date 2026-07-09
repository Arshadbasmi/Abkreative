import { ElectronAPI } from '@electron-toolkit/preload'
import type { EesaBrainApi } from './index'

declare global {
  interface Window {
    electron: ElectronAPI
    api: EesaBrainApi
  }
}
