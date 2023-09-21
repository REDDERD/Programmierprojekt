import { Component } from '@angular/core';
import {FormControl, FormGroup} from "@angular/forms";

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

  submit() {
    console.log(JSON.stringify(this.clusterInputFormGroup.value));
  }

  onDragOver(event: any){
    event.preventDefault();
  }

  onDropSuccess(event: any) {
    event.preventDefault();

    this.onFileChange(event.dataTransfer.files);    // notice the "dataTransfer" used instead of "target"
  }

  onChange(event:any){
    this.onFileChange(event.target.files);
  }

  private onFileChange(files: File[]){
    console.log(files);
  }

/*
  protected readonly eval = eval;
  protected readonly event = event;
  protected readonly event = event;
  protected readonly console = console;

 */
}
