import { Context } from "../deps.ts";

export async function logger(ctx: Context, next: () => Promise<unknown>) {
  const logFile = "./logs.md"; // Log file in Markdown format
  const { method, url } = ctx.request; // Access request properties

  // Get current timestamp
  const timestamp = new Date().toISOString();

  // Start building the Markdown log entry
  let logEntry = `## Incoming Request - ${timestamp}\n`;
  logEntry += `- **Method**: \`${method}\`\n`;
  logEntry += `- **URL**: [${url}](http://${url.hostname}${url.pathname})\n`;

  // Log request payload if present
  if (ctx.request.hasBody) {
    const body = await ctx.request.body().value;
    logEntry += `- **Payload**:\n\`\`\`json\n${JSON.stringify(
      body,
      null,
      2
    )}\n\`\`\`\n`;
  } else {
    logEntry += `- **Payload**: \`No body\`\n`;
  }

  const start = performance.now();
  try {
    await next();
  } finally {
    const ms = performance.now() - start;

    // Add response details
    logEntry += `- **Response Status**: \`${ctx.response.status || 200}\`\n`;
    logEntry += `- **Response Time**: \`${ms.toFixed(2)}ms\`\n`;

    const responseBody = ctx.response.body || "No body";
    logEntry += `- **Response Body**:\n\`\`\`json\n${JSON.stringify(
      responseBody,
      null,
      2
    )}\n\`\`\`\n`;

    logEntry += `\n---\n`; // Separator between entries

    // Append log entry to the Markdown file
    try {
      Deno.writeTextFileSync(logFile, logEntry, { append: true });
    } catch (err) {
      console.error("Failed to write to log file:", err.message);
    }
  }
}
