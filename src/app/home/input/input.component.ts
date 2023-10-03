import { Component, EventEmitter, Output } from '@angular/core'
import { FormControl, FormGroup } from '@angular/forms'
import { MatSnackBar } from '@angular/material/snack-bar'
import { ApiService } from '../home-services/api.service'
import { ResponseInterface } from '../../interfaces/response-interface'
import { KmeansLocalService } from '../home-services/kmeans-local.service'

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.css']
})
export class InputComponent {
  clusterInputFormGroup = new FormGroup({
    clusterName: new FormControl(''),
    k: new FormControl(''),
    distanceMetric: new FormControl('EUCLIDEAN'),
    clusterDetermination: new FormControl('ELBOW'),
    offlineKmeans: new FormControl(false)
  })

  @Output() KmeansResult: EventEmitter<ResponseInterface> = new EventEmitter<ResponseInterface>()
  @Output() isLoading: EventEmitter<boolean> = new EventEmitter<boolean>()

  constructor (
    private snackbar: MatSnackBar,
    private apiService: ApiService,
    private localKmeans: KmeansLocalService
  ) {
  }

  public file?: File

  submit (): void {
    // console.log(this.clusterInputFormGroup.value)

    if (this.clusterInputFormGroup.value.offlineKmeans === true) {
      if ((this.file != null) && (this.clusterInputFormGroup.value.distanceMetric != null) && (this.clusterInputFormGroup.value.k != null)) {
        this.localKmeans.performKMeans(this.file, Number(this.clusterInputFormGroup.value.k), this.clusterInputFormGroup.value.distanceMetric)
          .then((result) => {
            this.KmeansResult.emit(result)
          }).catch((error) => {
            console.log(error)
          })
      }
    } else {
      if ((this.file != null) && (this.clusterInputFormGroup.value.distanceMetric != null) && (this.clusterInputFormGroup.value.clusterDetermination != null)) {
        this.isLoading.emit(true)
        this.apiService.postKmeans(
          this.file,
          undefined,
          undefined,
          Number(this.clusterInputFormGroup.value.k),
          this.clusterInputFormGroup.value.distanceMetric,
          this.clusterInputFormGroup.value.clusterDetermination
        ).subscribe((response: ResponseInterface) => {
          this.KmeansResult.emit(response)
          this.isLoading.emit(false)
        }, error => {
          this.isLoading.emit(false)
          this.snackbar.open('Ein Fehler ist aufgetreten. Meldung: ' + error.error.detail, 'Okay')
          console.log(error)
        })
      } else {
        this.snackbar.open('Bitte lade erst eine Datei hoch', 'Okay', { duration: 3000 })
      }
    }
  }

  onDragOver (event: any): void {
    event.preventDefault()
  }

  onDropSuccess (event: any): void {
    event.preventDefault()

    this.onFileChange(event.dataTransfer.files[0]) // notice the "dataTransfer" used instead of "target"
  }

  onChange (event: any): void {
    this.onFileChange(event.target.files[0])
  }

  private onFileChange (file: File): void {
    if (file.type === 'text/csv' || file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
      this.file = file
      this.snackbar.open('Datei ' + file.name + ' wird hochgeladen', 'Okay', { duration: 2000 })
    } else {
      this.snackbar.open('Falsches Dateiformat', 'Okay', { duration: 3000 })
    }
  }
}
