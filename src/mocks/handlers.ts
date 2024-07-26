import { http, HttpResponse } from 'msw'
import deliveries from './data/deliveries.json';
 
export const handlers = [
  http.get('/deliveries', () => {
    return HttpResponse.json(deliveries)
  }),
]