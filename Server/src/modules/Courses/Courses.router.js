const { Router } = require("express");
const CourseController = require("./controller/courses");
const { requireAuth } = require("@clerk/express");
const { fileUplode, fileVaildation } = require("../../utils/multer.cloudinary");

const router = Router();

router.get("/listcourses", CourseController.listCourses);
router.post("/", requireAuth(), CourseController.createCourse);
router.put(
  "/:courseId",
  requireAuth(),
  fileUplode(fileVaildation.video).any(),
  CourseController.updateCourse
);
router.delete("/:courseId", requireAuth(), CourseController.deleteCourse);
router.get("/:courseId", CourseController.getCourse);

module.exports = router;
