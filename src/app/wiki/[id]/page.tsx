import { notFound } from 'next/navigation';
import WikiArticleViewer from '@/components/common/wiki-article-viewer';
import { getArticleById } from '@/lib/data/articles';

interface ViewArticlePageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ViewArticlePage({
  params,
}: ViewArticlePageProps) {
  const { id } = await params;

  const article = await getArticleById(+id);

  if (!article) {
    return notFound();
  }

  const canEdit = true; // Set to true for demonstration

  return <WikiArticleViewer article={article} canEdit={canEdit} />;
}
