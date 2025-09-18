import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { 
  UploadSimple, 
  File, 
  Trash, 
  FileCode, 
  FileText,
  FileCss,
  FileHtml,
  FileJs
} from '@phosphor-icons/react';
import { ProjectFile } from '@/lib/types';

interface ProjectFilesSidebarProps {
  files: ProjectFile[];
  onFilesChange: (files: ProjectFile[]) => void;
}

export function ProjectFilesSidebar({ files, onFilesChange }: ProjectFilesSidebarProps) {
  const [dragOver, setDragOver] = useState(false);

  const getFileIcon = (fileName: string) => {
    const ext = fileName.split('.').pop()?.toLowerCase();
    switch (ext) {
      case 'js':
      case 'jsx':
      case 'ts':
      case 'tsx':
        return <FileJs size={16} className="text-yellow-400" />;
      case 'css':
      case 'scss':
      case 'less':
        return <FileCss size={16} className="text-blue-400" />;
      case 'html':
      case 'htm':
        return <FileHtml size={16} className="text-orange-400" />;
      case 'json':
      case 'xml':
      case 'yaml':
      case 'yml':
        return <FileCode size={16} className="text-green-400" />;
      default:
        return <FileText size={16} className="text-gray-400" />;
    }
  };

  const formatFileSize = (size: number) => {
    if (size < 1024) return `${size}B`;
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)}KB`;
    return `${(size / (1024 * 1024)).toFixed(1)}MB`;
  };

  const handleFileUpload = (fileList: FileList) => {
    const newFiles: ProjectFile[] = [];
    
    Array.from(fileList).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        const projectFile: ProjectFile = {
          id: `${Date.now()}-${Math.random()}`,
          name: file.name,
          content,
          type: file.type || 'text/plain',
          size: file.size,
          lastModified: new Date(file.lastModified),
        };
        newFiles.push(projectFile);
        
        if (newFiles.length === fileList.length) {
          onFilesChange([...files, ...newFiles]);
        }
      };
      reader.readAsText(file);
    });
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    const droppedFiles = e.dataTransfer.files;
    if (droppedFiles.length > 0) {
      handleFileUpload(droppedFiles);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (selectedFiles) {
      handleFileUpload(selectedFiles);
    }
    e.target.value = '';
  };

  const removeFile = (fileId: string) => {
    onFilesChange(files.filter(f => f.id !== fileId));
  };

  return (
    <div className="w-80 border-r bg-card flex flex-col">
      <div className="p-4 border-b">
        <h3 className="font-semibold text-sm">Project Files</h3>
        <p className="text-xs text-muted-foreground mt-1">
          Upload files to provide context to the AI
        </p>
      </div>

      <div
        className={`m-4 p-6 border-2 border-dashed rounded-lg transition-colors ${
          dragOver 
            ? 'border-accent bg-accent/10' 
            : 'border-border hover:border-accent/50'
        }`}
        onDrop={handleDrop}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
      >
        <div className="text-center">
          <UploadSimple size={24} className="mx-auto mb-2 text-muted-foreground" />
          <p className="text-sm text-muted-foreground mb-2">
            Drag files here or click to upload
          </p>
          <input
            type="file"
            multiple
            onChange={handleFileInput}
            className="hidden"
            id="file-upload"
            accept=".js,.jsx,.ts,.tsx,.css,.html,.json,.md,.txt,.py,.java,.cpp,.c,.h"
          />
          <Button
            variant="outline"
            size="sm"
            onClick={() => document.getElementById('file-upload')?.click()}
          >
            Choose Files
          </Button>
        </div>
      </div>

      <ScrollArea className="flex-1 px-4">
        <div className="space-y-2 pb-4">
          {files.map((file) => (
            <Card key={file.id} className="p-3">
              <div className="flex items-start gap-2">
                {getFileIcon(file.name)}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{file.name}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="secondary" className="text-xs">
                      {formatFileSize(file.size)}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {file.lastModified.toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeFile(file.id)}
                  className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
                >
                  <Trash size={12} />
                </Button>
              </div>
            </Card>
          ))}
          
          {files.length === 0 && (
            <div className="text-center py-8">
              <File size={32} className="mx-auto mb-2 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">No files uploaded</p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}