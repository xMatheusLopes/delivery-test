import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-hello',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './hello.component.html',
  styleUrl: './hello.component.scss'
})
export class HelloComponent {
  @Input() title = 'hello works!';

  public content: any;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.http.get('https://viacep.com.br/ws/01001000/json/').subscribe(res => {
      this.content = res;
    })
  }

  public resetTitle() {
    this.title = 'hello works';
  }


}
