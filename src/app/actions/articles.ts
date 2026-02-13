'use server';

import { eq } from 'drizzle-orm';
import db from '@/db/index';
import { articles } from '@/db/schema';
import { authorizeUserToEditArticle, ensureUserExists } from '@/lib/db/utils';
import { stackServerApp } from '@/stack/server';

export type CreateArticleInput = {
  title: string;
  content: string;
  authorId: string;
  imageUrl?: string;
};

export type UpdateArticleInput = {
  title?: string;
  content?: string;
  imageUrl?: string;
};

export async function createArticle(data: CreateArticleInput) {
  const user = await stackServerApp.getUser();
  if (!user) {
    throw new Error('❌ Unauthorized');
  }

  await ensureUserExists(user);

  await db.insert(articles).values({
    title: data.title,
    content: data.content,
    slug: String(Date.now()),
    published: true,
    authorId: user.id,
  });

  return { success: true, message: 'Article create logged' };
}

export async function updateArticle(id: string, data: UpdateArticleInput) {
  const user = await stackServerApp.getUser();
  if (!user) {
    throw new Error('❌ Unauthorized');
  }

  if (!(await authorizeUserToEditArticle(user.id, +id))) {
    throw new Error('❌ Forbidden');
  }

  // TODO: Replace with actual database update
  console.log('📝 updateArticle called:', { id, ...data });

  await db
    .update(articles)
    .set({
      title: data.title,
      content: data.content,
    })
    .where(eq(articles.id, +id));

  return { success: true, message: `Article ${id} update logged` };
}

export async function deleteArticle(id: string) {
  const user = await stackServerApp.getUser();
  if (!user) {
    throw new Error('❌ Unauthorized');
  }

  console.log('🗑️ deleteArticle called:', id);

  if (!(await authorizeUserToEditArticle(user.id, +id))) {
    throw new Error('❌ Forbidden');
  }

  await db.delete(articles).where(eq(articles.id, +id));

  return { success: true, message: `Article ${id} delete logged (stub)` };
}
