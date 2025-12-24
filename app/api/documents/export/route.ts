import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

export async function POST(request: NextRequest) {
    try {
          const { documentId, format } = await request.json();

      // Verify user is authenticated
      const authHeader = request.headers.get('authorization');
          if (!authHeader) {
                  return NextResponse.json(
                    { error: 'Unauthorized' },
                    { status: 401 }
                          );
          }

      // Fetch document from database
      const { data: document, error: docError } = await supabase
            .from('scope_documents')
            .select('*')
            .eq('id', documentId)
            .single();

      if (docError || !document) {
              return NextResponse.json(
                { error: 'Document not found' },
                { status: 404 }
                      );
      }

      // Generate export based on format
      let fileContent: Buffer;
          let contentType: string;
          let filename: string;

      if (format === 'pdf') {
              // Generate PDF
            const pdf = new jsPDF({
                      orientation: 'portrait',
                      unit: 'mm',
                      format: 'a4'
            });

            // Add title
            pdf.setFontSize(16);
              pdf.text(document.title, 20, 20);

            // Add content (sections)
            let yPosition = 35;
              if (document.sections) {
                        pdf.setFontSize(11);
                        Object.entries(document.sections as Record<string, string>).forEach(
                                    ([section, content]) => {
                                                  if (yPosition > 270) {
                                                                  pdf.addPage();
                                                                  yPosition = 20;
                                                  }
                                                  pdf.setFontSize(12);
                                                  pdf.text(section, 20, yPosition);
                                                  yPosition += 10;

                                      pdf.setFontSize(10);
                                                  const lines = pdf.splitTextToSize(
                                                                  content as string,
                                                                  170
                                                                );
                                                  pdf.text(lines, 20, yPosition);
                                                  yPosition += lines.length * 5 + 10;
                                    }
                                  );
              }

            fileContent = Buffer.from(pdf.output('arraybuffer'));
              contentType = 'application/pdf';
              filename = `${document.title.replace(/\s+/g, '_')}.pdf`;
      } else if (format === 'docx') {
              // Export as Word document (basic implementation)
            const docContent = `
            ${document.title}

            ${
                document.sections
                  ? Object.entries(document.sections as Record<string, string>)
                      .map(([section, content]) => `${section}\n${content}`)
                      .join('\n\n')
                  : ''
            }

            Generated: ${new Date().toISOString()}
            `;

            fileContent = Buffer.from(docContent, 'utf-8');
              contentType =
                        'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
              filename = `${document.title.replace(/\s+/g, '_')}.docx`;
      } else if (format === 'json') {
              // Export as JSON
            fileContent = Buffer.from(JSON.stringify(document, null, 2), 'utf-8');
              contentType = 'application/json';
              filename = `${document.title.replace(/\s+/g, '_')}.json`;
      } else {
              return NextResponse.json(
                { error: 'Unsupported export format' },
                { status: 400 }
                      );
      }

      // Log export activity
      await supabase.from('email_logs').insert({
              user_id: request.headers.get('x-user-id'),
              recipient_email: request.headers.get('x-user-email'),
              subject: `Document exported: ${document.title}`,
              template_type: 'document_export',
              sent_at: new Date().toISOString(),
              metadata: {
                        document_id: documentId,
                        format: format,
                        filename: filename
              }
      });

      // Return file as download
      return new NextResponse(fileContent, {
              status: 200,
              headers: {
                        'Content-Type': contentType,
                        'Content-Disposition': `attachment; filename="${filename}"`,
                        'Content-Length': fileContent.length.toString()
              }
      });
    } catch (error) {
          console.error('Document export error:', error);
          return NextResponse.json(
            { error: 'Failed to export document' },
            { status: 500 }
                );
    }
}
