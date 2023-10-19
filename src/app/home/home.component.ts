import { Component } from '@angular/core'
import { Router } from '@angular/router'
import { ResponseInterface } from '../interfaces/response-interface'

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  kmeansResult: ResponseInterface | undefined
  isLoading: boolean = false
  cancelCalculation: boolean = false
  localCalculation: boolean = false

  constructor (private router: Router) {}

  handleCancelCalculation (): void {
    this.cancelCalculation = true
    setTimeout(() => {
      this.cancelCalculation = false
    })
  }

  public handleAPIResponse (response: ResponseInterface): void {
    this.kmeansResult = response
  }

  public handleLoading (status: boolean): void {
    this.isLoading = status
  }
}
