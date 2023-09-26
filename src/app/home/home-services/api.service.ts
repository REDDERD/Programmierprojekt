import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  public postKmeans(
      csv: File,
      column1?: number,
      column2?: number,
      kCluster?: number,
      distanceMetric?: string,
      clusterDetermination?: string,
  ): Observable<any> {

    let Params: HttpParams = new HttpParams()

    if (column1 && column1 != -1) {
      Params = Params.set('column1', column1);
    }
    if (column2 && column2 != -1) {
      Params = Params.set('column2', column2);
    }
    if (kCluster) {
      Params = Params.set('kCluster', kCluster);
    }
    if (distanceMetric) {
      Params = Params.set('distanceMetric', distanceMetric);
    }
    if (clusterDetermination) {
      Params = Params.set('clusterDetermination', clusterDetermination);
    }

    const formData = new FormData()
    formData.append( 'file', new Blob([csv], { type: 'text/csv' }), csv.name);
    
    return this.http.post(
        'https://beta.axellotl.de/clustering/perform-kmeans-clustering/',
        formData,
        {params: Params}
    )
  }

  constructor(private http: HttpClient) { }
}
