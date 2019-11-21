import { ErrorMessage } from '../core/errors';
import { parseCsvString } from './contacts';

describe('Call Module', () => {
	it('should parse the csv successfully', () => {
		const EXAMPLE_STRING = `gender,lastname,firstname,number\nm,turing,theodor,number`;
		const EXPECTED_STRING = `firstname,lastname,number\ntheodor,turing,number`;

		expect(parseCsvString(EXAMPLE_STRING)).toBe(EXPECTED_STRING);
	});

	it('should print an Error, if the header does not contain "firstname","lastname" and "number"', () => {
		const EXAMPLE_STRING = `firstname,number\nm,turing\nd,foo,dummy`;

		expect(() => parseCsvString(EXAMPLE_STRING)).toThrowError(
			ErrorMessage.CONTACTS_MISSING_HEADER_FIELD
		);
	});

	it('should print an Error, if one value is missing in the CSV-Columns', () => {
		const EXAMPLE_STRING = `firstname,lastname,number\nm,turing,000\na,000\na,b,000`;

		expect(() => parseCsvString(EXAMPLE_STRING)).toThrowError(
			ErrorMessage.CONTACTS_MISSING_VALUES
		);
	});
});
