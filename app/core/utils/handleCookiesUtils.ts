/*==============================================================================
 * File: setCookies.ts
 * Author: [Your Name]
 * Date: [Date]
 * 
 * Description:
 * -------------------------------------------------------------------------------
 * Utility functions for managing HTTP cookies in a Next.js server environment.
 * Provides functions to set, get, and delete cookies using the `next/headers` API.
 *
 * Exports:
 * 1. setCookie    - Sets a cookie with optional expiration, httpOnly, and secure flags.
 * 2. getCookie    - Retrieves the value of a cookie by name.
 * 3. deleteCookie - Deletes a cookie by name.
==============================================================================*/

"use server";

import { cookies } from "next/headers";

type CookieOptions = {
  name: string;
  value: string;
  expiresInDays?: number;
  httpOnly?: boolean;
  secure?: boolean;
};


//*======================================================================================

export const setCookie = async ({
  name,
  value,
  expiresInDays = 90,
  httpOnly = true,
  secure = true,
}: CookieOptions) => {
  const cookieStore = await cookies();
  cookieStore.set(name, value, {
    expires: new Date(Date.now() + expiresInDays * 24 * 60 * 60 * 1000),
    httpOnly,
    secure,
  });
};


//*======================================================================================

export const getCookie = async (name: string) => {
  const cookieStore = await cookies();
  const cookie = cookieStore.get(name);
  return cookie?.value || null;
};


//*======================================================================================

export const deleteCookie = async (name: string) => {
  const cookieStore = await cookies();
  cookieStore.delete(name);
};
