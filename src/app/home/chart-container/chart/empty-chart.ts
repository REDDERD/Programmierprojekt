import { type ResponseInterface } from '../../../interfaces/response-interface'

export const EmptyChart: ResponseInterface = {
  user_id: 0,
  request_id: 0,
  name: 'Kein anzeigbares Clustering',
  cluster: [
  ],
  x_label: '',
  y_label: '',
  iterations: 4,
  used_distance_metric: 'EUCLIDEAN',
  k_value: 4
}
