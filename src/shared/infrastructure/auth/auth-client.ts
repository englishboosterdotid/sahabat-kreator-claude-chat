import { createAuthClient } from "better-auth/react";
import { organizationClient, adminClient, inferOrgAdditionalFields } from "better-auth/client/plugins";
import type { auth } from "./auth"; // import type saja, aman untuk bundle client

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_APP_URL,
  plugins: [
    organizationClient({
      teams: { enabled: true },
      schema: inferOrgAdditionalFields<typeof auth>(),
    }),
    adminClient(),
  ],
});

export const {
  signIn,
  signUp,
  signOut,
  useSession,
  organization,
  useListOrganizations,
  useActiveOrganization,
} = authClient;