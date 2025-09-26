import { http, HttpResponse } from 'msw';

// simple in-memory counters so tests can assert call counts
export const counters = {
  corpGet: 0,
  profilePost: 0,
};

export const validCorps = new Set([
  '826417395',
  '158739264',
  '123456789',
  '591863427',
  '312574689',
  '265398741',
  '762354918',
  '468721395',
  '624719583',
]);

export const handlers = [
  // corporation number validation
  http.get('*/corporation-number/:number', ({ params }) => {
    counters.corpGet++;
    const num = String(params.number);
    if (validCorps.has(num)) {
      return HttpResponse.json(
        { corporationNumber: num, valid: true },
        { status: 200 },
      );
    }
    return HttpResponse.json(
      { valid: false, message: 'Invalid corporation number' },
      { status: 400 },
    );
  }),

  // submit profile
  http.post('*/profile-details', async ({ request }) => {
    counters.profilePost++;
    const body = (await request.json()) as {
      firstName?: string;
      lastName?: string;
      phone?: string;
      corporationNumber?: string;
    };

    if (
      !body.firstName ||
      !body.lastName ||
      !body.phone ||
      !body.corporationNumber
    ) {
      return HttpResponse.json(
        { message: 'Missing required field' },
        { status: 400 },
      );
    }
    if (!/^\+1\d{10}$/.test(body.phone!)) {
      return HttpResponse.json(
        { message: 'Invalid phone number' },
        { status: 400 },
      );
    }
    if (!/^\d{9}$/.test(body.corporationNumber!)) {
      return HttpResponse.json(
        { message: 'Invalid corporation number' },
        { status: 400 },
      );
    }

    return HttpResponse.json('OK', { status: 200 });
  }),
];
