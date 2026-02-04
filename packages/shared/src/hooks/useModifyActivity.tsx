import { useRef } from "react";

export default function useModifyActivity() {
  return {
    formikComponent: null,
    openMobileMapRef: useRef(null),
    openCreateActivityAlertRef: useRef(null),
    createdActivityId: null,
    createdActivityTitle: null,
  };
}
