export interface ResponseInterface {
  'user_id': number
  'request_id': number
  'name': string
  'cluster': Cluster[]
  'x_label': string
  'y_label': string
  'iterations': number
  'used_distance_metric': string
  'k_value': number
}

export interface Cluster {
  'clusterNr': number
  'centroid': Centroid
  'points': Points[]
}

export interface Points {
  'x': number
  'y': number
}

interface Centroid {
  'x': number
  'y': number
}
