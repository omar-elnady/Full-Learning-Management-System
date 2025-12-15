import { useState, useEffect, useRef } from "react";
import {
  ChevronDown,
  FileText,
  CheckCircle,
  Trophy,
  PlayCircle,
  BrainCircuit,
  ArrowLeft,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import Loading from "@/components/Loading";
import { useCourseProgressData } from "@/hooks/useCourseProgressData";

const ChaptersSidebar = () => {
  const router = useRouter();
  const { setOpen } = useSidebar();
  const [expandedSections, setExpandedSections] = useState<string[]>([]);

  const {
    user,
    course,
    userProgress,
    chapterId,
    courseId,
    isLoading,
    updateChapterProgress,
  } = useCourseProgressData();

  const sidebarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setOpen(true);
  }, [setOpen]);

  if (isLoading) return <Loading />;
  if (!user) return <div className="p-4 text-muted-foreground">Please sign in to view course progress.</div>;
  if (!course || !userProgress) return <div className="p-4 text-muted-foreground">Error loading course content</div>;

  const toggleSection = (sectionTitle: string) => {
    setExpandedSections((prevSections) =>
      prevSections.includes(sectionTitle)
        ? prevSections.filter((title) => title !== sectionTitle)
        : [...prevSections, sectionTitle]
    );
  };

  const handleChapterClick = (sectionId: string, chapterId: string) => {
    router.push(`/dashboard/user/courses/${courseId}/chapters/${chapterId}`, {
      scroll: false,
    });
  };

  return (
    <Sidebar ref={sidebarRef} collapsible="offcanvas" className="border-r bg-sidebar">
      <SidebarHeader className="bg-sidebar border-b border-sidebar-border">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" onClick={() => router.push("/dashboard/user/courses")} className="hover:bg-sidebar-accent hover:text-sidebar-accent-foreground">
              <ArrowLeft className="w-5 h-5 mr-2" />
              <span className="font-medium">Back to Courses</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>

        <div className="px-4 py-4">
          <h2 className="text-xl font-bold text-sidebar-foreground tracking-tight leading-tight">{course.title}</h2>
          <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
            <span className="bg-sidebar-accent px-2 py-0.5 rounded text-sidebar-foreground border border-sidebar-border">{course.category || "Course"}</span>
            <span>•</span>
            <span>{course.sections.length} Sections</span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="bg-sidebar custom-scrollbar">
        {course.sections.map((section, index) => (
          <Section
            key={section.sectionId}
            section={section}
            index={index}
            sectionProgress={userProgress.sections.find(
              (s) => s.sectionId === section.sectionId
            )}
            chapterId={chapterId as string}
            courseId={courseId as string}
            expandedSections={expandedSections}
            toggleSection={toggleSection}
            handleChapterClick={handleChapterClick}
            updateChapterProgress={updateChapterProgress}
          />
        ))}
      </SidebarContent>
    </Sidebar>
  );
};

const Section = ({
  section,
  index,
  sectionProgress,
  chapterId,
  courseId,
  expandedSections,
  toggleSection,
  handleChapterClick,
  updateChapterProgress,
}: {
  section: any;
  index: number;
  sectionProgress: any;
  chapterId: string;
  courseId: string;
  expandedSections: string[];
  toggleSection: (sectionTitle: string) => void;
  handleChapterClick: (sectionId: string, chapterId: string) => void;
  updateChapterProgress: (
    sectionId: string,
    chapterId: string,
    completed: boolean
  ) => void;
}) => {
  const completedChapters =
    sectionProgress?.chapters.filter((c: any) => c.completed).length || 0;
  const totalChapters = section.chapters.length;
  const isExpanded = expandedSections.includes(section.sectionTitle);

  return (
    <div className="border-b border-sidebar-border group">
      <button
        onClick={() => toggleSection(section.sectionTitle)}
        className={cn(
          "w-full flex items-center justify-between p-4 transition-all duration-200 hover:bg-sidebar-accent/50",
          isExpanded ? "bg-sidebar-accent/50" : "bg-transparent"
        )}
      >
        <div className="flex flex-col items-start gap-1">
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
            Section {String(index + 1).padStart(2, '0')}
          </span>
          <h3 className={cn(
            "text-sm font-semibold text-left transition-colors",
            isExpanded ? "text-sidebar-foreground" : "text-muted-foreground group-hover:text-sidebar-foreground"
          )}>
            {section.sectionTitle}
          </h3>
        </div>
        <ChevronDown className={cn(
          "w-4 h-4 text-muted-foreground transition-transform duration-300",
          isExpanded && "rotate-180 text-sidebar-foreground"
        )} />
      </button>

      <div className={cn(
        "grid transition-all duration-300 ease-in-out",
        isExpanded ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
      )}>
        <div className="overflow-hidden border-t border-sidebar-border/50 bg-background/30">
          {/* Progress Bar Area */}
          <div className="px-5 py-4 border-b border-sidebar-border/50 flex items-center gap-4">
            <div className="flex-1 flex gap-1 h-1.5 bg-muted rounded-full overflow-hidden">
              {section.chapters.map((chapter: any) => {
                const isCompleted = sectionProgress?.chapters.find(
                  (c: any) => c.chapterId === chapter.chapterId
                )?.completed;
                return (
                  <div
                    key={chapter.chapterId}
                    className={cn(
                      "h-full flex-1 transition-all duration-500",
                      isCompleted ? "bg-primary" : "bg-transparent"
                    )}
                  />
                );
              })}
            </div>
            <div className="flex items-center gap-1.5 text-xs font-medium text-primary shrink-0 bg-primary/10 px-2 py-0.5 rounded-full border border-primary/20">
              <Trophy className="w-3 h-3" />
              <span>{Math.round((completedChapters / totalChapters) * 100)}%</span>
            </div>
          </div>

          {/* Chapters List */}
          <ul className="flex flex-col py-2">
            {section.chapters.map((chapter: any, idx: number) => (
              <Chapter
                key={chapter.chapterId}
                chapter={chapter}
                index={idx}
                sectionId={section.sectionId}
                sectionProgress={sectionProgress}
                chapterId={chapterId}
                handleChapterClick={handleChapterClick}
                updateChapterProgress={updateChapterProgress}
              />
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

const Chapter = ({
  chapter,
  index,
  sectionId,
  sectionProgress,
  chapterId,
  handleChapterClick,
  updateChapterProgress,
}: {
  chapter: any;
  index: number;
  sectionId: string;
  sectionProgress: any;
  chapterId: string;
  handleChapterClick: (sectionId: string, chapterId: string) => void;
  updateChapterProgress: (
    sectionId: string,
    chapterId: string,
    completed: boolean
  ) => void;
}) => {
  const chapterProgress = sectionProgress?.chapters.find(
    (c: any) => c.chapterId === chapter.chapterId
  );
  const isCompleted = chapterProgress?.completed;
  const isCurrentChapter = chapterId === chapter.chapterId;

  const handleToggleComplete = (e: React.MouseEvent) => {
    e.stopPropagation();
    updateChapterProgress(sectionId, chapter.chapterId, !isCompleted);
  };

  const Icon = chapter.type === "Video" ? PlayCircle : chapter.type === "Quiz" ? BrainCircuit : FileText;

  return (
    <li
      onClick={() => handleChapterClick(sectionId, chapter.chapterId)}
      className={cn(
        "group flex items-center gap-3 px-5 py-3 cursor-pointer transition-all border-l-[3px] hover:bg-sidebar-accent",
        isCurrentChapter
          ? "bg-sidebar-accent border-primary"
          : "border-transparent"
      )}
    >
      <button
        onClick={handleToggleComplete}
        className={cn(
          "shrink-0 w-5 h-5 rounded-full border flex items-center justify-center transition-all focus:outline-none z-10 relative",
          isCompleted
            ? "bg-primary border-primary text-primary-foreground shadow-sm"
            : "border-sidebar-foreground/40 text-transparent hover:border-sidebar-foreground/70",
          "group/btn"
        )}
      >
        <CheckCircle className="w-3.5 h-3.5" />
      </button>

      <div className="flex-1 flex flex-col min-w-0 gap-0.5">
        <span
          className={cn(
            "text-sm font-medium transition-colors truncate",
            isCompleted ? "text-muted-foreground decoration-sidebar-foreground/50" : "text-sidebar-foreground",
            isCurrentChapter && "text-primary font-semibold"
          )}
        >
          {chapter.title}
        </span>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-muted-foreground font-mono">
            {String(index + 1).padStart(2, '0')}
          </span>
          {chapter.type && (
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-sidebar-accent text-muted-foreground border border-sidebar-border flex items-center gap-1">
              {chapter.type}
            </span>
          )}
        </div>
      </div>

      <Icon className={cn(
        "w-4 h-4 shrink-0 transition-colors",
        isCurrentChapter ? "text-primary" : "text-muted-foreground group-hover:text-sidebar-foreground"
      )} />
    </li>
  );
};

export default ChaptersSidebar;
