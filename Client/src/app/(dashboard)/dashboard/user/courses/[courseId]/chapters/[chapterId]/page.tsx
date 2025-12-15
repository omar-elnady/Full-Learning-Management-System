"use client";

import { VideoData } from "@/types/course";

import { useRef } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import ReactPlayer from "react-player";
import Loading from "@/components/Loading";
import { useCourseProgressData } from "@/hooks/useCourseProgressData";
import { FileText, Trophy } from "lucide-react";

const Course = () => {
  const {
    user,
    course,
    userProgress,
    currentSection,
    currentChapter,
    isLoading,
    isChapterCompleted,
    updateChapterProgress,
    hasMarkedComplete,
    setHasMarkedComplete,
  } = useCourseProgressData();

  const playerRef = useRef<any>(null);

  const handleProgress = ({ played }: { played: number }) => {
    if (
      played >= 0.8 &&
      !hasMarkedComplete &&
      currentChapter &&
      currentSection &&
      userProgress?.sections &&
      !isChapterCompleted()
    ) {
      setHasMarkedComplete(true);
      updateChapterProgress(
        currentSection.sectionId,
        currentChapter.chapterId,
        true
      );
    }
  };

  if (isLoading) return <Loading />;
  if (!user) return <div className="p-6">Please sign in to view this course.</div>;
  if (!course || !userProgress) return <div className="p-6">Error loading course</div>;

  return (
    <div className="flex flex-col min-h-screen bg-background w-full">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        {/* Header Breadcrumbs */}
        <div className="mb-6 space-y-1">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>{course.title}</span>
            <span>/</span>
            <span>{currentSection?.sectionTitle}</span>
            <span>/</span>
            <span className="text-foreground font-medium">{currentChapter?.title}</span>
          </div>
          <h2 className="text-3xl font-bold tracking-tight">{currentChapter?.title}</h2>
        </div>

        {/* Main Content Area */}
        <Card className="mb-8 overflow-hidden border-zinc-200 dark:border-zinc-800 bg-zinc-900/50 shadow-sm">
          <CardContent className="p-0 aspect-video w-full flex items-center justify-center bg-black/40">
            {currentChapter?.type === "Video" && currentChapter.video ? (
              <ReactPlayer
                ref={playerRef}
                url={
                  typeof currentChapter.video === "string"
                    ? currentChapter.video
                    : (currentChapter.video as VideoData)?.secure_url
                }
                controls
                width="100%"
                height="100%"
                onProgress={handleProgress}
                config={{
                  file: {
                    attributes: {
                      controlsList: "nodownload",
                    },
                  },
                }}
              />
            ) : currentChapter?.type === "Text" ? (
              <div className="flex flex-col items-center justify-center p-12 text-center space-y-4">
                <div className="w-16 h-16 bg-zinc-800 rounded-full flex items-center justify-center">
                  <FileText className="w-8 h-8 text-zinc-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-zinc-200">Text Content</h3>
                  <p className="text-zinc-500 max-w-sm">This chapter is a text lesson. Please read the notes below to complete functionality.</p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center p-12 text-center space-y-4">
                <div className="w-16 h-16 bg-zinc-800 rounded-full flex items-center justify-center">
                  <Trophy className="w-8 h-8 text-yellow-500" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-zinc-200">Quiz Chapter</h3>
                  <p className="text-zinc-500 max-w-sm">This is a quiz. Completion logic to be implemented.</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Content Tabs & Details */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
          {/* Tabs Section */}
          <div className="xl:col-span-2 space-y-6">
            <Tabs defaultValue="Notes" className="w-full">
              <TabsList className="grid w-full grid-cols-3 bg-zinc-100 dark:bg-zinc-800/50 rounded-lg p-1">
                <TabsTrigger value="Notes" className="rounded-md data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-700">Notes</TabsTrigger>
                <TabsTrigger value="Resources" className="rounded-md data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-700">Resources</TabsTrigger>
                <TabsTrigger value="Quiz" className="rounded-md data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-700">Quiz</TabsTrigger>
              </TabsList>

              <TabsContent value="Notes" className="mt-6 focus-visible:outline-none">
                <Card className="border-none shadow-none bg-transparent">
                  <CardHeader className="p-0 mb-4">
                    <CardTitle className="text-xl">Lecture Notes</CardTitle>
                  </CardHeader>
                  <CardContent className="p-0 text-muted-foreground leading-relaxed">
                    {currentChapter?.content || "No notes available for this chapter."}
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="Resources" className="mt-6 focus-visible:outline-none">
                <div className="p-4 border border-dashed rounded-lg text-center text-muted-foreground text-sm">
                  No additional resources attached.
                </div>
              </TabsContent>
              <TabsContent value="Quiz" className="mt-6 focus-visible:outline-none">
                <div className="p-4 border border-dashed rounded-lg text-center text-muted-foreground text-sm">
                  Quiz not available.
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Instructor Sidebar */}
          <div className="xl:col-span-1">
            <Card className="border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/30">
              <CardHeader className="flex flex-row items-center gap-4 pb-4">
                <Avatar className="w-12 h-12 border border-zinc-200 dark:border-zinc-700">
                  <AvatarImage src="#" alt={course.teacherName} />
                  <AvatarFallback className="bg-primary/10 text-primary font-bold">
                    {course.teacherName[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <CardTitle className="text-lg">{course.teacherName}</CardTitle>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Instructor</p>
                </div>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                <p className="leading-relaxed">
                  A seasoned instructor with deep expertise in the subject matter.
                  Dedicated to providing high-quality educational content and ensuring student success.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Course;
