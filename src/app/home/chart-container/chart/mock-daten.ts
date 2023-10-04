import { type ResponseInterface } from '../../../interfaces/response-interface'

export const MockDaten: ResponseInterface = {
  user_id: 0,
  request_id: 0,
  name: 'Kein anzeigbares Clustering',
  cluster: [
  ],
  x_label: '',
  y_label: '',
  iterations: 4,
  used_distance_metric: 'EUCLIDEAN',
  used_optK_method: 'ELBOW',
  clusters_elbow: 21,
  clusters_silhouette: 2
}
