import { AuthenticationError } from './AuthenticationError';
import { AxiosError, AxiosResponse } from 'axios';
import handleCoreError from './handleCoreError';

describe('handleCoreError', () => {
	it('AuthenticationError', () => {
		const response: AxiosResponse = {
			data: {
				status: 401 //sipgate API response
			},
			status: 401, // http status response code
			config: {},
			statusText: 'Unauthorized',
			headers: {}
		};
		const error: AxiosError = {
			name: 'testError',
			isAxiosError: true,
			message: 'test error message',
			config: {},
			response
		};
		expect(handleCoreError(error)).toEqual(new AuthenticationError());
	});

	it('AccessError', () => {
		const response: AxiosResponse = {
			data: {
				status: 403 //sipgate API response
			},
			status: 403, // http status response code
			config: {},
			statusText: 'Unauthorized',
			headers: {}
		};
		const error: AxiosError = {
			name: 'testError',
			isAxiosError: true,
			message: 'test error message',
			config: {},
			response
		};
		expect(handleCoreError(error)).toEqual(
			new AuthenticationError('Forbidden')
		);
	});

	it('Catch all errors', () => {
		const response: AxiosResponse = {
			data: {
				status: 987 //sipgate API response
			},
			status: 987, // http status response code
			config: {},
			statusText: 'Unauthorized',
			headers: {}
		};
		const error: AxiosError = {
			name: 'testError',
			isAxiosError: true,
			message: '',
			config: {},
			response
		};
		expect(handleCoreError(error)).toEqual(new Error());
	});
});
