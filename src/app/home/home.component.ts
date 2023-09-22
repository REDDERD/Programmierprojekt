import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {KmeansLocalService} from "./kmeans.local.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit{
  ngOnInit() {
    this.kmeans.test()
  }

  constructor(private router: Router, private kmeans:KmeansLocalService) {}

  public routeToLogin(){
    this.router.navigate(['/login'])
  }
}
