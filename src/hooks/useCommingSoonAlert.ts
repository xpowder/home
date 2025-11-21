import { toast } from "sonner";

export default function useComingSoonAlert() {
  const showComingSoon = () => {
    toast.info("🚀 Coming Soon!", {
      description: "This feature is under development.",
      action: {
        label: "Ok",
        onClick: () => toast.dismiss(),
      },
    });
  };

  return showComingSoon;
}
