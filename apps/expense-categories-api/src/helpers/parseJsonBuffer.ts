import { z } from 'zod';

export function parseJsonBuffer<T>(buffer: string, schema: z.ZodType<T>): { remainingBuffer: string; objects: T[] } {
  const objects: T[] = [];
  let remainingBuffer = buffer;

  // Find the start of the array
  const startIndex = remainingBuffer.indexOf('[');
  if (startIndex === -1) {
    return { remainingBuffer, objects };
  }

  // Extract the content after the opening bracket
  let processedLength = 0;

  // Iterate over each closing brace
  for (let i = remainingBuffer.length - 1; i > startIndex; i--) {
    if (remainingBuffer[i] === '}') {
      // Attempt to complete the array and parse it
      const possibleArray = '[' + remainingBuffer.slice(startIndex + 1, i + 1) + ']';

      try {
        const parsedArray = JSON.parse(possibleArray);
        if (Array.isArray(parsedArray)) {
          for (const item of parsedArray) {
            const validatedItem = schema.safeParse(item);
            if (validatedItem.success) {
              objects.push(validatedItem.data);
            }
          }
          processedLength = i;
          break;
        }
      } catch (error) {
        // If parsing fails, continue to the next closing brace
      }
    }
  }

  // Update the remaining buffer
  // Keep the initial '[' and any unprocessed content
  if (processedLength) {
    remainingBuffer =
      remainingBuffer.slice(0, startIndex + 1) + remainingBuffer.slice(processedLength + 1).replace(/^,+/, '');
  }

  return { remainingBuffer, objects };
}
