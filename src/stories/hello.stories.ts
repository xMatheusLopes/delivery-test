import type { Meta, StoryObj } from '@storybook/angular/';
import { HelloComponent } from '../app/hello/hello.component';
import { fn } from '@storybook/test';

const meta: Meta<HelloComponent> = {
  component: HelloComponent,
  args: {
    resetTitle: fn()
  }
};

export default meta;
type Story = StoryObj<HelloComponent>;

export const Primary: Story = {
  args: {
    title: 'hello from story works',
  },
};