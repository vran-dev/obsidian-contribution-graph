export class GraphProcessError {
	summary: string;
	recommends?: string[];

	constructor({ summary, recommends }: { summary: string, recommends?: string[] }) {
		this.summary = summary;
		this.recommends = recommends || [];
	}
}
