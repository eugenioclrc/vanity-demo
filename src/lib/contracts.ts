import { config, chainId, account } from './store';
import { readContract, writeContract, multicall, watchContractEvent } from '@wagmi/core';

import { parseAbi } from 'viem'

import { writable, get } from 'svelte/store';

export const VANITY = '0xD08BD72e685Da05f5edFa6cCc989381E06169491';

const abi = parseAbi([
    //  ^? const abi: readonly [{ name: "balanceOf"; type: "function"; stateMutability:...
    'function mint(address to, bytes12 salt) external',
    'function reserve(bytes32 _commit)',
    'function deploy(uint256 id, bytes memory code) external returns (address deployed)'

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

export async function deploy(id, bytecode) {
    const data = await writeContract(get(config), {
        address: VANITY,
        abi,
        functionName: 'deploy',
        args: [id, bytecode],
    });

    return data;
}