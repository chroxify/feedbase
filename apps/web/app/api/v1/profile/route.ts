import { NextResponse } from 'next/server';
import { updateUserProfile } from '@/lib/api/user';

/* 
    Update Profile
    PATCH /api/v1/profile
    {
        "full_name": string,
        "avatar_url": string,
    }
*/
export async function PATCH(req: Request) {
  const { full_name: fullName, avatar_url: avatarUrl } = await req.json();

  // Validate Request Body
  if (!fullName && !avatarUrl) {
    return NextResponse.json({ error: 'full_name or avatar_url is required.' }, { status: 400 });
  }

  // Update Profile
  const { data: profile, error } = await updateUserProfile('route', {
    full_name: fullName,
    avatar_url: avatarUrl,
  });

  // Check for errors
  if (error) {
    return NextResponse.json({ error: error.message }, { status: error.status });
  }

  return NextResponse.json(profile, { status: 200 });
}
