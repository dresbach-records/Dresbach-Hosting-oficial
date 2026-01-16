'use server';

/**
 * @fileOverview An AI-powered intelligent support assistant for Dresbach Hosting.
 *
 * - intelligentSupportAssistant - A function that provides answers to common hosting and tech ops questions.
 * - IntelligentSupportAssistantInput - The input type for the intelligentSupportAssistant function.
 * - IntelligentSupportAssistantOutput - The return type for the intelligentSupportAssistant function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const IntelligentSupportAssistantInputSchema = z.object({
  query: z.string().describe('The user query regarding hosting or tech ops.'),
});
export type IntelligentSupportAssistantInput = z.infer<typeof IntelligentSupportAssistantInputSchema>;

const IntelligentSupportAssistantOutputSchema = z.object({
  answer: z.string().describe('The answer to the user query.'),
});
export type IntelligentSupportAssistantOutput = z.infer<typeof IntelligentSupportAssistantOutputSchema>;

export async function intelligentSupportAssistant(input: IntelligentSupportAssistantInput): Promise<IntelligentSupportAssistantOutput> {
  return intelligentSupportAssistantFlow(input);
}

const prompt = ai.definePrompt({
  name: 'intelligentSupportAssistantPrompt',
  input: {schema: IntelligentSupportAssistantInputSchema},
  output: {schema: IntelligentSupportAssistantOutputSchema},
  prompt: `You are an AI-powered support assistant for Dresbach Hosting, specialized in answering questions related to hosting and tech ops.

  Answer the following user query:
  {{query}}

  Provide a clear, concise, and helpful answer. If you cannot answer the query, state that you are unable to provide an answer.`,
});

const intelligentSupportAssistantFlow = ai.defineFlow(
  {
    name: 'intelligentSupportAssistantFlow',
    inputSchema: IntelligentSupportAssistantInputSchema,
    outputSchema: IntelligentSupportAssistantOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
