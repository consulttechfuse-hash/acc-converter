function App() {
  return (
    <div className="min-h-screen bg-page-bg p-8 flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold mb-4 text-white">GHD Converter</h1>
      
      {/* Test the Card Surface */}
      <div className="bg-card-bg p-6 rounded-xl w-full max-w-md shadow-lg border border-elevated-bg">
        <h2 className="text-ghd-gold text-xl mb-2 font-semibold">Gold Anchored</h2>
        
        {/* Test the Teal Market Card */}
        <div className="bg-market-teal text-black p-4 rounded-lg mt-4 font-mono">
          <p>1 GHD = R7,143.53</p>
        </div>
      </div>
    </div>
  );
}

export default App;