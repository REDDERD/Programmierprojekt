import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import {HomeComponent} from "./home/home.component";
import {MatDrawerContainer, MatSidenavModule} from "@angular/material/sidenav";
import {ChartComponent} from "./home/chart-container/chart/chart.component";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {InputComponent} from "./home/input/input.component";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatIconModule} from "@angular/material/icon";

describe('AppComponent', () => {
  beforeEach(() => TestBed.configureTestingModule({
    declarations: [
      AppComponent,
      HomeComponent,
      MatDrawerContainer,
      ChartComponent,
      InputComponent],
    imports: [
      MatSidenavModule,
      BrowserAnimationsModule,
      MatFormFieldModule,
      MatIconModule
    ],
  }));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have as title 'Programmierprojekt'`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('Dave is n Wadenbeißer');
  });

  it('should render title', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.content span')?.textContent).toContain('Programmierprojekt app is running!');
  });
});
