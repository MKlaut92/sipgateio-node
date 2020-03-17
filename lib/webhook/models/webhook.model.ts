import { EventType, RejectReason } from '../webhook.module';

enum Direction {
	IN = 'in',
	OUT = 'out',
}

enum HangupCause {
	NORMAL_CLEARING = 'normalClearing',
	BUSY = 'busy',
	CANCEL = 'cancel',
	NO_ANSWER = 'noAnswer',
	CONGESTION = 'congestion',
	NOT_FOUND = 'notFound',
	FORWARDED = 'forwarded',
}

export interface Event {
	event: EventType;
	callId: string;
}

export interface GenericCallEvent extends Event {
	direction: Direction;
	from: string;
	to: string;
	xcid: string;
}

export interface NewCallEvent extends GenericCallEvent {
	event: EventType.NEW_CALL;
	originalCallId: string;
	user: string[];
	userId: string[];
	fullUserId: string[];
}

export interface AnswerEvent extends GenericCallEvent {
	event: EventType.ANSWER;
	user: string;
	userId: string;
	fullUserId: string;
	answeringNumber: string;
	diversion?: string;
}

export interface DataEvent extends Event {
	event: EventType.DATA;
	dtmf: string; // Can begin with zero, so it has to be a string
}

export interface HangupEvent extends GenericCallEvent {
	event: EventType.HANGUP;
	cause: HangupCause;
	answeringNumber: string;
}

export type CallEvent = NewCallEvent | AnswerEvent | HangupEvent | DataEvent;

export type RedirectOptions = {
	numbers: string[];
	anonymous?: boolean;
	callerId?: string;
};

export type GatherOptions = {
	announcement?: string;
	maxDigits: number;
	timeout: number;
};

export type PlayOptions = {
	announcement: string;
};

export type RejectOptions = {
	reason: RejectReason;
};

export type RedirectObject = {
	Dial: {
		_attributes: { callerId?: string; anonymous?: string };
		Number: string[];
	};
};

export type GatherObject = {
	Gather: {
		_attributes: { onData?: string; maxDigits?: string; timeout?: string };
		Play?: { Url: string };
	};
};

export type PlayObject = {
	Play: { Url: string };
};

export type RejectObject = {
	Reject: { _attributes: { reason?: string } };
};

export type HangupObject = {
	Hangup: {};
};

export type VoicemailObject = {
	Dial: { Voicemail: {} };
};

export type ResponseObject =
	| RedirectObject
	| VoicemailObject
	| PlayObject
	| GatherObject
	| HangupObject
	| RejectObject;
