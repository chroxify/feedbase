create type "public"."notification_types" as enum ('comment', 'post');

create table "public"."notifications" (
    "id" uuid not null default gen_random_uuid(),
    "project_id" uuid not null,
    "has_archived" uuid[],
    "created_at" timestamp with time zone not null default now(),
    "initiator_id" uuid not null,
    "type" notification_types not null,
    "feedback_id" uuid not null,
    "comment_id" uuid
);


alter table "public"."notifications" enable row level security;

CREATE UNIQUE INDEX notifications_pkey ON public.notifications USING btree (id);

alter table "public"."notifications" add constraint "notifications_pkey" PRIMARY KEY using index "notifications_pkey";

alter table "public"."notifications" add constraint "notifications_comment_id_fkey" FOREIGN KEY (comment_id) REFERENCES feedback_comments(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."notifications" validate constraint "notifications_comment_id_fkey";

alter table "public"."notifications" add constraint "notifications_feedback_id_fkey" FOREIGN KEY (feedback_id) REFERENCES feedback(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."notifications" validate constraint "notifications_feedback_id_fkey";

alter table "public"."notifications" add constraint "notifications_initiator_id_fkey" FOREIGN KEY (initiator_id) REFERENCES profiles(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."notifications" validate constraint "notifications_initiator_id_fkey";

alter table "public"."notifications" add constraint "notifications_project_id_fkey" FOREIGN KEY (project_id) REFERENCES projects(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."notifications" validate constraint "notifications_project_id_fkey";

create policy "Enable insert for authenticated users only"
on "public"."notifications"
as permissive
for insert
to authenticated
with check (true);


create policy "Enable read for authenticated users only"
on "public"."notifications"
as permissive
for select
to authenticated
using (true);


create policy "Enable update for authenticated users only"
on "public"."notifications"
as permissive
for update
to authenticated
using (true)
with check (true);

alter table "public"."project_configs" add column "logo_redirect_url" text;

alter table "public"."project_configs" add column "integration_slack_status" boolean not null default false;

alter table "public"."project_configs" add column "integration_slack_webhook" text;
