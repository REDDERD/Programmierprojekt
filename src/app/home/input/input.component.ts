import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core'
import { FormControl, FormGroup, ValidatorFn, AbstractControl } from '@angular/forms'
import { MatSnackBar } from '@angular/material/snack-bar'
import { ApiService } from '../home-services/api.service'
import { ResponseInterface } from '../../interfaces/response-interface'
import { KmeansLocalService } from '../home-services/kmeans-local.service'
import { DataTo2dArrayService } from '../home-services/data-to-2d-array.service'
import { Subscription } from 'rxjs'

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.css']
})
export class InputComponent implements OnChanges {
  clusterInputFormGroup = new FormGroup({
    k: new FormControl(''),
    distanceMetric: new FormControl('EUCLIDEAN'),
    clusterDetermination: new FormControl('SILHOUETTE'),
    offlineKmeans: new FormControl(false),
    selectedColumns: new FormControl<string[]>([], [this.twoColumnsSelectedValidator()])
  })

  @Output() kmeansResult: EventEmitter<ResponseInterface> = new EventEmitter<ResponseInterface>()
  @Output() isLoading: EventEmitter<boolean> = new EventEmitter<boolean>()
  @Output() localCalculation: EventEmitter<boolean> = new EventEmitter<boolean>()
  @Input() triggerCancelCalculation: boolean = false
  activeSubscription: Subscription | undefined
  public file?: File
  public columnNames: string[] = []

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

  // Listens for triggerCancelCalculation to stop waiting for Backend
  ngOnChanges (changes: SimpleChanges): void {
    for (const propName in changes) {
      // eslint-disable-next-line no-prototype-builtins
      if (changes.hasOwnProperty(propName)) {
        switch (propName) {
          case 'triggerCancelCalculation': {
            if (this.activeSubscription !== undefined) {
              this.activeSubscription.unsubscribe()
            }
            this.isLoading.emit(false)
          }
        }
      }
    }
  }

  submit (): void {
    if (this.clusterInputFormGroup.value.offlineKmeans === true) {
      this.localCalculation.emit(true)
      this.isLoading.emit(true)
      setTimeout(() => {
        if ((this.file != null) && (this.clusterInputFormGroup.value.distanceMetric != null)) {
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
      }, 500)
    } else {
      this.localCalculation.emit(false)
      if ((this.file != null) && (this.clusterInputFormGroup.value.distanceMetric != null)) {
        if (this.clusterInputFormGroup.value.clusterDetermination == null) {
          this.clusterInputFormGroup.value.clusterDetermination = undefined
        }
        const distanceMetric: string = this.clusterInputFormGroup.value.distanceMetric
        const clusterDetermination = this.clusterInputFormGroup.value.clusterDetermination
        this.isLoading.emit(true)
        this.filterFileColumns().then(filteredFile => {
          this.activeSubscription = this.apiService.postKmeans(
            filteredFile,
            undefined,
            undefined,
            Number(this.clusterInputFormGroup.value.k),
            distanceMetric,
            clusterDetermination,
            this.selectedColumnsIndices.length >= 3
          ).subscribe((response: ResponseInterface) => {
            this.kmeansResult.emit(response)
            this.isLoading.emit(false)
          }, error => {
            this.isLoading.emit(false)
            this.snackbar.open('Ein Fehler ist aufgetreten. Meldung: ' + error.error.detail, 'Okay')
            console.log(error)
          })
        })
          .catch(error => {
            this.snackbar.open('Ein Fehler ist aufgetreten. Meldung: ' + error, 'Okay')
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
        if (data !== null && data !== undefined && data.length > 1) {
          this.columnNames = data[0]
          // Setzen Sie die ersten beiden Spalten als standardmäßig ausgewählt
          this.clusterInputFormGroup.get('selectedColumns')?.setValue([this.columnNames[0], this.columnNames[1]])
        }
      }).catch(error => {
        this.snackbar.open(error.message, 'Okay', { duration: 3000 })
        this.file = undefined
        console.error(error)
      })
    } else {
      this.snackbar.open('Falsches Dateiformat', 'Okay', { duration: 3000 })
    }
  }

  twoColumnsSelectedValidator (): ValidatorFn {
    return (control: AbstractControl): Record<string, any> | null => {
      const selected = control.value
      if (selected !== null && selected !== undefined && selected.length >= 2) {
        return null // Kein Fehler
      } else {
        return { twoColumnsRequired: true } // Fehler
      }
    }
  }

  get selectedColumnsValue (): string[] {
    return this.clusterInputFormGroup.get('selectedColumns')?.value ?? []
  }

  get selectedColumnsIndices (): number[] {
    return this.selectedColumnsValue.map(name => this.columnNames.indexOf(name))
  }

  isFileUploaded (): boolean {
    return this.file !== null && this.file !== undefined
  }

  hasKValue (): boolean {
    const kValue = this.clusterInputFormGroup.get('k')?.value
    return kValue !== ''
  }

  updateClusterDetermination (): void {
    const kValue = this.clusterInputFormGroup.get('k')?.value
    if (kValue !== null && kValue !== undefined && kValue.toString().trim() !== '') {
      this.clusterInputFormGroup.get('clusterDetermination')?.setValue(null)
    } else {
      const isOffline = this.clusterInputFormGroup.get('offlineKmeans')?.value
      if (isOffline === true) {
        this.clusterInputFormGroup.get('clusterDetermination')?.setValue('ELBOW')
      } else {
        this.clusterInputFormGroup.get('clusterDetermination')?.setValue('SILHOUETTE')
      }
    }
  }

  async filterFileColumns (): Promise<File> {
    if (this.file === null || this.file === undefined) {
      throw new Error('File is not set.')
    }
    const data = await this.dataTo2DArrayService.dataTo2DArray(this.file)
    const filteredData = data.map(row => {
      return this.selectedColumnsIndices.map(index => row[index])
    })
    const filteredContent = filteredData.map(row => row.join(',')).join('\n')
    const blob = new Blob([filteredContent], { type: 'text/csv' })
    return new File([blob], this.file.name, { type: 'text/csv' })
  }
}
