import { TransactionStatus } from '@/lib/constants';
import React from 'react';

export interface IBadgeProps {
  status: TransactionStatus;
  text: string;
}

const BADGE_COLORS = {
  [TransactionStatus.Confirmed]: '#2ECC71',
  [TransactionStatus.Failed]: '#E74C3C',
  [TransactionStatus.Pending]: '#3498DB',
};

function Badge(props: IBadgeProps) {
  const { status: type, text } = props;
  const color = React.useMemo(() => BADGE_COLORS[type], [type]);

  return (
    <div
      className="inline-block w-24 py-0.5 text-center rounded-md text-white bg-opacity-75"
      style={{ backgroundColor: color }}
    >
      <span className="text-xs">{text}</span>
    </div>
  );
}

export default Badge;
