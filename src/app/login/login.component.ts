import { Component } from '@angular/core'
import { Router } from '@angular/router'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  // eslint-disable-next-line
  constructor (private router: Router) {
  }

  public navigateToHome (): void {
    void this.router.navigate(['/home'])
  }
}
