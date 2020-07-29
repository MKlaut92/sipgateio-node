import { ErrorMessage } from '../errors';
import { ValidationResult } from './validator.types';
import atob from 'atob';

export const validateOAuthToken = (token: string): ValidationResult => {
	if (!isValidToken(token)) {
		return {
			isValid: false,
			cause: ErrorMessage.VALIDATOR_INVALID_OAUTH_TOKEN,
		};
	}

	return { isValid: true };
};

const isValidToken = (token: string): boolean => {
	try {
		const base64EncodedPayload = token
			.split('.')[1]
			.replace('-', '+')
			.replace('_', '/');

		JSON.parse(atob(base64EncodedPayload));

		return true;
	} catch (error) {
		return false;
	}
};
