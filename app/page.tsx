import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Zap, Layout, Users } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-primary to-primary-foreground text-white py-20">
        <div className="container max-w-6xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-6">Create Your Perfect Resume</h1>
          <p className="text-xl mb-8">Stand out from the crowd with a professionally designed resume in minutes.</p>
          <Link href="/create-resume">
            <Button size="lg" className="bg-white text-primary hover:bg-gray-100">
              Get Started
            </Button>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose Our Resume Generator?</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <FileText className="h-10 w-10 mb-4" />,
                title: "Professional Templates",
                description: "Choose from a variety of ATS-friendly designs",
              },
              {
                icon: <Zap className="h-10 w-10 mb-4" />,
                title: "Quick and Easy",
                description: "Create your resume in just a few minutes",
              },
              {
                icon: <Layout className="h-10 w-10 mb-4" />,
                title: "Customizable",
                description: "Tailor your resume to fit your needs",
              },
              {
                icon: <Users className="h-10 w-10 mb-4" />,
                title: "ATS Optimized",
                description: "Ensure your resume gets past applicant tracking systems",
              },
            ].map((feature, index) => (
              <Card key={index} className="text-center">
                <CardContent className="pt-6">
                  <div className="flex justify-center">{feature.icon}</div>
                  <CardTitle className="mb-2">{feature.title}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-gray-100 py-20">
        <div className="container max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "1",
                title: "Fill in your details",
                description: "Enter your personal information, work experience, education, and skills.",
              },
              {
                step: "2",
                title: "Choose your template",
                description: "Select from our professionally designed templates to suit your style.",
              },
              {
                step: "3",
                title: "Download and apply",
                description: "Generate your polished resume and start applying for jobs with confidence.",
              },
            ].map((item, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center text-xl font-bold mb-4">
                    {item.step}
                  </div>
                  <CardTitle>{item.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20">
        <div className="container max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">What Our Users Say</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "John Doe",
                role: "Software Engineer",
                quote: "This resume generator helped me land my dream job. It's so easy to use and the results look amazing!",
              },
              {
                name: "Jane Smith",
                role: "Marketing Manager",
                quote: "I was amazed at how quickly I could create a professional-looking resume. Highly recommended!",
              },
              {
                name: "Alex Johnson",
                role: "Recent Graduate",
                quote:
                  "As a new grad, I was struggling with my resume. This tool made the process so much easier and less stressful.",
              },
            ].map((testimonial, index) => (
              <Card key={index}>
                <CardContent className="pt-6">
                  <p className="italic mb-4">{testimonial.quote}</p>
                  <p className="font-semibold">{testimonial.name}</p>
                  <p className="text-sm text-gray-500">{testimonial.role}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="bg-primary text-white py-20">
        <div className="container max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Create Your Perfect Resume?</h2>
          <p className="text-xl mb-8">
            Join thousands of job seekers who have successfully landed their dream jobs using our resume generator.
          </p>
          <Link href="/create-resume">
            <Button size="lg" variant="secondary">
              Get Started Now
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
