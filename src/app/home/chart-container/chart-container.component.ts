import { Component, Input } from '@angular/core'
import { type ResponseInterface } from '../../interfaces/response-interface'

@Component({
  selector: 'app-chart-container',
  templateUrl: './chart-container.component.html',
  styleUrls: ['./chart-container.component.css']
})
export class ChartContainerComponent {
  @Input() KmeansResult: ResponseInterface | undefined
}
