import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {KMeansLocalService} from "./k-means-local.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit{

  csvData: string[][] = [];
  csvFilePath = 'C:\\Users\\Klaas\\Dateien\\Eigene Dateien\\Studium\\Semester 5\\3) Programmierprojekt\\Git\\src\\app\\home\\clust-mock-data\\circles.csv';


  ngOnInit() {
    console.log('CSV-lesen')
    //this.kmeans.test()
    this.kmeans.loadCsvData(this.csvFilePath).subscribe((data) => {this.csvData = data;});
    console.log(this.csvData)
  }

  constructor(private router: Router, private kmeans:KMeansLocalService) {}

  public routeToLogin(){
    this.router.navigate(['/login'])
  }
}

