import { Component } from '@angular/core';
import {Router} from "@angular/router";
import {ResponseInterface} from "../interfaces/response-interface";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  apiResponse: ResponseInterface | undefined;

  constructor(private router: Router) {}

  public handleAPIResponse(response: ResponseInterface) {
    this.apiResponse = response;
    console.log(this.apiResponse);
  }

  public routeToLogin(){
    this.router.navigate(['/login'])
  }
}
