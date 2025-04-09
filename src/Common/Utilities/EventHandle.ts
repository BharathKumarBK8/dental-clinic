import { BUTTON_MODEL } from "../../Models/PageModel";
import { NavigateFunction } from "react-router-dom";
import { ComponentRefsMap } from "../Components/PageRenderer";
import { Toast } from "primereact/toast";
import { TOAST_SUMMARIES, SUCCESS_MESSAGES } from "./Constants";

export enum EVENT_TYPE {
  FORM_SAVE = "form_save",
  FORM_CLEAR = "form_clear",
  NAVIGATE = "navigate",
}

const handleEvents = async (
  item: BUTTON_MODEL,
  navigate: NavigateFunction,
  compRefs: React.MutableRefObject<ComponentRefsMap>,
  toast: React.RefObject<Toast> | null
): Promise<boolean> => {
  console.log("HandleEvents called with:", {
    buttonId: item.id,
    buttonPath: item.path,
  });

  for (const Key of Object.keys(compRefs.current)) {
    const compRef = compRefs.current[Key];

    if (compRef) {
      if (item.id === EVENT_TYPE.FORM_SAVE) {
        const success = await compRef.submitForm();
        if (success && item.path) {
          toast?.current?.show({
            severity: "success",
            summary: TOAST_SUMMARIES.SUCCESS,
            detail: SUCCESS_MESSAGES.FORM_SUBMITTED,
          });
          navigate(item.path);
        }
        return success;
      }
      if (item.id === EVENT_TYPE.FORM_CLEAR) {
        compRef.clearForm();
        return true;
      }
    }
  }
  if (item.id === EVENT_TYPE.NAVIGATE && item.path) {
    console.log(`Navigating to: ${item.path}`);
    navigate(item.path);
    return true;
  }

  return false;
};

export default handleEvents;
