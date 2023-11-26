INSERT INTO storage.buckets (id, name, public, avif_autodetection)
VALUES('changelog-images', 'changelog-images', TRUE, FALSE);

INSERT INTO storage.buckets (id, name, public, avif_autodetection)
VALUES('projects', 'projects', TRUE, FALSE);

INSERT INTO storage.buckets (id, name, public, avif_autodetection)
VALUES('avatars', 'avatars', TRUE, FALSE);

create policy "Anyone can insert 1oj01fe_0"
on "storage"."objects"
as permissive
for insert
to public
with check ((bucket_id = 'avatars'::text));


create policy "Anyone can select 1oj01fe_0"
on "storage"."objects"
as permissive
for select
to public
using ((bucket_id = 'avatars'::text));


create policy "Only authenticated users can insert 1lcb7wx_0"
on "storage"."objects"
as permissive
for insert
to authenticated
with check ((bucket_id = 'changelog-images'::text));


create policy "Only authenticated users can select and insert 1iiiika_0"
on "storage"."objects"
as permissive
for insert
to authenticated
with check ((bucket_id = 'projects'::text));


create policy "Only authenticated users can select and insert 1iiiika_1"
on "storage"."objects"
as permissive
for select
to authenticated
using ((bucket_id = 'projects'::text));