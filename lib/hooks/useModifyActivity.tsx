import * as Yup from "yup";
import {
  ActivityEntity,
  ImageType,
  NewActivityEntity,
  UserProfile,
} from "../types";
import { JSX, RefObject, useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { mapActions } from "../store/mapSlice";
import { Formik } from "formik";
import { toast } from "sonner";
import CreateActivityForm from "@/components/create-activity/createActivityForm";
import useScreenSize from "./useScreenSize";
import { handleUploadFile, isFile } from "../functions/helperFunctions";
import {
  deleteActivityCategories,
  deleteImageFromStorage,
  getImageUrl,
  postNewActivity,
  postNewActivityCategories,
  updateActivtiy,
} from "../functions/supabaseFunctions";
import { useInvalidateActivities } from "./useActivities";

interface useModifyActivityProps {
  user: UserProfile | null;
  activityId?: string;
  latLng: google.maps.LatLngLiteral | null | undefined;
  initialValues: NewActivityEntity;
  isUpdatingActivity: boolean;
  enableMapFloating?: boolean;
  image?: ImageType;
}

const useModifyActivity: (props: useModifyActivityProps) => {
  formikComponent: JSX.Element;
  openMobileMapRef: RefObject<HTMLButtonElement | null>;
  openCreateActivityAlertRef: RefObject<HTMLButtonElement | null>;
  createdActivityId: string | null;
  createdActivityTitle: string | null;
} = ({
  user,
  activityId,
  latLng,
  initialValues,
  isUpdatingActivity = false,
  enableMapFloating = false,
  image,
}) => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [createdActivityId, setCreatedActivityId] = useState<string | null>(
    null,
  );
  const [createdActivityTitle, setCreatedActivityTitle] = useState<
    string | null
  >(null);
  const openMobileMapRef = useRef<HTMLButtonElement | null>(null);
  const openCreateActivityAlertRef = useRef<HTMLButtonElement | null>(null);
  const dispatch = useDispatch();
  const { isMobile } = useScreenSize();
  const { invalidateAll: invalidateAllActivities } = useInvalidateActivities();

  const validationSchema = Yup.object({
    title: Yup.string()
      .required("Title is required")
      .max(50, "Title is too long"),
    description: Yup.string()
      .required("Description is required")
      .max(300, "Description is too long"),
    date: Yup.date()
      .transform((value, originalValue) => {
        if (!originalValue) return value;
        return new Date(originalValue);
      })
      .typeError("Invalid date")
      .required("Date is required")
      .min(new Date().setHours(0, 0, 0, 0), "Date cannot be in the past"),

    time: Yup.string().required("Time is required"),
    location: Yup.string().required("Location is required"),
    categories: Yup.array()
      .min(1, "Category is required")
      .max(3, "Maximum 3 categories allowed"),
    googleLocation: Yup.object().required(),
  });

  const onOpenMobileMap = () => {
    if (openMobileMapRef) openMobileMapRef.current?.click();
  };

  const displayCreateActivityAlert = () => {
    if (openCreateActivityAlertRef) openCreateActivityAlertRef.current?.click();
  };

  const submitHandler = async (values: NewActivityEntity) => {
    let imageUrl = values.image;

    if (initialValues.image === values.image) {
      imageUrl = initialValues.image;
    } else {
      await deleteImageFromStorage(
        initialValues.image?.toString() || null,
        user?.id,
      );
      imageUrl = isFile(values.image)
        ? await handleUploadFile("activities", values.image, user!)
        : values.image;
    }

    const newActivity: NewActivityEntity = {
      user_id: user?.id,
      title: values.title,
      description: values.description,
      date: values.date,
      endDate: values.endDate,
      time: values.time,
      endTime: values.endTime || null,
      location: values.location,
      link: values.link || null,
      status: "active",
      targetAudience: values.targetAudience || null,
      maxAttendees: values.maxAttendees || null,
      image: imageUrl || null,
      googleLocation: values.googleLocation,
      likes: 0,
      dislikes: 0,
    };

    let activity;

    if (isUpdatingActivity) {
      activity = (await updateActivtiy(
        activityId!,
        newActivity,
      )) as ActivityEntity[];
    } else {
      activity = (await postNewActivity(newActivity)) as ActivityEntity[];
    }

    if (isUpdatingActivity) {
      if (
        JSON.stringify(initialValues.categories) ===
        JSON.stringify(values.categories)
      ) {
        // Even if categories didn't change, the core activity may have – keep caches fresh.
        invalidateAllActivities();
        return;
      } else {
        await deleteActivityCategories(activityId || "");
        await postNewActivityCategories(activityId!, values.categories!);
      }
    } else {
      await postNewActivityCategories(activity[0].id, values.categories!);
      // Store created activity info for follow-up UI (e.g., feed posting)
      setCreatedActivityId(activity[0].id);
      setCreatedActivityTitle(activity[0].title);
    }

    // Ensure all activities-based views (lists, map pins) see the latest data
    invalidateAllActivities();
  };

  useEffect(() => {
    if (image) {
      (async () => {
        const img = await getImageUrl(image);
        setImagePreview(img || "");
      })();
    }
  }, [image]);

  useEffect(() => {
    dispatch(mapActions.setIsFloatingEnabled(enableMapFloating));
  }, [enableMapFloating]);

  const formikComponent = (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={async (values, { setSubmitting, resetForm }) => {
        try {
          if (JSON.stringify(values) === JSON.stringify(initialValues)) {
            toast.info("You have not made any changes");
            return;
          }
          submitHandler(values);
          resetForm();
          setImagePreview(null);
          displayCreateActivityAlert();
        } catch (err) {
          console.error(err);
          toast.error(
            isUpdatingActivity
              ? "There was an error editing your activity"
              : "There was an error posting your activity",
          );
        } finally {
          setSubmitting(false);
        }
      }}
    >
      {(formik) => (
        <CreateActivityForm
          formik={formik}
          latLng={latLng || null}
          imagePreview={imagePreview}
          handleImagePreview={setImagePreview}
          handleOpenMobileMap={onOpenMobileMap}
          displayOpenMapButton={isUpdatingActivity ? true : isMobile}
        />
      )}
    </Formik>
  );

  return {
    formikComponent,
    openMobileMapRef,
    openCreateActivityAlertRef,
    createdActivityId,
    createdActivityTitle,
  };
};

export default useModifyActivity;
