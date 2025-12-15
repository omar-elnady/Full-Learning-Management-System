import { clerkClient } from "../../../clerk.js";

export const updateUser = async (req, res, next) => {
  const { userId } = req.params;
  const userData = req.body;
  try {
    const user = await clerkClient.users.updateUserMetadata(userId, {
      publicMetadata: {
        userType: userData.publicMetadata.userType,
        settings: userData.publicMetadata.settings,
      },
    });
    res.json({ message: "User Updated Successfully", data: user });
  } catch (error) {
    res.status(500).json({ message: "Error", error });
  }
};
