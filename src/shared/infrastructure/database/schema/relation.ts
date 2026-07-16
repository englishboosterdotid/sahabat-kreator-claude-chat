import { relations } from "drizzle-orm";
import { brandVoice } from "./brand-voice-schema";
import { brandVoicePlatformOverride } from "./brand-voice-platform-override-schema";
import { aiProviderConfig } from "./ai-provider-config-schema";
import { aiTokenBalance } from "./ai-token-balance-schema";
import { aiUsageLog } from "./ai-usage-log-schema";
import { generatedContent } from "./content-generation-schema";
import { team, user, organization } from "./auth-schema";
import { workspaceMemberRole } from "./workspace-schema";
import { contentSchedule } from "./content-schedule-schema";
import { contentStatistic } from "./content-statistic-schema";
import { replizConnection } from "./repliz-connection-schema";
import { knowledgeEntry } from "./knowledge-base-schema";
import { workspaceMomentumPreference } from "./workspace-momentum-preference-schema";
import { aiTopUpInvoice } from "./ai-topup-invoice-schema";

export const workspaceMemberRoleRelations = relations(
  workspaceMemberRole,
  ({ one }) => ({
    team: one(team, {
      fields: [workspaceMemberRole.teamId],
      references: [team.id],
    }),
    user: one(user, {
      fields: [workspaceMemberRole.userId],
      references: [user.id],
    }),
  })
);

export const aiProviderConfigRelations = relations(aiProviderConfig, ({ one }) => ({
  team: one(team, {
    fields: [aiProviderConfig.workspaceId],
    references: [team.id],
  }),
}));

export const aiTokenBalanceRelations = relations(aiTokenBalance, ({ one }) => ({
  team: one(team, {
    fields: [aiTokenBalance.workspaceId],
    references: [team.id],
  }),
}));

export const aiUsageLogRelations = relations(aiUsageLog, ({ one }) => ({
  team: one(team, {
    fields: [aiUsageLog.workspaceId],
    references: [team.id],
  }),
}));

export const brandVoiceRelations = relations(brandVoice, ({ one, many }) => ({
  team: one(team, {
    fields: [brandVoice.workspaceId],
    references: [team.id],
  }),
  platformOverrides: many(brandVoicePlatformOverride),
}));

export const brandVoicePlatformOverrideRelations = relations(
  brandVoicePlatformOverride,
  ({ one }) => ({
    team: one(team, {
      fields: [brandVoicePlatformOverride.workspaceId],
      references: [team.id],
    }),
  })
);

export const generatedContentRelations = relations(generatedContent, ({ one, many }) => ({
  team: one(team, {
    fields: [generatedContent.workspaceId],
    references: [team.id],
  }),
  schedules: many(contentSchedule),
}));

export const contentScheduleRelations = relations(contentSchedule, ({ one, many }) => ({
    team: one(team, {
        fields: [contentSchedule.workspaceId],
        references: [team.id],
    }),
    generatedContent: one(generatedContent, {
        fields: [contentSchedule.generatedContentId],
        references: [generatedContent.id],
    }),
    connection: one(replizConnection, {
        fields: [contentSchedule.connectionId],
        references: [replizConnection.id],
    }),
    statistics: many(contentStatistic),
}));

export const contentStatisticRelations = relations(contentStatistic, ({ one }) => ({
    team: one(team, {
        fields: [contentStatistic.workspaceId],
        references: [team.id],
    }),
    schedule: one(contentSchedule, {
        fields: [contentStatistic.scheduleId],
        references: [contentSchedule.id],
    }),
}));

export const knowledgeEntryRelations = relations(knowledgeEntry, ({ one }) => ({
  team: one(team, {
    fields: [knowledgeEntry.workspaceId],
    references: [team.id],
  }),
}));

export const workspaceMomentumPreferenceRelations = relations(
  workspaceMomentumPreference,
  ({ one }) => ({
    team: one(team, {
      fields: [workspaceMomentumPreference.workspaceId],
      references: [team.id],
    }),
  })
);

export const replizConnectionRelations = relations(
  replizConnection,
  ({ one }) => ({
    organization: one(organization, {
      fields: [replizConnection.organizationId],
      references: [organization.id],
    }),
    team: one(team, {
      fields: [replizConnection.teamId],
      references: [team.id],
    }),
    connectedByUser: one(user, {
      fields: [replizConnection.connectedByUserId],
      references: [user.id],
    }),
  })
);

export const aiTopUpInvoiceRelations = relations(aiTopUpInvoice, ({ one }) => ({
  team: one(team, {
    fields: [aiTopUpInvoice.workspaceId],
    references: [team.id],
  }),
  requester: one(user, {
    fields: [aiTopUpInvoice.requestedByUserId],
    references: [user.id],
  }),
}));