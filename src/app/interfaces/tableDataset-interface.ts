export interface TableDatasetInterface {
  name: string
  x: number
  y: number
  children?: TableDatasetInterface[]
}

export interface FlatTableDataset {
  expandable: boolean
  name: string
  x: number
  y: number
  level: number
}
