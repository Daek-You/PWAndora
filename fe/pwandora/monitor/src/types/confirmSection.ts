export interface IConfirmSectionCommonProps {
  confirm: () => void
  status: 'done' | 'need confirm' | 'warning'
}
