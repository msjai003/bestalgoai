
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
            <div className="bg-gray-800/20 rounded-xl p-5 border border-gray-700/50">
              <h2 className="text-xl font-bold mb-4 text-center text-pink-500">BestAlgo.ai – Legal Terms & Privacy Policy</h2>
              <div className="space-y-2 mb-6">
                <p className="text-sm text-gray-300">
                  <span className="font-semibold">Effective Date:</span> 06/03/2024
                </p>
                <p className="text-sm text-gray-300">
                  <span className="font-semibold">Last Updated:</span> 01/02/2025
                </p>
              </div>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-3 text-pink-500">1. Introduction</h3>
                  <div className="text-sm leading-relaxed text-gray-300 space-y-2">
                    <p>Welcome to BestAlgo.ai - Platform, a trading software developed and owned by Infocap Securities Private Limited ("Company"). BestAlgo.ai is an algorithmic trading platform designed to facilitate automated and data-driven trading in the Indian stock market.</p>
                    <p>By accessing and using BestAlgo.ai, you acknowledge that you have read, understood, and agreed to these Legal Terms & Privacy Policy. If you do not agree, please refrain from using our platform.</p>
                    <p>BestAlgo.ai operates as a technology provider and does not provide investment advice. Users are solely responsible for their trading decisions, and all transactions are executed at their discretion.</p>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3 text-pink-500">2. Legal Disclaimer</h3>
                  <div className="text-sm leading-relaxed text-gray-300 space-y-2">
                    <p><span className="font-medium">No Investment Advice:</span> BestAlgo.ai is a software product and does not provide financial, investment, tax, or legal advice. Users should conduct their own research or consult a professional before making trading decisions.</p>
                    <p><span className="font-medium">SEBI Compliance:</span> BestAlgo.ai does not operate as a SEBI-registered investment advisor (RIA) or stockbroker. We do not guarantee profits, and users must comply with SEBI regulations while using the software.</p>
                    <p><span className="font-medium">Market Risks:</span> Algorithmic trading involves risks such as market volatility, data inaccuracy, execution delays, and software limitations. Users must fully understand the risks before deploying live strategies.</p>
                    <p><span className="font-medium">Brokerage Dependency:</span> BestAlgo.ai requires integration with third-party brokers for execution. Users are subject to the terms and conditions of their respective brokers.</p>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3 text-pink-500">3. Terms of Use</h3>
                  <div className="text-sm leading-relaxed text-gray-300 space-y-4">
                    <div>
                      <h4 className="font-medium mb-1">3.1 Account Registration & User Obligations</h4>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>Users must be 18 years or older and possess a valid Indian stockbroker trading account.</li>
                        <li>The information provided during registration must be accurate, up-to-date, and complete.</li>
                        <li>Users are responsible for maintaining the confidentiality of their credentials.</li>
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-1">3.2 Permitted Use</h4>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>Users are granted a limited, non-exclusive, non-transferable license to access and use BestAlgo.ai.</li>
                        <li>The software must not be used for fraudulent activities, market manipulation, or unauthorized access to financial data.</li>
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-1">3.3 Prohibited Activities</h4>
                      <p>Users are strictly prohibited from:</p>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>Reverse engineering, modifying, or reselling our software.</li>
                        <li>Misusing APIs or attempting to manipulate market data.</li>
                        <li>Executing trades in violation of SEBI or broker regulations.</li>
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-1">3.4 Software Integrity & Data Accuracy</h4>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>BestAlgo.ai provides trading signals, automated execution, and analytical tools, but does not guarantee accuracy, performance, or uninterrupted access.</li>
                        <li>Real-time data delays, broker API limitations, and system malfunctions may impact order execution.</li>
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-1">3.5 Service Downtime & Liability</h4>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>While we ensure 99.9% uptime, occasional disruptions due to maintenance, broker API issues, or regulatory changes may occur.</li>
                        <li>BestAlgo.ai is not liable for any financial losses due to software downtime or execution delays.</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3 text-pink-500">4. Privacy Policy</h3>
                  <div className="text-sm leading-relaxed text-gray-300 space-y-4">
                    <div>
                      <h4 className="font-medium mb-1">4.1 Data Collection & Usage</h4>
                      <p>BestAlgo.ai collects and processes the following user data:</p>
                      <ul className="list-disc pl-5 space-y-1">
                        <li><span className="italic">Personal Information:</span> Name, email, phone number, broker details.</li>
                        <li><span className="italic">Financial Data:</span> Trading account link, order history, strategy preferences.</li>
                        <li><span className="italic">Device & Usage Data:</span> IP address, browser type, system logs.</li>
                      </ul>
                      <p className="mt-2">Why We Collect Data:</p>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>To facilitate automated trading and strategy execution.</li>
                        <li>To enhance user experience with AI-driven insights.</li>
                        <li>To comply with legal requirements and prevent fraud.</li>
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-1">4.2 Data Security Measures</h4>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>BestAlgo.ai implements AES-256 encryption and secured API integrations.</li>
                        <li>We do not store brokerage login credentials or execute unauthorized trades.</li>
                        <li>All transactions occur via user-authorized broker APIs, ensuring compliance with SEBI security protocols.</li>
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-1">4.3 Data Sharing & Third-Party Integrations</h4>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>We do not sell or rent user data to third parties.</li>
                        <li>User data may be shared with brokers, analytics providers, or regulatory bodies if required by law.</li>
                        <li>Users will be notified if a third-party integration requires data access.</li>
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-1">4.4 Cookies & Tracking</h4>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>We use cookies to track user activity and improve platform functionality.</li>
                        <li>Users may manage cookie preferences in their browser settings.</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3 text-pink-500">5. Subscription & Payments</h3>
                  <div className="text-sm leading-relaxed text-gray-300 space-y-4">
                    <div>
                      <h4 className="font-medium mb-1">5.1 Pricing & Subscription Plans</h4>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>BestAlgo.ai offers monthly, quarterly, and annual subscription plans.</li>
                        <li>Payments are processed through secure payment gateways.</li>
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-1">5.2 Refund & Cancellation Policy</h4>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>No refunds for used subscription periods.</li>
                        <li>Users may cancel their subscription at any time, effective at the next billing cycle.</li>
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-1">5.3 Auto-Renewal</h4>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>Subscriptions are automatically renewed unless manually canceled.</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3 text-pink-500">6. Liability & Indemnification</h3>
                  <div className="text-sm leading-relaxed text-gray-300 space-y-4">
                    <div>
                      <h4 className="font-medium mb-1">6.1 Limitation of Liability</h4>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>BestAlgo.ai shall not be held responsible for any trading losses incurred while using our software.</li>
                        <li>We do not guarantee profits or strategy performance.</li>
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-1">6.2 Indemnification</h4>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>Users agree to indemnify Infocap Securities Private Limited from any claims, losses, or damages arising from their trading activities.</li>
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-1">6.3 Force Majeure</h4>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>We are not liable for disruptions due to regulatory changes, cyber-attacks, or technical failures.</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3 text-pink-500">7. Governing Law & Dispute Resolution</h3>
                  <div className="text-sm leading-relaxed text-gray-300 space-y-2">
                    <p>This agreement is governed by Indian law.</p>
                    <p>Disputes will be resolved through arbitration in Mumbai, India, per the Arbitration and Conciliation Act, 1996.</p>
                    <p>Users submit to SEBI & Indian courts for any legal matters.</p>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3 text-pink-500">8. Updates & Modifications</h3>
                  <div className="text-sm leading-relaxed text-gray-300 space-y-2">
                    <p>BestAlgo.ai reserves the right to update this policy at any time.</p>
                    <p>Users will be notified of major changes via email or dashboard alerts.</p>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3 text-pink-500">9. Contact Information</h3>
                  <div className="text-sm leading-relaxed text-gray-300 space-y-2">
                    <p>For support or legal inquiries:</p>
                    <p>📧 Email: <a href="mailto:support@bestalgo.ai" className="text-pink-500 hover:underline">support@bestalgo.ai</a></p>
                    <p>📍 Registered Office: Infocap Securities Private Limited, No.27/A, First Floor, Veerapathira Pillai Compound, APK Road, Villapuram, Madurai - 625012</p>
                    <p className="font-medium mt-4">By using BestAlgo.ai, you agree to these Legal Terms & Privacy Policy</p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default Terms;
