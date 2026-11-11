import { useNavigate, useParams, useSearchParams } from "react-router-dom";

import createPageContext from "@utils/functions/createPageContext";
import useEventDetailsData from "./eventData";
import useAuth from "@hooks/useAuth";

import type { EventDetailsTab } from "@pages/app/eventDetails/types";
import type { UseEventDetailsPageReturn } from "./types";

const validTabs: readonly EventDetailsTab[] = [
  "access",
  "screens",
  "guests",
  "challenges",
  "album",
  "team",
  "settings"
];

const isValidTab = (tab: string | null): tab is EventDetailsTab => {
  return tab !== null && (validTabs as readonly string[]).includes(tab);
};

const useEventDetailsPageState = (): UseEventDetailsPageReturn => {
  const { id = "" } = useParams();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { user } = useAuth();
  const eventData = useEventDetailsData(id);
  const { event, unlockPin } = eventData;

  const rawTab = searchParams.get("tab");
  const activeTab: EventDetailsTab = isValidTab(rawTab) ? rawTab : "access";

  const handleTabChange = (_: unknown, nextTab: EventDetailsTab) => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        if (nextTab === "access") {
          next.delete("tab");
        } else {
          next.set("tab", nextTab);
        }
        return next;
      },
      { replace: true }
    );
  };

  const openScreen = () => {
    if (event) navigate(`/e/${event.guestToken}/screen`);
  };

  return {
    ...eventData,
    user,
    currentUserId: user?.id ?? "",
    activeTab,
    handleTabChange,
    openScreen,
    handleBackToEvents: () => navigate("/app"),
    handleUnlockGuestLockouts: () => unlockPin("guest"),
    handleUnlockScreenLockouts: () => unlockPin("screen")
  };
};

const { PageProvider: EventDetailsPageProvider, usePage: useEventDetailsPage } = createPageContext(
  useEventDetailsPageState,
  "useEventDetailsPage"
);

export { EventDetailsPageProvider };
export default useEventDetailsPage;
