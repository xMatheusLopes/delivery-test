import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { isDevMode } from '@angular/core';
import { environment } from './environments/environment';

async function prepareApp() {
  if (!environment.production) {
    const { worker } = await import('./mocks/browser')
    return worker.start({onUnhandledRequest: 'bypass'})
  }

  return Promise.resolve()
}

prepareApp().then(() => {
  bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
})


