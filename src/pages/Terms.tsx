
import React from 'react';
import { ArrowLeft, Bookmark } from "lucide-react";
import { Link } from "react-router-dom";
import { Footer } from "@/components/Footer";
import Header from "@/components/Header";

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
                  <h3 className="text-lg font-semibold mb-3 text-pink-500">1. Privacy Policy</h3>
                  <div className="text-sm leading-relaxed text-gray-300 space-y-4">
                    <p>At Infocap Securities Private Limited, we prioritize the privacy and security of our clients' personal information. We collect and use data solely for providing our financial services and ensure that all information is kept confidential. We do not share your personal details with third parties without your consent, except as required by law. By using our services, you agree to our privacy practices as outlined in this policy.</p>
                    
                    <div>
                      <h4 className="font-medium mb-2">Refund Policy:</h4>
                      <ul className="list-disc pl-5 space-y-2">
                        <li>Fees once paid are non-refundable under any circumstances.</li>
                        <li>Refunds are applicable only for duplicate transactions.</li>
                        <li>If you need a refund, you must provide a valid reason and intimate us within 3 days.</li>
                        <li>Any disputes reported after 3 days will not be considered.</li>
                        <li>Approved refunds will be processed within 10-15 business days.</li>
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-1">Data Collection & Usage</h4>
                      <ul className="list-disc pl-5 space-y-1">
                        <li><span className="italic">Personal Information:</span> Name, email, phone number, broker details.</li>
                        <li><span className="italic">Financial Data:</span> Trading account link, order history, strategy preferences.</li>
                        <li><span className="italic">Device & Usage Data:</span> IP address, browser type, system logs.</li>
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-1">Data Security Measures</h4>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>BestAlgo.ai implements AES-256 encryption and secured API integrations.</li>
                        <li>We do not store brokerage login credentials or execute unauthorized trades.</li>
                        <li>All transactions occur via user-authorized broker APIs, ensuring compliance with SEBI security protocols.</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3 text-pink-500">2. Terms of Use</h3>
                  <div className="text-sm leading-relaxed text-gray-300 space-y-4">
                    <div>
                      <h4 className="font-medium mb-1">1. Acceptance</h4>
                      <p>By using our services, you agree to these terms. If you do not agree, please do not use our services.</p>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-1">2. Services</h4>
                      <p>We provide trading solutions, educational webinars, and software for market analysis. All services are subject to availability and may change without prior notice.</p>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-1">3. User Responsibility</h4>
                      <p>Users must provide accurate information and comply with all applicable laws. We are not responsible for financial losses arising from market risks.</p>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-1">4. Privacy & Security</h4>
                      <p>We protect user data as per our Privacy Policy and do not share personal information without consent, except as required by law.</p>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-1">5. Refund Policy</h4>
                      <p>Payments are non-refundable except in cases of duplicate transactions. Refund requests must be made within 3 days with a valid reason.</p>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-1">6. Limitation of Liability</h4>
                      <p>We are not liable for any financial losses, technical failures, or third-party disruptions affecting our services.</p>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-1">7. Changes to Terms</h4>
                      <p>We reserve the right to modify these terms at any time. Continued use of our services means you accept the updated terms.</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3 text-pink-500">3. Contact Information</h3>
                  <div className="text-sm leading-relaxed text-gray-300 space-y-2">
                    <p>For support or legal inquiries:</p>
                    <p>📧 Email: <a href="mailto:enquiry@infocap.info" className="text-pink-500 hover:underline">enquiry@infocap.info</a></p>
                    <p>📞 Phone: <a href="tel:+919600898633" className="text-pink-500 hover:underline">+91 9600 898 633</a></p>
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
