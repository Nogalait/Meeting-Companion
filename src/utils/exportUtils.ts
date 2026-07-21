import { Meeting } from "../types";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { format } from "date-fns";
import { extractResources } from "./markdownUtils";

export function generateMarkdown(meeting: Meeting): string {
  const dateStr = format(meeting.createdAt, "MMMM do, yyyy - HH:mm");
  
  let md = `# ${meeting.title || "Untitled Meeting"}\n`;
  md += `**Meeting ID**: ${meeting.id}\n`;
  md += `**Date**: ${dateStr}\n\n`;
  
  md += `## Agenda\n`;
  md += `${meeting.agenda || "No agenda notes."}\n\n`;
  
  const resources = extractResources(meeting.agenda);
  if (resources.length > 0) {
    md += `## Resources Library\n`;
    resources.forEach(res => {
      const displayUrl = res.url.startsWith('data:') ? 'Pasted Image Data' : res.url;
      md += `- **${res.title}** (${res.type}): ${displayUrl}\n`;
    });
    md += `\n`;
  }
  
  md += `## Actions\n`;
  if (meeting.actions.length === 0) {
    md += `No actions recorded.\n`;
  } else {
    meeting.actions.forEach(action => {
      md += `- [${action.completed ? 'x' : ' '}] **${action.action}** | Assigned to: ${action.driver} | Due: ${action.timeline}\n`;
    });
  }
  
  return md;
}


export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error("Failed to copy", err);
    return false;
  }
}

export async function exportToPDF(elementId: string, meetingTitle: string) {
  const element = document.getElementById(elementId);
  if (!element) return;
  
  try {
    const canvas = await html2canvas(element, { 
      scale: 2,
      useCORS: true,
      logging: false
    });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    
    const pdfWidth = pdf.internal.pageSize.getWidth();
    // A4 height is 297mm. If canvas height is longer, it will scale down to fit width. 
    // For a simple single page or scaled approach:
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    
    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save(`${meetingTitle || "Meeting"}.pdf`);
  } catch (err) {
    console.error("Failed to generate PDF", err);
  }
}
