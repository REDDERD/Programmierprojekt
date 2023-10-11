// Interface für die Antwort vom Backend
export interface ResponseInterface {
  'user_id': number
  'request_id': number
  'name': string
  'cluster': Cluster[]
  'x_label': string
  'y_label': string
  'iterations': number
  'used_distance_metric': string
  'used_optK_method': string
  'clusters_elbow': number
  'clusters_silhouette': number
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
