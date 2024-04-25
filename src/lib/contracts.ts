import { config, chainId, account } from './store';
import { readContract, writeContract, multicall, watchContractEvent } from '@wagmi/core';

import { parseAbi } from 'viem'

import { writable, get } from 'svelte/store';

export const VANITY = '0x6b83Cf999b2B7b7247f068592Be1F8ABef0D7ed7';

const abi = parseAbi([
    //  ^? const abi: readonly [{ name: "balanceOf"; type: "function"; stateMutability:...
    'function mint(address to, bytes12 salt) external',
    'function reserve(bytes32 _commit)',
]);


export async function mint(salt) {
    const data = await writeContract(get(config), {
        address: VANITY,
        abi,
        functionName: 'mint',
        args: [get(account), salt],
    });

    return data;
}

export async function reserve(hash) {
    const data = await writeContract(get(config), {
        address: VANITY,
        abi,
        functionName: 'reserve',
        args: [hash],
    });

    return data;
}