// This file handles code highlighting for code blocks in posts

/**
 * Extracts code blocks from a string and applies syntax highlighting
 * @param content Text content that may contain code blocks
 * @returns Content with highlighted code blocks
 */
export async function highlightCode(content: string): Promise<string> {
  if (!content) return "";
  
  // Regex to match code blocks with optional language specification
  // Format: ```language\ncode\n```
  const codeBlockRegex = /```([a-z]*)\n([\s\S]*?)```/g;
  
  // Replace each code block with highlighted version
  return content.replace(codeBlockRegex, (match, language, code) => {
    // Return the code block wrapped in highlight container
    // Note: The actual highlighting will be done on the client side
    // using PrismJS which is included in the client
    return `<pre class="language-${language || 'plaintext'}"><code>${escapeHtml(code.trim())}</code></pre>`;
  });
}

/**
 * Escapes HTML special characters to prevent XSS attacks
 * @param html String that may contain HTML
 * @returns Escaped HTML string
 */
function escapeHtml(html: string): string {
  return html
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
