import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartContainerComponent } from './chart-container.component';

describe('ChartComponent', () => {
  let component: ChartContainerComponent;
  let fixture: ComponentFixture<ChartContainerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ChartContainerComponent]
    });
    fixture = TestBed.createComponent(ChartContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
