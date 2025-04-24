import { Router } from "express";
import * as CourseController from "./controller/courses";
import { requireAuth } from "@clerk/express";
import { fileUplode, fileVaildation } from "../../utils/multer.cloudinary";

const router = Router();


router.get("/listcourses", CourseController.listCourses);
router.post("/", requireAuth(), CourseController.createCourse);
router.put(
  "/:courseId",
  requireAuth(),
  fileUplode(fileVaildation.video).array('videos', 5),
  CourseController.updateCourse
);
router.delete("/:courseId", requireAuth(), CourseController.deleteCourse);
router.get("/:courseId", CourseController.getCourse);
router.post("/:courseId/sections/:sectionsId/chapters/:chapterId/get-upload-url")
export default router;
