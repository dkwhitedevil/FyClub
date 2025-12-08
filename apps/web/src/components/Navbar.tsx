export default function Navbar() {
  return (
    <nav className="border-b-4 border-black bg-white px-8 py-6">
      <div className="mx-auto max-w-7xl flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="border-4 border-black bg-pink-500 px-3 py-1">
            <h1 className="text-xl font-black text-white uppercase tracking-tighter">
              FY Club
            </h1>
          </div>
          <p className="text-xs font-bold uppercase tracking-wide text-gray-700">
            AI Treasury Guardian
          </p>
        </div>

        <div className="flex items-center gap-6">
          <a
            href="#scanner"
            className="text-sm font-bold uppercase tracking-wide hover:underline hover:underline-offset-4"
          >
            Scan
          </a>
          <a
            href="https://github.com/dkwhitedevil/FyClub"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-bold uppercase tracking-wide hover:underline hover:underline-offset-4"
          >
            GitHub
          </a>
        </div>
      </div>
    </nav>
  );
}
