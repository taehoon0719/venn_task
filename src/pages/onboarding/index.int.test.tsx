import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { notification } from 'antd';
import { http, HttpResponse } from 'msw';

import { counters } from '@/test/handlers';
import { renderWithRouter } from '@/test/render';
import { server } from '@/test/server';

import OnboardingPage from './index';

describe('OnboardingPage integration', () => {
  let errorSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    counters.corpGet = 0;
    counters.profilePost = 0;
    errorSpy = vi.spyOn(notification, 'error');
  });

  afterEach(() => {
    errorSpy.mockRestore();
  });

  it('formats phone as +1 416 555 1234 while typing', async () => {
    const user = userEvent.setup();
    renderWithRouter(<OnboardingPage />);

    const phone = screen.getByLabelText('phone') as HTMLInputElement;
    expect(phone.value).toBe('+1 ');

    await user.type(phone, '4165551234');
    expect(phone.value).toBe('+1 416 555 1234');
  });

  it('format names to letters only', async () => {
    const user = userEvent.setup();
    renderWithRouter(<OnboardingPage />);

    const first = screen.getByLabelText('firstName') as HTMLInputElement;
    const last = screen.getByLabelText('lastName') as HTMLInputElement;

    await user.type(first, 'John123!!');
    await user.type(last, 'Doe123@@');
    expect(first.value).toBe('John');
    expect(last.value).toBe('Doe');
  });

  it('validates corporation number on blur and dedupes blur+submit (single GET corporation)', async () => {
    const user = userEvent.setup();
    renderWithRouter(<OnboardingPage />);

    const first = screen.getByLabelText('firstName');
    const last = screen.getByLabelText('lastName');
    const phone = screen.getByLabelText('phone');
    const corp = screen.getByLabelText('corpNumber');

    await user.type(first, 'Alice');
    await user.type(last, 'Smith');
    await user.type(phone, '4165551234'); // formatter adds +1
    await user.type(corp, '624719583');

    await user.click(corp);
    // trigger blur validation
    await user.tab();

    await waitFor(() => {
      expect(counters.corpGet).toBe(1);
    });

    const submit = screen.getByRole('button', { name: 'actions.submit' });
    await user.click(corp);
    //Submit right away without blurring
    await user.click(submit);

    // Still only one GET call for corp (deduped)
    expect(counters.corpGet).toBe(1);

    // One POST call
    await waitFor(() => expect(counters.profilePost).toBe(1));
  });

  it('shows backend error for invalid corporation number on blur', async () => {
    const user = userEvent.setup();
    renderWithRouter(<OnboardingPage />);

    const corp = screen.getByLabelText('corpNumber');

    await user.clear(corp);
    await user.type(corp, '000000000');
    await user.click(corp);
    await user.tab(); // blur

    // Backend returns { valid:false, message:'Invalid corporation number' }
    await screen.findByText(/Invalid corporation number/i);
  });

  it('shows failure notification when backend rejects on submit (phone 1231231234)', async () => {
    // Fail only when phone is 1231231234 - testing purpose
    server.use(
      http.post('*/profile-details', async ({ request }) => {
        const body = (await request.json()) as { phone?: string };
        const digits = (body?.phone ?? '').replace(/\D/g, '');
        if (digits.endsWith('1231231234')) {
          return HttpResponse.json(
            { message: 'Invalid phone number' },
            { status: 400 },
          );
        }
        return undefined;
      }),
    );

    const errorSpy = vi.spyOn(notification, 'error');

    renderWithRouter(<OnboardingPage />);

    await userEvent.type(screen.getByLabelText('firstName'), 'Jane');
    await userEvent.type(screen.getByLabelText('lastName'), 'Doe');
    await userEvent.type(screen.getByLabelText('phone'), '1231231234');
    await userEvent.type(screen.getByLabelText('corpNumber'), '624719583');

    await userEvent.tab();
    await waitFor(() => expect(counters.corpGet).toBe(1));

    await userEvent.click(
      screen.getByRole('button', { name: 'actions.submit' }),
    );

    await waitFor(() => expect(errorSpy).toHaveBeenCalled());

    type ErrorArg = Parameters<typeof notification.error>[0];
    const last = errorSpy.mock.calls.at(-1)?.[0] as ErrorArg | undefined;
    const text =
      typeof last?.description === 'string'
        ? last.description
        : ((last?.description as any)?.toString?.() ?? '');

    expect(text).toMatch(/Invalid phone number/i);
  });
});
