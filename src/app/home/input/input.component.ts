import { Component, EventEmitter, Output } from '@angular/core'
import { FormControl, FormGroup, ValidatorFn, AbstractControl } from '@angular/forms'
import { MatSnackBar } from '@angular/material/snack-bar'
import { ApiService } from '../home-services/api.service'
import { ResponseInterface } from '../../interfaces/response-interface'
import { KmeansLocalService } from '../home-services/kmeans-local.service'
import { DataTo2dArrayService } from '../home-services/data-to-2d-array.service'

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.css']
})
export class InputComponent {
  clusterInputFormGroup = new FormGroup({
    k: new FormControl(''),
    distanceMetric: new FormControl('EUCLIDEAN'),
    clusterDetermination: new FormControl('SILHOUETTE'),
    offlineKmeans: new FormControl(false),
    selectedColumns: new FormControl<number[]>([], [this.twoColumnsSelectedValidator()])
  })

  @Output() kmeansResult: EventEmitter<ResponseInterface> = new EventEmitter<ResponseInterface>()
  @Output() isLoading: EventEmitter<boolean> = new EventEmitter<boolean>()

  constructor (
    private snackbar: MatSnackBar,
    private apiService: ApiService,
    private localKmeans: KmeansLocalService,
    private dataTo2DArrayService: DataTo2dArrayService
  ) {
    // Höre auf Änderungen im 'k' Feld
    this.clusterInputFormGroup.get('k')?.valueChanges.subscribe(() => {
      this.updateClusterDetermination()
    })
  }

  public file?: File
  public columnNames: string[] = []

  submit (): void {
    if (this.clusterInputFormGroup.value.offlineKmeans === true) {
      if ((this.file != null) && (this.clusterInputFormGroup.value.distanceMetric != null)) {
        this.isLoading.emit(true)
        this.localKmeans.performKMeans(
          this.file,
          Number(this.clusterInputFormGroup.value.k) !== 0 ? Number(this.clusterInputFormGroup.value.k) : 0,
          Number(this.clusterInputFormGroup.value.k) === 0,
          this.clusterInputFormGroup.value.distanceMetric,
          this.selectedColumnsIndices)
          .then((result) => {
            this.kmeansResult.emit(result)
            this.isLoading.emit(false)
          }).catch((error) => {
            this.isLoading.emit(false)
            this.snackbar.open('Ein Fehler ist aufgetreten: ' + error.message, 'Okay')
            console.log(error)
          })
      }
    } else {
      if ((this.file != null) && (this.clusterInputFormGroup.value.distanceMetric != null) && (this.clusterInputFormGroup.value.clusterDetermination != null)) {
        this.isLoading.emit(true)
        this.apiService.postKmeans(
          this.file,
          this.selectedColumnsIndices[0],
          this.selectedColumnsIndices[1],
          Number(this.clusterInputFormGroup.value.k),
          this.clusterInputFormGroup.value.distanceMetric,
          this.clusterInputFormGroup.value.clusterDetermination
        ).subscribe((response: ResponseInterface) => {
          this.kmeansResult.emit(response)
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
    const fileExtension = file.name.split('.').pop()?.toLowerCase()
    if (fileExtension === 'csv' || fileExtension === 'xlsx') {
      this.file = file
      this.snackbar.open('Datei ' + file.name + ' wird hochgeladen', 'Okay', { duration: 2000 })

      this.dataTo2DArrayService.dataTo2DArray(file).then(data => {
        // Spaltennamen (Header) extrahieren
        if (data !== null && data !== undefined && data.length > 0) {
          this.columnNames = data[0]
        }
        this.clusterInputFormGroup.get('selectedColumns')?.setValue([])
      }).catch(error => {
        this.snackbar.open('Fehler beim Lesen der Datei', 'Okay', { duration: 3000 })
        console.error(error)
      })
    } else {
      this.snackbar.open('Falsches Dateiformat', 'Okay', { duration: 3000 })
    }
  }

  twoColumnsSelectedValidator (): ValidatorFn {
    return (control: AbstractControl): Record<string, any> | null => {
      const selected = control.value
      if (selected !== null && selected !== undefined && selected.length === 2) {
        return null // Kein Fehler
      } else {
        return { twoColumnsRequired: true } // Fehler
      }
    }
  }

  get selectedColumnsValue (): string[] {
    const value = this.clusterInputFormGroup.get('selectedColumns')?.value
    if (value === null || value === undefined || value.length === 0) {
      if (Array.isArray(this.columnNames) && this.columnNames.length > 1) {
        return [this.columnNames[0], this.columnNames[1]]
      }
      return []
    }
    return value.map((val: number) => val.toString())
  }

  set selectedColumnsValue (value: number[] | null) {
    this.clusterInputFormGroup.get('selectedColumns')?.setValue(value)
  }

  get selectedColumnsIndices (): number[] {
    return this.selectedColumnsValue.map(name => this.columnNames.indexOf(name))
  }

  hasKValue (): boolean {
    const kValue = this.clusterInputFormGroup.get('k')?.value
    return kValue !== ''
  }

  updateClusterDetermination (): void {
    const kValue = this.clusterInputFormGroup.get('k')?.value
    if (kValue !== null && kValue !== undefined && kValue.toString().trim() !== '') {
      this.clusterInputFormGroup.value.clusterDetermination = undefined
    } else {
      const isOffline = this.clusterInputFormGroup.get('offlineKmeans')?.value
      if (isOffline === true) {
        this.clusterInputFormGroup.get('clusterDetermination')?.setValue('ELBOW')
      } else {
        this.clusterInputFormGroup.get('clusterDetermination')?.setValue('SILHOUETTE')
      }
    }
  }
}
