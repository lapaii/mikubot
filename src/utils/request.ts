import http from 'http'

const timeoutMs = 60000;

export const request = (url: string): Promise<any> => {
	return new Promise((resolve, reject) => {
		const req = http.request(url, { method: "GET" }, (response) => {
			const chunks: any[] = [];
			
			response.on('data', (chunk: any) => chunks.push(chunk));
			response.on('end', async () => {
				
				const data = Buffer.concat(chunks).toString();
				resolve(data);
			});
		}).on('error', reject);
		
		req.setTimeout(timeoutMs, () => {
			req.destroy();
			reject(new Error(`Request to ${url} time out after ${timeoutMs}ms`));
		});
		
		req.end();
	});
};