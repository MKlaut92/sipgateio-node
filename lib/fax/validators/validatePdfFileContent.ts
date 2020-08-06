import { FaxErrorMessage } from '../errors/handleFaxError';
import { ValidationResult } from '../../core/validator';
import fileType from 'file-type';

const validatePdfFileContent = async (
	content: Buffer
): Promise<ValidationResult> => {
	const fileTypeResult = await fileType.fromBuffer(content);

	if (!fileTypeResult || fileTypeResult.mime !== 'application/pdf') {
		return {
			cause: FaxErrorMessage.VALIDATOR_INVALID_PDF_MIME_TYPE,
			isValid: false,
		};
	}

	return { isValid: true };
};
export { validatePdfFileContent };
