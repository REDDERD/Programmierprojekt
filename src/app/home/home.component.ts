import { Component } from '@angular/core'
import { ResponseInterface } from '../interfaces/response-interface'

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  kmeansResult: ResponseInterface | undefined
  isLoading: boolean = false

  // Weiterleitung des K-Means Ergebnis vom Backend oder der lokalen Berechnung aus der Input Komponente an die Chart Komponente
  public handleAPIResponse (response: ResponseInterface): void {
    this.kmeansResult = response
  }

  // Weiterleitung des Ladeindikator Boolean Wert an die Home Komponente
  public handleLoading (status: boolean): void {
    this.isLoading = status
  }
}
