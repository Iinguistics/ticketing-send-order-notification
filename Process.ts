import AWS from 'aws-sdk';
import EventBody from './EventBody';

class Process {
	#email;
	#orderId;
	#paymentId;
	#ses;

	constructor(event: EventBody) {
		this.#email = event.email;
		this.#orderId = event.orderId;
		this.#paymentId = event.paymentId;
		this.#ses = new AWS.SES();
	}

	static async run(event: EventBody): Promise<void> {
		return new Process(event).#execute();
	}

	async #execute(): Promise<void> {
		console.info(`Sending order notification to email: ${this.#email}`);

		const response = await this.#ses.sendEmail(this.#params).promise();

		if (!response.MessageId) {
			console.error(
				'Cannot process order notification:',
				response.$response.error
			);
			throw new Error(
				`Could not process order ID: ${this.#orderId} notification`
			);
		}
	}

	get #params(): AWS.SES.SendEmailRequest {
		return {
			Destination: {
				ToAddresses: [this.#email],
			},
			Message: {
				Body: {
					Html: {
						Data: this.#htmlContent,
					},
				},
				Subject: {
					Data: 'Order has processed',
				},
			},
			Source: 'jmsgoytia@gmail.com',
		};
	}

	get #htmlContent(): string {
		return `
		<html>
        <head>
            <style>
                /* custom CSS styles here */
            </style>
        </head>
        <body>
            <h1>Thank You for Your Order!</h1>
            <p>We appreciate your business and are pleased to inform you that your order has been successfully processed.</p>
            <p>Order ID: ${this.#orderId}</p>
            <p>Payment ID: ${this.#paymentId}</p>
            <p>If you have any questions or concerns, please feel free to contact us.</p>
            <p>Thank you again for choosing Event Tickets!</p>
        </body>
        </html>
		`;
	}
}

export default Process;
