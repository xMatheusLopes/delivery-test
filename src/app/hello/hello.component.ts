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
    this.getContent();
  }

  public resetTitle() {
    this.title = 'hello works';
  }

  public getContent() {
    this.callApi().subscribe(res => {
      this.content = res;
    })
  }

  public callApi() {
    return this.http.get('https://viacep.com.br/ws/01001000/json/');
  }
}
