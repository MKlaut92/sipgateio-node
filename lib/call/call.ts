import {
	CallDTO,
	CallData,
	CallModule,
	InitiateNewCallSessionResponse,
} from './call.types';
import { ErrorMessage } from './errors/ErrorMessage';
import { HttpClientModule, HttpError } from '../core/httpClient';
import { handleCoreError } from '../core/errors/handleError';
import { validateCallData } from './validators/validateCallData';

export const createCallModule = (httpClient: HttpClientModule): CallModule => ({
	async initiate(
		clickToDial: CallData
	): Promise<InitiateNewCallSessionResponse> {
		const clickToDialValidation = validateCallData(clickToDial);
		if (!clickToDialValidation.isValid) {
			throw new Error(clickToDialValidation.cause);
		}
		const callDTO: CallDTO = {
			callee: clickToDial.to,
			caller: clickToDial.from,
			callerId: clickToDial.callerId,
			deviceId: clickToDial.deviceId,
		};
		return httpClient
			.post<InitiateNewCallSessionResponse>('/sessions/calls', callDTO)
			.catch((error) => Promise.reject(handleError(error)));
	},
});

const handleError = (error: HttpError): Error => {
	if (error.response && error.response.status === 400) {
		return new Error(ErrorMessage.CALL_BAD_REQUEST);
	}

	if (error.response && error.response.status === 402) {
		return new Error(ErrorMessage.CALL_INSUFFICIENT_FUNDS);
	}

	if (error.response && error.response.status === 403) {
		return new Error(ErrorMessage.CALL_INVALID_EXTENSION);
	}

	return handleCoreError(error);
};
