import { NextResponse } from 'next/server';
import { getProjectConfigBySlug, updateProjectConfigBySlug } from '@/lib/api/projects';

/*
  GET /api/v1/projects/:slug/config/domain
*/
export async function GET(req: Request, context: { params: { slug: string } }) {
  // Get project
  const { data, error } = await getProjectConfigBySlug(context.params.slug, 'route');

  // If any errors thrown, return error
  if (error) {
    return NextResponse.json({ error: error.message }, { status: error.status });
  }

  const [configResponse, domainResponse] = await Promise.all([
    fetch(
      `https://api.vercel.com/v6/domains/${data.custom_domain}/config${
        process.env.VERCEL_TEAM_ID ? `?teamId=${process.env.VERCEL_TEAM_ID}` : ''
      }`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${process.env.VERCEL_AUTH_TOKEN}`,
          'Content-Type': 'application/json',
        },
      }
    ),
    fetch(
      `https://api.vercel.com/v9/projects/${process.env.VERCEL_PROJECT_ID}/domains/${data.custom_domain}${
        process.env.VERCEL_TEAM_ID ? `?teamId=${process.env.VERCEL_TEAM_ID}` : ''
      }`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${process.env.VERCEL_AUTH_TOKEN}`,
          'Content-Type': 'application/json',
        },
      }
    ),
  ]);

  // Parse responses
  const [configData, domainData] = await Promise.all([configResponse.json(), domainResponse.json()]);

  // If error, return error
  if (domainResponse.status !== 200) {
    return NextResponse.json(
      { error: domainData.error.message },
      {
        status:
          domainData.error.code === 'forbidden' ? 403 : domainData.error.code === 'domain_taken' ? 409 : 400,
      }
    );
  }

  // If domain is not verified, try to verify it
  if (!domainData.verified && !configData.misconfigured) {
    const verifyResponse = await fetch(
      `https://api.vercel.com/v9/projects/${process.env.VERCEL_PROJECT_ID}/domains/${
        data.custom_domain
      }/verify${process.env.VERCEL_TEAM_ID ? `?teamId=${process.env.VERCEL_TEAM_ID}` : ''}`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.VERCEL_AUTH_TOKEN}`,
          'Content-Type': 'application/json',
        },
      }
    );

    // Parse response
    const verifyData = await verifyResponse.json();

    // If error, return error
    if (verifyResponse.status !== 200) {
      return NextResponse.json(
        { error: verifyData.error.message },
        {
          status:
            verifyData.error.code === 'forbidden'
              ? 403
              : verifyData.error.code === 'domain_taken'
              ? 409
              : verifyData.error.code === 'verification_failed'
              ? 400
              : 400,
        }
      );
    }
  }

  // If verification failed, return configData
  if (domainData && !domainData.verified) {
    return NextResponse.json(
      {
        verified: false,
        domain: domainData,
        config: configData,
      },
      { status: 200 }
    );
  }

  // If verification succeeded, update project config
  if (domainData?.verified && !configData.misconfigured) {
    const { error: updateError } = await updateProjectConfigBySlug(
      context.params.slug,
      { custom_domain_verified: true },
      'route'
    );

    // If any errors thrown, return error
    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: updateError.status });
    }
  }

  // Return response
  return NextResponse.json(
    {
      verified: true,
      domain: domainData,
      config: configData,
    },
    { status: 200 }
  );
}

/*
  POST /api/v1/projects/:slug/config/domain
  {
    "name": "example.com"
  }
*/
export async function POST(req: Request, context: { params: { slug: string } }) {
  const { name } = await req.json();

  if (!name) {
    return NextResponse.json({ error: 'Name is required' }, { status: 400 });
  }

  // Get project config
  const { data: projectConfig, error: projectConfigError } = await getProjectConfigBySlug(
    context.params.slug,
    'route'
  );

  // If any errors thrown, return error
  if (projectConfigError) {
    return NextResponse.json({ error: projectConfigError.message }, { status: projectConfigError.status });
  }

  // If project already has a domain, return error
  if (projectConfig.custom_domain) {
    return NextResponse.json({ error: 'Project already has a custom domain' }, { status: 409 });
  }

  const response = await fetch(
    `https://api.vercel.com/v9/projects/${process.env.VERCEL_PROJECT_ID}/domains${
      process.env.VERCEL_TEAM_ID ? `?teamId=${process.env.VERCEL_TEAM_ID}` : ''
    }`,
    {
      body: `{\n  "name": "${name}"\n}`,
      headers: {
        Authorization: `Bearer ${process.env.VERCEL_AUTH_TOKEN}`,
        'Content-Type': 'application/json',
      },
      method: 'POST',
    }
  );

  // Parse response
  const responseData = await response.json();

  // If error, return error
  if (responseData.error) {
    return NextResponse.json(
      { error: responseData.error.message },
      {
        status:
          responseData.error.code === 'forbidden'
            ? 403
            : responseData.error.code === 'domain_taken'
            ? 409
            : 400,
      }
    );
  }

  // Update project config
  const { error } = await updateProjectConfigBySlug(
    context.params.slug,
    { custom_domain: responseData.name, custom_domain_verified: false },
    'route'
  );

  // If any errors thrown, return error
  if (error) {
    return NextResponse.json({ error: error.message }, { status: error.status });
  }

  // Return response
  return NextResponse.json(responseData, { status: 200 });
}

/*
  DELETE /api/v1/projects/:slug/config/domain
*/
export async function DELETE(req: Request, context: { params: { slug: string } }) {
  // Get project
  const { data, error } = await getProjectConfigBySlug(context.params.slug, 'route');

  // If any errors thrown, return error
  if (error) {
    return NextResponse.json({ error: error.message }, { status: error.status });
  }

  // If no domain, return error
  if (!data?.custom_domain) {
    return NextResponse.json({ error: 'Project does not have a custom domain' }, { status: 400 });
  }

  // Delete domain from Vercel
  const response = await fetch(
    `https://api.vercel.com/v9/projects/${process.env.VERCEL_PROJECT_ID}/domains/${data?.custom_domain}${
      process.env.VERCEL_TEAM_ID ? `?teamId=${process.env.VERCEL_TEAM_ID}` : ''
    }`,
    {
      headers: {
        Authorization: `Bearer ${process.env.VERCEL_AUTH_TOKEN}`,
      },
      method: 'DELETE',
    }
  );

  // Parse response
  const responseData = await response.json();

  // If error, return error
  if (responseData.error) {
    return NextResponse.json({ error: responseData.error.message }, { status: 400 });
  }

  // Update project config
  const { data: updatedProjectConfig, error: updatedProjectConfigError } = await updateProjectConfigBySlug(
    context.params.slug,
    { custom_domain: null, custom_domain_verified: null },
    'route'
  );

  // If any errors thrown, return error
  if (updatedProjectConfigError) {
    return NextResponse.json(
      { error: updatedProjectConfigError.message },
      { status: updatedProjectConfigError.status }
    );
  }

  // Return response
  return NextResponse.json(updatedProjectConfig, { status: 200 });
}
