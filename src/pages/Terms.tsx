
import { Button } from "@/components/ui/button";
import { ArrowLeft, Bookmark } from "lucide-react";
import { Link } from "react-router-dom";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";

const Terms = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-gray-200 pb-20">
      <Header />
      <div className="pt-16">
        <div className="sticky top-16 z-40 bg-gray-900/95 backdrop-blur-sm border-b border-gray-800">
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center space-x-3">
              <Link to="/" className="text-pink-500">
                <ArrowLeft size={18} />
              </Link>
              <h1 className="text-lg font-semibold">Legal Terms & Privacy</h1>
            </div>
            <button className="text-pink-500">
              <Bookmark size={18} />
            </button>
          </div>
        </div>

        <main className="px-4">
          <section id="document-info" className="py-6">
            <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-sm text-gray-400">A Product of</h2>
                  <p className="font-semibold">Infocap Securities Private Limited</p>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-xs text-gray-400">Last Updated</span>
                  <span className="text-sm text-pink-500">01/02/2025</span>
                </div>
              </div>
              <div className="flex items-center space-x-2 text-xs text-gray-400">
                <div className="text-pink-500">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                </div>
                <span>SEBI Registered • Fully Compliant</span>
              </div>
            </div>
          </section>

          <section id="terms-navigation" className="mb-6">
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gray-800/30 rounded-xl p-4 border border-gray-700/50 shadow-lg">
                <div className="text-pink-500 mb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                  </svg>
                </div>
                <h3 className="font-semibold mb-1">Terms of Use</h3>
                <p className="text-xs text-gray-400">Account, usage & obligations</p>
              </div>
              <div className="bg-gray-800/30 rounded-xl p-4 border border-gray-700/50 shadow-lg">
                <div className="text-pink-500 mb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                </div>
                <h3 className="font-semibold mb-1">Privacy Policy</h3>
                <p className="text-xs text-gray-400">Data handling & security</p>
              </div>
            </div>
          </section>

          <section id="terms-content" className="space-y-6">
            <div id="section-introduction" className="bg-gray-800/20 rounded-xl p-4 border border-gray-700/50">
              <h2 className="text-lg font-semibold mb-3 text-pink-500">1. Introduction</h2>
              <p className="text-sm leading-relaxed text-gray-300">
                Welcome to BestAlgo.ai ("Platform," "We," "Us," or "Our"), a trading software developed and owned by Infocap Securities Private Limited ("Company"). BestAlgo.ai is an algorithmic trading platform designed to facilitate automated and data-driven trading in the Indian stock market.
              </p>
            </div>
            
            <div id="section-services" className="bg-gray-800/20 rounded-xl p-4 border border-gray-700/50">
              <h2 className="text-lg font-semibold mb-3 text-pink-500">2. Service Description</h2>
              <p className="text-sm leading-relaxed text-gray-300">
                Our platform provides algorithmic trading solutions, market analysis tools, and automated trading strategies. We offer a variety of features including strategy creation, backtesting, real-time market data, and trade execution through integrated broker partnerships.
              </p>
            </div>
            
            <div id="section-eligibility" className="bg-gray-800/20 rounded-xl p-4 border border-gray-700/50">
              <h2 className="text-lg font-semibold mb-3 text-pink-500">3. Eligibility</h2>
              <p className="text-sm leading-relaxed text-gray-300">
                To use BestAlgo.ai, you must be at least 18 years of age and legally permitted to engage in securities trading under applicable laws. You must have a valid trading account with one of our supported brokers and comply with all Know Your Customer (KYC) and Anti-Money Laundering (AML) requirements.
              </p>
            </div>

            <div className="flex justify-center py-4">
              <Button className="bg-gradient-to-r from-pink-600 to-purple-600 text-white px-6 py-6 rounded-full shadow-lg shadow-pink-500/20">
                Download Full Terms (PDF)
              </Button>
            </div>
          </section>
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default Terms;
