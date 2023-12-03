export class AuthError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AuthError';
  }
}

export async function _request(
  url: string,
  method: 'GET' | 'POST' | 'PATCH' | 'DELETE',
  token?: string,
  body?: any
) {
  let res: Response;

  try {
    res = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      ...(body ? { body: JSON.stringify(body) } : {}),
    });
  } catch (err) {
    console.error(err);

    // fetch failed, likely due to a network or CORS error
    throw new Error(`Unable to ${method} ${url}: ${err}`);
  }

  try {
    const data = await res.json();
    return { data, status: res.status };
  } catch (err) {
    console.error(err);

    // fetch failed, likely due to a network or CORS error
    throw new Error(`Unable to ${method} ${url}: ${err}`);
  }
}
