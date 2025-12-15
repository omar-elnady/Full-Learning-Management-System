const { Router } = require("express");
const userCoursesProgressController = require("./controller/userCoursesProgress");
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

module.exports = router;
