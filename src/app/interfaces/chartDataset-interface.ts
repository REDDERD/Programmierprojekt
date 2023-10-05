import { Points } from './response-interface'

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
