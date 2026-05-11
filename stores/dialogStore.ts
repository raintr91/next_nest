import { defineStore } from 'pinia'
import { ref, reactive } from 'vue'

export type DialogType = 'info' | 'warning' | 'confirm' | 'error'

export interface DialogParams {
  title?: string
  text?: string
  type?: DialogType
  btnConfirmTitle?: string
  btnCancelTitle?: string
  hideBtn?: boolean
  hideBtnConfirm?: boolean
  hideBtnCancel?: boolean
  onConfirm?: () => void
}

export const useDialogStore = defineStore('global-dialog', () => {
  const { t } = useI18n()
  const visible = ref(false)
  const title = ref('')
  const text = ref('')
  const type = ref<DialogType>('info')
  const btnConfirmTitle = ref('OK')
  const btnCancelTitle = ref(t('common.cancel'))
  const hideBtn = ref(false)
  const hideBtnConfirm = ref(false)
  const hideBtnCancel = ref(false)
  const handlers = reactive<{ onConfirm?: () => void }>({})

  function show(params: DialogParams) {
    title.value = params.title ?? ''
    text.value = params.text ?? ''
    type.value = params.type ?? 'info'
    btnConfirmTitle.value = params.btnConfirmTitle ?? 'OK'
    btnCancelTitle.value = params.btnCancelTitle ?? t('common.cancel')
    hideBtn.value = params.hideBtn ?? false
    hideBtnConfirm.value = params.hideBtnConfirm ?? false
    hideBtnCancel.value = params.hideBtnCancel ?? false
    handlers.onConfirm = params.onConfirm
    visible.value = true
  }

  function hide() {
    visible.value = false
  }

  function confirm() {
    handlers.onConfirm?.()
    hide()
  }

  return {
    visible,
    title,
    text,
    type,
    btnConfirmTitle,
    btnCancelTitle,
    hideBtn,
    hideBtnConfirm,
    hideBtnCancel,
    show,
    hide,
    handlers,
    confirm
  }
})
