export const exportProjectToMarkdown = (workspace, ragDocs, chatMessages) => {
    let content = `# Research Project: ${workspace.title}\n\n`;
    content += `## Overview\n${workspace.problem_statement}\n\n`;
    content += `**Status:** ${workspace.status}\n`;
    content += `**Team:** ${workspace.team_name}\n`;
    content += `**SDG Alignment:** ${Object.keys(workspace.sdg_mapping).join(', ')}\n\n`;
    
    content += `## Research Milestones\n`;
    (workspace.tasks || []).forEach(task => {
        content += `- [${task.status === 'DONE' ? 'x' : ' '}] **${task.title}**: ${task.description}\n`;
    });
    content += `\n`;
    
    content += `## Literature Repository\n`;
    (ragDocs || []).forEach(doc => {
        content += `- **${doc.filename}** (Indexed: ${doc.chunks_count} segments)\n`;
    });
    content += `\n`;
    
    content += `## Collaboration Log\n`;
    (chatMessages || []).slice(-10).forEach(msg => {
        content += `> **${msg.sender_name}**: ${msg.message}\n`;
    });
    content += `\n\n--- \n*Generated via SDGSync Strategic Research Hub*`;

    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${workspace.title.replace(/\s+/g, '_')}_Research_Summary.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
};
