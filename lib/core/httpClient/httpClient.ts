/* eslint  @typescript-eslint/no-explicit-any: 0 */
import { AuthCredentials } from '../sipgateIOClient/sipgateIOClient.types';
import { detect as detectPlatform } from 'detect-browser';
import {
	validateEmail,
	validateOAuthToken,
	validatePassword,
} from '../validator';
import { version } from '../../version.json';
import axios from 'axios';
import btoa from 'btoa';

import {
	HttpClientModule,
	HttpRequestConfig,
	HttpResponse,
} from './httpClient.types';
import qs from 'qs';

export const createHttpClient = (
	credentials: AuthCredentials
): HttpClientModule => {
	const authorizationHeader = getAuthHeader(credentials);

	const platformInfo = detectPlatform();
	const client = axios.create({
		baseURL: 'https://api.sipgate.com/v2',
		headers: {
			Authorization: authorizationHeader,
			'X-Sipgate-Client': JSON.stringify(platformInfo),
			'X-Sipgate-Version': version,
			'Content-Type': 'application/json',
		},
		paramsSerializer: (params) =>
			qs.stringify(params, { arrayFormat: 'repeat' }),
	});

	return {
		delete<T = any, R = HttpResponse<T>>(
			url: string,
			config?: HttpRequestConfig
		): Promise<R> {
			return client.delete(url, config);
		},

		get<T = any, R = HttpResponse<T>>(
			url: string,
			config?: HttpRequestConfig
		): Promise<R> {
			return client.get(url, config);
		},

		patch<T = any, R = HttpResponse<T>>(
			url: string,
			data?: any,
			config?: HttpRequestConfig
		): Promise<R> {
			return client.patch(url, data, config);
		},

		post<T = any, R = HttpResponse<T>>(
			url: string,
			data?: any,
			config?: HttpRequestConfig
		): Promise<R> {
			return client.post(url, data, config);
		},

		put<T = any, R = HttpResponse<T>>(
			url: string,
			data?: any,
			config?: HttpRequestConfig
		): Promise<R> {
			return client.put(url, data, config);
		},
	};
};

const getAuthHeader = (credentials: AuthCredentials): string => {
	if ('token' in credentials) {
		const tokenValidationResult = validateOAuthToken(credentials.token);

		if (!tokenValidationResult.isValid) {
			throw new Error(tokenValidationResult.cause);
		}
		return `Bearer ${credentials.token}`;
	}

	const emailValidationResult = validateEmail(credentials.username);

	if (!emailValidationResult.isValid) {
		throw new Error(emailValidationResult.cause);
	}

	const passwordValidationResult = validatePassword(credentials.password);

	if (!passwordValidationResult.isValid) {
		throw new Error(passwordValidationResult.cause);
	}

	return `Basic ${btoa(`${credentials.username}:${credentials.password}`)}`;
};
