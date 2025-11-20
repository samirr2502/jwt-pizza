import { sleep, check, group, fail } from 'k6'
import http from 'k6/http'
import jsonpath from 'https://jslib.k6.io/jsonpath/1.0.2/index.js'

export const options = {
  cloud: {
    distribution: { 'amazon:us:ashburn': { loadZone: 'amazon:us:ashburn', percent: 100 } },
    apm: [],
  },
  thresholds: {},
  scenarios: {
    Scenario_1: {
      executor: 'ramping-vus',
      gracefulStop: '30s',
      stages: [
        { target: 20, duration: '1m' },
        { target: 20, duration: '3m30s' },
        { target: 0, duration: '1m' },
      ],
      gracefulRampDown: '30s',
      exec: 'scenario_1',
    },
  },
}

export function scenario_1() {
  let response

  const vars = {}

  group('page_1 - https://pizza.samirrodriguez.click/', function () {
    response = http.put(
      'https://pizza-service.samirrodriguez.click/api/auth',
      '{"email":"d@jwt.com","password":"diner"}',
      {
        headers: {
          accept: '*/*',
          'accept-encoding': 'gzip, deflate, br, zstd',
          'accept-language': 'en-US,en;q=0.9,es;q=0.8',
          'content-type': 'application/json',
          origin: 'https://pizza.samirrodriguez.click',
          priority: 'u=1, i',
          'sec-ch-ua': '"Chromium";v="142", "Google Chrome";v="142", "Not_A Brand";v="99"',
          'sec-ch-ua-mobile': '?0',
          'sec-ch-ua-platform': '"macOS"',
          'sec-fetch-dest': 'empty',
          'sec-fetch-mode': 'cors',
          'sec-fetch-site': 'same-site',
        },
      }
    )
    check(response, { 'status equals 200': response => response.status.toString() === '200' })
    if (!check(response, { 'status equals 200': response => response.status.toString() === '200' })) {
      console.log(response.body);
      fail('Login was *not* 200');
    }
    vars['token'] = jsonpath.query(response.json(), '$.token')[0]

    sleep(6.4)

    response = http.get('https://pizza-service.samirrodriguez.click/api/order/menu', {
      headers: {
        accept: '*/*',
        'accept-encoding': 'gzip, deflate, br, zstd',
        'accept-language': 'en-US,en;q=0.9,es;q=0.8',
        authorization: `Bearer ${vars['token']}`,
        'content-type': 'application/json',
        'if-none-match': 'W/"3f8-Ie5TQl703DstdLfLArR1NiNP++U"',
        origin: 'https://pizza.samirrodriguez.click',
        priority: 'u=1, i',
        'sec-ch-ua': '"Chromium";v="142", "Google Chrome";v="142", "Not_A Brand";v="99"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"macOS"',
        'sec-fetch-dest': 'empty',
        'sec-fetch-mode': 'cors',
        'sec-fetch-site': 'same-site',
      },
    })
    sleep(0.6)

    response = http.get(
      'https://pizza-service.samirrodriguez.click/api/franchise?page=0&limit=20&name=*',
      {
        headers: {
          accept: '*/*',
          'accept-encoding': 'gzip, deflate, br, zstd',
          'accept-language': 'en-US,en;q=0.9,es;q=0.8',
          authorization: `Bearer ${vars['token']}`,
          'content-type': 'application/json',
          'if-none-match': 'W/"b4-tQ1v8aflowOYLpQ8545cloWyzDg"',
          origin: 'https://pizza.samirrodriguez.click',
          priority: 'u=1, i',
          'sec-ch-ua': '"Chromium";v="142", "Google Chrome";v="142", "Not_A Brand";v="99"',
          'sec-ch-ua-mobile': '?0',
          'sec-ch-ua-platform': '"macOS"',
          'sec-fetch-dest': 'empty',
          'sec-fetch-mode': 'cors',
          'sec-fetch-site': 'same-site',
        },
      }
    )
    sleep(5.8)

    response = http.get('https://pizza-service.samirrodriguez.click/api/user/me', {
      headers: {
        accept: '*/*',
        'accept-encoding': 'gzip, deflate, br, zstd',
        'accept-language': 'en-US,en;q=0.9,es;q=0.8',
        authorization: `Bearer ${vars['token']}`,
        'content-type': 'application/json',
        'if-none-match': 'W/"57-D8GODpIEr7njFIIw+3NdQxZDSDg"',
        origin: 'https://pizza.samirrodriguez.click',
        priority: 'u=1, i',
        'sec-ch-ua': '"Chromium";v="142", "Google Chrome";v="142", "Not_A Brand";v="99"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"macOS"',
        'sec-fetch-dest': 'empty',
        'sec-fetch-mode': 'cors',
        'sec-fetch-site': 'same-site',
      },
    })
    sleep(1.6)

    response = http.post(
      'https://pizza-service.samirrodriguez.click/api/order',
      '{"items":[{"menuId":1,"description":"Veggie","price":0.0038},{"menuId":1,"description":"Veggie","price":0.0038}],"storeId":"3","franchiseId":2}',
      {
        headers: {
          accept: '*/*',
          'accept-encoding': 'gzip, deflate, br, zstd',
          'accept-language': 'en-US,en;q=0.9,es;q=0.8',
          authorization: `Bearer ${vars['token']}`,
          'content-type': 'application/json',
          origin: 'https://pizza.samirrodriguez.click',
          priority: 'u=1, i',
          'sec-ch-ua': '"Chromium";v="142", "Google Chrome";v="142", "Not_A Brand";v="99"',
          'sec-ch-ua-mobile': '?0',
          'sec-ch-ua-platform': '"macOS"',
          'sec-fetch-dest': 'empty',
          'sec-fetch-mode': 'cors',
          'sec-fetch-site': 'same-site',
        },
      }
    )
    check(response, { 'status equals 200': (response) => response.status.toString() === '200' });

    vars["jwt"] = response.json().token;
    sleep(1.8)

    response = http.post(
      'https://pizza-factory.cs329.click/api/order/verify',
      `{"jwt":"${vars["jwt"]}"}`,
      {
        headers: {
          accept: '*/*',
          'accept-encoding': 'gzip, deflate, br, zstd',
          'accept-language': 'en-US,en;q=0.9,es;q=0.8',
          authorization: `Bearer ${vars['token']}`,
          'content-type': 'application/json',
          origin: 'https://pizza.samirrodriguez.click',
          priority: 'u=1, i',
          'sec-ch-ua': '"Chromium";v="142", "Google Chrome";v="142", "Not_A Brand";v="99"',
          'sec-ch-ua-mobile': '?0',
          'sec-ch-ua-platform': '"macOS"',
          'sec-fetch-dest': 'empty',
          'sec-fetch-mode': 'cors',
          'sec-fetch-site': 'cross-site',
          'sec-fetch-storage-access': 'active',
        },
      }
    )
  })
}