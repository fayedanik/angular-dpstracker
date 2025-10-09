import { bootstrapApplication } from '@angular/platform-browser';
import { App } from './app/app';
import { appConfig } from './app/app.config';

bootstrapApplication(App, appConfig)
  .then(() => {
    removeLoader();
  })
  .catch((err) => console.error(err));

function removeLoader() {
  if (typeof document == undefined) {
    return;
  }
  const loader = document.querySelector('.loader-container') as HTMLElement;
  if (loader) {
    setTimeout(() => {
      loader.style.opacity = '0';
      loader.remove();
    }, 300);
  }
}
