import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-10 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center">
          <div className="mr-4 hidden md:flex">
            <Link href="/" className="mr-6 flex items-center space-x-2">
              <span className="hidden font-bold sm:inline-block">ImageOptimizer</span>
            </Link>
            <nav className="flex items-center space-x-6 text-sm font-medium">
              <Link href="/" className="transition-colors hover:text-foreground/80">
                Home
              </Link>
              <Link href="#features" className="transition-colors hover:text-foreground/80">
                Features
              </Link>
              <Link href="#pricing" className="transition-colors hover:text-foreground/80">
                Pricing
              </Link>
              <Link href="#faq" className="transition-colors hover:text-foreground/80">
                FAQ
              </Link>
            </nav>
          </div>
          <div className="flex flex-1 items-center justify-end space-x-4">
            <nav className="flex items-center space-x-2">
              <Button asChild variant="default">
                <Link href="/optimize">
                  Start Optimizing <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </nav>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                    Optimize Your Images in Bulk
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    Automatically optimize and convert your images to WebP format for faster website loading times and
                    better user experience.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button asChild size="lg">
                    <Link href="/optimize">
                      Start Optimizing <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="lg">
                    <Link href="#features">Learn More</Link>
                  </Button>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <div className="relative h-[450px] w-full overflow-hidden rounded-xl bg-muted">
                  <img
                    src="https://iili.io/3FrgH3Q.webp"
                    alt="Image optimization dashboard preview"
                    className="object-cover w-full h-full"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
        <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-muted">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Features</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Our image optimization tool provides everything you need to improve your website's performance.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3 lg:gap-12">
              <div className="grid gap-1">
                <h3 className="text-xl font-bold">Bulk Processing</h3>
                <p className="text-muted-foreground">
                  Upload and process multiple images at once, saving you time and effort.
                </p>
              </div>
              <div className="grid gap-1">
                <h3 className="text-xl font-bold">WebP Conversion</h3>
                <p className="text-muted-foreground">
                  Convert your images to WebP format for better compression and quality.
                </p>
              </div>
              <div className="grid gap-1">
                <h3 className="text-xl font-bold">Size Optimization</h3>
                <p className="text-muted-foreground">
                  Reduce file sizes without sacrificing quality for faster loading times.
                </p>
              </div>
              <div className="grid gap-1">
                <h3 className="text-xl font-bold">API Integration</h3>
                <p className="text-muted-foreground">
                  Connect with Cloudinary or TinyPNG for professional-grade optimization.
                </p>
              </div>
              <div className="grid gap-1">
                <h3 className="text-xl font-bold">Automation</h3>
                <p className="text-muted-foreground">
                  Set up workflows with Zapier to automatically optimize new images.
                </p>
              </div>
              <div className="grid gap-1">
                <h3 className="text-xl font-bold">Detailed Analytics</h3>
                <p className="text-muted-foreground">
                  See how much space you've saved and track optimization performance.
                </p>
              </div>
            </div>
          </div>
        </section>
        <section id="pricing" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Pricing</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Choose the plan that works best for your needs.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-start gap-6 py-12 lg:grid-cols-3 lg:gap-12">
              <div className="flex flex-col justify-between p-6 bg-background rounded-lg shadow-lg border">
                <div>
                  <h3 className="text-2xl font-bold">Free</h3>
                  <div className="mt-4 text-4xl font-bold">$0</div>
                  <p className="mt-2 text-muted-foreground">Perfect for occasional use</p>
                  <ul className="mt-6 space-y-2">
                    <li className="flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="mr-2 h-4 w-4 text-primary"
                      >
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                      Up to 20 images per day
                    </li>
                    <li className="flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="mr-2 h-4 w-4 text-primary"
                      >
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                      Basic optimization
                    </li>
                    <li className="flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="mr-2 h-4 w-4 text-primary"
                      >
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                      WebP conversion
                    </li>
                  </ul>
                </div>
                <Button className="mt-6" variant="outline">
                  Get Started
                </Button>
              </div>
              <div className="flex flex-col justify-between p-6 bg-primary text-primary-foreground rounded-lg shadow-lg relative">
                <div className="absolute -top-4 left-0 right-0 mx-auto w-fit px-4 py-1 bg-primary text-primary-foreground text-sm font-medium rounded-full">
                  Popular
                </div>
                <div>
                  <h3 className="text-2xl font-bold">Pro</h3>
                  <div className="mt-4 text-4xl font-bold">$19</div>
                  <p className="mt-2 opacity-90">Per month, billed annually</p>
                  <ul className="mt-6 space-y-2">
                    <li className="flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="mr-2 h-4 w-4"
                      >
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                      Unlimited images
                    </li>
                    <li className="flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="mr-2 h-4 w-4"
                      >
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                      Advanced optimization
                    </li>
                    <li className="flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="mr-2 h-4 w-4"
                      >
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                      API access
                    </li>
                    <li className="flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="mr-2 h-4 w-4"
                      >
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                      Zapier integration
                    </li>
                  </ul>
                </div>
                <Button className="mt-6" variant="secondary">
                  Get Started
                </Button>
              </div>
              <div className="flex flex-col justify-between p-6 bg-background rounded-lg shadow-lg border">
                <div>
                  <h3 className="text-2xl font-bold">Enterprise</h3>
                  <div className="mt-4 text-4xl font-bold">Custom</div>
                  <p className="mt-2 text-muted-foreground">For large organizations</p>
                  <ul className="mt-6 space-y-2">
                    <li className="flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="mr-2 h-4 w-4 text-primary"
                      >
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                      Everything in Pro
                    </li>
                    <li className="flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="mr-2 h-4 w-4 text-primary"
                      >
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                      Dedicated support
                    </li>
                    <li className="flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="mr-2 h-4 w-4 text-primary"
                      >
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                      Custom integrations
                    </li>
                    <li className="flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="mr-2 h-4 w-4 text-primary"
                      >
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                      SLA guarantees
                    </li>
                  </ul>
                </div>
                <Button className="mt-6" variant="outline">
                  Contact Sales
                </Button>
              </div>
            </div>
          </div>
        </section>
        <section id="faq" className="w-full py-12 md:py-24 lg:py-32 bg-muted">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Frequently Asked Questions</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Find answers to common questions about our image optimization tool.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl gap-6 py-12 lg:grid-cols-2 lg:gap-12">
              <div>
                <h3 className="text-xl font-bold">What image formats are supported?</h3>
                <p className="mt-2 text-muted-foreground">
                  We support JPEG, PNG, GIF, and SVG formats for input. All images can be converted to WebP format for
                  optimal web performance.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-bold">How much can I expect to reduce my image sizes?</h3>
                <p className="mt-2 text-muted-foreground">
                  On average, our users see a 50-70% reduction in file size when converting to WebP format with our
                  optimization settings.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-bold">Can I automate the optimization process?</h3>
                <p className="mt-2 text-muted-foreground">
                  Yes! Our Pro and Enterprise plans include Zapier integration, allowing you to set up automated
                  workflows for image optimization.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-bold">Is WebP supported in all browsers?</h3>
                <p className="mt-2 text-muted-foreground">
                  WebP is supported in all modern browsers. For older browsers, we provide fallback options to ensure
                  compatibility.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-bold">How do I integrate with my existing workflow?</h3>
                <p className="mt-2 text-muted-foreground">
                  We offer API access and integrations with popular platforms like Cloudinary and TinyPNG, making it
                  easy to incorporate into your existing workflow.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-bold">Can I maintain image quality while reducing file size?</h3>
                <p className="mt-2 text-muted-foreground">
                  Our advanced optimization algorithms ensure that image quality is preserved while significantly
                  reducing file size.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="w-full border-t py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            © 2025 ImageOptimizer - A product by BYTEFOLIO. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link href="#" className="text-sm text-muted-foreground underline underline-offset-4">
              Terms of Service
            </Link>
            <Link href="#" className="text-sm text-muted-foreground underline underline-offset-4">
              Privacy Policy
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

