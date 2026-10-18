import React from 'react';
import { OenexaAgentTab, OenexaAgentTabProps } from './OenexaAgentTab';

export type ArgonAgentTabProps = OenexaAgentTabProps;

/**
 * Backward-compatible wrapper delegating to pure-own OenexaAgentTab.
 */
export const ArgonAgentTab: React.FC<ArgonAgentTabProps> = (props) => {
  return <OenexaAgentTab {...props} />;
};
