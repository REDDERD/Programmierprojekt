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

  constructor (private router: Router) {}

  public handleAPIResponse (response: ResponseInterface): void {
    this.kmeansResult = response
    console.log(this.kmeansResult)
  }

  public handleLoading (status: boolean): void {
    this.isLoading = status
  }

  public routeToLogin (): void {
    void this.router.navigate(['/login'])
  }
}
