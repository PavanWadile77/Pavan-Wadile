export default function PrivacyPolicyPage() {
  return (
    <div className="container mx-auto py-20 px-6 mt-16 min-h-screen">
      <div className="max-w-3xl mx-auto prose dark:prose-invert">
        <h1 className="text-4xl font-bold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">Privacy Policy</h1>
        
        <div className="space-y-6 text-foreground/80 leading-relaxed">
          <p>Last updated: June 2026</p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">1. Information We Collect</h2>
          <p>
            When you visit this portfolio website, we may collect certain information about your device, 
            including information about your web browser, IP address, time zone, and some of the cookies 
            that are installed on your device. Additionally, if you use the contact form, we collect the 
            name and email address you provide.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">2. How We Use Your Information</h2>
          <p>
            We use the information collected to:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Respond to your inquiries via the contact form.</li>
            <li>Improve and optimize the website (for example, by generating analytics about how visitors interact with the site).</li>
          </ul>

          <h2 className="text-2xl font-semibold mt-8 mb-4">3. Data Security</h2>
          <p>
            We implement appropriate security measures to protect against unauthorized access, 
            alteration, disclosure, or destruction of your personal information.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">4. Contact Us</h2>
          <p>
            For more information about our privacy practices, if you have questions, or if you would like to make a complaint, 
            please contact us by e-mail using the contact form on this website.
          </p>
        </div>
      </div>
    </div>
  );
}
