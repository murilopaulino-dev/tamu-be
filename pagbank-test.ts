// const body = {
//   "reference_id": "ex-00001",
//   "customer": {
//     "name": "Jose da Silva",
//     "email": "email@test.com",
//     "tax_id": "12345678909",
//     "phones": [
//       {
//         "country": "55",
//         "area": "11",
//         "number": "999999999",
//         "type": "MOBILE"
//       }
//     ]
//   },
//   "items": [
//     {
//       "name": "nome do item",
//       "quantity": 1,
//       "unit_amount": 500
//     }
//   ],
//   "qr_codes": [
//     {
//       "amount": {
//         "value": 500
//       },
//       "expiration_date": "2025-08-29T20:15:59-03:00"
//     }
//   ],
//   "shipping": {
//     "address": {
//       "street": "Avenida Brigadeiro Faria Lima",
//       "number": "1384",
//       "complement": "apto 12",
//       "locality": "Pinheiros",
//       "city": "São Paulo",
//       "region_code": "SP",
//       "country": "BRA",
//       "postal_code": "01452002"
//     }
//   },
//   "notification_urls": [
//     "https://meusite.com/notificacoes"
//   ]
// };

// async function pagseguroFetch(
//   bearerToken: string,
//   clientId: string,
//   clientSecret: string,
//   { url = "https://sandbox.api.pagseguro.com/orders", timeoutMs = 10000 } = {}
// ) {
//   const controller = new AbortController();
//   const timeout = setTimeout(() => controller.abort(), timeoutMs);

//   try {
//     const res = await fetch(url, {
//       method: "POST",
//       headers: {
//         Authorization: `Bearer ${bearerToken}`,
//         Accept: "application/json",
//         "Content-Type": "application/json",
//         "x-client-id": clientId,
//         "x-client-secret": clientSecret,
//       },
//       body: JSON.stringify(body),
//       signal: controller.signal,
//     });

//     clearTimeout(timeout);

//     const text = await res.text();
//     let payload;
//     try {
//       payload = JSON.parse(text);
//     } catch {
//       payload = text;
//     }
//     console.log('text', text)

//     if (!res.ok) {
//       const err = new Error(
//         `PagSeguro request failed: ${res.status} ${res.statusText}`
//       ) as any;
//       err.response = payload;
//       throw err;
//     }

//     return payload;
//   } catch (err: any) {
//     console.log('error', JSON.stringify(err));
//   }
// }