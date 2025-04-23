import Link from "next/link"
import { ArrowRight, FileText, BarChart3, Database, FolderTree, FileSearch, Shield } from "lucide-react"
import FeatureCard from "@/components/feature-card"
import DataVisual from "@/components/data-visual"
import HeroSignup from "@/components/hero-signup"

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Header */}
      <header className="border-b border-gray-200 sticky top-0 z-50 bg-white/90 backdrop-blur-md shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-4">
            <div className="text-2xl font-bold">
              <span className="text-gray-900">Alpha</span>
              <span className="text-[#fb5028]">Tensor</span>
            </div>

            <nav className="hidden md:flex items-center gap-6">
              <Link href="#features" className="text-gray-600 hover:text-gray-900 transition-colors">
                Features
              </Link>
              <Link href="#how-it-works" className="text-gray-600 hover:text-gray-900 transition-colors">
                How It Works
              </Link>
              <Link href="#signup" className="text-gray-600 hover:text-gray-900 transition-colors">
                Contact
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-10">
          <DataVisual />
        </div>
        <div className="container mx-auto px-4 py-16 md:py-24 relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-block px-3 py-1 mb-6 border border-[#fb5028] rounded-full">
                <span className="text-[#fb5028] text-sm font-mono">BETA RELEASE</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 tracking-tight">
                <span className="text-gray-900">Financial statements,</span>
                <span className="text-[#fb5028]"> automated.</span>
              </h1>
              <p className="text-gray-600 text-lg mb-8">
                Our AI-powered platform processes, integrates, and extracts data from financial statements,
                automatically categorizing information into accounting buckets.
              </p>
              <div className="flex flex-wrap gap-4 mb-8">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-[#fb5028] flex items-center justify-center">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M5 12L10 17L20 7"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <span className="text-gray-700">Document parsing</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-[#fb5028] flex items-center justify-center">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M5 12L10 17L20 7"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <span className="text-gray-700">Data extraction</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-[#fb5028] flex items-center justify-center">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M5 12L10 17L20 7"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <span className="text-gray-700">Automated categorization</span>
                </div>
              </div>
            </div>

            <div>
              <HeroSignup />
            </div>
          </div>

          <div className="mt-16 relative">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-[#fb5028]/30 to-purple-500/30 rounded-lg blur opacity-30"></div>
            <div className="relative bg-white/80 backdrop-blur-sm border border-gray-200 p-1 rounded-lg overflow-hidden shadow-lg">
              <div className="h-[300px] md:h-[400px] w-full bg-gray-50 rounded-lg relative overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-full h-full bg-[url('/placeholder.svg?height=800&width=1200')] bg-cover bg-center opacity-40"></div>
                  <div className="absolute inset-0 bg-gradient-to-t from-white via-white/50 to-transparent"></div>
                  <div className="absolute bottom-8 left-8 right-8">
                    <div className="text-[#fb5028] font-mono text-sm mb-2">// SYSTEM.PARSE(financial_statement)</div>
                    <div className="text-2xl font-bold mb-2">Intelligent Document Processing</div>
                    <div className="text-gray-600">
                      Automatically extract and categorize financial data from any document format
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="container mx-auto px-4 py-24 bg-gray-50">
        <div className="max-w-4xl mx-auto mb-16 text-center">
          <h2 className="text-4xl font-bold mb-6">Financial Statement Processing</h2>
          <p className="text-gray-600 text-lg">
            Our platform uses AI to automate the entire financial statement workflow, from document upload to
            categorized data.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <FeatureCard
            icon={<FileText className="text-[#fb5028]" size={24} />}
            title="Document Processing"
            description="Upload financial statements in any format (PDF, images, Excel) and our AI extracts the data automatically."
          />
          <FeatureCard
            icon={<FileSearch className="text-[#fb5028]" size={24} />}
            title="Data Extraction"
            description="Our AI identifies and extracts key financial data points with high accuracy, even from unstructured documents."
          />
          <FeatureCard
            icon={<FolderTree className="text-[#fb5028]" size={24} />}
            title="Automated Categorization"
            description="Financial data is automatically categorized into accounting buckets based on industry standards."
          />
          <FeatureCard
            icon={<Database className="text-[#fb5028]" size={24} />}
            title="Centralized Storage"
            description="Store all your financial documents and extracted data in one secure, searchable repository."
          />
          <FeatureCard
            icon={<BarChart3 className="text-[#fb5028]" size={24} />}
            title="Financial Insights"
            description="Generate reports and visualizations from your processed financial data for better decision-making."
          />
          <FeatureCard
            icon={<Shield className="text-[#fb5028]" size={24} />}
            title="Enterprise Security"
            description="Bank-level encryption and security protocols protect your sensitive financial information."
          />
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="bg-white py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto mb-16 text-center">
            <h2 className="text-4xl font-bold mb-6">How It Works</h2>
            <p className="text-gray-600 text-lg">
              Our platform simplifies financial statement processing in three easy steps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-white shadow-md border border-gray-200 p-8 rounded-lg relative">
              <div className="text-[#fb5028] font-mono mb-4">01</div>
              <h3 className="text-xl font-bold mb-3">Upload Documents</h3>
              <p className="text-gray-600">
                Upload financial statements in any format through our intuitive interface.
              </p>
            </div>
            <div className="bg-white shadow-md border border-gray-200 p-8 rounded-lg relative">
              <div className="text-[#fb5028] font-mono mb-4">02</div>
              <h3 className="text-xl font-bold mb-3">AI Processing</h3>
              <p className="text-gray-600">Our AI extracts and categorizes financial data with high accuracy.</p>
            </div>
            <div className="bg-white shadow-md border border-gray-200 p-8 rounded-lg relative">
              <div className="text-[#fb5028] font-mono mb-4">03</div>
              <h3 className="text-xl font-bold mb-3">Review & Export</h3>
              <p className="text-gray-600">Review categorized data and export to your accounting system.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="container mx-auto px-4 py-24 bg-gray-50">
        <div className="max-w-4xl mx-auto mb-16 text-center">
          <h2 className="text-4xl font-bold mb-6">Use Cases</h2>
          <p className="text-gray-600 text-lg">
            See how AlphaTensor transforms financial document processing across different scenarios.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          <div className="bg-white shadow-md border border-gray-200 p-8 rounded-lg">
            <h3 className="text-xl font-bold mb-4">Accounting Firms</h3>
            <p className="text-gray-600 mb-4">
              Automate the processing of client financial statements, reducing manual data entry by up to 90% and
              improving accuracy.
            </p>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <div className="text-[#fb5028] mt-1">•</div>
                <span className="text-gray-600">Process hundreds of statements in minutes, not hours</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="text-[#fb5028] mt-1">•</div>
                <span className="text-gray-600">Standardize data across different client formats</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="text-[#fb5028] mt-1">•</div>
                <span className="text-gray-600">Integrate with existing accounting software</span>
              </li>
            </ul>
          </div>

          <div className="bg-white shadow-md border border-gray-200 p-8 rounded-lg">
            <h3 className="text-xl font-bold mb-4">Financial Departments</h3>
            <p className="text-gray-600 mb-4">
              Streamline month-end closing by automatically processing and categorizing invoices, receipts, and
              statements.
            </p>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <div className="text-[#fb5028] mt-1">•</div>
                <span className="text-gray-600">Reduce manual data entry and human error</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="text-[#fb5028] mt-1">•</div>
                <span className="text-gray-600">Accelerate financial reporting cycles</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="text-[#fb5028] mt-1">•</div>
                <span className="text-gray-600">Maintain audit trails and document history</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="signup" className="container mx-auto px-4 py-24 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white shadow-lg border border-gray-200 rounded-xl p-8 md:p-12 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-1/2 h-full opacity-10">
              <DataVisual />
            </div>

            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Ready to transform your financial document processing?
              </h2>
              <p className="text-gray-600 text-lg mb-8 max-w-2xl">
                Join our alpha program or schedule a demo to see how AlphaTensor can automate your financial statement
                workflow.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="#features"
                  className="bg-[#fb5028] hover:bg-[#e04520] text-white font-medium px-8 py-3 rounded-md flex items-center justify-center gap-2 transition-all"
                >
                  Request Alpha Access <ArrowRight size={18} />
                </Link>
                <Link
                  href="#how-it-works"
                  className="border border-gray-300 hover:border-[#fb5028] text-gray-900 px-8 py-3 rounded-md flex items-center justify-center transition-all"
                >
                  Schedule Demo
                </Link>
              </div>

              <div className="mt-8 flex items-center gap-2 text-gray-500 text-sm">
                <Shield size={16} />
                <span>Your information is secure and will never be shared.</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <div className="text-2xl font-bold">
                <span className="text-gray-900">Alpha</span>
                <span className="text-[#fb5028]">Tensor</span>
              </div>
              <div className="text-gray-500 mt-2">© 2025 AlphaTensor. All rights reserved.</div>
            </div>
            <div className="flex gap-8">
              <Link href="#" className="text-gray-600 hover:text-[#fb5028] transition-colors">
                Privacy
              </Link>
              <Link href="#" className="text-gray-600 hover:text-[#fb5028] transition-colors">
                Terms
              </Link>
              <Link href="#" className="text-gray-600 hover:text-[#fb5028] transition-colors">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
