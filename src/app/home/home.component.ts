import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit{

  csvData: string[][] = [];
  csvFilePath = 'C:\\Users\\Klaas\\Dateien\\Eigene Dateien\\Studium\\Semester 5\\3) Programmierprojekt\\Git\\src\\app\\home\\clust-mock-data\\circles.csv';


  ngOnInit() {
    //console.log('CSV-lesen')
    //this.kmeans.test()
    //console.log(this.csvData)
  }

  constructor(private router: Router) {}

  public routeToLogin(){
    this.router.navigate(['/login'])
  }
}

