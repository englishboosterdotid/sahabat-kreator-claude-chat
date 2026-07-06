import type { ReplizPlatform } from "../../domain/value-objects/repliz-platform.vo";

import type { BrandIcon } from "@/shared/presentation/icons";

import {
  FacebookIcon,
  InstagramIcon,
  LinkedInIcon,
  ThreadsIcon,
  TikTokIcon,
  XIcon,
  YoutubeIcon,
} from "@/shared/presentation/icons";

export type SocialPlatformRegistryItem = {
  label: string;
  icon: BrandIcon;

  theme: {
    color: string;
    gradient?: string;
  };
};

export const SOCIAL_PLATFORM_REGISTRY = {
  instagram: {
    label: "Instagram",
    icon: InstagramIcon,
    theme: {
      color: "#E4405F",
      gradient:
        "linear-gradient(45deg,#F58529,#DD2A7B,#8134AF,#515BD4)",
    },
  },

  facebook: {
    label: "Facebook",
    icon: FacebookIcon,
    theme: {
      color: "#1877F2",
    },
  },

  youtube: {
    label: "YouTube",
    icon: YoutubeIcon,
    theme: {
      color: "#FF0000",
    },
  },

  tiktok: {
    label: "TikTok",
    icon: TikTokIcon,
    theme: {
      color: "#000000",
    },
  },

  linkedin: {
    label: "LinkedIn",
    icon: LinkedInIcon,
    theme: {
      color: "#0A66C2",
    },
  },

  threads: {
    label: "Threads",
    icon: ThreadsIcon,
    theme: {
      color: "#000000",
    },
  },
} satisfies Record<ReplizPlatform, SocialPlatformRegistryItem>;