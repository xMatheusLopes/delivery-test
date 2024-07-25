import { applicationConfig, type Preview } from "@storybook/angular";
import { setCompodocJson } from "@storybook/addon-docs/angular";
import docJson from "../documentation.json";
import { initialize, mswLoader } from 'msw-storybook-addon';
import { provideHttpClient } from "@angular/common/http";
import { handlers } from "../src/mocks/handlers";
setCompodocJson(docJson);

initialize();

const decorators = [
  applicationConfig({
    providers: [provideHttpClient()]
  })
]

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    msw: {
      handlers: [handlers]
    }
  },
  loaders: [mswLoader],
  decorators
};

export default preview;
