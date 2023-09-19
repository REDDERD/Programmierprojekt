import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatButtonModule} from "@angular/material/button";
import {MatSidenavModule} from "@angular/material/sidenav";
import {MatIconModule} from "@angular/material/icon";
import { HomeComponent } from './home/home.component';
import { InputComponent } from './home/input/input.component';
import { ChartContainerComponent } from './home/chart-container/chart-container.component';
import { ChartComponent } from './home/chart-container/chart/chart.component';
import { LoginComponent } from './login/login.component';
import { RouterModule, Routes } from '@angular/router'
import {MatInputModule} from "@angular/material/input";

const routes: Routes = [ { path: 'home', component: HomeComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },]
@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    InputComponent,
    ChartContainerComponent,
    ChartComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    RouterModule.forRoot(routes),
    MatInputModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
