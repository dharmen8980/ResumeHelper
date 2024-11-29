import { NextRequest, NextResponse } from 'next/server'
import { generateResume } from '@/app/actions/generate-resume'

export async function POST(request: NextRequest) {
  try {
    const resumeData = await request.json()
    
    const buffer = await generateResume(resumeData)
    
    // Create headers for file download
    const headers = new Headers()
    headers.set('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document')
    headers.set('Content-Disposition', 'attachment; filename="Resume.docx"')
    
    return new NextResponse(buffer, {
      status: 200,
      headers,
    })
  } catch (error) {
    console.error('Error in resume generation:', error)
    return NextResponse.json(
      { error: 'Failed to generate resume' },
      { status: 500 }
    )
  }
}

