import { Component } from '@angular/core'
import { type Router } from '@angular/router'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  constructor (private readonly router: Router) {
  }

  public navigateToHome () {
    this.router.navigate(['/home'])
  }
}
