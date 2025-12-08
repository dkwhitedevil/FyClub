export default function Hero() {
  return (
    <section className="space-y-8 py-12">
      <div className="space-y-6">
        <div>
          <h1 className="max-w-3xl text-5xl md:text-6xl leading-tight">
            AI risk & rebalancing
            <br />
            <span className="border-4 border-black bg-pink-500 px-3 text-white">
              for DeFi treasuries
            </span>
          </h1>
        </div>

        <p className="max-w-2xl text-lg font-semibold leading-relaxed text-gray-800">
          FY Club watches any treasury address, scores its on-chain risk in real-time, and proposes AI-generated protection actions—ready to operate as an autonomous tokenized agent on ATP.
        </p>

        <div className="flex flex-wrap gap-4">
          <a
            href="#scanner"
            className="btn-pink inline-block"
          >
            → Scan a Treasury
          </a>
          <a
            href="https://github.com/dkwhitedevil/FyClub"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-brutalist inline-block"
          >
            → View Code
          </a>
        </div>
      </div>

      <div className="divider-brutalist" />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card-brutalist">
          <p className="text-xs font-black uppercase tracking-widest text-gray-600">01</p>
          <h3 className="mt-3">Real-time Monitoring</h3>
          <p className="mt-2 text-sm font-semibold text-gray-700">
            Fetches live treasury balances from blockchain in seconds.
          </p>
        </div>

        <div className="card-pink">
          <p className="text-xs font-black uppercase tracking-widest text-gray-600">02</p>
          <h3 className="mt-3">AI Risk Analysis</h3>
          <p className="mt-2 text-sm font-semibold text-gray-700">
            ADK-TS agents analyze concentration, diversification & exposure.
          </p>
        </div>

        <div className="card-brutalist">
          <p className="text-xs font-black uppercase tracking-widest text-gray-600">03</p>
          <h3 className="mt-3">Protection Recommendations</h3>
          <p className="mt-2 text-sm font-semibold text-gray-700">
            Generates specific actions to reduce risk and enforce policies.
          </p>
        </div>
      </div>
    </section>
  );
}
