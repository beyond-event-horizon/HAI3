/**
 * Chat Model Constants
 * Well-defined constants for LLM model identifiers
 * Avoids string literal violations
 */

export enum ChatModel {
  GPT5 = 'gpt-5',
  GPT45Turbo = 'gpt-4.5-turbo',
  Claude45 = 'claude-4.5',
  Claude4 = 'claude-4',
}

export const DEFAULT_MODEL = ChatModel.GPT5;
