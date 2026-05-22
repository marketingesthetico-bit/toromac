import ArticleDetail from '../../components/marketing/ArticleDetail';

// Shared component reads useParams().slug and resolves the article
// based on the active language (useLang).
export default function ArticleDetailEn() {
  return <ArticleDetail />;
}
