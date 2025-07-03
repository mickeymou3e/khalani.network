import { Flex, FlexProps, Span } from '@interlay/ui';
import Jazzicon, { jsNumberForAddress } from 'react-jazzicon';

const truncateEthRegex = /^(0x[a-zA-Z0-9]{4})[a-zA-Z0-9]+([a-zA-Z0-9]{4})$/;

const truncateEthAddress = (address: string | `0x${string}`) => {
  const match = address.match(truncateEthRegex);

  if (!match) return address;

  return `${match[1]}…${match[2]}`;
};

type Props = { address: string };

type InheritAttrs = Omit<FlexProps, keyof Props>;

type EvmAddressLabelProps = Props & InheritAttrs;

const EvmAddressLabel = ({
  address,
  alignItems = 'center',
  gap = 's',
  ...props
}: EvmAddressLabelProps): JSX.Element => (
  <Flex alignItems={alignItems} gap={gap} {...props}>
    <Jazzicon diameter={20} seed={jsNumberForAddress(address)} />
    <Span size='s'>{truncateEthAddress(address)}</Span>
  </Flex>
);

export { EvmAddressLabel };
export type { EvmAddressLabelProps };
