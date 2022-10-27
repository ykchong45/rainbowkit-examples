import { useMemo } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import type { NextPage } from 'next';
import {
  useAccount,
  useContractRead,
  usePrepareContractWrite,
  useContractWrite,
} from 'wagmi';
import abis from '../constants/abis.json';
import { formatUnits } from 'ethers/lib/utils';

const Home: NextPage = () => {
  // constants
  const contractAddr = '0x9c89112dab29ecf55d4b36a6e512d5a3f8335f9d';
  const { address } = useAccount();

  // read from contract
  const { data: totalSupply, isError } = useContractRead({
    address: contractAddr,
    abi: abis,
    functionName: 'totalSupply',
    watch: true,
  });
  const totalSupplyNum = totalSupply ? formatUnits(totalSupply, 0) : 'NAN';

  // write to contract
  const { config, error: errorPrepare } = usePrepareContractWrite({
    address: contractAddr,
    abi: abis,
    functionName: 'mint',
    args: [address],
  });
  const { data, error: errorWrite, write: mint } = useContractWrite(config);
  const callMint = () => {
    mint?.();
    console.log('error on write? ', errorPrepare, errorWrite);
    console.log('called mint, response: ', data);
  };

  return (
    <>
      <div
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
          padding: 12,
        }}
      >
        <ConnectButton />
      </div>
      <div>
        <button onClick={callMint}>mint</button>
      </div>
      <div>Total Supply: {totalSupplyNum}</div>
    </>
  );
};

export default Home;
