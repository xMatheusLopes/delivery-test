import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HelloComponent } from './hello.component';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

describe('HelloComponent', () => {
  let component: HelloComponent;
  let fixture: ComponentFixture<HelloComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HelloComponent],
      providers: [provideHttpClient(), provideHttpClientTesting()]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HelloComponent);
    component = fixture.componentInstance;
    // fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get content', () => {
    const httpTesting = TestBed.inject(HttpTestingController);

    let expectedResponse = {
      id: 'c7b3d8e0-5e0b-4b0f-8b3a-3b9f4b3d3b3d',
      firstName: 'John',
      lastName: 'Maverick',
    };

    component.getContent();

    const req = httpTesting.expectOne('https://viacep.com.br/ws/01001000/json/', 'Request to load the configuration')
    expect(req.request.method).toBe('GET');
    req.flush(expectedResponse);

    expect(component.content).toEqual(expectedResponse);

    httpTesting.verify();
  })
});
