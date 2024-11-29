import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import ResumeForm from "@/components/resume-form";

export default function CreateResumePage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">Create Your Resume</h1>
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Resume Details</CardTitle>
            <CardDescription>Fill in your information to generate a professional resume</CardDescription>
          </CardHeader>
          <CardContent>
            <ResumeForm />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
