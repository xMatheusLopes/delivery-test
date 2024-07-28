import { DeliveryFilterConfiguration } from '@src/app/deliveries/types/DeliveryFilterConfiguration';
import deliveries from './data/deliveries.json';

import { http, HttpResponse } from 'msw'

const addParam = (param: string | null, objParams: any, key: string) => {
  if (param) objParams[key] = param;
  return objParams;
}

const hasParams = (params: {}) => {
  return Object.keys(params).length > 0;
}

const sliceArr = (items: Array<any>, page: number, pageSize: number) => {
  return items.slice(page, pageSize);
}

const resolvePath = (object: any, path: string, defaultValue: unknown) => {
  return path
    .split('.')
    .reduce((o: any, p: string) => o ? o[p] : defaultValue, object)
}

const filterBy = (items: Array<any>, key: string, value: unknown) => {
  return items.filter(item => resolvePath(item, key, {}).includes(value));
}
 
export const handlers = [
  http.get('/deliveries', ({ request }) => {
    const url = new URL(request.url);

    let params: DeliveryFilterConfiguration = {} as DeliveryFilterConfiguration;
    params = addParam(url.searchParams.get('name'), params, 'name');
    params = addParam(url.searchParams.get('status'), params, 'status');
    params = addParam(url.searchParams.get('page'), params, 'page');
    params = addParam(url.searchParams.get('pageSize'), params, 'pageSize');
    
    let deliveriesCopy = deliveries;
    let totalItems = deliveriesCopy.length;
    if (hasParams(params)) {
      if (params.name) {
        deliveriesCopy = filterBy(deliveriesCopy, 'motorista.nome', params.name);
      }

      if (params.status) {
        deliveriesCopy = filterBy(deliveriesCopy, 'status_entrega', params.status);
      }

      totalItems = deliveriesCopy.length;

      if (params.page && params.pageSize) {
        deliveriesCopy = sliceArr(deliveriesCopy, params.page, params.pageSize);
      }
    }
    
    return new HttpResponse(JSON.stringify(deliveriesCopy), { 
      headers: { 
        'Content-Type': 'application/json',
        'total-items': totalItems.toString() 
      } 
    });
  }),
]