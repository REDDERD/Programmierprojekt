import { Points } from './response-interface'

// Interface für die Datentypen, die ChartJS verarbeitet
export interface ChartDatasetInterface {
  'label': string
  'data': Points[]
}

export interface CentroidDatesetInterface {
  'label': string
  'data': Points[]
  'pointStyle': string
  'radius': number
}
