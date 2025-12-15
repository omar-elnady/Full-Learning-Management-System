import { useState, useEffect, useRef } from "react";
import {
  ChevronDown,
  FileText,
  CheckCircle,
  Trophy,
  PlayCircle,
  BrainCircuit,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useSidebar } from "@/components/ui/sidebar";
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
    setOpen(false);
  }, [setOpen]);

  if (isLoading) return <Loading />;
  if (!user) return <div className="p-4 text-zinc-400">Please sign in to view course progress.</div>;
  if (!course || !userProgress) return <div className="p-4 text-zinc-400">Error loading course content</div>;

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
    <div ref={sidebarRef} className="flex flex-col h-full bg-zinc-950 border-r border-zinc-800 w-80 flex-shrink-0">
      <div className="p-6 border-b border-zinc-800 bg-zinc-950/50 backdrop-blur-sm sticky top-0 z-10">
        <h2 className="text-xl font-bold text-zinc-100 tracking-tight leading-tight">{course.title}</h2>
        <div className="mt-2 flex items-center gap-2 text-xs text-zinc-500">
          <span className="bg-zinc-800 px-2 py-0.5 rounded text-zinc-300">{course.category || "Course"}</span>
          <span>•</span>
          <span>{course.sections.length} Sections</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar">
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
      </div>
    </div>
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
    <div className="border-b border-zinc-900 group">
      <button
        onClick={() => toggleSection(section.sectionTitle)}
        className={cn(
          "w-full flex items-center justify-between p-4 transition-all duration-200",
          isExpanded ? "bg-zinc-900/50" : "bg-transparent hover:bg-zinc-900/30"
        )}
      >
        <div className="flex flex-col items-start gap-1">
          <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
            Section {String(index + 1).padStart(2, '0')}
          </span>
          <h3 className={cn(
            "text-sm font-semibold text-left transition-colors",
            isExpanded ? "text-zinc-100" : "text-zinc-400 group-hover:text-zinc-200"
          )}>
            {section.sectionTitle}
          </h3>
        </div>
        <ChevronDown className={cn(
          "w-4 h-4 text-zinc-500 transition-transform duration-300",
          isExpanded && "rotate-180 text-zinc-300"
        )} />
      </button>

      <div className={cn(
        "grid transition-all duration-300 ease-in-out",
        isExpanded ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
      )}>
        <div className="overflow-hidden bg-zinc-900/30 border-t border-zinc-900">
          {/* Progress Bar Area */}
          <div className="px-5 py-4 border-b border-zinc-800/50 flex items-center gap-4">
            <div className="flex-1 flex gap-1 h-1.5 bg-zinc-800/50 rounded-full overflow-hidden">
              {section.chapters.map((chapter: any) => {
                const isCompleted = sectionProgress?.chapters.find(
                  (c: any) => c.chapterId === chapter.chapterId
                )?.completed;
                return (
                  <div
                    key={chapter.chapterId}
                    className={cn(
                      "h-full flex-1 transition-all duration-500",
                      isCompleted ? "bg-emerald-500" : "bg-transparent"
                    )}
                  />
                );
              })}
            </div>
            <div className="flex items-center gap-1.5 text-xs font-medium text-emerald-400 shrink-0 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
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
                courseId={courseId}
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
  courseId,
  handleChapterClick,
  updateChapterProgress,
}: {
  chapter: any;
  index: number;
  sectionId: string;
  sectionProgress: any;
  chapterId: string;
  courseId: string;
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
        "group flex items-center gap-3 px-5 py-3 cursor-pointer transition-all border-l-[3px] hover:bg-zinc-800/40",
        isCurrentChapter
          ? "bg-zinc-800/60 border-emerald-500"
          : "border-transparent"
      )}
    >
      <button
        onClick={handleToggleComplete}
        className={cn(
          "shrink-0 w-5 h-5 rounded-full border flex items-center justify-center transition-all focus:outline-none z-10 relative",
          isCompleted
            ? "bg-emerald-500 border-emerald-500 text-white shadow-sm shadow-emerald-500/20"
            : "border-zinc-700 text-transparent hover:border-zinc-500",
          "group/btn"
        )}
      >
        <CheckCircle className="w-3.5 h-3.5" />
      </button>

      <div className="flex-1 flex flex-col min-w-0 gap-0.5">
        <span
          className={cn(
            "text-sm font-medium transition-colors truncate",
            isCompleted ? "text-zinc-500 decoration-zinc-700" : "text-zinc-300",
            isCurrentChapter && "text-emerald-400 font-semibold"
          )}
        >
          {chapter.title}
        </span>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-zinc-600 font-mono">
            {String(index + 1).padStart(2, '0')}
          </span>
          {chapter.type && (
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-zinc-800/50 text-zinc-500 border border-zinc-800 flex items-center gap-1">
              {chapter.type}
            </span>
          )}
        </div>
      </div>

      <Icon className={cn(
        "w-4 h-4 shrink-0 transition-colors",
        isCurrentChapter ? "text-emerald-500" : "text-zinc-700 group-hover:text-zinc-500"
      )} />
    </li>
  );
};

export default ChaptersSidebar;
