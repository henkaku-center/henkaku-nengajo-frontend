# henkaku-nengajo-frontend

This is the frontend for [HENKAKU Nengajo](https://nengajo.henkaku.org/). It is a [Next.js](https://nextjs.org/) project.

## How to run the project locally

First, install the dependencies:

```bash
yarn
```

Second, run the development server:

```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the site.

For some features, you will need to provide environment variables to Next. Please see below.

### Next.js resources

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Environment variables

Create a copy of `.env.sample`, name it `.env.local`, and replace the information as needed. Note that not all variables need to be populated.

- `NEXT_PUBLIC_CHAIN_ID`: use 137 for MATIC (Polygon), 80001 for the Mumbai testnet, or 1337 if you are testing locally with Hardhat
- `NEXT_PUBLIC_CONTRACT_HENKAKUV2_ADDRESS` and `NEXT_PUBLIC_CONTRACT_NENGAJO_ADDRESS`: these are only used when the chain is set to Hardhat (deploy)
- `NEXT_PUBLIC_IPFS_API_KEY` and `NEXT_PUBLIC_IPFS_API_SECRET`: get your own keys at [Pinata](https://app.pinata.cloud/) to be able to create Nengajos from a locally served frontend
- `NEXT_PUBLIC_IPFS_API_ENDPOINT`: please use "https://api.pinata.cloud"
- `NEXT_PUBLIC_IPFS_GATEWAY_BASEURL`: feel free to use a custom one if you have one
- `NEXT_PUBLIC_JSONRPC_HTTP` and `NEXT_PUBLIC_JSONRPC_WS`: get your own at [alchemy](https://www.alchemy.com/)

## On collaborating

Henkaku is not a completely open community and, while this is an open source project, many communications about the project as well as the tokens to operate it are only shared among community members.

This site is hosted on [Vercel](https://vercel.com/), and preview sites are automatically created for each new pull request. However, if the PR comes from a forked repo, the preview deployment will need to be approved by a maintainer. Please wait for us to notice the PR or talk to us over Discord.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
