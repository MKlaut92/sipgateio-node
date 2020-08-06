import { HttpError, handleCoreError } from '../../core';

export enum WebhookSettingErrorMessage {
	VALIDATOR_INVALID_EXTENSION_FOR_WEBHOOKS = "Whitelist allows only 'p' and 'g' extensions",
	VALIDATOR_INVALID_WEBHOOK_URL = 'Invalid webhook URL',
	WEBHOOK_SETTINGS_FEATURE_NOT_BOOKED = 'sipgateIO is not booked for your account',
}

export const handleWebhookSettingsError = (error: HttpError): Error => {
	if (error.response && error.response.status === 403) {
		return new Error(
			WebhookSettingErrorMessage.WEBHOOK_SETTINGS_FEATURE_NOT_BOOKED
		);
	}
	return handleCoreError(error);
};
