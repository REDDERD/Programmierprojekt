import { Injectable } from '@angular/core'
import { HttpClient, HttpParams } from '@angular/common/http'
import { Observable } from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  public postKmeans (
    csv: File,
    column1?: number,
    column2?: number,
    kCluster?: number,
    distanceMetric?: string,
    clusterDetermination?: string,
    nDimensional?: boolean
  ): Observable<any> {
    let Params: HttpParams = new HttpParams()
    let url = 'https://beta.axellotl.de/advanced/perform-advanced-2d-kmeans/'
    if (nDimensional === true) {
      if (kCluster !== 0) {
        url = 'https://beta.axellotl.de/basic/perform-nd-kmeans/'
      } else {
        url = 'https://beta.axellotl.de/advanced/perform-advanced-nd-kmeans/'
      }
    } else {
      if (kCluster !== 0) {
        url = 'https://beta.axellotl.de/basic/perform-2d-kmeans/'
      }
    }
    if (nDimensional === false) {
      if (column1 != null) {
        Params = Params.set('column1', column1)
      }
      if (column2 != null) {
        Params = Params.set('column2', column2)
      }
    }
    if ((kCluster != null) && kCluster > 0) {
      Params = Params.set('k_clusters', kCluster)
    }
    if (distanceMetric != null) {
      Params = Params.set('distanceMetric', distanceMetric)
    }
    if (clusterDetermination != null) {
      Params = Params.set('clusterDetermination', clusterDetermination)
    }

    const formData = new FormData()
    formData.append('file', new Blob([csv], { type: 'text/csv' }), csv.name)

    return this.http.post(
      url,
      formData,
      { params: Params }
    )
  }

  constructor (private http: HttpClient) { }
}
