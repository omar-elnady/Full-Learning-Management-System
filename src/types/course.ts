export interface VideoData {
    secure_url: string;
    public_id: string;
  }
  
  export interface Comment {
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
    comments: Comment[];
    freePreview?: boolean;
  }
  
  export interface Section {
    sectionId: string;
    sectionTitle: string;
    sectionDescription?: string;
    chapters: Chapter[];
  }