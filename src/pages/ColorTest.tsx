
import React, { useState } from 'react';
import Header from '@/components/Header';
import { Footer } from '@/components/Footer';
import { BottomNav } from '@/components/BottomNav';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const ColorTest = () => {
  const [activeTab, setActiveTab] = useState('current');

  return (
    <div className="min-h-screen bg-appBg text-textPrimary">
      <Header />
      <main className="container mx-auto px-4 pt-24 pb-16">
        <h1 className="text-3xl font-bold mb-8 gradient-text">Color Scheme Test Page</h1>
        
        <Tabs defaultValue="current" className="mb-10" onValueChange={setActiveTab}>
          <TabsList className="mb-6 bg-surfaceBg border border-white/10">
            <TabsTrigger value="current">Current Theme</TabsTrigger>
            <TabsTrigger value="charcoal">Charcoal & Cyan</TabsTrigger>
            <TabsTrigger value="modern">Modern Dark</TabsTrigger>
            <TabsTrigger value="professional">Light Professional</TabsTrigger>
            <TabsTrigger value="gradient">Gradient Modern</TabsTrigger>
          </TabsList>
          
          {/* Current Theme */}
          <TabsContent value="current">
            <section className="mb-10">
              <h2 className="text-2xl font-semibold mb-4">Background Colors</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="p-6 rounded-lg bg-appBg border border-white/10">
                  <h3 className="font-medium mb-2">Primary Background</h3>
                  <p className="text-textSecondary">#1A1B1F</p>
                </div>
                <div className="p-6 rounded-lg bg-surfaceBg border border-white/10">
                  <h3 className="font-medium mb-2">Surface Background</h3>
                  <p className="text-textSecondary">#2B2D33</p>
                </div>
              </div>
              
              <h2 className="text-2xl font-semibold mb-4">Accent Colors</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="p-6 rounded-lg bg-surfaceBg border border-accentPink/30">
                  <h3 className="font-medium mb-2 text-accentPink">Accent Pink</h3>
                  <p className="text-textSecondary">#E91E63</p>
                </div>
                <div className="p-6 rounded-lg bg-surfaceBg border border-accentPurple/30">
                  <h3 className="font-medium mb-2 text-accentPurple">Accent Purple</h3>
                  <p className="text-textSecondary">#9C27B0</p>
                </div>
              </div>
              
              <h2 className="text-2xl font-semibold mb-4">Text Colors</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="p-6 rounded-lg bg-surfaceBg border border-white/10">
                  <h3 className="font-medium mb-2 text-textPrimary">Primary Text</h3>
                  <p className="text-textSecondary">#FFFFFF</p>
                </div>
                <div className="p-6 rounded-lg bg-surfaceBg border border-white/10">
                  <h3 className="font-medium mb-2">Secondary Text</h3>
                  <p className="text-textSecondary">#B0B0B0</p>
                </div>
              </div>
              
              <h2 className="text-2xl font-semibold mb-4">Status Colors</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="p-6 rounded-lg bg-surfaceBg border border-success/30">
                  <h3 className="font-medium mb-2 text-success">Success</h3>
                  <p className="text-textSecondary">#00C853</p>
                </div>
                <div className="p-6 rounded-lg bg-surfaceBg border border-danger/30">
                  <h3 className="font-medium mb-2 text-danger">Danger</h3>
                  <p className="text-textSecondary">#FF5252</p>
                </div>
              </div>
              
              <h2 className="text-2xl font-semibold mb-4">UI Components</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <Card className="bg-surfaceBg border-white/10">
                  <CardHeader>
                    <CardTitle className="text-textPrimary">Card Component</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-textSecondary mb-4">This is a card with the current theme styling.</p>
                    <Button className="gradient-button">Gradient Button</Button>
                  </CardContent>
                </Card>
                
                <div className="premium-card p-6">
                  <h3 className="text-xl font-bold mb-2 gradient-text">Premium Card</h3>
                  <p className="text-textSecondary mb-4">This is a premium card with gradient styling.</p>
                  <Button className="gradient-button-subtle">Subtle Button</Button>
                </div>
              </div>
              
              <div className="glass-card p-6 mb-6">
                <h3 className="text-xl font-bold mb-2">Glass Card</h3>
                <p className="text-textSecondary mb-4">Card with glassmorphism effect.</p>
                <Button variant="outline" className="border-white/20 hover:bg-white/10">Glass Button</Button>
              </div>
            </section>
          </TabsContent>

          {/* Charcoal & Cyan Theme */}
          <TabsContent value="charcoal">
            <section className="mb-10">
              <h2 className="text-2xl font-semibold mb-4 cyan-gradient-text">Charcoal & Cyan Theme</h2>
              
              <h3 className="text-xl font-semibold mb-4">Background Colors</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="p-6 rounded-lg bg-charcoalPrimary border border-white/10">
                  <h3 className="font-medium mb-2">Primary Background</h3>
                  <p className="text-charcoalTextSecondary">#121212</p>
                </div>
                <div className="p-6 rounded-lg bg-charcoalSecondary border border-white/10">
                  <h3 className="font-medium mb-2">Secondary Background</h3>
                  <p className="text-charcoalTextSecondary">#1F1F1F</p>
                </div>
              </div>
              
              <h3 className="text-xl font-semibold mb-4">Accent Colors</h3>
              <div className="p-6 rounded-lg bg-charcoalSecondary border border-cyan/30 mb-6">
                <h3 className="font-medium mb-2 text-cyan">Accent (Cyan)</h3>
                <p className="text-charcoalTextSecondary">#00BCD4</p>
              </div>
              
              <h3 className="text-xl font-semibold mb-4">Text Colors</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="p-6 rounded-lg bg-charcoalSecondary border border-white/10">
                  <h3 className="font-medium mb-2 text-charcoalTextPrimary">Primary Text</h3>
                  <p className="text-charcoalTextSecondary">#FFFFFF</p>
                </div>
                <div className="p-6 rounded-lg bg-charcoalSecondary border border-white/10">
                  <h3 className="font-medium mb-2">Secondary Text</h3>
                  <p className="text-charcoalTextSecondary">#B0B0B0</p>
                </div>
              </div>
              
              <h3 className="text-xl font-semibold mb-4">Status Colors</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="p-6 rounded-lg bg-charcoalSecondary border border-charcoalSuccess/30">
                  <h3 className="font-medium mb-2 text-charcoalSuccess">Success</h3>
                  <p className="text-charcoalTextSecondary">#4CAF50</p>
                </div>
                <div className="p-6 rounded-lg bg-charcoalSecondary border border-charcoalDanger/30">
                  <h3 className="font-medium mb-2 text-charcoalDanger">Danger</h3>
                  <p className="text-charcoalTextSecondary">#F44336</p>
                </div>
              </div>
              
              <h3 className="text-xl font-semibold mb-4">UI Components</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="charcoal-card p-6">
                  <h3 className="text-xl font-bold mb-2">Basic Card</h3>
                  <p className="text-charcoalTextSecondary mb-4">A simple card with the Charcoal theme.</p>
                  <Button className="bg-cyan text-black hover:bg-cyan/90">Cyan Button</Button>
                </div>
                
                <div className="bg-charcoalSecondary border border-cyan/20 rounded-xl p-6 cyan-glow">
                  <h3 className="text-xl font-bold mb-2 cyan-gradient-text">Glow Card</h3>
                  <p className="text-charcoalTextSecondary mb-4">Card with cyan glow effect.</p>
                  <Button className="cyan-gradient-button">Gradient Button</Button>
                </div>
              </div>
              
              <div className="charcoal-glass p-6 rounded-xl mb-6">
                <h3 className="text-xl font-bold mb-2">Glass Card</h3>
                <p className="text-charcoalTextSecondary mb-4">Card with glassmorphism effect.</p>
                <Button variant="outline" className="cyan-outline">Outline Button</Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <Button className="bg-cyan text-black hover:bg-cyan/90">Primary Button</Button>
                <Button variant="outline" className="cyan-outline">Outline Button</Button>
                <Button className="bg-charcoalSecondary border border-white/10 hover:bg-charcoalSecondary/80">Secondary Button</Button>
              </div>
            </section>
          </TabsContent>
          
          {/* Modern Dark Theme */}
          <TabsContent value="modern">
            <div className="bg-slate-900 rounded-xl p-6">
              <h2 className="text-white text-2xl font-semibold mb-6">Modern Dark Theme</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-slate-800 p-4 rounded-lg">
                  <p className="text-white mb-2">Sample Card</p>
                  <p className="text-slate-400 text-sm">Secondary text example</p>
                </div>
                <div className="bg-slate-800 p-4 rounded-lg">
                  <Button className="w-full bg-blue-500 text-white">Primary Button</Button>
                </div>
                <div className="bg-slate-800 p-4 rounded-lg">
                  <div className="bg-emerald-400/10 text-emerald-400 p-2 rounded-md text-sm">Success State</div>
                </div>
              </div>
              
              <div className="bg-slate-800 p-6 rounded-lg">
                <h3 className="text-white text-xl mb-4">Component Preview</h3>
                <div className="flex flex-col space-y-4">
                  <div className="flex space-x-3">
                    <div className="w-8 h-8 rounded-full bg-blue-500"></div>
                    <div className="w-8 h-8 rounded-full bg-emerald-400"></div>
                    <div className="w-8 h-8 rounded-full bg-purple-500"></div>
                  </div>
                  <div className="h-2 w-full bg-slate-700 rounded-full overflow-hidden">
                    <div className="h-full w-3/4 bg-blue-500 rounded-full"></div>
                  </div>
                  <Button className="bg-blue-500 hover:bg-blue-600">Action Button</Button>
                </div>
              </div>
            </div>
          </TabsContent>
          
          {/* Light Professional Theme */}
          <TabsContent value="professional">
            <div className="bg-white rounded-xl p-6 text-slate-900">
              <h2 className="text-slate-900 text-2xl font-semibold mb-6">Light Professional Theme</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                  <p className="text-slate-900 mb-2">Sample Card</p>
                  <p className="text-slate-500 text-sm">Secondary text example</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                  <Button className="w-full bg-indigo-600 text-white">Primary Button</Button>
                </div>
                <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                  <div className="bg-orange-500/10 text-orange-500 p-2 rounded-md text-sm">Alert State</div>
                </div>
              </div>
              
              <div className="bg-slate-50 p-6 rounded-lg border border-slate-200">
                <h3 className="text-slate-900 text-xl mb-4">Component Preview</h3>
                <div className="flex flex-col space-y-4">
                  <div className="flex space-x-3">
                    <div className="w-8 h-8 rounded-full bg-indigo-600"></div>
                    <div className="w-8 h-8 rounded-full bg-orange-500"></div>
                    <div className="w-8 h-8 rounded-full bg-emerald-500"></div>
                  </div>
                  <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                    <div className="h-full w-3/4 bg-indigo-600 rounded-full"></div>
                  </div>
                  <Button className="bg-indigo-600 hover:bg-indigo-700">Action Button</Button>
                </div>
              </div>
            </div>
          </TabsContent>
          
          {/* Gradient Modern Theme */}
          <TabsContent value="gradient">
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl p-6">
              <h2 className="text-white text-2xl font-semibold mb-6">Gradient Modern Theme</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg border border-white/20">
                  <p className="text-white mb-2">Sample Card</p>
                  <p className="text-white/70 text-sm">Secondary text example</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg border border-white/20">
                  <Button className="w-full bg-slate-900 text-white">Primary Button</Button>
                </div>
                <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg border border-white/20">
                  <div className="bg-teal-400/20 text-teal-300 p-2 rounded-md text-sm">Info State</div>
                </div>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg border border-white/20">
                <h3 className="text-white text-xl mb-4">Component Preview</h3>
                <div className="flex flex-col space-y-4">
                  <div className="flex space-x-3">
                    <div className="w-8 h-8 rounded-full bg-white"></div>
                    <div className="w-8 h-8 rounded-full bg-teal-400"></div>
                    <div className="w-8 h-8 rounded-full bg-slate-900"></div>
                  </div>
                  <div className="h-2 w-full bg-white/20 rounded-full overflow-hidden">
                    <div className="h-full w-3/4 bg-white rounded-full"></div>
                  </div>
                  <Button className="bg-slate-900 hover:bg-slate-800">Action Button</Button>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
        
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">Theme Feedback</h2>
          <Card className="glass-card">
            <CardContent className="pt-6">
              <h3 className="text-lg font-medium mb-4">Which theme do you prefer?</h3>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
                <Button variant="outline" className={`border-white/20 ${activeTab === 'current' ? 'bg-accentPink/20 border-accentPink/50' : 'hover:bg-white/10'}`}>
                  Current Theme
                </Button>
                <Button variant="outline" className={`border-white/20 ${activeTab === 'charcoal' ? 'bg-cyan/20 border-cyan/50' : 'hover:bg-white/10'}`}>
                  Charcoal & Cyan
                </Button>
                <Button variant="outline" className={`border-white/20 ${activeTab === 'modern' ? 'bg-accentPink/20 border-accentPink/50' : 'hover:bg-white/10'}`}>
                  Modern Dark
                </Button>
                <Button variant="outline" className={`border-white/20 ${activeTab === 'professional' ? 'bg-accentPink/20 border-accentPink/50' : 'hover:bg-white/10'}`}>
                  Light Professional
                </Button>
                <Button variant="outline" className={`border-white/20 ${activeTab === 'gradient' ? 'bg-accentPink/20 border-accentPink/50' : 'hover:bg-white/10'}`}>
                  Gradient Modern
                </Button>
              </div>
              
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-3">Additional Comments</h3>
                <textarea 
                  className="w-full p-3 rounded-lg bg-black/20 border border-white/10 text-textPrimary text-sm focus:outline-none focus:ring-2 focus:ring-accentPink/50" 
                  rows={4} 
                  placeholder="Share your thoughts on these color schemes..."
                ></textarea>
              </div>
              
              <Button className="gradient-button w-full">Submit Feedback</Button>
            </CardContent>
          </Card>
        </section>
      </main>
      <Footer />
      <BottomNav />
    </div>
  );
};

export default ColorTest;
