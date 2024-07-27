import deliveries from './data/deliveries.json';

import { http, HttpResponse } from 'msw'
 
export const handlers = [
  http.get('/deliveries', () => {
    return HttpResponse.json(deliveries)
  }),
]