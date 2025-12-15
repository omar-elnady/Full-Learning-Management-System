import { Router } from "express";
import * as userCoursesProgressController from "./controller/userCoursesProgress.js";
const router = Router();

router.get(
  "/:userId/enrolled-courses",
  userCoursesProgressController.getUserEnrolledCourses
);
router.get(
  "/:userId/courses/:courseId",
  userCoursesProgressController.getUserCourseProgress
);
router.put(
  "/:userId/courses/:courseId",
  userCoursesProgressController.updateUserCourseProgress
);

export default router;
