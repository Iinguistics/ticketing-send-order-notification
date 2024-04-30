import { SQSEvent } from 'aws-lambda';
import EventBody from './EventBody';
import Process from './Process';

export const handler = async (event: SQSEvent): Promise<void> => {
	try {
		console.info('Processing order notification');

		const body: EventBody = JSON.parse(event.Records[0].body);
		await Process.run(body);

		console.info('Process completed');
	} catch (error) {
		console.error('Cannot process order notification:', error);
		throw new Error('An Unexpected error has occurred');
	}
};
