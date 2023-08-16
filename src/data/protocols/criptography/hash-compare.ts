export interface IHashComparer {
  compare: (firstValue: string, secondValue: string) => Promise<boolean>
}
