type EventBody = Readonly<{
	email: string;
	orderId: string;
	paymentId: string;
}>;

export default EventBody;
