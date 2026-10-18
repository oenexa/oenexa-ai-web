import React from 'react';
import { OenexaAgentOsTab, OenexaAgentOsTabProps } from './OenexaAgentOsTab';

export type OpenAiNativeTabProps = OenexaAgentOsTabProps;

/**
 * OpenAiNativeTab forwards directly to OenexaAgentOsTab, preserving wire-compatibility
 * and backward-compatible test hooks while operating the pure-own OENEXA Neo-GPT engine.
 */
export const OpenAiNativeTab: React.FC<OpenAiNativeTabProps> = (props) => {
  return <OenexaAgentOsTab {...props} />;
};

export default OpenAiNativeTab;
