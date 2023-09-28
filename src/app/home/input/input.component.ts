import { Component } from '@angular/core';
import {FormControl, FormGroup} from "@angular/forms";
import {HttpClient} from "@angular/common/http";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.css']
})
export class InputComponent {
  clusterInputFormGroup = new FormGroup({
    clusterName: new FormControl(''),
    k: new FormControl(''),
  });

  constructor(private http: HttpClient, private snackbar: MatSnackBar) { //http wird später für die API Anbindung benutzt
  }

  public file?: File;

  submit() {
    console.log(JSON.stringify(this.clusterInputFormGroup.value));
  }

  onDragOver(event: any){
    event.preventDefault();
  }

  onDropSuccess(event: any) {
    event.preventDefault();

    this.onFileChange(event.dataTransfer.files[0]);    // notice the "dataTransfer" used instead of "target"
  }

  onChange(event:any){

    this.onFileChange(event.target.files[0]);
  }

  private onFileChange(file: File){

    if(file.type == 'text/csv' || file.type =='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'){
      this.file = file;
      this.snackbar.open('Ich lade die Datei '+file.name+' hoch wenn die API Jungs soweit sind','Okay');
    }
    else {
      this.snackbar.open('Falsches Dateiformat','Okay');
    }

  }
}
