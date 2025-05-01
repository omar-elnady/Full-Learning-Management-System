export interface VideoData {
    secure_url: string;
    public_id: string;
  }
  
  export interface CourseComment {
    commentId: string;
    userId: string;
    text: string;
    timestamp: string;
  }
  
  export interface Chapter {
    chapterId: string;
    type: "Text" | "Quiz" | "Video";
    title: string;
    content: string;
    video?: VideoData | File;
    comments: CourseComment[];
    freePreview?: boolean;
  }
  
  export interface Section {
    sectionId: string;
    sectionTitle: string;
    sectionDescription?: string;
    chapters: Chapter[];
  }