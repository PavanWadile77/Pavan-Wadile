export default function TermsPage() {
  return (
    <div className="container mx-auto py-20 px-6 mt-16 min-h-screen">
      <div className="max-w-3xl mx-auto prose dark:prose-invert">
        <h1 className="text-4xl font-bold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">Terms of Service</h1>
        
        <div className="space-y-6 text-foreground/80 leading-relaxed">
          <p>Last updated: June 2026</p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">1. Acceptance of Terms</h2>
          <p>
            By accessing and using this website, you accept and agree to be bound by the terms and provision of this agreement.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">2. Intellectual Property</h2>
          <p>
            The website and its original content, features, and functionality are owned by Pavan Kishor Wadile 
            and are protected by international copyright, trademark, patent, trade secret, and other intellectual 
            property or proprietary rights laws.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">3. Disclaimer</h2>
          <p>
            The materials on this website are provided on an &apos;as is&apos; basis. We make no warranties, expressed or implied, 
            and hereby disclaim and negate all other warranties including, without limitation, implied warranties or 
            conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property.
          </p>
        </div>
      </div>
    </div>
  );
}
