const path = require("path");

const updateCourseVideoInfo = (course, sectionId, chapterId, videoUrl) => {
  const section = course.sections?.find((s) => s.sectionId === sectionId);
  if (!section) {
    throw new Error(`Section not found: ${sectionId}`);
  }

  const chapter = section.chapters?.find((c) => c.chapterId === chapterId);
  if (!chapter) {
    throw new Error(`Chapter not found: ${chapterId}`);
  }

  chapter.video = videoUrl;
  chapter.type = "Video";
};

const validateUploadedFiles = (files) => {
  const allowedExtensions = [".mp4", ".m3u8", ".mpd", ".ts", ".m4s"];
  for (const file of files) {
    const ext = path.extname(file.originalname).toLowerCase();
    if (!allowedExtensions.includes(ext)) {
      throw new Error(`Unsupported file type: ${ext}`);
    }
  }
};

const getContentType = (filename) => {
  const ext = path.extname(filename).toLowerCase();
  switch (ext) {
    case ".mp4":
      return "video/mp4";
    case ".m3u8":
      return "application/vnd.apple.mpegurl";
    case ".mpd":
      return "application/dash+xml";
    case ".ts":
      return "video/MP2T";
    case ".m4s":
      return "video/iso.segment";
    default:
      return "application/octet-stream";
  }
};

// Preserved HLS/DASH upload logic for future use
const handleAdvancedVideoUpload = async (s3, files, uniqueId, bucketName) => {
  const isHLSOrDASH = files.some(
    (file) =>
      file.originalname.endsWith(".m3u8") || file.originalname.endsWith(".mpd")
  );

  if (isHLSOrDASH) {
    // Handle HLS/MPEG-DASH Upload
    const uploadPromises = files.map((file) => {
      const s3Key = `videos/${uniqueId}/${file.originalname}`;
      return s3
        .upload({
          Bucket: bucketName,
          Key: s3Key,
          Body: file.buffer,
          ContentType: getContentType(file.originalname),
        })
        .promise();
    });
    await Promise.all(uploadPromises);

    // Determine manifest file URL
    const manifestFile = files.find(
      (file) =>
        file.originalname.endsWith(".m3u8") ||
        file.originalname.endsWith(".mpd")
    );
    const manifestFileName = manifestFile?.originalname || "";
    const videoType = manifestFileName.endsWith(".m3u8") ? "hls" : "dash";

    return {
      videoUrl: `${process.env.CLOUDFRONT_DOMAIN}/videos/${uniqueId}/${manifestFileName}`,
      videoType,
    };
  }

  return null; // Return null if not HLS/DASH to handle regular upload
};

const mergeSections = (existingSections, newSections) => {
  const existingSectionsMap = new Map();
  for (const existingSection of existingSections) {
    existingSectionsMap.set(existingSection.sectionId, existingSection);
  }

  for (const newSection of newSections) {
    const section = existingSectionsMap.get(newSection.sectionId);
    if (!section) {
      // Add new section
      existingSectionsMap.set(newSection.sectionId, newSection);
    } else {
      // Merge chapters within the existing section
      section.chapters = mergeChapters(section.chapters, newSection.chapters);
      existingSectionsMap.set(newSection.sectionId, section);
    }
  }

  return Array.from(existingSectionsMap.values());
};

const mergeChapters = (existingChapters, newChapters) => {
  const existingChaptersMap = new Map();
  for (const existingChapter of existingChapters) {
    existingChaptersMap.set(existingChapter.chapterId, existingChapter);
  }

  for (const newChapter of newChapters) {
    existingChaptersMap.set(newChapter.chapterId, {
      ...(existingChaptersMap.get(newChapter.chapterId) || {}),
      ...newChapter,
    });
  }

  return Array.from(existingChaptersMap.values());
};

const calculateOverallProgress = (sections) => {
  const totalChapters = sections.reduce(
    (acc, section) => acc + section.chapters.length,
    0
  );

  const completedChapters = sections.reduce(
    (acc, section) =>
      acc + section.chapters.filter((chapter) => chapter.completed).length,
    0
  );

  return totalChapters > 0 ? (completedChapters / totalChapters) * 100 : 0;
};

module.exports = {
  updateCourseVideoInfo,
  validateUploadedFiles,
  getContentType,
  handleAdvancedVideoUpload,
  mergeSections,
  mergeChapters,
  calculateOverallProgress,
};
