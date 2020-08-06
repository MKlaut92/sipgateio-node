import {
	BaseHistoryFilter,
	HistoryEntry,
	HistoryEntryUpdateOptionsWithId,
	HistoryModule,
	HistoryResponse,
} from './history.types';
import { ErrorMessage } from './errors/ErrorMessage';
import { HttpClientModule, HttpError } from '../core/httpClient';
import { handleCoreError } from '../core';
import { validateExtension } from '../core/validator';

export const createHistoryModule = (
	client: HttpClientModule
): HistoryModule => ({
	async fetchAll(filter, pagination): Promise<HistoryEntry[]> {
		validateFilteredExtension(filter);

		return await client
			.get<HistoryResponse>('/history', {
				params: {
					...filter,
					...pagination,
				},
			})
			.then((response) => response.items)
			.catch((error) => Promise.reject(handleError(error)));
	},
	async fetchById(entryId): Promise<HistoryEntry> {
		return await client
			.get<HistoryEntry>(`/history/${entryId}`)
			.catch((error) => Promise.reject(handleError(error)));
	},
	async deleteById(entryId): Promise<void> {
		await client
			.delete<string>(`/history/${entryId}`)
			.catch((error) => Promise.reject(handleError(error)));
	},
	async deleteByListOfIds(entryIds): Promise<void> {
		await client
			.delete<string>(`/history`, {
				params: {
					id: entryIds,
				},
			})
			.catch((error) => Promise.reject(handleError(error)));
	},
	async batchUpdateEvents(events, callback): Promise<void> {
		const mappedEvents = events.map((event) => {
			return {
				id: event.id,
				...callback(event),
			};
		});

		const eventsToModify = mappedEvents.filter(
			(eventUpdate) => Object.keys(eventUpdate).length > 1
		);

		const eventsWithNote: HistoryEntryUpdateOptionsWithId[] = [];
		const eventsWithoutNote: HistoryEntryUpdateOptionsWithId[] = [];

		eventsToModify.forEach((event) => {
			if (event.note === undefined) {
				eventsWithoutNote.push(event);
			} else {
				eventsWithNote.push(event);
			}
		});

		await Promise.all([
			...eventsWithNote.map((event) =>
				client.put(`history/${event.id}`, {
					...event,
					id: undefined,
				})
			),
			client.put('history', eventsWithoutNote),
		]).catch((error) => Promise.reject(handleError(error)));
	},
	async exportAsCsvString(filter, pagination): Promise<string> {
		validateFilteredExtension(filter);
		return await client
			.get('/history/export', {
				params: {
					...filter,
					...pagination,
				},
			})
			.then((response) => response.data)
			.catch((error) => Promise.reject(handleError(error)));
	},
});

const handleError = (error: HttpError): Error => {
	if (error.response && error.response.status === 400) {
		return new Error(ErrorMessage.HISTORY_BAD_REQUEST);
	}

	if (error.response && error.response.status === 404) {
		return new Error(ErrorMessage.HISTORY_EVENT_NOT_FOUND);
	}

	return handleCoreError(error);
};

const validateFilteredExtension = (filter?: BaseHistoryFilter): void => {
	if (filter && filter.connectionIds) {
		const result = filter.connectionIds
			.map((id) => validateExtension(id))
			.find((validationResult) => validationResult.isValid === false);
		if (result && result.isValid === false) {
			throw new Error(result.cause);
		}
	}
};
