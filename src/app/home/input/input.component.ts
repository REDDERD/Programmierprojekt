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

}
