<script lang="ts">
	import { modal } from '$lib/store';
	import { account, loadReady } from '$lib/store';
	import { reserve, mint } from "$lib/contracts";

import { keccak256 } from 'viem';
import { stringToHex } from 'viem'
import { concat,slice,toBytes,toRlp } from 'viem'

let salt = '';
let saltBytes12;
let invalidSalt = false;
$: if(salt) {
	invalidSalt = false;
	try {
		saltBytes12 = stringToHex( salt, { size: 12 });
	} catch (err) {
		invalidSalt = true;
	}
}

$: senderSalt = ($account && saltBytes12) ? concat([$account, saltBytes12]):'';
async function doCommit() {
	console.log("salt",senderSalt);
	console.log("hashed salt",keccak256(senderSalt));

	await reserve(keccak256(senderSalt));
	alert("Commit done");
}

async function doMint() {
	console.log("Minting");
	await mint(saltBytes12);
	alert("Mint done");
}

// TODO: set factory address
const FACTORY_ADDR = toBytes('0x00000000231C09b34010207Ca8F37bf1f9dBac7c');
const PROXY_BYTECODE_HASH =toBytes('0xbb908235335e3d6acecf544d682abde3fae769324b91ff66eae03c7c0fc2a952');
$: proxy = slice(keccak256(concat([toBytes('0xff'), FACTORY_ADDR, senderSalt, PROXY_BYTECODE_HASH])),12);

$: contract = slice(
keccak256(
                        concat([
                            // 0xd6 = 0xc0 (short RLP prefix) + 0x16 (length of: 0x94 ++ proxy ++ 0x01)
                            // 0x94 = 0x80 + 0x14 (0x14 = the length of an address, 20 bytes, in hex)
                            toBytes('0xd694'),
                            proxy,
                            toBytes('0x01') // Nonce of the proxy contract (1)
])), 12);



</script>

<main id="content" class="homepage container">
	<section class="hero">
		<div class="hook">
			<h1><mark>A Demo for ETHGLOBAL</mark> <br>
				mint a NFT to park an address 
			</h1>
			<p class="secondary">
				This is a demo of the CREATE3FACTORY capabilities.
			</p>
			
			<div class="grid ctas">
				<a role="button" href="/mint">Mint<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round" class="icon-arrow-right"><g class="head"><path d="M10 16L14 12"></path><path d="M10 8L14 12"></path></g><path class="line" d="M0 12H14"></path></svg></a>
				<a role="button" class="contrast" disabled >Deploy<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round" class="icon-arrow-right"><g class="head"><path d="M10 16L14 12"></path><path d="M10 8L14 12"></path></g><path class="line" d="M0 12H14"></path></svg></a>
			</div>
		</div>
		</section>
		<!--
		<section class="stats"><ul><li><p class="count"><strong>12.1K</strong></p><p class="label"><a href="https://github.com/picocss/pico" class="secondary" target="_blank" rel="noopener noreferrer"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round" class="icon-star"><path d="M8.243 7.34l-6.38 .925l-.113 .023a1 1 0 0 0 -.44 1.684l4.622 4.499l-1.09 6.355l-.013 .11a1 1 0 0 0 1.464 .944l5.706 -3l5.693 3l.1 .046a1 1 0 0 0 1.352 -1.1l-1.091 -6.355l4.624 -4.5l.078 -.085a1 1 0 0 0 -.633 -1.62l-6.38 -.926l-2.852 -5.78a1 1 0 0 0 -1.794 0l-2.853 5.78z"></path></svg>GitHub Stars</a></p></li><li><p class="count"><strong>74.1K</strong></p><p class="label"><a href="https://www.npmjs.com/package/@picocss/pico" class="secondary" target="_blank" rel="noopener noreferrer"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round" class="icon-terminal"><path d="M8 9l3 3l-3 3"></path><path d="M13 15l3 0"></path><path d="M3 4m0 2a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2z"></path></svg><span class="period-prefix">Monthly </span>Npm Downloads</a></p><p class="period-suffix">(Last month)</p></li><li><p class="count"><strong>3.2M</strong></p><p class="label"><a href="https://www.jsdelivr.com/package/npm/@picocss/pico" class="secondary" target="_blank" rel="noopener noreferrer"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round" class="icon-cloud-download"><path d="M19 18a3.5 3.5 0 0 0 0 -7h-1a5 4.5 0 0 0 -11 -2a4.6 4.4 0 0 0 -2.1 8.4"></path><path d="M12 13l0 9"></path><path d="M9 19l3 3l3 -3"></path></svg><span class="period-prefix">Monthly </span>JSDelivr Requests</a></p><p class="period-suffix">(Last month)</p></li></ul></section>
	-->
		<section class="features"><hgroup><h2>A NFT market vanity address for contracts</h2>
			<p>
A simple demo to show how to use CREATE3FACTORY to mint a NFT and park an address for a contract.
</p></hgroup>
<div class="grid">
	<article>
		<h3>Mine and reserve</h3>
		<p>
			Find a salt that gives you the expected address, reserve it using a commit reveal to avoid frontrun issues.
		</p>
	</article>
	<article>
		<h3>Mint & deploy at need</h3>
		<p>After you have send your commit its time to reveal and mint you vanity address, you could then sell it or use it to deploy a contract.</p>
		</article>
	</div>
	</section>

	<section id="mint" class="hero">
		<form>
			<label for="salt">Salt</label>
			<input id="salt" type="text" bind:value={salt} placeholder="12 bytes salt" aria-invalid={invalidSalt} />
			<small>Predicted address:
				<br />
				<code>{salt && !invalidSalt && contract}</code>
			</small>
			<button on:click|preventDefault={doCommit}>1) Commit</button>
			<button on:click|preventDefault={doMint}>2) Mint</button>
		</form>
		
</main>
