export interface ResponseInterface {
  "name": string,
  "cluster": Array<Cluster>,
  "x_label": string,
  "y_label": string,
  "iterations": number,
  "distance_metric": string,
  "silhouette_score": number,
  "davies_bouldin_index": number,
}

interface Cluster {
  "clusterNr": number,
  "centroid": Centroid,
  "points": Array<Points>
}

export interface Points {
  "x": number,
  "y": number
}

interface Centroid {
  "x": number,
  "y": number
}
