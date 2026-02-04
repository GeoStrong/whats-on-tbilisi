import { AiOutlineClose } from "react-icons/ai";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "../ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import defaultUserImg from "@/public/images/default-user.png";
import { groupCommentsOneLevel } from "@/lib/functions/helperFunctions";
import ActivityCommentItem from "./activityCommentItem";
import useComments from "@/lib/hooks/useComments";
import { Input } from "../ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import Form from "next/form";
import { IoIosSend } from "react-icons/io";
import useOptimizedImage from "@/lib/hooks/useOptimizedImage";
import OptimizedImage from "../ui/optimizedImage";
import { ActivityEntity, UserProfile } from "@/lib/types";
import { fetchUserInfo } from "@/lib/profile/profile";
import ExpandableContainer from "../general/expandableContainer";

const snapPoints = [0.5, 1];

const ActivityComments: React.FC<{
  user: UserProfile | null;
  activity: ActivityEntity;
  customIcon?: React.ReactNode;
}> = ({ user, activity, customIcon }) => {
  const [open, setOpen] = useState(false);
  const [snap, setSnap] = useState<number | string | null>(snapPoints[0]);
  const [commentTextInput, setCommentTextInput] = useState<string>("");
  const [commentParentId, setCommentParentId] = useState<string | null>("");
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false);
  const [firstCommentUser, setFirstCommentUser] =
    useState<Partial<UserProfile> | null>(null);

  const { comments, addComment, editComment, removeComment, refresh } =
    useComments(activity.id || "");

  useEffect(() => {
    (async () => {
      if (!comments || comments.length === 0) return;
      const user = await fetchUserInfo(comments[0].user_id);
      setFirstCommentUser(user);
    })();
  }, [comments]);

  const { imageUrl: firstUserAvatarUrl } = useOptimizedImage(
    firstCommentUser?.avatar_path || "",
    {
      quality: 50,
      width: 18,
      height: 18,
      fallback: defaultUserImg.src,
    },
  );

  const { imageUrl: avatarUrl } = useOptimizedImage(user?.avatar_path || "", {
    quality: 50,
    width: 18,
    height: 18,
    fallback: defaultUserImg.src,
  });

  const groupedComments = groupCommentsOneLevel(comments || []);

  return (
    <>
      <div className="hidden items-center justify-center md:flex">
        <ExpandableContainer
          layoutId={`comments-${activity.id}`}
          containerTrigger={
            !customIcon && (
              <>
                <h3 className="mb-3 text-lg font-bold">
                  Comments
                  <span className="inline-block pl-3">{comments.length}</span>
                </h3>
                <div className="flex items-center gap-3">
                  {comments && comments.length > 0 ? (
                    <>
                      <div className="w-10">
                        <OptimizedImage
                          src={firstUserAvatarUrl}
                          width={20}
                          height={20}
                          containerClassName="h-8 w-8 rounded-full"
                          alt="profile"
                          priority={false}
                        />
                      </div>
                      <p className="text-sm font-extralight">
                        {(comments[0].text || "").slice(0, 40) + "..."}
                      </p>
                    </>
                  ) : (
                    <p className="text-sm font-extralight">No comments yet</p>
                  )}
                </div>
              </>
            )
          }
          openDialog={open}
          setOpenDialog={setOpen}
          customOpenIcon={customIcon}
        >
          <div className="h-[70dvh] w-[50vw]">
            <div className="absolute right-1/2 top-5 w-full translate-x-1/2 border-b bg-white dark:border-b-gray-500 dark:bg-gray-800">
              <div className="flex items-start justify-between px-5 shadow-md">
                <div className=""></div>
                <h3 className="mb-5 text-xl font-bold">Comments</h3>
                <button onClick={() => setOpen(false)} className="pt-2">
                  <AiOutlineClose />
                </button>
              </div>
            </div>
            <div className="mt-14 h-[88%] overflow-y-auto">
              {groupedComments.length === 0 && (
                <p className="text-center text-gray-500">
                  No comments yet. Be the first to comment!
                </p>
              )}
              {groupedComments.map(({ root, replies }) => (
                <div key={root.id} className="w-full">
                  <ActivityCommentItem
                    activityHostId={activity.user_id || ""}
                    comment={root}
                    onEdit={(id, text) => {
                      setEditingCommentId(id);
                      setCommentTextInput(text);
                    }}
                    onDelete={(id) => {
                      setDeleteTargetId(id);
                      setIsDeleteDialogOpen(true);
                    }}
                    onReplyTo={(id, username) => {
                      const prefix = username ? `@${username} ` : "@";
                      setCommentTextInput("");
                      setCommentTextInput((prev) =>
                        prev ? `${prev} ${prefix}` : prefix,
                      );
                      setCommentParentId(id);
                    }}
                  />

                  {replies.length > 0 && (
                    <div className="ml-12 mt-4 flex flex-col gap-3 pl-4">
                      {replies.map((reply) => (
                        <ActivityCommentItem
                          activityHostId={activity.user_id || ""}
                          key={reply.id}
                          comment={reply}
                          isReply
                          onEdit={(id, text) => {
                            setEditingCommentId(id);
                            setCommentTextInput(text);
                          }}
                          onDelete={(id) => {
                            setDeleteTargetId(id);
                            setIsDeleteDialogOpen(true);
                          }}
                          onReplyTo={(id, username) => {
                            const prefix = username ? `@${username} ` : "@";
                            setCommentTextInput((prev) =>
                              prev ? `${prev} ${prefix}` : prefix,
                            );
                            setCommentParentId(id);
                          }}
                        />
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="absolute bottom-0 right-1/2 flex h-20 w-full translate-x-1/2 items-center rounded-b-3xl border bg-white shadow-md dark:border-t-gray-500 dark:bg-gray-800">
              <div className="flex w-full items-center justify-between gap-5 px-10">
                <OptimizedImage
                  quality={50}
                  src={avatarUrl}
                  width={20}
                  height={20}
                  containerClassName="w-14 rounded-full"
                  className="h-12 w-12"
                  alt="profile"
                  priority={false}
                />
                <Form
                  action=""
                  className="relative flex w-full items-center justify-between gap-3"
                  onSubmit={async (e) => {
                    e.preventDefault();
                    if (!commentTextInput || !user?.id) return;
                    if (editingCommentId) {
                      await editComment(
                        editingCommentId,
                        user.id,
                        commentTextInput,
                      );
                      setEditingCommentId(null);
                    } else {
                      await addComment(
                        user.id,
                        commentTextInput,
                        commentParentId,
                      );
                    }
                    setCommentTextInput("");
                    setCommentParentId(null);
                    await refresh();
                  }}
                >
                  <Input
                    type="text"
                    value={commentTextInput}
                    onChange={(event) => {
                      setCommentTextInput(event.target.value);
                    }}
                    className="h-12 rounded-full border !text-lg dark:border-gray-500"
                  />
                  <AnimatePresence>
                    {commentTextInput !== "" && (
                      <motion.div
                        key="modal"
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0 }}
                        className="absolute right-2"
                      >
                        <button className="rounded-full bg-primary px-3 py-2">
                          <IoIosSend className="text-xl text-white" />
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Form>
              </div>
            </div>
          </div>
        </ExpandableContainer>
      </div>

      <div className="md:hidden">
        <Drawer
          snapPoints={snapPoints}
          activeSnapPoint={snap}
          setActiveSnapPoint={setSnap}
          fadeFromIndex={0}
        >
          <DrawerTrigger className="w-full">
            {customIcon ? (
              customIcon
            ) : (
              <div className="relative w-full rounded-xl bg-white px-3 py-4 shadow-md dark:bg-gray-800">
                <h3 className="mb-3 text-left font-bold">
                  Comments
                  <span className="inline-block pl-3">{comments.length}</span>
                </h3>
                <div className="flex items-center gap-3 rounded-md bg-gray-100 p-2 dark:bg-gray-700">
                  {comments && comments.length > 0 ? (
                    <>
                      <OptimizedImage
                        quality={50}
                        src={firstUserAvatarUrl}
                        width={20}
                        height={20}
                        containerClassName="h-8 w-8 rounded-full"
                        alt="profile"
                        priority={false}
                      />
                      <p className="text-sm font-extralight">
                        {(comments[0].text || "").slice(0, 40) + "..."}
                      </p>
                    </>
                  ) : (
                    <p className="text-sm font-extralight">No comments yet</p>
                  )}
                </div>
              </div>
            )}
          </DrawerTrigger>
          <DrawerContent className="w-full" headerChildren={"Comments"}>
            <div className="mb-20 h-dvh overflow-y-auto">
              <DrawerHeader>
                <DrawerTitle className="hidden">Comments</DrawerTitle>
                <DrawerDescription className="hidden">
                  Comments
                </DrawerDescription>
                {groupedComments.length === 0 && (
                  <p className="text-center text-gray-500">
                    No comments yet. Be the first to comment!
                  </p>
                )}
                {groupedComments.map(({ root, replies }) => (
                  <div key={root.id} className="mb-6">
                    <ActivityCommentItem
                      activityHostId={activity.user_id || ""}
                      comment={root}
                      onEdit={(id, text) => {
                        setEditingCommentId(id);
                        setCommentTextInput(text);
                      }}
                      onDelete={(id) => {
                        setDeleteTargetId(id);
                        setIsDeleteDialogOpen(true);
                      }}
                      onReplyTo={(id, username) => {
                        const prefix = username ? `@${username} ` : "@";
                        setCommentTextInput((prev) =>
                          prev ? `${prev} ${prefix}` : prefix,
                        );
                        setCommentParentId(id);
                      }}
                    />

                    {replies.length > 0 && (
                      <div className="ml-12 mt-4 flex flex-col gap-3 pl-4">
                        {replies.map((reply) => (
                          <ActivityCommentItem
                            activityHostId={activity.user_id || ""}
                            key={reply.id}
                            comment={reply}
                            isReply
                            onEdit={(id, text) => {
                              setEditingCommentId(id);
                              setCommentTextInput(text);
                            }}
                            onDelete={(id) => {
                              setDeleteTargetId(id);
                              setIsDeleteDialogOpen(true);
                            }}
                            onReplyTo={(id, username) => {
                              const prefix = username ? `@${username} ` : "@";
                              setCommentTextInput((prev) =>
                                prev ? `${prev} ${prefix}` : prefix,
                              );
                              setCommentParentId(id);
                            }}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </DrawerHeader>
              <DrawerFooter className="fixed bottom-0 flex w-full flex-row items-center justify-between gap-3 border border-t-gray-100 bg-white shadow-md dark:border-t-gray-600 dark:bg-gray-800">
                <OptimizedImage
                  quality={50}
                  src={avatarUrl}
                  width={20}
                  height={20}
                  containerClassName="h-12 w-12 rounded-full"
                  className="w-20"
                  alt="profile"
                  objectFit="cover"
                  priority={false}
                />
                <Form
                  action=""
                  className="relative flex w-[85%] items-center justify-between gap-3"
                  onSubmit={async (e) => {
                    e.preventDefault();
                    if (!commentTextInput || !user?.id) return;
                    if (editingCommentId) {
                      await editComment(
                        editingCommentId,
                        user.id,
                        commentTextInput,
                      );
                      setEditingCommentId(null);
                    } else {
                      await addComment(
                        user.id,
                        commentTextInput,
                        commentParentId,
                      );
                    }
                    setCommentTextInput("");
                    setCommentParentId(null);
                    await refresh();
                  }}
                >
                  <Input
                    type="text"
                    value={commentTextInput}
                    onChange={(event) => {
                      setCommentTextInput(event.target.value);
                    }}
                    className="h-12 rounded-full border pr-16 dark:border-gray-500"
                  />
                  <AnimatePresence>
                    {commentTextInput !== "" && (
                      <motion.div
                        key="modal"
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0 }}
                        className="absolute right-2"
                      >
                        <button className="rounded-full bg-primary px-3 py-2">
                          <IoIosSend className="text-xl text-white" />
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Form>
              </DrawerFooter>
            </div>
          </DrawerContent>
        </Drawer>
      </div>
      {/* Delete confirmation dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete comment</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this comment? This action cannot
              be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setIsDeleteDialogOpen(false);
                  setDeleteTargetId(null);
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={async () => {
                  if (!deleteTargetId || !user?.id) return;
                  await removeComment(deleteTargetId, user.id);
                  setIsDeleteDialogOpen(false);
                  setDeleteTargetId(null);
                  await refresh();
                }}
                className="bg-red-600"
              >
                Delete
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ActivityComments;
