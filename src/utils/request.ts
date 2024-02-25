import https from "https";

const timeoutMs = 60000;

export async function request(url: string): Promise< string> {
    return new Promise(function (resolve, reject) {
        const req = https.request(url, { method: "GET" }, function (response) {
            const chunks: Array<any> = [];

            response.on("data", function (chunk: any) { chunks.push(chunk); });
            response.on("end", function () {
                const data = Buffer.concat(chunks).toString();
                resolve(data);
            });
        }).on("error", reject);

        req.setTimeout(timeoutMs, function () {
            req.destroy();
            reject(new Error(`request to ${url} timedout after ${timeoutMs}ms`));
        });

        req.end();
    });
}
